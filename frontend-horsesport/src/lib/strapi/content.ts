/**
 * Typed, site-scoped content queries for the Sarga Horse Sport frontend.
 *
 * All queries apply the three-site filtering rules from
 * docs/multisite/04_three_site_integration_strategy.md:
 *
 *   siteScope IN ['horsesport', 'shared']
 *   AND (for business content) business.slug == 'sarga-horse-sport'
 *
 * Every function returns a graceful fallback ([] or null) when the shared CMS
 * is unreachable, so pages render in local dev without Strapi.
 */

import "server-only";

import { fetchStrapiList, type StrapiMedia } from "./client";

export const HORSESPORT_SITE_KEY = "horsesport" as const;
export const HORSESPORT_BUSINESS_SLUG = "sarga-horse-sport" as const;

/** Site scopes a Horse Sport page is allowed to render. */
export const HORSESPORT_SCOPES = ["horsesport", "shared"] as const;

/**
 * Strapi v5 filter fragment: siteScope IN ['horsesport','shared'].
 * Returned as flat query keys consumed by the client's `filters` option.
 */
function scopeFilters(): Record<string, string> {
  return HORSESPORT_SCOPES.reduce<Record<string, string>>((acc, scope, i) => {
    acc[`filters[siteScope][$in][${i}]`] = scope;
    return acc;
  }, {});
}

/**
 * Restrict to content whose primary business is Sarga Horse Sport.
 * Events use the single `business` relation; news uses the many-to-many
 * `relatedBusinesses` relation - hence the field argument.
 */
function businessFilter(
  relation: "business" | "relatedBusinesses" = "business",
): Record<string, string> {
  return {
    [`filters[${relation}][slug][$eq]`]: HORSESPORT_BUSINESS_SLUG,
  };
}

/* -------------------------------------------------------------------------- */
/*  Content types (frontend-facing shapes)                                    */
/* -------------------------------------------------------------------------- */

export type HorseSportEvent = {
  title: string;
  slug: string;
  description?: string;
  eventDate?: string;
  endDate?: string;
  venue?: string;
  venueAddress?: string;
  eventStatus?: string;
  eventDiscipline?: string;
  raceClass?: string;
  trackType?: string;
  hospitalityInfo?: string;
  stableAccessInfo?: string;
  ticketCtaLabel?: string;
  ticketUrl?: string;
  coverImage?: StrapiMedia;
  showOnHorseSport?: boolean;
  siteScope?: string;
};

export type HorseSportNewsArticle = {
  title: string;
  slug: string;
  excerpt?: string;
  body?: string;
  category?: string;
  publishedDate?: string;
  isHotTopic?: boolean;
  author?: string;
  coverImage?: StrapiMedia;
  featuredOnHorseSport?: boolean;
  siteScope?: string;
};

export type HorseSportTicketCta = {
  title: string;
  label: string;
  provider?: string;
  ctaType?: "redirect" | "deepLink" | "embed";
  url?: string;
  isActive?: boolean;
  siteScope?: string;
};

export type HorseSportGallery = {
  title: string;
  slug: string;
  description?: string;
  category?: string;
  coverImage?: StrapiMedia;
  mediaItems?: StrapiMedia[];
  siteScope?: string;
};

export type HorseSportBusiness = {
  name: string;
  slug: string;
  shortDescription?: string;
  overview?: string;
  dedicatedSiteKey?: string;
  dedicatedSiteUrl?: string;
  heroImage?: StrapiMedia;
  cardImage?: StrapiMedia;
  logo?: StrapiMedia;
};

/* -------------------------------------------------------------------------- */
/*  Queries                                                                   */
/* -------------------------------------------------------------------------- */

/** Upcoming/live Horse Sport events, soonest first. */
export async function fetchHorseSportEvents(
  limit = 12,
): Promise<HorseSportEvent[]> {
  const res = await fetchStrapiList<HorseSportEvent>("events", {
    filters: { ...scopeFilters(), ...businessFilter() },
    populate: ["coverImage"],
    sort: "eventDate:asc",
    limit,
    revalidate: 60,
  });
  return res?.data ?? [];
}

/** A single Horse Sport event by slug (scope-checked), or null. */
export async function fetchHorseSportEventBySlug(
  slug: string,
): Promise<HorseSportEvent | null> {
  const res = await fetchStrapiList<HorseSportEvent>("events", {
    filters: {
      ...scopeFilters(),
      ...businessFilter(),
      "filters[slug][$eq]": slug,
    },
    populate: ["coverImage", "heroMedia", "gallery", "schedule", "ticketCtas"],
    limit: 1,
    revalidate: 60,
  });
  return res?.data?.[0] ?? null;
}

/** Horse Sport news articles, newest first. */
export async function fetchHorseSportNews(
  limit = 12,
): Promise<HorseSportNewsArticle[]> {
  const res = await fetchStrapiList<HorseSportNewsArticle>("news-articles", {
    filters: { ...scopeFilters(), ...businessFilter("relatedBusinesses") },
    populate: ["coverImage"],
    sort: "publishedDate:desc",
    limit,
    revalidate: 60,
  });
  return res?.data ?? [];
}

/** A single Horse Sport news article by slug (scope-checked), or null. */
export async function fetchHorseSportNewsBySlug(
  slug: string,
): Promise<HorseSportNewsArticle | null> {
  const res = await fetchStrapiList<HorseSportNewsArticle>("news-articles", {
    filters: {
      ...scopeFilters(),
      ...businessFilter("relatedBusinesses"),
      "filters[slug][$eq]": slug,
    },
    populate: ["coverImage", "relatedGallery"],
    limit: 1,
    revalidate: 60,
  });
  return res?.data?.[0] ?? null;
}

/** Active ticket CTAs eligible for Horse Sport. */
export async function fetchHorseSportTicketCtas(): Promise<
  HorseSportTicketCta[]
> {
  const res = await fetchStrapiList<HorseSportTicketCta>("ticket-ctas", {
    filters: {
      ...scopeFilters(),
      "filters[isActive][$eq]": "true",
    },
    revalidate: 60,
  });
  return res?.data ?? [];
}

/** Horse Sport media galleries. */
export async function fetchHorseSportGalleries(): Promise<HorseSportGallery[]> {
  const res = await fetchStrapiList<HorseSportGallery>("media-galleries", {
    filters: scopeFilters(),
    populate: ["coverImage", "mediaItems"],
    revalidate: 60,
  });
  return res?.data ?? [];
}

/** The Sarga Horse Sport ecosystem business record, or null. */
export async function fetchHorseSportBusiness(): Promise<HorseSportBusiness | null> {
  const res = await fetchStrapiList<HorseSportBusiness>(
    "ecosystem-businesses",
    {
      filters: { "filters[slug][$eq]": HORSESPORT_BUSINESS_SLUG },
      populate: ["heroImage", "cardImage", "logo"],
      limit: 1,
      revalidate: 300,
    },
  );
  return res?.data?.[0] ?? null;
}
