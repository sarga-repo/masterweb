import type { Metadata } from "next";
import Image from "next/image";
import { LocaleLink as Link } from "@/components/i18n/locale-link";
import { EditorialHeading } from "@/components/sections/editorial-heading";
import { InteriorHero } from "@/components/sections/interior-hero";
import { ArrowRightIcon } from "@/components/ui/icons";
import { leadershipPeople as mockLeadership } from "@/lib/mock-data";
import { getLeadershipPeople } from "@/lib/strapi/about";
import type { LeadershipPerson } from "@/lib/strapi/types";
import { createMetadata } from "@/lib/seo/metadata";
import { getRequestLocale } from "@/lib/i18n/request";
import { getGatewaySitePageByPath } from "@/lib/strapi/site-pages";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return createMetadata({
    title: "Board of Directors",
    description:
      "Meet the board and executive leadership guiding Sarga's integrated sports and entertainment ecosystem.",
    path: "/about/board-of-directors",
    locale,
    isFallback: locale === "id",
  });
}

function LeadershipCard({
  person,
  index,
}: {
  person: LeadershipPerson;
  index: number;
}) {
  return (
    <article className="group flex h-full flex-col border border-sarga-text/15 bg-[#fbf8f3] p-4 shadow-[0_18px_50px_rgb(16_20_27_/_6%)]">
      <div className="relative aspect-square overflow-hidden bg-sarga-black">
        {person.portrait ? (
          <Image
            src={person.portrait.url}
            alt={person.portrait.alt}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
          />
        ) : null}
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(16,20,27,.62)_100%)]"
        />
        <span className="absolute bottom-4 left-4 font-heading text-xl font-bold text-white/50">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <p className="mt-5 text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-sarga-red-dark">
        {person.role}
      </p>
      <h3 className="gateway-card-title mt-2 max-w-[14ch] font-heading uppercase">
        {person.name}
      </h3>
      <p className="mt-5 border-t border-sarga-text/15 pt-4 text-sm leading-6 text-sarga-text-muted">
        {person.biography ??
          `Member of Sarga's ${person.group === "board" ? "Board of Directors" : person.group === "advisor" ? "Advisory Council" : "Executive Council"}.`}
      </p>
    </article>
  );
}

export default async function BoardOfDirectorsPage() {
  const locale = await getRequestLocale();
  const cmsPeople = await getLeadershipPeople(locale);
  const page = await getGatewaySitePageByPath("/about/board-of-directors", locale);
  const leadershipPeople = cmsPeople.length > 0 ? cmsPeople : mockLeadership;

  const board = leadershipPeople.filter((person) => person.group === "board");
  const executive = leadershipPeople.filter(
    (person) => person.group === "executive",
  );
  const advisors = leadershipPeople.filter(
    (person) => person.group === "advisor",
  );
  const boardSection = page?.sections.find((section) => section.sectionKey === "board-oversight");
  const executiveSection = page?.sections.find((section) => section.sectionKey === "executive-council");
  const advisorySection = page?.sections.find((section) => section.sectionKey === "advisory-council");

  return (
    <>
      <InteriorHero
        index="01"
        eyebrow={page?.navigationLabel ?? "Governance and leadership"}
        title={page?.heroTitle ?? "Stewardship at every level."}
        description={page?.heroDescription ?? "Sarga's board and executive leadership align long-term governance with decisive operating responsibility across the ecosystem."}
        image={{
          url: "/assets/media/leadership/governance-editorial-concept.png",
          alt: "Conceptual silhouettes representing Sarga's leadership and governance",
        }}
        meta={[
          "Board oversight",
          "Executive council",
          "Indonesia",
          "One operating standard",
        ]}
        tone="slate"
      />

      <section className="gateway-warm-panel py-20 sm:py-28 lg:py-36">
        <div className="site-container">
          <EditorialHeading
            index="02"
            eyebrow={boardSection?.eyebrow ?? "Board oversight"}
            title={boardSection?.title ?? "Built for the long run."}
            description={boardSection?.body ?? "The board protects Sarga's mandate, governance discipline, and long-term value as the group expands its sporting and entertainment portfolio."}
          />
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
            {board.map((person, index) => (
              <LeadershipCard key={person.name} person={person} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="gateway-surface-light-signature gateway-surface-light-signature--left bg-sarga-light py-20 sm:py-28 lg:py-36">
        <div className="site-container">
          <EditorialHeading
            index="03"
            eyebrow={executiveSection?.eyebrow ?? "Executive council"}
            title={executiveSection?.title ?? "Accountability moves close to the work."}
            description={executiveSection?.body ?? "The executive council translates group direction into commercial, financial, and operating momentum across every Sarga property."}
          />
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
            {executive.map((person, index) => (
              <LeadershipCard
                key={person.name}
                person={person}
                index={index + board.length}
              />
            ))}
          </div>
          {advisors.length > 0 ? (
            <div className="mt-24">
              <EditorialHeading
                index="04"
                eyebrow={advisorySection?.eyebrow ?? "Advisory council"}
                title={advisorySection?.title ?? "Experience around the table."}
                description={advisorySection?.body ?? "Advisors contribute specialist and independent perspective without obscuring the group's governance and operating lines."}
              />
              <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {advisors.map((person, index) => (
                  <LeadershipCard
                    key={person.name}
                    person={person}
                    index={index + board.length + executive.length}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="gateway-surface-accent-signature bg-sarga-red py-16 text-white sm:py-20">
        <div className="site-container flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-white/65">
              Follow the operating line
            </p>
            <h2 className="mt-4 max-w-[14ch] font-heading text-4xl font-bold uppercase leading-[0.92] tracking-[-0.04em] sm:text-[2.5rem]">
              See how the group connects.
            </h2>
          </div>
          <Link
            href="/about/company-structure"
            className="group inline-flex w-fit items-center gap-5 border-b border-white pb-2 text-xs font-extrabold uppercase tracking-[0.16em]"
          >
            Company structure
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
        </div>
      </section>
    </>
  );
}
