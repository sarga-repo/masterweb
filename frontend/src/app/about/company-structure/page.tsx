import type { Metadata } from "next";
import Link from "next/link";
import { EditorialHeading } from "@/components/sections/editorial-heading";
import { InteriorHero } from "@/components/sections/interior-hero";
import { ArrowRightIcon } from "@/components/ui/icons";
import {
  ecosystemBusinesses,
  ecosystemPillars,
  leadershipPeople,
} from "@/lib/mock-data";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "Company Structure",
  description:
    "Explore Sarga's holding governance, executive leadership, shared operating platform, and connected portfolio structure.",
  path: "/about/company-structure",
});

export default function CompanyStructurePage() {
  const board = leadershipPeople.filter((person) => person.group === "board");
  const executive = leadershipPeople.filter(
    (person) => person.group === "executive",
  );

  return (
    <>
      <InteriorHero
        index="01"
        eyebrow="Integrated holding model"
        title="One group. Clear lines."
        description="Sarga combines central governance and shared operating standards with focused business units built to lead their own disciplines."
        image={{
          url: "/assets/media/sarga-cinematic-hero-concept.png",
          alt: "Horse sport and motorsport moving through one integrated Sarga landscape",
        }}
        meta={[
          "Holding governance",
          "Executive platform",
          "Four operating pillars",
          "Expandable portfolio",
        ]}
      />

      <section className="bg-sarga-light py-20 sm:py-28 lg:py-36">
        <div className="site-container">
          <EditorialHeading
            index="02"
            eyebrow="Operating architecture"
            title="One core. Many operators."
            description="The structure keeps strategic accountability visible while giving every venture the room to build category authority and audience relevance."
          />

          <div className="mt-16 lg:mt-20">
            <div className="mx-auto max-w-3xl border border-sarga-black bg-sarga-black p-8 text-white sm:p-10">
              <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.2em] text-sarga-red">
                Corporate root
              </p>
              <h2 className="mt-4 font-heading text-4xl font-black uppercase leading-[1.04] tracking-[-0.03em] sm:text-[2.25rem]">
                PT Sarga Multi Ekosistem
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/58">
                Holding governance, portfolio strategy, capital stewardship, and
                the shared standards connecting every operating property.
              </p>
            </div>

            <div
              aria-hidden="true"
              className="mx-auto h-12 w-px bg-sarga-black/35"
            />

            <div className="grid gap-px bg-sarga-black/20 lg:grid-cols-2">
              <article className="bg-white p-8 sm:p-10">
                <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.2em] text-sarga-red">
                  01 / Governance
                </p>
                <h3 className="mt-4 font-heading text-3xl font-black uppercase tracking-[-0.035em]">
                  Board oversight
                </h3>
                <ul className="mt-8 divide-y divide-sarga-black/15 border-t border-sarga-black/15">
                  {board.map((person) => (
                    <li key={person.name} className="py-4">
                      <strong className="block text-sm uppercase tracking-[0.08em]">
                        {person.name}
                      </strong>
                      <span className="mt-1 block text-xs text-sarga-text-muted">
                        {person.role}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
              <article className="bg-white p-8 sm:p-10">
                <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.2em] text-sarga-red">
                  02 / Management
                </p>
                <h3 className="mt-4 font-heading text-3xl font-black uppercase tracking-[-0.035em]">
                  Executive council
                </h3>
                <ul className="mt-8 divide-y divide-sarga-black/15 border-t border-sarga-black/15 sm:grid sm:grid-cols-2 sm:divide-y-0">
                  {executive.map((person) => (
                    <li
                      key={person.name}
                      className="border-b border-sarga-black/15 py-4 sm:pr-4"
                    >
                      <strong className="block text-sm uppercase tracking-[0.08em]">
                        {person.name}
                      </strong>
                      <span className="mt-1 block text-xs text-sarga-text-muted">
                        {person.role}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>

            <div
              aria-hidden="true"
              className="mx-auto h-12 w-px bg-sarga-black/35"
            />

            <div className="border border-sarga-black/20 bg-white p-6 sm:p-8">
              <p className="text-center text-[0.62rem] font-extrabold uppercase tracking-[0.2em] text-sarga-red">
                Shared operating platform
              </p>
              <div className="mt-6 grid gap-px bg-sarga-black/15 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  "Portfolio strategy",
                  "Commercial & partnerships",
                  "Finance & governance",
                  "Operations & audience intelligence",
                ].map((functionName) => (
                  <div
                    key={functionName}
                    className="bg-sarga-light px-5 py-6 text-center text-xs font-bold uppercase leading-5 tracking-[0.1em]"
                  >
                    {functionName}
                  </div>
                ))}
              </div>
            </div>

            <div
              aria-hidden="true"
              className="mx-auto h-12 w-px bg-sarga-black/35"
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {ecosystemPillars.map((pillar, index) => {
                const businesses = ecosystemBusinesses.filter(
                  (business) => business.pillar === pillar.id,
                );
                return (
                  <article
                    key={pillar.id}
                    className="border border-sarga-black/20 bg-white p-6"
                  >
                    <span className="font-heading text-2xl font-black text-sarga-red">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-8 font-heading text-3xl font-black uppercase leading-none tracking-[-0.04em]">
                      {pillar.label}
                    </h3>
                    <ul className="mt-6 space-y-3 border-t border-sarga-black/15 pt-5 text-xs font-bold uppercase tracking-[0.08em] text-sarga-text-muted">
                      {businesses.map((business) => (
                        <li key={business.slug}>{business.name}</li>
                      ))}
                      {!businesses.length ? (
                        <li>Portfolio in development</li>
                      ) : null}
                    </ul>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-sarga-black py-16 text-white sm:py-20">
        <div className="site-container flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-white/45">
              People behind the structure
            </p>
            <h2 className="mt-4 max-w-[14ch] font-heading text-4xl font-black uppercase leading-[0.92] tracking-[-0.04em] sm:text-[2.5rem]">
              Meet the leadership council.
            </h2>
          </div>
          <Link
            href="/about/board-of-directors"
            className="group inline-flex w-fit items-center gap-5 border-b border-white pb-2 text-xs font-extrabold uppercase tracking-[0.16em]"
          >
            Board of Directors
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
        </div>
      </section>
    </>
  );
}
