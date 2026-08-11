import Image from "next/image";
import { LocaleLink as Link } from "@/components/i18n/locale-link";
import { ComingSoonPage } from "@/components/sections/coming-soon-page";
import { EditorialHeading } from "@/components/sections/editorial-heading";
import { InteriorHero } from "@/components/sections/interior-hero";
import { ArrowRightIcon } from "@/components/ui/icons";
import { isSitePageLive } from "@/lib/strapi/site-pages";
import type {
  CorporateReport,
  CorporateReportType,
  SitePage,
} from "@/lib/strapi/types";

const reportLabels: Record<CorporateReportType, string> = {
  annual: "Annual reporting",
  sustainability: "Sustainability reporting",
};

function ReportCard({ report }: { report: CorporateReport }) {
  const destination = report.file?.url ?? report.externalUrl;
  const isAvailable = Boolean(
    destination && report.publicationStatus !== "forthcoming",
  );

  return (
    <article className="grid min-h-full overflow-hidden border border-sarga-text/15 bg-[#fbf8f3] sm:grid-cols-[0.72fr_1.28fr]">
      <div className="relative min-h-64 overflow-hidden bg-sarga-soft sm:min-h-full">
        {report.coverImage ? (
          <Image
            src={report.coverImage.url}
            alt={report.coverImage.alt}
            fill
            sizes="(max-width: 640px) 100vw, 34vw"
            className="object-cover"
          />
        ) : (
          <span className="absolute inset-0 bg-[radial-gradient(circle_at_76%_18%,rgba(217,164,65,.34),transparent_30%),linear-gradient(145deg,#34445c,#bd2818_135%)]" />
        )}
        <span className="absolute bottom-5 left-5 font-heading text-5xl font-extrabold text-white/80">
          {report.year}
        </span>
      </div>
      <div className="flex flex-col p-7 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-[0.6rem] font-extrabold uppercase tracking-[0.15em] text-sarga-red-dark">
            {reportLabels[report.reportType]}
          </span>
          <span className="border border-sarga-text/20 px-3 py-1.5 text-[0.58rem] font-bold uppercase tracking-[0.13em] text-sarga-text-muted">
            {report.publicationStatus}
          </span>
        </div>
        <h2 className="gateway-card-title mt-7 font-heading uppercase">
          {report.title}
        </h2>
        {report.summary ? (
          <p className="mt-5 text-sm leading-7 text-sarga-text-muted">
            {report.summary}
          </p>
        ) : null}
        <div className="mt-auto pt-10">
          {isAvailable && destination ? (
            <a
              href={destination}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-4 border-b border-sarga-text pb-2 text-[0.65rem] font-extrabold uppercase tracking-[0.14em]"
            >
              Open approved report
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          ) : (
            <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-sarga-text-muted">
              Publication destination pending approval
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

export function CorporateReportIndex({
  page,
  reports,
  reportType,
  index,
}: {
  page: SitePage;
  reports: CorporateReport[];
  reportType: CorporateReportType;
  index: string;
}) {
  if (!isSitePageLive(page)) {
    return (
      <ComingSoonPage
        name={page.title}
        description={
          page.heroDescription ?? "This report library is being prepared."
        }
        availability={page.pageAvailability}
        backHref="/about"
        backLabel="Back to About"
      />
    );
  }

  const section = page.sections[0];
  const sibling =
    reportType === "annual"
      ? {
          href: "/about/sustainability-report",
          label: "Sustainability reports",
        }
      : { href: "/about/annual-report", label: "Annual reports" };

  return (
    <>
      <InteriorHero
        index={index}
        eyebrow={page.navigationLabel ?? reportLabels[reportType]}
        title={page.heroTitle ?? page.title}
        description={page.heroDescription ?? "Sarga.co corporate reporting."}
        image={page.heroMedia}
        tone={reportType === "annual" ? "slate" : "red"}
        meta={[
          reportLabels[reportType],
          "CMS managed",
          "Approved destinations only",
          "Corporate record",
        ]}
      />

      <section className="gateway-warm-panel py-20 sm:py-28 lg:py-36">
        <div className="site-container">
          <EditorialHeading
            index="02"
            eyebrow={section?.eyebrow ?? reportLabels[reportType]}
            title={section?.title ?? "Approved publications"}
            description={
              section?.body ??
              "Approved report files and external destinations are managed through Sarga CMS."
            }
          />

          {reports.length > 0 ? (
            <div className="mt-16 grid gap-6 lg:mt-20 lg:grid-cols-2">
              {reports.map((report) => (
                <ReportCard key={report.slug} report={report} />
              ))}
            </div>
          ) : (
            <div className="mt-16 grid overflow-hidden border border-sarga-text/15 bg-[#fbf8f3] lg:grid-cols-[0.72fr_1.28fr]">
              <div className="gateway-corporate-root min-h-64 min-w-0 p-8 text-white sm:p-10">
                <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-white/62">
                  Publication desk
                </p>
                <strong className="mt-16 block font-heading text-5xl font-extrabold uppercase leading-[0.9] tracking-[-0.04em]">
                  Record pending.
                </strong>
              </div>
              <div className="flex min-w-0 flex-col justify-center p-8 sm:p-10 lg:p-14">
                <h2 className="gateway-card-title max-w-[17ch] font-heading uppercase">
                  No approved report is published yet.
                </h2>
                <p className="mt-6 max-w-2xl text-base leading-8 text-sarga-text-muted">
                  Editors can add a year, summary, cover, publication status,
                  and either an approved file or external URL in Sarga CMS. This
                  page intentionally does not expose placeholder downloads.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="gateway-corporate-root py-16 text-white sm:py-20">
        <div className="site-container flex min-w-0 flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-white/62">
              Complete the record
            </p>
            <h2 className="gateway-section-title mt-4 max-w-[15ch] font-heading uppercase">
              Performance and responsibility belong together.
            </h2>
          </div>
          <Link
            href={sibling.href}
            className="group inline-flex min-h-14 min-w-[15rem] items-center justify-between gap-8 bg-white px-6 text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-sarga-text"
          >
            {sibling.label}
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  );
}
