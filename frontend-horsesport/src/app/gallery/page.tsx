import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo/metadata";

import {
  PageHero,
  GalleryMosaic,
  ScrollReveal,
  SectionHeader,
} from "@/components";
import { fetchGalleryPage } from "@/lib/cms-content";

export const metadata: Metadata = createMetadata({
  title: "Gallery",
  description:
    "Visual storytelling from Sarga Horse Sport - race day, stable life, venues, jockeys, and hospitality.",
  path: "/gallery",
});

export default async function GalleryPage() {
  const groups = await fetchGalleryPage();

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Motion, recorded."
        description="Race-day drama, stable-life intimacy, turf aerials, and hospitality - captured in a cinematic editorial grid."
        backgroundImage="/media/Home-straight-finish.png"
        backgroundAlt="Two jockeys racing side by side past a blurred grandstand"
        accent="orange"
      />

      <section className="hs-section hs-shell">
        {groups.length > 0 ? (
          <div className="flex flex-col gap-20">
            {groups.map((group) => (
              <div key={group.id}>
                <ScrollReveal>
                  <SectionHeader
                    eyebrow={group.category ?? "Gallery"}
                    title={group.title}
                    description={group.description}
                  />
                </ScrollReveal>
                <ScrollReveal className="mt-10 block">
                  <GalleryMosaic items={group.items} />
                </ScrollReveal>
              </div>
            ))}
          </div>
        ) : (
          <div className="hs-card-glass p-12 text-center">
            <p className="hs-display text-2xl text-hs-cream">
              The gallery is being curated.
            </p>
            <p className="mt-3 text-sm text-hs-cream/55">
              Check back soon for race-day imagery.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
