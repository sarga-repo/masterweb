/**
 * Homepage data layer - CMS-first with curated placeholder fallbacks.
 *
 * `fetchHomepageData()` attempts to load live content from the shared Strapi
 * CMS (siteScope = motorsport | shared).  When the API is unreachable or
 * returns no data, the module falls back to `PLACEHOLDER_DATA` so the page
 * always renders with on-brand content.
 */

import type {
  GalleryItem,
  HomepageHeroSlide,
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
  page: {
    heroTitle: string;
    heroDescription: string;
    heroImage?: string;
    heroImageAlt?: string;
    heroSlides: HomepageHeroSlide[];
    sections: {
      events: HomepageSectionCopy;
      news: HomepageSectionCopy;
      gallery: HomepageSectionCopy;
    };
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
  } | null;
};

type HomepageSectionCopy = {
  eyebrow: string;
  title: string;
  description: string;
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
  racingCategory?: string;
  seriesName?: string;
  siteScope?: string;
  coverImage?: StrapiMedia | null;
  heroMedia?: StrapiMedia | null;
  ticketUrl?: string;
  ticketCtaLabel?: string;
  ticketCtas?: Array<CmsTicketCta & { id: number; documentId: string }>;
};

type CmsTicketCta = {
  label: string;
  provider: string;
  url?: string;
};

type CmsArticle = {
  title: string;
  slug: string;
  publishedDate?: string;
  publishedAt?: string;
  excerpt?: string;
  category?: string;
  siteScope?: string;
  coverImage?: StrapiMedia | null;
};

type CmsPartner = {
  name: string;
  websiteUrl?: string;
  logo?: StrapiMedia | null;
};

type CmsGallery = {
  title: string;
  siteScope?: string;
  mediaItems?: StrapiMedia[];
};

type CmsPageSection = {
  sectionKey: string;
  eyebrow?: string;
  title?: string;
  body?: string;
};

type CmsSitePage = {
  heroTitle?: string;
  heroDescription?: string;
  heroMedia?: StrapiMedia | null;
  heroSlides?: CmsHeroSlide[];
  sections?: CmsPageSection[];
};

type CmsHeroSlide = {
  id?: number;
  internalName?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  image?: StrapiMedia | null;
  mobileImage?: StrapiMedia | null;
  imageAlt?: string;
  subjectAnchor?: HomepageHeroSlide["subjectAnchor"];
  ctaLabel?: string;
  ctaUrl?: string;
  isActive?: boolean;
  sortOrder?: number;
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
    ticketHref:
      entry.ticketUrl || entry.ticketCtas?.[0]?.url ? "/tickets" : undefined,
    ticketLabel: entry.ticketCtaLabel ?? entry.ticketCtas?.[0]?.label,
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
    imageAlt: img?.alternativeText ?? `${entry.title} - Sarga Motorsport news`,
    category: entry.category ?? "Motorsport",
    publishedLabel: formatDate(entry.publishedDate ?? entry.publishedAt),
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
    eyebrow: section?.eyebrow || fallback.eyebrow,
    title: section?.title || fallback.title,
    description: section?.body || fallback.description,
  };
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

function mapHeroSlides(slides?: CmsHeroSlide[]): HomepageHeroSlide[] {
  return (slides ?? [])
    .filter(
      (slide) =>
        slide.isActive !== false &&
        slide.image?.url &&
        (!slide.image.mime || slide.image.mime.startsWith("image/")),
    )
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .slice(0, 5)
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

const PLACEHOLDER_PAGE: HomepageData["page"] = {
  heroTitle: "Feel the friction.",
  heroDescription:
    "Indonesia's premier motorsport ecosystem: elite racing, unfiltered energy, and an event experience built for those who live for the apex.",
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
      eyebrow: "Upcoming events",
      title: "The next grid is forming.",
      description:
        "Race weekends, talent programs, and international campaigns-built to put fans closer to the action.",
    },
    news: {
      eyebrow: "Latest news",
      title: "From the paddock.",
      description:
        "Race reports, rider stories, technical detail, and the culture moving Indonesian motorsport forward.",
    },
    gallery: {
      eyebrow: "Gallery",
      title: "Motion, recorded.",
      description:
        "A trackside capture feed from the circuit, paddock, crowd, and machines at full commitment.",
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

export async function fetchHomepageData(): Promise<HomepageData> {
  const [
    pageRes,
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
        "sections",
      ],
      filters: {
        "filters[siteScope][$eq]": "motorsport",
        "filters[pageKind][$eq]": "home",
      },
      limit: 1,
      revalidate: 60,
    }),
    fetchStrapiList<CmsEvent>("events", {
      populate: ["coverImage", "heroMedia", "ticketCtas"],
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
      sort: "publishedDate:desc",
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
        "filters[isActive][$eq]": "true",
      },
      sort: "createdAt:desc",
      limit: 1,
      revalidate: 60,
    }),
  ]);

  /* ---- Page copy ---- */
  const cmsPage = pageRes?.data?.[0];
  const cmsHeroImage =
    cmsPage?.heroMedia &&
    (!cmsPage.heroMedia.mime || cmsPage.heroMedia.mime.startsWith("image/"))
      ? mediaUrl(cmsPage.heroMedia.url)
      : undefined;
  const cmsHeroSlides = mapHeroSlides(cmsPage?.heroSlides);
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
        heroImage: cmsHeroImage || undefined,
        heroImageAlt: cmsPage.heroMedia?.alternativeText || undefined,
        heroSlides:
          cmsHeroSlides.length > 0 ? cmsHeroSlides : [legacyHeroSlide],
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
        },
      }
    : PLACEHOLDER_PAGE;

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
        imageAlt: img.alternativeText ?? `${entry.title} - Sarga Motorsport`,
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
        href: cmsTicket.url ?? "/tickets",
        label: cmsTicket.label ?? "Get tickets",
        eventName: featuredEvent.title,
      }
    : PLACEHOLDER_TICKET_CTA;

  return {
    page,
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
