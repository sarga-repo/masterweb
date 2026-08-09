/**
 * Types for the Strapi integration layer.
 *
 * Two groups live here:
 *  - "View models" consumed by React components (stable, UI-friendly shapes).
 *  - "Raw" Strapi v5 response shapes used only inside the mappers.
 *
 * Field names track docs/05_content_model_strapi.md and strapi/content-types.json.
 */

/* ----------------------------- View models ----------------------------- */

export type StrapiImage = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
};

export type Seo = {
  metaTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
};

export type EcosystemPillarId =
  "sports" | "venue" | "media" | "technology" | "festival" | "other";

export type EcosystemStatus = "active" | "comingSoon" | "hidden";

export type BusinessHighlight = {
  label?: string;
  title: string;
  description: string;
};

export type EcosystemBusiness = {
  name: string;
  slug: string;
  pillar: EcosystemPillarId;
  shortDescription: string;
  overview?: string;
  highlights?: BusinessHighlight[];
  gallery?: StrapiImage[];
  ctaLabel: string;
  ctaUrl?: string;
  status: EcosystemStatus;
  launchTarget?: string;
  order: number;
  cardImage?: StrapiImage;
  heroImage?: StrapiImage;
  brandLogo?: StrapiImage;
  brandLogoDark?: StrapiImage;
  relatedArticles?: NewsArticle[];
  relatedEvents?: EventItem[];
  seo?: Seo;
};

export type NewsCategory =
  "news" | "publication" | "press-release" | "report" | "magazine";

export type SiteScope = "gateway" | "motorsport" | "horsesport" | "shared";

export type NewsArticle = {
  title: string;
  slug: string;
  excerpt: string;
  body?: string;
  category: NewsCategory;
  publishedDate: string; // ISO date
  isHotTopic: boolean;
  author?: string;
  coverImage?: StrapiImage;
  siteScope?: SiteScope;
  seo?: Seo;
};

export type TicketIntegrationType = "redirect" | "deepLink" | "embed";
export type EventStatus = "upcoming" | "live" | "past" | "hidden";

export type EventItem = {
  title: string;
  slug: string;
  description: string;
  eventDate?: string;
  endDate?: string;
  venue?: string;
  coverImage?: StrapiImage;
  ticketCtaLabel?: string;
  ticketUrl?: string;
  embedUrl?: string;
  ticketIntegrationType?: TicketIntegrationType;
  status?: EventStatus;
  siteScope?: SiteScope;
  seo?: Seo;
};

export type AboutHighlight = {
  label: string;
  title: string;
  description: string;
  href: string;
};

export type LeadershipGroup = "board" | "executive";

export type LeadershipPerson = {
  name: string;
  role: string;
  group: LeadershipGroup;
  order: number;
  portrait?: StrapiImage;
  biography?: string;
};

export type TimelineItem = {
  year: string;
  label: string;
  title: string;
  description: string;
  image?: StrapiImage;
  order: number;
};

export type HomepageContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  heroImage?: StrapiImage;
  heroImageMobile?: StrapiImage;
  primaryCtaLabel: string;
  primaryCtaUrl: string;
  secondaryCtaLabel: string;
  secondaryCtaUrl: string;
  aboutEyebrow: string;
  aboutSummaryTitle: string;
  aboutSummaryBody: string;
  aboutHighlights: AboutHighlight[];
  seo?: Seo;
};

/* ------------------------- Raw Strapi v5 shapes ------------------------ */

/** A Strapi v5 entity: attribute fields are flattened alongside id/documentId. */
export type StrapiEntity<T> = T & {
  id: number;
  documentId: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
};

export type StrapiCollectionResponse<T> = {
  data: StrapiEntity<T>[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type StrapiSingleResponse<T> = {
  data: StrapiEntity<T> | null;
  meta?: Record<string, unknown>;
};

/** Populated media in v5 is returned as a flattened object (or null). */
export type RawStrapiMedia = {
  url: string;
  alternativeText?: string | null;
  width?: number | null;
  height?: number | null;
} | null;

export type RawStrapiMediaItem = Exclude<RawStrapiMedia, null>;

export type RawSeo = {
  metaTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: RawStrapiMedia;
  canonicalUrl?: string;
  noIndex?: boolean;
} | null;

export type RawHomepage = {
  heroEyebrow?: string;
  heroTitle?: string;
  heroDescription?: string;
  heroImage?: RawStrapiMedia;
  heroImageMobile?: RawStrapiMedia;
  primaryCtaLabel?: string;
  primaryCtaUrl?: string;
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
  aboutSummaryTitle?: string;
  aboutSummaryBody?: string;
  seo?: RawSeo;
};

export type RawEcosystemBusiness = {
  name: string;
  slug: string;
  pillar: EcosystemPillarId;
  shortDescription: string;
  overview?: string;
  highlights?: BusinessHighlight[];
  gallery?: RawStrapiMediaItem[];
  ctaLabel?: string;
  ctaUrl?: string;
  /** Named businessStatus in Strapi: `status` is a reserved attribute in v5. */
  businessStatus?: EcosystemStatus;
  launchTarget?: string;
  order?: number;
  cardImage?: RawStrapiMedia;
  heroImage?: RawStrapiMedia;
  brandLogo?: RawStrapiMedia;
  brandLogoDark?: RawStrapiMedia;
  relatedArticles?: StrapiEntity<RawNewsArticle>[];
  relatedEvents?: StrapiEntity<RawEvent>[];
  seo?: RawSeo;
};

export type RawNewsArticle = {
  title: string;
  slug: string;
  excerpt?: string;
  body?: string;
  coverImage?: RawStrapiMedia;
  category?: NewsCategory;
  publishedDate?: string;
  isHotTopic?: boolean;
  author?: string;
  siteScope?: SiteScope;
  seo?: RawSeo;
};

export type RawEvent = {
  title: string;
  slug: string;
  description?: string;
  eventDate?: string;
  endDate?: string;
  venue?: string;
  coverImage?: RawStrapiMedia;
  ticketCtaLabel?: string;
  ticketUrl?: string;
  embedUrl?: string;
  ticketIntegrationType?: TicketIntegrationType;
  /** Named eventStatus in Strapi: `status` is a reserved attribute in v5. */
  eventStatus?: EventStatus;
  siteScope?: SiteScope;
  seo?: RawSeo;
};

export type RawTimelineItem = {
  year?: string;
  label?: string;
  title?: string;
  description?: string;
  image?: RawStrapiMedia;
  order?: number;
};

export type RawLeadershipPerson = {
  name?: string;
  role?: string;
  group?: LeadershipGroup;
  portrait?: RawStrapiMedia;
  biography?: string;
  order?: number;
};
