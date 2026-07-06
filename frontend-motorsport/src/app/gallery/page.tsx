import type { Metadata } from "next";
import Image from "next/image";

import {
  GalleryCarousel,
  GradientRule,
  PageHero,
  PageShell,
  SectionHeader,
} from "@/components";
import { fetchGalleryItems } from "@/lib/cms-data";
import type { GalleryItem } from "@/types/design-system";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Trackside photography from Sarga Motorsport - car racing, motorcycle racing, paddock life, and festival energy captured in motion.",
};

const PLACEHOLDER: GalleryItem[] = [
  {
    id: "g1",
    image: "/media/motorsport-design-hero.png",
    imageAlt: "Touring race car throwing sparks at speed on a dusk circuit",
    eyebrow: "Four wheels / Touring",
    caption: "The line comes alive",
  },
  {
    id: "g2",
    image: "/media/motorcycle-racing-dusk.png",
    imageAlt: "Superbike riders leaned into a sweeping corner at dusk",
    eyebrow: "Two wheels / Superbike",
    caption: "Lean into the limit",
  },
  {
    id: "g3",
    image: "/media/motorsport-design-card.png",
    imageAlt: "GT race car under night circuit floodlights",
    eyebrow: "Four wheels / GT",
    caption: "Built for intensity",
  },
  {
    id: "g4",
    image: "/media/motorcycle-racing-dusk.png",
    imageAlt: "Close-up of a motorcycle racer mid-corner in full leathers",
    eyebrow: "Two wheels / Moto2",
    caption: "Apex precision",
  },
  {
    id: "g5",
    image: "/media/motorsport-design-hero.png",
    imageAlt: "Pit crew working on a race car under paddock lights",
    eyebrow: "Paddock",
    caption: "Behind the scenes",
  },
  {
    id: "g6",
    image: "/media/motorsport-design-card.png",
    imageAlt: "Festival grounds and grandstands during a race weekend",
    eyebrow: "Festival",
    caption: "Beyond the grid",
  },
];

export default async function GalleryPage() {
  const cmsGallery = await fetchGalleryItems();
  const items = cmsGallery.length >= 3 ? cmsGallery : PLACEHOLDER;

  return (
    <PageShell>
      <PageHero
        kicker="Trackside capture feed"
        kickerColor="orange"
        title="Gallery"
        accent="crimson"
        accentPosition="bottom-right"
        speedLines
        grain
        description="Motion, recorded. Circuit photography from every discipline - four-wheel touring and GT, two-wheel superbike and Moto2, paddock life, and festival energy."
      />

      <GradientRule />

      {/* Featured carousel */}
      <section className="ms-section ms-shell">
        <SectionHeader
          eyebrow="Featured"
          title="Every frame carries velocity."
          align="left"
        />
        <div className="mt-14">
          <GalleryCarousel items={items} />
        </div>
      </section>

      <GradientRule />

      {/* Masonry-style grid */}
      <section className="ms-section ms-shell">
        <SectionHeader
          eyebrow="Full gallery"
          title="The archive."
          align="left"
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <figure
              key={item.id}
              className={`group relative overflow-hidden bg-ms-charcoal ${
                i % 5 === 0 ? "sm:col-span-2 sm:row-span-2" : ""
              }`}
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-(--ease-ms-out) group-hover:scale-[1.025]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-ms-black/80 via-transparent to-transparent"
                />
              </div>
              {item.caption || item.eyebrow ? (
                <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
                  <div>
                    {item.eyebrow ? (
                      <span className="ms-kicker text-ms-ignition-orange">
                        {item.eyebrow}
                      </span>
                    ) : null}
                    {item.caption ? (
                      <p className="mt-1 font-display text-lg uppercase sm:text-xl">
                        {item.caption}
                      </p>
                    ) : null}
                  </div>
                  <span className="font-display text-sm text-ms-warm-white/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
