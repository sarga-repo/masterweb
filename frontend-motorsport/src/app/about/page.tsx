import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  BrandStorySection,
  GradientRule,
  PageHero,
  PageShell,
  SectionHeader,
} from "@/components";
import { ArrowRightIcon } from "@/components/ui/icons";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description:
    "Sarga Motorsport is Indonesia's most ambitious motorsport platform — a 360° racing ecosystem of professional competition, lifestyle culture, media, and community.",
};

const ECOSYSTEM = [
  {
    index: "01",
    title: "Professional car racing",
    accent: "crimson" as const,
    desc: "Touring, GT, and formula — international standards on Indonesian circuits.",
  },
  {
    index: "02",
    title: "Professional motorcycle racing",
    accent: "orange" as const,
    desc: "Superbike, Moto2, and grassroots two-wheel competition.",
  },
  {
    index: "03",
    title: "Lifestyle & festival culture",
    accent: "yellow" as const,
    desc: "Music, food, art, and community woven into every race weekend.",
  },
  {
    index: "04",
    title: "Media & broadcast",
    accent: "teal" as const,
    desc: "Livestream, editorial, galleries — always-on motorsport coverage.",
  },
  {
    index: "05",
    title: "Venue & circuit",
    accent: "blue" as const,
    desc: "Track days, corporate events, and the circuit as a premium destination.",
  },
  {
    index: "06",
    title: "Community & fans",
    accent: "crimson" as const,
    desc: "Pit walks, simulators, fan zones — every supporter closer to the action.",
  },
];

export default function AboutPage() {
  return (
    <PageShell>
      <PageHero
        kicker="The Adrenaline Alchemist"
        kickerColor="orange"
        title="About"
        accent="crimson"
        accentPosition="top-right"
        speedLines
        grain
        description={`${siteConfig.description} Born from a vision to unite professional racing, lifestyle culture, and media storytelling under one electrifying brand.`}
      />

      <GradientRule />

      {/* Brand story */}
      <BrandStorySection
        eyebrow="Our story"
        title="Dynamic. Captivating. Intense."
        body="Sarga Motorsport is the powerhouse of Indonesian motorsport. We don't just organise races — we engineer experiences. Every event is a convergence of elite competition, cultural energy, and broadcast-grade storytelling. From the roar of a touring car engine to the lean angle of a superbike through a midnight corner, we exist to amplify the friction that creates fire."
        image="/media/motorsport-design-hero.png"
        imageAlt="Touring race car throwing sparks on a dusk circuit"
      />

      <GradientRule />

      {/* 360° ecosystem */}
      <section className="ms-section ms-shell">
        <SectionHeader
          index="ECOSYSTEM"
          eyebrow="The 360° racing platform"
          title="More than a race."
          description="Six pillars. One mission. Sarga Motorsport converges professional competition, cultural programming, and media production into a single, always-on motorsport experience."
        />
        <div className="mt-16 grid gap-px bg-ms-warm-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {ECOSYSTEM.map((item) => (
            <div
              key={item.title}
              className="bg-ms-black p-8 transition-colors hover:bg-ms-graphite"
            >
              <span className="ms-data-label text-ms-warm-white/38">
                {item.index}
              </span>
              <h3 className="ms-display mt-3 text-[clamp(1.5rem,3vw,2.5rem)]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-ms-warm-white/52">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="ms-shell border-t border-ms-warm-white/12 py-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="ms-kicker text-ms-slipstream-teal">
              Mission & positioning
            </span>
            <h2 className="ms-display mt-6 text-[clamp(2.5rem,5vw,5rem)]">
              Racing, amplified.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-ms-warm-white/60">
              We believe motorsport in Indonesia deserves a world-class stage.
              Sarga Motorsport exists to build that stage — circuit by circuit,
              race by race, story by story. Our brand persona is the &ldquo;Adrenaline
              Alchemist&rdquo;: we transform raw speed into cultural energy.
            </p>
          </div>
          <div className="ms-slant relative aspect-[4/3] overflow-hidden">
            <Image
              src="/media/motorcycle-racing-dusk.png"
              alt="Superbike riders leaning through a circuit corner at dusk"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-ms-black/60 to-transparent"
            />
          </div>
        </div>
      </section>

      {/* Brand personality */}
      <section className="ms-heat-field ms-section">
        <div className="ms-shell">
          <SectionHeader
            eyebrow="Brand personality"
            title="The Adrenaline Alchemist."
            align="left"
          />
          <div className="mt-10 grid gap-8 border-t border-ms-warm-white/12 pt-10 md:grid-cols-3">
            {[
              {
                trait: "Dynamic",
                desc: "Always in motion. Every touchpoint carries velocity — from typography to ticket CTAs.",
              },
              {
                trait: "Captivating",
                desc: "Impossible to look away. Cinematic imagery, bold headlines, and editorial precision.",
              },
              {
                trait: "Intense",
                desc: "High contrast, high stakes. The brand mirrors the tension of a race weekend at full throttle.",
              },
            ].map((item) => (
              <div key={item.trait}>
                <h3 className="ms-display text-[clamp(2rem,4vw,3.5rem)]">
                  {item.trait}
                </h3>
                <p className="mt-4 text-sm leading-6 text-ms-warm-white/55">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Relationship to Sarga.co */}
      <section className="ms-shell py-16">
        <div className="ms-panel bg-ms-black p-10 sm:p-14">
          <span className="ms-data-label text-ms-warm-white/42">
            Part of the Sarga group
          </span>
          <h2 className="ms-display mt-6 max-w-[12ch] text-[clamp(2.5rem,5vw,5rem)]">
            One ecosystem. Two front doors.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-ms-warm-white/60">
            Sarga Motorsport is a dedicated property within the Sarga group
            ecosystem. The gateway at Sarga.co serves as the group&apos;s corporate
            entry point; this site is the home of racing.
          </p>
          <Link
            href={siteConfig.gatewayUrl}
            target="_blank"
            rel="noreferrer"
            className="group mt-8 inline-flex items-center gap-3 border-b border-ms-apex-crimson pb-2 text-[0.66rem] font-black uppercase tracking-[0.16em] transition-colors hover:text-ms-ignition-orange"
          >
            Visit Sarga.co
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
