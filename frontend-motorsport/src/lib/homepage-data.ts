/**
 * Homepage data layer - CMS-first with curated placeholder fallbacks.
 *
 * `fetchHomepageData()` attempts to load live content from the shared Strapi
 * CMS (siteScope = motorsport | shared).  When the API is unreachable or
 * returns no data, the module falls back to `PLACEHOLDER_DATA` so the page
 * always renders with on-brand content.
 */

import type {
  DisciplineItem,
  GalleryItem,
  HomepageHeroSlide,
  MotorsportArticle,
  MotorsportEvent,
  PartnerItem,
} from "@/types/design-system";
import type { Locale } from "@/lib/i18n/config";
import { getRequestLocaleSafe } from "@/lib/i18n/request";
import { resolvePreviewCollection } from "@/lib/preview/content-policy";
import type { CmsPageAvailability } from "@/lib/cms-data";
import {
  isHomepageArticleVisible,
  isHomepageEventVisible,
  isHomepagePartnerVisible,
  orderHomepageArticles,
} from "@/lib/homepage-visibility";

import {
  fetchStrapiList,
  fetchStrapiSingle,
  mediaUrl,
  isStrapiPreviewEnabled,
  type StrapiListResponse,
  type StrapiMedia,
} from "./strapi/client";

/* -------------------------------------------------------------------------- */
/*  Public shape                                                              */
/* -------------------------------------------------------------------------- */

export type HomepageData = {
  page: {
    heroTitle: string;
    heroDescription: string;
    heroEnabled: boolean;
    heroImage?: string;
    heroImageAlt?: string;
    heroSlides: HomepageHeroSlide[];
    pageAvailability?: CmsPageAvailability | null;
    informationBand: HomepageInformationBand;
    worldOfMotorsport: HomepageWorldSection;
    sections: {
      events: HomepageSectionCopy;
      news: HomepageSectionCopy;
      gallery: HomepageSectionCopy;
      connectedRecords: HomepageSectionCopy;
      partners: HomepageSectionCopy;
      newsletter: HomepageSectionCopy;
    };
    showPartnersOnHomepage: boolean;
  };
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
    image?: string;
    mobileImage?: string;
    eyebrow?: string;
    title?: string;
    description?: string;
    eventLabel?: string;
    providerLabel?: string;
    partnerLabel?: string;
    footerText?: string;
  } | null;
};

export type HomepageInformationBand = {
  enabled: boolean;
  showMetricGroup: boolean;
  metrics: Array<{ label: string; value: string }>;
  eyebrow: string;
  title: string;
  description: string;
  nextEventLabel: string;
  ticketStatusLabel: string;
  regionLabel: string;
  regionValue: string;
};

export type HomepageWorldSection = {
  enabled: boolean;
  eyebrow: string;
  titlePrefix: string;
  titleAccent: string;
  description: string;
  ctaLabel: string;
  ctaUrl: string;
  disciplines: DisciplineItem[];
};

type HomepageSectionCopy = {
  enabled: boolean;
  indexLabel: string;
  showIndex: boolean;
  showEyebrow: boolean;
  showTitle: boolean;
  showDescription: boolean;
  showMedia: boolean;
  showCta: boolean;
  eyebrow: string;
  title: string;
  description: string;
  supportLabel?: string;
  supportBody?: string;
  legalText?: string;
  media?: { url: string; alt?: string };
  ctaLabel?: string;
  ctaUrl?: string;
  ctaTarget?: "sameWindow" | "newWindow";
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
  secondaryCtaTarget?: "sameWindow" | "newWindow";
};

/* -------------------------------------------------------------------------- */
/*  Strapi CMS shapes (mirrors cms/src/api schemas)                           */
/* -------------------------------------------------------------------------- */

type CmsEvent = {
  title: string;
  slug: string;
  eventDate?: string;
  endDate?: string;
  venue: string;
  venueAddress?: string;
  eventStatus: string;
  showOnMotorsport?: boolean;
  racingCategory?: string;
  seriesName?: string;
  siteScope?: string;
  coverImage?: StrapiMedia | null;
  heroMedia?: StrapiMedia | null;
  ticketCtas?: Array<CmsTicketCta & { id: number; documentId: string }>;
};

type CmsProgram = {
  title: string;
  slug: string;
  programType?: string;
  programStatus?: string;
  siteScope?: string;
  seasonLabel?: string;
  eventStartDate?: string;
  eventEndDate?: string;
  venue?: string;
  heroMedia?: StrapiMedia | null;
  motorsportPresentation?: {
    hero?: {
      backgroundMedia?: StrapiMedia | null;
    } | null;
  } | null;
  primaryCtaLabel?: string;
  primaryCtaUrl?: string;
  relatedTicketCtas?: CmsTicketCta[];
};

type CmsTicketCta = {
  label: string;
  isActive?: boolean;
  provider?: string;
  providerText?: string;
  ctaLabel?: string;
  ctaType?: "redirect" | "deepLink" | "embed";
  url?: string;
  image?: StrapiMedia | null;
  backgroundImage?: StrapiMedia | null;
  backgroundImageMobile?: StrapiMedia | null;
};

type CmsTicketSection = {
  isActive?: boolean;
  eyebrow?: string;
  title?: string;
  description?: string;
  backgroundImage?: StrapiMedia | null;
  backgroundImageMobile?: StrapiMedia | null;
  eventLabel?: string;
  eventText?: string;
  providerLabel?: string;
  providerText?: string;
  partnerLabel?: string;
  footerText?: string;
  ctaLabel?: string;
  ctaUrl?: string;
};

type CmsArticle = {
  title: string;
  slug: string;
  publishedDate?: string;
  publishedAt?: string;
  excerpt?: string;
  category?: string;
  siteScope?: string;
  showOnMotorsport?: boolean;
  featuredOnMotorsport?: boolean;
  isHotTopic?: boolean;
  coverImage?: StrapiMedia | null;
};

type CmsPartner = {
  name: string;
  websiteUrl?: string;
  logo?: StrapiMedia | null;
  isActive?: boolean;
};

type CmsGallery = {
  title: string;
  siteScope?: string;
  mediaItems?: StrapiMedia[];
};

type CmsPageSection = {
  sectionKey: string;
  isActive?: boolean;
  enabled?: boolean;
  indexLabel?: string;
  showIndex?: boolean;
  showEyebrow?: boolean;
  showTitle?: boolean;
  showBody?: boolean;
  showMedia?: boolean;
  showCta?: boolean;
  supportLabel?: string;
  supportBody?: string;
  legalText?: string;
  eyebrow?: string;
  title?: string;
  body?: string;
  media?: StrapiMedia | null;
  ctaLabel?: string;
  ctaUrl?: string;
  ctaTarget?: "sameWindow" | "newWindow";
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
  secondaryCtaTarget?: "sameWindow" | "newWindow";
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
  theme?: "default" | "dark" | "light" | "accent";
};

type CmsSitePage = {
  showPartnersOnHomepage?: boolean;
  heroTitle?: string;
  heroDescription?: string;
  heroEnabled?: boolean;
  heroMedia?: StrapiMedia | null;
  heroSlides?: CmsHeroSlide[];
  sections?: CmsPageSection[];
  pageAvailability?: CmsPageAvailability | null;
  motorsportFeaturedEvent?: CmsEvent | null;
  motorsportFeaturedProgram?: CmsProgram | null;
  motorsportInformationBand?: CmsInformationBand | null;
  motorsportWorldSection?: CmsWorldSection | null;
  motorsportTicketSection?: CmsTicketSection | null;
  [key: string]: unknown;
};

type CmsHomeSinglePage = {
  showPartnersOnHomepage?: boolean;
  hero?: {
    isActive?: boolean;
    eyebrow?: string;
    title?: string;
    description?: string;
    backgroundAlt?: string;
    backgroundMedia?: StrapiMedia | null;
    mobileBackgroundMedia?: StrapiMedia | null;
  } | null;
  heroSlides?: CmsHeroSlide[];
  informationBand?: CmsInformationBand | null;
  worldSection?: CmsWorldSection | null;
  featuredEvent?: CmsEvent | null;
  featuredProgram?: CmsProgram | null;
  ticketSection?: CmsTicketSection | null;
  pageAvailability?: CmsPageAvailability | null;
  upcomingEventsSection?: CmsPageSection | null;
  latestNewsSection?: CmsPageSection | null;
  connectedRecordsSection?: CmsPageSection | null;
  gallerySection?: CmsPageSection | null;
  partnersSection?: CmsPageSection | null;
  newsletterSection?: CmsPageSection | null;
};

type CmsInformationBand = {
  isActive?: boolean;
  showMetricGroup?: boolean;
  metrics?: Array<{ isActive?: boolean; label?: string; value?: string }>;
  enabled?: boolean;
  eyebrow?: string;
  title?: string;
  description?: string;
  nextEventLabel?: string;
  ticketStatusLabel?: string;
  regionLabel?: string;
  regionValue?: string;
};

type CmsDisciplineCard = {
  id?: number;
  internalName?: string;
  enabled?: boolean;
  title?: string;
  shortLabel?: string;
  image?: StrapiMedia | null;
  imageAlt?: string;
  href?: string;
  accent?: DisciplineItem["accent"];
  sortOrder?: number;
};

type CmsWorldSection = {
  enabled?: boolean;
  eyebrow?: string;
  titlePrefix?: string;
  titleAccent?: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  disciplines?: CmsDisciplineCard[];
};

type CmsHeroSlide = {
  id?: number;
  internalName?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  image?: StrapiMedia | null;
  mobileImage?: StrapiMedia | null;
  video?: CmsHeroVideo | null;
  imageAlt?: string;
  subjectAnchor?: HomepageHeroSlide["subjectAnchor"];
  ctaLabel?: string;
  ctaUrl?: string;
  isActive?: boolean;
  sortOrder?: number;
};

type CmsHeroVideo = {
  enabled?: boolean;
  primaryVideo?: StrapiMedia | null;
  alternateVideo?: StrapiMedia | null;
  posterImage?: StrapiMedia | null;
  mobilePosterImage?: StrapiMedia | null;
};

/* -------------------------------------------------------------------------- */
/*  Mapping helpers                                                           */
/* -------------------------------------------------------------------------- */

function statusMap(raw?: string): MotorsportEvent["status"] {
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

function formatDateRange(start?: string, end?: string): string {
  if (!start) return "TBA";
  if (!end) return formatDate(start);

  try {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const sameMonth =
      startDate.getMonth() === endDate.getMonth() &&
      startDate.getFullYear() === endDate.getFullYear();

    if (sameMonth) {
      return `${startDate.toLocaleDateString("en-GB", { day: "2-digit" })}–${endDate.toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        },
      )}`;
    }
  } catch {
    return formatDate(start);
  }

  return `${formatDate(start)} – ${formatDate(end)}`;
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
    dateLabel: formatDateRange(entry.eventDate, entry.endDate),
    venue: entry.venue ?? "TBA",
    image: mediaUrl(img?.url) || "/media/motorsport-design-hero.png",
    imageAlt: img?.alternativeText ?? `${entry.title} - Sarga Motorsport event`,
    status: statusMap(entry.eventStatus),
    category: entry.racingCategory ?? undefined,
    seriesName: entry.seriesName ?? undefined,
    ticketHref: entry.ticketCtas?.some((ticket) => ticket.isActive !== false)
      ? "/tickets"
      : undefined,
    ticketLabel:
      entry.ticketCtas?.find((ticket) => ticket.isActive !== false)?.ctaLabel ??
      entry.ticketCtas?.find((ticket) => ticket.isActive !== false)?.label,
  };
}

function mapProgramAsEvent(entry: CmsProgram): MotorsportEvent {
  const image =
    entry.motorsportPresentation?.hero?.backgroundMedia ?? entry.heroMedia;
  const ticket = entry.relatedTicketCtas?.find((cta) => cta.url);
  const programTypeLabel = entry.programType
    ?.replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (value) => value.toUpperCase());

  return {
    title: entry.title,
    slug: entry.slug,
    href: `/events/${entry.slug}`,
    dateLabel: formatDateRange(entry.eventStartDate, entry.eventEndDate),
    venue: entry.venue ?? "TBA",
    image: mediaUrl(image?.url) || "/media/sarga-motorsport-bike-and-rally.png",
    imageAlt:
      image?.alternativeText ?? `${entry.title} - Sarga Motorsport program`,
    status: statusMap(entry.programStatus),
    category: programTypeLabel,
    seriesName: entry.seasonLabel,
    ticketHref:
      ticket?.url || entry.primaryCtaUrl === "/tickets"
        ? "/tickets"
        : undefined,
    ticketLabel: ticket?.label ?? entry.primaryCtaLabel,
  };
}

function mapArticle(
  entry: StrapiListResponse<CmsArticle>["data"][number],
): MotorsportArticle & { featuredOnMotorsport?: boolean } {
  const img = entry.coverImage ?? null;
  return {
    title: entry.title ?? "Untitled article",
    href: `/news/${entry.slug ?? entry.documentId}`,
    image: mediaUrl(img?.url) || "/media/motorcycle-racing-dusk.png",
    imageAlt: img?.alternativeText ?? `${entry.title} - Sarga Motorsport news`,
    category: entry.category ?? "Motorsport",
    publishedLabel: formatDate(entry.publishedDate ?? entry.publishedAt),
    excerpt: entry.excerpt ?? undefined,
    featuredOnMotorsport:
      entry.featuredOnMotorsport ?? entry.isHotTopic ?? false,
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
    href: entry.websiteUrl ?? undefined,
  };
}

function sectionCopy(
  sections: CmsPageSection[] | undefined,
  key: string,
  fallback: HomepageSectionCopy,
): HomepageSectionCopy {
  const section = sections?.find((item) => item.sectionKey === key);
  return {
    enabled: section?.enabled !== false,
    indexLabel: section?.indexLabel || fallback.indexLabel,
    showIndex: section?.showIndex !== false,
    showEyebrow: section?.showEyebrow !== false,
    showTitle: section?.showTitle !== false,
    showDescription: section?.showBody !== false,
    showMedia: section?.showMedia !== false,
    showCta: section?.showCta !== false,
    eyebrow: section?.eyebrow || fallback.eyebrow,
    title: section?.title || fallback.title,
    description: section?.body || fallback.description,
    supportLabel: section?.supportLabel,
    supportBody: section?.supportBody,
    media: section?.media
      ? {
          url: mediaUrl(section.media.url),
          alt: section.media.alternativeText,
        }
      : undefined,
    ctaLabel: section?.ctaLabel,
    ctaUrl: safeHomepageHref(section?.ctaUrl, "/events"),
    ctaTarget: section?.ctaTarget ?? "sameWindow",
  };
}

function mapNamedSection(
  section: CmsPageSection | null | undefined,
  sectionKey: string,
): CmsPageSection | null {
  return section
    ? {
        sectionKey,
        isActive: section.isActive,
        enabled: section.isActive !== false,
        indexLabel: section.indexLabel,
        showIndex: section.showIndex,
        showEyebrow: section.showEyebrow,
        showTitle: section.showTitle,
        showBody: section.showBody,
        showMedia: section.showMedia,
        showCta: section.showCta,
        supportLabel: section.supportLabel,
        supportBody: section.supportBody,
        legalText: section.legalText,
        eyebrow: section.eyebrow,
        title: section.title,
        body: section.body,
        media: section.media,
        ctaLabel: section.ctaLabel,
        ctaUrl: section.ctaUrl,
        ctaTarget: section.ctaTarget,
        secondaryCtaLabel: section.secondaryCtaLabel,
        secondaryCtaUrl: section.secondaryCtaUrl,
        secondaryCtaTarget: section.secondaryCtaTarget,
        items: section.items,
        theme: section.theme,
      }
    : null;
}

function safeHeroCtaUrl(value?: string): string | undefined {
  const candidate = value?.trim();
  if (!candidate) return undefined;
  if (candidate.startsWith("/") && !candidate.startsWith("//")) {
    return candidate;
  }

  try {
    const url = new URL(candidate);
    return url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function heroVideoFormat(
  media?: StrapiMedia | null,
): "mp4" | "webm" | undefined {
  const mime = media?.mime?.toLowerCase();
  const url = media?.url?.toLowerCase();
  if (mime === "video/mp4" || url?.endsWith(".mp4")) return "mp4";
  if (mime === "video/webm" || url?.endsWith(".webm")) return "webm";
  return undefined;
}

function mapHeroVideo(video?: CmsHeroVideo | null) {
  if (!video || video.enabled === false) return undefined;
  const mapped: NonNullable<HomepageHeroSlide["video"]> = {
    poster: mediaUrl(video.posterImage?.url) || undefined,
    mobilePoster: mediaUrl(video.mobilePosterImage?.url) || undefined,
  };
  for (const media of [video.primaryVideo, video.alternateVideo]) {
    const format = heroVideoFormat(media);
    const url = mediaUrl(media?.url) || undefined;
    if (format && url && !mapped[format]) mapped[format] = url;
  }
  return mapped.mp4 || mapped.webm ? mapped : undefined;
}

function safeHomepageHref(value: string | undefined, fallback: string) {
  const candidate = value?.trim();
  if (!candidate) return fallback;
  if (candidate.startsWith("/") && !candidate.startsWith("//")) {
    return candidate;
  }
  try {
    const url = new URL(candidate);
    return url.protocol === "https:" ? url.toString() : fallback;
  } catch {
    return fallback;
  }
}

function mapInformationBand(
  band?: CmsInformationBand | null,
): HomepageInformationBand {
  if (!band) return PLACEHOLDER_INFORMATION_BAND;
  const metrics = (band.metrics ?? []).filter(
    (metric) => metric.isActive !== false && metric.label && metric.value,
  );
  const metricValues = metrics.slice(0, 3).map((metric) => ({
    label: metric.label!.trim(),
    value: metric.value!.trim(),
  }));
  return {
    enabled: band.isActive !== false && band.enabled !== false,
    showMetricGroup: band.showMetricGroup !== false,
    metrics: metricValues,
    eyebrow: band.eyebrow?.trim() || PLACEHOLDER_INFORMATION_BAND.eyebrow,
    title: band.title?.trim() || PLACEHOLDER_INFORMATION_BAND.title,
    description:
      band.description?.trim() || PLACEHOLDER_INFORMATION_BAND.description,
    nextEventLabel:
      metricValues[0]?.label ||
      band.nextEventLabel?.trim() ||
      PLACEHOLDER_INFORMATION_BAND.nextEventLabel,
    ticketStatusLabel:
      metricValues[1]?.label ||
      band.ticketStatusLabel?.trim() ||
      PLACEHOLDER_INFORMATION_BAND.ticketStatusLabel,
    regionLabel:
      metricValues[2]?.label ||
      band.regionLabel?.trim() ||
      PLACEHOLDER_INFORMATION_BAND.regionLabel,
    regionValue:
      metricValues[2]?.value ||
      band.regionValue?.trim() ||
      PLACEHOLDER_INFORMATION_BAND.regionValue,
  };
}

function mapWorldSection(
  section?: CmsWorldSection | null,
  isPreview = false,
): HomepageWorldSection {
  if (!section) return PLACEHOLDER_WORLD_SECTION;

  const fallbackByName = new Map(
    PLACEHOLDER_DISCIPLINES.map((item) => [item.internalName, item]),
  );
  const disciplines = (section.disciplines ?? [])
    .filter((item) => item.enabled !== false)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .slice(0, 6)
    .map((item, index): DisciplineItem => {
      const fallback =
        fallbackByName.get(item.internalName ?? "") ??
        PLACEHOLDER_DISCIPLINES[index] ??
        PLACEHOLDER_DISCIPLINES[0];
      return {
        title: item.title?.trim() || fallback.title,
        shortLabel: item.shortLabel?.trim() || fallback.shortLabel,
        href: safeHomepageHref(item.href, fallback.href),
        image: mediaUrl(item.image?.url) || fallback.image,
        imageAlt:
          item.imageAlt?.trim() ||
          item.image?.alternativeText ||
          fallback.imageAlt,
        accent: item.accent ?? fallback.accent,
      };
    });

  return {
    enabled: section.enabled !== false,
    eyebrow: section.eyebrow?.trim() || PLACEHOLDER_WORLD_SECTION.eyebrow,
    titlePrefix:
      section.titlePrefix?.trim() || PLACEHOLDER_WORLD_SECTION.titlePrefix,
    titleAccent:
      section.titleAccent?.trim() || PLACEHOLDER_WORLD_SECTION.titleAccent,
    description:
      section.description?.trim() || PLACEHOLDER_WORLD_SECTION.description,
    ctaLabel: section.ctaLabel?.trim() || PLACEHOLDER_WORLD_SECTION.ctaLabel,
    ctaUrl: safeHomepageHref(section.ctaUrl, PLACEHOLDER_WORLD_SECTION.ctaUrl),
    disciplines:
      disciplines.length > 0 || isPreview
        ? disciplines
        : PLACEHOLDER_WORLD_SECTION.disciplines,
  };
}

function mapHeroSlides(slides?: CmsHeroSlide[]): HomepageHeroSlide[] {
  return (slides ?? [])
    .filter(
      (slide) =>
        slide.isActive !== false &&
        slide.image?.url &&
        (!slide.image.mime || slide.image.mime.startsWith("image/")),
    )
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .slice(0, 3)
    .map((slide, index) => {
      const mobileImage =
        slide.mobileImage?.url &&
        (!slide.mobileImage.mime || slide.mobileImage.mime.startsWith("image/"))
          ? mediaUrl(slide.mobileImage.url)
          : undefined;
      const safeCtaUrl = safeHeroCtaUrl(slide.ctaUrl);
      const cta =
        slide.ctaLabel && safeCtaUrl
          ? {
              label: slide.ctaLabel,
              href: safeCtaUrl,
              external: safeCtaUrl.startsWith("https://"),
            }
          : undefined;

      return {
        id: `cms-hero-${slide.id ?? index}`,
        eyebrow: slide.eyebrow,
        title: slide.title,
        description: slide.description,
        image: mediaUrl(slide.image?.url),
        mobileImage,
        video: mapHeroVideo(slide.video),
        imageAlt:
          slide.imageAlt ||
          slide.image?.alternativeText ||
          `${slide.title} - Sarga Motorsport`,
        subjectAnchor: slide.subjectAnchor ?? "center",
        cta,
      };
    });
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
      "Inside the cockpit of Sarga's opening race weekend - a masterclass in pressure, precision, and the fine art of going fast.",
  },
  {
    title: "Riders rewrite the racing line",
    href: "/news/riders-rewrite-the-racing-line",
    image: "/media/motorcycle-racing-dusk.png",
    imageAlt: "Superbike race pack cornering under circuit lights at dusk",
    category: "Motorcycle Racing",
    publishedLabel: "28 Jun 2026",
    excerpt:
      "How Indonesia's fastest riders are reshaping the sport - one apex at a time.",
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
      "From track to grandstand to livestream - how Sarga is engineering an entire motorsport experience.",
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
    image: "/media/sarga-motorsport-bike-and-rally.png",
    imageAlt: "Rally car and motorcycle racers in a kinetic split composition",
    eyebrow: "Mixed discipline / Rally",
    caption: "Every surface is a stage",
  },
  {
    id: "g4",
    image: "/media/sarga-motorsport-motorbike-race.png",
    imageAlt: "Motorcycle racers accelerating through a packed circuit",
    eyebrow: "Two wheels / Moto2",
    caption: "Apex precision",
  },
  {
    id: "g5",
    image: "/media/sarga-motorsport-race-nascar-1.png",
    imageAlt: "Touring cars racing side by side under circuit lights",
    eyebrow: "Four wheels / Touring",
    caption: "Closer at every corner",
  },
  {
    id: "g6",
    image: "/media/sarga-motorsport-race-nascar-2.png",
    imageAlt: "Race cars fighting for position in a high-speed pack",
    eyebrow: "Race weekend / Grid",
    caption: "Pressure in formation",
  },
];

const PLACEHOLDER_DISCIPLINES: Array<
  DisciplineItem & { internalName: string; sortOrder: number }
> = [
  {
    internalName: "circuit-racing",
    title: "Circuit racing",
    shortLabel: "Open wheel / Sprint",
    href: "/events",
    image: "/media/hero/sarga-motorsport-hero-circuit-golden-hour.jpg",
    imageAlt:
      "Red touring race car accelerating through a tropical circuit at golden hour",
    accent: "crimson",
    sortOrder: 10,
  },
  {
    internalName: "endurance",
    title: "Endurance",
    shortLabel: "GT / Long distance",
    href: "/events",
    image: "/media/sarga-motorsport-discipline-endurance-daylight.jpg",
    imageAlt:
      "Red endurance prototype racing through a tropical circuit in warm daylight",
    accent: "blue",
    sortOrder: 20,
  },
  {
    internalName: "rally",
    title: "Rally",
    shortLabel: "Mixed surface / Stage",
    href: "/events",
    image: "/media/hero/sarga-motorsport-hero-rally-highlands.jpg",
    imageAlt:
      "Red rally car racing across a sunlit gravel road in tropical highlands",
    accent: "teal",
    sortOrder: 30,
  },
  {
    internalName: "rallycross",
    title: "Rallycross",
    shortLabel: "FIA / World Cup",
    href: "/events/fia-rallycross-world-cup-indonesia-2026",
    image: "/media/sarga-motorsport-discipline-rallycross-daylight.jpg",
    imageAlt:
      "Red and warm-white rallycross cars racing side by side on a tropical dirt circuit",
    accent: "orange",
    sortOrder: 40,
  },
  {
    internalName: "touring",
    title: "Touring",
    shortLabel: "Tin top / Sprint",
    href: "/events",
    image: "/media/sarga-motorsport-discipline-touring-daylight.jpg",
    imageAlt:
      "Three touring cars sweeping through a tropical circuit in warm daylight",
    accent: "blue",
    sortOrder: 50,
  },
  {
    internalName: "motorcycle",
    title: "Motorcycle",
    shortLabel: "Superbike / Road racing",
    href: "/events",
    image: "/media/sarga-motorsport-discipline-motorcycle-daylight.jpg",
    imageAlt:
      "Two superbike racers leaning through a tropical circuit corner in warm daylight",
    accent: "yellow",
    sortOrder: 60,
  },
];

const PLACEHOLDER_INFORMATION_BAND: HomepageInformationBand = {
  enabled: true,
  showMetricGroup: true,
  metrics: [
    { label: "Next event", value: "TBA" },
    { label: "Ticket status", value: "Pending" },
    { label: "Region", value: "Indonesia" },
  ],
  eyebrow: "Race control / 2026 calendar",
  title: "Closer to the machines. Closer to the moment.",
  description:
    "Professional racing, talent development, and international event campaigns-presented through one focused Motorsport calendar.",
  nextEventLabel: "Next event",
  ticketStatusLabel: "Ticket status",
  regionLabel: "Region",
  regionValue: "Indonesia",
};

const PLACEHOLDER_WORLD_SECTION: HomepageWorldSection = {
  enabled: true,
  eyebrow: "A global ecosystem of racing formats",
  titlePrefix: "The world of",
  titleAccent: "Motorsport",
  description:
    "From circuit precision to mixed-surface spectacle, every format is part of one international-standard racing programme.",
  ctaLabel: "Explore the calendar",
  ctaUrl: "/events",
  disciplines: PLACEHOLDER_DISCIPLINES,
};

const PLACEHOLDER_PAGE: HomepageData["page"] = {
  heroTitle: "Feel the friction.",
  heroEnabled: true,
  heroDescription:
    "Indonesia's premier motorsport ecosystem: elite racing, unfiltered energy, and an event experience built for those who live for the apex.",
  informationBand: PLACEHOLDER_INFORMATION_BAND,
  worldOfMotorsport: PLACEHOLDER_WORLD_SECTION,
  showPartnersOnHomepage: true,
  heroSlides: [
    {
      id: "circuit-golden-hour",
      eyebrow: "Sarga Motorsport / Season 2026",
      title: "Feel the friction.",
      description:
        "World-class competition, human precision, and race weekends built to bring Indonesia closer to the action.",
      image: "/media/hero/sarga-motorsport-hero-circuit-golden-hour.jpg",
      mobileImage:
        "/media/hero/sarga-motorsport-hero-circuit-golden-hour-mobile.jpg",
      imageAlt:
        "Red and orange touring race car accelerating through a tropical circuit at golden hour",
      subjectAnchor: "right",
      cta: { label: "Explore events", href: "/events" },
    },
    {
      id: "rally-highlands",
      eyebrow: "Rally / Beyond the circuit",
      title: "Every surface is a stage.",
      description:
        "From highland gravel to the racing line, Sarga Motorsport follows competition wherever it comes alive.",
      image: "/media/hero/sarga-motorsport-hero-rally-highlands.jpg",
      mobileImage:
        "/media/hero/sarga-motorsport-hero-rally-highlands-mobile.jpg",
      imageAlt:
        "Red rally car racing across a sunlit gravel road in tropical highlands",
      subjectAnchor: "left",
      cta: { label: "See the programmes", href: "/events" },
    },
    {
      id: "paddock-ready",
      eyebrow: "Paddock / People and precision",
      title: "Built before the lights go out.",
      description:
        "Drivers, crews, and disciplined preparation turn a race weekend into a world-class stage.",
      image: "/media/hero/sarga-motorsport-hero-paddock-ready.jpg",
      mobileImage: "/media/hero/sarga-motorsport-hero-paddock-ready-mobile.jpg",
      imageAlt:
        "Helmeted racing driver and pit crew preparing a red touring car in a warm daylight paddock",
      subjectAnchor: "right",
      cta: { label: "Meet Sarga Motorsport", href: "/about" },
    },
  ],
  sections: {
    events: {
      enabled: false,
      indexLabel: "EVENTS",
      showIndex: true,
      showEyebrow: true,
      showTitle: true,
      showDescription: true,
      showMedia: true,
      showCta: true,
      eyebrow: "Upcoming events",
      title: "The next grid is forming.",
      description:
        "Race weekends, talent programs, and international campaigns-built to put fans closer to the action.",
    },
    news: {
      enabled: true,
      indexLabel: "NEWS",
      showIndex: true,
      showEyebrow: true,
      showTitle: true,
      showDescription: true,
      showMedia: true,
      showCta: true,
      eyebrow: "Latest news",
      title: "From the paddock.",
      description:
        "Race reports, rider stories, technical detail, and the culture moving Indonesian motorsport forward.",
    },
    gallery: {
      enabled: true,
      indexLabel: "GALLERY",
      showIndex: true,
      showEyebrow: true,
      showTitle: true,
      showDescription: true,
      showMedia: true,
      showCta: true,
      eyebrow: "Gallery",
      title: "Motion, recorded.",
      description:
        "A trackside capture feed from the circuit, paddock, crowd, and machines at full commitment.",
    },
    connectedRecords: {
      enabled: false,
      indexLabel: "CONNECTED",
      showIndex: true,
      showEyebrow: true,
      showTitle: true,
      showDescription: true,
      showMedia: true,
      showCta: true,
      eyebrow: "Part of Sarga.co / Connected records",
      title: "Explore the Sarga network.",
      description:
        "Browse published stories, meet the leadership council, and move directly between the active Sarga websites.",
    },
    partners: {
      enabled: true,
      indexLabel: "PARTNERS",
      showIndex: false,
      showEyebrow: true,
      showTitle: true,
      showDescription: false,
      showMedia: false,
      showCta: false,
      eyebrow: "Official partners & sponsors",
      title: "Official partners & sponsors",
      description: "",
    },
    newsletter: {
      enabled: true,
      indexLabel: "NEWSLETTER",
      showIndex: false,
      showEyebrow: true,
      showTitle: true,
      showDescription: true,
      showMedia: false,
      showCta: true,
      eyebrow: "Stay in the race",
      title: "Never miss lights-out.",
      description:
        "Get race weekend alerts, ticket drops, and exclusive paddock stories delivered to your inbox. No spam—just velocity.",
      ctaLabel: "Subscribe to updates",
      ctaUrl: "/contact",
    },
  },
};

const PLACEHOLDER_PARTNERS: PartnerItem[] = [
  {
    name: "Sarga Motorsport",
    logo: "/brand/logo-sarga-motorsport-symbol-sport.png",
  },
  {
    name: "Sarga - parent group",
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

export async function fetchHomepageData(
  locale?: Locale,
): Promise<HomepageData> {
  const requestLocale = locale ?? (await getRequestLocaleSafe());
  const isPreview = await isStrapiPreviewEnabled();
  const [
    pageRes,
    homeSingleRes,
    eventsRes,
    articlesRes,
    partnersRes,
    galleriesRes,
    ticketRes,
  ] = await Promise.all([
    fetchStrapiList<CmsSitePage>("site-pages", {
      populate: [
        "heroMedia",
        "heroSlides.image",
        "heroSlides.mobileImage",
        "heroSlides.video",
        "heroSlides.video.primaryVideo",
        "heroSlides.video.alternateVideo",
        "heroSlides.video.posterImage",
        "heroSlides.video.mobilePosterImage",
        "motorsportFeaturedEvent.coverImage",
        "motorsportFeaturedEvent.heroMedia",
        "motorsportFeaturedEvent.ticketCtas",
        "motorsportInformationBand",
        "motorsportWorldSection.disciplines.image",
        "motorsportTicketSection.backgroundImage",
        "motorsportTicketSection.backgroundImageMobile",
        "pageAvailability.comingSoonMedia",
        "sections",
      ],
      filters: {
        "filters[siteScope][$eq]": "motorsport",
        "filters[pageKind][$eq]": "home",
      },
      locale: requestLocale,
      limit: 1,
      revalidate: 60,
    }),
    fetchStrapiSingle<CmsHomeSinglePage>("motorsport-home-page", {
      populate: [
        "heroSlides.image",
        "heroSlides.mobileImage",
        "heroSlides.video.primaryVideo",
        "heroSlides.video.alternateVideo",
        "heroSlides.video.posterImage",
        "heroSlides.video.mobilePosterImage",
        "hero.backgroundMedia",
        "hero.mobileBackgroundMedia",
        "informationBand.metrics",
        "worldSection.disciplines.image",
        "featuredEvent.coverImage",
        "featuredEvent.heroMedia",
        "featuredEvent.ticketCtas",
        "featuredProgram.heroMedia",
        "featuredProgram.motorsportPresentation.hero.backgroundMedia",
        "featuredProgram.relatedTicketCtas",
        "ticketSection.backgroundImage",
        "ticketSection.backgroundImageMobile",
        "upcomingEventsSection.media",
        "latestNewsSection.media",
        "connectedRecordsSection.media",
        "gallerySection.media",
        "partnersSection.media",
        "newsletterSection.media",
        "pageAvailability.comingSoonMedia",
        "seo.ogImage",
      ],
      locale: requestLocale,
      revalidate: 0,
    }),
    fetchStrapiList<CmsEvent>("motorsport-events", {
      populate: [
        "coverImage",
        "heroMedia",
        "ticketCtas",
        "ticketCtas.image",
        "ticketCtas.backgroundImage",
        "ticketCtas.backgroundImageMobile",
      ],
      locale: requestLocale,
      sort: "eventDate:asc",
      limit: 8,
      revalidate: 60,
    }),
    fetchStrapiList<CmsArticle>("motorsport-news-articles", {
      populate: "coverImage",
      locale: requestLocale,
      sort: "publishedDate:desc",
      limit: 6,
      revalidate: 60,
    }),
    fetchStrapiList<CmsPartner>("motorsport-partners", {
      populate: "logo",
      locale: requestLocale,
      sort: "sortOrder:asc",
      limit: 10,
      revalidate: 0,
    }),
    fetchStrapiList<CmsGallery>("media-galleries", {
      populate: "mediaItems",
      filters: {
        "filters[siteScope][$in][0]": "motorsport",
        "filters[siteScope][$in][1]": "shared",
      },
      locale: requestLocale,
      limit: 4,
      revalidate: 600,
    }),
    fetchStrapiList<CmsTicketCta>("motorsport-ticket-ctas", {
      populate: ["image", "backgroundImage", "backgroundImageMobile"],
      filters: { "filters[isActive][$eq]": "true" },
      locale: requestLocale,
      sort: "createdAt:desc",
      limit: 1,
      revalidate: 60,
    }),
  ]);

  const singlePage = homeSingleRes?.data;
  const singleHeroSlides = mapHeroSlides(singlePage?.heroSlides);
  const primaryHero = singlePage?.hero;
  const singleHeroCopy =
    primaryHero?.title?.trim() || primaryHero?.description?.trim();
  const singleHeroSlide =
    primaryHero && singleHeroCopy
      ? {
          ...(singleHeroSlides[0] ?? PLACEHOLDER_PAGE.heroSlides[0]),
          id: "motorsport-home-primary-hero",
          eyebrow:
            primaryHero.eyebrow?.trim() ||
            singleHeroSlides[0]?.eyebrow ||
            undefined,
          title:
            primaryHero.title?.trim() ||
            singleHeroSlides[0]?.title ||
            PLACEHOLDER_PAGE.heroTitle,
          description:
            primaryHero.description?.trim() ||
            singleHeroSlides[0]?.description ||
            PLACEHOLDER_PAGE.heroDescription,
          image:
            mediaUrl(primaryHero.backgroundMedia?.url) ||
            singleHeroSlides[0]?.image ||
            PLACEHOLDER_PAGE.heroSlides[0].image,
          mobileImage:
            mediaUrl(primaryHero.mobileBackgroundMedia?.url) ||
            singleHeroSlides[0]?.mobileImage,
          imageAlt:
            primaryHero.backgroundAlt?.trim() ||
            singleHeroSlides[0]?.imageAlt ||
            PLACEHOLDER_PAGE.heroSlides[0].imageAlt,
        }
      : null;
  const singleCmsPage = singlePage
    ? {
        heroTitle: primaryHero?.title,
        heroDescription: primaryHero?.description,
        heroEnabled: primaryHero?.isActive,
        heroMedia: primaryHero?.backgroundMedia,
        heroSlides: singlePage.heroSlides,
        showPartnersOnHomepage: singlePage.showPartnersOnHomepage,
        motorsportFeaturedEvent: singlePage.featuredEvent,
        motorsportFeaturedProgram: singlePage.featuredProgram,
        motorsportInformationBand: singlePage.informationBand,
        motorsportWorldSection: singlePage.worldSection,
        motorsportTicketSection: singlePage.ticketSection,
        pageAvailability: singlePage.pageAvailability,
        sections: [
          mapNamedSection(singlePage.upcomingEventsSection, "upcoming-events"),
          mapNamedSection(singlePage.latestNewsSection, "latest-news"),
          mapNamedSection(
            singlePage.connectedRecordsSection,
            "connected-records",
          ),
          mapNamedSection(singlePage.gallerySection, "gallery"),
          mapNamedSection(singlePage.partnersSection, "partners"),
          mapNamedSection(singlePage.newsletterSection, "newsletter"),
        ].filter((section): section is CmsPageSection => section !== null),
      }
    : undefined;
  const cmsPage = singleCmsPage ?? pageRes?.data?.[0];
  const cmsHeroImage =
    cmsPage?.heroMedia &&
    (!cmsPage.heroMedia.mime || cmsPage.heroMedia.mime.startsWith("image/"))
      ? mediaUrl(cmsPage.heroMedia.url)
      : undefined;
  const cmsHeroSlides = singlePage
    ? singleHeroSlide
      ? [singleHeroSlide, ...singleHeroSlides.slice(1)]
      : singleHeroSlides
    : mapHeroSlides(cmsPage?.heroSlides);
  const legacyHeroSlide: HomepageHeroSlide = {
    ...PLACEHOLDER_PAGE.heroSlides[0],
    id: "legacy-home-hero",
    title: cmsPage?.heroTitle || PLACEHOLDER_PAGE.heroTitle,
    description: cmsPage?.heroDescription || PLACEHOLDER_PAGE.heroDescription,
    image: cmsHeroImage || PLACEHOLDER_PAGE.heroSlides[0].image,
    mobileImage: cmsHeroImage
      ? undefined
      : PLACEHOLDER_PAGE.heroSlides[0].mobileImage,
    imageAlt:
      cmsPage?.heroMedia?.alternativeText ||
      PLACEHOLDER_PAGE.heroSlides[0].imageAlt,
  };
  const page: HomepageData["page"] = cmsPage
    ? {
        heroTitle: cmsPage.heroTitle || PLACEHOLDER_PAGE.heroTitle,
        heroDescription:
          cmsPage.heroDescription || PLACEHOLDER_PAGE.heroDescription,
        heroEnabled: cmsPage.heroEnabled !== false,
        heroImage: cmsHeroImage || undefined,
        heroImageAlt: cmsPage.heroMedia?.alternativeText || undefined,
        heroSlides:
          cmsHeroSlides.length > 0 ? cmsHeroSlides : [legacyHeroSlide],
        pageAvailability: cmsPage.pageAvailability
          ? {
              ...cmsPage.pageAvailability,
              comingSoonMedia: cmsPage.pageAvailability.comingSoonMedia
                ? {
                    ...cmsPage.pageAvailability.comingSoonMedia,
                    url: mediaUrl(cmsPage.pageAvailability.comingSoonMedia.url),
                  }
                : null,
            }
          : null,
        informationBand: mapInformationBand(cmsPage.motorsportInformationBand),
        worldOfMotorsport: mapWorldSection(
          cmsPage.motorsportWorldSection,
          isPreview,
        ),
        sections: {
          events: sectionCopy(
            cmsPage.sections,
            "upcoming-events",
            PLACEHOLDER_PAGE.sections.events,
          ),
          news: sectionCopy(
            cmsPage.sections,
            "latest-news",
            PLACEHOLDER_PAGE.sections.news,
          ),
          gallery: sectionCopy(
            cmsPage.sections,
            "gallery",
            PLACEHOLDER_PAGE.sections.gallery,
          ),
          connectedRecords: sectionCopy(
            cmsPage.sections,
            "connected-records",
            PLACEHOLDER_PAGE.sections.connectedRecords,
          ),
          partners: sectionCopy(
            cmsPage.sections,
            "partners",
            PLACEHOLDER_PAGE.sections.partners,
          ),
          newsletter: sectionCopy(
            cmsPage.sections,
            "newsletter",
            PLACEHOLDER_PAGE.sections.newsletter,
          ),
        },
        showPartnersOnHomepage:
          cmsPage.sections?.find((section) => section.sectionKey === "partners")
            ?.enabled ?? cmsPage.showPartnersOnHomepage !== false,
      }
    : PLACEHOLDER_PAGE;

  /* ---- Events ---- */
  const cmsEvents = resolvePreviewCollection(eventsRes?.data, [], isPreview)
    .filter(isHomepageEventVisible)
    .map(mapEvent);
  const manuallyFeaturedEvent =
    cmsPage?.motorsportFeaturedEvent &&
    ["motorsport", "shared", undefined].includes(
      cmsPage.motorsportFeaturedEvent.siteScope,
    ) &&
    cmsPage.motorsportFeaturedEvent.eventStatus !== "hidden" &&
    cmsPage.motorsportFeaturedEvent.showOnMotorsport !== false
      ? mapEvent({
          ...cmsPage.motorsportFeaturedEvent,
          id: 0,
          documentId: "motorsport-home-featured-event",
        })
      : undefined;
  const manuallyFeaturedProgram =
    cmsPage?.motorsportFeaturedProgram &&
    ["motorsport", "shared", undefined].includes(
      cmsPage.motorsportFeaturedProgram.siteScope,
    ) &&
    cmsPage.motorsportFeaturedProgram.programStatus !== "hidden"
      ? mapProgramAsEvent(cmsPage.motorsportFeaturedProgram)
      : undefined;
  const featuredEvent =
    manuallyFeaturedProgram ??
    manuallyFeaturedEvent ??
    cmsEvents.find((e) => e.status === "tickets-open") ??
    cmsEvents[0] ??
    (isPreview ? null : PLACEHOLDER_EVENT);
  const upcomingEvents =
    cmsEvents.length >= 2
      ? cmsEvents.filter((e) => e.href !== featuredEvent?.href).slice(0, 4)
      : isPreview
        ? cmsEvents.filter((e) => e.href !== featuredEvent?.href).slice(0, 4)
        : PLACEHOLDER_EVENTS;

  /* ---- Articles ---- */
  const cmsArticles = resolvePreviewCollection(articlesRes?.data, [], isPreview)
    .filter(isHomepageArticleVisible)
    .map(mapArticle);
  const orderedArticles = orderHomepageArticles(cmsArticles);
  const [featuredArticle, ...restArticles] = resolvePreviewCollection(
    orderedArticles,
    PLACEHOLDER_ARTICLES,
    isPreview,
  );

  /* ---- Partners ---- */
  const cmsPartners = resolvePreviewCollection(partnersRes?.data, [], isPreview)
    .filter(isHomepagePartnerVisible)
    .map(mapPartner);
  const partners = resolvePreviewCollection(
    cmsPartners,
    PLACEHOLDER_PARTNERS,
    isPreview,
  );

  /* ---- Gallery ---- */
  const cmsGallery: GalleryItem[] = resolvePreviewCollection(
    galleriesRes?.data,
    [],
    isPreview,
  ).flatMap((entry) =>
    (entry.mediaItems ?? []).map((img, i) => ({
      id: `cms-${entry.id}-${i}`,
      image: mediaUrl(img.url),
      imageAlt: img.alternativeText ?? `${entry.title} - Sarga Motorsport`,
      eyebrow: entry.title,
    })),
  );
  const gallery =
    cmsGallery.length > 0 || isPreview
      ? cmsGallery.slice(0, 6)
      : PLACEHOLDER_GALLERY;

  /* ---- Ticket CTA ---- */
  const cmsTicket = ticketRes?.data?.[0];
  const ticketSection = cmsPage?.motorsportTicketSection;
  const ticketCta = ticketSection
    ? ticketSection.isActive === false
      ? null
      : {
          provider:
            ticketSection.providerText ||
            cmsTicket?.providerText ||
            cmsTicket?.provider ||
            "Official ticketing partner",
          href: safeHomepageHref(
            ticketSection.ctaUrl || cmsTicket?.url,
            "/tickets",
          ),
          label:
            ticketSection.ctaLabel ||
            cmsTicket?.ctaLabel ||
            cmsTicket?.label ||
            "Secure your seat",
          eventName: ticketSection.eventText || featuredEvent.title,
          image:
            mediaUrl(ticketSection.backgroundImage?.url) ||
            mediaUrl(cmsTicket?.backgroundImage?.url) ||
            mediaUrl(cmsTicket?.image?.url) ||
            undefined,
          mobileImage:
            mediaUrl(ticketSection.backgroundImageMobile?.url) ||
            mediaUrl(ticketSection.backgroundImage?.url) ||
            mediaUrl(cmsTicket?.backgroundImageMobile?.url) ||
            mediaUrl(cmsTicket?.backgroundImage?.url) ||
            mediaUrl(cmsTicket?.image?.url) ||
            undefined,
          eyebrow: ticketSection.eyebrow || "Official ticketing",
          title: ticketSection.title || "Be there when the grid goes live.",
          description: ticketSection.description,
          eventLabel: ticketSection.eventLabel || "Event",
          providerLabel: ticketSection.providerLabel || "Provider",
          partnerLabel:
            ticketSection.partnerLabel || "Partner redirect / Secure",
          footerText: ticketSection.footerText,
        }
    : cmsTicket
      ? {
          provider:
            cmsTicket.providerText ||
            cmsTicket.provider ||
            "Official ticketing partner",
          href: safeHomepageHref(cmsTicket.url, "/tickets"),
          label: cmsTicket.ctaLabel || cmsTicket.label || "Get tickets",
          eventName: featuredEvent.title,
          image:
            mediaUrl(cmsTicket.backgroundImage?.url) ||
            mediaUrl(cmsTicket.image?.url) ||
            undefined,
          mobileImage:
            mediaUrl(cmsTicket.backgroundImageMobile?.url) ||
            mediaUrl(cmsTicket.backgroundImage?.url) ||
            mediaUrl(cmsTicket.image?.url) ||
            undefined,
        }
      : isPreview
        ? null
        : PLACEHOLDER_TICKET_CTA;

  return {
    page,
    featuredEvent,
    upcomingEvents,
    featuredArticle: featuredArticle ?? null,
    articles:
      isPreview || restArticles.length > 0
        ? restArticles
        : PLACEHOLDER_ARTICLES.slice(1),
    gallery,
    partners,
    ticketCta,
  };
}
