/** Shared, site-scoped CMS data adapters for Motorsport public routes. */

import type {
  EcosystemSite,
  GalleryItem,
  MerchandiseItem,
  MotorsportArticle,
  MotorsportCampaignDetail,
  MotorsportEvent,
  MotorsportProgram,
  MotorsportProgramDetail,
  MotorsportPresentationSection,
  MotorsportRegulation,
  MotorsportRider,
  MotorsportStatus,
  MotorsportTicketCard,
  PartnerItem,
  ScheduleEntry,
  StandingEntry,
  TeamMember,
} from "@/types/design-system";
import type { Locale } from "@/lib/i18n/config";
import { resolveSiteUrl, siteConfig } from "./site-config";

import {
  fetchStrapiList,
  fetchStrapiSingle,
  fetchStrapiSingleResult,
  isStrapiPreviewEnabled,
  mediaUrl,
  type StrapiListResponse,
  type StrapiMedia,
} from "./strapi/client";
import { previewCollectionForUid } from "./preview/preview-context";
import { getMotorsportPreviewContext } from "./preview/preview-request-context";
import {
  mapMotorsportInformationBand,
  mapMotorsportPageHero,
} from "./motorsport-page-foundation";
import { mapMotorsportSinglePageSections } from "./cms-page-order";
import type {
  CmsPageHero,
  CmsPageInformationBand,
} from "./motorsport-page-foundation";
import { safeTicketEmbedUrl, safeTicketUrl } from "./ticketing/safe-url";
import {
  DEFAULT_MOTORSPORT_THEME,
  resolveMotorsportTheme,
  type MotorsportThemePreset,
} from "./motorsport-theme";

export type CmsMotorsportThemeSettings = {
  themePreset?: MotorsportThemePreset | string | null;
};

/** Published CMS preset for live routes, or the draft preset in Preview. */
export async function fetchMotorsportTheme(
  locale?: Locale,
): Promise<MotorsportThemePreset> {
  const result = await fetchStrapiSingleResult<CmsMotorsportThemeSettings>(
    "motorsport-theme-settings",
    { locale, revalidate: 60 },
  );
  // Theme settings are global presentation configuration, not the page being
  // previewed. If an old/invalid Draft Mode context or a CMS permission issue
  // prevents the settings read, keep the page renderable and use the stable
  // current preset. A valid live read still wins immediately above.
  const response = result.state === "success" ? result.response : null;
  return resolveMotorsportTheme(
    response?.data?.themePreset ?? DEFAULT_MOTORSPORT_THEME,
  );
}

export type CmsDetailPresentation = {
  hero?: CmsPageHero | null;
  informationBand?: CmsPageInformationBand | null;
  routeKey?: string;
};

export type CmsEvent = {
  title: string;
  slug: string;
  eventDate?: string;
  endDate?: string;
  venue?: string;
  venueAddress?: string;
  description?: string;
  eventStatus: string;
  showOnMotorsport?: boolean;
  racingCategory?: string;
  seriesName?: string;
  circuitName?: string;
  coverImage?: StrapiMedia | null;
  heroMedia?: StrapiMedia | null;
  gallery?: StrapiMedia[];
  ticketCtas?: Array<CmsTicketCta & { id: number; documentId: string }>;
  sponsors?: Array<CmsPartner & { id: number; documentId: string }>;
  seo?: CmsSeo | null;
  motorsportPresentation?: CmsDetailPresentation | null;
};

export type CmsTicketCta = {
  title?: string;
  label: string;
  provider?: string;
  eyebrow?: string;
  description?: string;
  eventLabel?: string;
  eventText?: string;
  providerLabel?: string;
  providerText?: string;
  partnerLabel?: string;
  footerText?: string;
  ctaLabel?: string;
  ctaType?: "redirect" | "deepLink" | "embed";
  url?: string;
  image?: StrapiMedia | null;
  backgroundImage?: StrapiMedia | null;
  backgroundImageMobile?: StrapiMedia | null;
  embedConfigJson?: { url?: string; src?: string } | null;
  isActive?: boolean;
  relatedEvent?: {
    title?: string;
    eventStatus?: string;
    showOnMotorsport?: boolean;
  } | null;
  relatedProgram?: {
    title?: string;
    slug?: string;
    programStatus?: string;
  } | null;
};

export type CmsArticle = {
  title: string;
  slug: string;
  publishedDate?: string;
  publishedAt?: string;
  excerpt?: string;
  body?: string;
  category?: string;
  coverImage?: StrapiMedia | null;
  seo?: CmsSeo | null;
  motorsportPresentation?: CmsDetailPresentation | null;
};

export type CmsPartner = {
  name: string;
  websiteUrl?: string;
  logo?: StrapiMedia | null;
  isActive?: boolean;
};

export type CmsGallery = {
  title: string;
  category?: string;
  mediaItems?: StrapiMedia[];
};

export type CmsAboutCapabilityCard = {
  internalName?: string;
  enabled?: boolean;
  indexLabel?: string;
  title?: string;
  description?: string;
  sortOrder?: number;
  accent?: "crimson" | "orange" | "yellow" | "teal" | "blue";
};

export type CmsPageSection = {
  __component?: string;
  sectionKey: string;
  isActive?: boolean;
  enabled?: boolean;
  showIndex?: boolean;
  indexLabel?: string;
  showEyebrow?: boolean;
  showTitle?: boolean;
  showBody?: boolean;
  showDescription?: boolean;
  showMedia?: boolean;
  showCta?: boolean;
  supportLabel?: string;
  supportBody?: string;
  legalText?: string;
  eyebrow?: string;
  title?: string;
  body?: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  ctaTarget?: "sameWindow" | "newWindow";
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
  secondaryCtaTarget?: "sameWindow" | "newWindow";
  media?: StrapiMedia | null;
  theme?: "default" | "dark" | "light" | "accent";
  cards?: CmsAboutCapabilityCard[];
  items?: Array<{
    isActive?: boolean;
    sortOrder?: number;
    label?: string;
    title?: string;
    description?: string;
    media?: StrapiMedia | null;
    mediaAlt?: string;
    accent?: "crimson" | "orange" | "yellow" | "teal" | "blue";
    href?: string;
    hrefLabel?: string;
  }>;
};

export type CmsPageAvailability = {
  pageEnabled?: boolean;
  comingSoonEyebrow?: string;
  comingSoonTitle?: string;
  comingSoonDescription?: string;
  launchTargetLabel?: string;
  showNotifyCta?: boolean;
  noIndexWhileDisabled?: boolean;
  comingSoonMedia?: StrapiMedia | null;
};

type CmsSitePage = {
  title?: string;
  navigationLabel?: string;
  heroTitle?: string;
  heroDescription?: string;
  heroEnabled?: boolean;
  heroMedia?: StrapiMedia | null;
  sections?: CmsPageSection[];
  pageAvailability?: CmsPageAvailability | null;
  seo?: CmsSeo | null;
  routePath?: string;
  routeAliases?: string[];
};

export type CmsMotorsportSinglePage = CmsSitePage & {
  hero?: CmsPageHero | null;
  informationBand?: Record<string, unknown> | null;
  [key: string]: unknown;
};

type CmsProgram = {
  title: string;
  slug: string;
  eventMenuLabel?: string;
  eventMenuEnabled?: boolean;
  programType: MotorsportProgram["programType"];
  programStatus: MotorsportProgram["status"] | "hidden";
  seasonLabel: string;
  summary: string;
  mainHeadline?: string;
  eventStartDate?: string;
  eventEndDate?: string;
  venue?: string;
  heroMedia?: StrapiMedia | null;
  bannerSlides?: CmsCampaignSlide[];
  rundown?: CmsRundownItem[];
  relatedTicketCtas?: CmsTicketCta[];
  seo?: CmsSeo | null;
  primaryCtaLabel?: string;
  primaryCtaUrl?: string;
  becomeRidersLabel?: string;
  becomeRidersUrl?: string;
  presentationSections?: CmsPageSection[];
  fiaRallycrossContent?: CmsFiaRallycrossContent | null;
  motorsportPresentation?: CmsDetailPresentation | null;
};

type CmsFiaSectionPresentation = {
  isActive?: boolean;
  showIndex?: boolean;
  indexLabel?: string;
  showEyebrow?: boolean;
  eyebrow?: string;
  showTitle?: boolean;
  title?: string;
  showBody?: boolean;
  body?: string;
};

type CmsFiaFormatItem = {
  id?: number;
  isActive?: boolean;
  sortOrder?: number;
  label?: string;
  title: string;
  description?: string;
  accent?: "crimson" | "orange" | "yellow" | "teal" | "blue";
};

type CmsFiaRallycrossContent = {
  formatSection?: (CmsFiaSectionPresentation & {
    formatItems?: CmsFiaFormatItem[];
  }) | null;
  rundownSection?: (CmsFiaSectionPresentation & {
    rundownItems?: CmsRundownItem[];
  }) | null;
  raceDayGuideSection?: (CmsFiaSectionPresentation & {
    ruleItems?: CmsEventRule[];
  }) | null;
};

type CmsCampaignSlide = {
  id?: number;
  title: string;
  description?: string;
  image?: StrapiMedia | null;
  mobileImage?: StrapiMedia | null;
  ctaLabel?: string;
  ctaUrl?: string;
  sortOrder?: number;
};

type CmsEventRule = {
  id?: number;
  isActive?: boolean;
  ruleType: "do" | "dont";
  title: string;
  description: string;
  sortOrder?: number;
};

export type CmsSeo = {
  metaTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: StrapiMedia | null;
  canonicalUrl?: string;
  noIndex?: boolean;
};

type CmsRundownItem = {
  id?: number;
  isActive?: boolean;
  dayLabel: string;
  dateLabel?: string;
  venue?: string;
  status?: ScheduleEntry["status"];
  startTime?: string;
  endTime?: string;
  title: string;
  description?: string;
  sortOrder?: number;
};

type CmsRider = {
  name: string;
  slug: string;
  number?: string;
  team?: string;
  region?: string;
  nationality?: string;
  portrait?: StrapiMedia | null;
  bio?: string;
  isActive?: boolean;
  sortOrder?: number;
};

type CmsStanding = {
  seasonLabel: string;
  roundLabel: string;
  rider?: CmsRider | null;
  position: number;
  points: string | number;
  resultSummary?: string;
  resultDate?: string;
};

type CmsRegulation = {
  title: string;
  version: string;
  effectiveDate: string;
  pdfFile?: StrapiMedia | null;
  summary?: string;
  isActive?: boolean;
};

type CmsMerchandise = {
  title: string;
  slug: string;
  description?: string;
  image?: StrapiMedia | null;
  priceLabel?: string;
  availabilityStatus: MerchandiseItem["availability"] | "hidden";
  externalUrl?: string;
};

type CmsLeadership = {
  name: string;
  role?: string;
  group?: TeamMember["group"];
  summary?: string;
  portrait?: StrapiMedia | null;
  siteScope?: "gateway" | "motorsport" | "horsesport" | "shared" | "hidden";
};

type CmsSite = {
  name: string;
  slug: string;
  baseUrl?: string;
  description?: string;
  themeKey?: string;
  isActive?: boolean;
  order?: number;
  logo?: StrapiMedia | null;
  headerLogo?: StrapiMedia | null;
  footerLogo?: StrapiMedia | null;
  footerStatement?: string;
  footerCopyright?: string;
  footerColumns?: CmsFooterColumn[];
  footerSocialLinks?: CmsFooterLink[];
  footerUtilityLinks?: CmsFooterLink[];
};

export type CmsFooterLink = {
  label: string;
  href: string;
  linkType?: "internal" | "external";
  openInNewTab?: boolean;
  enabled?: boolean;
  displayOrder?: number;
  icon?: StrapiMedia | null;
};

export type CmsFooterColumn = {
  title: string;
  displayOrder?: number;
  links?: CmsFooterLink[];
};

export type CmsFooterSocialLink = {
  label: string;
  href: string;
  external: boolean;
  openInNewTab?: boolean;
  iconUrl?: string;
  iconAlt?: string;
};

export type MotorsportChrome = {
  headerLogo?: string;
  headerLogoAlt?: string;
  footerLogo?: string;
  footerLogoAlt?: string;
  footerStatement?: string;
  footerCopyright?: string;
  footerColumns?: {
    title: string;
    links: CmsFooterLink[];
  }[];
  footerSocialLinks?: CmsFooterSocialLink[];
  footerUtilityLinks?: CmsFooterLink[];
};

const fallbackFooterColumns = [
  {
    title: "Discover",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Events", href: "/events" },
      { label: "News", href: "/news" },
    ],
  },
];

function mapFooterLinks(links: CmsFooterLink[] | undefined) {
  return (links ?? [])
    .filter(
      (link) =>
        link.enabled !== false && link.label?.trim() && link.href?.trim(),
    )
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
}

function mapFooterColumnLinks(links: CmsFooterLink[] | undefined) {
  return mapFooterLinks(links).map((link) => ({
    label: link.label.trim(),
    href: link.href.trim(),
    external: link.linkType === "external",
    openInNewTab: link.openInNewTab ?? false,
  }));
}

export async function fetchMotorsportChrome(
  locale?: Locale,
): Promise<MotorsportChrome> {
  const response = await fetchStrapiList<CmsSite>("sites", {
    populate: [
      "headerLogo",
      "footerLogo",
      "footerColumns.links",
      "footerSocialLinks.icon",
      "footerUtilityLinks",
    ],
    filters: {
      "filters[slug][$eq]": "sarga-motorsport",
      "filters[isActive][$eq]": "true",
    },
    locale,
    limit: 1,
    revalidate: 60,
  });
  const site = response?.data[0];
  const columns = (site?.footerColumns ?? [])
    .filter((column) => column.title?.trim())
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    .map((column) => ({
      title: column.title.trim(),
      links: mapFooterColumnLinks(column.links),
    }))
    .filter((column) => column.links.length);

  return {
    headerLogo:
      mediaUrl(site?.headerLogo?.url) ||
      "/brand/logo-sarga-motorsport-symbol-sport.png",
    headerLogoAlt: site?.headerLogo?.alternativeText || "Sarga Motorsport",
    footerLogo:
      mediaUrl(site?.footerLogo?.url) ||
      "/brand/logo-sarga-motorsport-part-of-sarga.png",
    footerLogoAlt:
      site?.footerLogo?.alternativeText || "Sarga Motorsport, part of Sarga",
    footerStatement: site?.footerStatement || "Racing, amplified.",
    footerCopyright: site?.footerCopyright || "© 2026 Sarga Motorsport",
    footerColumns: columns.length ? columns : fallbackFooterColumns,
    footerSocialLinks: mapFooterLinks(site?.footerSocialLinks).map((link) => ({
      label: link.label.trim(),
      href: link.href.trim(),
      external: link.linkType === "external",
      openInNewTab: link.openInNewTab ?? false,
      iconUrl: mediaUrl(link.icon?.url) || undefined,
      iconAlt: link.icon?.alternativeText || `${link.label} logo`,
    })),
    footerUtilityLinks: mapFooterLinks(site?.footerUtilityLinks),
  };
}

export type SitePageContent = {
  title?: string;
  navigationLabel?: string;
  heroTitle?: string;
  heroDescription?: string;
  heroEnabled: boolean;
  heroImage?: string;
  heroImageAlt?: string;
  sections: CmsPageSection[];
  pageAvailability?: CmsPageAvailability | null;
  seo?: CmsSeo | null;
  hero?: ReturnType<typeof mapMotorsportPageHero>;
  informationBand?: ReturnType<typeof mapMotorsportInformationBand>;
  routePath?: string;
  routeAliases?: string[];
};

const SINGLE_PAGE_ENDPOINTS: Record<string, string> = {
  home: "motorsport-home-page",
  about: "motorsport-about-page",
  eventHub: "motorsport-events-page",
  newsHub: "motorsport-news-page",
  merchandise: "motorsport-merchandise-page",
  "/gallery": "motorsport-gallery-page",
  "/tickets": "motorsport-tickets-page",
  "/contact": "motorsport-contact-page",
  "/partners": "motorsport-partners-page",
  "/experience": "motorsport-experience-page",
};

// Dedicated page single types do not share an identical component-field
// contract. Keep nested population explicit: Strapi's wildcard population
// does not recursively populate component relations such as hero metrics,
// information-band metrics, or section media.
const COMMON_PAGE_POPULATE = [
  "hero.backgroundMedia",
  "hero.mobileBackgroundMedia",
  "hero.metrics",
  "informationBand.metrics",
  "pageAvailability.comingSoonMedia",
  "seo.ogImage",
];
// Home has its own section population contract and remains unchanged by this
// non-Home single-page population fix.
const HOME_PAGE_POPULATE = "*";

const ABOUT_PAGE_POPULATE = [
  ...COMMON_PAGE_POPULATE,
  "profileSection.media",
  "profileSection.items.media",
  "capabilities.cards",
  "teamSection.media",
  "teamSection.items.media",
  "contactCtaSection.media",
  "contactCtaSection.items.media",
  "ecosystemCtaSection.media",
  "ecosystemCtaSection.items.media",
];

const SINGLE_PAGE_POPULATE_BY_ENDPOINT: Record<string, string[]> = {
  "motorsport-events-page": [
    ...COMMON_PAGE_POPULATE,
    "programmesSection.media",
    "programmesSection.items.media",
    "calendarSection.media",
    "calendarSection.items.media",
  ],
  "motorsport-news-page": [
    ...COMMON_PAGE_POPULATE,
    "leadStorySection.media",
    "leadStorySection.items.media",
    "archiveIntroSection.media",
    "archiveIntroSection.items.media",
    "galleryCtaSection.media",
    "galleryCtaSection.items.media",
  ],
  "motorsport-gallery-page": [
    ...COMMON_PAGE_POPULATE,
    "archiveSection.media",
    "archiveSection.items.media",
  ],
  "motorsport-merchandise-page": [
    ...COMMON_PAGE_POPULATE,
    "catalogueSection.media",
    "catalogueSection.items.media",
    "finalCtaSection.media",
    "finalCtaSection.items.media",
  ],
  "motorsport-tickets-page": [
    ...COMMON_PAGE_POPULATE,
    "featuredTicketSection.media",
    "featuredTicketSection.items.media",
    "ticketedEventsSection.media",
    "ticketedEventsSection.items.media",
    "ticketInfoSection.media",
    "ticketInfoSection.items.media",
  ],
  "motorsport-contact-page": [
    ...COMMON_PAGE_POPULATE,
    "inquiryFormSection.media",
    "inquiryFormSection.items.media",
    "finalCtaSection.media",
    "finalCtaSection.items.media",
  ],
  "motorsport-partners-page": [
    ...COMMON_PAGE_POPULATE,
    "partnerNetworkSection.media",
    "partnerNetworkSection.items.media",
    "finalCtaSection.media",
    "finalCtaSection.items.media",
  ],
  "motorsport-experience-page": [
    ...COMMON_PAGE_POPULATE,
    "pillarsSection.media",
    "pillarsSection.items.media",
    "trackSection.media",
    "trackSection.items.media",
    "finalCtaSection.media",
    "finalCtaSection.items.media",
  ],
};

function dedicatedPagePopulate(endpoint?: string): string[] {
  return (
    SINGLE_PAGE_POPULATE_BY_ENDPOINT[endpoint ?? ""] ?? COMMON_PAGE_POPULATE
  );
}

function singleEndpoint(pageKind: string, routePath?: string) {
  return SINGLE_PAGE_ENDPOINTS[routePath || pageKind];
}

async function shouldReadDedicatedPage(endpoint?: string) {
  if (!endpoint || !(await isStrapiPreviewEnabled())) return Boolean(endpoint);
  const context = await getMotorsportPreviewContext();
  // Legacy Site Page previews must remain exact until records are archived.
  // Any dedicated Page preview (or a supporting-content preview) reads the
  // current dedicated page document through the normal preview client logic.
  return !context || previewCollectionForUid(context.uid) !== "site-pages";
}

function mapSinglePage(page: CmsMotorsportSinglePage): SitePageContent {
  const hero = mapMotorsportPageHero(page.hero);
  return {
    title: page.title,
    navigationLabel: page.navigationLabel,
    heroTitle: hero?.title || page.heroTitle,
    heroDescription: hero?.description || page.heroDescription,
    heroEnabled: hero?.isActive ?? page.heroEnabled !== false,
    heroImage: hero?.backgroundMedia?.url,
    heroImageAlt: hero?.backgroundMedia?.alt,
    sections: mapMotorsportSinglePageSections(page, mediaUrl),
    pageAvailability: page.pageAvailability,
    seo: page.seo,
    hero,
    informationBand: mapMotorsportInformationBand(
      page.informationBand as CmsPageInformationBand | null | undefined,
    ),
    routePath: page.routePath,
    routeAliases: page.routeAliases,
  };
}

export type AboutCapability = {
  indexLabel?: string;
  title: string;
  description: string;
  accent?: CmsAboutCapabilityCard["accent"];
};

export type AboutCapabilitiesSection = {
  showIndex: boolean;
  indexLabel?: string;
  showEyebrow: boolean;
  showTitle: boolean;
  showDescription: boolean;
  eyebrow: string;
  title: string;
  description?: string;
  cards: AboutCapability[];
};

export function mapAboutCapabilities(
  sections: CmsPageSection[] | undefined,
): AboutCapabilitiesSection | null {
  const section = sections?.find(
    (item) => item.__component === "motorsport.about-capabilities",
  );
  if (!section || section.enabled === false || !section.cards?.length)
    return null;

  const cards = section.cards
    .filter(
      (
        card,
      ): card is CmsAboutCapabilityCard & {
        title: string;
        description: string;
      } =>
        card.enabled !== false &&
        Boolean(card.title?.trim()) &&
        Boolean(card.description?.trim()),
    )
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((card) => ({
      indexLabel: card.indexLabel?.trim() || undefined,
      title: card.title.trim(),
      description: card.description.trim(),
      accent: card.accent,
    }));

  if (!cards.length) return null;
  return {
    showIndex: section.showIndex !== false,
    indexLabel: section.indexLabel?.trim() || "CAPABILITY",
    showEyebrow: section.showEyebrow !== false,
    showTitle: section.showTitle !== false,
    showDescription: section.showDescription !== false,
    eyebrow: section.eyebrow?.trim() || "What we do",
    title:
      section.title?.trim() ||
      "Competition is the core. Experience completes it.",
    description: section.description?.trim() || undefined,
    cards,
  };
}
const SITE_SCOPE_FILTERS: Record<string, string> = {
  "filters[siteScope][$in][0]": "motorsport",
  "filters[siteScope][$in][1]": "shared",
};

function statusMap(raw?: string): MotorsportStatus {
  switch (raw) {
    case "tickets_open":
    case "tickets-open":
    case "ticketsOpen":
      return "tickets-open";
    case "live":
    case "live_now":
      return "live";
    case "sold_out":
    case "sold-out":
    case "soldOut":
      return "sold-out";
    case "past":
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
  const date = new Date(iso);
  if (Number.isNaN(date.valueOf())) return "TBA";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateRange(start?: string, end?: string): string {
  if (!start) return "TBA";
  if (!end) return formatDate(start);
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (Number.isNaN(startDate.valueOf()) || Number.isNaN(endDate.valueOf())) {
    return formatDate(start);
  }
  if (
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getFullYear() === endDate.getFullYear()
  ) {
    return `${startDate.toLocaleDateString("en-GB", { day: "2-digit" })}–${endDate.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      },
    )}`;
  }
  return `${formatDate(start)} – ${formatDate(end)}`;
}

function formatCampaignDateRange(start?: string, end?: string): string {
  if (!start) return "Date to be announced";
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : undefined;
  if (Number.isNaN(startDate.valueOf())) return "Date to be announced";
  if (
    endDate &&
    !Number.isNaN(endDate.valueOf()) &&
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getFullYear() === endDate.getFullYear()
  ) {
    return `${startDate.getDate()}-${endDate.getDate()} ${endDate.toLocaleDateString(
      "en-GB",
      { month: "long", year: "numeric" },
    )}`;
  }
  return endDate && !Number.isNaN(endDate.valueOf())
    ? `${startDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} - ${endDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`
    : startDate.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
}

function formatTime(value?: string): string | undefined {
  if (!value) return undefined;
  const [hours, minutes] = value.split(":");
  return hours && minutes ? `${hours}:${minutes}` : value;
}

export function safeInternalRoute(value?: string): string | undefined {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return undefined;
  }
  return value;
}

export function safeExternalUrl(value?: string): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (url.protocol === "https:") return url.toString();
    if (
      process.env.NODE_ENV !== "production" &&
      url.protocol === "http:" &&
      ["localhost", "127.0.0.1"].includes(url.hostname)
    ) {
      return url.toString();
    }
  } catch {
    return undefined;
  }
  return undefined;
}

export function safeCmsCtaUrl(value?: string): string | undefined {
  return safeInternalRoute(value) ?? safeExternalUrl(value);
}

function mapTicketCard(
  ticket?: CmsTicketCta | null,
): MotorsportTicketCard | undefined {
  if (!ticket) return undefined;
  const image =
    mediaUrl(ticket.backgroundImage?.url) || mediaUrl(ticket.image?.url);
  const mobileImage =
    mediaUrl(ticket.backgroundImageMobile?.url) || image || undefined;
  return {
    eyebrow: ticket.eyebrow,
    title: ticket.title,
    description: ticket.description,
    eventMeta: ticket.eventText,
    eventMetaLabel: ticket.eventLabel,
    provider: ticket.providerText || ticket.provider,
    providerLabel: ticket.providerLabel,
    partnerLabel: ticket.partnerLabel,
    footerText: ticket.footerText,
    image: image || undefined,
    mobileImage,
  };
}

export function mapEvent(
  entry: StrapiListResponse<CmsEvent>["data"][number],
): MotorsportEvent {
  const image = entry.coverImage ?? entry.heroMedia ?? null;
  const ticket = entry.ticketCtas?.find(
    (candidate) => candidate.isActive !== false,
  );
  const ticketMode = ticket?.ctaType ?? "redirect";
  const embedCandidate =
    ticket?.embedConfigJson?.url ?? ticket?.embedConfigJson?.src ?? ticket?.url;
  const configuredTicketHref =
    safeInternalRoute(ticket?.url) ??
    (ticketMode === "embed"
      ? safeTicketEmbedUrl(embedCandidate)
      : safeTicketUrl(ticket?.url, ticketMode));
  const hasTicket = Boolean(ticket);
  return {
    title: entry.title || "Untitled event",
    slug: entry.slug,
    href: `/events/${entry.slug ?? entry.documentId}`,
    dateLabel: formatDateRange(entry.eventDate, entry.endDate),
    venue: entry.venue || entry.circuitName || "TBA",
    image: mediaUrl(image?.url) || "/media/motorsport-design-hero.png",
    imageAlt:
      image?.alternativeText ?? `${entry.title} - Sarga Motorsport event`,
    status: statusMap(entry.eventStatus),
    category: entry.racingCategory || undefined,
    seriesName: entry.seriesName || undefined,
    ticketHref: configuredTicketHref ?? (hasTicket ? "/tickets" : undefined),
    ticketLabel: ticket?.ctaLabel || ticket?.label,
    ticketCard: mapTicketCard(ticket),
    sponsors: entry.sponsors?.map(mapPartner),
  };
}

function mapDetailPresentation(input?: CmsDetailPresentation | null) {
  if (!input) return undefined;
  return {
    hero: mapMotorsportPageHero(input.hero),
    informationBand: mapMotorsportInformationBand(input.informationBand),
    routeKey: input.routeKey,
  };
}

export function mapArticle(
  entry: StrapiListResponse<CmsArticle>["data"][number],
): MotorsportArticle {
  const image = entry.coverImage ?? null;
  return {
    title: entry.title || "Untitled article",
    href: `/news/${entry.slug ?? entry.documentId}`,
    image: mediaUrl(image?.url) || "/media/motorcycle-racing-dusk.png",
    imageAlt:
      image?.alternativeText ?? `${entry.title} - Sarga Motorsport news`,
    category: entry.category || "Motorsport",
    publishedLabel: formatDate(entry.publishedDate ?? entry.publishedAt),
    excerpt: entry.excerpt || undefined,
  };
}

export function mapCmsSeo(seo?: CmsSeo | null) {
  if (!seo) return undefined;
  return {
    metaTitle: seo.metaTitle,
    metaDescription: seo.metaDescription,
    ogTitle: seo.ogTitle,
    ogDescription: seo.ogDescription,
    ogImageUrl: mediaUrl(seo.ogImage?.url) || undefined,
    canonicalUrl: seo.canonicalUrl?.startsWith("/")
      ? resolveSiteUrl(seo.canonicalUrl)
      : safeExternalUrl(seo.canonicalUrl),
    noIndex: seo.noIndex,
  };
}

export function mapPartner(
  entry: StrapiListResponse<CmsPartner>["data"][number],
): PartnerItem {
  return {
    name: entry.name || "Partner",
    logo:
      mediaUrl(entry.logo?.url) ||
      "/brand/logo-sarga-motorsport-symbol-sport.png",
    href: safeExternalUrl(entry.websiteUrl),
  };
}

export function mapGalleryItems(
  galleries: StrapiListResponse<CmsGallery>,
): GalleryItem[] {
  return galleries.data.flatMap((entry) =>
    (entry.mediaItems ?? []).flatMap((image, index) => {
      const url = mediaUrl(image.url);
      return url
        ? [
            {
              id: `cms-${entry.id}-${index}`,
              image: url,
              imageAlt:
                image.alternativeText ?? `${entry.title} - Sarga Motorsport`,
              eyebrow: entry.title,
              category: entry.category,
            },
          ]
        : [];
    }),
  );
}

export async function fetchSitePage(
  pageKind:
    "home" | "about" | "eventHub" | "newsHub" | "merchandise" | "custom",
  routePath?: string,
  locale?: Locale,
): Promise<SitePageContent | null> {
  const endpoint = singleEndpoint(pageKind, routePath);
  // Dedicated Motorsport page single types are the live source of truth. A
  // legacy Site Page draft still wins only when that exact legacy record is
  // being previewed, so older editor previews remain usable during retirement.
  const preview = await getMotorsportPreviewContext();
  const isLegacySitePagePreview =
    preview && previewCollectionForUid(preview.uid) === "site-pages";
  if (endpoint && !isLegacySitePagePreview) {
    const single = await fetchStrapiSingle<CmsMotorsportSinglePage>(endpoint, {
      populate:
        pageKind === "home"
          ? HOME_PAGE_POPULATE
          : pageKind === "about"
            ? ABOUT_PAGE_POPULATE
            : dedicatedPagePopulate(endpoint),
      locale,
      revalidate: 0,
    });
    return single?.data ? mapSinglePage(single.data) : null;
  }
  const response = await fetchStrapiList<CmsSitePage>("site-pages", {
    populate: [
      "heroMedia",
      "sections",
      "pageAvailability.comingSoonMedia",
      "seo.ogImage",
    ],
    filters: {
      "filters[siteScope][$eq]": "motorsport",
      "filters[pageKind][$eq]": pageKind,
      ...(routePath ? { "filters[routePath][$eq]": routePath } : {}),
    },
    locale,
    limit: 1,
    // Visibility edits must be reflected immediately after CMS publish.
    revalidate: 0,
  });
  const page = response?.data?.[0];
  if (!page) return null;
  const heroImage =
    page.heroMedia &&
    (!page.heroMedia.mime || page.heroMedia.mime.startsWith("image/"))
      ? mediaUrl(page.heroMedia.url)
      : undefined;
  return {
    title: page.title,
    navigationLabel: page.navigationLabel,
    heroTitle: page.heroTitle,
    heroDescription: page.heroDescription,
    heroEnabled: page.heroEnabled !== false,
    heroImage,
    heroImageAlt: page.heroMedia?.alternativeText,
    sections: (page.sections ?? []).map((section) => ({
      ...section,
      media: section.media
        ? { ...section.media, url: mediaUrl(section.media.url) }
        : null,
    })),
    pageAvailability: page.pageAvailability
      ? {
          ...page.pageAvailability,
          comingSoonMedia: page.pageAvailability.comingSoonMedia
            ? {
                ...page.pageAvailability.comingSoonMedia,
                url: mediaUrl(page.pageAvailability.comingSoonMedia.url),
              }
            : null,
        }
      : null,
    seo: page.seo,
  };
}

export async function fetchMotorsportPageByRoute(
  routePath: string,
  locale?: Locale,
): Promise<SitePageContent | null> {
  const endpoint = singleEndpoint("custom", routePath);
  if (await shouldReadDedicatedPage(endpoint)) {
    const single = await fetchStrapiSingle<CmsMotorsportSinglePage>(endpoint, {
      populate:
        endpoint === "motorsport-about-page"
          ? ABOUT_PAGE_POPULATE
          : dedicatedPagePopulate(endpoint),
      locale,
      revalidate: 0,
    });
    return single?.data ? mapSinglePage(single.data) : null;
  }
  const response = await fetchStrapiList<CmsSitePage>("site-pages", {
    populate: [
      "heroMedia",
      "sections",
      "pageAvailability.comingSoonMedia",
      "seo.ogImage",
    ],
    filters: {
      "filters[siteScope][$eq]": "motorsport",
      "filters[routePath][$eq]": routePath,
    },
    locale,
    limit: 1,
    revalidate: 0,
  });
  const page = response?.data?.[0];
  if (!page) return null;
  const heroImage =
    page.heroMedia &&
    (!page.heroMedia.mime || page.heroMedia.mime.startsWith("image/"))
      ? mediaUrl(page.heroMedia.url)
      : undefined;
  return {
    title: page.title,
    navigationLabel: page.navigationLabel,
    heroTitle: page.heroTitle,
    heroDescription: page.heroDescription,
    heroEnabled: page.heroEnabled !== false,
    heroImage,
    heroImageAlt: page.heroMedia?.alternativeText,
    sections: (page.sections ?? []).map((section) => ({
      ...section,
      media: section.media
        ? { ...section.media, url: mediaUrl(section.media.url) }
        : null,
    })),
    pageAvailability: page.pageAvailability
      ? {
          ...page.pageAvailability,
          comingSoonMedia: page.pageAvailability.comingSoonMedia
            ? {
                ...page.pageAvailability.comingSoonMedia,
                url: mediaUrl(page.pageAvailability.comingSoonMedia.url),
              }
            : null,
        }
      : null,
    seo: page.seo,
  };
}

export async function fetchEvents(
  limit = 50,
  locale?: Locale,
): Promise<MotorsportEvent[]> {
  const dedicatedOptions = {
    populate: [
      "coverImage",
      "heroMedia",
      "ticketCtas",
      "ticketCtas.image",
      "ticketCtas.backgroundImage",
      "ticketCtas.backgroundImageMobile",
    ],
    locale,
    sort: "eventDate:asc",
    limit,
    revalidate: 60,
  };
  const response = await fetchStrapiList<CmsEvent>(
    "motorsport-events",
    dedicatedOptions,
  );
  return (response?.data ?? [])
    .filter(
      (entry) =>
        entry.eventStatus !== "hidden" && entry.showOnMotorsport !== false,
    )
    .map(mapEvent);
}

export async function fetchEventBySlug(
  slug: string,
  locale?: Locale,
): Promise<
  | (MotorsportEvent & {
      description?: string;
      seo?: CmsSeo | null;
      presentation?: ReturnType<typeof mapDetailPresentation>;
    })
  | null
> {
  const dedicatedOptions = {
    populate: [
      "coverImage",
      "heroMedia",
      "gallery",
      "ticketCtas",
      "ticketCtas.image",
      "ticketCtas.backgroundImage",
      "ticketCtas.backgroundImageMobile",
      "sponsors.logo",
      "seo.ogImage",
      "motorsportPresentation.hero.backgroundMedia",
      "motorsportPresentation.hero.mobileBackgroundMedia",
      "motorsportPresentation.hero.metrics",
      "motorsportPresentation.informationBand.metrics",
    ],
    filters: { "filters[slug][$eq]": slug },
    locale,
    limit: 1,
    revalidate: 60,
  };
  const response = await fetchStrapiList<CmsEvent>(
    "motorsport-events",
    dedicatedOptions,
  );
  const entry = response?.data?.[0];
  return entry &&
    entry.eventStatus !== "hidden" &&
    entry.showOnMotorsport !== false
    ? {
        ...mapEvent(entry),
        description: entry.description || undefined,
        seo: entry.seo,
        presentation: mapDetailPresentation(entry.motorsportPresentation),
      }
    : null;
}

export async function fetchArticles(
  limit = 50,
  locale?: Locale,
): Promise<MotorsportArticle[]> {
  const dedicatedOptions = {
    populate: "coverImage",
    locale,
    sort: "publishedDate:desc",
    limit,
    revalidate: 60,
  };
  const response = await fetchStrapiList<CmsArticle>(
    "motorsport-news-articles",
    dedicatedOptions,
  );
  return (response?.data ?? []).map(mapArticle);
}

export async function fetchArticleBySlug(
  slug: string,
  locale?: Locale,
): Promise<
  | (MotorsportArticle & {
      body?: string;
      seo?: CmsSeo | null;
      presentation?: ReturnType<typeof mapDetailPresentation>;
    })
  | null
> {
  const dedicatedOptions = {
    populate: [
      "coverImage",
      "motorsportPresentation.hero.backgroundMedia",
      "motorsportPresentation.hero.mobileBackgroundMedia",
      "motorsportPresentation.hero.metrics",
      "motorsportPresentation.informationBand.metrics",
    ],
    filters: { "filters[slug][$eq]": slug },
    locale,
    fallbackToDefaultLocale: false,
    limit: 1,
    revalidate: 60,
  };
  const response = await fetchStrapiList<CmsArticle>(
    "motorsport-news-articles",
    dedicatedOptions,
  );
  let entry = response?.data?.[0];

  // A localized UID can retain a different slug in older records. Resolve
  // the English source document first, then request the requested locale by
  // documentId so the language switch never accidentally renders English
  // just because the localized slug differs.
  if (!entry && locale === "id") {
    const sourceResponse = await fetchStrapiList<CmsArticle>(
      "motorsport-news-articles",
      {
        ...dedicatedOptions,
        locale: "en",
        fallbackToDefaultLocale: true,
      },
    );
    const source = sourceResponse?.data?.[0];
    if (source) {
      const localizedResponse = await fetchStrapiList<CmsArticle>(
        "motorsport-news-articles",
        {
          ...dedicatedOptions,
          filters: {
            "filters[documentId][$eq]": source.documentId,
          },
          locale: "id",
        },
      );
      entry = localizedResponse?.data?.[0] ?? source;
    }
  }
  return entry
    ? {
        ...mapArticle(entry),
        body: entry.body || undefined,
        seo: entry.seo,
        presentation: mapDetailPresentation(entry.motorsportPresentation),
      }
    : null;
}

export async function fetchPartners(
  limit = 20,
  locale?: Locale,
): Promise<PartnerItem[]> {
  const dedicatedOptions = {
    populate: "logo",
    locale,
    sort: "sortOrder:asc",
    limit,
    revalidate: 600,
  };
  const response = await fetchStrapiList<CmsPartner>(
    "motorsport-partners",
    dedicatedOptions,
  );
  return (response?.data ?? [])
    .filter((entry) => entry.isActive !== false)
    .map(mapPartner);
}

export type GalleryPage = {
  items: GalleryItem[];
  page: number;
  pageCount: number;
  totalGalleries: number;
  availableCategories: string[];
};

export async function fetchGalleryItems(
  options: {
    page?: number;
    pageSize?: number;
    locale?: Locale;
    category?: string;
  } = {},
): Promise<GalleryPage> {
  const requestedPage = Math.max(1, options.page ?? 1);
  const pageSize = Math.max(1, options.pageSize ?? 8);
  const preview = await getMotorsportPreviewContext();
  const isGalleryPreview = Boolean(
    preview && previewCollectionForUid(preview.uid) === "media-galleries",
  );
  const filters = { ...SITE_SCOPE_FILTERS };
  if (options.category && !isGalleryPreview) {
    filters["filters[category][$eq]"] = options.category;
  }

  const response = await fetchStrapiList<CmsGallery>("media-galleries", {
    populate: "mediaItems",
    filters,
    locale: options.locale,
    limit: 100,
    revalidate: 0,
  });
  const categoryResponse = !isGalleryPreview
    ? await fetchStrapiList<CmsGallery>("media-galleries", {
        filters: SITE_SCOPE_FILTERS,
        locale: options.locale,
        limit: 100,
        revalidate: 0,
      })
    : response;
  const allItems = response ? mapGalleryItems(response) : [];
  const items =
    isGalleryPreview && options.category
      ? allItems.filter((item) => item.category === options.category)
      : allItems;
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(requestedPage, pageCount);
  const pageItems = items.slice((page - 1) * pageSize, page * pageSize);
  const availableCategories = Array.from(
    new Set(
      (categoryResponse?.data ?? [])
        .map((entry) => entry.category?.trim().toLowerCase())
        .filter((category): category is string => Boolean(category)),
    ),
  );

  return {
    items: pageItems,
    page,
    pageCount,
    totalGalleries: response?.meta.pagination?.total ?? 0,
    availableCategories,
  };
}

export async function fetchTicketCtas(locale?: Locale): Promise<
  Array<{
    label: string;
    provider: string;
    href: string;
    eventName?: string;
    eyebrow?: string;
    title?: string;
    description?: string;
    eventMeta?: string;
    eventMetaLabel?: string;
    providerLabel?: string;
    partnerLabel?: string;
    footerText?: string;
    image?: string;
    mobileImage?: string;
    embedHref?: string;
  }>
> {
  const dedicatedOptions = {
    populate: [
      "relatedEvent",
      "image",
      "backgroundImage",
      "backgroundImageMobile",
    ],
    filters: { "filters[isActive][$eq]": "true" },
    locale,
    sort: "createdAt:desc",
    limit: 20,
    revalidate: 60,
  };
  const response = await fetchStrapiList<CmsTicketCta>(
    "motorsport-ticket-ctas",
    dedicatedOptions,
  );
  const mapped = (response?.data ?? [])
    .filter(
      (entry) =>
        entry.relatedEvent?.eventStatus !== "hidden" &&
        entry.relatedEvent?.showOnMotorsport !== false,
    )
    .map((entry) => {
      const mode = entry.ctaType ?? "redirect";
      const href = safeTicketUrl(entry.url, mode) ?? "/contact";
      const embedCandidate =
        entry.embedConfigJson?.url ?? entry.embedConfigJson?.src ?? entry.url;
      return {
        label: entry.ctaLabel || entry.label || "Get tickets",
        provider: entry.providerText || entry.provider || "Official partner",
        href,
        eventName: entry.relatedEvent?.title || entry.title,
        eyebrow: entry.eyebrow,
        title: entry.title,
        description: entry.description,
        eventMeta: entry.eventText,
        eventMetaLabel: entry.eventLabel,
        providerLabel: entry.providerLabel,
        partnerLabel: entry.partnerLabel,
        footerText: entry.footerText,
        image:
          mediaUrl(entry.backgroundImage?.url) ||
          mediaUrl(entry.image?.url) ||
          undefined,
        mobileImage:
          mediaUrl(entry.backgroundImageMobile?.url) ||
          mediaUrl(entry.backgroundImage?.url) ||
          mediaUrl(entry.image?.url) ||
          undefined,
        embedHref:
          mode === "embed" ? safeTicketEmbedUrl(embedCandidate) : undefined,
      };
    });
  const seen = new Set<string>();
  return mapped.filter((item) => {
    // The public ticket surface presents one approved destination per event.
    // Sorting by newest first above means stale seed entries for the same event
    // are ignored without mutating the shared CMS record set.
    const key = (item.eventName ?? item.href).trim().toLocaleLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function mapProgram(entry: CmsProgram): MotorsportProgram {
  const isRallycross = entry.programType === "rallycross";
  const presentationHero = mapMotorsportPageHero(
    entry.motorsportPresentation?.hero,
  );
  const presentationImage = presentationHero?.backgroundMedia;
  const legacyImage = entry.heroMedia;
  const fiaContent = entry.fiaRallycrossContent;
  const mapFiaSection = (
    section: CmsFiaSectionPresentation | null | undefined,
    sectionKey: string,
    items: NonNullable<MotorsportPresentationSection["items"]> = [],
  ) =>
    section
      ? {
          sectionKey,
          isActive: section.isActive !== false,
          indexLabel: section.indexLabel,
          showIndex: section.showIndex !== false,
          showEyebrow: section.showEyebrow !== false,
          showTitle: section.showTitle !== false,
          showBody: section.showBody !== false,
          eyebrow: section.eyebrow,
          title: section.title ?? "Section",
          body: section.body,
          items,
        }
      : null;
  const mappedFiaContent = fiaContent
    ? {
        formatSection: mapFiaSection(
          fiaContent.formatSection,
          "format",
          (fiaContent.formatSection?.formatItems ?? []).map((item) => ({
            isActive: item.isActive !== false,
            sortOrder: item.sortOrder ?? 0,
            label: item.label,
            title: item.title,
            description: item.description,
            accent: item.accent,
          })),
        ),
        rundownSection: mapFiaSection(fiaContent.rundownSection, "rundown"),
        raceDayGuideSection: mapFiaSection(
          fiaContent.raceDayGuideSection,
          "race-day-guide",
        ),
      }
    : undefined;
  return {
    title: entry.title,
    slug: entry.slug,
    eventMenuLabel: entry.eventMenuLabel || undefined,
    eventMenuEnabled: entry.eventMenuEnabled === true,
    href: isRallycross
      ? `/events/${entry.slug}`
      : (safeInternalRoute(entry.primaryCtaUrl) ?? `/events/${entry.slug}`),
    programType: entry.programType,
    status: entry.programStatus as MotorsportProgram["status"],
    seasonLabel: entry.seasonLabel,
    summary: entry.summary,
    headline: entry.mainHeadline,
    dateLabel: entry.eventStartDate
      ? formatDateRange(entry.eventStartDate, entry.eventEndDate)
      : undefined,
    venue: entry.venue,
    image:
      presentationImage?.url ||
      mediaUrl(legacyImage?.url) ||
      (isRallycross
        ? "/media/sarga-motorsport-bike-and-rally.png"
        : "/media/sarga-motorsport-discipline-motorcycle-daylight.jpg"),
    imageAlt:
      presentationImage?.alt ||
      legacyImage?.alternativeText ||
      `${entry.title} Motorsport programme`,
    ctaLabel: isRallycross
      ? "Explore event"
      : entry.primaryCtaLabel || "Explore programme",
    presentationHero,
    fiaRallycrossContent: mappedFiaContent,
    presentationSections: (entry.presentationSections ?? []).map((section) => ({
      sectionKey: section.sectionKey,
      isActive: section.isActive !== false && section.enabled !== false,
      indexLabel: section.indexLabel,
      showIndex: section.showIndex !== false,
      showEyebrow: section.showEyebrow !== false,
      showTitle: section.showTitle !== false,
      showBody: section.showBody !== false,
      showMedia: section.showMedia !== false,
      showCta: section.showCta !== false,
      ctaLabel: section.ctaLabel,
      ctaUrl: section.ctaUrl,
      eyebrow: section.eyebrow,
      title: section.title ?? "Section",
      body: section.body,
      ...(section.media ? { media: mediaUrl(section.media.url) } : {}),
      items: (section.items ?? []).map((item) => ({
        isActive: item.isActive !== false,
        sortOrder: item.sortOrder ?? 0,
        label: item.label,
        title: item.title ?? "Item",
        description: item.description,
        ...(item.media ? { media: mediaUrl(item.media.url) } : {}),
        mediaAlt: item.mediaAlt,
        accent: item.accent,
        href: item.href,
        hrefLabel: item.hrefLabel,
      })),
    })),
    informationBand: mapMotorsportInformationBand(
      entry.motorsportPresentation?.informationBand,
    ),
  };
}

function mapProgramSchedule(
  entry: CmsProgram,
  program: MotorsportProgram,
  items: CmsRundownItem[] = entry.rundown ?? [],
): ScheduleEntry[] {
  return [...items]
    .filter((item) => item.isActive !== false)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((item, index) => {
      const sessions = [
        formatTime(item.startTime)
          ? { label: "Start", time: formatTime(item.startTime)! }
          : null,
        formatTime(item.endTime)
          ? { label: "Finish", time: formatTime(item.endTime)! }
          : null,
      ].filter((session): session is { label: string; time: string } =>
        Boolean(session),
      );

      return {
        id: String(item.id ?? `${entry.slug}-${index + 1}`),
        roundLabel:
          item.dayLabel || `Round ${String(index + 1).padStart(2, "0")}`,
        title: item.title,
        dateLabel: item.dateLabel || program.seasonLabel,
        venue: item.venue || program.venue || "Venue to be announced",
        description: item.description,
        status:
          item.status ||
          (program.status === "completed" ? "completed" : "upcoming"),
        sessions,
      };
    });
}

export async function fetchPrograms(
  locale?: Locale,
): Promise<MotorsportProgram[]> {
  const response = await fetchStrapiList<CmsProgram>("motorsport-programs", {
    populate: [
      "heroMedia",
      "presentationSections.media",
      "presentationSections.items.media",
      "fiaRallycrossContent.formatSection",
      "fiaRallycrossContent.formatSection.formatItems",
      "fiaRallycrossContent.rundownSection",
      "fiaRallycrossContent.rundownSection.rundownItems",
      "fiaRallycrossContent.raceDayGuideSection",
      "fiaRallycrossContent.raceDayGuideSection.ruleItems",
      "motorsportPresentation.hero.backgroundMedia",
      "motorsportPresentation.hero.mobileBackgroundMedia",
    ],
    filters: SITE_SCOPE_FILTERS,
    locale,
    sort: "createdAt:asc",
    // The dropdown is an index of all enabled programmes, not a content
    // preview. Keep the ceiling high enough that older records cannot hide a
    // newly enabled programme near the end of the collection.
    limit: 100,
    revalidate: 60,
  });
  return (response?.data ?? [])
    .filter((entry) => entry.programStatus !== "hidden")
    .map(mapProgram);
}

/**
 * Read only the published program fields needed by the global Event menu.
 * This is intentionally uncached so an editor's eventMenuEnabled change is
 * visible on the next request instead of waiting for the general program
 * cache or a separately configured CMS webhook.
 */
export async function fetchEventMenuPrograms(
  locale?: Locale,
): Promise<MotorsportProgram[]> {
  const response = await fetchStrapiList<CmsProgram>("motorsport-programs", {
    filters: {
      ...SITE_SCOPE_FILTERS,
      "filters[eventMenuEnabled][$eq]": "true",
      "filters[programStatus][$ne]": "hidden",
    },
    locale,
    sort: "createdAt:asc",
    // The dropdown is an index of all enabled programmes, not a content
    // preview. Keep the ceiling high enough that older records cannot hide a
    // newly enabled programme near the end of the collection.
    limit: 100,
    revalidate: 0,
  });
  return (response?.data ?? [])
    .filter(
      (entry) =>
        entry.programStatus !== "hidden" && entry.eventMenuEnabled === true,
    )
    .map(mapProgram);
}

export async function fetchProgramBySlug(
  slug: string,
  locale?: Locale,
): Promise<MotorsportProgramDetail | null> {
  const response = await fetchStrapiList<CmsProgram>("motorsport-programs", {
    populate: [
      "heroMedia",
      "presentationSections.media",
      "presentationSections.items.media",
      "rundown",
      "motorsportPresentation.hero.backgroundMedia",
      "motorsportPresentation.hero.mobileBackgroundMedia",
      "motorsportPresentation.informationBand.metrics",
    ],
    filters: {
      ...SITE_SCOPE_FILTERS,
      "filters[slug][$eq]": slug,
    },
    locale,
    limit: 1,
    revalidate: 60,
  });
  const entry = response?.data?.[0];
  if (!entry) return null;

  const program = mapProgram(entry);
  const schedule = mapProgramSchedule(
    entry,
    program,
    entry.fiaRallycrossContent?.rundownSection?.rundownItems?.length
      ? entry.fiaRallycrossContent.rundownSection.rundownItems
      : undefined,
  );

  return {
    ...program,
    schedule,
    becomeRidersLabel: entry.becomeRidersLabel || "Become Riders",
    becomeRidersHref:
      safeInternalRoute(entry.becomeRidersUrl) ??
      `/events/${entry.slug}/become-riders`,
  };
}

export async function fetchCampaignProgramBySlug(
  slug: string,
  locale?: Locale,
): Promise<MotorsportCampaignDetail | null> {
  const response = await fetchStrapiList<CmsProgram>("motorsport-programs", {
    populate: [
      "heroMedia",
      "bannerSlides.image",
      "bannerSlides.mobileImage",
      "relatedTicketCtas",
      "relatedTicketCtas.image",
      "relatedTicketCtas.backgroundImage",
      "relatedTicketCtas.backgroundImageMobile",
      "seo.ogImage",
      "presentationSections.media",
      "presentationSections.items.media",
      "fiaRallycrossContent.formatSection",
      "fiaRallycrossContent.formatSection.formatItems",
      "fiaRallycrossContent.rundownSection",
      "fiaRallycrossContent.rundownSection.rundownItems",
      "fiaRallycrossContent.raceDayGuideSection",
      "fiaRallycrossContent.raceDayGuideSection.ruleItems",
      "motorsportPresentation.hero.backgroundMedia",
      "motorsportPresentation.hero.mobileBackgroundMedia",
      "motorsportPresentation.informationBand.metrics",
    ],
    filters: {
      ...SITE_SCOPE_FILTERS,
      "filters[slug][$eq]": slug,
    },
    locale,
    limit: 1,
    revalidate: 60,
  });
  const entry = response?.data?.[0];
  if (!entry || entry.programStatus === "hidden") return null;

  const program = mapProgram(entry);
  const campaignDate = formatCampaignDateRange(
    entry.eventStartDate,
    entry.eventEndDate,
  );
  const ticket = (entry.relatedTicketCtas ?? []).find(
    (candidate) => candidate.isActive !== false,
  );
  const hasTicketCta = Boolean(ticket || entry.primaryCtaUrl);
  const ticketMode = ticket?.ctaType ?? "redirect";
  const embedCandidate =
    ticket?.embedConfigJson?.url ?? ticket?.embedConfigJson?.src ?? ticket?.url;
  const ticketHref =
    ticketMode === "embed"
      ? (safeTicketEmbedUrl(embedCandidate) ?? "/tickets")
      : (safeTicketUrl(ticket?.url, ticketMode) ??
        safeInternalRoute(entry.primaryCtaUrl) ??
        "/tickets");
  const slides = [...(entry.bannerSlides ?? [])]
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((slide, index) => {
      const internalCta = safeInternalRoute(slide.ctaUrl);
      const externalCta = safeTicketUrl(slide.ctaUrl);
      const slideHref = internalCta ?? externalCta;
      return {
        id: String(slide.id ?? `${slug}-slide-${index + 1}`),
        eyebrow: `FIA Rallycross / Campaign ${String(index + 1).padStart(2, "0")}`,
        headline: slide.title,
        description: slide.description,
        eventTitle: program.title,
        dateLabel: campaignDate,
        venue: program.venue,
        image: mediaUrl(slide.image?.url),
        imageAlt:
          slide.image?.alternativeText ?? `${slide.title} — ${program.title}`,
        mobileImage: mediaUrl(slide.mobileImage?.url) || undefined,
        cta:
          slide.ctaLabel && slideHref
            ? {
                label: slide.ctaLabel,
                href: slideHref,
                external: Boolean(externalCta && !internalCta),
              }
            : undefined,
      };
    });

  return {
    ...program,
    dateLabel: campaignDate,
    schedule: mapProgramSchedule(
      entry,
      program,
      entry.fiaRallycrossContent?.rundownSection?.rundownItems ?? [],
    ),
    slides,
    rules: [...(entry.fiaRallycrossContent?.raceDayGuideSection?.ruleItems ?? [])]
      .filter((rule) => rule.isActive !== false)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map((rule, index) => ({
        id: String(rule.id ?? `${slug}-rule-${index + 1}`),
        type: rule.ruleType,
        title: rule.title,
        description: rule.description,
      })),
    ticketCta: hasTicketCta
      ? {
          label:
            ticket?.ctaLabel ||
            ticket?.label ||
            entry.primaryCtaLabel ||
            "Get Your Ticket Now",
          href: ticketHref,
          external: !ticketHref.startsWith("/"),
          provider:
            ticket?.providerText ||
            ticket?.provider ||
            "Official ticketing partner",
          eyebrow: ticket?.eyebrow,
          title: ticket?.title,
          description: ticket?.description,
          eventMeta: ticket?.eventText,
          eventMetaLabel: ticket?.eventLabel,
          providerLabel: ticket?.providerLabel,
          partnerLabel: ticket?.partnerLabel,
          footerText: ticket?.footerText,
          image:
            mediaUrl(ticket?.backgroundImage?.url) ||
            mediaUrl(ticket?.image?.url) ||
            undefined,
          mobileImage:
            mediaUrl(ticket?.backgroundImageMobile?.url) ||
            mediaUrl(ticket?.backgroundImage?.url) ||
            mediaUrl(ticket?.image?.url) ||
            undefined,
        }
      : undefined,
    seo: entry.seo
      ? {
          title: entry.seo.metaTitle,
          description: entry.seo.metaDescription,
          ogTitle: entry.seo.ogTitle,
          ogDescription: entry.seo.ogDescription,
          image: mediaUrl(entry.seo.ogImage?.url) || program.image,
          canonical: entry.seo.canonicalUrl?.startsWith("/")
            ? resolveSiteUrl(entry.seo.canonicalUrl)
            : safeExternalUrl(entry.seo.canonicalUrl),
          noIndex: entry.seo.noIndex,
        }
      : undefined,
  };
}

export async function fetchProgramRiders(
  programSlug: string,
  locale?: Locale,
): Promise<MotorsportRider[]> {
  const response = await fetchStrapiList<CmsRider>("motorsport-riders", {
    populate: "portrait",
    filters: {
      ...SITE_SCOPE_FILTERS,
      "filters[program][slug][$eq]": programSlug,
      "filters[isActive][$eq]": "true",
    },
    locale,
    sort: "sortOrder:asc",
    limit: 100,
    revalidate: 60,
  });

  return (response?.data ?? []).map((entry) => ({
    name: entry.name,
    slug: entry.slug,
    number: entry.number,
    team: entry.team,
    region: entry.region,
    nationality: entry.nationality,
    portrait: mediaUrl(entry.portrait?.url) || undefined,
    portraitAlt: `${entry.name} rider portrait`,
    bio: entry.bio,
  }));
}

export async function fetchProgramRiderBySlug(
  programSlug: string,
  riderSlug: string,
  locale?: Locale,
): Promise<MotorsportRider | null> {
  const response = await fetchStrapiList<CmsRider>("motorsport-riders", {
    populate: "portrait",
    filters: {
      ...SITE_SCOPE_FILTERS,
      "filters[program][slug][$eq]": programSlug,
      "filters[slug][$eq]": riderSlug,
      "filters[isActive][$eq]": "true",
    },
    locale,
    limit: 1,
    revalidate: 60,
  });
  const entry = response?.data?.[0];
  if (!entry) return null;

  return {
    name: entry.name,
    slug: entry.slug,
    number: entry.number,
    team: entry.team,
    region: entry.region,
    nationality: entry.nationality,
    portrait: mediaUrl(entry.portrait?.url) || undefined,
    portraitAlt: `${entry.name} rider portrait`,
    bio: entry.bio,
  };
}

export async function fetchProgramStandings(
  programSlug: string,
  locale?: Locale,
): Promise<StandingEntry[]> {
  const response = await fetchStrapiList<CmsStanding>("motorsport-standings", {
    populate: ["rider.portrait"],
    filters: {
      ...SITE_SCOPE_FILTERS,
      "filters[program][slug][$eq]": programSlug,
    },
    locale,
    sort: "position:asc",
    limit: 100,
    revalidate: 60,
  });

  return (response?.data ?? []).map((entry) => ({
    position: entry.position,
    rider: entry.rider?.name ?? "Rider pending",
    riderSlug: entry.rider?.slug,
    number: entry.rider?.number,
    team: entry.rider?.team,
    region: entry.rider?.region,
    portrait: mediaUrl(entry.rider?.portrait?.url) || undefined,
    portraitAlt: entry.rider?.name
      ? `${entry.rider.name} rider portrait`
      : undefined,
    points: entry.points,
    resultSummary: entry.resultSummary,
  }));
}

export async function fetchProgramRegulations(
  programSlug: string,
  locale?: Locale,
): Promise<MotorsportRegulation[]> {
  const response = await fetchStrapiList<CmsRegulation>(
    "motorsport-regulations",
    {
      populate: "pdfFile",
      filters: {
        ...SITE_SCOPE_FILTERS,
        "filters[program][slug][$eq]": programSlug,
        "filters[isActive][$eq]": "true",
      },
      locale,
      sort: "effectiveDate:desc",
      limit: 20,
      revalidate: 60,
    },
  );

  return (response?.data ?? [])
    .map((entry) => ({
      title: entry.title,
      version: entry.version,
      effectiveDate: formatDate(entry.effectiveDate),
      summary: entry.summary,
      fileHref: mediaUrl(entry.pdfFile?.url) || undefined,
      fileLabel: entry.pdfFile?.alternativeText || "Download regulation PDF",
    }))
    .filter((entry) => Boolean(entry.fileHref));
}

const MERCHANDISE_IMAGE_FALLBACKS: Record<string, string> = {
  "sarga-motorsport-team-tee-preview": "/media/merchandise/sarga-team-tee.jpg",
  "sarga-motorsport-track-cap-preview":
    "/media/merchandise/sarga-track-cap.jpg",
  "sarga-motorsport-apex-jacket": "/media/merchandise/sarga-apex-jacket.jpg",
  "sarga-motorsport-garage-hoodie":
    "/media/merchandise/sarga-garage-hoodie.jpg",
  "sarga-motorsport-pit-lane-mug": "/media/merchandise/sarga-pit-lane-mug.jpg",
  "sarga-motorsport-paddock-backpack":
    "/media/merchandise/sarga-paddock-backpack.jpg",
};

export async function fetchMerchandise(
  locale?: Locale,
): Promise<MerchandiseItem[]> {
  const dedicatedOptions = {
    populate: "image",
    locale,
    sort: "sortOrder:asc",
    limit: 50,
    revalidate: 60,
  };
  const response =
    (await fetchStrapiList<CmsMerchandise>(
      "motorsport-merchandise-items",
      dedicatedOptions,
    )) ??
    (await fetchStrapiList<CmsMerchandise>("merchandise-items", {
      ...dedicatedOptions,
      filters: SITE_SCOPE_FILTERS,
    }));
  return (response?.data ?? [])
    .filter(
      (
        entry,
      ): entry is typeof entry & {
        availabilityStatus: MerchandiseItem["availability"];
      } => entry.availabilityStatus !== "hidden",
    )
    .map((entry, index) => ({
      title: entry.title,
      slug: entry.slug,
      description: entry.description,
      image:
        mediaUrl(entry.image?.url) ||
        MERCHANDISE_IMAGE_FALLBACKS[entry.slug] ||
        (index % 2 === 0
          ? "/media/merchandise/sarga-team-tee.jpg"
          : "/media/merchandise/sarga-track-cap.jpg"),
      imageAlt:
        entry.image?.alternativeText ?? `${entry.title} merchandise preview`,
      priceLabel: entry.priceLabel,
      availability: entry.availabilityStatus,
      href:
        entry.availabilityStatus === "availableExternal"
          ? safeExternalUrl(entry.externalUrl)
          : entry.availabilityStatus === "inquiryOnly"
            ? "/contact"
            : undefined,
    }));
}

export async function fetchLeadership(locale?: Locale): Promise<TeamMember[]> {
  const dedicatedOptions = {
    populate: "portrait",
    locale,
    sort: "order:asc",
    limit: 20,
    revalidate: 600,
  };
  const response =
    (await fetchStrapiList<CmsLeadership>(
      "motorsport-leadership-people",
      dedicatedOptions,
    )) ??
    (await fetchStrapiList<CmsLeadership>("leadership-people", {
      ...dedicatedOptions,
      filters: {
        "filters[siteScope][$in][0]": "motorsport",
        "filters[siteScope][$in][1]": "shared",
      },
    }));
  return (response?.data ?? []).map((entry, index) => ({
    name: entry.name,
    role: entry.role,
    group: entry.group,
    summary: entry.summary,
    portrait:
      mediaUrl(entry.portrait?.url) ||
      (index % 2 === 0
        ? "/media/sarga-motorsport-race-nascar-1.png"
        : "/media/motorcycle-racing-dusk.png"),
    portraitAlt: entry.portrait?.alternativeText ?? entry.name,
  }));
}

export async function fetchEcosystemSites(
  locale?: Locale,
): Promise<EcosystemSite[]> {
  const response = await fetchStrapiList<CmsSite>("sites", {
    populate: "logo",
    filters: { "filters[isActive][$eq]": "true" },
    locale,
    sort: "order:asc",
    limit: 20,
    revalidate: 60,
  });

  const mapped = (response?.data ?? []).map((site) => {
    const href =
      site.themeKey === "gateway"
        ? siteConfig.gatewayUrl
        : site.themeKey === "motorsport"
          ? "/"
          : site.themeKey === "horsesport"
            ? siteConfig.horsesportUrl
            : safeExternalUrl(site.baseUrl) || siteConfig.gatewayUrl;

    return {
      name: site.name,
      slug: site.slug,
      href,
      description: site.description,
      themeKey: site.themeKey,
      logo: site.logo?.url ? mediaUrl(site.logo.url) : undefined,
      logoAlt: site.logo?.alternativeText || site.name,
      external: href.startsWith("http"),
    };
  });

  if (mapped.length > 0) return mapped;

  if (await isStrapiPreviewEnabled()) return [];

  return [
    {
      name: "Sarga.co",
      slug: "sarga-gateway",
      href: siteConfig.gatewayUrl,
      description: "The group gateway and entry point to the Sarga ecosystem.",
      themeKey: "gateway",
      external: true,
    },
    {
      name: "Sarga Motorsport",
      slug: "sarga-motorsport",
      href: "/",
      description: "The dedicated home of Sarga racing programmes and events.",
      themeKey: "motorsport",
      external: false,
    },
    {
      name: "Sarga Horse Sport",
      slug: "sarga-horse-sport",
      href: siteConfig.horsesportUrl,
      description: "The dedicated home of Sarga equestrian sport.",
      themeKey: "horsesport",
      external: true,
    },
  ];
}
