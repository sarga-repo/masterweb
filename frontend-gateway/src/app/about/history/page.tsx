import type { Metadata } from "next";
import Image from "next/image";
import { LocaleLink as Link } from "@/components/i18n/locale-link";
import { notFound } from "next/navigation";
import { ComingSoonPage } from "@/components/sections/coming-soon-page";
import { EditorialHeading } from "@/components/sections/editorial-heading";
import { InteriorHero } from "@/components/sections/interior-hero";
import { ArrowRightIcon } from "@/components/ui/icons";
import { getTimelineItems } from "@/lib/strapi/about";
import {
  createSitePageMetadata,
  getGatewaySitePageByPath,
  isSitePageLive,
} from "@/lib/strapi/site-pages";

const routePath = "/about/history";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getGatewaySitePageByPath(routePath);
  return page
    ? createSitePageMetadata(page)
    : { title: "History not found", robots: { index: false, follow: false } };
}

export default async function HistoryPage() {
  const [page, milestones] = await Promise.all([
    getGatewaySitePageByPath(routePath),
    getTimelineItems(),
  ]);
  if (!page) notFound();

  if (!isSitePageLive(page)) {
    return (
      <ComingSoonPage
        name={page.title}
        description={
          page.heroDescription ?? "The Sarga record is being prepared."
        }
        availability={page.pageAvailability}
        backHref="/about"
        backLabel="Back to About"
      />
    );
  }

  return (
    <>
      <InteriorHero
        index="01"
        eyebrow={page.navigationLabel ?? "Corporate history"}
        title={page.heroTitle ?? page.title}
        description={page.heroDescription ?? "Sarga's corporate record."}
        image={page.heroMedia}
        tone="slate"
        meta={[
          "Chronological record",
          "CMS managed",
          `${milestones.length} published milestones`,
          "Indonesia",
        ]}
      />

      <section className="gateway-warm-panel relative isolate overflow-hidden py-20 sm:py-28 lg:py-36">
        <div className="site-container relative z-10">
          <EditorialHeading
            index="02"
            eyebrow={page.sections[0]?.eyebrow ?? "Corporate record"}
            title={page.sections[0]?.title ?? "The group trajectory"}
            description={
              page.sections[0]?.body ??
              "Published milestones are managed through the shared corporate timeline."
            }
          />

          {milestones.length > 0 ? (
            <ol className="mt-16 border-t border-sarga-text/20 lg:mt-20">
              {milestones.map((milestone, index) => (
                <li
                  key={`${milestone.year}-${milestone.title}`}
                  className="grid gap-6 border-b border-sarga-text/20 py-9 sm:grid-cols-[7rem_10rem_1fr] sm:items-center lg:grid-cols-[9rem_15rem_1fr_auto] lg:gap-10 lg:py-12"
                >
                  <div>
                    <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.17em] text-sarga-red-dark">
                      {String(index + 1).padStart(2, "0")} / {milestone.label}
                    </span>
                    <strong className="mt-3 block font-heading text-4xl font-extrabold tracking-[-0.04em] text-sarga-text sm:text-5xl">
                      {milestone.year}
                    </strong>
                  </div>
                  <div className="relative aspect-[4/3] overflow-hidden bg-sarga-soft">
                    {milestone.image ? (
                      <Image
                        src={milestone.image.url}
                        alt={milestone.image.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, 240px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="absolute inset-0 bg-[linear-gradient(135deg,#e4301c,#ff5032_45%,#34445c)]" />
                    )}
                  </div>
                  <div>
                    <h2 className="gateway-card-title max-w-[22ch] font-heading uppercase">
                      {milestone.title}
                    </h2>
                    <p className="mt-5 max-w-3xl text-sm leading-7 text-sarga-text-muted sm:text-base">
                      {milestone.description}
                    </p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="hidden font-heading text-5xl font-extrabold text-sarga-red/18 lg:block"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-16 border-l-2 border-sarga-red py-5 pl-7 text-base leading-7 text-sarga-text-muted">
              Approved timeline entries will appear when they are published in
              Sarga CMS.
            </p>
          )}
        </div>
      </section>

      <section className="gateway-corporate-root py-16 text-white sm:py-20">
        <div className="site-container grid min-w-0 gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="min-w-0">
            <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-white/62">
              Continue the record
            </p>
            <h2 className="gateway-section-title mt-4 max-w-[15ch] font-heading uppercase">
              History becomes accountability.
            </h2>
          </div>
          <nav
            className="flex flex-col gap-4 sm:flex-row"
            aria-label="Corporate records"
          >
            <Link
              href="/about/board-of-directors"
              className="group inline-flex min-h-14 items-center justify-between gap-8 border border-white/35 px-6 text-[0.68rem] font-extrabold uppercase tracking-[0.14em]"
            >
              Leadership
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/about/annual-report"
              className="group inline-flex min-h-14 items-center justify-between gap-8 bg-white px-6 text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-sarga-text"
            >
              Reports
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </nav>
        </div>
      </section>
    </>
  );
}
