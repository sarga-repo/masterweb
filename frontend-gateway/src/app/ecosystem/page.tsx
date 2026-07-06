import type { Metadata } from "next";
import { EditorialHeading } from "@/components/sections/editorial-heading";
import { EcosystemCard } from "@/components/sections/ecosystem-card";
import { InteriorHero } from "@/components/sections/interior-hero";
import { PillTabs, type PillTab } from "@/components/ui/pill-tabs";
import { ecosystemIntro, ecosystemPillars } from "@/lib/mock-data";
import { getEcosystemBusinesses } from "@/lib/strapi/ecosystem";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "360° Ecosystem",
  description:
    "Explore Sarga's connected sports, venue, media, and technology businesses.",
  path: "/ecosystem",
});

export default async function EcosystemPage() {
  const ecosystemBusinesses = await getEcosystemBusinesses();
  const tabs: PillTab[] = ecosystemPillars.map((pillar, pillarIndex) => {
    const businesses = ecosystemBusinesses.filter(
      (business) => business.pillar === pillar.id,
    );

    return {
      id: pillar.id,
      label: pillar.label,
      content: (
        <section id={pillar.id}>
          <div className="grid gap-6 border-b border-white/20 pb-8 lg:grid-cols-[0.2fr_0.8fr_1fr] lg:items-end">
            <span className="font-heading text-2xl font-bold text-sarga-red">
              {String(pillarIndex + 1).padStart(2, "0")}
            </span>
            <h2 className="font-heading text-4xl font-bold uppercase leading-[0.92] tracking-[-0.04em] sm:text-[2.4rem]">
              {pillar.headline}
            </h2>
            <p className="max-w-xl text-sm leading-7 text-white/55 lg:justify-self-end">
              {pillar.blurb}
            </p>
          </div>
          {businesses.length ? (
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {businesses.map((business) => (
                <EcosystemCard key={business.slug} business={business} />
              ))}
            </div>
          ) : (
            <p className="mt-8 border border-white/15 p-8 text-sm uppercase tracking-[0.16em] text-white/45">
              Portfolio announcements in preparation.
            </p>
          )}
        </section>
      ),
    };
  });

  return (
    <>
      <InteriorHero
        index="02"
        eyebrow="The Sarga framework"
        title="One network. Four forces."
        description={ecosystemIntro.description}
        image={{
          url: "/assets/media/sarga-cinematic-hero-concept.png",
          alt: "Horses and a race car moving through a shared sporting landscape",
        }}
        meta={["Sports", "Venue", "Media", "Technology"]}
      />

      <section className="bg-sarga-black py-20 text-white sm:py-28 lg:py-36">
        <div className="site-container">
          <EditorialHeading
            index="03"
            eyebrow="Portfolio map"
            title="Distinct ventures. Shared momentum."
            description="Each property is built for its own audience and discipline, then connected through Sarga's central operating platform."
            light
          />

          <PillTabs
            tabs={tabs}
            defaultTabId="sports"
            tone="dark"
            aria-label="Ecosystem pillars"
            className="mt-16 [&_[role=tablist]]:rounded-none [&_[role=tablist]]:border-x-0 [&_[role=tablist]]:border-t-0 [&_[role=tablist]]:bg-transparent [&_[role=tablist]]:p-0 [&_[role=tab]]:flex-1 [&_[role=tab]]:rounded-none [&_[role=tab]]:border-b-2 [&_[role=tab]]:border-transparent [&_[role=tab]]:bg-transparent [&_[role=tab]]:py-4 [&_[aria-selected=true]]:border-sarga-red [&_[aria-selected=true]]:bg-transparent [&_[aria-selected=true]]:text-white"
          />
        </div>
      </section>
    </>
  );
}
