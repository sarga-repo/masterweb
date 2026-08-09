import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  ExperiencePillarCard,
  InformationBand,
  PageHero,
  PageShell,
  SectionHeader,
} from "@/components";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Sarga Motorsport is more than racing - it's a 360° experience of professional competition, lifestyle culture, media coverage, and community energy.",
};

const PILLARS = [
  {
    index: "01",
    title: "Professional car racing",
    description:
      "Touring, GT, and formula disciplines. Elite drivers, world-class machinery, international competition standards, and the pursuit of the perfect lap.",
    accent: "crimson" as const,
  },
  {
    index: "02",
    title: "Professional motorcycle racing",
    description:
      "Superbike, Moto2, and grassroots two-wheel programs. Precision, bravery, and the purest expression of speed on two wheels.",
    accent: "orange" as const,
  },
  {
    index: "03",
    title: "Lifestyle festival",
    description:
      "Music stages, street food, art installations, and community gatherings. The race weekend extends far beyond the pit wall into a full sensory event.",
    accent: "yellow" as const,
  },
  {
    index: "04",
    title: "Fan & community experience",
    description:
      "Pit walks, meet-and-greets, simulators, fan zones, and VIP paddock access. Every supporter gets closer to the action they love.",
    accent: "teal" as const,
  },
  {
    index: "05",
    title: "Media & broadcast",
    description:
      "Livestream, race reports, photography, rider profiles, and behind-the-scenes storytelling. The feed never stops - 365 days of motorsport coverage.",
    accent: "blue" as const,
  },
  {
    index: "06",
    title: "Venue & circuit experience",
    description:
      "Track days, corporate events, driving experiences, and venue hire. The circuit as a premium destination beyond race weekends.",
    accent: "crimson" as const,
  },
];

export default function ExperiencePage() {
  return (
    <PageShell spectrumSeparators>
      <PageHero
        kicker="Beyond the finish line"
        kickerColor="orange"
        title="Experience"
        backgroundImage="/media/hero/sarga-motorsport-hero-paddock-ready.jpg"
        backgroundAlt="Driver and race crew preparing together in a warm daylight paddock"
        accent="teal"
        accentPosition="bottom-right"
        speedLines
        grain
        surface="heat"
        description="Sarga Motorsport is more than what happens on track. It's a festival, a broadcast, a fan community, and a premium venue experience - all converging into Indonesia's most ambitious motorsport platform."
      />

      <InformationBand
        eyebrow="Experience control / Complete race weekend"
        title="Competition is the core. Access completes it."
        description="Six connected chapters carry the audience from racing and rider development into culture, coverage, community, and venue experiences."
        items={[
          { label: "Competition", value: "Car + Moto" },
          { label: "Chapters", value: "06" },
          { label: "Coverage", value: "Always on" },
        ]}
      />

      <section className="ms-reflected-light-surface ms-section">
        <div className="ms-shell">
          <SectionHeader
            index="PILLARS"
            eyebrow="The complete ecosystem"
            title="Racing is the core. The rest is the culture."
            description="From professional four-wheel and two-wheel competition to lifestyle festivals and always-on media coverage, every dimension gets the stage it deserves."
          />
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
            {PILLARS.map((pillar, index) => (
              <ExperiencePillarCard
                key={pillar.index}
                index={pillar.index}
                title={pillar.title}
                description={pillar.description}
                accent={pillar.accent}
                className={
                  [
                    "lg:col-span-7",
                    "lg:col-span-5",
                    "lg:col-span-5",
                    "lg:col-span-7",
                    "lg:col-span-7",
                    "lg:col-span-5",
                  ][index]
                }
              />
            ))}
          </div>
        </div>
      </section>

      <section className="ms-blue-heat-surface ms-section">
        <div className="ms-shell">
          <SectionHeader
            index="TRACK"
            eyebrow="Two forms of precision"
            title="Four wheels. Two wheels. One standard."
            description="Both programmes share the same commitment to sporting clarity, athlete development, and race-weekend presentation."
          />
          <div className="mt-14 grid gap-4 md:grid-cols-[1.15fr_.85fr]">
            {[
              {
                src: "/media/sarga-motorsport-discipline-touring-daylight.jpg",
                alt: "Touring race car competing in warm daylight",
                label: "Four wheels / Touring",
              },
              {
                src: "/media/sarga-motorsport-discipline-motorcycle-daylight.jpg",
                alt: "Motorcycle racers leaning through a circuit corner",
                label: "Two wheels / Road racing",
              },
            ].map((image) => (
              <figure
                key={image.label}
                className="ms-panel relative aspect-[16/10] overflow-hidden"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 55vw"
                  className="object-cover"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#071a3d]/80 via-transparent to-transparent"
                />
                <figcaption className="absolute bottom-6 left-6 ms-kicker text-ms-electric-yellow">
                  {image.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="ms-reflected-light-surface py-14 sm:py-20">
        <div className="ms-shell grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="ms-data-label text-ms-slipstream-teal">
              Enter the programme
            </p>
            <h2 className="ms-heading-section mt-5 max-w-[15ch]">
              Find the next race weekend.
            </h2>
          </div>
          <div className="flex flex-wrap gap-6">
            <Link
              href="/events"
              className="border-b border-ms-electric-yellow/55 pb-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-electric-yellow"
            >
              Explore events
            </Link>
            <Link
              href="/contact"
              className="border-b border-ms-slipstream-teal/55 pb-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-slipstream-teal"
            >
              Experience inquiries
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
