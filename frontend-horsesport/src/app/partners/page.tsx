import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo/metadata";

import {
  PageHero,
  SectionHeader,
  ScrollReveal,
  PartnerLogoStrip,
  FeatureCard,
  CtaBand,
} from "@/components";
import { RosetteIcon, UsersIcon, PlayIcon, TrophyIcon } from "@/components/ui/hs-icons";
import { fetchPartners } from "@/lib/cms-content";

export const metadata: Metadata = createMetadata({
  title: "Partners",
  description:
    "Sponsorship and strategic partnership opportunities across the Sarga Horse Sport ecosystem.",
  path: "/partners",
});

const TIERS = [
  { title: "Principal partner", body: "Category-exclusive naming, headline race-day presence, and brand integration.", Icon: TrophyIcon },
  { title: "Official partner", body: "Trackside branding, hospitality allocations, and content collaboration.", Icon: RosetteIcon },
  { title: "Media & broadcast", body: "Broadcast integration, editorial features, and digital reach.", Icon: PlayIcon },
  { title: "Community partner", body: "Grassroots programs, education, and community activation.", Icon: UsersIcon },
];

export default async function PartnersPage() {
  const partners = await fetchPartners();

  return (
    <>
      <PageHero
        eyebrow="Partners"
        title="Partner with a premium sport."
        description="Align your brand with championship equestrian sport, race-day hospitality, and a growing national and international audience."
        backgroundImage="/media/horse-sport-card.png"
        backgroundAlt="Premium Sarga Horse Sport brand imagery"
        accent="sand"
      />

      <section className="hs-section hs-shell">
        <ScrollReveal>
          <SectionHeader
            index="01"
            eyebrow="The proposition"
            title="A platform built for ambitious brands."
            description="Sarga Horse Sport pairs championship prestige with premium hospitality and a cinematic content ecosystem — an investable audience for partners who want to be part of the sport's next chapter."
          />
        </ScrollReveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TIERS.map((tier, i) => (
            <ScrollReveal key={tier.title} delay={(i % 4) * 80}>
              <FeatureCard icon={tier.Icon} title={tier.title} body={tier.body} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="hs-charcoal-section hs-section-tight relative overflow-hidden">
        <div aria-hidden className="hs-luxe-rule absolute inset-x-0 top-0 opacity-50" />
        <div className="hs-shell relative">
          <PartnerLogoStrip
            label="Current partners & sponsors"
            partners={partners}
          />
        </div>
      </section>

      <CtaBand
        title="Let's build something enduring."
        description="Tell us about your brand and objectives — our partnerships team will craft a tailored proposal."
        primaryCta={{ label: "Start a conversation", href: "/contact" }}
      />
    </>
  );
}
