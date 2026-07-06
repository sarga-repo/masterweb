import type { Metadata } from "next";
import Image from "next/image";

import {
  ExperiencePillarCard,
  GradientRule,
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
    <PageShell>
      <PageHero
        kicker="Beyond the finish line"
        kickerColor="orange"
        title="Experience"
        accent="teal"
        accentPosition="center"
        speedLines
        grain
        description="Sarga Motorsport is more than what happens on track. It's a festival, a broadcast, a fan community, and a premium venue experience - all converging into Indonesia's most ambitious motorsport platform."
      />

      <GradientRule />

      {/* Pillars grid */}
      <section className="ms-section ms-shell">
        <SectionHeader
          index="PILLARS"
          eyebrow="The 360° ecosystem"
          title="Racing is the core. The rest is the culture."
          description="From professional four-wheel and two-wheel competition to lifestyle festivals and always-on media coverage, every dimension gets the stage it deserves."
        />
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((p) => (
            <ExperiencePillarCard
              key={p.index}
              index={p.index}
              title={p.title}
              description={p.description}
              accent={p.accent}
            />
          ))}
        </div>
      </section>

      {/* Visual break - dual imagery */}
      <section className="ms-shell pb-(--ms-section-space)">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="ms-slant relative aspect-[16/10] overflow-hidden">
            <Image
              src="/media/motorsport-design-hero.png"
              alt="Touring race car on a dusk circuit"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-ms-black/70 to-transparent"
            />
            <span className="absolute bottom-6 left-6 ms-kicker text-ms-ignition-orange">
              Four wheels
            </span>
          </div>
          <div className="ms-slant relative aspect-[16/10] overflow-hidden">
            <Image
              src="/media/motorcycle-racing-dusk.png"
              alt="Superbike riders leaning through a corner"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-ms-black/70 to-transparent"
            />
            <span className="absolute bottom-6 left-6 ms-kicker text-ms-ignition-orange">
              Two wheels
            </span>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
