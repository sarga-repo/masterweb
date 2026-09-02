import fs from "node:fs";
import path from "node:path";

import type { Core } from "@strapi/strapi";
import { isMotorsportLegacyContentRetired } from "./migrations/motorsport-legacy-retirement";

/**
 * Local development seed.
 *
 * Runs from the bootstrap lifecycle when SEED_DEMO_CONTENT=true. It is
 * idempotent: shared collections are created only when empty, while stable
 * registry/profile records are matched by slug or name before additive updates,
 * so repeated container restarts never duplicate records.
 *
 * Content mirrors the frontend mock fallback
 * (frontend-gateway/src/lib/mock-data.ts) so CMS-backed and fallback rendering stay
 * consistent. Placeholder media from data/seed-media (extracted from the
 * visual reference package) is uploaded and attached to records whose image
 * fields are still empty; official assets can replace them in the admin.
 */

/** Read permissions granted to the public role for frontend fetching. */
const PUBLIC_READ_ACTIONS = [
  "api::motorsport-theme-settings.motorsport-theme-settings.find",
  "api::motorsport-theme-settings.motorsport-theme-settings.findOne",
  "api::homepage.homepage.find",
  "api::ecosystem-business.ecosystem-business.find",
  "api::ecosystem-business.ecosystem-business.findOne",
  "api::news-article.news-article.find",
  "api::news-article.news-article.findOne",
  "api::motorsport-news-article.motorsport-news-article.find",
  "api::motorsport-news-article.motorsport-news-article.findOne",
  "api::event.event.find",
  "api::event.event.findOne",
  // Multisite content types (Phase 2)
  "api::site.site.find",
  "api::site.site.findOne",
  "api::partner.partner.find",
  "api::partner.partner.findOne",
  "api::ticket-cta.ticket-cta.find",
  "api::ticket-cta.ticket-cta.findOne",
  "api::motorsport-ticket-cta.motorsport-ticket-cta.find",
  "api::motorsport-ticket-cta.motorsport-ticket-cta.findOne",
  "api::media-gallery.media-gallery.find",
  "api::media-gallery.media-gallery.findOne",
  // Site pages and Motorsport revamp program content (MSR-2)
  "api::site-page.site-page.find",
  "api::site-page.site-page.findOne",
  "api::motorsport-home-page.motorsport-home-page.find",
  "api::motorsport-home-page.motorsport-home-page.findOne",
  "api::motorsport-about-page.motorsport-about-page.find",
  "api::motorsport-about-page.motorsport-about-page.findOne",
  "api::motorsport-events-page.motorsport-events-page.find",
  "api::motorsport-events-page.motorsport-events-page.findOne",
  "api::motorsport-news-page.motorsport-news-page.find",
  "api::motorsport-news-page.motorsport-news-page.findOne",
  "api::motorsport-gallery-page.motorsport-gallery-page.find",
  "api::motorsport-gallery-page.motorsport-gallery-page.findOne",
  "api::motorsport-merchandise-page.motorsport-merchandise-page.find",
  "api::motorsport-merchandise-page.motorsport-merchandise-page.findOne",
  "api::motorsport-tickets-page.motorsport-tickets-page.find",
  "api::motorsport-tickets-page.motorsport-tickets-page.findOne",
  "api::motorsport-contact-page.motorsport-contact-page.find",
  "api::motorsport-contact-page.motorsport-contact-page.findOne",
  "api::motorsport-partners-page.motorsport-partners-page.find",
  "api::motorsport-partners-page.motorsport-partners-page.findOne",
  "api::motorsport-experience-page.motorsport-experience-page.find",
  "api::motorsport-experience-page.motorsport-experience-page.findOne",
  "api::motorsport-program.motorsport-program.find",
  "api::motorsport-program.motorsport-program.findOne",
  "api::motorsport-rider.motorsport-rider.find",
  "api::motorsport-rider.motorsport-rider.findOne",
  "api::motorsport-standing.motorsport-standing.find",
  "api::motorsport-standing.motorsport-standing.findOne",
  "api::motorsport-regulation.motorsport-regulation.find",
  "api::motorsport-regulation.motorsport-regulation.findOne",
  "api::merchandise-item.merchandise-item.find",
  "api::merchandise-item.merchandise-item.findOne",
  // Corporate record (About page)
  "api::timeline-item.timeline-item.find",
  "api::timeline-item.timeline-item.findOne",
  "api::leadership-person.leadership-person.find",
  "api::leadership-person.leadership-person.findOne",
  "api::corporate-report.corporate-report.find",
  "api::corporate-report.corporate-report.findOne",
  "api::job-vacancy.job-vacancy.find",
  "api::job-vacancy.job-vacancy.findOne",
  "api::top-navigation-item.top-navigation-item.find",
  "api::top-navigation-item.top-navigation-item.findOne",
];

/** Multisite Site registry (Phase 2). */
const SITES = [
  {
    name: "Sarga Gateway",
    slug: "sarga-gateway",
    baseUrl: "http://localhost:3000",
    description:
      "Sarga.co group gateway - the corporate ecosystem entry point.",
    themeKey: "gateway",
    order: 1,
    isActive: true,
  },
  {
    name: "Sarga Motorsport",
    slug: "sarga-motorsport",
    baseUrl: "http://localhost:3001",
    description: "Dedicated Sarga Motorsport website.",
    themeKey: "motorsport",
    showLanguageSelector: true,
    order: 2,
    isActive: true,
  },
  {
    name: "Sarga Horse Sport",
    slug: "sarga-horse-sport",
    baseUrl: "http://localhost:3002",
    description: "Dedicated Sarga Horse Sport website.",
    themeKey: "horsesport",
    order: 3,
    isActive: true,
  },
];

const TOP_NAVIGATION_ITEMS = [
  {
    siteScope: "gateway",
    internalName: "gateway-about",
    label: "About",
    labelId: "Tentang Kami",
    href: "/about",
    displayOrder: 10,
  },
  {
    siteScope: "gateway",
    internalName: "gateway-ecosystem",
    label: "360° Ecosystem",
    labelId: "Ekosistem 360°",
    href: "/ecosystem",
    displayOrder: 20,
  },
  {
    siteScope: "gateway",
    internalName: "gateway-news",
    label: "News & Publication",
    labelId: "Berita & Publikasi",
    href: "/news",
    displayOrder: 30,
  },
  {
    siteScope: "gateway",
    internalName: "gateway-careers",
    label: "Careers",
    labelId: "Karier",
    href: "/careers",
    displayOrder: 40,
  },
  {
    siteScope: "gateway",
    internalName: "gateway-contact",
    label: "Get in Touch",
    labelId: "Hubungi Kami",
    href: "/contact",
    displayOrder: 50,
  },
  {
    siteScope: "gateway",
    internalName: "gateway-ticket-hub",
    label: "Ticket Hub",
    labelId: "Pusat Tiket",
    href: "/ticket-hub",
    displayOrder: 60,
    emphasis: "primaryCta",
  },
  ...[
    ["home", "Home", "Beranda", "/"],
    ["about", "About", "Tentang", "/about"],
    ["event", "Event", "Acara", "/events"],
    ["news", "News", "Berita", "/news"],
    ["gallery", "Gallery", "Galeri", "/gallery"],
    ["merchandise", "Merchandise", "Merchandise", "/merchandise"],
    ["contact", "Contact", "Kontak", "/contact"],
    ["ticket", "Ticket", "Tiket", "/tickets"],
  ].map(([key, label, labelId, href], index) => ({
    siteScope: "motorsport",
    internalName: `motorsport-${key}`,
    label,
    labelId,
    href,
    displayOrder: (index + 1) * 10,
    ...(key === "ticket" ? { emphasis: "primaryCta" } : {}),
  })),
  ...[
    ["about", "About", "Tentang", "/about"],
    ["events", "Events", "Acara", "/events"],
    ["tickets", "Tickets", "Tiket", "/tickets"],
    ["news", "News", "Berita", "/news"],
    ["gallery", "Gallery", "Galeri", "/gallery"],
    ["venues", "Venues", "Venue", "/venues"],
    ["contact", "Contact", "Kontak", "/contact"],
  ].map(([key, label, labelId, href], index) => ({
    siteScope: "horsesport",
    internalName: `horsesport-${key}`,
    label,
    labelId,
    href,
    displayOrder: (index + 1) * 10,
    ...(key === "tickets" ? { emphasis: "primaryCta" } : {}),
  })),
] as const;

const HOMEPAGE = {
  heroEyebrow: "360° Sports & Entertainment Leader",
  heroTitle: "The Leader in 360° Sport & Entertainment",
  heroDescription:
    "Sarga.co operates as a highly integrated national powerhouse. We unify elite horse sports, high-performance motorsport tracks, live entertainment festivals, media rights, and modern ticketing platforms into a singular, highly efficient ecosystem.",
  primaryCtaLabel: "Explore Ecosystem",
  primaryCtaUrl: "/ecosystem",
  secondaryCtaLabel: "Corporate Root",
  secondaryCtaUrl: "/about",
  aboutSummaryTitle: "About",
  aboutSummaryBody:
    "Sarga Group operates as the direct holding governance overseeing premier tracks, entertainment production, and sustainable sports infrastructure in Indonesia.",
};

const ECOSYSTEM_BUSINESSES = [
  {
    name: "Sarga Horse Sport",
    slug: "sarga-horse-sport",
    pillar: "sports",
    shortDescription:
      "Organizer of premium national horse derbies, showcasing elite jockeys and managing strict veterinary compliance protocols.",
    overview:
      "Sarga Horse Sport formulates premium national race classifications, elite jockey programs, and strict veterinary compliance protocols across Indonesian horse sport.",
    ctaLabel: "Find Out More",
    businessStatus: "active",
    siteScope: "shared",
    dedicatedSiteKey: "horsesport",
    dedicatedSiteUrl: "http://localhost:3002",
    order: 1,
  },
  {
    name: "Sarga Motorsport",
    slug: "sarga-motorsport",
    pillar: "sports",
    shortDescription:
      "Constructing high-stakes tarmac motorsport series and touring car cups that attract global racing associations.",
    overview:
      "Sarga Motorsport constructs high-stakes tarmac series and touring car cups, pairing circuit development with international racing partnerships.",
    ctaLabel: "Find Out More",
    businessStatus: "active",
    siteScope: "shared",
    dedicatedSiteKey: "motorsport",
    dedicatedSiteUrl: "http://localhost:3001",
    order: 2,
  },
  {
    name: "Sarga Venues",
    slug: "sarga-venues",
    pillar: "venue",
    shortDescription:
      "Developing and restoring championship-grade tracks, stables, and spectator venues for world-class events.",
    overview:
      "Sarga Venues develops, restores, and operates sporting destinations where technical performance, audience movement, hospitality, safety, and long-term community value are planned as one experience.",
    highlights: [
      {
        label: "Development",
        title: "Championship-ready infrastructure",
        description:
          "Track, turf, stable, paddock, and spectator systems are planned against demanding sporting and safety requirements.",
      },
      {
        label: "Operations",
        title: "One venue command layer",
        description:
          "Event control, guest movement, hospitality, maintenance, and partner delivery are coordinated through one operating standard.",
      },
      {
        label: "Legacy",
        title: "Places designed to endure",
        description:
          "Commercial utility, local participation, and responsible development extend venue value beyond a single event calendar.",
      },
    ],
    ctaLabel: "Coming Soon",
    businessStatus: "comingSoon",
    pageAvailability: {
      pageEnabled: false,
      comingSoonEyebrow: "Sarga Venues / In development",
      comingSoonTitle: "A new stage is taking shape.",
      comingSoonDescription:
        "Sarga Venues is preparing a dedicated home for its venue, track, stable, and spectator-infrastructure portfolio.",
      launchTargetLabel: "Launch timing to be announced",
      showNotifyCta: true,
      noIndexWhileDisabled: true,
    },
    siteScope: "gateway",
    order: 3,
  },
  {
    name: "Sarga Media",
    slug: "sarga-media",
    pillar: "media",
    shortDescription:
      "Broadcast, editorial, and media-rights operations amplifying every Sarga property across channels.",
    overview:
      "Sarga Media turns live sport, entertainment, and ecosystem intelligence into editorial products, broadcast coverage, rights packages, and brand stories designed for audiences across channels.",
    highlights: [
      {
        label: "Broadcast",
        title: "Live coverage built around the moment",
        description:
          "Production planning, race-day and event feeds, and distribution workflows carry the atmosphere beyond the venue.",
      },
      {
        label: "Editorial",
        title: "One network of credible stories",
        description:
          "Newsroom, documentary, social, and partner formats give every Sarga property a consistent but distinctive voice.",
      },
      {
        label: "Rights",
        title: "Media value made legible",
        description:
          "Structured inventory and audience insight support responsible rights, sponsorship, and commercial partnerships.",
      },
    ],
    ctaLabel: "Coming Soon",
    businessStatus: "comingSoon",
    pageAvailability: {
      pageEnabled: false,
      comingSoonEyebrow: "Sarga Media / In development",
      comingSoonTitle: "The network is preparing to broadcast.",
      comingSoonDescription:
        "Sarga Media is building its dedicated editorial, broadcast, production, and media-rights destination.",
      launchTargetLabel: "Launch timing to be announced",
      showNotifyCta: true,
      noIndexWhileDisabled: true,
    },
    siteScope: "gateway",
    order: 4,
  },
  {
    name: "Sarga Tech",
    slug: "sarga-tech",
    pillar: "technology",
    shortDescription:
      "Ticketing platforms and live data technology powering seamless fan experiences across the ecosystem.",
    overview:
      "Sarga Tech connects ticket discovery, venue access, live information, audience services, and operational data so each Sarga experience can feel simple to enter and dependable to operate.",
    highlights: [
      {
        label: "Access",
        title: "A clearer path from interest to entry",
        description:
          "Connected discovery and approved partner-ticketing journeys reduce friction without creating an internal checkout engine.",
      },
      {
        label: "Operations",
        title: "Live information where teams need it",
        description:
          "Shared operational signals support venue teams, event control, content workflows, and audience communication.",
      },
      {
        label: "Intelligence",
        title: "Responsible audience understanding",
        description:
          "Consent-aware data practices help teams improve programming, service quality, and partner reporting across the group.",
      },
    ],
    ctaLabel: "Coming Soon",
    businessStatus: "comingSoon",
    pageAvailability: {
      pageEnabled: false,
      comingSoonEyebrow: "Sarga Tech / In development",
      comingSoonTitle: "The connected layer is coming online.",
      comingSoonDescription:
        "Sarga Tech is preparing a dedicated view of the ticketing, audience, and live-data systems supporting the ecosystem.",
      launchTargetLabel: "Launch timing to be announced",
      showNotifyCta: true,
      noIndexWhileDisabled: true,
    },
    siteScope: "gateway",
    order: 5,
  },
];

const NEWS_ARTICLES = [
  {
    title: "Sarga Cup Merdeka Series Achieves Spectator Benchmarks",
    slug: "sarga-cup-merdeka-series",
    excerpt:
      "Over 200 thousand horse racing enthusiasts and digital spectators tuned in to our multi-angle broadcast experience.",
    body: "Over 200 thousand horse racing enthusiasts and digital spectators tuned in to our multi-angle broadcast experience across the Sarga Cup Merdeka Series. The series set new national benchmarks for attendance, digital engagement, and broadcast reach.",
    category: "news",
    publishedDate: "2025-07-24",
    isHotTopic: true,
    siteScope: "gateway",
    showOnGateway: true,
    showOnMotorsport: false,
  },
  {
    title:
      "Sarga Group Signs MoU With Regional Tourism Portfolios for Turf Track",
    slug: "sarga-group-mou-turf-track",
    excerpt:
      "PT Sarga Multi Ekosistem commits to multi-year investments designing high-performance racing venues and destinations.",
    body: "PT Sarga Multi Ekosistem has signed a memorandum of understanding with regional tourism portfolios, committing to multi-year investments in high-performance racing venues and integrated sport-tourism destinations.",
    category: "press-release",
    publishedDate: "2025-10-12",
    isHotTopic: false,
    siteScope: "gateway",
    showOnGateway: true,
    showOnMotorsport: false,
  },
  {
    title: "Inside the Stable: Elite Jockey Lifestyles and Equine Biology",
    slug: "inside-the-stable-elite-jockey",
    excerpt:
      "An editorial review covering veterinary nutrition formulas, physical track conditioning, and daily jockey routines.",
    body: "An editorial review covering veterinary nutrition formulas, physical track conditioning, and the daily routines that shape elite jockey performance across the Sarga network.",
    category: "magazine",
    publishedDate: "2025-07-24",
    isHotTopic: false,
    siteScope: "gateway",
    showOnGateway: true,
    showOnMotorsport: false,
  },
];

const EVENTS = [
  {
    title: "Sarga Championship Weekend",
    slug: "sample-event",
    description:
      "A flagship weekend connecting elite horse sport, motorsport showcases, live entertainment, and premium hospitality.",
    eventDate: "2026-09-19T09:00:00.000Z",
    endDate: "2026-09-20T21:00:00.000Z",
    venue: "Sarga Integrated Sporting Grounds, Indonesia",
    ticketCtaLabel: "Partner tickets coming soon",
    ticketIntegrationType: "redirect",
    eventStatus: "upcoming",
    // Shared: eligible for both frontends; gateway shows it as a teaser.
    siteScope: "shared",
    showOnGateway: true,
    showOnMotorsport: true,
  },
];

const TIMELINE_ITEMS = [
  {
    year: "2023",
    label: "Concept Formulation",
    title: "Groundwork of PT Sarga Multi Ekosistem",
    description:
      "Sarga was conceptualized to solve fragmented infrastructure across equine and motorsport categories through a centralized holding portfolio.",
    order: 1,
  },
  {
    year: "2024",
    label: "Event Synergies",
    title: "First Major Festivals & Digital Broadcasts",
    description:
      "Initial motorsport trials and equestrian derbies were paired with multi-platform digital broadcasting rights, serving more than half a million viewers.",
    order: 2,
  },
  {
    year: "2025",
    label: "Venue Development",
    title: "An Integrated Venue Network",
    description:
      "Collaborative development brought together modern tracks, lifestyle destinations, and high-performance sports infrastructure.",
    order: 3,
  },
];

const LEADERSHIP_PEOPLE = [
  {
    name: "Farry Ongko Widjaja",
    role: "President Director",
    summary:
      "Provides group-level direction across Sarga sporting properties, partnerships, and long-term growth.",
    group: "board",
    order: 1,
    siteScope: "shared",
  },
  {
    name: "Diana Airin",
    role: "Chief Operating Officer",
    summary:
      "Leads operating alignment across event delivery, audience experience, and cross-site execution.",
    group: "executive",
    order: 2,
    siteScope: "shared",
  },
  {
    name: "Nugdha Achadie",
    role: "Chief Financial Officer",
    summary:
      "Oversees financial governance, investment discipline, and sustainable programme development.",
    group: "executive",
    order: 3,
    siteScope: "shared",
  },
  {
    name: "Zaki Maulani",
    role: "Head of Partnerships",
    summary:
      "Builds strategic relationships with rights holders, sponsors, venues, and institutional partners.",
    group: "executive",
    order: 4,
    siteScope: "shared",
  },
  {
    name: "Aseanto Oudang",
    role: "Head of Technology",
    summary:
      "Guides the shared digital platforms, data systems, and technology supporting every Sarga property.",
    group: "executive",
    order: 5,
    siteScope: "shared",
  },
  {
    name: "Samsul Purba",
    role: "Head of Operations",
    summary:
      "Leads operational readiness across venues, race weekends, logistics, and live-event delivery.",
    group: "executive",
    order: 6,
    siteScope: "shared",
  },
];

/**
 * Motorsport demo set (Phase 2). Demonstrates site-aware querying:
 * motorsport-scoped content that is also flagged for a gateway teaser.
 */
const MOTORSPORT_PARTNERS = [
  {
    name: "Apex Fuels",
    slug: "apex-fuels",
    websiteUrl: "https://example.com",
    partnerType: "sponsor",
    siteScope: "motorsport",
    sortOrder: 1,
    isActive: true,
  },
  {
    name: "Velocity Tyres",
    slug: "velocity-tyres",
    websiteUrl: "https://example.com",
    partnerType: "technical",
    siteScope: "motorsport",
    sortOrder: 2,
    isActive: true,
  },
  {
    name: "Gridline Broadcasting",
    slug: "gridline-broadcasting",
    websiteUrl: "https://example.com",
    partnerType: "media",
    siteScope: "motorsport",
    sortOrder: 3,
    isActive: true,
  },
];

const MOTORSPORT_EVENTS = [
  {
    title: "Sarga Grand Prix - Night Race",
    slug: "sarga-grand-prix-night-race",
    description:
      "The headline round of the Sarga Touring Cup under floodlights: qualifying heat, support races, and a full night-race spectacle.",
    eventDate: "2026-11-14T12:00:00.000Z",
    endDate: "2026-11-14T22:00:00.000Z",
    venue: "Sarga International Circuit",
    circuitName: "Sarga International Circuit",
    venueAddress: "Sentul, West Java, Indonesia",
    racingCategory: "Touring Car",
    seriesName: "Sarga Touring Cup",
    broadcastUrl: "https://example.com/live",
    eventStatus: "ticketsOpen",
    ticketCtaLabel: "Buy Tickets",
    ticketIntegrationType: "redirect",
    siteScope: "motorsport",
    showOnGateway: true,
    showOnMotorsport: true,
  },
  {
    title: "Superbike Night Sessions",
    slug: "superbike-night-sessions",
    description:
      "High-speed superbike action under the floodlights at Mandalika. Three days of qualifying, support races, and the main event.",
    eventDate: "2026-10-04T10:00:00.000Z",
    endDate: "2026-10-06T22:00:00.000Z",
    venue: "Mandalika International Street Circuit",
    circuitName: "Mandalika International Street Circuit",
    venueAddress: "Lombok, West Nusa Tenggara, Indonesia",
    racingCategory: "Superbike",
    seriesName: "Sarga Motorcycle Series",
    broadcastUrl: "https://example.com/live",
    eventStatus: "announced",
    ticketCtaLabel: "Register Interest",
    ticketIntegrationType: "redirect",
    siteScope: "motorsport",
    showOnGateway: false,
    showOnMotorsport: true,
  },
  {
    title: "GT Endurance Challenge",
    slug: "gt-endurance-challenge",
    description:
      "A 12-hour endurance race pairing professional GT3 machinery with amateur drivers. A test of machine and human resilience.",
    eventDate: "2026-11-22T06:00:00.000Z",
    endDate: "2026-11-22T18:00:00.000Z",
    venue: "Sentul International Circuit",
    circuitName: "Sentul International Circuit",
    venueAddress: "Sentul, West Java, Indonesia",
    racingCategory: "GT",
    seriesName: "Sarga Motorsport Series",
    eventStatus: "announced",
    ticketCtaLabel: "Coming Soon",
    ticketIntegrationType: "redirect",
    siteScope: "motorsport",
    showOnGateway: false,
    showOnMotorsport: true,
  },
  {
    title: "Moto Festival Weekend",
    slug: "moto-festival-weekend",
    description:
      "A full weekend of motorcycle racing culture - Moto2 support races, stunt shows, paddock access, and live music stages.",
    eventDate: "2026-12-13T08:00:00.000Z",
    endDate: "2026-12-14T22:00:00.000Z",
    venue: "Mandalika International Street Circuit",
    circuitName: "Mandalika International Street Circuit",
    venueAddress: "Lombok, West Nusa Tenggara, Indonesia",
    racingCategory: "Moto2",
    seriesName: "Sarga Motorcycle Series",
    eventStatus: "ticketsOpen",
    ticketCtaLabel: "Buy Tickets",
    ticketIntegrationType: "redirect",
    siteScope: "motorsport",
    showOnGateway: true,
    showOnMotorsport: true,
  },
  {
    title: "FIA Rallycross World Cup Indonesia 2026",
    slug: "fia-rallycross-world-cup-indonesia-2026",
    description:
      "First Time, Wild Action, Closer Than Ever. FIA Rallycross comes to Indonesia for a two-day world-class race and fan experience.",
    eventDate: "2026-12-05T02:00:00.000Z",
    endDate: "2026-12-06T11:00:00.000Z",
    venue: "Jakarta International E-Prix Circuit",
    circuitName: "Jakarta International E-Prix Circuit",
    venueAddress: "Ancol, North Jakarta, Indonesia",
    racingCategory: "Rallycross",
    seriesName: "FIA Rallycross World Cup",
    eventStatus: "ticketsOpen",
    ticketCtaLabel: "Get Your Ticket Now",
    ticketIntegrationType: "redirect",
    siteScope: "motorsport",
    showOnGateway: true,
    showOnMotorsport: true,
  },
];

const MOTORSPORT_TICKET_CTAS = [
  {
    title: "Sarga Grand Prix - Night Race Tickets",
    label: "Buy Tickets",
    provider: "Partner Ticketing",
    ctaType: "redirect",
    url: "https://example.com/tickets/sarga-grand-prix",
    isActive: true,
    siteScope: "motorsport",
    relatedEventSlug: "sarga-grand-prix-night-race",
  },
  {
    title: "Moto Festival Weekend Tickets",
    label: "Get Passes",
    provider: "Partner Ticketing",
    ctaType: "redirect",
    url: "https://example.com/tickets/moto-festival",
    isActive: true,
    siteScope: "motorsport",
    relatedEventSlug: "moto-festival-weekend",
  },
  {
    title: "FIA Rallycross World Cup Indonesia 2026 Tickets",
    label: "Get Your Ticket Now",
    provider: "Official Ticketing Partner",
    ctaType: "redirect",
    url: "https://example.com/tickets/fia-rallycross-indonesia-2026",
    activeFrom: "2026-08-08T00:00:00.000Z",
    activeUntil: "2026-12-06T11:00:00.000Z",
    isActive: true,
    siteScope: "motorsport",
    relatedEventSlug: "fia-rallycross-world-cup-indonesia-2026",
  },
];

const MOTORSPORT_NEWS = [
  {
    title: "Sarga Motorsport Unveils Night Race Series",
    slug: "sarga-motorsport-night-race-series",
    excerpt:
      "A new floodlit touring car series brings cinematic night racing to the Sarga International Circuit.",
    body: "Sarga Motorsport has unveiled a floodlit night race series, pairing professional touring car competition with a full lifestyle event program at the Sarga International Circuit.",
    category: "announcement",
    publishedDate: "2026-08-01",
    isHotTopic: true,
    siteScope: "motorsport",
    showOnGateway: true,
    showOnMotorsport: true,
    featuredOnMotorsport: true,
  },
  {
    title: "The Line Between Control and Chaos",
    slug: "the-line-between-control-and-chaos",
    excerpt:
      "Inside the cockpit of Sarga's opening race weekend - a masterclass in pressure, precision, and the fine art of going fast.",
    body: "Inside the cockpit of Sarga's opening race weekend. A masterclass in pressure, precision, and the fine art of going fast - told through the voices of the drivers who lived it.",
    category: "race-report",
    publishedDate: "2026-07-02",
    isHotTopic: false,
    siteScope: "motorsport",
    showOnGateway: false,
    showOnMotorsport: true,
  },
  {
    title: "Riders Rewrite the Racing Line",
    slug: "riders-rewrite-the-racing-line",
    excerpt:
      "How Indonesia's fastest riders are reshaping the sport - one apex at a time.",
    body: "How Indonesia's fastest riders are reshaping the sport - one apex at a time. From junior categories to the international stage, a new generation is redefining what it means to race.",
    category: "magazine",
    publishedDate: "2026-06-28",
    isHotTopic: false,
    siteScope: "motorsport",
    showOnGateway: false,
    showOnMotorsport: true,
  },
  {
    title: "Building the 360° Racing Ecosystem",
    slug: "building-the-360-racing-ecosystem",
    excerpt:
      "From track to grandstand to livestream - how Sarga is engineering an entire motorsport experience.",
    body: "From track to grandstand to livestream - how Sarga is engineering an entire motorsport experience. Infrastructure, broadcast, hospitality, and fan engagement, all under one roof.",
    category: "magazine",
    publishedDate: "2026-06-15",
    isHotTopic: false,
    siteScope: "motorsport",
    showOnGateway: false,
    showOnMotorsport: true,
  },
];

/** Gallery entries for the motorsport gallery page. */
const MOTORSPORT_GALLERIES = [
  {
    title: "Galerry",
    slug: "media-gallery",
    description: "Trackside photography from Sarga Motorsport events.",
    category: "circuit",
    siteScope: "motorsport",
  },
];

/** Site-scoped pages required by the Motorsport revamp. */
const MOTORSPORT_SITE_PAGES = [
  {
    title: "Sarga Motorsport Campaign Presentation",
    slug: "motorsport-rallycross-presentation",
    routePath: "/campaign/fia-rallycross-world-cup-indonesia-2026",
    siteScope: "motorsport",
    pageKind: "campaign",
    navigationLabel: "FIA Rallycross",
    sections: [
      { __component: "shared.page-section", sectionKey: "world-cup-control", eyebrow: "World Cup control / Jakarta", title: "FIA Rallycross World Cup Indonesia 2026", body: "Two days of explosive starts, mixed-surface strategy, and a compact race format that keeps every spectator close to the decisive action." },
      { __component: "shared.page-section", sectionKey: "format", eyebrow: "Mixed surface / Maximum pressure", title: "Every heat changes the order.", body: "Rallycross compresses starts, contact, strategy, and elimination into a format designed for immediate spectator energy." },
      { __component: "shared.page-section", sectionKey: "rundown", eyebrow: "5-6 December 2026", title: "Two days. One World Cup.", body: "Session times are managed in the Sarga CMS and remain subject to sporting or operational updates." },
      { __component: "shared.page-section", sectionKey: "race-day-guide", eyebrow: "Race-day essentials", title: "Know before you go.", body: "A practical spectator guide for a smooth arrival and a safe, high-energy weekend at the circuit." },
      { __component: "shared.page-section", sectionKey: "campaign-ticket", eyebrow: "Official ticketing", title: "First time. Be there for the first launch.", body: "Review availability before continuing to the approved ticketing partner. Sarga Motorsport does not process checkout or payment on this website." },
    ],
  },
  {
    title: "Sarga Motorsport Contact",
    slug: "motorsport-contact",
    routePath: "/contact",
    siteScope: "motorsport",
    pageKind: "custom",
    navigationLabel: "Contact",
    heroTitle: "Contact",
    heroDescription:
      "Partnership proposals, media requests, ticket support, or a question about Sarga Motorsport. We read every message.",
    sections: [
      { __component: "shared.page-section", sectionKey: "inquiry-control", eyebrow: "Inquiry control / Direct routing", title: "One form. The right team.", body: "Choose the closest inquiry type and the message is routed to the Motorsport team responsible for it." },
      { __component: "shared.page-section", sectionKey: "inquiry-form", eyebrow: "Inquiry form", title: "Send a signal." },
    ],
  },
  {
    title: "Sarga Motorsport Partners",
    slug: "motorsport-partners",
    routePath: "/partners",
    siteScope: "motorsport",
    pageKind: "custom",
    navigationLabel: "Partners",
    heroTitle: "Partners",
    heroDescription: "The brands and organisations fuelling the Sarga Motorsport ecosystem. Together we build the stage for Indonesia's most ambitious racing platform.",
    sections: [
      { __component: "shared.page-section", sectionKey: "partner-control", eyebrow: "Partner control / Shared platform", title: "One grid. Shared ambition.", body: "The partner network supports competition, event delivery, audience experience, and long-term talent development." },
      { __component: "shared.page-section", sectionKey: "partner-network", eyebrow: "Official partners", title: "The grid.", body: "Published partner records come from the shared CMS and remain scoped to the Motorsport site." },
    ],
  },
  {
    title: "Sarga Motorsport Tickets",
    slug: "motorsport-tickets",
    routePath: "/tickets",
    siteScope: "motorsport",
    pageKind: "custom",
    navigationLabel: "Tickets",
    heroTitle: "Tickets",
    heroDescription: "Sarga Motorsport partners with approved ticketing platforms. Every CTA below redirects to a secure partner checkout - we never process payment directly.",
    sections: [
      { __component: "shared.page-section", sectionKey: "ticket-control", eyebrow: "Ticket control / Partner routing", title: "Your seat. Their secure checkout.", body: "Sarga Motorsport publishes approved destinations but never stores payment details or runs an internal ticket engine." },
      { __component: "shared.page-section", sectionKey: "featured-ticket", eyebrow: "Featured ticket", title: "Secure your seat.", body: "Checkout is handled by our approved ticketing partner. Secure payment, guaranteed entry, zero markup." },
      { __component: "shared.page-section", sectionKey: "ticketed-events", eyebrow: "Events with tickets available", title: "On sale now.", body: "Published Motorsport events with an approved external ticket destination." },
      { __component: "shared.page-section", sectionKey: "ticket-info", eyebrow: "Ticket support", title: "How it works.", body: "Select an event and continue securely to its approved ticketing partner. Contact the Motorsport desk for event-specific support." },
    ],
  },
  {
    title: "Sarga Motorsport Gallery",
    slug: "motorsport-gallery",
    routePath: "/gallery",
    siteScope: "motorsport",
    pageKind: "custom",
    navigationLabel: "Gallery",
    heroTitle: "Gallery",
    heroDescription: "Circuit, rally, motorcycle, paddock, people, and fan energy - one bright visual record of Motorsport in motion.",
    sections: [
      { __component: "shared.page-section", sectionKey: "gallery-intro", eyebrow: "Trackside capture feed", title: "Gallery control", body: "Trackside photography from Sarga Motorsport - racing, paddock, people, and fan energy captured in motion." },
      { __component: "shared.page-section", sectionKey: "gallery-archive", eyebrow: "SYS / Gallery / Published media", title: "Motion, recorded.", body: "Filter the archive by discipline. Select any frame to open the full-screen viewer, then browse with the arrow controls." },
    ],
  },
  {
    title: "Sarga Motorsport News",
    slug: "motorsport-news",
    routePath: "/news",
    siteScope: "motorsport",
    pageKind: "newsHub",
    navigationLabel: "News",
    heroTitle: "News",
    heroDescription:
      "Race reports, rider profiles, technical detail, and the culture moving Indonesian motorsport forward.",
    sections: [
      {
        __component: "shared.page-section",
        sectionKey: "news-control",
        eyebrow: "Editorial control / Motorsport",
        title: "Stories at race pace.",
        body: "Reports, announcements, people, technology, and culture from the Motorsport-scoped editorial feed.",
      },
      {
        __component: "shared.page-section",
        sectionKey: "lead-story",
        eyebrow: "Editorial control / Motorsport",
        title: "Stories at race pace.",
        body: "Reports, announcements, people, technology, and culture from the Motorsport-scoped editorial feed.",
      },
      {
        __component: "shared.page-section",
        sectionKey: "archive-intro",
        eyebrow: "Latest dispatches",
        title: "The archive.",
        body: "Published Motorsport stories, ordered by publication date.",
      },
      {
        __component: "shared.page-section",
        sectionKey: "news-gallery-cta",
        eyebrow: "Visual archive",
        title: "See the machines behind the stories.",
        body: "Continue from the editorial feed into the Motorsport media archive.",
      },
    ],
  },
  {
    title: "Sarga Motorsport Homepage",
    slug: "motorsport-home",
    routePath: "/",
    siteScope: "motorsport",
    pageKind: "home",
    navigationLabel: "Home",
    heroTitle: "Feel the friction.",
    heroDescription:
      "Indonesia's premier motorsport ecosystem: elite racing, unfiltered energy, and an event experience built for those who live for the apex.",
    motorsportInformationBand: {
      enabled: true,
      eyebrow: "Race control / 2026 calendar",
      title: "Closer to the machines. Closer to the moment.",
      description:
        "Professional racing, talent development, and international event campaigns-presented through one focused Motorsport calendar.",
      nextEventLabel: "Next event",
      ticketStatusLabel: "Ticket status",
      regionLabel: "Region",
      regionValue: "Indonesia",
    },
    motorsportWorldSection: {
      enabled: true,
      eyebrow: "A global ecosystem of racing formats",
      titlePrefix: "The world of",
      titleAccent: "Motorsport",
      description:
        "From circuit precision to mixed-surface spectacle, every format is part of one international-standard racing programme.",
      ctaLabel: "Explore the calendar",
      ctaUrl: "/events",
      disciplines: [
        {
          internalName: "circuit-racing",
          enabled: true,
          title: "Circuit racing",
          shortLabel: "Open wheel / Sprint",
          href: "/events",
          accent: "crimson",
          sortOrder: 10,
        },
        {
          internalName: "endurance",
          enabled: true,
          title: "Endurance",
          shortLabel: "GT / Long distance",
          href: "/events",
          accent: "blue",
          sortOrder: 20,
        },
        {
          internalName: "rally",
          enabled: true,
          title: "Rally",
          shortLabel: "Mixed surface / Stage",
          href: "/events",
          accent: "teal",
          sortOrder: 30,
        },
        {
          internalName: "rallycross",
          enabled: true,
          title: "Rallycross",
          shortLabel: "FIA / World Cup",
          href: "/campaign/fia-rallycross-world-cup-indonesia-2026",
          accent: "orange",
          sortOrder: 40,
        },
        {
          internalName: "touring",
          enabled: true,
          title: "Touring",
          shortLabel: "Tin top / Sprint",
          href: "/events",
          accent: "blue",
          sortOrder: 50,
        },
        {
          internalName: "motorcycle",
          enabled: true,
          title: "Motorcycle",
          shortLabel: "Superbike / Road racing",
          href: "/events",
          accent: "yellow",
          sortOrder: 60,
        },
      ],
    },
    motorsportTicketSection: {
      isActive: true,
      eyebrow: "Official ticketing",
      title: "Be there when the grid goes live.",
      description:
        "Choose an event and continue to its approved ticketing destination. Sarga Motorsport does not process checkout directly.",
      eventLabel: "Event",
      eventText: "Race Weekend Indonesia",
      providerLabel: "Provider",
      providerText: "Official Ticketing Partner",
      partnerLabel: "Partner redirect / Secure",
      footerText: "Approved partner destination",
      ctaLabel: "Secure your seat",
      ctaUrl: "/tickets",
    },
    sections: [
      {
        __component: "shared.page-section",
        sectionKey: "upcoming-events",
        enabled: false,
        eyebrow: "Upcoming events",
        title: "The next grid is forming.",
        body: "Feature the next Motorsport events and their approved ticket status.",
      },
      {
        __component: "shared.page-section",
        sectionKey: "latest-news",
        enabled: true,
        eyebrow: "Latest news",
        title: "From the paddock.",
        body: "Surface the latest Motorsport-scoped editorial stories.",
      },
      {
        __component: "shared.page-section",
        sectionKey: "gallery",
        enabled: true,
        eyebrow: "Gallery",
        title: "Motion, recorded.",
        body: "A curated capture feed from the track, paddock, and fan zones.",
      },
      {
        __component: "shared.page-section",
        sectionKey: "connected-records",
        enabled: false,
        eyebrow: "Part of Sarga.co / Connected records",
        title: "Explore the Sarga network.",
        body: "Browse published stories, meet the leadership council, and move directly between the active Sarga websites.",
      },
    ],
  },
  {
    title: "About Sarga Motorsport",
    slug: "motorsport-about",
    routePath: "/about",
    siteScope: "motorsport",
    pageKind: "about",
    navigationLabel: "About",
    heroTitle: "The Adrenaline Alchemist.",
    heroDescription:
      "Sarga Motorsport transforms raw speed into cultural energy through professional racing, event production, community, and media.",
    sections: [
      {
        __component: "shared.page-section",
        sectionKey: "profile",
        title: "Profile",
        body: "Sarga Motorsport is the dedicated racing property within the Sarga ecosystem.",
      },
      {
        __component: "shared.page-section",
        sectionKey: "vision",
        title: "Vision",
        body: "Build a world-class stage for Indonesian motorsport and its next generation.",
      },
      {
        __component: "shared.page-section",
        sectionKey: "what-we-do",
        title: "What We Do",
        body: "Professional competition, event experiences, media, partnerships, and talent development.",
      },
      {
        __component: "motorsport.about-capabilities",
        enabled: true,
        eyebrow: "What we do",
        title: "Competition is the core. Experience completes it.",
        description:
          "Professional competition, event experiences, media, partnerships, and talent development—designed as one connected Motorsport system.",
        cards: [
          {
            internalName: "professional-competition",
            enabled: true,
            title: "Professional competition",
            description:
              "Touring, GT, rallycross, and motorcycle racing delivered to international sporting standards.",
            sortOrder: 1,
            accent: "crimson",
          },
          {
            internalName: "talent-development",
            enabled: true,
            title: "Talent development",
            description:
              "Clear pathways that help Indonesia's next generation of riders and racing professionals progress.",
            sortOrder: 2,
            accent: "orange",
          },
          {
            internalName: "event-experience",
            enabled: true,
            title: "Event experience",
            description:
              "Race weekends shaped through fan access, hospitality, culture, and high-energy live programming.",
            sortOrder: 3,
            accent: "yellow",
          },
          {
            internalName: "media-partnerships",
            enabled: true,
            title: "Media & partnerships",
            description:
              "Broadcast-ready stories and commercial platforms that extend beyond the chequered flag.",
            sortOrder: 4,
            accent: "teal",
          },
        ],
      },
      { __component: "shared.page-section", sectionKey: "operating-idea", eyebrow: "Operating idea", title: "Competition creates the moment.", body: "Competition creates the moment. People, media, hospitality, and development turn it into a lasting Motorsport culture." },
      { __component: "shared.page-section", sectionKey: "team-intro", eyebrow: "Meet the team", title: "The people behind the programme.", body: "Group leadership and operators building the sporting, commercial, and live-event platform." },
      { __component: "shared.page-section", sectionKey: "contact-cta", eyebrow: "Contact us", title: "Start a conversation with race control.", body: "Partnerships, media, event support, talent pathways, and general Motorsport inquiries are routed through the contact desk." },
      { __component: "shared.page-section", sectionKey: "ecosystem-cta", eyebrow: "Part of Sarga.co", title: "One ecosystem. A dedicated racing home.", body: "Sarga.co remains the group gateway. This dedicated site is where Motorsport programmes, events, stories, tickets, and fan culture live in full." },
    ],
  },
  {
    title: "Sarga Motorsport Event Hub",
    slug: "motorsport-event-hub",
    routePath: "/events",
    siteScope: "motorsport",
    pageKind: "eventHub",
    navigationLabel: "Event",
    heroTitle: "Programs with a pulse.",
    heroDescription:
      "Enter the FIA Rallycross World Cup Indonesia 2026 campaign, explore IJTC, and find the next race weekend.",
    sections: [
      {
        __component: "shared.page-section",
        sectionKey: "event-control",
        eyebrow: "Event control / Live index",
        title: "Programmes with a pulse.",
        body: "International campaigns, development pathways, and race weekends - each with clear status and approved ticket routing.",
      },
      {
        __component: "shared.page-section",
        sectionKey: "programmes",
        eyebrow: "Featured pathways",
        title: "Choose your entry point.",
        body: "A world-stage campaign and a national talent-development programme lead the Motorsport calendar.",
      },
      {
        __component: "shared.page-section",
        sectionKey: "calendar",
        eyebrow: "Upcoming events",
        title: "The next grid.",
        body: "Current Motorsport-scoped events, ordered by the live CMS calendar.",
      },
    ],
  },
  {
    title: "FIA Rallycross World Cup Indonesia 2026 Campaign",
    slug: "fia-rallycross-world-cup-indonesia-2026-campaign",
    routePath: "/campaign/fia-rallycross-world-cup-indonesia-2026",
    siteScope: "motorsport",
    pageKind: "campaign",
    navigationLabel: "FIA Rallycross",
    heroTitle: "First Time, Wild Action, Closer Than Ever",
    heroDescription:
      "FIA Rallycross World Cup Indonesia 2026, 5-6 December 2026 at Jakarta International E-Prix Circuit.",
  },
  {
    title: "Sarga Motorsport Merchandise",
    slug: "motorsport-merchandise",
    routePath: "/merchandise",
    siteScope: "motorsport",
    pageKind: "merchandise",
    navigationLabel: "Merchandise",
    heroTitle: "Wear the velocity.",
    heroDescription:
      "Official Sarga Motorsport merchandise previews. Availability is handled by approved partners or inquiry only.",
    sections: [
      { __component: "shared.page-section", sectionKey: "merch-control", eyebrow: "Merch control / No internal commerce", title: "Wear the velocity. Checkout stays with approved partners.", body: "This is a showcase—not a store. Sarga Motorsport does not operate a cart, account, checkout, or payment system." },
      { __component: "shared.page-section", sectionKey: "merchandise-catalog", eyebrow: "Current showcase", title: "Made for the paddock. Ready for the street.", body: "CMS-managed previews make availability explicit before any visitor leaves for a partner destination." },
      { __component: "shared.page-section", sectionKey: "merch-final-cta", eyebrow: "Availability desk", title: "Need release or sizing information?", body: "Send a merchandise inquiry for release, sizing, and approved-store details.", ctaLabel: "Contact merchandise desk", ctaUrl: "/contact" },
    ],
  },
  {
    title: "Sarga Motorsport Experience",
    slug: "motorsport-experience",
    routePath: "/experience",
    siteScope: "motorsport",
    pageKind: "custom",
    navigationLabel: "Experience",
    heroTitle: "Experience",
    heroDescription:
      "Sarga Motorsport is more than what happens on track. It is a festival, a broadcast, a fan community, and a premium venue experience.",
    sections: [
      {
        __component: "shared.page-section",
        sectionKey: "experience-control",
        eyebrow: "Experience control / Complete race weekend",
        title: "Competition is the core. Access completes it.",
        body: "Six connected chapters carry the audience from racing and rider development into culture, coverage, community, and venue experiences.",
      },
      {
        __component: "shared.page-section",
        sectionKey: "experience-pillars",
        eyebrow: "The complete ecosystem",
        title: "Racing is the core. The rest is the culture.",
        body: "Every dimension of the Motorsport experience gets a clear stage.",
      },
      {
        __component: "shared.page-section",
        sectionKey: "experience-track",
        eyebrow: "Two forms of precision",
        title: "Four wheels. Two wheels. One standard.",
        body: "Both programmes share the same commitment to sporting clarity, athlete development, and race-weekend presentation.",
      },
    ],
  },
];

/** Gateway corporate pages introduced by the reference-aligned revamp. */
const GATEWAY_SITE_PAGES = [
  {
    title: "Gateway About",
    slug: "gateway-about",
    routePath: "/about",
    siteScope: "gateway",
    pageKind: "about",
    navigationLabel: "About",
    heroTitle: "One group. Every arena.",
    heroDescription: "Sarga Group operates as the direct holding governance overseeing premier tracks, entertainment production, and sustainable sports infrastructure in Indonesia.",
    sections: [
      { __component: "shared.page-section", sectionKey: "operating-philosophy", eyebrow: "Operating philosophy", title: "Control at the core. Freedom at the edge.", body: "Sarga gives every property room to build its own culture while a shared corporate center protects quality, accountability, and long-term value." },
      { __component: "shared.page-section", sectionKey: "corporate-record", eyebrow: "Corporate record", title: "Built in public. Governed for the long run.", body: "Explore Sarga's formation, leadership publication status, and future corporate reports through one living record." },
    ],
  },
  {
    title: "Gateway Board of Directors",
    slug: "gateway-board-of-directors",
    routePath: "/about/board-of-directors",
    siteScope: "gateway",
    pageKind: "custom",
    navigationLabel: "Board of Directors",
    heroTitle: "Stewardship at every level.",
    heroDescription: "Sarga's board and executive leadership align long-term governance with decisive operating responsibility across the ecosystem.",
    sections: [
      { __component: "shared.page-section", sectionKey: "board-oversight", eyebrow: "Board oversight", title: "Built for the long run.", body: "The board protects Sarga's mandate, governance discipline, and long-term value as the group expands its sporting and entertainment portfolio." },
      { __component: "shared.page-section", sectionKey: "executive-council", eyebrow: "Executive council", title: "Accountability moves close to the work.", body: "The executive council translates group direction into commercial, financial, and operating momentum across every Sarga property." },
      { __component: "shared.page-section", sectionKey: "advisory-council", eyebrow: "Advisory council", title: "Experience around the table.", body: "Advisors contribute specialist and independent perspective without obscuring the group's governance and operating lines." },
    ],
  },
  {
    title: "Gateway Company Structure",
    slug: "gateway-company-structure",
    routePath: "/about/company-structure",
    siteScope: "gateway",
    pageKind: "custom",
    navigationLabel: "Company Structure",
    heroTitle: "One group. Clear lines.",
    heroDescription: "Sarga combines central governance and shared operating standards with focused business units built to lead their own disciplines.",
    sections: [
      { __component: "shared.page-section", sectionKey: "operating-architecture", eyebrow: "Operating architecture", title: "One core. Many operators.", body: "The structure keeps strategic accountability visible while giving every venture the room to build category authority and audience relevance." },
      { __component: "shared.page-section", sectionKey: "corporate-root", eyebrow: "Corporate root", title: "PT Sarga Multi Ekosistem", body: "Holding governance, portfolio strategy, capital stewardship, and the shared standards connecting every operating property." },
    ],
  },
  {
    title: "Gateway Job Vacancies",
    slug: "gateway-job-vacancies",
    routePath: "/careers/jobs",
    siteScope: "gateway",
    pageKind: "custom",
    navigationLabel: "Job Vacancies",
    heroTitle: "Find the work that moves you.",
    heroDescription: "Search current openings across the Sarga ecosystem. Role details are managed by the recruitment team and applications continue securely to LinkedIn.",
    sections: [{ __component: "shared.page-section", sectionKey: "search-roster", eyebrow: "Search the roster", title: "A precise place to begin.", body: "Use a discipline menu, keyword, employment type, and work mode to narrow the current vacancy list." }],
  },
  {
    title: "Get in Touch",
    slug: "gateway-contact",
    routePath: "/contact",
    siteScope: "gateway",
    pageKind: "custom",
    navigationLabel: "Get in Touch",
    heroTitle: "Start with the right signal.",
    heroDescription: "Choose the route that best fits your inquiry. Sarga's group desk will direct approved requests to the right operating team.",
    sections: [{ __component: "shared.page-section", sectionKey: "inquiry-map", eyebrow: "Inquiry map", title: "A direct route into the network.", body: "Choose the closest route below, then give the group desk enough context to connect you with the right operating team." }],
  },
  {
    title: "Careers",
    slug: "gateway-careers",
    routePath: "/careers",
    siteScope: "gateway",
    pageKind: "custom",
    navigationLabel: "Careers",
    heroTitle: "Build what the crowd remembers.",
    heroDescription: "Sarga brings together operators, creators, engineers, and sporting specialists who want to shape experiences at national scale.",
    sections: [{ __component: "shared.page-section", sectionKey: "career-disciplines", eyebrow: "Where you can move", title: "Many disciplines. One standard.", body: "Choose a discipline to see its current opportunity roster, then review each role before continuing to its approved LinkedIn application." }],
  },
  {
    title: "Ticket Hub",
    slug: "gateway-ticket-hub",
    routePath: "/ticket-hub",
    siteScope: "gateway",
    pageKind: "custom",
    navigationLabel: "Ticket Hub",
    heroTitle: "Find the moment. Enter the arena.",
    heroDescription: "Discover Sarga's championship weekends and live experiences. Ticket transactions always continue through approved external partners.",
    sections: [{ __component: "shared.page-section", sectionKey: "upcoming", eyebrow: "Upcoming", title: "Your next live experience starts here.", body: "Event availability and partner ticket links are published only after organizer approval." }],
  },
  {
    title: "Sarga News & Publications",
    slug: "gateway-news",
    routePath: "/news",
    siteScope: "gateway",
    pageKind: "newsHub",
    navigationLabel: "News & Publication",
    heroTitle: "Signals from every arena.",
    heroDescription:
      "Reporting the decisions, performances, partnerships, and people shaping Sarga's integrated sport and entertainment network.",
    sections: [
      {
        __component: "shared.page-section",
        sectionKey: "lead-story",
        eyebrow: "Lead story",
        title: "What the network is watching.",
        body: "The latest high-priority story from across Sarga's businesses and live properties.",
        theme: "dark",
      },
      {
        __component: "shared.page-section",
        sectionKey: "archive-intro",
        eyebrow: "The editorial desk",
        title: "The editorial desk",
        body: "News, publications, press releases, and magazine stories from Sarga.",
        theme: "light",
      },
    ],
  },
  {
    title: "Sarga History",
    slug: "gateway-history",
    routePath: "/about/history",
    siteScope: "gateway",
    pageKind: "history",
    navigationLabel: "History",
    heroTitle: "Built across every arena.",
    heroDescription:
      "A living record of the decisions, partnerships, and operating milestones that shaped Sarga's integrated ecosystem.",
    pageAvailability: {
      pageEnabled: true,
      showNotifyCta: false,
      noIndexWhileDisabled: true,
    },
    sections: [
      {
        __component: "shared.page-section",
        sectionKey: "history-record",
        eyebrow: "Corporate record",
        title: "The group trajectory",
        body: "Published milestones are managed through the shared Timeline Item collection and displayed chronologically.",
        theme: "light",
      },
    ],
  },
  {
    title: "Annual Report",
    slug: "gateway-annual-report",
    routePath: "/about/annual-report",
    siteScope: "gateway",
    pageKind: "reportIndex",
    navigationLabel: "Annual Report",
    heroTitle: "Performance, documented.",
    heroDescription:
      "Approved annual reports and corporate performance publications from the Sarga ecosystem.",
    pageAvailability: {
      pageEnabled: true,
      showNotifyCta: false,
      noIndexWhileDisabled: true,
    },
    sections: [
      {
        __component: "shared.page-section",
        sectionKey: "annual-report-library",
        eyebrow: "Annual reporting",
        title: "Approved publications",
        body: "No annual report file is published yet. Approved files and external report destinations will appear here when supplied through Strapi.",
        theme: "light",
      },
    ],
  },
  {
    title: "Sustainability Report",
    slug: "gateway-sustainability-report",
    routePath: "/about/sustainability-report",
    siteScope: "gateway",
    pageKind: "reportIndex",
    navigationLabel: "Sustainability Report",
    heroTitle: "Progress with a longer horizon.",
    heroDescription:
      "Approved sustainability reporting across sport, venues, operations, communities, and responsible growth.",
    pageAvailability: {
      pageEnabled: true,
      showNotifyCta: false,
      noIndexWhileDisabled: true,
    },
    sections: [
      {
        __component: "shared.page-section",
        sectionKey: "sustainability-report-library",
        eyebrow: "Sustainability reporting",
        title: "Commitments and evidence",
        body: "No sustainability report file is published yet. Approved reports will appear here when supplied through Strapi.",
        theme: "light",
      },
    ],
  },
];

/** Warm editorial homepage carousel assets introduced in MSR-RD3. */
const MOTORSPORT_HOME_HERO_SLIDES = [
  {
    file: "sarga-motorsport-hero-circuit-golden-hour.jpg",
    mobileFile: "sarga-motorsport-hero-circuit-golden-hour-mobile.jpg",
    alt: "Red and orange touring race car accelerating through a tropical circuit at golden hour",
    internalName: "Circuit - Golden Hour",
    eyebrow: "Sarga Motorsport / Season 2026",
    title: "Feel the friction.",
    description:
      "World-class competition, human precision, and race weekends built to bring Indonesia closer to the action.",
    imageAlt:
      "Red and orange touring race car accelerating through a tropical circuit at golden hour",
    subjectAnchor: "right",
    ctaLabel: "Explore events",
    ctaUrl: "/events",
    isActive: true,
    sortOrder: 1,
  },
  {
    file: "sarga-motorsport-hero-rally-highlands.jpg",
    mobileFile: "sarga-motorsport-hero-rally-highlands-mobile.jpg",
    alt: "Red rally car racing across a sunlit gravel road in tropical highlands",
    internalName: "Rally - Tropical Highlands",
    eyebrow: "Rally / Beyond the circuit",
    title: "Every surface is a stage.",
    description:
      "From highland gravel to the racing line, Sarga Motorsport follows competition wherever it comes alive.",
    imageAlt:
      "Red rally car racing across a sunlit gravel road in tropical highlands",
    subjectAnchor: "left",
    ctaLabel: "See the programmes",
    ctaUrl: "/events",
    isActive: true,
    sortOrder: 2,
  },
  {
    file: "sarga-motorsport-hero-paddock-ready.jpg",
    mobileFile: "sarga-motorsport-hero-paddock-ready-mobile.jpg",
    alt: "Helmeted racing driver and pit crew preparing a red touring car in a warm daylight paddock",
    internalName: "Paddock - Race Preparation",
    eyebrow: "Paddock / People and precision",
    title: "Built before the lights go out.",
    description:
      "Drivers, crews, and disciplined preparation turn a race weekend into a world-class stage.",
    imageAlt:
      "Helmeted racing driver and pit crew preparing a red touring car in a warm daylight paddock",
    subjectAnchor: "right",
    ctaLabel: "Meet Sarga Motorsport",
    ctaUrl: "/about",
    isActive: true,
    sortOrder: 3,
  },
];

const IJTC_RUNDOWN = [
  {
    dayLabel: "Round 01",
    dateLabel: "Demo / 14–15 Feb 2026",
    venue: "Sentul International Karting Circuit",
    status: "upcoming",
    startTime: "08:00:00.000",
    endTime: "15:30:00.000",
    title: "Selection and orientation weekend",
    description:
      "Candidate assessment, rider briefing, safety orientation, and programme onboarding. Demonstration schedule only.",
    sortOrder: 1,
  },
  {
    dayLabel: "Round 02",
    dateLabel: "Demo / 28–29 Mar 2026",
    venue: "Pertamina Mandalika Circuit",
    status: "upcoming",
    startTime: "09:00:00.000",
    endTime: "16:00:00.000",
    title: "Race development weekend",
    description:
      "Coached track sessions and structured race simulations for the selected rider group. Demonstration schedule only.",
    sortOrder: 2,
  },
  {
    dayLabel: "Round 03",
    dateLabel: "Demo / 09–10 May 2026",
    venue: "Sentul International Circuit",
    status: "upcoming",
    startTime: "08:30:00.000",
    endTime: "15:30:00.000",
    title: "Cornering and race-craft round",
    description:
      "Race-line development, overtaking drills, and supervised sprint competition. Demonstration schedule only.",
    sortOrder: 3,
  },
  {
    dayLabel: "Round 04",
    dateLabel: "Demo / 20–21 Jun 2026",
    venue: "Pertamina Mandalika Circuit",
    status: "upcoming",
    startTime: "09:00:00.000",
    endTime: "16:30:00.000",
    title: "Mid-season classification round",
    description:
      "A two-day programme checkpoint with practice, qualifying, and classified races. Demonstration schedule only.",
    sortOrder: 4,
  },
  {
    dayLabel: "Round 05",
    dateLabel: "Demo / 01–02 Aug 2026",
    venue: "Sentul International Karting Circuit",
    status: "upcoming",
    startTime: "08:00:00.000",
    endTime: "15:00:00.000",
    title: "Wet-weather control workshop",
    description:
      "Controlled drills focused on grip management, visibility, and safe race decisions. Demonstration schedule only.",
    sortOrder: 5,
  },
  {
    dayLabel: "Round 06",
    dateLabel: "Demo / 12–13 Sep 2026",
    venue: "Gelora Bung Tomo Circuit",
    status: "upcoming",
    startTime: "09:00:00.000",
    endTime: "16:00:00.000",
    title: "National development round",
    description:
      "A travelling round that adds circuit adaptation and team communication. Demonstration schedule only.",
    sortOrder: 6,
  },
  {
    dayLabel: "Round 07",
    dateLabel: "Demo / 17–18 Oct 2026",
    venue: "Sentul International Circuit",
    status: "upcoming",
    startTime: "08:30:00.000",
    endTime: "16:00:00.000",
    title: "Performance consolidation weekend",
    description:
      "Data review, qualifying execution, and race consistency ahead of the finale. Demonstration schedule only.",
    sortOrder: 7,
  },
  {
    dayLabel: "Round 08",
    dateLabel: "Demo / 28–29 Nov 2026",
    venue: "Pertamina Mandalika Circuit",
    status: "upcoming",
    startTime: "09:00:00.000",
    endTime: "17:00:00.000",
    title: "Season finale and review",
    description:
      "Final classification races followed by programme review and development feedback. Demonstration schedule only.",
    sortOrder: 8,
  },
].map((item) => ({
  ...item,
  isActive: true,
}));

/** Program and campaign demo content. */
const MOTORSPORT_PROGRAMS = [
  {
    title: "Indonesia Junior Talent Cup",
    slug: "indonesia-junior-talent-cup",
    eventMenuLabel: "IJTC",
    eventMenuEnabled: true,
    programType: "juniorTalentCup",
    programStatus: "registrationOpen",
    seasonLabel: "2026 Season",
    summary:
      "A development program for Indonesia’s next generation of motorcycle racing talent, combining structured race rounds, rider development, standings, and clear sporting regulations.",
    mainHeadline: "The next generation starts here.",
    primaryCtaLabel: "Explore IJTC",
    primaryCtaUrl: "/events/indonesia-junior-talent-cup",
    becomeRidersLabel: "Become Riders",
    becomeRidersUrl: "/events/indonesia-junior-talent-cup/become-riders",
    rundown: IJTC_RUNDOWN,
    siteScope: "motorsport",
  },
  {
    title: "FIA Rallycross World Cup Indonesia 2026",
    slug: "fia-rallycross-world-cup-indonesia-2026",
    eventMenuLabel: "FIA Rallycross",
    eventMenuEnabled: true,
    programType: "rallycross",
    programStatus: "ticketsOpen",
    seasonLabel: "2026",
    summary:
      "FIA Rallycross arrives in Indonesia for a high-intensity two-day race and fan experience at the Jakarta International E-Prix Circuit.",
    mainHeadline: "First Time, Wild Action, Closer Than Ever",
    eventStartDate: "2026-12-05T02:00:00.000Z",
    eventEndDate: "2026-12-06T11:00:00.000Z",
    venue: "Jakarta International E-Prix Circuit",
    primaryCtaLabel: "Get Your Ticket Now",
    primaryCtaUrl: "/tickets",
    seo: {
      metaTitle: "FIA Rallycross World Cup Indonesia 2026",
      metaDescription:
        "FIA Rallycross World Cup Indonesia arrives in Jakarta on 5-6 December 2026. Explore the schedule, visitor guide, and official ticket route.",
      ogTitle: "First Time, Wild Action, Closer Than Ever",
      ogDescription:
        "FIA Rallycross World Cup Indonesia 2026 — 5–6 December at Jakarta International E-Prix Circuit.",
      canonicalUrl: "/campaign/fia-rallycross-world-cup-indonesia-2026",
      noIndex: false,
    },
    bannerSlides: [
      {
        title: "First Time",
        description: "The FIA Rallycross World Cup lands in Indonesia.",
        ctaLabel: "Get Your Ticket Now",
        ctaUrl: "/tickets",
        sortOrder: 1,
      },
      {
        title: "Wild Action",
        description:
          "Mixed-surface racing, close battles, and relentless acceleration.",
        ctaLabel: "View the Rundown",
        ctaUrl: "/campaign/fia-rallycross-world-cup-indonesia-2026#rundown",
        sortOrder: 2,
      },
      {
        title: "Closer Than Ever",
        description:
          "A compact circuit experience that brings fans close to the action.",
        ctaLabel: "Plan Race Day",
        ctaUrl:
          "/campaign/fia-rallycross-world-cup-indonesia-2026#race-day-guide",
        sortOrder: 3,
      },
    ],
    rundown: [
      {
        dayLabel: "Saturday, 5 December",
        dateLabel: "05 Dec 2026",
        venue: "Jakarta International E-Prix Circuit",
        status: "upcoming",
        startTime: "09:00:00",
        endTime: "11:30:00",
        title: "Gates open and practice sessions",
        description:
          "Spectator gates open ahead of the first official track activity and practice running.",
        sortOrder: 1,
      },
      {
        dayLabel: "Saturday, 5 December",
        dateLabel: "05 Dec 2026",
        venue: "Jakarta International E-Prix Circuit",
        status: "upcoming",
        startTime: "13:00:00",
        endTime: "16:00:00",
        title: "Qualifying heats",
        description:
          "Head-to-head qualifying heats establish the running order for Sunday’s decisive sessions.",
        sortOrder: 2,
      },
      {
        dayLabel: "Sunday, 6 December",
        dateLabel: "06 Dec 2026",
        venue: "Jakarta International E-Prix Circuit",
        status: "upcoming",
        startTime: "08:30:00",
        endTime: "09:30:00",
        title: "Warm-up and gates open",
        description:
          "Race-day access begins with warm-up running and final team preparation.",
        sortOrder: 3,
      },
      {
        dayLabel: "Sunday, 6 December",
        dateLabel: "06 Dec 2026",
        venue: "Jakarta International E-Prix Circuit",
        status: "upcoming",
        startTime: "10:00:00",
        endTime: "12:00:00",
        title: "Final qualifying races",
        description:
          "The last qualifying races determine who advances into the knockout phase.",
        sortOrder: 4,
      },
      {
        dayLabel: "Sunday, 6 December",
        dateLabel: "06 Dec 2026",
        venue: "Jakarta International E-Prix Circuit",
        status: "upcoming",
        startTime: "13:30:00",
        endTime: "16:00:00",
        title: "Semi-finals and World Cup final",
        description:
          "Semi-final eliminations lead into the FIA Rallycross World Cup Indonesia final.",
        sortOrder: 5,
      },
    ].map((item) => ({
      ...item,
      isActive: true,
    })),
    eventRules: [
      {
        ruleType: "do",
        title: "Arrive early",
        description:
          "Allow time for ticket validation and venue security checks.",
        sortOrder: 1,
      },
      {
        ruleType: "do",
        title: "Follow marshal guidance",
        description:
          "Use marked spectator routes and observe all circuit instructions.",
        sortOrder: 2,
      },
      {
        ruleType: "dont",
        title: "Do not enter restricted areas",
        description:
          "Track, paddock, and operational zones require explicit accreditation.",
        sortOrder: 3,
      },
      {
        ruleType: "do",
        title: "Keep your ticket ready",
        description:
          "Retain your approved partner ticket for validation and any permitted re-entry checks.",
        sortOrder: 4,
      },
      {
        ruleType: "dont",
        title: "Do not block spectator routes",
        description:
          "Keep stairs, walkways, emergency lanes, and marshal access points clear throughout the event.",
        sortOrder: 5,
      },
      {
        ruleType: "dont",
        title: "Do not rely on an unofficial schedule",
        description:
          "Session timing can change. Follow venue screens and official Motorsport updates on race day.",
        sortOrder: 6,
      },
    ].map((item) => ({
      ...item,
      isActive: true,
    })),
    relatedEventSlug: "fia-rallycross-world-cup-indonesia-2026",
    relatedTicketTitle: "FIA Rallycross World Cup Indonesia 2026 Tickets",
    siteScope: "motorsport",
  },
];

const FIA_CAMPAIGN_MEDIA = {
  hero: {
    file: "fia-rallycross-campaign-hero.jpg",
    alt: "Two rallycross cars racing side by side on a dusty tropical circuit in Indonesia",
  },
  ticketMap: {
    file: "fia-rallycross-ticket-map.png",
    alt: "FIA Rallycross World Cup Indonesia 2026 ticket map showing spectator areas and circuit zones",
  },
  slides: [
    {
      file: "fia-rallycross-campaign-first-time.jpg",
      alt: "Red rallycross car accelerating through a warm Indonesian highland stage",
    },
    {
      file: "fia-rallycross-campaign-wild-action.jpg",
      alt: "Two rallycross cars fighting for position on a mixed-surface circuit",
    },
    {
      file: "fia-rallycross-campaign-closer-than-ever.png",
      alt: "Sarga Motorsport race cars passing a packed grandstand at golden hour",
    },
  ],
};

const IJTC_RIDER_SPECS = [
  ["Arka Pranata", "07", "Apex Junior Racing", "West Java"],
  ["Nara Ayuningtyas", "11", "Velocity Academy", "Central Java"],
  ["Bima Kresna", "14", "Garuda Corse", "East Java"],
  ["Citra Maheswari", "18", "Ignition Talent", "Bali"],
  ["Daffa Ramadhan", "21", "Apex Junior Racing", "Banten"],
  ["Elang Saputra", "24", "Velocity Academy", "Yogyakarta"],
  ["Farah Nabila", "27", "Garuda Corse", "West Sumatra"],
  ["Galang Wiratama", "31", "Ignition Talent", "South Sulawesi"],
  ["Hana Putri", "34", "Apex Junior Racing", "North Sumatra"],
  ["Iqbal Santoso", "39", "Velocity Academy", "East Kalimantan"],
  ["Jihan Larasati", "42", "Garuda Corse", "Jakarta"],
  ["Keanu Adiputra", "46", "Ignition Talent", "West Java"],
  ["Laila Maharani", "51", "Apex Junior Racing", "Central Java"],
  ["Miko Wibowo", "55", "Velocity Academy", "East Java"],
  ["Nadia Kirana", "61", "Garuda Corse", "Bali"],
  ["Oka Prasetya", "64", "Ignition Talent", "Riau"],
  ["Putra Mahendra", "72", "Apex Junior Racing", "South Sumatra"],
  ["Qori Anindita", "77", "Velocity Academy", "West Nusa Tenggara"],
  ["Raka Firmansyah", "84", "Garuda Corse", "South Kalimantan"],
  ["Sari Wulandari", "93", "Ignition Talent", "East Nusa Tenggara"],
] as const;

const IJTC_RIDERS = IJTC_RIDER_SPECS.map(
  ([name, number, team, region], index) => ({
    name,
    slug: `ijtc-demo-rider-${String(index + 1).padStart(2, "0")}`,
    number,
    team,
    region,
    nationality: "Indonesia",
    portraitFile: `ijtc-grid-rider-portrait-${String(index + 1).padStart(2, "0")}.png`,
    bio: `Fictional demonstration rider profile for CMS and layout testing. ${name} represents the programme pathway from ${region}; replace all profile details with approved IJTC participant data before launch.`,
    sortOrder: index + 1,
    isActive: true,
    siteScope: "motorsport",
  }),
);

const IJTC_STANDINGS = IJTC_RIDERS.map((rider, index) => ({
  riderSlug: rider.slug,
  seasonLabel: "2026 Season",
  roundLabel: "Demo standings",
  position: index + 1,
  points: Math.max(18, 152 - index * 7),
  resultSummary: `Demo Round 04 classification: P${String((index % 10) + 1).padStart(2, "0")}.`,
  siteScope: "motorsport",
}));

const IJTC_REGULATIONS = [
  {
    title: "IJTC Sporting Regulation - Demo Record",
    version: "Draft 0.1",
    effectiveDate: "2026-08-08",
    summary:
      "Placeholder metadata only. Upload the approved regulation PDF and update the version before launch.",
    isActive: false,
    siteScope: "motorsport",
  },
];

const MOTORSPORT_MERCHANDISE = [
  {
    title: "Sarga Motorsport Team Tee",
    slug: "sarga-motorsport-team-tee-preview",
    description:
      "Heavyweight cotton, an athletic streetwear cut, and the Sarga racing stripe translated for everyday wear.",
    priceLabel: "Coming soon",
    availabilityStatus: "comingSoon",
    siteScope: "motorsport",
    sortOrder: 1,
  },
  {
    title: "Sarga Motorsport Track Cap",
    slug: "sarga-motorsport-track-cap-preview",
    description:
      "A structured performance cap with embroidered team branding and contrast apex detailing.",
    priceLabel: "Inquiry only",
    availabilityStatus: "inquiryOnly",
    siteScope: "motorsport",
    sortOrder: 2,
  },
  {
    title: "Sarga Motorsport Apex Jacket",
    slug: "sarga-motorsport-apex-jacket",
    description:
      "A technical paddock shell with race-panel construction, weather-ready fabric, and signature Sarga piping.",
    priceLabel: "Coming soon",
    availabilityStatus: "comingSoon",
    siteScope: "motorsport",
    sortOrder: 3,
  },
  {
    title: "Sarga Motorsport Garage Hoodie",
    slug: "sarga-motorsport-garage-hoodie",
    description:
      "Heavyweight brushed fleece with structured shoulders and a restrained team chest mark.",
    priceLabel: "Inquiry only",
    availabilityStatus: "inquiryOnly",
    siteScope: "motorsport",
    sortOrder: 4,
  },
  {
    title: "Sarga Motorsport Pit Lane Mug",
    slug: "sarga-motorsport-pit-lane-mug",
    description:
      "A substantial matte ceramic mug finished with the team wordmark and twin racing stripes.",
    priceLabel: "Coming soon",
    availabilityStatus: "comingSoon",
    siteScope: "motorsport",
    sortOrder: 5,
  },
  {
    title: "Sarga Motorsport Paddock Backpack",
    slug: "sarga-motorsport-paddock-backpack",
    description:
      "A structured technical backpack with protected storage, durable hardware, and paddock-ready detailing.",
    priceLabel: "Inquiry only",
    availabilityStatus: "inquiryOnly",
    siteScope: "motorsport",
    sortOrder: 6,
  },
];

/**
 * Horse Sport demo set (Horse Sport Phase 2). Mirrors the motorsport demo:
 * horsesport-scoped content, one shared item flagged for a gateway teaser, all
 * linked to the Sarga Horse Sport business. Demonstrates three-site querying.
 */
const HORSESPORT_PARTNERS = [
  {
    name: "Meridian Stables",
    slug: "meridian-stables",
    websiteUrl: "https://example.com",
    partnerType: "sponsor",
    siteScope: "horsesport",
    sortOrder: 1,
    isActive: true,
  },
  {
    name: "Turfline Grounds",
    slug: "turfline-grounds",
    websiteUrl: "https://example.com",
    partnerType: "technical",
    siteScope: "horsesport",
    sortOrder: 2,
    isActive: true,
  },
  {
    name: "Derby Day Hospitality",
    slug: "derby-day-hospitality",
    websiteUrl: "https://example.com",
    partnerType: "community",
    siteScope: "horsesport",
    sortOrder: 3,
    isActive: true,
  },
];

const HORSESPORT_EVENTS = [
  {
    title: "Sarga National Derby - Merdeka Cup",
    slug: "sarga-national-derby-merdeka-cup",
    description:
      "The flagship national derby under golden-hour turf conditions: elite jockeys, championship classification, and full race-day hospitality.",
    eventDate: "2026-08-17T08:00:00.000Z",
    endDate: "2026-08-17T18:00:00.000Z",
    venue: "Sarga Turf Park",
    venueAddress: "Bogor, West Java, Indonesia",
    eventStatus: "ticketsOpen",
    eventDiscipline: "derby",
    raceClass: "Group 1 - National Championship",
    trackType: "turf",
    hospitalityInfo:
      "Grandstand lounge, paddock club, and family zone with trackside dining.",
    stableAccessInfo:
      "Guided pre-race stable tours available for hospitality ticket holders.",
    ticketCtaLabel: "Buy Tickets",
    ticketIntegrationType: "redirect",
    siteScope: "horsesport",
    showOnGateway: true,
    showOnMotorsport: false,
    showOnHorseSport: true,
  },
  {
    title: "Turf Classic Twilight Meeting",
    slug: "turf-classic-twilight-meeting",
    description:
      "An evening turf meeting pairing sprint classifications with an open-air lifestyle program across the infield.",
    eventDate: "2026-09-12T10:00:00.000Z",
    endDate: "2026-09-12T21:00:00.000Z",
    venue: "Sarga Turf Park",
    venueAddress: "Bogor, West Java, Indonesia",
    eventStatus: "announced",
    eventDiscipline: "turf",
    raceClass: "Listed - Sprint",
    trackType: "turf",
    hospitalityInfo: "Twilight terrace and premium turf-side seating.",
    ticketCtaLabel: "Register Interest",
    ticketIntegrationType: "redirect",
    siteScope: "horsesport",
    showOnGateway: false,
    showOnMotorsport: false,
    showOnHorseSport: true,
  },
  {
    title: "Sarga Champions Sprint",
    slug: "sarga-champions-sprint",
    description:
      "A championship sprint spectacle decided in the first furlongs - the fastest field of the season breaks from the gates in a high-stakes dash to the line.",
    eventDate: "2026-10-04T09:00:00.000Z",
    endDate: "2026-10-04T17:00:00.000Z",
    venue: "Grand Paddock Arena",
    venueAddress: "Bogor, West Java, Indonesia",
    eventStatus: "announced",
    eventDiscipline: "championship",
    raceClass: "Group 2 - Sprint Championship",
    trackType: "turf",
    hospitalityInfo:
      "Trackside champions lounge with a direct view of the starting gates.",
    ticketCtaLabel: "Register Interest",
    ticketIntegrationType: "redirect",
    siteScope: "horsesport",
    showOnGateway: true,
    showOnMotorsport: false,
    showOnHorseSport: true,
  },
];

const HORSESPORT_TICKET_CTAS = [
  {
    title: "Sarga National Derby - Merdeka Cup Tickets",
    label: "Buy Tickets",
    provider: "Partner Ticketing",
    ctaType: "redirect",
    url: "https://example.com/tickets/sarga-national-derby",
    isActive: true,
    siteScope: "horsesport",
  },
];

const HORSESPORT_NEWS = [
  {
    title: "Merdeka Cup Returns to a Sold-Out Grandstand",
    slug: "merdeka-cup-returns-sold-out-grandstand",
    excerpt:
      "The Sarga National Derby headlines a record race-day program with elite jockeys and championship turf classifications.",
    body: "The Sarga National Derby returns for the Merdeka Cup, headlining a record race-day program with elite jockeys, championship turf classifications, and a full hospitality experience across the Sarga Turf Park.",
    category: "event-announcement",
    publishedDate: "2026-07-20",
    isHotTopic: true,
    siteScope: "horsesport",
    showOnGateway: true,
    showOnMotorsport: false,
    showOnHorseSport: true,
    featuredOnHorseSport: true,
  },
  {
    title: "Inside the Stable: Conditioning an Elite Derby Contender",
    slug: "inside-the-stable-conditioning-derby-contender",
    excerpt:
      "A behind-the-scenes look at nutrition, veterinary care, and the daily routines that shape a championship horse.",
    body: "A behind-the-scenes look at the nutrition programs, veterinary care, and disciplined daily routines that shape a championship derby contender inside the Sarga Horse Sport network.",
    category: "stable-life",
    publishedDate: "2026-07-05",
    isHotTopic: false,
    siteScope: "horsesport",
    showOnGateway: false,
    showOnMotorsport: false,
    showOnHorseSport: true,
  },
  {
    title: "Turf Track Development Reaches Championship Grade",
    slug: "turf-track-development-championship-grade",
    excerpt:
      "New drainage and turf management bring the Sarga Turf Park to international championship standards.",
    body: "New drainage systems and turf management protocols have brought the Sarga Turf Park to international championship standards, ahead of the upcoming national derby season.",
    category: "turf-venue",
    publishedDate: "2026-06-22",
    isHotTopic: false,
    siteScope: "horsesport",
    showOnGateway: false,
    showOnMotorsport: false,
    showOnHorseSport: true,
  },
  {
    title: "The Making of a Champion Jockey",
    slug: "the-making-of-a-champion-jockey",
    excerpt:
      "Discipline, weight management, and split-second race-craft - an intimate profile of the riders behind Sarga Horse Sport victories.",
    body: "Behind every championship result is a rider whose craft is honed over years. This profile follows the discipline, weight management, and split-second decision-making that define an elite Sarga Horse Sport jockey - from dawn track work to the roar of the home straight.",
    category: "jockey-story",
    publishedDate: "2026-07-28",
    isHotTopic: true,
    siteScope: "horsesport",
    showOnGateway: false,
    showOnMotorsport: false,
    showOnHorseSport: true,
    featuredOnHorseSport: true,
  },
  {
    title: "Photo Finish Decides the Turf Classic",
    slug: "photo-finish-decides-turf-classic",
    excerpt:
      "A blanket finish separated by inches - the Turf Classic delivered one of the closest results in Sarga Horse Sport history.",
    body: "Inches decided the Turf Classic as the leading contenders flashed across the line together, sending the result to a photo finish. This race report breaks down the closing sectionals, the winning ride, and what the result means for the championship standings.",
    category: "race-results",
    publishedDate: "2026-07-15",
    isHotTopic: false,
    siteScope: "horsesport",
    showOnGateway: false,
    showOnMotorsport: false,
    showOnHorseSport: true,
  },
];

/** Gallery entries for the horse sport gallery page. */
const HORSESPORT_GALLERIES = [
  {
    title: "Race Day Gallery",
    slug: "horse-sport-race-day",
    description:
      "Race-day, turf, and stable photography from Sarga Horse Sport events.",
    category: "race-day",
    siteScope: "horsesport",
  },
];

/** CMS entry point for Horse Sport homepage hero media and video controls. */
const HORSESPORT_SITE_PAGES = [
  {
    title: "Sarga Horse Sport News",
    slug: "horsesport-news",
    routePath: "/news",
    siteScope: "horsesport",
    pageKind: "newsHub",
    navigationLabel: "News",
    heroTitle: "Every story from the turf.",
    heroDescription:
      "Race results, jockey stories, turf and venue development, and stable-life editorial curated by the Sarga Horse Sport team.",
    sections: [
      {
        __component: "shared.page-section",
        sectionKey: "archive-intro",
        eyebrow: "Stories & press",
        title: "Inside the paddock.",
        body: "Race reports, stable features, venue spotlights, and the stories shaping championship equestrian sport.",
      },
    ],
  },
  {
    title: "Sarga Horse Sport Homepage",
    slug: "horsesport-home",
    routePath: "/",
    siteScope: "horsesport",
    pageKind: "home",
    navigationLabel: "Home",
    heroTitle: "Where champions are made.",
    heroDescription:
      "Championship equestrian sport, premium hospitality, and race-day experiences at international standard.",
    sections: [
      {
        __component: "shared.page-section",
        sectionKey: "about",
        eyebrow: "About Sarga Horse Sport",
        title: "A dedicated home for Indonesian horse sport.",
        body: "Sarga Horse Sport brings championship racing, disciplined equestrian standards, and race-day hospitality into one premium sports ecosystem - an investable, international-class platform for the sport's next chapter.",
      },
    ],
  },
  {
    title: "Sarga Horse Sport About",
    slug: "horsesport-about",
    routePath: "/about",
    siteScope: "horsesport",
    pageKind: "about",
    navigationLabel: "About",
    heroTitle: "The standard for elite horse sport.",
    heroDescription: "Premium championship racing, disciplined equestrian standards, and a hospitality-forward experience - positioned for a national and international audience.",
    sections: [
      { __component: "shared.page-section", sectionKey: "story", eyebrow: "The Sarga Horse Sport story", title: "Heritage, engineered for the modern spectacle.", body: "Sarga Horse Sport formulates premium national race classifications, elite jockey programs, and strict veterinary compliance protocols across Indonesian horse sport. It is built as a complete, investable championship ecosystem - from the turf to the stable to the grandstand." },
      { __component: "shared.page-section", sectionKey: "capabilities", eyebrow: "What we do", title: "A complete championship capability.", body: "Everything required to run elite horse sport to international standard - under one disciplined organisation." },
    ],
  },
  {
    title: "Sarga Horse Sport Venues",
    slug: "horsesport-venues",
    routePath: "/venues",
    siteScope: "horsesport",
    pageKind: "custom",
    navigationLabel: "Venues",
    heroTitle: "Championship-grade turf & facilities.",
    heroDescription: "Premium tracks, turf, stables, and hospitality infrastructure built to international standards.",
    sections: [
      { __component: "shared.page-section", sectionKey: "network", eyebrow: "The venue network", title: "Where the sport comes to life.", body: "From championship turf to elite stabling and gala hospitality arenas." },
      { __component: "shared.page-section", sectionKey: "facilities", eyebrow: "Facilities", title: "Engineered for elite competition.", body: "Tracks, grandstands, paddock clubs, and stables designed for sporting integrity, equine welfare, and premium race-day experience." },
    ],
  },
  {
    title: "Sarga Horse Sport Stable Life",
    slug: "horsesport-stable-life",
    routePath: "/stable-life",
    siteScope: "horsesport",
    pageKind: "custom",
    navigationLabel: "Stable Life",
    heroTitle: "The discipline behind the sport.",
    heroDescription: "Inside the stable - training, veterinary care, jockey routines, and the craft that shapes a champion.",
    sections: [{ __component: "shared.page-section", sectionKey: "intro", eyebrow: "Editorial hub", title: "Where champions are made.", body: "Nutrition, veterinary care, and the daily routines that shape a championship contender - plus the jockeys and equine athletes at the heart of the sport." }],
  },
  {
    title: "Sarga Horse Sport Contact",
    slug: "horsesport-contact",
    routePath: "/contact",
    siteScope: "horsesport",
    pageKind: "custom",
    navigationLabel: "Contact",
    heroTitle: "Let's talk.",
    heroDescription: "Ticketing, partnership, sponsorship, media, or general - reach the Sarga Horse Sport team.",
    sections: [{ __component: "shared.page-section", sectionKey: "intro", eyebrow: "Get in touch", title: "One team, every inquiry.", body: "Send us a message and we'll route it to the right team. For tickets, head to our approved partner platforms via the tickets page." }],
  },
];

/**
 * Placeholder media manifest: files in cms/data/seed-media, attached to the
 * record/field pairs below only while those fields are still empty.
 */
const SEED_MEDIA: Array<{
  file: string;
  alt: string;
  uid: string;
  /** Slug for collection types; undefined targets the single type document. */
  slug?: string;
  field: string;
}> = [
  {
    file: "sarga-cinematic-hero-concept.jpg",
    alt: "Three horses running alongside a red race car at a modern circuit",
    uid: "api::homepage.homepage",
    field: "heroImage",
  },
  {
    file: "sarga-horse-sport-turf-aerial.jpg",
    alt: "Aerial view of a jockey galloping across turf with a long shadow",
    uid: "api::ecosystem-business.ecosystem-business",
    slug: "sarga-horse-sport",
    field: "cardImage",
  },
  {
    file: "sarga-motorsport-concept.jpg",
    alt: "Red touring race car accelerating past a circuit grandstand",
    uid: "api::ecosystem-business.ecosystem-business",
    slug: "sarga-motorsport",
    field: "cardImage",
  },
  {
    file: "news-merdeka-jockeys.jpg",
    alt: "Two jockeys racing side by side past a blurred grandstand",
    uid: "api::news-article.news-article",
    slug: "sarga-cup-merdeka-series",
    field: "coverImage",
  },
  {
    file: "news-turf-track-aerial.jpg",
    alt: "Aerial view of curved turf and dirt racing track lanes",
    uid: "api::news-article.news-article",
    slug: "sarga-group-mou-turf-track",
    field: "coverImage",
  },
  {
    file: "news-stable-interior.jpg",
    alt: "Horses inside a modern stable atrium lit by a circular skylight",
    uid: "api::news-article.news-article",
    slug: "inside-the-stable-elite-jockey",
    field: "coverImage",
  },
  {
    file: "sarga-cinematic-hero-concept.jpg",
    alt: "Three horses running alongside a red race car at a modern circuit",
    uid: "api::event.event",
    slug: "sample-event",
    field: "coverImage",
  },
  // Motorsport news cover images
  {
    file: "sarga-motorsport-concept.jpg",
    alt: "Red touring race car accelerating past a circuit grandstand",
    uid: "api::news-article.news-article",
    slug: "sarga-motorsport-night-race-series",
    field: "coverImage",
  },
  {
    file: "sarga-cinematic-hero-concept.jpg",
    alt: "Three horses running alongside a red race car at a modern circuit",
    uid: "api::news-article.news-article",
    slug: "the-line-between-control-and-chaos",
    field: "coverImage",
  },
  {
    file: "sarga-horse-sport-turf-aerial.jpg",
    alt: "Aerial view of a jockey galloping across turf",
    uid: "api::news-article.news-article",
    slug: "riders-rewrite-the-racing-line",
    field: "coverImage",
  },
  {
    file: "news-stable-interior.jpg",
    alt: "Horses inside a modern stable atrium lit by a circular skylight",
    uid: "api::news-article.news-article",
    slug: "building-the-360-racing-ecosystem",
    field: "coverImage",
  },
  // Motorsport event cover images
  {
    file: "sarga-motorsport-concept.jpg",
    alt: "Red touring race car accelerating past a circuit grandstand",
    uid: "api::event.event",
    slug: "superbike-night-sessions",
    field: "coverImage",
  },
  {
    file: "sarga-cinematic-hero-concept.jpg",
    alt: "Three horses running alongside a red race car at a modern circuit",
    uid: "api::event.event",
    slug: "gt-endurance-challenge",
    field: "coverImage",
  },
  {
    file: "sarga-horse-sport-turf-aerial.jpg",
    alt: "Aerial view of a jockey galloping across turf",
    uid: "api::event.event",
    slug: "moto-festival-weekend",
    field: "coverImage",
  },
  // Horse Sport event cover images
  {
    file: "news-merdeka-jockeys.jpg",
    alt: "Two jockeys racing side by side past a blurred grandstand",
    uid: "api::event.event",
    slug: "sarga-national-derby-merdeka-cup",
    field: "coverImage",
  },
  {
    file: "news-turf-track-aerial.jpg",
    alt: "Aerial view of curved turf and dirt racing track lanes",
    uid: "api::event.event",
    slug: "turf-classic-twilight-meeting",
    field: "coverImage",
  },
  // Horse Sport news cover images
  {
    file: "news-merdeka-jockeys.jpg",
    alt: "Two jockeys racing side by side past a blurred grandstand",
    uid: "api::news-article.news-article",
    slug: "merdeka-cup-returns-sold-out-grandstand",
    field: "coverImage",
  },
  {
    file: "news-stable-interior.jpg",
    alt: "Elite race horse inside a premium stable interior",
    uid: "api::news-article.news-article",
    slug: "inside-the-stable-conditioning-derby-contender",
    field: "coverImage",
  },
  {
    file: "news-turf-track-aerial.jpg",
    alt: "Aerial view of curved turf and dirt racing track lanes",
    uid: "api::news-article.news-article",
    slug: "turf-track-development-championship-grade",
    field: "coverImage",
  },
  // Horse Sport - new high-res posts (HS-media refresh)
  {
    file: "hs-starting-gates.png",
    alt: "A field of racehorses bursting from the starting gates, turf flying",
    uid: "api::event.event",
    slug: "sarga-champions-sprint",
    field: "coverImage",
  },
  {
    file: "hs-jockey-portrait.png",
    alt: "Editorial close-up portrait of a determined jockey in racing silks",
    uid: "api::news-article.news-article",
    slug: "the-making-of-a-champion-jockey",
    field: "coverImage",
  },
  {
    file: "hs-closeup-action.png",
    alt: "High-speed close-up of racehorses straining toward a photo finish",
    uid: "api::news-article.news-article",
    slug: "photo-finish-decides-turf-classic",
    field: "coverImage",
  },
  // Horse Sport gallery cover image
  {
    file: "sarga-horse-sport-turf-aerial.jpg",
    alt: "Aerial view of a jockey galloping across turf",
    uid: "api::media-gallery.media-gallery",
    slug: "horse-sport-race-day",
    field: "coverImage",
  },
  // Motorsport merchandise catalog photography
  {
    file: "sarga-team-tee.jpg",
    alt: "Warm-white Sarga Motorsport team T-shirt with racing stripes",
    uid: "api::merchandise-item.merchandise-item",
    slug: "sarga-motorsport-team-tee-preview",
    field: "image",
  },
  {
    file: "sarga-track-cap.jpg",
    alt: "Black embroidered Sarga Motorsport track cap",
    uid: "api::merchandise-item.merchandise-item",
    slug: "sarga-motorsport-track-cap-preview",
    field: "image",
  },
  {
    file: "sarga-apex-jacket.jpg",
    alt: "Black Sarga Motorsport technical team jacket",
    uid: "api::merchandise-item.merchandise-item",
    slug: "sarga-motorsport-apex-jacket",
    field: "image",
  },
  {
    file: "sarga-garage-hoodie.jpg",
    alt: "Black and red Sarga Motorsport garage hoodie",
    uid: "api::merchandise-item.merchandise-item",
    slug: "sarga-motorsport-garage-hoodie",
    field: "image",
  },
  {
    file: "sarga-pit-lane-mug.jpg",
    alt: "Matte-black Sarga Motorsport ceramic mug",
    uid: "api::merchandise-item.merchandise-item",
    slug: "sarga-motorsport-pit-lane-mug",
    field: "image",
  },
  {
    file: "sarga-paddock-backpack.jpg",
    alt: "Black Sarga Motorsport technical paddock backpack",
    uid: "api::merchandise-item.merchandise-item",
    slug: "sarga-motorsport-paddock-backpack",
    field: "image",
  },
];

/** Upload a seed-media file to the media library unless already present. */
async function uploadIfMissing(
  strapi: Core.Strapi,
  filename: string,
  alt: string,
): Promise<{ id: number } | null> {
  const existing = await strapi.db
    .query("plugin::upload.file")
    .findOne({ where: { name: filename } });
  if (existing) return existing;

  const filePath = path.join(
    strapi.dirs.app.root,
    "data",
    "seed-media",
    filename,
  );
  if (!fs.existsSync(filePath)) {
    strapi.log.warn(`[seed] Media file missing, skipped: ${filePath}`);
    return null;
  }

  const stat = fs.statSync(filePath);
  const ext = path.extname(filename).toLowerCase();
  const mime =
    ext === ".png"
      ? "image/png"
      : ext === ".webp"
        ? "image/webp"
        : "image/jpeg";
  // Provide both formidable v2 and v3 style keys for compatibility.
  const fileDescriptor = {
    filepath: filePath,
    path: filePath,
    originalFilename: filename,
    name: filename,
    mimetype: mime,
    type: mime,
    size: stat.size,
  };

  const uploadService = strapi.plugin("upload").service("upload") as {
    upload: (params: {
      data: Record<string, unknown>;
      files: Record<string, unknown>;
    }) => Promise<Array<{ id: number }>>;
  };

  const [uploaded] = await uploadService.upload({
    data: { fileInfo: { name: filename, alternativeText: alt } },
    files: fileDescriptor,
  });
  strapi.log.info(`[seed] Uploaded media: ${filename}`);
  return uploaded ?? null;
}

/** Attach placeholder media to records whose image fields are still empty. */
async function seedMedia(
  strapi: Core.Strapi,
  documents: (uid: string) => {
    findFirst: (params?: Record<string, unknown>) => Promise<unknown>;
    update: (params: Record<string, unknown>) => Promise<unknown>;
  },
) {
  for (const item of SEED_MEDIA) {
    const filters = item.slug ? { slug: { $eq: item.slug } } : undefined;
    const doc = (await documents(item.uid).findFirst({
      ...(filters ? { filters } : {}),
      populate: [item.field],
    })) as ({ documentId: string } & Record<string, unknown>) | null;

    if (!doc) continue;
    if (doc[item.field]) continue; // already has media - never overwrite

    const file = await uploadIfMissing(strapi, item.file, item.alt);
    if (!file) continue;

    await documents(item.uid).update({
      documentId: doc.documentId,
      data: { [item.field]: file.id },
      status: "published",
    });
    strapi.log.info(
      `[seed] Attached ${item.file} → ${item.uid}${item.slug ? `(${item.slug})` : ""}.${item.field}`,
    );
  }
}

/**
 * Horse Sport cover refresh: swaps the earlier low-resolution placeholder
 * covers for the curated high-resolution art. Unlike `seedMedia`, this DOES
 * replace an existing image - but only when the current cover isn't already the
 * target file, so it stays idempotent across re-seeds.
 */
const HORSESPORT_COVER_REFRESH: Array<{
  uid: string;
  slug: string;
  field: string;
  file: string;
  alt: string;
}> = [
  {
    uid: "api::event.event",
    slug: "sarga-national-derby-merdeka-cup",
    field: "coverImage",
    file: "hs-home-straight-finish.png",
    alt: "Two racehorses neck-and-neck down the home straight toward the line",
  },
  {
    uid: "api::event.event",
    slug: "turf-classic-twilight-meeting",
    field: "coverImage",
    file: "hs-night-race.png",
    alt: "A twilight horse race under bright stadium floodlights",
  },
  {
    uid: "api::news-article.news-article",
    slug: "merdeka-cup-returns-sold-out-grandstand",
    field: "coverImage",
    file: "hs-winners-circle.png",
    alt: "Triumphant winner’s circle celebration on race day",
  },
  {
    uid: "api::news-article.news-article",
    slug: "inside-the-stable-conditioning-derby-contender",
    field: "coverImage",
    file: "hs-champion-horse.png",
    alt: "Studio portrait of a champion thoroughbred racehorse",
  },
  {
    uid: "api::news-article.news-article",
    slug: "turf-track-development-championship-grade",
    field: "coverImage",
    file: "hs-racecourse-aerial.png",
    alt: "Cinematic aerial of a sweeping green turf racecourse at golden hour",
  },
];

/** Curated high-res set for the Horse Sport race-day gallery. */
const HORSESPORT_GALLERY_REFRESH = [
  {
    file: "hs-home-straight-finish.png",
    alt: "Racehorses neck-and-neck down the home straight",
  },
  {
    file: "hs-winners-circle.png",
    alt: "Winner’s circle celebration on race day",
  },
  {
    file: "hs-champion-horse.png",
    alt: "Studio portrait of a champion racehorse",
  },
  {
    file: "hs-racecourse-aerial.png",
    alt: "Aerial view of a sweeping turf racecourse",
  },
  {
    file: "hs-night-race.png",
    alt: "Night horse race under stadium floodlights",
  },
  {
    file: "hs-starting-gates.png",
    alt: "Racehorses bursting from the starting gates",
  },
  {
    file: "hs-closeup-action.png",
    alt: "High-speed close-up of racehorses at full gallop",
  },
  {
    file: "hs-jockey-portrait.png",
    alt: "Editorial portrait of a jockey in racing silks",
  },
];

async function refreshHorseSportMedia(
  strapi: Core.Strapi,
  documents: (uid: string) => {
    findFirst: (params?: Record<string, unknown>) => Promise<unknown>;
    update: (params: Record<string, unknown>) => Promise<unknown>;
  },
) {
  // Single covers
  for (const item of HORSESPORT_COVER_REFRESH) {
    const doc = (await documents(item.uid).findFirst({
      filters: { slug: { $eq: item.slug } },
      populate: [item.field],
    })) as ({ documentId: string } & Record<string, unknown>) | null;
    if (!doc) continue;

    const current = doc[item.field] as { name?: string } | null | undefined;
    if (current?.name === item.file) continue; // already the high-res art

    const file = await uploadIfMissing(strapi, item.file, item.alt);
    if (!file) continue;

    await documents(item.uid).update({
      documentId: doc.documentId,
      data: { [item.field]: file.id },
      status: "published",
    });
    strapi.log.info(
      `[seed] Refreshed cover ${item.file} → ${item.uid}(${item.slug}).${item.field}`,
    );
  }

  // Gallery mediaItems - replace the low-res set with the curated high-res set.
  const gallery = (await documents(
    "api::media-gallery.media-gallery",
  ).findFirst({
    filters: { slug: { $eq: "horse-sport-race-day" } },
    populate: ["mediaItems"],
  })) as { documentId: string; mediaItems?: Array<{ name?: string }> } | null;
  if (gallery) {
    const currentNames = (gallery.mediaItems ?? [])
      .map((m) => m.name)
      .filter(Boolean)
      .sort();
    const targetNames = HORSESPORT_GALLERY_REFRESH.map((g) => g.file).sort();
    const alreadySet =
      currentNames.length === targetNames.length &&
      currentNames.every((n, i) => n === targetNames[i]);
    if (!alreadySet) {
      const fileIds: number[] = [];
      for (const g of HORSESPORT_GALLERY_REFRESH) {
        const file = await uploadIfMissing(strapi, g.file, g.alt);
        if (file) fileIds.push(file.id);
      }
      if (fileIds.length > 0) {
        await documents("api::media-gallery.media-gallery").update({
          documentId: gallery.documentId,
          data: { mediaItems: fileIds },
          status: "published",
        });
        strapi.log.info(
          `[seed] Refreshed ${fileIds.length} gallery images → horse-sport-race-day`,
        );
      }
    }
  }
}

/** Grant public read access for content endpoints (idempotent). */
async function grantPublicReadPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi.db
    .query("plugin::users-permissions.role")
    .findOne({ where: { type: "public" } });

  if (!publicRole) {
    strapi.log.warn(
      "[seed] Public role not found; skipping permission grants.",
    );
    return;
  }

  for (const action of PUBLIC_READ_ACTIONS) {
    const existing = await strapi.db
      .query("plugin::users-permissions.permission")
      .findOne({ where: { action, role: publicRole.id } });

    if (!existing) {
      await strapi.db
        .query("plugin::users-permissions.permission")
        .create({ data: { action, role: publicRole.id } });
      strapi.log.info(`[seed] Granted public permission: ${action}`);
    }
  }
}

export default async function seedDemoContent(strapi: Core.Strapi) {
  if (process.env.SEED_DEMO_CONTENT !== "true") return;

  strapi.log.info("[seed] SEED_DEMO_CONTENT=true - checking demo content…");

  // Loosely typed accessor: seed data is validated by Strapi at write time.
  const documents = strapi.documents as unknown as (uid: string) => {
    count: (params?: Record<string, unknown>) => Promise<number>;
    findFirst: (params?: Record<string, unknown>) => Promise<unknown>;
    findMany: (params?: Record<string, unknown>) => Promise<unknown[]>;
    create: (params: Record<string, unknown>) => Promise<unknown>;
    update: (params: Record<string, unknown>) => Promise<unknown>;
    delete: (params: Record<string, unknown>) => Promise<unknown>;
  };

  const legacyMotorsportRetired = await isMotorsportLegacyContentRetired(strapi);

  await grantPublicReadPermissions(strapi);

  // Site-scoped top navigation. English owns structure; the Indonesian locale
  // receives labels only. Existing editor-managed records are never overwritten.
  for (const item of TOP_NAVIGATION_ITEMS) {
    // Motorsport navigation moved to its dedicated collection. Once legacy
    // records are archived, never recreate them during an idempotent seed.
    if (legacyMotorsportRetired && item.siteScope === "motorsport") continue;
    const { labelId, ...seedItem } = item;
    let englishItem = (await documents(
      "api::top-navigation-item.top-navigation-item",
    ).findFirst({
      locale: "en",
      filters: {
        internalName: { $eq: item.internalName },
        siteScope: { $eq: item.siteScope },
      },
    })) as (Record<string, unknown> & { documentId: string }) | null;

    if (!englishItem) {
      englishItem = (await documents(
        "api::top-navigation-item.top-navigation-item",
      ).create({
        locale: "en",
        data: {
          ...seedItem,
          ariaLabel: item.label,
          linkType: "internal",
          enabled: true,
          emphasis: "emphasis" in item ? item.emphasis : "default",
          openInNewTab: false,
        },
        status: "published",
      })) as Record<string, unknown> & { documentId: string };
      strapi.log.info(
        `[seed] Created English navigation: ${item.internalName}`,
      );
    }

    const indonesianItem = await documents(
      "api::top-navigation-item.top-navigation-item",
    ).findFirst({
      locale: "id",
      filters: { documentId: { $eq: englishItem.documentId } },
    });
    if (indonesianItem) continue;

    const structuralData = {
      internalName: englishItem.internalName,
      siteScope: englishItem.siteScope,
      href: englishItem.href,
      linkType: englishItem.linkType,
      enabled: englishItem.enabled,
      displayOrder: englishItem.displayOrder,
      emphasis: englishItem.emphasis,
      openInNewTab: englishItem.openInNewTab,
    };

    await documents("api::top-navigation-item.top-navigation-item").update({
      documentId: englishItem.documentId,
      locale: "id",
      data: {
        ...structuralData,
        label: labelId,
        ariaLabel: labelId,
      },
      status: "published",
    });
    strapi.log.info(
      `[seed] Created Indonesian navigation: ${item.internalName}`,
    );
  }

  // Homepage (single type)
  const existingHomepage = await documents(
    "api::homepage.homepage",
  ).findFirst();
  if (!existingHomepage) {
    await documents("api::homepage.homepage").create({
      data: HOMEPAGE,
      status: "published",
    });
    strapi.log.info("[seed] Created homepage content.");
  }

  // Ecosystem businesses
  const businessCount = await documents(
    "api::ecosystem-business.ecosystem-business",
  ).count();
  if (businessCount === 0) {
    for (const business of ECOSYSTEM_BUSINESSES) {
      await documents("api::ecosystem-business.ecosystem-business").create({
        data: business,
        status: "published",
      });
    }
    strapi.log.info(
      `[seed] Created ${ECOSYSTEM_BUSINESSES.length} ecosystem businesses.`,
    );
  }

  // News articles
  const articleCount = await documents(
    "api::news-article.news-article",
  ).count();
  if (articleCount === 0) {
    for (const article of NEWS_ARTICLES) {
      await documents("api::news-article.news-article").create({
        data: article,
        status: "published",
      });
    }
    strapi.log.info(`[seed] Created ${NEWS_ARTICLES.length} news articles.`);
  }

  // Events
  const eventCount = await documents("api::event.event").count();
  if (eventCount === 0) {
    for (const event of EVENTS) {
      await documents("api::event.event").create({
        data: event,
        status: "published",
      });
    }
    strapi.log.info(`[seed] Created ${EVENTS.length} events.`);
  }

  // --- Multisite (Phase 2): site registry + motorsport demo set ---

  // Site registry
  for (const site of SITES) {
    const existingSite = (await documents("api::site.site").findFirst({
      filters: { slug: { $eq: site.slug } },
    })) as { documentId: string; order?: number } | null;

    if (!existingSite) {
      await documents("api::site.site").create({
        data: site,
        status: "published",
      });
      strapi.log.info(`[seed] Created site: ${site.name}.`);
    } else if (existingSite.order !== site.order) {
      await documents("api::site.site").update({
        documentId: existingSite.documentId,
        data: { order: site.order },
        status: "published",
      });
    }
  }

  const gatewaySite = (await documents("api::site.site").findFirst({
    filters: { slug: { $eq: "sarga-gateway" } },
  })) as { documentId: string } | null;

  // Gateway corporate pages (idempotent by slug). Existing editor content is
  // never overwritten; only a missing availability component is backfilled.
  for (const page of GATEWAY_SITE_PAGES) {
    const existing = (await documents("api::site-page.site-page").findFirst({
      filters: { slug: { $eq: page.slug } },
      populate: ["pageAvailability"],
    })) as {
      documentId: string;
      pageAvailability?: { pageEnabled?: boolean } | null;
    } | null;

    if (!existing) {
      const normalizedPageSections = Array.isArray(page.sections)
        ? page.sections.map((section) => ({
            ...section,
            enabled: true,
          }))
        : page.sections;
      await documents("api::site-page.site-page").create({
        data: {
          ...page,
          ...(normalizedPageSections
            ? { sections: normalizedPageSections }
            : {}),
          ...(gatewaySite ? { site: gatewaySite.documentId } : {}),
        },
        status: "published",
      });
      strapi.log.info(`[seed] Created Gateway site page: ${page.title}`);
    } else if (!existing.pageAvailability && page.pageAvailability) {
      await documents("api::site-page.site-page").update({
        documentId: existing.documentId,
        data: { pageAvailability: page.pageAvailability },
        status: "published",
      });
      strapi.log.info(`[seed] Added Gateway page availability: ${page.title}`);
    }
  }

  // Backfill the page toggle and minimum live-page content for the three
  // internal Gateway ventures. Only absent fields are filled, so editor choices
  // and authored copy remain intact.
  for (const business of ECOSYSTEM_BUSINESSES) {
    if (!("pageAvailability" in business) || !business.pageAvailability) {
      continue;
    }
    const existing = (await documents(
      "api::ecosystem-business.ecosystem-business",
    ).findFirst({
      filters: { slug: { $eq: business.slug } },
      populate: ["pageAvailability", "highlights"],
    })) as {
      documentId: string;
      overview?: string | null;
      highlights?: unknown[] | null;
      pageAvailability?: { pageEnabled?: boolean } | null;
    } | null;

    if (existing) {
      const updateData: Record<string, unknown> = {};
      if (!existing.pageAvailability) {
        updateData.pageAvailability = business.pageAvailability;
      }
      if (!existing.overview?.trim() && "overview" in business) {
        updateData.overview = business.overview;
      }
      if (
        !existing.highlights?.length &&
        "highlights" in business &&
        business.highlights
      ) {
        updateData.highlights = business.highlights;
      }

      if (!Object.keys(updateData).length) continue;
      await documents("api::ecosystem-business.ecosystem-business").update({
        documentId: existing.documentId,
        data: updateData,
        status: "published",
      });
      strapi.log.info(
        `[seed] Backfilled Gateway venture page content: ${business.slug}`,
      );
    }
  }

  // Resolve the Sarga Motorsport business for relations.
  const motorsportBusiness = (await documents(
    "api::ecosystem-business.ecosystem-business",
  ).findFirst({ filters: { slug: { $eq: "sarga-motorsport" } } })) as {
    documentId: string;
  } | null;

  // Motorsport events (idempotent by slug), linked to the motorsport business.
  for (const msEvent of MOTORSPORT_EVENTS) {
    const existing = await documents("api::event.event").findFirst({
      filters: { slug: { $eq: msEvent.slug } },
    });
    if (!existing) {
      await documents("api::event.event").create({
        data: {
          ...msEvent,
          ...(motorsportBusiness
            ? { business: motorsportBusiness.documentId }
            : {}),
        },
        status: "published",
      });
      strapi.log.info(`[seed] Created motorsport event: ${msEvent.title}`);
    }
  }

  // Motorsport partners (idempotent by slug)
  for (const partner of MOTORSPORT_PARTNERS) {
    const existing = await documents("api::partner.partner").findFirst({
      filters: { slug: { $eq: partner.slug } },
    });
    if (!existing) {
      await documents("api::partner.partner").create({
        data: partner,
        status: "published",
      });
      strapi.log.info(`[seed] Created motorsport partner: ${partner.name}`);
    }
  }

  // Motorsport ticket CTAs (idempotent by title), linked to their dedicated
  // Motorsport event. Generic Ticket CTA remains available for shared and
  // legacy content, but Motorsport programs use the dedicated collection.
  const firstMotorsportEvent = (await documents("api::motorsport-event.motorsport-event").findFirst({
    filters: { slug: { $eq: MOTORSPORT_EVENTS[0].slug } },
  })) as { documentId: string } | null;

  for (const cta of MOTORSPORT_TICKET_CTAS) {
    const { relatedEventSlug, siteScope: _siteScope, ...ctaData } = cta;
    const existing = await documents("api::motorsport-ticket-cta.motorsport-ticket-cta").findFirst({
      filters: { title: { $eq: cta.title } },
    });
    if (!existing) {
      const relatedEvent = (await documents("api::motorsport-event.motorsport-event").findFirst({
        filters: { slug: { $eq: relatedEventSlug } },
      })) as { documentId: string } | null;
      await documents("api::motorsport-ticket-cta.motorsport-ticket-cta").create({
        data: {
          ...ctaData,
          ...(relatedEvent
            ? { relatedEvent: relatedEvent.documentId }
            : firstMotorsportEvent
              ? { relatedEvent: firstMotorsportEvent.documentId }
              : {}),
        },
        status: "published",
      });
      strapi.log.info(`[seed] Created motorsport ticket CTA: ${cta.title}`);
    }
  }

  // The approved homepage ticket panel accepts a CMS-managed photo. Seed the
  // first Motorsport CTA with the existing daylight hero artwork only when no
  // artwork has been selected yet; editors can replace it from Media Library.
  const homepageTicketCta = (await documents(
    "api::motorsport-ticket-cta.motorsport-ticket-cta",
  ).findFirst({
    filters: { title: { $eq: "FIA Rallycross World Cup Indonesia 2026 Tickets" } },
    populate: ["image"],
  })) as { documentId: string; image?: unknown } | null;
  if (homepageTicketCta && !homepageTicketCta.image) {
    const ticketArtwork = await uploadIfMissing(
      strapi,
      "sarga-motorsport-hero-circuit-golden-hour.jpg",
      "Red touring race car accelerating through a warm daylight circuit",
    );
    if (ticketArtwork) {
      await documents("api::motorsport-ticket-cta.motorsport-ticket-cta").update({
        documentId: homepageTicketCta.documentId,
        data: { image: ticketArtwork.id },
        status: "published",
      });
      strapi.log.info("[seed] Attached homepage ticket panel artwork.");
    }
  }

  // Motorsport news articles (idempotent by slug), linked to the business + first event.
  for (const article of MOTORSPORT_NEWS) {
    const { showOnGateway: _showOnGateway, showOnMotorsport: _showOnMotorsport, featuredOnMotorsport: _featuredOnMotorsport, siteScope: _siteScope, ...dedicatedArticle } = article;
    const existing = await documents(
      "api::motorsport-news-article.motorsport-news-article",
    ).findFirst({ filters: { slug: { $eq: article.slug } } });
    if (!existing) {
      await documents("api::motorsport-news-article.motorsport-news-article").create({
        data: {
          ...dedicatedArticle,
          ...(motorsportBusiness
            ? { relatedBusinesses: [motorsportBusiness.documentId] }
            : {}),
          ...(firstMotorsportEvent
            ? { relatedEvent: firstMotorsportEvent.documentId }
            : {}),
        },
        status: "published",
      });
      strapi.log.info(`[seed] Created motorsport news: ${article.title}`);
    }
  }

  // Motorsport gallery (idempotent by slug)
  for (const gallery of MOTORSPORT_GALLERIES) {
    const existing = (await documents(
      "api::media-gallery.media-gallery",
    ).findFirst({ filters: { slug: { $eq: gallery.slug } } })) as {
      documentId: string;
      category?: string;
    } | null;
    if (!existing) {
      await documents("api::media-gallery.media-gallery").create({
        data: gallery,
        status: "published",
      });
      strapi.log.info(`[seed] Created motorsport gallery: ${gallery.title}`);
    } else if (!existing.category && gallery.category) {
      await documents("api::media-gallery.media-gallery").update({
        documentId: existing.documentId,
        data: { category: gallery.category },
        status: "published",
      });
      strapi.log.info(`[seed] Set Motorsport gallery category: ${gallery.category}`);
    }
  }

  // --- Motorsport revamp (MSR-2): pages, programs, riders, and merchandise ---

  const motorsportSite = (await documents("api::site.site").findFirst({
    filters: { slug: { $eq: "sarga-motorsport" } },
  })) as { documentId: string } | null;

  const homepageHeroSlides: Array<Record<string, unknown>> = [];
  for (const slide of MOTORSPORT_HOME_HERO_SLIDES) {
    const { file, mobileFile, alt, ...slideData } = slide;
    const media = await uploadIfMissing(strapi, file, alt);
    const mobileMedia = await uploadIfMissing(strapi, mobileFile, alt);
    if (media) {
      homepageHeroSlides.push({
        ...slideData,
        image: media.id,
        ...(mobileMedia ? { mobileImage: mobileMedia.id } : {}),
      });
    }
  }

  // Site-scoped Motorsport pages (idempotent by slug).
  for (const page of MOTORSPORT_SITE_PAGES) {
    const existing = (await documents("api::site-page.site-page").findFirst({
      filters: { slug: { $eq: page.slug } },
      populate: [
        "heroSlides",
        "motorsportFeaturedEvent",
        "motorsportInformationBand",
        "motorsportWorldSection",
        "motorsportTicketSection",
        "sections",
      ],
    })) as {
      documentId: string;
      heroEnabled?: boolean | null;
      heroSlides?: unknown[];
      motorsportFeaturedEvent?: unknown;
      motorsportInformationBand?: unknown;
      motorsportWorldSection?: unknown;
      motorsportTicketSection?: unknown;
      sections?: Array<Record<string, unknown>>;
    } | null;
    const homepagePage =
      page.slug === "motorsport-home" &&
      "motorsportInformationBand" in page &&
      "motorsportWorldSection" in page
        ? page
        : null;
    const heroSlideData =
      page.slug === "motorsport-home" && homepageHeroSlides.length > 0
        ? { heroSlides: homepageHeroSlides }
        : {};
    if (!existing) {
      const normalizedPageSections = Array.isArray(page.sections)
        ? page.sections.map((section) => ({
            ...section,
            enabled: section.enabled !== false,
          }))
        : page.sections;
      await documents("api::site-page.site-page").create({
        data: {
          ...page,
          ...(normalizedPageSections
            ? { sections: normalizedPageSections }
            : {}),
          ...heroSlideData,
          ...(homepagePage && firstMotorsportEvent
            ? { motorsportFeaturedEvent: firstMotorsportEvent.documentId }
            : {}),
          ...(motorsportSite ? { site: motorsportSite.documentId } : {}),
        },
        status: "published",
      });
      strapi.log.info(`[seed] Created Motorsport site page: ${page.title}`);
    } else if (homepagePage) {
      const homepageBackfill: Record<string, unknown> = {};

      if (existing.heroEnabled == null) {
        homepageBackfill.heroEnabled = true;
      }

      if (
        homepageHeroSlides.length > 0 &&
        (!existing.heroSlides || existing.heroSlides.length === 0)
      ) {
        homepageBackfill.heroSlides = homepageHeroSlides;
      }
      if (!existing.motorsportInformationBand) {
        homepageBackfill.motorsportInformationBand =
          homepagePage.motorsportInformationBand;
      }
      if (!existing.motorsportWorldSection) {
        homepageBackfill.motorsportWorldSection =
          homepagePage.motorsportWorldSection;
      }
      if (!existing.motorsportTicketSection) {
        homepageBackfill.motorsportTicketSection =
          homepagePage.motorsportTicketSection;
      }
      if (!existing.motorsportFeaturedEvent && firstMotorsportEvent) {
        homepageBackfill.motorsportFeaturedEvent =
          firstMotorsportEvent.documentId;
      }
      if (Array.isArray(existing.sections)) {
        const configuredSections = Array.isArray(homepagePage.sections)
          ? (homepagePage.sections as Array<Record<string, unknown>>)
          : [];
        const existingSectionKeys = new Set(
          existing.sections.map((section) => String(section.sectionKey)),
        );
        const missingSections = configuredSections.filter(
          (section) => !existingSectionKeys.has(String(section.sectionKey)),
        );
        const normalizedSections = [
          ...existing.sections.map((section) => {
          if (typeof section.enabled === "boolean") return section;
          return {
            ...section,
            enabled: section.sectionKey === "upcoming-events" ? false : true,
          };
          }),
          ...missingSections,
        ];
        if (
          missingSections.length > 0 ||
          normalizedSections.some(
            (section, index) => section.enabled !== existing.sections?.[index]?.enabled,
          )
        ) {
          homepageBackfill.sections = normalizedSections;
        }
      }

      if (Object.keys(homepageBackfill).length > 0) {
        await documents("api::site-page.site-page").update({
          documentId: existing.documentId,
          data: homepageBackfill,
          status: "published",
        });
        strapi.log.info(
          "[seed] Backfilled missing Motorsport homepage managed sections.",
        );
      }
    } else if (
      (Array.isArray(page.sections) && page.sections.length > 0) ||
      existing.heroEnabled == null
    ) {
      if (existing.heroEnabled == null) {
        await documents("api::site-page.site-page").update({
          documentId: existing.documentId,
          data: { heroEnabled: true },
          status: "published",
        });
      }
      if (!Array.isArray(page.sections) || page.sections.length === 0) {
        continue;
      }
      const existingSections = Array.isArray(existing.sections)
        ? existing.sections
        : [];
      const normalizedExistingSections = existingSections.map((section) =>
        typeof section.enabled === "boolean"
          ? section
          : { ...section, enabled: true },
      );
      const existingSectionsChanged = normalizedExistingSections.some(
        (section, index) => section.enabled !== existingSections[index]?.enabled,
      );
      const sectionIdentity = (section: Record<string, unknown>) =>
        section.__component === "motorsport.about-capabilities"
          ? "motorsport.about-capabilities"
          : `${String(section.__component)}:${String(section.sectionKey)}`;
      const existingIdentities = new Set(
        existingSections.map(sectionIdentity),
      );
      const missingSections = (
        page.sections as Array<Record<string, unknown>>
      ).map((section) => ({
        ...section,
        enabled: section.enabled !== false,
      })).filter((section) => !existingIdentities.has(sectionIdentity(section)));

      if (missingSections.length > 0 || existingSectionsChanged) {
        await documents("api::site-page.site-page").update({
          documentId: existing.documentId,
          data: {
            sections: [...normalizedExistingSections, ...missingSections],
          },
          status: "published",
        });
        strapi.log.info(
          `[seed] Backfilled ${missingSections.length} missing sections: ${page.title}`,
        );
      }
    }
  }

  // IJTC and FIA Rallycross program/campaign hubs (idempotent by slug).
  for (const program of MOTORSPORT_PROGRAMS) {
    const {
      relatedEventSlug,
      relatedTicketTitle,
      eventRules: legacyEventRules,
      rundown: legacyRundown,
      ...programData
    } =
      program as typeof program & {
        relatedEventSlug?: string;
        relatedTicketTitle?: string;
        eventRules?: unknown[];
        rundown?: unknown[];
      };
    const existing = await documents(
      "api::motorsport-program.motorsport-program",
    ).findFirst({ filters: { slug: { $eq: program.slug } } });
    if (existing) {
      const existingRecord = existing as {
        documentId: string;
        eventMenuLabel?: string;
        eventMenuEnabled?: boolean;
      };
      const menuFields: Record<string, unknown> = {};
      if (!existingRecord.eventMenuLabel && program.eventMenuLabel) {
        menuFields.eventMenuLabel = program.eventMenuLabel;
      }
      if (typeof existingRecord.eventMenuEnabled !== "boolean") {
        menuFields.eventMenuEnabled = program.eventMenuEnabled !== false;
      }
      if (Object.keys(menuFields).length > 0) {
        await documents("api::motorsport-program.motorsport-program").update({
          documentId: existingRecord.documentId,
          data: menuFields,
          status: "published",
        });
      }
      continue;
    }

    const relatedEvent = relatedEventSlug
      ? ((await documents("api::motorsport-event.motorsport-event").findFirst({
          filters: { slug: { $eq: relatedEventSlug } },
        })) as { documentId: string } | null)
      : null;
    const relatedTicket = relatedTicketTitle
      ? ((await documents("api::motorsport-ticket-cta.motorsport-ticket-cta").findFirst({
          filters: { title: { $eq: relatedTicketTitle } },
        })) as { documentId: string } | null)
      : null;

    const programPayload =
      program.programType === "rallycross"
        ? {
            ...programData,
            fiaRallycrossContent: {
              formatSection: {
                isActive: true,
                showIndex: true,
                indexLabel: "RX / FORMAT",
                showEyebrow: true,
                eyebrow: "Mixed surface / Maximum pressure",
                showTitle: true,
                title: "Every heat changes the order.",
                showBody: true,
                body: "Rallycross compresses starts, contact, strategy, and elimination into a format designed for immediate spectator energy.",
                formatItems: [
                  {
                    isActive: true,
                    sortOrder: 0,
                    label: "01",
                    title: "Launch",
                    description:
                      "Multiple cars attack the first corner together, turning reaction time into instant track position.",
                    accent: "crimson",
                  },
                  {
                    isActive: true,
                    sortOrder: 1,
                    label: "02",
                    title: "Joker lap",
                    description:
                      "Every driver must take the alternate route, creating a strategy window that can reverse the running order.",
                    accent: "orange",
                  },
                  {
                    isActive: true,
                    sortOrder: 2,
                    label: "03",
                    title: "Final",
                    description:
                      "The fastest qualifiers advance through elimination races into one decisive World Cup showdown.",
                    accent: "teal",
                  },
                ],
              },
              rundownSection: {
                isActive: true,
                showIndex: true,
                indexLabel: "RX / RUNDOWN",
                showEyebrow: true,
                eyebrow: "5-6 December 2026",
                showTitle: true,
                title: "Two days. One World Cup.",
                showBody: true,
                body: "Session times are managed in the Sarga CMS and remain subject to sporting or operational updates.",
                rundownItems: legacyRundown ?? [],
              },
              raceDayGuideSection: {
                isActive: true,
                showIndex: true,
                indexLabel: "RX / GUIDE",
                showEyebrow: true,
                eyebrow: "Race-day essentials",
                showTitle: true,
                title: "Know before you go.",
                showBody: true,
                body: "A practical spectator guide for a smooth arrival and a safe, high-energy weekend at the circuit.",
                ruleItems: legacyEventRules ?? [],
              },
            },
          }
        : { ...programData, rundown: legacyRundown };

    await documents("api::motorsport-program.motorsport-program").create({
      data: {
        ...programPayload,
        ...(relatedEvent ? { relatedEvents: [relatedEvent.documentId] } : {}),
        ...(relatedTicket
          ? { relatedTicketCtas: [relatedTicket.documentId] }
          : {}),
        ...(motorsportSite ? { sites: [motorsportSite.documentId] } : {}),
      },
      status: "published",
    });
    strapi.log.info(`[seed] Created Motorsport program: ${program.title}`);
  }

  // Complete the FIA campaign seed once with media, SEO, schedule, rules, and
  // ticket relations. The guard preserves later editor-managed campaign data
  // once every required field is populated.
  const fiaCampaignSeed = MOTORSPORT_PROGRAMS.find(
    (program) => program.slug === "fia-rallycross-world-cup-indonesia-2026",
  );
  const fiaCampaign = (await documents(
    "api::motorsport-program.motorsport-program",
  ).findFirst({
    filters: {
      slug: { $eq: "fia-rallycross-world-cup-indonesia-2026" },
    },
    populate: [
      "bannerSlides.image",
      "motorsportPresentation.hero.backgroundMedia",
      "fiaRallycrossContent.rundownSection.rundownItems",
      "fiaRallycrossContent.raceDayGuideSection.ruleItems",
      "ticketMapSection.image",
      "relatedEvents",
      "relatedTicketCtas",
      "seo",
    ],
  })) as {
    documentId: string;
    ticketMapSection?: { image?: unknown };
    motorsportPresentation?: { hero?: { backgroundMedia?: unknown } };
    bannerSlides?: Array<{ image?: unknown }>;
    fiaRallycrossContent?: {
      rundownSection?: { rundownItems?: unknown[] };
      raceDayGuideSection?: { ruleItems?: unknown[] };
    };
    relatedEvents?: unknown[];
    relatedTicketCtas?: unknown[];
    seo?: unknown;
  } | null;

  if (fiaCampaignSeed && fiaCampaign) {
    const needsCampaignCompletion =
      (fiaCampaign.bannerSlides?.length ?? 0) <
        FIA_CAMPAIGN_MEDIA.slides.length ||
      fiaCampaign.bannerSlides?.some((slide) => !slide.image) ||
      (fiaCampaign.fiaRallycrossContent?.rundownSection?.rundownItems?.length ?? 0) <
        fiaCampaignSeed.rundown.length ||
      (fiaCampaign.fiaRallycrossContent?.raceDayGuideSection?.ruleItems?.length ?? 0) <
        fiaCampaignSeed.eventRules.length ||
      (fiaCampaign.relatedEvents?.length ?? 0) === 0 ||
      (fiaCampaign.relatedTicketCtas?.length ?? 0) === 0 ||
      !fiaCampaign.ticketMapSection?.image ||
      !fiaCampaign.seo;

    if (needsCampaignCompletion) {
      const heroMedia = await uploadIfMissing(
        strapi,
        FIA_CAMPAIGN_MEDIA.hero.file,
        FIA_CAMPAIGN_MEDIA.hero.alt,
      );
      const slideMedia = await Promise.all(
        FIA_CAMPAIGN_MEDIA.slides.map((slide) =>
          uploadIfMissing(strapi, slide.file, slide.alt),
        ),
      );
      const ticketMapMedia = await uploadIfMissing(
        strapi,
        FIA_CAMPAIGN_MEDIA.ticketMap.file,
        FIA_CAMPAIGN_MEDIA.ticketMap.alt,
      );
      const relatedEvent = (await documents("api::motorsport-event.motorsport-event").findFirst({
        filters: {
          slug: { $eq: fiaCampaignSeed.relatedEventSlug },
        },
      })) as { documentId: string } | null;
      const relatedTicket = (await documents(
        "api::motorsport-ticket-cta.motorsport-ticket-cta",
      ).findFirst({
        filters: {
          title: { $eq: fiaCampaignSeed.relatedTicketTitle },
        },
      })) as { documentId: string } | null;
      const {
        relatedEventSlug: _relatedEventSlug,
        relatedTicketTitle: _relatedTicketTitle,
        rundown: _rundown,
        eventRules: _eventRules,
        ...campaignData
      } = fiaCampaignSeed;

      await documents("api::motorsport-program.motorsport-program").update({
        documentId: fiaCampaign.documentId,
        data: {
          ...campaignData,
          bannerSlides: campaignData.bannerSlides.map((slide, index) => ({
            ...slide,
            ...(slideMedia[index] ? { image: slideMedia[index]!.id } : {}),
          })),
          fiaRallycrossContent: {
            formatSection: {
              isActive: true,
              showIndex: true,
              indexLabel: "RX / FORMAT",
              showEyebrow: true,
              eyebrow: "Mixed surface / Maximum pressure",
              showTitle: true,
              title: "Every heat changes the order.",
              showBody: true,
              body: "Rallycross compresses starts, contact, strategy, and elimination into a format designed for immediate spectator energy.",
              formatItems: [],
            },
            rundownSection: {
              isActive: true,
              showIndex: true,
              indexLabel: "RX / RUNDOWN",
              showEyebrow: true,
              eyebrow: "5-6 December 2026",
              showTitle: true,
              title: "Two days. One World Cup.",
              showBody: true,
              body: "Session times are managed in the Sarga CMS and remain subject to sporting or operational updates.",
              rundownItems: fiaCampaignSeed.rundown,
            },
            raceDayGuideSection: {
              isActive: true,
              showIndex: true,
              indexLabel: "RX / GUIDE",
              showEyebrow: true,
              eyebrow: "Race-day essentials",
              showTitle: true,
              title: "Know before you go.",
              showBody: true,
              body: "A practical spectator guide for a smooth arrival and a safe, high-energy weekend at the circuit.",
              ruleItems: fiaCampaignSeed.eventRules,
            },
          },
          seo: {
            ...campaignData.seo,
            ...(heroMedia ? { ogImage: heroMedia.id } : {}),
          },
          ...(relatedEvent ? { relatedEvents: [relatedEvent.documentId] } : {}),
          ...(relatedTicket
            ? { relatedTicketCtas: [relatedTicket.documentId] }
            : {}),
          ...(ticketMapMedia && !fiaCampaign.ticketMapSection?.image
            ? {
                ticketMapSection: {
                  isActive: true,
                  image: ticketMapMedia.id,
                  imageAlt: FIA_CAMPAIGN_MEDIA.ticketMap.alt,
                },
              }
            : {}),
          ...(motorsportSite ? { sites: [motorsportSite.documentId] } : {}),
        },
        status: "published",
      });
      strapi.log.info(
        "[seed] Completed FIA Rallycross campaign media and public content.",
      );
    }
  }

  const ijtcProgram = (await documents(
    "api::motorsport-program.motorsport-program",
  ).findFirst({
    filters: { slug: { $eq: "indonesia-junior-talent-cup" } },
  })) as { documentId: string; rundown?: unknown[] } | null;

  if (ijtcProgram) {
    if ((ijtcProgram.rundown?.length ?? 0) < IJTC_RUNDOWN.length) {
      await documents("api::motorsport-program.motorsport-program").update({
        documentId: ijtcProgram.documentId,
        data: { rundown: IJTC_RUNDOWN },
        status: "published",
      });
      strapi.log.info("[seed] Expanded IJTC demo race schedule.");
    }

    // Demo rider profiles (idempotent by slug).
    for (const rider of IJTC_RIDERS) {
      const { portraitFile, ...riderData } = rider;
      const portrait = await uploadIfMissing(
        strapi,
        portraitFile,
        `Fictional demonstration portrait for ${rider.name}`,
      );
      const existing = (await documents(
        "api::motorsport-rider.motorsport-rider",
      ).findFirst({ filters: { slug: { $eq: rider.slug } } })) as {
        documentId: string;
      } | null;
      const riderPayload = {
        ...riderData,
        program: ijtcProgram.documentId,
        ...(portrait ? { portrait: portrait.id } : {}),
        ...(motorsportSite ? { sites: [motorsportSite.documentId] } : {}),
      };
      if (!existing) {
        await documents("api::motorsport-rider.motorsport-rider").create({
          data: riderPayload,
          status: "published",
        });
        strapi.log.info(`[seed] Created IJTC demo rider: ${rider.name}`);
      } else {
        await documents("api::motorsport-rider.motorsport-rider").update({
          documentId: existing.documentId,
          data: riderPayload,
          status: "published",
        });
        strapi.log.info(`[seed] Refreshed IJTC demo rider: ${rider.name}`);
      }
    }

    // Remove obsolete fictional standing sets left by earlier demo labels. This
    // is deliberately scoped to this programme and `Demo`-prefixed records so
    // editor-created or real classified results are never touched.
    const staleDemoStandings = (await documents(
      "api::motorsport-standing.motorsport-standing",
    ).findMany({
      filters: {
        program: { documentId: { $eq: ijtcProgram.documentId } },
        roundLabel: { $startsWith: "Demo", $ne: "Demo standings" },
      },
      fields: ["roundLabel"],
      limit: 100,
    })) as Array<{ documentId: string; roundLabel: string }>;

    for (const staleStanding of staleDemoStandings) {
      await documents("api::motorsport-standing.motorsport-standing").delete({
        documentId: staleStanding.documentId,
      });
      strapi.log.info(
        `[seed] Removed obsolete IJTC demo standing set: ${staleStanding.roundLabel}`,
      );
    }

    // Demo standings (idempotent by round + rider relation).
    for (const standing of IJTC_STANDINGS) {
      const { riderSlug, ...standingData } = standing;
      const rider = (await documents(
        "api::motorsport-rider.motorsport-rider",
      ).findFirst({ filters: { slug: { $eq: riderSlug } } })) as {
        documentId: string;
      } | null;
      if (!rider) continue;

      const existing = (await documents(
        "api::motorsport-standing.motorsport-standing",
      ).findFirst({
        filters: {
          roundLabel: { $eq: standing.roundLabel },
          rider: { documentId: { $eq: rider.documentId } },
        },
      })) as { documentId: string } | null;
      const standingPayload = {
        ...standingData,
        program: ijtcProgram.documentId,
        rider: rider.documentId,
        ...(motorsportSite ? { sites: [motorsportSite.documentId] } : {}),
      };
      if (!existing) {
        await documents("api::motorsport-standing.motorsport-standing").create({
          data: standingPayload,
          status: "published",
        });
        strapi.log.info(
          `[seed] Created IJTC demo standing: P${standing.position}`,
        );
      } else {
        await documents("api::motorsport-standing.motorsport-standing").update({
          documentId: existing.documentId,
          data: standingPayload,
          status: "published",
        });
        strapi.log.info(
          `[seed] Refreshed IJTC demo standing: P${standing.position}`,
        );
      }
    }

    // Regulation metadata only; the approved PDF remains editor-supplied.
    for (const regulation of IJTC_REGULATIONS) {
      const existing = await documents(
        "api::motorsport-regulation.motorsport-regulation",
      ).findFirst({ filters: { title: { $eq: regulation.title } } });
      if (!existing) {
        await documents(
          "api::motorsport-regulation.motorsport-regulation",
        ).create({
          data: {
            ...regulation,
            program: ijtcProgram.documentId,
            ...(motorsportSite ? { sites: [motorsportSite.documentId] } : {}),
          },
          status: "published",
        });
        strapi.log.info(
          `[seed] Created IJTC regulation metadata: ${regulation.title}`,
        );
      }
    }
  }

  // Merchandise teaser records only; there is no cart, checkout, or payment.
  for (const item of MOTORSPORT_MERCHANDISE) {
    const existing = (await documents(
      "api::merchandise-item.merchandise-item",
    ).findFirst({ filters: { slug: { $eq: item.slug } } })) as {
      documentId: string;
      title?: string;
      description?: string;
    } | null;
    if (!existing) {
      await documents("api::merchandise-item.merchandise-item").create({
        data: {
          ...item,
          ...(motorsportSite ? { sites: [motorsportSite.documentId] } : {}),
        },
        status: "published",
      });
      strapi.log.info(`[seed] Created merchandise teaser: ${item.title}`);
    } else if (
      existing.title?.endsWith(" - Preview") ||
      existing.description?.startsWith("Demonstration merchandise teaser")
    ) {
      await documents("api::merchandise-item.merchandise-item").update({
        documentId: existing.documentId,
        data: item,
        status: "published",
      });
      strapi.log.info(`[seed] Refreshed merchandise teaser: ${item.title}`);
    }
  }

  // --- Horse Sport (Horse Sport Phase 2): horsesport demo set ---

  // Normalize dedicated-business routing (idempotent). The business create
  // block above is count-gated, so businesses seeded before the three-site
  // fields existed keep stale scope/routing on an existing DB. Bring the two
  // dedicated businesses in line so gateway → dedicated-site routing works.
  const DEDICATED_BUSINESS_ROUTING = [
    {
      slug: "sarga-horse-sport",
      siteScope: "shared",
      dedicatedSiteKey: "horsesport",
      dedicatedSiteUrl: "http://localhost:3002",
    },
    {
      slug: "sarga-motorsport",
      siteScope: "shared",
      dedicatedSiteKey: "motorsport",
      dedicatedSiteUrl: "http://localhost:3001",
    },
  ];
  for (const routing of DEDICATED_BUSINESS_ROUTING) {
    const biz = (await documents(
      "api::ecosystem-business.ecosystem-business",
    ).findFirst({ filters: { slug: { $eq: routing.slug } } })) as
      ({ documentId: string } & Record<string, unknown>) | null;
    if (!biz) continue;
    const needsUpdate =
      biz.siteScope !== routing.siteScope ||
      biz.dedicatedSiteKey !== routing.dedicatedSiteKey ||
      biz.dedicatedSiteUrl !== routing.dedicatedSiteUrl;
    if (needsUpdate) {
      await documents("api::ecosystem-business.ecosystem-business").update({
        documentId: biz.documentId,
        data: {
          siteScope: routing.siteScope,
          dedicatedSiteKey: routing.dedicatedSiteKey,
          dedicatedSiteUrl: routing.dedicatedSiteUrl,
        },
        status: "published",
      });
      strapi.log.info(
        `[seed] Normalized dedicated business routing: ${routing.slug}`,
      );
    }
  }

  // Resolve the Sarga Horse Sport business for relations.
  const horseSportBusiness = (await documents(
    "api::ecosystem-business.ecosystem-business",
  ).findFirst({ filters: { slug: { $eq: "sarga-horse-sport" } } })) as {
    documentId: string;
  } | null;

  const horseSportSite = (await documents("api::site.site").findFirst({
    filters: { slug: { $eq: "sarga-horse-sport" } },
  })) as { documentId: string } | null;

  for (const page of HORSESPORT_SITE_PAGES) {
    const existing = await documents("api::site-page.site-page").findFirst({
      filters: { slug: { $eq: page.slug } },
    });
    if (!existing) {
      const normalizedPageSections = Array.isArray(page.sections)
        ? page.sections.map((section) => ({
            ...section,
            enabled: true,
          }))
        : page.sections;
      await documents("api::site-page.site-page").create({
        data: {
          ...page,
          ...(normalizedPageSections
            ? { sections: normalizedPageSections }
            : {}),
          ...(horseSportSite ? { site: horseSportSite.documentId } : {}),
        },
        status: "published",
      });
      strapi.log.info(`[seed] Created Horse Sport site page: ${page.title}`);
    }
  }

  // Horse Sport events (idempotent by slug), linked to the horse sport business.
  for (const hsEvent of HORSESPORT_EVENTS) {
    const existing = await documents("api::event.event").findFirst({
      filters: { slug: { $eq: hsEvent.slug } },
    });
    if (!existing) {
      await documents("api::event.event").create({
        data: {
          ...hsEvent,
          ...(horseSportBusiness
            ? { business: horseSportBusiness.documentId }
            : {}),
        },
        status: "published",
      });
      strapi.log.info(`[seed] Created horse sport event: ${hsEvent.title}`);
    }
  }

  // Horse Sport partners (idempotent by slug)
  for (const partner of HORSESPORT_PARTNERS) {
    const existing = await documents("api::partner.partner").findFirst({
      filters: { slug: { $eq: partner.slug } },
    });
    if (!existing) {
      await documents("api::partner.partner").create({
        data: partner,
        status: "published",
      });
      strapi.log.info(`[seed] Created horse sport partner: ${partner.name}`);
    }
  }

  // Horse Sport ticket CTAs (idempotent by title), linked to the first event.
  const firstHorseSportEvent = (await documents("api::event.event").findFirst({
    filters: { slug: { $eq: HORSESPORT_EVENTS[0].slug } },
  })) as { documentId: string } | null;

  for (const cta of HORSESPORT_TICKET_CTAS) {
    const existing = await documents("api::ticket-cta.ticket-cta").findFirst({
      filters: { title: { $eq: cta.title } },
    });
    if (!existing) {
      await documents("api::ticket-cta.ticket-cta").create({
        data: {
          ...cta,
          ...(firstHorseSportEvent
            ? { relatedEvent: firstHorseSportEvent.documentId }
            : {}),
        },
        status: "published",
      });
      strapi.log.info(`[seed] Created horse sport ticket CTA: ${cta.title}`);
    }
  }

  // Horse Sport gallery (idempotent by slug)
  for (const gallery of HORSESPORT_GALLERIES) {
    const existing = await documents(
      "api::media-gallery.media-gallery",
    ).findFirst({ filters: { slug: { $eq: gallery.slug } } });
    if (!existing) {
      await documents("api::media-gallery.media-gallery").create({
        data: gallery,
        status: "published",
      });
      strapi.log.info(`[seed] Created horse sport gallery: ${gallery.title}`);
    }
  }

  // Horse Sport news articles (idempotent by slug), linked to the business,
  // first event, and race-day gallery.
  const horseSportGallery = (await documents(
    "api::media-gallery.media-gallery",
  ).findFirst({
    filters: { slug: { $eq: HORSESPORT_GALLERIES[0].slug } },
  })) as { documentId: string } | null;

  for (const article of HORSESPORT_NEWS) {
    const existing = await documents(
      "api::news-article.news-article",
    ).findFirst({ filters: { slug: { $eq: article.slug } } });
    if (!existing) {
      await documents("api::news-article.news-article").create({
        data: {
          ...article,
          ...(horseSportBusiness
            ? { relatedBusinesses: [horseSportBusiness.documentId] }
            : {}),
          ...(firstHorseSportEvent
            ? { relatedEvent: firstHorseSportEvent.documentId }
            : {}),
          ...(horseSportGallery
            ? { relatedGallery: horseSportGallery.documentId }
            : {}),
        },
        status: "published",
      });
      strapi.log.info(`[seed] Created horse sport news: ${article.title}`);
    }
  }

  // Timeline items (About page corporate record)
  const timelineCount = await documents(
    "api::timeline-item.timeline-item",
  ).count();
  if (timelineCount === 0) {
    for (const item of TIMELINE_ITEMS) {
      await documents("api::timeline-item.timeline-item").create({
        data: item,
        status: "published",
      });
    }
    strapi.log.info(`[seed] Created ${TIMELINE_ITEMS.length} timeline items.`);
  }

  // Leadership people (About page corporate record)
  const leadershipCount = await documents(
    "api::leadership-person.leadership-person",
  ).count();
  if (leadershipCount === 0) {
    for (const person of LEADERSHIP_PEOPLE) {
      await documents("api::leadership-person.leadership-person").create({
        data: person,
        status: "published",
      });
    }
    strapi.log.info(
      `[seed] Created ${LEADERSHIP_PEOPLE.length} leadership people.`,
    );
  }
  for (const person of LEADERSHIP_PEOPLE) {
    const existingPerson = (await documents(
      "api::leadership-person.leadership-person",
    ).findFirst({ filters: { name: { $eq: person.name } } })) as {
      documentId: string;
      summary?: string;
      siteScope?: string;
    } | null;

    if (existingPerson && (!existingPerson.summary || !existingPerson.siteScope)) {
      await documents("api::leadership-person.leadership-person").update({
        documentId: existingPerson.documentId,
        data: {
          ...(existingPerson.summary ? {} : { summary: person.summary }),
          ...(existingPerson.siteScope ? {} : { siteScope: "shared" }),
        },
        status: "published",
      });
    }
  }

  // Placeholder media (upload + attach where image fields are empty)
  await seedMedia(strapi, documents);

  // Horse Sport: replace low-res placeholders with curated high-res art
  await refreshHorseSportMedia(strapi, documents);

  // Timeline item images (matched by order field)
  const TIMELINE_MEDIA = [
    {
      order: 1,
      file: "sarga-cinematic-hero-concept.jpg",
      alt: "Sarga corporate concept visualization",
    },
    {
      order: 2,
      file: "sarga-motorsport-concept.jpg",
      alt: "Motorsport event concept visualization",
    },
    {
      order: 3,
      file: "sarga-horse-sport-turf-aerial.jpg",
      alt: "Aerial view of integrated venue network",
    },
  ];
  for (const item of TIMELINE_MEDIA) {
    const doc = (await documents("api::timeline-item.timeline-item").findFirst({
      filters: { order: { $eq: item.order } },
      populate: ["image"],
    })) as { documentId: string; image?: unknown } | null;
    if (!doc || doc.image) continue;
    const file = await uploadIfMissing(strapi, item.file, item.alt);
    if (!file) continue;
    await documents("api::timeline-item.timeline-item").update({
      documentId: doc.documentId,
      data: { image: file.id },
      status: "published",
    });
    strapi.log.info(
      `[seed] Attached ${item.file} \u2192 timeline-item (order=${item.order})`,
    );
  }

  // Leadership portraits (matched by name field)
  const LEADERSHIP_MEDIA = [
    { name: "Farry Ongko Widjaja", file: "farry-ongko-widjaja.jpg" },
    { name: "Diana Airin", file: "diana-airin.jpg" },
    { name: "Nugdha Achadie", file: "nugdha-achadie.jpg" },
    { name: "Zaki Maulani", file: "zaki-maulani.jpg" },
    { name: "Aseanto Oudang", file: "aseanto-oudang.jpg" },
    { name: "Samsul Purba", file: "samsul-purba.jpg" },
  ];
  for (const item of LEADERSHIP_MEDIA) {
    const doc = (await documents(
      "api::leadership-person.leadership-person",
    ).findFirst({
      filters: { name: { $eq: item.name } },
      populate: ["portrait"],
    })) as { documentId: string; portrait?: unknown } | null;
    if (!doc || doc.portrait) continue;
    const file = await uploadIfMissing(
      strapi,
      item.file,
      `Portrait of ${item.name}`,
    );
    if (!file) continue;
    await documents("api::leadership-person.leadership-person").update({
      documentId: doc.documentId,
      data: { portrait: file.id },
      status: "published",
    });
    strapi.log.info(
      `[seed] Attached ${item.file} \u2192 leadership-person (${item.name})`,
    );
  }

  // Gallery mediaItems (attach existing seed images to the motorsport gallery)
  const GALLERY_FILES = [
    {
      file: "sarga-motorsport-concept.jpg",
      alt: "Red touring race car accelerating past a circuit grandstand",
    },
    {
      file: "sarga-cinematic-hero-concept.jpg",
      alt: "Three horses running alongside a red race car at a modern circuit",
    },
    {
      file: "sarga-horse-sport-turf-aerial.jpg",
      alt: "Aerial view of a jockey galloping across turf",
    },
    {
      file: "news-merdeka-jockeys.jpg",
      alt: "Two jockeys racing side by side past a blurred grandstand",
    },
    {
      file: "news-turf-track-aerial.jpg",
      alt: "Aerial view of curved turf and dirt racing track lanes",
    },
  ];
  const galleryDoc = (await documents(
    "api::media-gallery.media-gallery",
  ).findFirst({
    filters: { slug: { $eq: "media-gallery" } },
    populate: ["mediaItems"],
  })) as { documentId: string; mediaItems?: unknown[] } | null;
  if (galleryDoc && !galleryDoc.mediaItems?.length) {
    const fileIds: number[] = [];
    for (const item of GALLERY_FILES) {
      const file = await uploadIfMissing(strapi, item.file, item.alt);
      if (file) fileIds.push(file.id);
    }
    if (fileIds.length > 0) {
      await documents("api::media-gallery.media-gallery").update({
        documentId: galleryDoc.documentId,
        data: { mediaItems: fileIds },
        status: "published",
      });
      strapi.log.info(
        `[seed] Attached ${fileIds.length} images \u2192 media-gallery (media-gallery)`,
      );
    }
  }

  // Horse Sport gallery mediaItems (attach existing seed images)
  const HORSESPORT_GALLERY_FILES = [
    {
      file: "news-merdeka-jockeys.jpg",
      alt: "Two jockeys racing side by side past a blurred grandstand",
    },
    {
      file: "news-turf-track-aerial.jpg",
      alt: "Aerial view of curved turf and dirt racing track lanes",
    },
    {
      file: "news-stable-interior.jpg",
      alt: "Elite race horse inside a premium stable interior",
    },
    {
      file: "sarga-horse-sport-turf-aerial.jpg",
      alt: "Aerial view of a jockey galloping across turf",
    },
  ];
  const horseSportGalleryDoc = (await documents(
    "api::media-gallery.media-gallery",
  ).findFirst({
    filters: { slug: { $eq: "horse-sport-race-day" } },
    populate: ["mediaItems"],
  })) as { documentId: string; mediaItems?: unknown[] } | null;
  if (horseSportGalleryDoc && !horseSportGalleryDoc.mediaItems?.length) {
    const fileIds: number[] = [];
    for (const item of HORSESPORT_GALLERY_FILES) {
      const file = await uploadIfMissing(strapi, item.file, item.alt);
      if (file) fileIds.push(file.id);
    }
    if (fileIds.length > 0) {
      await documents("api::media-gallery.media-gallery").update({
        documentId: horseSportGalleryDoc.documentId,
        data: { mediaItems: fileIds },
        status: "published",
      });
      strapi.log.info(
        `[seed] Attached ${fileIds.length} images \u2192 media-gallery (horse-sport-race-day)`,
      );
    }
  }

  strapi.log.info("[seed] Demo content check complete.");
}
