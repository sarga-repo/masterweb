import type { Metadata } from "next";

import {
  HeroRaceSection,
  SectionHeader,
  ScrollReveal,
  RaceEventCard,
  NewsArticleCard,
  TicketCtaPanel,
  VenueHighlightCard,
  StableLifeCard,
  GalleryMosaic,
  PartnerLogoStrip,
  NewsletterBand,
  CrossSiteEcosystemLinks,
  Breadcrumbs,
  StaircaseMark,
} from "@/components";
import {
  HorseshoeIcon,
  JockeyHelmetIcon,
  HorseIcon,
  RosetteIcon,
  TrophyIcon,
  TicketIcon,
  CalendarIcon,
  PinIcon,
  TrackIcon,
  StableIcon,
  ClockIcon,
  SparkleIcon,
  QuoteIcon,
  UsersIcon,
  PlayIcon,
  MailIcon,
} from "@/components/ui/hs-icons";
import { siteConfig } from "@/lib/site-config";
import type {
  EventCardData,
  ArticleCardData,
  VenueCardData,
  GalleryItemData,
  PartnerItemData,
} from "@/types/design-system";

export const metadata: Metadata = {
  title: "Design System",
  description: "Sarga Horse Sport component library and design tokens (HS-4).",
  robots: { index: false, follow: false },
};

const EVENTS: EventCardData[] = [
  {
    title: "Sarga National Derby — Merdeka Cup",
    href: "/events/sarga-national-derby-merdeka-cup",
    dateLabel: "17 Aug 2026",
    venue: "Sarga Turf Park",
    discipline: "Derby",
    status: "Tickets open",
    image: "/media/Home-straight-finish.png",
    imageAlt: "Two jockeys racing side by side",
  },
  {
    title: "Turf Classic Twilight Meeting",
    href: "/events/turf-classic-twilight-meeting",
    dateLabel: "12 Sep 2026",
    venue: "Sarga Turf Park",
    discipline: "Turf",
    status: "Announced",
    image: "/media/Racecourse-aerial.png",
    imageAlt: "Aerial view of a turf track",
  },
  {
    title: "Champions Exhibition Gala",
    href: "/events/champions-exhibition-gala",
    dateLabel: "04 Oct 2026",
    venue: "Grand Paddock Arena",
    discipline: "Exhibition",
    status: "Hospitality",
    image: "/media/sarga-horse-race-event.png",
    imageAlt: "Race day at the starting gate",
  },
];

const ARTICLES: ArticleCardData[] = [
  {
    title: "Merdeka Cup Returns to a Sold-Out Grandstand",
    href: "/news/merdeka-cup-returns-sold-out-grandstand",
    category: "Event announcement",
    dateLabel: "20 Jul 2026",
    excerpt:
      "The Sarga National Derby headlines a record race-day program with elite jockeys and championship turf classifications.",
    image: "/media/news-merdeka.png",
    imageAlt: "Grandstand crowd on race day",
  },
  {
    title: "Inside the Stable: Conditioning a Derby Contender",
    href: "/news/inside-the-stable-conditioning-derby-contender",
    category: "Stable life",
    dateLabel: "05 Jul 2026",
    excerpt: "Nutrition, veterinary care, and the daily routines that shape a champion.",
    image: "/media/Champion-horse-studio-portrait.png",
    imageAlt: "Race horse in a premium stable",
  },
];

const VENUES: VenueCardData[] = [
  {
    name: "Sarga Turf Park",
    href: "/venues",
    location: "Bogor, West Java",
    description: "Championship-grade turf with premium grandstand hospitality.",
    image: "/media/Racecourse-aerial.png",
    imageAlt: "Aerial view of turf track",
  },
  {
    name: "Grand Paddock Arena",
    href: "/venues",
    location: "Jakarta",
    description: "An intimate exhibition venue for gala meetings.",
    image: "/media/horse-sport-card.png",
    imageAlt: "Premium equestrian venue",
  },
];

const STABLE: ArticleCardData[] = [
  {
    title: "The Craft of the Morning Gallop",
    href: "/stable-life",
    category: "Training",
    excerpt: "Dawn conditioning sessions that build champions, one furlong at a time.",
    image: "/media/news-stable.png",
    imageAlt: "Stable at dawn",
  },
];

const GALLERY: GalleryItemData[] = [
  { id: "g1", image: "/media/news-merdeka.png", imageAlt: "Race day crowd", category: "Race day", caption: "Merdeka Cup grandstand" },
  { id: "g2", image: "/media/news-turf-track.png", imageAlt: "Turf track", category: "Venue" },
  { id: "g3", image: "/media/Champion-horse-studio-portrait.png", imageAlt: "Stable", category: "Stable life" },
  { id: "g4", image: "/media/Home-straight-finish.png", imageAlt: "Jockeys", category: "Race day" },
  { id: "g5", image: "/media/Racecourse-aerial.png", imageAlt: "Aerial turf", category: "Venue" },
];

const PARTNERS: PartnerItemData[] = [
  { name: "Meridian Stables" },
  { name: "Turfline Grounds" },
  { name: "Derby Day Hospitality" },
  { name: "Golden Rein Group" },
];

const ICONS = [
  { Icon: HorseshoeIcon, name: "Horseshoe" },
  { Icon: JockeyHelmetIcon, name: "Jockey helmet" },
  { Icon: HorseIcon, name: "Horse" },
  { Icon: RosetteIcon, name: "Rosette" },
  { Icon: TrophyIcon, name: "Trophy" },
  { Icon: TrackIcon, name: "Track" },
  { Icon: StableIcon, name: "Stable" },
  { Icon: TicketIcon, name: "Ticket" },
  { Icon: CalendarIcon, name: "Calendar" },
  { Icon: ClockIcon, name: "Clock" },
  { Icon: PinIcon, name: "Location" },
  { Icon: UsersIcon, name: "Community" },
  { Icon: SparkleIcon, name: "Sparkle" },
  { Icon: RosetteIcon, name: "Award" },
  { Icon: QuoteIcon, name: "Quote" },
  { Icon: PlayIcon, name: "Play" },
  { Icon: MailIcon, name: "Mail" },
];

const SWATCHES = [
  { name: "Red", var: "bg-hs-red", hex: "#ED1B2F" },
  { name: "Orange", var: "bg-hs-orange", hex: "#FF6B00" },
  { name: "Cream", var: "bg-hs-cream", hex: "#FFF8E8" },
  { name: "Sand", var: "bg-hs-sand", hex: "#E8D9A8" },
  { name: "Turf", var: "bg-hs-turf", hex: "#8CA89A" },
  { name: "Brown", var: "bg-hs-brown", hex: "#7A3B2E" },
  { name: "Black", var: "bg-hs-black", hex: "#050505" },
];

function Block({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="hs-section hs-shell">
      <ScrollReveal>
        <div className="mb-10 flex items-center gap-3">
          <StaircaseMark steps={4} className="w-12 text-hs-orange" />
          <span className="hs-kicker text-hs-cream/45">{label}</span>
        </div>
      </ScrollReveal>
      {children}
    </section>
  );
}

export default function StyleguidePage() {
  return (
    <>
      <HeroRaceSection
        eyebrow="Design system · HS-4"
        title="The Horse Sport component library."
        description="Premium, cinematic, equestrian — a rounded 'strong but flexible' system distinct from gateway and motorsport, with a custom icon pack and the page-7 staircase motif."
        image="/media/horse-sport-hero.png"
        imageAlt="Jockeys racing across a championship turf track"
        primaryCta={{ label: "View components", href: "#components" }}
        secondaryCta={{ label: "Back to home", href: "/" }}
        stats={[
          { label: "Components", value: "13+" },
          { label: "Custom icons", value: "17" },
          { label: "Palette", value: "7 tones" },
          { label: "Motif", value: "Staircase" },
        ]}
      />

      <div id="components" />

      <Block label="Colour tokens">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          {SWATCHES.map((s) => (
            <div key={s.name} className="hs-card-glass p-3">
              <div className={`${s.var} h-16 w-full rounded-[var(--radius-hs-md)] border border-hs-cream/10`} />
              <p className="mt-3 text-sm font-semibold text-hs-cream">{s.name}</p>
              <p className="text-xs text-hs-cream/45">{s.hex}</p>
            </div>
          ))}
        </div>
      </Block>

      <Block label="Custom icon pack">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {ICONS.map(({ Icon, name }, i) => (
            <div
              key={`${name}-${i}`}
              className="hs-card-glass flex flex-col items-center gap-3 p-6 text-hs-cream"
            >
              <Icon className="size-8 text-hs-orange" />
              <span className="text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-hs-cream/55">
                {name}
              </span>
            </div>
          ))}
        </div>
      </Block>

      <Block label="Staircase motif (page 7)">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="hs-card-glass relative h-40 overflow-hidden">
            <div className="absolute inset-0 bg-hs-espresso/60" />
          </div>
          <div className="hs-card-glass flex items-center justify-center gap-8 p-6">
            <StaircaseMark steps={5} className="w-24 text-hs-orange" />
            <StaircaseMark steps={7} className="w-32 text-hs-red" />
          </div>
        </div>
      </Block>

      <Block label="RaceEventCard">
        <div className="grid gap-5 md:grid-cols-3">
          {EVENTS.map((e) => (
            <RaceEventCard key={e.href} event={e} />
          ))}
        </div>
      </Block>

      <Block label="NewsArticleCard">
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <NewsArticleCard article={ARTICLES[0]} feature />
          <NewsArticleCard article={ARTICLES[1]} />
        </div>
      </Block>

      <Block label="TicketCtaPanel">
        <TicketCtaPanel
          label="Get tickets"
          href="https://example.com/tickets"
          external
          provider="Partner Ticketing"
          eventName="Merdeka Cup"
          eventDate="Sarga National Derby · 17 Aug 2026"
        />
      </Block>

      <Block label="VenueHighlightCard & StableLifeCard">
        <div className="grid gap-5 md:grid-cols-3">
          {VENUES.map((v) => (
            <VenueHighlightCard key={v.name} venue={v} />
          ))}
          {STABLE.map((s) => (
            <StableLifeCard key={s.href} item={s} />
          ))}
        </div>
      </Block>

      <Block label="GalleryMosaic">
        <GalleryMosaic items={GALLERY} />
      </Block>

      <Block label="Breadcrumbs & SectionHeader">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Events", href: "/events" },
            { label: "Merdeka Cup" },
          ]}
        />
        <div className="mt-8">
          <SectionHeader
            eyebrow="Section header"
            title="A composed editorial title block."
            description="Used to introduce sections consistently across the site, with a staircase eyebrow accent."
          />
        </div>
      </Block>

      <PartnerLogoStrip partners={PARTNERS} />

      <NewsletterBand
        title="Never miss a race day."
        description="Race weekend alerts, ticket drops, and stable-side stories — straight to your inbox."
      />

      <CrossSiteEcosystemLinks
        links={[
          {
            label: "Sarga.co",
            href: siteConfig.gatewayUrl,
            external: true,
            description: "The Sarga group gateway and ecosystem overview.",
          },
          {
            label: "Sarga Motorsport",
            href: siteConfig.motorsportUrl,
            external: true,
            description: "The dedicated Sarga Motorsport experience.",
          },
        ]}
      />
    </>
  );
}
