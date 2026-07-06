import type { Metadata } from "next";
import Link from "next/link";
import { AboutTabs } from "@/components/sections/about-tabs";
import { EditorialHeading } from "@/components/sections/editorial-heading";
import { InteriorHero } from "@/components/sections/interior-hero";
import { ArrowRightIcon } from "@/components/ui/icons";
import { aboutTabs, homepage } from "@/lib/mock-data";
import { getTimelineItems, getLeadershipPeople } from "@/lib/strapi/about";
import { createMetadata } from "@/lib/seo/metadata";
import type { AboutTab, AboutTabItem } from "@/lib/mock-data";
import type { TimelineItem, LeadershipPerson } from "@/lib/strapi/types";

export const metadata: Metadata = createMetadata({
  title: "About",
  description:
    "The corporate root, governance model, history, and reporting framework behind Sarga Group.",
  path: "/about",
});

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

/** Merge CMS timeline items into the history tab, keeping mock as fallback. */
function buildTabs(
  timelineItems: TimelineItem[],
  leadershipPeople: LeadershipPerson[],
): AboutTab[] {
  // Use CMS timeline items if available, otherwise fall back to mock
  const historyTab = aboutTabs.find((t) => t.id === "history");
  const historyItems: AboutTabItem[] =
    timelineItems.length > 0
      ? timelineItems.map((item) => ({
          meta: `${item.year} — ${item.label}`,
          title: item.title,
          description: item.description,
          image: item.image,
        }))
      : (historyTab?.items ?? []);

  // Build leadership tab from CMS data, fall back to mock
  const leadershipTab = aboutTabs.find((t) => t.id === "leadership");
  const leadershipItems: AboutTabItem[] =
    leadershipPeople.length > 0
      ? leadershipPeople.map((person) => ({
          meta: person.role,
          title: person.name,
          description: person.biography ?? `Member of the ${person.group === "board" ? "Board of Directors" : "Executive Council"}.`,
          image: person.portrait,
        }))
      : (leadershipTab?.items ?? []);

  return [
    {
      id: "history",
      label: "History Timeline",
      items: historyItems,
      emptyMessage: historyTab?.emptyMessage,
    },
    {
      id: "leadership",
      label: "Leadership Council",
      items: leadershipItems,
      emptyMessage:
        aboutTabs.find((t) => t.id === "leadership")?.emptyMessage ??
        "Leadership profiles are prepared for CMS publication once the official council roster and portraits are approved.",
    },
    aboutTabs.find((t) => t.id === "reports") ?? {
      id: "reports",
      label: "Reports & Charters",
      items: [],
      emptyMessage:
        "Corporate reports and sustainability charters will appear here when approved files are published in Strapi.",
    },
  ];
}

export default async function AboutPage() {
  const [timelineItems, leadershipPeople] = await Promise.all([
    getTimelineItems(),
    getLeadershipPeople(),
  ]);

  const tabs = buildTabs(timelineItems, leadershipPeople);
  return (
    <>
      <InteriorHero
        index="01"
        eyebrow="The corporate root"
        title="One group. Every arena."
        description={homepage.aboutSummaryBody}
        meta={[
          "Holding governance",
          "Indonesia",
          "Established 2023",
          "Four connected pillars",
        ]}
      />

      <section className="gateway-surface-light-signature bg-sarga-light py-20 sm:py-28 lg:py-36">
        <div className="site-container relative z-10">
          <EditorialHeading
            index="02"
            eyebrow="Operating philosophy"
            title="Control at the core. Freedom at the edge."
            description="Sarga gives every property room to build its own culture while a shared corporate center protects quality, accountability, and long-term value."
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
                className="group flex min-h-72 flex-col justify-between bg-white p-8 transition-colors duration-300 hover:bg-sarga-black hover:text-white focus-visible:bg-sarga-black focus-visible:text-white focus-visible:outline-none sm:p-10"
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

      <section className="gateway-surface-light-signature gateway-surface-light-signature--left bg-white py-20 sm:py-28 lg:py-36">
        <div className="site-container">
          <EditorialHeading
            index="03"
            eyebrow="Corporate record"
            title="Built in public. Governed for the long run."
            description="Explore Sarga's formation, leadership publication status, and future corporate reports through one living record."
          />
          <div className="mt-16 border-t border-sarga-black pt-8">
            <AboutTabs tabs={tabs} />
          </div>
        </div>
      </section>
    </>
  );
}
