/**
 * Page-level Horse Sport content layer - CMS-first with graceful fallback.
 *
 * Provides list + detail view-models for the core pages (events, news, tickets,
 * gallery). All queries are scoped to Horse Sport
 * (siteScope IN [horsesport, shared], business = sarga-horse-sport) and fall
 * back to on-brand placeholders when the shared CMS is unreachable.
 */

import "server-only";

import {
  fetchStrapiList,
  mediaUrl,
  type StrapiListResponse,
  type StrapiMedia,
} from "./strapi/client";
import { safeTicketEmbedUrl, safeTicketUrl } from "./ticketing/safe-url";
import type {
  ArticleCardData,
  EventCardData,
  GalleryItemData,
  PartnerItemData,
} from "@/types/design-system";

/* -------------------------------------------------------------------------- */
/*  Detail view-models                                                        */
/* -------------------------------------------------------------------------- */

export type EventScheduleRow = {
  label: string;
  day?: string;
  time?: string;
  description?: string;
};

/** How a ticket CTA opens: partner redirect, app deep link, or allowlisted embed. */
export type TicketCtaType = "redirect" | "deepLink" | "embed";

export type TicketAction = {
  label: string;
  href: string;
  provider?: string;
  external: boolean;
  ctaType: TicketCtaType;
  /** Allowlisted iframe src - only set when ctaType is "embed" and permitted. */
  embedHref?: string;
};

export type EventDetail = EventCardData & {
  /** Raw ISO dates for structured data (schema.org Event). */
  startDateIso?: string;
  endDateIso?: string;
  endDateLabel?: string;
  venueAddress?: string;
  raceClass?: string;
  trackType?: string;
  description?: string;
  hospitalityInfo?: string;
  stableAccessInfo?: string;
  schedule: EventScheduleRow[];
  ticket?: TicketAction;
};

export type ArticleDetail = ArticleCardData & {
  author?: string;
  body?: string;
  /** Raw ISO publish date for structured data (schema.org NewsArticle). */
  publishedIso?: string;
};

export type TicketCtaData = {
  id: string;
  title: string;
  label: string;
  provider?: string;
  href: string;
  external: boolean;
  ctaType: TicketCtaType;
  /** Allowlisted iframe src - only set when ctaType is "embed" and permitted. */
  embedHref?: string;
  isActive: boolean;
};

export type GalleryGroup = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  cover?: string;
  items: GalleryItemData[];
};

/* -------------------------------------------------------------------------- */
/*  CMS shapes                                                                */
/* -------------------------------------------------------------------------- */

type CmsEvent = {
  title: string;
  slug: string;
  eventDate?: string;
  endDate?: string;
  venue?: string;
  venueAddress?: string;
  eventStatus?: string;
  eventDiscipline?: string;
  raceClass?: string;
  trackType?: string;
  description?: string;
  hospitalityInfo?: string;
  stableAccessInfo?: string;
  coverImage?: StrapiMedia | null;
  heroMedia?: StrapiMedia | null;
  schedule?: Array<{
    label?: string;
    day?: string;
    startTime?: string;
    endTime?: string;
    description?: string;
  }>;
  ticketCtas?: Array<{
    label?: string;
    url?: string;
    embedUrl?: string;
    ctaType?: string;
    provider?: string;
  }>;
};

type CmsArticle = {
  title: string;
  slug: string;
  publishedDate?: string;
  excerpt?: string;
  body?: string;
  author?: string;
  category?: string;
  coverImage?: StrapiMedia | null;
};

type CmsTicketCta = {
  title: string;
  label: string;
  provider?: string;
  url?: string;
  embedUrl?: string;
  ctaType?: string;
  isActive?: boolean;
};

type CmsGallery = {
  title: string;
  description?: string;
  category?: string;
  coverImage?: StrapiMedia | null;
  mediaItems?: StrapiMedia[];
};

type CmsPartner = {
  name: string;
  websiteUrl?: string;
  logo?: StrapiMedia | null;
};

/* -------------------------------------------------------------------------- */
/*  Formatting                                                                */
/* -------------------------------------------------------------------------- */

function formatDate(iso?: string): string | undefined {
  if (!iso) return undefined;
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return undefined;
  }
}

function formatTime(iso?: string): string | undefined {
  if (!iso) return undefined;
  try {
    return new Date(iso).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return undefined;
  }
}

const STATUS_LABELS: Record<string, string> = {
  upcoming: "Upcoming",
  live: "Live now",
  ticketsOpen: "Tickets open",
  announced: "Announced",
  soldOut: "Sold out",
  completed: "Completed",
  past: "Past",
  cancelled: "Cancelled",
};

function statusLabel(raw?: string): string | undefined {
  return raw ? (STATUS_LABELS[raw] ?? raw) : undefined;
}

function titleCase(raw?: string): string | undefined {
  if (!raw) return undefined;
  const clean = raw.replace(/-/g, " ");
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

function normalizeCtaType(raw?: string): TicketCtaType {
  const v = raw?.toLowerCase();
  if (v === "embed") return "embed";
  if (v === "deeplink" || v === "deep_link" || v === "deep-link") {
    return "deepLink";
  }
  return "redirect";
}

/**
 * Build a safe ticket action from raw CMS values. The destination is validated
 * per mode (redirect/deepLink) and an embed src is only produced when the host
 * is allowlisted; otherwise it degrades to a redirect. Returns `undefined` when
 * no usable/safe destination exists.
 */
function resolveTicketAction(input: {
  label?: string;
  url?: string;
  embedUrl?: string;
  ctaType?: string;
  provider?: string;
}): TicketAction | undefined {
  const ctaType = normalizeCtaType(input.ctaType);
  const embedHref =
    ctaType === "embed" ? safeTicketEmbedUrl(input.embedUrl) : undefined;
  const href = safeTicketUrl(input.url, ctaType);

  // Nothing safe to link or embed → drop the CTA entirely.
  if (!href && !embedHref) return undefined;

  const destination = href ?? "#";
  return {
    label: input.label ?? "Get tickets",
    href: destination,
    provider: input.provider ?? undefined,
    external: destination.startsWith("http"),
    // If the embed host wasn't allowlisted, fall back to a plain redirect.
    ctaType: embedHref ? "embed" : ctaType === "embed" ? "redirect" : ctaType,
    embedHref,
  };
}

/* -------------------------------------------------------------------------- */
/*  Mappers                                                                   */
/* -------------------------------------------------------------------------- */

function mapEventCard(
  entry: StrapiListResponse<CmsEvent>["data"][number],
): EventCardData {
  const img = entry.coverImage ?? entry.heroMedia ?? null;
  return {
    title: entry.title ?? "Untitled event",
    href: `/events/${entry.slug ?? entry.documentId}`,
    dateLabel: formatDate(entry.eventDate),
    venue: entry.venue ?? undefined,
    discipline: titleCase(entry.eventDiscipline),
    status: statusLabel(entry.eventStatus),
    image: mediaUrl(img?.url) || undefined,
    imageAlt: img?.alternativeText ?? `${entry.title} - Sarga Horse Sport`,
  };
}

function mapEventDetail(
  entry: StrapiListResponse<CmsEvent>["data"][number],
): EventDetail {
  const cta = entry.ticketCtas?.[0];
  return {
    ...mapEventCard(entry),
    startDateIso: entry.eventDate ?? undefined,
    endDateIso: entry.endDate ?? undefined,
    endDateLabel: formatDate(entry.endDate),
    venueAddress: entry.venueAddress ?? undefined,
    raceClass: entry.raceClass ?? undefined,
    trackType: titleCase(entry.trackType),
    description: entry.description ?? undefined,
    hospitalityInfo: entry.hospitalityInfo ?? undefined,
    stableAccessInfo: entry.stableAccessInfo ?? undefined,
    schedule: (entry.schedule ?? []).map((row) => ({
      label: row.label ?? "Session",
      day: row.day ?? undefined,
      time:
        [formatTime(row.startTime), formatTime(row.endTime)]
          .filter(Boolean)
          .join(" – ") || undefined,
      description: row.description ?? undefined,
    })),
    ticket: cta ? resolveTicketAction(cta) : undefined,
  };
}

function mapArticleCard(
  entry: StrapiListResponse<CmsArticle>["data"][number],
): ArticleCardData {
  const img = entry.coverImage ?? null;
  return {
    title: entry.title ?? "Untitled article",
    href: `/news/${entry.slug ?? entry.documentId}`,
    category: titleCase(entry.category),
    dateLabel: formatDate(entry.publishedDate),
    excerpt: entry.excerpt ?? undefined,
    image: mediaUrl(img?.url) || undefined,
    imageAlt: img?.alternativeText ?? `${entry.title} - Sarga Horse Sport`,
  };
}

/* -------------------------------------------------------------------------- */
/*  Placeholders                                                              */
/* -------------------------------------------------------------------------- */

const PH_EVENTS: EventCardData[] = [
  {
    title: "Sarga National Derby - Merdeka Cup",
    href: "/events/sarga-national-derby-merdeka-cup",
    dateLabel: "17 Aug 2026",
    venue: "Sarga Turf Park",
    discipline: "Derby",
    status: "Tickets open",
    image: "/media/Home-straight-finish.png",
    imageAlt: "Two jockeys racing side by side past a blurred grandstand",
  },
  {
    title: "Turf Classic Twilight Meeting",
    href: "/events/turf-classic-twilight-meeting",
    dateLabel: "12 Sep 2026",
    venue: "Sarga Turf Park",
    discipline: "Turf",
    status: "Announced",
    image: "/media/Racecourse-aerial.png",
    imageAlt: "Aerial view of a curved turf racing track",
  },
  {
    title: "Champions Exhibition Gala",
    href: "/events/champions-exhibition-gala",
    dateLabel: "04 Oct 2026",
    venue: "Grand Paddock Arena",
    discipline: "Exhibition",
    status: "Hospitality",
    image: "/media/sarga-horse-race-event.png",
    imageAlt: "Thoroughbreds bursting from the starting gate on race day",
  },
];

const PH_ARTICLES: ArticleCardData[] = [
  {
    title: "Merdeka Cup Returns to a Sold-Out Grandstand",
    href: "/news/merdeka-cup-returns-sold-out-grandstand",
    category: "Event announcement",
    dateLabel: "20 Jul 2026",
    excerpt:
      "The Sarga National Derby headlines a record race-day program with elite jockeys and championship turf classifications.",
    image: "/media/news-merdeka.png",
    imageAlt: "Grandstand crowd watching a derby on race day",
  },
  {
    title: "Inside the Stable: Conditioning an Elite Derby Contender",
    href: "/news/inside-the-stable-conditioning-derby-contender",
    category: "Stable life",
    dateLabel: "05 Jul 2026",
    excerpt:
      "A behind-the-scenes look at nutrition, veterinary care, and the daily routines that shape a champion.",
    image: "/media/Champion-horse-studio-portrait.png",
    imageAlt: "Elite race horse inside a premium stable interior",
  },
  {
    title: "Turf Track Development Reaches Championship Grade",
    href: "/news/turf-track-development-championship-grade",
    category: "Turf venue",
    dateLabel: "22 Jun 2026",
    excerpt:
      "New drainage and turf management bring the Sarga Turf Park to international championship standards.",
    image: "/media/news-turf-track.png",
    imageAlt: "Aerial view of a championship turf track",
  },
];

const PH_TICKETS: TicketCtaData[] = [
  {
    id: "ph-1",
    title: "Sarga National Derby - Merdeka Cup Tickets",
    label: "Get tickets",
    provider: "Partner Ticketing",
    href: "https://example.com/tickets/sarga-national-derby",
    external: true,
    ctaType: "redirect",
    isActive: true,
  },
];

const PH_PARTNERS: PartnerItemData[] = [
  { name: "Meridian Stables" },
  { name: "Turfline Grounds" },
  { name: "Derby Day Hospitality" },
  { name: "Golden Rein Group" },
];

const PH_GALLERY_ITEMS: GalleryItemData[] = [
  {
    id: "g1",
    image: "/media/news-merdeka.png",
    imageAlt: "Race-day grandstand crowd",
    category: "Race day",
  },
  {
    id: "g2",
    image: "/media/news-turf-track.png",
    imageAlt: "Championship turf track",
    category: "Venue",
  },
  {
    id: "g3",
    image: "/media/Champion-horse-studio-portrait.png",
    imageAlt: "Premium stable interior",
    category: "Stable life",
  },
  {
    id: "g4",
    image: "/media/Home-straight-finish.png",
    imageAlt: "Jockeys racing side by side",
    category: "Race day",
  },
  {
    id: "g5",
    image: "/media/Racecourse-aerial.png",
    imageAlt: "Aerial view of the turf track",
    category: "Venue",
  },
  {
    id: "g6",
    image: "/media/sarga-horse-race-event.png",
    imageAlt: "Race day at the starting gate",
    category: "Race day",
  },
];

/* -------------------------------------------------------------------------- */
/*  Scope filters                                                             */
/* -------------------------------------------------------------------------- */

const HS_SCOPE = {
  "filters[siteScope][$in][0]": "horsesport",
  "filters[siteScope][$in][1]": "shared",
};
const EVENT_BIZ = { "filters[business][slug][$eq]": "sarga-horse-sport" };
const NEWS_BIZ = {
  "filters[relatedBusinesses][slug][$eq]": "sarga-horse-sport",
};

/* -------------------------------------------------------------------------- */
/*  Fetchers                                                                  */
/* -------------------------------------------------------------------------- */

export async function fetchEventsPage(): Promise<EventCardData[]> {
  const res = await fetchStrapiList<CmsEvent>("events", {
    populate: ["coverImage", "heroMedia"],
    filters: { ...HS_SCOPE, ...EVENT_BIZ },
    sort: "eventDate:asc",
    limit: 24,
    revalidate: 60,
  });
  const events = (res?.data ?? []).map(mapEventCard);
  return events.length > 0 ? events : PH_EVENTS;
}

export async function fetchEventDetail(
  slug: string,
): Promise<EventDetail | null> {
  const res = await fetchStrapiList<CmsEvent>("events", {
    populate: ["coverImage", "heroMedia", "schedule", "ticketCtas"],
    filters: { ...HS_SCOPE, ...EVENT_BIZ, "filters[slug][$eq]": slug },
    limit: 1,
    revalidate: 60,
  });
  const entry = res?.data?.[0];
  return entry ? mapEventDetail(entry) : null;
}

export async function fetchNewsPage(): Promise<ArticleCardData[]> {
  const res = await fetchStrapiList<CmsArticle>("news-articles", {
    populate: "coverImage",
    filters: { ...HS_SCOPE, ...NEWS_BIZ },
    sort: "publishedDate:desc",
    limit: 24,
    revalidate: 60,
  });
  const articles = (res?.data ?? []).map(mapArticleCard);
  return articles.length > 0 ? articles : PH_ARTICLES;
}

export async function fetchArticleDetail(
  slug: string,
): Promise<ArticleDetail | null> {
  const res = await fetchStrapiList<CmsArticle>("news-articles", {
    populate: "coverImage",
    filters: { ...HS_SCOPE, ...NEWS_BIZ, "filters[slug][$eq]": slug },
    limit: 1,
    revalidate: 60,
  });
  const entry = res?.data?.[0];
  if (!entry) return null;
  return {
    ...mapArticleCard(entry),
    author: entry.author ?? undefined,
    body: entry.body ?? undefined,
    publishedIso: entry.publishedDate ?? undefined,
  };
}

export async function fetchTicketsPage(): Promise<TicketCtaData[]> {
  const res = await fetchStrapiList<CmsTicketCta>("ticket-ctas", {
    filters: { ...HS_SCOPE, "filters[isActive][$eq]": "true" },
    sort: "createdAt:desc",
    limit: 24,
    revalidate: 60,
  });
  const ctas = (res?.data ?? []).flatMap((entry, i) => {
    const action = resolveTicketAction(entry);
    if (!action) return [];
    const cta: TicketCtaData = {
      id: entry.documentId ?? `cta-${i}`,
      title: entry.title ?? "Tickets",
      label: action.label,
      provider: action.provider,
      href: action.href,
      external: action.external,
      ctaType: action.ctaType,
      embedHref: action.embedHref,
      isActive: entry.isActive ?? true,
    };
    return [cta];
  });
  return ctas.length > 0 ? ctas : PH_TICKETS;
}

export async function fetchPartners(): Promise<PartnerItemData[]> {
  const res = await fetchStrapiList<CmsPartner>("partners", {
    populate: "logo",
    filters: HS_SCOPE,
    sort: "sortOrder:asc",
    limit: 20,
    revalidate: 600,
  });
  const partners = (res?.data ?? []).map((entry) => ({
    name: entry.name ?? "Partner",
    logo: mediaUrl(entry.logo?.url) || undefined,
    href: entry.websiteUrl ?? undefined,
  }));
  return partners.length > 0 ? partners : PH_PARTNERS;
}

export async function fetchGalleryPage(): Promise<GalleryGroup[]> {
  const res = await fetchStrapiList<CmsGallery>("media-galleries", {
    populate: ["mediaItems", "coverImage"],
    filters: HS_SCOPE,
    limit: 12,
    revalidate: 300,
  });
  const groups = (res?.data ?? [])
    .map((entry) => ({
      id: entry.documentId ?? entry.title,
      title: entry.title ?? "Gallery",
      description: entry.description ?? undefined,
      category: titleCase(entry.category),
      cover: mediaUrl(entry.coverImage?.url) || undefined,
      items: (entry.mediaItems ?? []).map((img, i) => ({
        id: `${entry.documentId ?? entry.title}-${i}`,
        image: mediaUrl(img.url),
        imageAlt: img.alternativeText ?? `${entry.title} - Sarga Horse Sport`,
        category: titleCase(entry.category),
      })),
    }))
    .filter((g) => g.items.length > 0);

  if (groups.length > 0) return groups;
  return [
    {
      id: "ph-gallery",
      title: "Race Day Gallery",
      description:
        "Race-day, turf, and stable photography from Sarga Horse Sport events.",
      category: "Race day",
      items: PH_GALLERY_ITEMS,
    },
  ];
}
