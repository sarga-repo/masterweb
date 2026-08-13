import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/i18n/locale-link";
import { EditorialHeading } from "@/components/sections/editorial-heading";
import { InteriorHero } from "@/components/sections/interior-hero";
import { ArrowRightIcon, LinkedInIcon } from "@/components/ui/icons";
import { careerDisciplines } from "@/lib/careers/disciplines";
import { createMetadata } from "@/lib/seo/metadata";
import { getJobVacancies } from "@/lib/strapi/jobs";
import { getRequestLocale } from "@/lib/i18n/request";
import { getGatewaySitePageByPath } from "@/lib/strapi/site-pages";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return createMetadata({
    title: "Careers",
    description:
      "Explore open roles and build the next generation of sport and entertainment with Sarga.",
    path: "/careers",
    locale,
    isFallback: locale === "id",
  });
}

export default async function CareersPage() {
  const locale = await getRequestLocale();
  const jobs = await getJobVacancies(locale);
  const page = await getGatewaySitePageByPath("/careers", locale);
  const disciplines = page?.sections.find((section) => section.sectionKey === "career-disciplines");
  const openJobs = jobs.filter((job) => job.vacancyStatus === "open");

  return (
    <>
      <InteriorHero
        index="05"
         eyebrow={page?.navigationLabel ?? "Join the network"}
         title={page?.heroTitle ?? "Build what the crowd remembers."}
         description={page?.heroDescription ?? "Sarga brings together operators, creators, engineers, and sporting specialists who want to shape experiences at national scale."}
        image={{
          url: "/assets/media/sarga-motorsport-concept.png",
          alt: "Motorsport team environment at a modern racing circuit",
        }}
        meta={[
          "Cross-disciplinary teams",
          "Indonesia",
          "Performance culture",
          `${openJobs.length} open ${openJobs.length === 1 ? "role" : "roles"}`,
        ]}
        tone="slate"
      />

      <section className="gateway-warm-panel py-20 sm:py-28 lg:py-36">
        <div className="site-container">
          <EditorialHeading
            index="01"
             eyebrow={disciplines?.eyebrow ?? "Where you can move"}
             title={disciplines?.title ?? "Many disciplines. One standard."}
             description={disciplines?.body ?? "Choose a discipline to see its current opportunity roster, then review each role before continuing to its approved LinkedIn application."}
          />
          <ol className="mt-16 grid border-l border-t border-sarga-black/20 sm:grid-cols-2">
            {careerDisciplines.map((discipline) => {
              const count = openJobs.filter(
                (job) => job.discipline === discipline.id,
              ).length;
              return (
                <li key={discipline.id} className="min-w-0">
                  <Link
                    href={`/careers/jobs?discipline=${discipline.id}`}
                    className="group flex min-h-[20rem] flex-col border-b border-r border-sarga-black/20 p-7 transition-colors hover:bg-white/45 focus-visible:bg-white/45 sm:p-10"
                  >
                    <div className="flex items-start justify-between gap-6">
                      <span className="font-heading text-2xl font-bold text-sarga-red">
                        {discipline.index}
                      </span>
                      <span className="border border-sarga-black/20 px-3 py-2 text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-sarga-text-muted">
                        {count} open
                      </span>
                    </div>
                    <div className="mt-auto pt-16">
                      <h2 className="gateway-card-title font-heading uppercase">
                        {discipline.label}
                      </h2>
                      <p className="mt-6 max-w-md text-sm leading-7 text-sarga-text-muted">
                        {discipline.description}
                      </p>
                      <span className="mt-7 inline-flex items-center gap-3 text-[0.65rem] font-extrabold uppercase tracking-[0.15em] text-sarga-red">
                        View opportunities
                        <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section
        id="open-roster"
        className="gateway-surface-accent-signature gateway-surface-accent-signature--left bg-sarga-red py-20 text-white sm:py-28 lg:py-36"
      >
        <div className="site-container grid min-w-0 gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <div>
            <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-white/60">
              Current opportunity roster
            </p>
            <h2 className="gateway-display-page mt-5 max-w-[12ch] font-heading uppercase">
              {openJobs.length
                ? `${openJobs.length} roles. Find your place.`
                : "No open roles right now."}
            </h2>
          </div>
          <div>
            <p className="border-l border-white/35 pl-6 text-base leading-8 text-white/78">
              {openJobs.length
                ? "Search the live roster by discipline, employment type, work mode, or keyword. Every apply action continues to an approved LinkedIn vacancy."
                : "The CMS-managed roster is currently empty. New roles will appear here only after the recruitment team publishes an approved vacancy and LinkedIn destination."}
            </p>
            <Link
              href="/careers/jobs"
              className="group mt-9 inline-flex items-center gap-4 border-b border-white pb-2 text-xs font-extrabold uppercase tracking-[0.16em]"
            >
              <LinkedInIcon className="h-4 w-4" />
              Browse job vacancies
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
