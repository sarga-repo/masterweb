/**
 * Shared CMS data layer - reusable fetch + mapping for every route.
 *
 * Generalises the mapping logic from `homepage-data.ts` so that events,
 * articles, partners, galleries, and ticket CTAs can be fetched by any page
 * with consistent shapes and graceful placeholder fallbacks.
 */

import type {
  GalleryItem,
  MotorsportArticle,
  MotorsportEvent,
  MotorsportStatus,
  PartnerItem,
} from "@/types/design-system";

import {
  fetchStrapiList,
  mediaUrl,
  type StrapiListResponse,
  type StrapiMedia,
} from "./strapi/client";

/* -------------------------------------------------------------------------- */
/*  Strapi CMS shapes                                                         */
/* -------------------------------------------------------------------------- */

export type CmsEvent = {
  title: string;
  slug: string;
  date: string;
  endDate?: string;
  venue: string;
  venueAddress?: string;
  description?: string;
  eventStatus: string;
  racingCategory?: string;
  seriesName?: string;
  circuitName?: string;
  siteScope?: string;
  coverImage?: StrapiMedia | null;
  heroMedia?: StrapiMedia | null;
  gallery?: StrapiMedia[];
  ticketCtas?: Array<CmsTicketCta & { id: number; documentId: string }>;
};

export type CmsTicketCta = {
  label: string;
  provider: string;
  redirectUrl: string;
  /** Optional iframe / embed URL - only used when explicitly configured in CMS. */
  embedCode?: string;
};

export type CmsArticle = {
  title: string;
  slug: string;
  publishedAt: string;
  excerpt?: string;
  body?: string;
  category?: string;
  siteScope?: string;
  coverImage?: StrapiMedia | null;
};

export type CmsPartner = {
  name: string;
  website?: string;
  description?: string;
  logo?: StrapiMedia | null;
};

export type CmsGallery = {
  title: string;
  siteScope?: string;
  mediaItems?: StrapiMedia[];
};

/* -------------------------------------------------------------------------- */
/*  Mapping helpers                                                           */
/* -------------------------------------------------------------------------- */

function statusMap(raw?: string): MotorsportStatus {
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

export function mapEvent(
  entry: StrapiListResponse<CmsEvent>["data"][number],
): MotorsportEvent {
  const img = entry.coverImage ?? entry.heroMedia ?? null;
  const ticketRedirect = entry.ticketCtas?.[0]?.redirectUrl;
  return {
    title: entry.title ?? "Untitled event",
    slug: entry.slug,
    href: `/events/${entry.slug ?? entry.documentId}`,
    dateLabel: formatDate(entry.date),
    venue: entry.venue ?? "TBA",
    image:
      mediaUrl(img?.url) || "/media/motorsport-design-hero.png",
    imageAlt:
      img?.alternativeText ??
      `${entry.title} - Sarga Motorsport event`,
    status: statusMap(entry.eventStatus),
    category: entry.racingCategory ?? undefined,
    seriesName: entry.seriesName ?? undefined,
    ticketHref: ticketRedirect ?? undefined,
  };
}

export function mapArticle(
  entry: StrapiListResponse<CmsArticle>["data"][number],
): MotorsportArticle {
  const img = entry.coverImage ?? null;
  return {
    title: entry.title ?? "Untitled article",
    href: `/news/${entry.slug ?? entry.documentId}`,
    image:
      mediaUrl(img?.url) || "/media/motorcycle-racing-dusk.png",
    imageAlt:
      img?.alternativeText ??
      `${entry.title} - Sarga Motorsport news`,
    category: entry.category ?? "Motorsport",
    publishedLabel: formatDate(entry.publishedAt),
    excerpt: entry.excerpt ?? undefined,
  };
}

export function mapPartner(
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

export function mapGalleryItems(
  galleries: StrapiListResponse<CmsGallery>,
): GalleryItem[] {
  return galleries.data.flatMap((entry) =>
    (entry.mediaItems ?? []).map((img, i) => ({
      id: `cms-${entry.id}-${i}`,
      image: mediaUrl(img.url),
      imageAlt:
        img.alternativeText ??
        `${entry.title} - Sarga Motorsport`,
      eyebrow: entry.title,
    })),
  );
}

/* -------------------------------------------------------------------------- */
/*  Site-scope filters (motorsport + shared)                                  */
/* -------------------------------------------------------------------------- */

const SITE_SCOPE_FILTERS: Record<string, string> = {
  "filters[siteScope][$in][0]": "motorsport",
  "filters[siteScope][$in][1]": "shared",
};

/* -------------------------------------------------------------------------- */
/*  Public fetchers                                                           */
/* -------------------------------------------------------------------------- */

/** Fetch all motorsport/shared events, sorted by date ascending. */
export async function fetchEvents(
  limit = 50,
): Promise<MotorsportEvent[]> {
  const res = await fetchStrapiList<CmsEvent>("events", {
    populate: ["coverImage", "heroMedia"],
    filters: SITE_SCOPE_FILTERS,
    sort: "eventDate:asc",
    limit,
    revalidate: 60,
  });
  return (res?.data ?? []).map(mapEvent);
}

/** Fetch a single event by slug. Returns `null` when not found. */
export async function fetchEventBySlug(
  slug: string,
): Promise<(MotorsportEvent & { description?: string }) | null> {
  const res = await fetchStrapiList<CmsEvent>("events", {
    populate: ["coverImage", "heroMedia", "gallery"],
    filters: { ...SITE_SCOPE_FILTERS, "filters[slug][$eq]": slug },
    limit: 1,
    revalidate: 60,
  });
  const entry = res?.data?.[0];
  if (!entry) return null;
  const mapped = mapEvent(entry);
  return { ...mapped, description: entry.description ?? undefined };
}

/** Fetch all motorsport/shared news articles, newest first. */
export async function fetchArticles(
  limit = 50,
): Promise<MotorsportArticle[]> {
  const res = await fetchStrapiList<CmsArticle>("news-articles", {
    populate: "coverImage",
    filters: SITE_SCOPE_FILTERS,
    sort: "publishedAt:desc",
    limit,
    revalidate: 60,
  });
  return (res?.data ?? []).map(mapArticle);
}

/** Fetch a single article by slug. Returns `null` when not found. */
export async function fetchArticleBySlug(
  slug: string,
): Promise<(MotorsportArticle & { body?: string }) | null> {
  const res = await fetchStrapiList<CmsArticle>("news-articles", {
    populate: "coverImage",
    filters: { ...SITE_SCOPE_FILTERS, "filters[slug][$eq]": slug },
    limit: 1,
    revalidate: 60,
  });
  const entry = res?.data?.[0];
  if (!entry) return null;
  const mapped = mapArticle(entry);
  return { ...mapped, body: entry.body ?? undefined };
}

/** Fetch all motorsport/shared partners. */
export async function fetchPartners(
  limit = 20,
): Promise<PartnerItem[]> {
  const res = await fetchStrapiList<CmsPartner>("partners", {
    populate: "logo",
    filters: SITE_SCOPE_FILTERS,
    limit,
    revalidate: 600,
  });
  return (res?.data ?? []).map(mapPartner);
}

/** Fetch all motorsport/shared gallery images. */
export async function fetchGalleryItems(
  limit = 10,
): Promise<GalleryItem[]> {
  const res = await fetchStrapiList<CmsGallery>("media-galleries", {
    populate: "mediaItems",
    filters: SITE_SCOPE_FILTERS,
    limit,
    revalidate: 600,
  });
  if (!res) return [];
  return mapGalleryItems(res);
}

/** Fetch all motorsport/shared ticket CTAs. */
export async function fetchTicketCtas(): Promise<
  Array<{
    label: string;
    provider: string;
    href: string;
    eventName?: string;
    embedCode?: string;
  }>
> {
  const res = await fetchStrapiList<CmsTicketCta>("ticket-ctas", {
    filters: SITE_SCOPE_FILTERS,
    sort: "createdAt:desc",
    limit: 20,
    revalidate: 60,
  });
  return (res?.data ?? []).map((entry) => ({
    label: entry.label ?? "Get tickets",
    provider: entry.provider ?? "Official partner",
    href: entry.redirectUrl ?? "/tickets",
    embedCode: entry.embedCode ?? undefined,
  }));
}
