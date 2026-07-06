import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EditorialHeading } from "@/components/sections/editorial-heading";
import { InteriorHero } from "@/components/sections/interior-hero";
import { ArrowRightIcon } from "@/components/ui/icons";
import { leadershipPeople as mockLeadership } from "@/lib/mock-data";
import { getLeadershipPeople } from "@/lib/strapi/about";
import type { LeadershipPerson } from "@/lib/strapi/types";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "Board of Directors",
  description:
    "Meet the board and executive leadership guiding Sarga's integrated sports and entertainment ecosystem.",
  path: "/about/board-of-directors",
});

function LeadershipCard({
  person,
  index,
}: {
  person: LeadershipPerson;
  index: number;
}) {
  return (
    <article className="group border-t border-sarga-black/20 pt-4">
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
      <p className="mt-5 text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-sarga-red">
        {person.role}
      </p>
      <h3 className="mt-2 max-w-[14ch] font-heading text-2xl font-bold uppercase leading-[0.92] tracking-[-0.035em] sm:text-3xl">
        {person.name}
      </h3>
    </article>
  );
}

export default async function BoardOfDirectorsPage() {
  const cmsPeople = await getLeadershipPeople();
  const leadershipPeople = cmsPeople.length > 0 ? cmsPeople : mockLeadership;

  const board = leadershipPeople.filter((person) => person.group === "board");
  const executive = leadershipPeople.filter(
    (person) => person.group === "executive",
  );

  return (
    <>
      <InteriorHero
        index="01"
        eyebrow="Governance and leadership"
        title="Stewardship at every level."
        description="Sarga's board and executive leadership align long-term governance with decisive operating responsibility across the ecosystem."
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
      />

      <section className="gateway-surface-light-signature bg-sarga-light py-20 sm:py-28 lg:py-36">
        <div className="site-container">
          <EditorialHeading
            index="02"
            eyebrow="Board oversight"
            title="Built for the long run."
            description="The board protects Sarga's mandate, governance discipline, and long-term value as the group expands its sporting and entertainment portfolio."
          />
          <div className="mt-16 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:mt-20 lg:max-w-[70%]">
            {board.map((person, index) => (
              <LeadershipCard key={person.name} person={person} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="gateway-surface-light-signature gateway-surface-light-signature--left bg-white py-20 sm:py-28 lg:py-36">
        <div className="site-container">
          <EditorialHeading
            index="03"
            eyebrow="Executive council"
            title="Accountability moves close to the work."
            description="The executive council translates group direction into commercial, financial, and operating momentum across every Sarga property."
          />
          <div className="mt-16 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
            {executive.map((person, index) => (
              <LeadershipCard
                key={person.name}
                person={person}
                index={index + board.length}
              />
            ))}
          </div>
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
