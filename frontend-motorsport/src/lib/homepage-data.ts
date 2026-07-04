/**
 * Homepage data layer — CMS-first with curated placeholder fallbacks.
 *
 * `fetchHomepageData()` attempts to load live content from the shared Strapi
 * CMS (siteScope = motorsport | shared).  When the API is unreachable or
 * returns no data, the module falls back to `PLACEHOLDER_DATA` so the page
 * always renders with on-brand content.
 */

import type {
  GalleryItem,
  MotorsportArticle,
  MotorsportEvent,
  PartnerItem,
} from "@/types/design-system";

import {
  fetchStrapiList,
  mediaUrl,
  type StrapiListResponse,
  type StrapiMedia,
} from "./strapi/client";

/* -------------------------------------------------------------------------- */
/*  Public shape                                                              */
/* -------------------------------------------------------------------------- */

export type HomepageData = {
  featuredEvent: MotorsportEvent | null;
  upcomingEvents: MotorsportEvent[];
  featuredArticle: MotorsportArticle | null;
  articles: MotorsportArticle[];
  gallery: GalleryItem[];
  partners: PartnerItem[];
  ticketCta: {
    provider: string;
    href: string;
    label: string;
    eventName?: string;
  } | null;
};

/* -------------------------------------------------------------------------- */
/*  Strapi CMS shapes (mirrors cms/src/api schemas)                           */
/* -------------------------------------------------------------------------- */

type CmsEvent = {
  title: string;
  slug: string;
  date: string;
  endDate?: string;
  venue: string;
  venueAddress?: string;
  eventStatus: string;
  racingCategory?: string;
  seriesName?: string;
  siteScope?: string;
  coverImage?: StrapiMedia | null;
  heroMedia?: StrapiMedia | null;
  ticketCtas?: Array<CmsTicketCta & { id: number; documentId: string }>;
};

type CmsTicketCta = {
  label: string;
  provider: string;
  redirectUrl: string;
};

type CmsArticle = {
  title: string;
  slug: string;
  publishedAt: string;
  excerpt?: string;
  category?: string;
  siteScope?: string;
  coverImage?: StrapiMedia | null;
};

type CmsPartner = {
  name: string;
  website?: string;
  logo?: StrapiMedia | null;
};

type CmsGallery = {
  title: string;
  siteScope?: string;
  mediaItems?: StrapiMedia[];
};

/* -------------------------------------------------------------------------- */
/*  Mapping helpers                                                           */
/* -------------------------------------------------------------------------- */

function statusMap(raw?: string): MotorsportEvent["status"] {
  switch (raw) {
    case "tickets_open":
    case "tickets-open":
      return "tickets-open";
    case "live":
    case "live_now":
      return "live";
    case "sold_out":
    case "sold-out":
      return "sold-out";
    case "completed":
      return "completed";
    case "cancelled":
      return "cancelled";
    default:
      return "announced";
  }
}

function formatDate(iso?: string): string {
  if (!iso) return "TBA";
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "TBA";
  }
}

function mapEvent(
  entry: StrapiListResponse<CmsEvent>["data"][number],
): MotorsportEvent {
  const img = entry.coverImage ?? entry.heroMedia ?? null;
  return {
    title: entry.title ?? "Untitled event",
    slug: entry.slug,
    href: `/events/${entry.slug ?? entry.documentId}`,
    dateLabel: formatDate(entry.date),
    venue: entry.venue ?? "TBA",
    image: mediaUrl(img?.url) || "/media/motorsport-design-hero.png",
    imageAlt:
      img?.alternativeText ?? `${entry.title} — Sarga Motorsport event`,
    status: statusMap(entry.eventStatus),
    category: entry.racingCategory ?? undefined,
    seriesName: entry.seriesName ?? undefined,
    ticketHref: entry.ticketCtas?.[0]?.redirectUrl
      ? `/tickets`
      : undefined,
  };
}

function mapArticle(
  entry: StrapiListResponse<CmsArticle>["data"][number],
): MotorsportArticle {
  const img = entry.coverImage ?? null;
  return {
    title: entry.title ?? "Untitled article",
    href: `/news/${entry.slug ?? entry.documentId}`,
    image: mediaUrl(img?.url) || "/media/motorcycle-racing-dusk.png",
    imageAlt:
      img?.alternativeText ?? `${entry.title} — Sarga Motorsport news`,
    category: entry.category ?? "Motorsport",
    publishedLabel: formatDate(entry.publishedAt),
    excerpt: entry.excerpt ?? undefined,
  };
}

function mapPartner(
  entry: StrapiListResponse<CmsPartner>["data"][number],
): PartnerItem {
  return {
    name: entry.name ?? "Partner",
    logo:
      mediaUrl(entry.logo?.url) ||
      "/brand/logo-sarga-motorsport-symbol-sport.png",
    href: entry.website ?? undefined,
  };
}

/* -------------------------------------------------------------------------- */
/*  Placeholder content (used when CMS is unreachable)                        */
/* -------------------------------------------------------------------------- */

const PLACEHOLDER_EVENT: MotorsportEvent = {
  title: "Race Weekend Indonesia",
  slug: "race-weekend-indonesia",
  href: "/events/race-weekend-indonesia",
  dateLabel: "18–20 Sep 2026",
  venue: "Sentul International Circuit, Jakarta",
  image: "/media/motorsport-design-hero.png",
  imageAlt: "Touring race car throwing sparks on a circuit at dusk",
  status: "tickets-open",
  category: "Touring Car",
  seriesName: "Sarga Motorsport Series",
  ticketHref: "/tickets",
};

const PLACEHOLDER_EVENTS: MotorsportEvent[] = [
  {
    title: "Superbike Night Sessions",
    slug: "superbike-night-sessions",
    href: "/events/superbike-night-sessions",
    dateLabel: "04 Oct 2026",
    venue: "Mandalika International Street Circuit",
    image: "/media/motorcycle-racing-dusk.png",
    imageAlt: "Superbike riders leaning through a circuit corner at dusk",
    status: "announced",
    category: "Superbike",
    seriesName: "Sarga Motorcycle Series",
  },
  {
    title: "GT Endurance Challenge",
    slug: "gt-endurance-challenge",
    href: "/events/gt-endurance-challenge",
    dateLabel: "22 Nov 2026",
    venue: "Sentul International Circuit",
    image: "/media/motorsport-design-card.png",
    imageAlt: "GT race car under floodlights on a night circuit",
    status: "announced",
    category: "GT",
    seriesName: "Sarga Motorsport Series",
  },
  {
    title: "Moto Festival Weekend",
    slug: "moto-festival-weekend",
    href: "/events/moto-festival-weekend",
    dateLabel: "13 Dec 2026",
    venue: "Mandalika International Street Circuit",
    image: "/media/motorcycle-racing-dusk.png",
    imageAlt: "Motorcycle racers in a pack under sunny skies",
    status: "tickets-open",
    category: "Moto2",
    seriesName: "Sarga Motorcycle Series",
    ticketHref: "/tickets",
  },
];

const PLACEHOLDER_ARTICLES: MotorsportArticle[] = [
  {
    title: "The line between control and chaos",
    href: "/news/the-line-between-control-and-chaos",
    image: "/media/motorsport-design-hero.png",
    imageAlt: "Race car throwing sparks at high speed on a dusk circuit",
    category: "Race Report",
    publishedLabel: "02 Jul 2026",
    excerpt:
      "Inside the cockpit of Sarga's opening race weekend — a masterclass in pressure, precision, and the fine art of going fast.",
  },
  {
    title: "Riders rewrite the racing line",
    href: "/news/riders-rewrite-the-racing-line",
    image: "/media/motorcycle-racing-dusk.png",
    imageAlt: "Superbike race pack cornering under circuit lights at dusk",
    category: "Motorcycle Racing",
    publishedLabel: "28 Jun 2026",
    excerpt:
      "How Indonesia's fastest riders are reshaping the sport — one apex at a time.",
  },
  {
    title: "Building the 360° racing ecosystem",
    href: "/news/building-the-360-racing-ecosystem",
    image: "/media/motorsport-design-card.png",
    imageAlt:
      "Aerial view of a motorsport circuit surrounded by festival grounds",
    category: "Feature",
    publishedLabel: "15 Jun 2026",
    excerpt:
      "From track to grandstand to livestream — how Sarga is engineering an entire motorsport experience.",
  },
];

const PLACEHOLDER_GALLERY: GalleryItem[] = [
  {
    id: "g1",
    image: "/media/motorsport-design-hero.png",
    imageAlt: "Formula race car throwing sparks at speed on a dusk circuit",
    eyebrow: "Four wheels / Touring",
    caption: "The line comes alive",
  },
  {
    id: "g2",
    image: "/media/motorcycle-racing-dusk.png",
    imageAlt: "Superbike riders leaned into a sweeping circuit corner at dusk",
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
    imageAlt: "Close-up of a motorcycle racer in full leathers mid-corner",
    eyebrow: "Two wheels / Moto2",
    caption: "Apex precision",
  },
];

const PLACEHOLDER_PARTNERS: PartnerItem[] = [
  {
    name: "Sarga Motorsport",
    logo: "/brand/logo-sarga-motorsport-symbol-sport.png",
  },
  {
    name: "Sarga — parent group",
    logo: "/brand/logo-sarga-motorsport-part-of-sarga.png",
    href: "https://sarga.co",
  },
  {
    name: "Sarga Motorsport wordmark",
    logo: "/brand/logo-sarga-motorsport-symbol-sport.png",
  },
];

const PLACEHOLDER_TICKET_CTA = {
  provider: "Official ticketing partner",
  href: "/tickets",
  label: "Secure your seat",
  eventName: "Race Weekend Indonesia",
};

/* -------------------------------------------------------------------------- */
/*  Aggregate fetch                                                           */
/* -------------------------------------------------------------------------- */

export async function fetchHomepageData(): Promise<HomepageData> {
  const [eventsRes, articlesRes, partnersRes, galleriesRes, ticketRes] =
    await Promise.all([
      fetchStrapiList<CmsEvent>("events", {
        populate: ["coverImage", "heroMedia"],
        filters: {
          "filters[siteScope][$in][0]": "motorsport",
          "filters[siteScope][$in][1]": "shared",
        },
        sort: "eventDate:asc",
        limit: 8,
        revalidate: 60,
      }),
      fetchStrapiList<CmsArticle>("news-articles", {
        populate: "coverImage",
        filters: {
          "filters[siteScope][$in][0]": "motorsport",
          "filters[siteScope][$in][1]": "shared",
        },
        sort: "publishedAt:desc",
        limit: 6,
        revalidate: 60,
      }),
      fetchStrapiList<CmsPartner>("partners", {
        populate: "logo",
        filters: {
          "filters[siteScope][$in][0]": "motorsport",
          "filters[siteScope][$in][1]": "shared",
        },
        limit: 10,
        revalidate: 600,
      }),
      fetchStrapiList<CmsGallery>("media-galleries", {
        populate: "mediaItems",
        filters: {
          "filters[siteScope][$in][0]": "motorsport",
          "filters[siteScope][$in][1]": "shared",
        },
        limit: 4,
        revalidate: 600,
      }),
      fetchStrapiList<CmsTicketCta>("ticket-ctas", {
        filters: {
          "filters[siteScope][$in][0]": "motorsport",
          "filters[siteScope][$in][1]": "shared",
        },
        sort: "createdAt:desc",
        limit: 1,
        revalidate: 60,
      }),
    ]);

  /* ---- Events ---- */
  const cmsEvents = (eventsRes?.data ?? []).map(mapEvent);
  const featuredEvent =
    cmsEvents.find((e) => e.status === "tickets-open") ??
    cmsEvents[0] ??
    PLACEHOLDER_EVENT;
  const upcomingEvents =
    cmsEvents.length >= 2
      ? cmsEvents.filter((e) => e.href !== featuredEvent.href).slice(0, 4)
      : PLACEHOLDER_EVENTS;

  /* ---- Articles ---- */
  const cmsArticles = (articlesRes?.data ?? []).map(mapArticle);
  const [featuredArticle, ...restArticles] =
    cmsArticles.length > 0 ? cmsArticles : PLACEHOLDER_ARTICLES;

  /* ---- Partners ---- */
  const cmsPartners = (partnersRes?.data ?? []).map(mapPartner);
  const partners = cmsPartners.length > 0 ? cmsPartners : PLACEHOLDER_PARTNERS;

  /* ---- Gallery ---- */
  const cmsGallery: GalleryItem[] = (galleriesRes?.data ?? []).flatMap(
    (entry) =>
      (entry.mediaItems ?? []).map((img, i) => ({
        id: `cms-${entry.id}-${i}`,
        image: mediaUrl(img.url),
        imageAlt:
          img.alternativeText ??
          `${entry.title} — Sarga Motorsport`,
        eyebrow: entry.title,
      })),
  );
  const gallery =
    cmsGallery.length >= 3 ? cmsGallery.slice(0, 6) : PLACEHOLDER_GALLERY;

  /* ---- Ticket CTA ---- */
  const cmsTicket = ticketRes?.data?.[0];
  const ticketCta = cmsTicket
    ? {
        provider: cmsTicket.provider ?? "Official ticketing partner",
        href: cmsTicket.redirectUrl ?? "/tickets",
        label: cmsTicket.label ?? "Get tickets",
        eventName: featuredEvent.title,
      }
    : PLACEHOLDER_TICKET_CTA;

  return {
    featuredEvent,
    upcomingEvents,
    featuredArticle: featuredArticle ?? null,
    articles:
      restArticles.length > 0 ? restArticles : PLACEHOLDER_ARTICLES.slice(1),
    gallery,
    partners,
    ticketCta,
  };
}
