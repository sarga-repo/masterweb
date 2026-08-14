import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/i18n/locale-link";
import { AboutTabs } from "@/components/sections/about-tabs";
import { EditorialHeading } from "@/components/sections/editorial-heading";
import { InteriorHero } from "@/components/sections/interior-hero";
import { ArrowRightIcon } from "@/components/ui/icons";
import { homepage } from "@/lib/mock-data";
import { getTimelineItems, getLeadershipPeople } from "@/lib/strapi/about";
import { getGatewaySitePageByPath } from "@/lib/strapi/site-pages";
import { buildAboutTabs } from "@/lib/about-tabs";
import { createMetadata } from "@/lib/seo/metadata";
import { getRequestLocale } from "@/lib/i18n/request";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return createMetadata({
    title: "About",
    description:
      "The corporate root, governance model, history, and reporting framework behind Sarga Group.",
    path: "/about",
    locale,
    isFallback: locale === "id",
  });
}

const principles = [
  [
    "01",
    "Integrated by design",
    "Every venture shares governance, audience intelligence, and operating standards.",
  ],
  [
    "02",
    "Built for performance",
    "Sporting credibility and world-class execution guide every commercial decision.",
  ],
  [
    "03",
    "Indonesian at heart",
    "A national platform designed to connect local talent with international opportunity.",
  ],
] as const;

export default async function AboutPage() {
  const locale = await getRequestLocale();
  const [timelineItems, leadershipPeople, reportPages] = await Promise.all([
    getTimelineItems(locale),
    getLeadershipPeople(locale),
    Promise.all([
      getGatewaySitePageByPath("/about/annual-report", locale),
      getGatewaySitePageByPath("/about/sustainability-report", locale),
    ]),
  ]);
  const page = await getGatewaySitePageByPath("/about", locale);
  const philosophy = page?.sections.find(
    (section) => section.sectionKey === "operating-philosophy",
  );
  const record = page?.sections.find(
    (section) => section.sectionKey === "corporate-record",
  );

  const tabs = buildAboutTabs(
    timelineItems,
    leadershipPeople,
    reportPages.filter((page) => page !== null),
  );
  return (
    <>
      <InteriorHero
        index="01"
        eyebrow={page?.navigationLabel ?? "The corporate root"}
        title={page?.heroTitle ?? "One group. Every arena."}
        description={page?.heroDescription ?? homepage.aboutSummaryBody}
        meta={[
          "Holding governance",
          "Indonesia",
          "Established 2023",
          "Four connected pillars",
        ]}
        image={{
          url: "/assets/media/sarga-cinematic-hero-concept.png",
          alt: "Horse sport and motorsport moving through one integrated Sarga landscape",
        }}
        tone="slate"
      />

      <section className="gateway-warm-panel py-20 sm:py-28 lg:py-36">
        <div className="site-container relative z-10">
          <EditorialHeading
            index="02"
            eyebrow={philosophy?.eyebrow ?? "Operating philosophy"}
            title={
              philosophy?.title ?? "Control at the core. Freedom at the edge."
            }
            description={
              philosophy?.body ??
              "Sarga gives every property room to build its own culture while a shared corporate center protects quality, accountability, and long-term value."
            }
          />
          <ol className="mt-16 border-t border-sarga-black/20">
            {principles.map(([index, title, description]) => (
              <li
                key={index}
                className="grid gap-5 border-b border-sarga-black/20 py-8 sm:grid-cols-[5rem_0.8fr_1.2fr] sm:items-start lg:py-10"
              >
                <span className="font-heading text-2xl font-bold text-sarga-red">
                  {index}
                </span>
                <h3 className="font-heading text-2xl font-bold uppercase leading-none tracking-[-0.035em] sm:text-3xl">
                  {title}
                </h3>
                <p className="max-w-xl text-sm leading-7 text-sarga-text-muted sm:justify-self-end sm:text-base">
                  {description}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-16 grid gap-px bg-sarga-black/20 lg:grid-cols-2">
            {homepage.aboutHighlights.map((highlight, index) => (
              <Link
                key={highlight.href}
                href={highlight.href}
                className="group flex min-h-72 flex-col justify-between bg-[#fbf8f3] p-8 transition-colors duration-300 hover:bg-sarga-soft hover:text-white focus-visible:bg-sarga-soft focus-visible:text-white focus-visible:outline-none sm:p-10"
              >
                <div className="flex items-center justify-between">
                  <span className="font-heading text-3xl font-bold text-sarga-red">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <ArrowRightIcon className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-2" />
                </div>
                <div className="mt-16">
                  <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-sarga-red">
                    {highlight.label}
                  </p>
                  <h3 className="mt-3 font-heading text-3xl font-bold uppercase leading-[1.02] tracking-[-0.03em]">
                    {highlight.title}
                  </h3>
                  <p className="mt-5 max-w-xl text-sm leading-7 opacity-60">
                    {highlight.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="gateway-surface-light-signature gateway-surface-light-signature--left bg-sarga-light py-20 sm:py-28 lg:py-36">
        <div className="site-container">
          <EditorialHeading
            index="03"
            eyebrow={record?.eyebrow ?? "Corporate record"}
            title={
              record?.title ?? "Built in public. Governed for the long run."
            }
            description={
              record?.body ??
              "Explore Sarga's formation, leadership publication status, and future corporate reports through one living record."
            }
          />
          <div className="mt-16 border-t border-sarga-black pt-8">
            <AboutTabs tabs={tabs} />
          </div>
          <nav
            aria-label="Corporate records"
            className="mt-14 grid gap-px bg-sarga-black/20 sm:grid-cols-3"
          >
            {[
              ["History", "/about/history"],
              ["Annual Report", "/about/annual-report"],
              ["Sustainability Report", "/about/sustainability-report"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="group flex min-h-28 items-end justify-between gap-4 bg-sarga-light p-6 text-xs font-extrabold uppercase tracking-[0.14em] transition-colors hover:bg-sarga-black hover:text-white"
              >
                {label}
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <section className="gateway-corporate-root py-16 text-white sm:py-20">
        <div className="site-container grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-white/62">
              Begin a group conversation
            </p>
            <h2 className="gateway-section-title mt-4 max-w-[15ch] font-heading uppercase">
              Understand the structure. Then find the right desk.
            </h2>
          </div>
          <Link
            href="/contact"
            className="group inline-flex min-h-14 min-w-[14rem] items-center justify-between gap-8 bg-white px-6 text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-sarga-text"
          >
            Get in touch
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  );
}
