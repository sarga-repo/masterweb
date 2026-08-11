import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/i18n/locale-link";
import { notFound } from "next/navigation";
import { SafeRichText } from "@/components/content/safe-rich-text";
import { InteriorHero } from "@/components/sections/interior-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { ArrowRightIcon, LinkedInIcon } from "@/components/ui/icons";
import { disciplineLabel } from "@/lib/careers/disciplines";
import { createMetadata, siteUrl } from "@/lib/seo/metadata";
import { getJobVacancies, getJobVacancyBySlug } from "@/lib/strapi/jobs";
import { getRequestLocale } from "@/lib/i18n/request";

type JobDetailPageProps = { params: Promise<{ slug: string }> };

function label(value: string): string {
  return value.replaceAll("-", " ");
}

function dateLabel(value: string): string {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export async function generateStaticParams() {
  const jobs = await getJobVacancies("en");
  return jobs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: JobDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const job = await getJobVacancyBySlug(slug, locale);
  return createMetadata({
    title: job ? `${job.title} | Careers` : "Vacancy not found",
    description: job?.summary ?? "Sarga careers vacancy.",
    path: `/careers/jobs/${slug}`,
    seo: job?.seo,
    locale,
    isFallback: job?.localization?.isFallback ?? locale === "id",
  });
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const job = await getJobVacancyBySlug(slug, locale);
  if (!job) notFound();

  const isOpen = job.vacancyStatus === "open";

  return (
    <>
      {isOpen ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "JobPosting",
            title: job.title,
            description: job.summary,
            inLanguage: locale === "id" ? "id-ID" : "en-US",
            datePosted: job.postedDate,
            validThrough: job.closingDate,
            employmentType: job.employmentType.toUpperCase().replace("-", "_"),
            hiringOrganization: {
              "@type": "Organization",
              name: "Sarga",
              sameAs: siteUrl,
            },
            jobLocationType:
              job.workMode === "remote" ? "TELECOMMUTE" : undefined,
            jobLocation:
              job.workMode === "remote"
                ? undefined
                : {
                    "@type": "Place",
                    address: {
                      "@type": "PostalAddress",
                      addressLocality: job.location,
                      addressCountry: "ID",
                    },
                  },
            url: `${siteUrl}/careers/jobs/${job.slug}`,
          }}
        />
      ) : null}
      <InteriorHero
        index="Role"
        eyebrow={disciplineLabel(job.discipline)}
        title={job.title}
        description={job.summary}
        meta={[
          job.location,
          label(job.employmentType),
          label(job.workMode),
          job.vacancyStatus,
        ]}
        tone={isOpen ? "slate" : "red"}
      />

      <article className="gateway-warm-panel py-20 sm:py-28 lg:py-36">
        <div className="site-container grid gap-12 lg:grid-cols-[0.55fr_1.45fr] lg:gap-20">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <dl className="border-t border-sarga-black/25 text-sm">
              {[
                ["Discipline", disciplineLabel(job.discipline)],
                ["Location", job.location],
                ["Employment", label(job.employmentType)],
                ["Work mode", label(job.workMode)],
                ["Seniority", job.seniority],
                ["Posted", dateLabel(job.postedDate)],
                [
                  "Closes",
                  job.closingDate ? dateLabel(job.closingDate) : undefined,
                ],
              ].map(([term, value]) =>
                value ? (
                  <div
                    key={term}
                    className="grid grid-cols-[0.8fr_1.2fr] gap-4 border-b border-sarga-black/15 py-4"
                  >
                    <dt className="text-[0.62rem] font-extrabold uppercase tracking-[0.13em] text-sarga-text/45">
                      {term}
                    </dt>
                    <dd className="font-semibold capitalize">{value}</dd>
                  </div>
                ) : null,
              )}
            </dl>
            {isOpen && job.applicationUrl ? (
              <a
                href={job.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 flex items-center justify-between gap-5 bg-[#0a66c2] px-6 py-5 text-xs font-extrabold uppercase tracking-[0.15em] text-white"
              >
                <span className="inline-flex items-center gap-3">
                  <LinkedInIcon className="h-5 w-5" />
                  Apply on LinkedIn
                </span>
                <ArrowRightIcon className="h-4 w-4" />
              </a>
            ) : (
              <p className="mt-7 border border-sarga-black/20 px-5 py-4 text-sm leading-6 text-sarga-text-muted">
                {isOpen
                  ? "The recruitment team has not attached an approved LinkedIn application link yet."
                  : "Applications for this role are closed."}
              </p>
            )}
          </aside>

          <div className="min-w-0 max-w-3xl">
            <section>
              <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.16em] text-sarga-red">
                The opportunity
              </p>
              <h2 className="gateway-section-title mt-5 font-heading uppercase">
                The role in context.
              </h2>
              <SafeRichText
                content={job.description}
                className="mt-8 space-y-6 text-base leading-8 text-sarga-text-muted sm:text-lg sm:leading-9"
              />
            </section>

            {job.responsibilities ? (
              <section className="mt-14 border-t border-sarga-black/20 pt-12">
                <h2 className="gateway-card-title font-heading uppercase">
                  Responsibilities
                </h2>
                <SafeRichText
                  content={job.responsibilities}
                  className="mt-7 space-y-6 text-base leading-8 text-sarga-text-muted"
                />
              </section>
            ) : null}

            {job.requirements ? (
              <section className="mt-14 border-t border-sarga-black/20 pt-12">
                <h2 className="gateway-card-title font-heading uppercase">
                  What you bring
                </h2>
                <SafeRichText
                  content={job.requirements}
                  className="mt-7 space-y-6 text-base leading-8 text-sarga-text-muted"
                />
              </section>
            ) : null}

            <Link
              href={`/careers/jobs?discipline=${job.discipline}`}
              className="group mt-14 inline-flex items-center gap-4 border-b border-sarga-black pb-2 text-xs font-extrabold uppercase tracking-[0.16em]"
            >
              Back to {disciplineLabel(job.discipline)} roles
              <ArrowRightIcon className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
