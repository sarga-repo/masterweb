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

export type HeroVideo = {
  mp4?: string;
  webm?: string;
  posterImage?: StrapiImage;
  mobilePosterImage?: StrapiImage;
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

export type LocalizationState = {
  requestedLocale: "en" | "id";
  resolvedLocale: "en" | "id";
  isFallback: boolean;
};

export type EcosystemPillarId =
  "sports" | "venue" | "media" | "technology" | "festival" | "other";

export type EcosystemStatus = "active" | "comingSoon" | "hidden";

export type PageAvailability = {
  pageEnabled: boolean;
  comingSoonEyebrow?: string;
  comingSoonTitle?: string;
  comingSoonDescription?: string;
  comingSoonMedia?: StrapiImage;
  launchTargetLabel?: string;
  showNotifyCta: boolean;
  noIndexWhileDisabled: boolean;
};

export type BusinessHighlight = {
  label?: string;
  title: string;
  description: string;
};

export type EcosystemBusiness = {
  localization?: LocalizationState;
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
  pageAvailability?: PageAvailability;
  order: number;
  cardImage?: StrapiImage;
  heroImage?: StrapiImage;
  brandLogo?: StrapiImage;
  brandLogoDark?: StrapiImage;
  relatedArticles?: NewsArticle[];
  relatedEvents?: EventItem[];
  dedicatedSiteKey?: "none" | "motorsport" | "horsesport";
  dedicatedSiteUrl?: string;
  seo?: Seo;
};

export type NewsCategory =
  "news" | "publication" | "press-release" | "report" | "magazine";

export type SiteScope = "gateway" | "motorsport" | "horsesport" | "shared";

export type NewsArticle = {
  localization?: LocalizationState;
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
  localization?: LocalizationState;
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

export type LeadershipGroup = "board" | "executive" | "advisor";

export type LeadershipPerson = {
  localization?: LocalizationState;
  name: string;
  role: string;
  group: LeadershipGroup;
  order: number;
  portrait?: StrapiImage;
  biography?: string;
};

export type TimelineItem = {
  localization?: LocalizationState;
  year: string;
  label: string;
  title: string;
  description: string;
  image?: StrapiImage;
  order: number;
};

export type CorporateReportType = "annual" | "sustainability";
export type CorporateReportStatus = "published" | "forthcoming" | "archived";

export type CorporateReport = {
  localization?: LocalizationState;
  title: string;
  slug: string;
  reportType: CorporateReportType;
  year: number;
  summary?: string;
  coverImage?: StrapiImage;
  file?: { url: string; name: string };
  externalUrl?: string;
  publicationStatus: CorporateReportStatus;
  publishedDate?: string;
  order: number;
  siteScope: "gateway" | "shared";
};

export type JobDiscipline =
  | "sport-operations"
  | "venue-experience"
  | "media-creative"
  | "technology-group";
export type JobEmploymentType =
  "full-time" | "part-time" | "contract" | "internship";
export type JobWorkMode = "onsite" | "hybrid" | "remote";
export type JobVacancyStatus = "open" | "closed" | "filled";

export type JobVacancy = {
  localization?: LocalizationState;
  title: string;
  slug: string;
  discipline: JobDiscipline;
  summary: string;
  description: string;
  responsibilities?: string;
  requirements?: string;
  location: string;
  employmentType: JobEmploymentType;
  workMode: JobWorkMode;
  seniority?: string;
  applicationUrl?: string;
  vacancyStatus: JobVacancyStatus;
  postedDate: string;
  closingDate?: string;
  featured: boolean;
  order: number;
  siteScope: "gateway" | "shared";
  seo?: Seo;
};

export type HomepageContent = {
  localization?: LocalizationState;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  heroImage?: StrapiImage;
  heroImageMobile?: StrapiImage;
  heroVideo?: HeroVideo;
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

export type PageSection = {
  sectionKey: string;
  eyebrow?: string;
  title: string;
  body?: string;
  media?: StrapiImage;
  ctaLabel?: string;
  ctaUrl?: string;
  ctaTarget?: "sameWindow" | "newWindow";
  theme?: "default" | "dark" | "light" | "accent";
};

export type SitePageKind =
  | "home"
  | "about"
  | "eventHub"
  | "newsHub"
  | "campaign"
  | "merchandise"
  | "history"
  | "reportIndex"
  | "legal"
  | "custom";

export type SitePage = {
  localization?: LocalizationState;
  title: string;
  slug: string;
  routePath: string;
  siteScope: SiteScope;
  pageKind: SitePageKind;
  navigationLabel?: string;
  heroTitle?: string;
  heroDescription?: string;
  heroMedia?: StrapiImage;
  pageAvailability?: PageAvailability;
  sections: PageSection[];
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
  mime?: string | null;
  ext?: string | null;
  alternativeText?: string | null;
  width?: number | null;
  height?: number | null;
} | null;

export type RawHeroVideo = {
  enabled?: boolean;
  primaryVideo?: RawStrapiMedia;
  alternateVideo?: RawStrapiMedia;
  posterImage?: RawStrapiMedia;
  mobilePosterImage?: RawStrapiMedia;
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

export type RawPageAvailability = {
  pageEnabled?: boolean;
  comingSoonEyebrow?: string;
  comingSoonTitle?: string;
  comingSoonDescription?: string;
  comingSoonMedia?: RawStrapiMedia;
  launchTargetLabel?: string;
  showNotifyCta?: boolean;
  noIndexWhileDisabled?: boolean;
} | null;

export type RawHomepage = {
  heroEyebrow?: string;
  heroTitle?: string;
  heroDescription?: string;
  heroImage?: RawStrapiMedia;
  heroImageMobile?: RawStrapiMedia;
  heroVideo?: RawHeroVideo;
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
  pageAvailability?: RawPageAvailability;
  order?: number;
  cardImage?: RawStrapiMedia;
  heroImage?: RawStrapiMedia;
  brandLogo?: RawStrapiMedia;
  brandLogoDark?: RawStrapiMedia;
  logo?: RawStrapiMedia;
  dedicatedSiteKey?: "none" | "motorsport" | "horsesport";
  dedicatedSiteUrl?: string;
  relatedArticles?: StrapiEntity<RawNewsArticle>[];
  relatedEvents?: StrapiEntity<RawEvent>[];
  seo?: RawSeo;
};

export type RawPageSection = {
  sectionKey?: string;
  eyebrow?: string;
  title?: string;
  body?: string;
  media?: RawStrapiMedia;
  ctaLabel?: string;
  ctaUrl?: string;
  ctaTarget?: "sameWindow" | "newWindow";
  theme?: "default" | "dark" | "light" | "accent";
};

export type RawSitePage = {
  title: string;
  slug: string;
  routePath: string;
  siteScope: SiteScope;
  pageKind: SitePageKind;
  navigationLabel?: string;
  heroTitle?: string;
  heroDescription?: string;
  heroMedia?: RawStrapiMedia;
  pageAvailability?: RawPageAvailability;
  sections?: RawPageSection[];
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
  summary?: string;
  order?: number;
  siteScope?: SiteScope;
};

export type RawCorporateReport = {
  title: string;
  slug: string;
  reportType: CorporateReportType;
  year: number;
  summary?: string;
  coverImage?: RawStrapiMedia;
  reportFile?: {
    url?: string;
    name?: string;
  } | null;
  externalUrl?: string;
  publicationStatus?: CorporateReportStatus;
  publishedDate?: string;
  order?: number;
  siteScope?: "gateway" | "shared" | "hidden";
};

export type RawJobVacancy = {
  title: string;
  slug: string;
  discipline: JobDiscipline;
  summary?: string;
  description?: string;
  responsibilities?: string;
  requirements?: string;
  location?: string;
  employmentType?: JobEmploymentType;
  workMode?: JobWorkMode;
  seniority?: string;
  applicationUrl?: string;
  vacancyStatus?: JobVacancyStatus;
  postedDate?: string;
  closingDate?: string;
  featured?: boolean;
  order?: number;
  siteScope?: "gateway" | "shared" | "hidden";
  seo?: RawSeo;
};
