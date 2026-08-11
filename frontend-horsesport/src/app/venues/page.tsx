import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo/metadata";
import { LocaleLink as Link } from "@/components/i18n/locale-link";

import {
  PageHero,
  SectionHeader,
  ScrollReveal,
  VenueHighlightCard,
  FeatureCard,
  ArrowRightIcon,
} from "@/components";
import { TrackIcon, StableIcon, RosetteIcon } from "@/components/ui/hs-icons";
import type { VenueCardData } from "@/types/design-system";
import { getRequestLocale } from "@/lib/i18n/request";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return createMetadata({
    title: "Venues",
    description:
      "Championship-grade turf tracks, stables, and hospitality facilities across the Sarga Horse Sport network.",
    path: "/venues",
    locale,
  });
}

const VENUES: VenueCardData[] = [
  {
    name: "Sarga Turf Park",
    href: "/events",
    location: "Bogor, West Java",
    description: "Championship-grade turf with premium grandstand hospitality.",
    image: "/media/Racecourse-aerial.png",
    imageAlt: "Aerial view of the Sarga Turf Park racing track",
  },
  {
    name: "Grand Paddock Arena",
    href: "/events",
    location: "Jakarta",
    description:
      "An intimate exhibition venue for gala meetings and hospitality.",
    image: "/media/horse-sport-card.png",
    imageAlt: "Premium Sarga Horse Sport venue",
  },
  {
    name: "The Stables",
    href: "/stable-life",
    location: "Training complex",
    description: "Elite stabling, veterinary care, and daily conditioning.",
    image: "/media/news-stable.png",
    imageAlt: "Premium stable facility interior",
  },
];

const FACILITIES = [
  {
    title: "Championship turf",
    body: "International-grade turf with advanced drainage and track management.",
    Icon: TrackIcon,
  },
  {
    title: "Grandstand & hospitality",
    body: "Premium lounges, paddock clubs, and family zones.",
    Icon: RosetteIcon,
  },
  {
    title: "Elite stabling",
    body: "Modern stables engineered for equine welfare and performance.",
    Icon: StableIcon,
  },
];

export default function VenuesPage() {
  return (
    <>
      <PageHero
        eyebrow="Venues"
        title="Championship-grade turf & facilities."
        description="Premium tracks, turf, stables, and hospitality infrastructure built to international standards."
        backgroundImage="/media/Racecourse-aerial.png"
        backgroundAlt="Aerial view of a championship turf racing track"
        accent="turf"
      />

      <section className="hs-section hs-shell">
        <ScrollReveal>
          <SectionHeader
            index="01"
            eyebrow="The venue network"
            title="Where the sport comes to life."
            description="From championship turf to elite stabling and gala hospitality arenas."
          />
        </ScrollReveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {VENUES.map((venue, i) => (
            <ScrollReveal key={venue.name} delay={i * 100} className="flex">
              <VenueHighlightCard venue={venue} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-hs-cream/12 bg-hs-night">
        <div className="hs-shell hs-section relative">
          <ScrollReveal>
            <SectionHeader
              index="02"
              eyebrow="Facilities"
              title="Engineered for elite competition."
            />
          </ScrollReveal>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {FACILITIES.map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 90}>
                <FeatureCard icon={f.Icon} title={f.title} body={f.body} />
              </ScrollReveal>
            ))}
          </div>
          <div className="mt-10">
            <Link
              href="/events"
              className="group inline-flex items-center gap-2 text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-hs-cream/70 hover:text-hs-orange"
            >
              See events at these venues
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
