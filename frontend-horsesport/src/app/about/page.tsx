import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo/metadata";
import Image from "next/image";

import {
  PageHero,
  SectionHeader,
  ScrollReveal,
  RichText,
  FeatureCard,
  CtaBand,
} from "@/components";
import {
  RosetteIcon,
  TrackIcon,
  StableIcon,
  TrophyIcon,
  UsersIcon,
  HorseshoeIcon,
} from "@/components/ui/hs-icons";
import { fetchHorseSportBusiness } from "@/lib/strapi/content";

export const metadata: Metadata = createMetadata({
  title: "About",
  description:
    "Sarga Horse Sport positioning, championship standards, race organisation capability, venue development, and race-day hospitality.",
  path: "/about",
});

const CAPABILITIES = [
  { title: "Championship standards", body: "Group-class race classification and international sporting standards.", Icon: TrophyIcon },
  { title: "Sport & veterinary compliance", body: "Rigorous welfare, integrity, and veterinary compliance protocols.", Icon: RosetteIcon },
  { title: "Race organisation", body: "End-to-end event production, officiating, and broadcast capability.", Icon: UsersIcon },
  { title: "Venue & turf development", body: "Championship-grade turf, tracks, and spectator infrastructure.", Icon: TrackIcon },
  { title: "Stable & equine care", body: "Elite stabling, conditioning, and equine performance programs.", Icon: StableIcon },
  { title: "Hospitality & lifestyle", body: "Premium race-day hospitality, lounges, and derby-day experiences.", Icon: HorseshoeIcon },
];

export default async function AboutPage() {
  const business = await fetchHorseSportBusiness();
  const overview =
    business?.overview ??
    "Sarga Horse Sport formulates premium national race classifications, elite jockey programs, and strict veterinary compliance protocols across Indonesian horse sport. It is built as a complete, investable championship ecosystem — from the turf to the stable to the grandstand.";

  return (
    <>
      <PageHero
        eyebrow="About"
        title="The standard for elite horse sport."
        description="Premium championship racing, disciplined equestrian standards, and a hospitality-forward experience — positioned for a national and international audience."
        backgroundImage="/media/sarga-horse-sport-concept.png"
        backgroundAlt="Cinematic concept image of a jockey and thoroughbred in motion"
        accent="brown"
      />

      {/* Brand story */}
      <section className="hs-section hs-shell">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
          <ScrollReveal>
            <SectionHeader index="01" eyebrow="The Sarga Horse Sport story" title="Heritage, engineered for the modern spectacle." />
            <RichText value={overview} className="mt-6" />
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <div className="hs-card-glass relative aspect-[4/5] overflow-hidden">
              <Image
                src="/media/horse-sport-card.png"
                alt="Premium Sarga Horse Sport brand imagery"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-hs-black/50 to-transparent" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Capabilities */}
      <section className="relative overflow-hidden border-y border-hs-cream/12 bg-hs-night">
        <div className="hs-shell hs-section relative">
          <ScrollReveal>
            <SectionHeader
              index="02"
              eyebrow="What we do"
              title="A complete championship capability."
              description="Everything required to run elite horse sport to international standard — under one disciplined organisation."
            />
          </ScrollReveal>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((cap, i) => (
              <ScrollReveal key={cap.title} delay={(i % 3) * 90}>
                <FeatureCard icon={cap.Icon} title={cap.title} body={cap.body} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CtaBand
        title="Partner with a premium sport."
        description="Align your brand with championship equestrian sport and a growing international audience."
        primaryCta={{ label: "Partnership opportunities", href: "/partners" }}
        secondaryCta={{ label: "Explore events", href: "/events" }}
      />
    </>
  );
}
