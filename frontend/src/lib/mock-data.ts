/**
 * Temporary content source for Phase 3.
 *
 * Field names mirror the Strapi content model in docs/05_content_model_strapi.md.
 * As of Phase 4 this module is the typed fallback used by the Strapi services in
 * src/lib/strapi/ when the CMS is unavailable. Shared entity types live in
 * src/lib/strapi/types.ts and are re-exported here for existing importers.
 */

import type {
  EcosystemBusiness,
  EcosystemPillarId,
  EventItem,
  HomepageContent,
  LeadershipPerson,
  NewsArticle,
} from "@/lib/strapi/types";

export type {
  AboutHighlight,
  EcosystemBusiness,
  EcosystemPillarId,
  EventItem,
  HomepageContent,
  LeadershipPerson,
  NewsArticle,
} from "@/lib/strapi/types";

export type NavigationItem = {
  href: string;
  label: string;
  highlight?: boolean;
};

export type ProjectPage = {
  href: string;
  title: string;
  description: string;
};

export const navigationItems: NavigationItem[] = [
  { href: "/about", label: "About" },
  { href: "/ecosystem", label: "360° Ecosystem" },
  { href: "/news", label: "News & Publication" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Get in Touch" },
  { href: "/ticket-hub", label: "Ticket Hub", highlight: true },
];

export const projectPages: ProjectPage[] = [
  {
    href: "/about",
    title: "About",
    description: "Corporate root, governance, history, and reporting.",
  },
  {
    href: "/ecosystem",
    title: "360° Ecosystem",
    description:
      "The gateway to Sarga's businesses and intellectual properties.",
  },
  {
    href: "/news",
    title: "News & Publications",
    description: "News, reports, press releases, and editorial content.",
  },
  {
    href: "/careers",
    title: "Careers",
    description:
      "Opportunities and calls for talent across the Sarga ecosystem.",
  },
  {
    href: "/contact",
    title: "Get in Touch",
    description: "Partnership, sponsorship, media, and general inquiries.",
  },
  {
    href: "/ticket-hub",
    title: "Ticket Hub",
    description: "Event discovery and partner ticketing redirects.",
  },
];

/* ------------------------------------------------------------------ */
/* Homepage single type (docs/05 → Homepage)                          */
/* ------------------------------------------------------------------ */

export const homepage: HomepageContent = {
  heroEyebrow: "360° Sports & Entertainment Leader",
  heroTitle: "The Leader in 360° Sport & Entertainment",
  heroDescription:
    "Sarga.co operates as a highly integrated national powerhouse. We unify elite horse sports, high-performance motorsport tracks, live entertainment festivals, media rights, and modern ticketing platforms into a singular, highly efficient ecosystem.",
  heroImage: {
    url: "/assets/media/generated/sarga-hero-360.png",
    alt: "A herd of horses galloping alongside a red race car at golden dusk",
    width: 2880,
    height: 1620,
  },
  heroImageMobile: {
    url: "/assets/media/generated/sarga-hero-360-mobile.png",
    alt: "A lead horse and red race car charging forward through sunset dust",
    width: 1080,
    height: 1920,
  },
  primaryCtaLabel: "Explore Ecosystem",
  primaryCtaUrl: "/ecosystem",
  secondaryCtaLabel: "Corporate Root",
  secondaryCtaUrl: "/about",
  aboutEyebrow: "The Corporate Root",
  aboutSummaryTitle: "About",
  aboutSummaryBody:
    "Sarga Group operates as the direct holding governance overseeing premier tracks, entertainment production, and sustainable sports infrastructure in Indonesia.",
  aboutHighlights: [
    {
      label: "Governance",
      title: "Board of Director",
      description:
        "Strategic oversight steering long-term value across all Sarga business units.",
      href: "/about/board-of-directors",
    },
    {
      label: "Structure",
      title: "Company Structure",
      description:
        "An integrated holding model that lets each IP scale without losing shared standards.",
      href: "/about/company-structure",
    },
  ],
};

export const leadershipPeople: LeadershipPerson[] = [
  {
    name: "Aseanto Oudang",
    role: "Co-Founder & Chairman",
    group: "board",
    order: 1,
    portrait: {
      url: "/assets/media/leadership/aseanto-oudang.jpg",
      alt: "Portrait of Aseanto Oudang",
      width: 768,
      height: 768,
    },
  },
  {
    name: "Farry Ongko Widjaja",
    role: "Commissioner",
    group: "board",
    order: 2,
    portrait: {
      url: "/assets/media/leadership/farry-ongko-widjaja.jpg",
      alt: "Portrait of Farry Ongko Widjaja",
      width: 768,
      height: 768,
    },
  },
  {
    name: "Nugdha Achadie",
    role: "Chief Executive Officer (CEO)",
    group: "executive",
    order: 3,
    portrait: {
      url: "/assets/media/leadership/nugdha-achadie.jpg",
      alt: "Portrait of Nugdha Achadie",
      width: 768,
      height: 768,
    },
  },
  {
    name: "Zaki Maulani",
    role: "Chief Financial Officer (CFO)",
    group: "executive",
    order: 4,
    portrait: {
      url: "/assets/media/leadership/zaki-maulani.jpg",
      alt: "Portrait of Zaki Maulani",
      width: 768,
      height: 768,
    },
  },
  {
    name: "Diana Airin",
    role: "Chief Commercial Officer (CCO)",
    group: "executive",
    order: 5,
    portrait: {
      url: "/assets/media/leadership/diana-airin.jpg",
      alt: "Portrait of Diana Airin",
      width: 768,
      height: 768,
    },
  },
  {
    name: "Samsul Purba",
    role: "Chief Operating Officer (COO)",
    group: "executive",
    order: 6,
    portrait: {
      url: "/assets/media/leadership/samsul-purba.jpg",
      alt: "Portrait of Samsul Purba",
      width: 768,
      height: 768,
    },
  },
];

export type AboutTabItem = {
  meta: string;
  title: string;
  description: string;
  imageClass: string;
};

export type AboutTab = {
  id: "history" | "leadership" | "reports";
  label: string;
  items: AboutTabItem[];
  emptyMessage?: string;
};

export const aboutTabs: AboutTab[] = [
  {
    id: "history",
    label: "History Timeline",
    items: [
      {
        meta: "2023 - Concept Formulation",
        title: "Groundwork of PT Sarga Multi Ekosistem",
        description:
          "Sarga was conceptualized to solve fragmented infrastructure across equine and motorsport categories through a centralized holding portfolio.",
        imageClass:
          "bg-gradient-to-br from-[#8cc7dc] via-[#d7b997] to-[#9c3e25]",
      },
      {
        meta: "2024 - Event Synergies",
        title: "First Major Festivals & Digital Broadcasts",
        description:
          "Initial motorsport trials and equestrian derbies were paired with multi-platform digital broadcasting rights, serving more than half a million viewers.",
        imageClass:
          "bg-gradient-to-br from-[#273774] via-[#9c2d91] to-[#ff814a]",
      },
      {
        meta: "2025 - Venue Development",
        title: "An Integrated Venue Network",
        description:
          "Collaborative development brought together modern tracks, lifestyle destinations, and high-performance sports infrastructure.",
        imageClass:
          "bg-gradient-to-br from-[#2f96b4] via-[#efcb49] to-[#df403a]",
      },
    ],
  },
  {
    id: "leadership",
    label: "Leadership Council",
    items: [],
    emptyMessage:
      "Leadership profiles are prepared for CMS publication once the official council roster and portraits are approved.",
  },
  {
    id: "reports",
    label: "Reports & Charters",
    items: [],
    emptyMessage:
      "Corporate reports and sustainability charters will appear here when approved files are published in Strapi.",
  },
];

/* ------------------------------------------------------------------ */
/* Ecosystem (docs/05 → Ecosystem Business + pillars)                 */
/* ------------------------------------------------------------------ */

export const ecosystemIntro = {
  eyebrow: "The Sarga Framework",
  title: "360° Ecosystem",
  description:
    "The foundational framework of Sarga's commercial operations is structured around interconnected core pillars spanning Sports, Venue, Media, and Technology — explored through a single, unified gateway.",
} as const;

export type EcosystemPillar = {
  id: EcosystemPillarId;
  label: string;
  headline: string;
  blurb: string;
};

export const ecosystemPillars: EcosystemPillar[] = [
  {
    id: "sports",
    label: "Sports",
    headline: "High Performance Sports",
    blurb:
      "Formulating premium race classifications across national horse sports and roaring motorsport categories.",
  },
  {
    id: "venue",
    label: "Venue",
    headline: "Venues & Track",
    blurb:
      "Designing, developing, and restoring championship-grade tracks, stables, and spectator venues.",
  },
  {
    id: "media",
    label: "Media",
    headline: "Media & Broadcast",
    blurb:
      "Multi-angle broadcast, editorial, and media-rights operations across the Sarga portfolio.",
  },
  {
    id: "technology",
    label: "Technology",
    headline: "Sports Technology",
    blurb:
      "Modern ticketing platforms and real-time data insights powering live experiences.",
  },
];

export const ecosystemBusinesses: EcosystemBusiness[] = [
  {
    name: "Sarga Horse Sport",
    slug: "sarga-horse-sport",
    pillar: "sports",
    shortDescription:
      "Organizer of premium national horse derbies, showcasing elite jockeys and managing strict veterinary compliance protocols.",
    overview:
      "A national horse-sport platform combining championship operations, athlete development, equine welfare, broadcast storytelling, and premium spectator experiences.",
    highlights: [
      {
        label: "Competition",
        title: "Championship operations",
        description:
          "Race formats, stewarding, and veterinary protocols designed around sporting credibility.",
      },
      {
        label: "Athletes",
        title: "Horse and rider development",
        description:
          "A connected pathway supporting equine performance, jockey capability, and responsible participation.",
      },
      {
        label: "Audience",
        title: "Broadcast-ready spectacle",
        description:
          "Live experiences shaped for grandstand energy, editorial coverage, and digital distribution.",
      },
    ],
    ctaLabel: "Find Out More",
    status: "active",
    order: 1,
    cardImage: {
      url: "/assets/media/generated/horse-sport-card.png",
      alt: "Aerial view of a jockey galloping across an emerald turf track",
      width: 1400,
      height: 2100,
    },
    heroImage: {
      url: "/assets/media/generated/horse-sport-hero.png",
      alt: "Two jockeys racing neck-and-neck past a motion-blurred grandstand",
      width: 2560,
      height: 1440,
    },
    gallery: [
      {
        url: "/assets/media/generated/horse-sport-hero.png",
        alt: "Two jockeys racing neck-and-neck past a motion-blurred grandstand",
        width: 2560,
        height: 1440,
      },
      {
        url: "/assets/media/generated/horse-sport-card.png",
        alt: "Aerial view of a jockey galloping across an emerald turf track",
        width: 1400,
        height: 2100,
      },
    ],
  },
  {
    name: "Sarga Motorsport",
    slug: "sarga-motorsport",
    pillar: "sports",
    shortDescription:
      "Constructing high-stakes tarmac motorsport series and touring car cups that attract global racing associations.",
    overview:
      "A performance-led motorsport property connecting competitive series, circuit operations, engineering culture, premium hospitality, and media-ready race weekends.",
    highlights: [
      {
        label: "Series",
        title: "High-stakes competition",
        description:
          "Touring and formula formats built around rigorous sporting and safety standards.",
      },
      {
        label: "Operations",
        title: "Circuit intelligence",
        description:
          "Integrated venue, race-control, and participant systems supporting dependable event delivery.",
      },
      {
        label: "Experience",
        title: "Trackside culture",
        description:
          "A premium audience platform combining speed, hospitality, entertainment, and live storytelling.",
      },
    ],
    ctaLabel: "Find Out More",
    status: "active",
    order: 2,
    cardImage: {
      url: "/assets/media/generated/motorsport-card.png",
      alt: "A red touring race car powering through a circuit corner",
      width: 1400,
      height: 2100,
    },
    heroImage: {
      url: "/assets/media/generated/motorsport-hero.png",
      alt: "Close rear view of a formula race car trailing sparks at dusk",
      width: 2560,
      height: 1440,
    },
    gallery: [
      {
        url: "/assets/media/generated/motorsport-hero.png",
        alt: "Close rear view of a formula race car trailing sparks at dusk",
        width: 2560,
        height: 1440,
      },
      {
        url: "/assets/media/generated/motorsport-card.png",
        alt: "A red touring race car powering through a circuit corner",
        width: 1400,
        height: 2100,
      },
    ],
  },
  {
    name: "Sarga Venues",
    slug: "sarga-venues",
    pillar: "venue",
    shortDescription:
      "Developing and restoring championship-grade tracks, stables, and spectator venues for world-class events.",
    ctaLabel: "Coming Soon",
    status: "comingSoon",
    order: 3,
  },
  {
    name: "Sarga Media",
    slug: "sarga-media",
    pillar: "media",
    shortDescription:
      "Broadcast, editorial, and media-rights operations amplifying every Sarga property across channels.",
    ctaLabel: "Coming Soon",
    status: "comingSoon",
    order: 4,
  },
  {
    name: "Sarga Tech",
    slug: "sarga-tech",
    pillar: "technology",
    shortDescription:
      "Ticketing platforms and live data technology powering seamless fan experiences across the ecosystem.",
    ctaLabel: "Coming Soon",
    status: "comingSoon",
    order: 5,
  },
];

export function businessesByPillar(
  pillar: EcosystemPillarId,
): EcosystemBusiness[] {
  return ecosystemBusinesses
    .filter((business) => business.pillar === pillar)
    .sort((a, b) => a.order - b.order);
}

/* ------------------------------------------------------------------ */
/* News Article (docs/05 → News Article)                              */
/* ------------------------------------------------------------------ */

export const newsArticles: NewsArticle[] = [
  {
    title: "Sarga Cup Merdeka Series Achieves Spectator Benchmarks",
    slug: "sarga-cup-merdeka-series",
    excerpt:
      "Over 200 thousand horse racing enthusiasts and digital spectators tuned in to our multi-angle broadcast experience.",
    category: "news",
    publishedDate: "2025-07-24",
    isHotTopic: true,
    coverImage: {
      url: "/assets/media/generated/news-merdeka.png",
      alt: "Two jockeys racing side by side past a blurred grandstand",
      width: 1920,
      height: 1280,
    },
  },
  {
    title:
      "Sarga Group Signs MoU With Regional Tourism Portfolios for Turf Track",
    slug: "sarga-group-mou-turf-track",
    excerpt:
      "PT Sarga Multi Ekosistem commits to multi-year investments designing high-performance racing venues and destinations.",
    category: "press-release",
    publishedDate: "2025-10-12",
    isHotTopic: false,
    coverImage: {
      url: "/assets/media/generated/news-turf-track.png",
      alt: "Aerial view of curved turf and dirt racing track lanes",
      width: 1920,
      height: 1280,
    },
  },
  {
    title: "Inside the Stable: Elite Jockey Lifestyles and Equine Biology",
    slug: "inside-the-stable-elite-jockey",
    excerpt:
      "An editorial review covering veterinary nutrition formulas, physical track conditioning, and daily jockey routines.",
    category: "magazine",
    publishedDate: "2025-07-24",
    isHotTopic: false,
    coverImage: {
      url: "/assets/media/generated/news-stable.png",
      alt: "Horses inside a modern stable atrium lit by a circular skylight",
      width: 1920,
      height: 1280,
    },
  },
];

/* ------------------------------------------------------------------ */
/* Event (docs/05 → Event)                                            */
/* ------------------------------------------------------------------ */

export const events: EventItem[] = [
  {
    title: "Sarga Championship Weekend",
    slug: "sample-event",
    description:
      "A flagship weekend connecting elite horse sport, motorsport showcases, live entertainment, and premium hospitality.",
    eventDate: "2026-09-19",
    endDate: "2026-09-20",
    venue: "Sarga Integrated Sporting Grounds, Indonesia",
    status: "upcoming",
    ticketCtaLabel: "Partner tickets coming soon",
    ticketIntegrationType: "redirect",
    coverImage: {
      url: "/assets/media/generated/event-championship.png",
      alt: "A floodlit championship circuit and festival crowd at night",
      width: 1920,
      height: 1280,
    },
  },
];

export const ticketHubCta = {
  eyebrow: "Ticket Hub",
  title: "Your Gateway to Live Sarga Experiences",
  description:
    "Discover championship derbies, motorsport cups, and live festivals. Seats are secured through trusted partner ticketing platforms — never internal payment.",
  ctaLabel: "Explore Ticket Hub",
  ctaUrl: "/ticket-hub",
} as const;

/* ------------------------------------------------------------------ */
/* Footer + newsletter                                                */
/* ------------------------------------------------------------------ */

export const footerGroups = [
  {
    title: "Ecosystem Map",
    items: [
      { href: "/ecosystem/sarga-horse-sport", label: "Sarga Horse Sport" },
      { href: "/ecosystem/sarga-motorsport", label: "Sarga Motorsport" },
      { href: "/ecosystem", label: "Sarga Festival" },
      { href: "/ecosystem", label: "Sarga Rising Star" },
      { href: "/ecosystem", label: "Venue & Track restoration" },
    ],
  },
  {
    title: "Publications",
    items: [
      { href: "/news", label: "Sarga News Syndicate" },
      { href: "/news", label: "Official Press Releases" },
      { href: "/news", label: "Sarga Magazine" },
      { href: "/news", label: "Fiscal Balance Report 2025" },
      { href: "/news", label: "Equine Sustainability Charters" },
    ],
  },
] as const;

export const newsletter = {
  title: "Newsletter",
  description:
    "Receive priority email alerts concerning championship ticket launches, stable entries, and corporate reports.",
  placeholder: "your@mail.com",
} as const;

export const newsletterSection = {
  eyebrow: "Stay in the loop",
  title: "Join the Sarga Circle",
  description:
    "Get championship ticket launches, stable entries, and corporate reports delivered before they go public.",
  placeholder: "your@mail.com",
} as const;

export const siteMeta = {
  copyright: "© 2026 Sarga.co (PT Sarga Multi Ekosistem). All rights reserved.",
} as const;
