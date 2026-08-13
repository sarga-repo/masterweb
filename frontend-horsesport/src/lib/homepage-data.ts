/**
 * Horse Sport homepage data - CMS-first with curated placeholder fallbacks.
 *
 * Loads live content from the shared Strapi CMS scoped to Horse Sport
 * (siteScope = horsesport | shared, primary business = sarga-horse-sport). When
 * the API is unreachable or empty, on-brand placeholders keep the page premium.
 */

import "server-only";

import {
  fetchStrapiList,
  mediaUrl,
  type StrapiListResponse,
  type StrapiMedia,
} from "./strapi/client";
import type {
  ArticleCardData,
  EventCardData,
  GalleryItemData,
  PartnerItemData,
} from "@/types/design-system";

export type HomepageData = {
  hero: {
    image: string;
    mobileImage?: string;
    imageAlt: string;
    video?: {
      mp4?: string;
      webm?: string;
      poster?: string;
    };
  };
  featuredEvent: EventCardData | null;
  upcomingEvents: EventCardData[];
  seasonEvents: EventCardData[];
  ticketCta: {
    provider?: string;
    href: string;
    label: string;
    eventName?: string;
    external: boolean;
  } | null;
  featuredArticle: ArticleCardData | null;
  articles: ArticleCardData[];
  gallery: GalleryItemData[];
  partners: PartnerItemData[];
  about: { title: string; body: string };
};

/* -------------------------------------------------------------------------- */
/*  CMS shapes                                                                */
/* -------------------------------------------------------------------------- */

type CmsEvent = {
  title: string;
  slug: string;
  eventDate?: string;
  venue?: string;
  eventStatus?: string;
  eventDiscipline?: string;
  coverImage?: StrapiMedia | null;
  heroMedia?: StrapiMedia | null;
};

type CmsArticle = {
  title: string;
  slug: string;
  publishedDate?: string;
  excerpt?: string;
  category?: string;
  coverImage?: StrapiMedia | null;
};

type CmsPartner = {
  name: string;
  websiteUrl?: string;
  logo?: StrapiMedia | null;
};
type CmsGallery = {
  title: string;
  category?: string;
  coverImage?: StrapiMedia | null;
  mediaItems?: StrapiMedia[];
};
type CmsTicketCta = {
  title: string;
  label: string;
  provider?: string;
  url?: string;
  ctaType?: string;
};
type CmsBusiness = { overview?: string; shortDescription?: string };
type CmsHeroVideo = {
  enabled?: boolean;
  primaryVideo?: StrapiMedia | null;
  alternateVideo?: StrapiMedia | null;
  posterImage?: StrapiMedia | null;
  mobilePosterImage?: StrapiMedia | null;
};
type CmsSitePage = {
  heroTitle?: string;
  heroDescription?: string;
  heroMedia?: StrapiMedia | null;
  heroVideo?: CmsHeroVideo | null;
  sections?: Array<{ sectionKey: string; title?: string; body?: string }>;
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
  if (!raw) return undefined;
  return STATUS_LABELS[raw] ?? raw;
}

function titleCase(raw?: string): string | undefined {
  if (!raw) return undefined;
  return raw.charAt(0).toUpperCase() + raw.slice(1);
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
  const mapped: NonNullable<HomepageData["hero"]["video"]> = {
    poster: mediaUrl(video.posterImage?.url) || undefined,
  };
  for (const media of [video.primaryVideo, video.alternateVideo]) {
    const format = heroVideoFormat(media);
    const url = mediaUrl(media?.url) || undefined;
    if (format && url && !mapped[format]) mapped[format] = url;
  }
  return mapped.mp4 || mapped.webm ? mapped : undefined;
}

/* -------------------------------------------------------------------------- */
/*  Mapping                                                                   */
/* -------------------------------------------------------------------------- */

function mapEvent(
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

function mapArticle(
  entry: StrapiListResponse<CmsArticle>["data"][number],
): ArticleCardData {
  const img = entry.coverImage ?? null;
  return {
    title: entry.title ?? "Untitled article",
    href: `/news/${entry.slug ?? entry.documentId}`,
    category: titleCase(entry.category?.replace(/-/g, " ")),
    dateLabel: formatDate(entry.publishedDate),
    excerpt: entry.excerpt ?? undefined,
    image: mediaUrl(img?.url) || undefined,
    imageAlt: img?.alternativeText ?? `${entry.title} - Sarga Horse Sport`,
  };
}

function mapPartner(
  entry: StrapiListResponse<CmsPartner>["data"][number],
): PartnerItemData {
  return {
    name: entry.name ?? "Partner",
    logo: mediaUrl(entry.logo?.url) || undefined,
    href: entry.websiteUrl ?? undefined,
  };
}

/* -------------------------------------------------------------------------- */
/*  Placeholders                                                              */
/* -------------------------------------------------------------------------- */

const PLACEHOLDER_EVENTS: EventCardData[] = [
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
  {
    title: "Royal Turf Sprint Invitational",
    href: "/events/royal-turf-sprint-invitational",
    dateLabel: "25 Oct 2026",
    venue: "Sarga Turf Park",
    discipline: "Turf",
    status: "Tickets open",
    image: "/media/Racecourse-aerial.png",
    imageAlt: "Aerial view of the racing turf in sweeping green lanes",
  },
  {
    title: "Paddock Society Evening Trials",
    href: "/events/paddock-society-evening-trials",
    dateLabel: "08 Nov 2026",
    venue: "Grand Paddock Arena",
    discipline: "Hospitality",
    status: "Announced",
    image: "/media/Champion-horse-studio-portrait.png",
    imageAlt: "Premium stable and paddock hospitality interior",
  },
  {
    title: "Sarga Champions Cup Finals",
    href: "/events/sarga-champions-cup-finals",
    dateLabel: "29 Nov 2026",
    venue: "Sarga Turf Park",
    discipline: "Championship",
    status: "Priority booking",
    image: "/media/horse-sport-hero.png",
    imageAlt: "Championship horses racing at full speed in cinematic motion",
  },
];

const PLACEHOLDER_ARTICLES: ArticleCardData[] = [
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
  {
    title: "Private Paddock Hosting Reframes the Race-Day Experience",
    href: "/news/private-paddock-hosting-reframes-race-day-experience",
    category: "Hospitality",
    dateLabel: "11 Jun 2026",
    excerpt:
      "Track-facing lounges, table service, and controlled guest flow are redefining how premium spectators enter the sport.",
    image: "/media/Champion-horse-studio-portrait.png",
    imageAlt: "Premium hospitality atmosphere inside the paddock district",
  },
];

const PLACEHOLDER_GALLERY: GalleryItemData[] = [
  {
    id: "g1",
    image: "/media/news-merdeka.png",
    imageAlt: "Race-day grandstand crowd",
    category: "Race day",
    caption: "Merdeka Cup",
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
];

const PLACEHOLDER_PARTNERS: PartnerItemData[] = [
  { name: "Meridian Stables" },
  { name: "Turfline Grounds" },
  { name: "Derby Day Hospitality" },
  { name: "Golden Rein Group" },
];

const PLACEHOLDER_TICKET = {
  provider: "Partner Ticketing",
  href: "/tickets",
  label: "Get tickets",
  eventName: "Sarga National Derby - Merdeka Cup",
  external: false,
};

const DEFAULT_ABOUT = {
  title: "A dedicated home for Indonesian horse sport.",
  body: "Sarga Horse Sport brings championship racing, disciplined equestrian standards, and race-day hospitality into one premium sports ecosystem - an investable, international-class platform for the sport's next chapter.",
};

const DEFAULT_HERO: HomepageData["hero"] = {
  image: "/media/horse-sport-hero.png",
  imageAlt:
    "Jockeys racing thoroughbreds across a championship turf track at golden hour",
  video: {
    webm: "/media/a_dynamic_action_sports_scene_at_a_horse_racetrack.webm",
    mp4: "/media/a_dynamic_action_sports_scene_at_a_horse_racetrack.mp4",
    poster: "/media/a_dynamic_action_sports_scene_at_a_horse_racetrack.png",
  },
};

/* -------------------------------------------------------------------------- */
/*  Aggregate fetch                                                           */
/* -------------------------------------------------------------------------- */

const HS_SCOPE = {
  "filters[siteScope][$in][0]": "horsesport",
  "filters[siteScope][$in][1]": "shared",
};

export async function fetchHomepageData(): Promise<HomepageData> {
  const [
    pageRes,
    eventsRes,
    articlesRes,
    partnersRes,
    galleriesRes,
    ticketRes,
    businessRes,
  ] = await Promise.all([
    fetchStrapiList<CmsSitePage>("site-pages", {
      populate: [
        "heroMedia",
        "heroVideo.primaryVideo",
        "heroVideo.alternateVideo",
        "heroVideo.posterImage",
        "heroVideo.mobilePosterImage",
        "sections",
      ],
      filters: {
        "filters[siteScope][$eq]": "horsesport",
        "filters[pageKind][$eq]": "home",
      },
      limit: 1,
      revalidate: 60,
    }),
    fetchStrapiList<CmsEvent>("events", {
      populate: ["coverImage", "heroMedia"],
      filters: {
        ...HS_SCOPE,
        "filters[business][slug][$eq]": "sarga-horse-sport",
      },
      sort: "eventDate:asc",
      limit: 8,
      revalidate: 60,
    }),
    fetchStrapiList<CmsArticle>("news-articles", {
      populate: "coverImage",
      filters: {
        ...HS_SCOPE,
        "filters[relatedBusinesses][slug][$eq]": "sarga-horse-sport",
      },
      sort: "publishedDate:desc",
      limit: 6,
      revalidate: 60,
    }),
    fetchStrapiList<CmsPartner>("partners", {
      populate: "logo",
      filters: HS_SCOPE,
      limit: 10,
      revalidate: 600,
    }),
    fetchStrapiList<CmsGallery>("media-galleries", {
      populate: ["mediaItems", "coverImage"],
      filters: HS_SCOPE,
      limit: 4,
      revalidate: 600,
    }),
    fetchStrapiList<CmsTicketCta>("ticket-ctas", {
      filters: { ...HS_SCOPE, "filters[isActive][$eq]": "true" },
      sort: "createdAt:desc",
      limit: 1,
      revalidate: 60,
    }),
    fetchStrapiList<CmsBusiness>("ecosystem-businesses", {
      filters: { "filters[slug][$eq]": "sarga-horse-sport" },
      limit: 1,
      revalidate: 600,
    }),
  ]);

  const cmsPage = pageRes?.data?.[0];
  const cmsVideo = mapHeroVideo(cmsPage?.heroVideo);
  const resolvedVideo = cmsPage?.heroVideo
    ? cmsPage.heroVideo.enabled === false
      ? undefined
      : (cmsVideo ?? DEFAULT_HERO.video)
    : DEFAULT_HERO.video;
  const cmsHeroImage =
    cmsPage?.heroMedia &&
    (!cmsPage.heroMedia.mime || cmsPage.heroMedia.mime.startsWith("image/"))
      ? mediaUrl(cmsPage.heroMedia.url)
      : undefined;
  const hero: HomepageData["hero"] = cmsPage
    ? {
        image: cmsVideo?.poster || cmsHeroImage || DEFAULT_HERO.image,
        mobileImage:
          mediaUrl(cmsPage.heroVideo?.mobilePosterImage?.url) || undefined,
        imageAlt: cmsPage.heroMedia?.alternativeText || DEFAULT_HERO.imageAlt,
        video: resolvedVideo,
      }
    : DEFAULT_HERO;

  /* Events */
  const cmsEvents = (eventsRes?.data ?? []).map(mapEvent);
  const events = cmsEvents.length > 0 ? cmsEvents : PLACEHOLDER_EVENTS;
  const featuredEvent =
    events.find((e) => e.status === "Tickets open") ?? events[0] ?? null;
  const upcomingEvents = events
    .filter((e) => e.href !== featuredEvent?.href)
    .slice(0, 3);
  const seasonEvents = [
    ...(featuredEvent ? [featuredEvent] : []),
    ...events.filter((e) => e.href !== featuredEvent?.href),
  ].slice(0, 6);

  /* Articles */
  const cmsArticles = (articlesRes?.data ?? []).map(mapArticle);
  const articles = cmsArticles.length > 0 ? cmsArticles : PLACEHOLDER_ARTICLES;
  const [featuredArticle, ...restArticles] = articles;

  /* Partners */
  const cmsPartners = (partnersRes?.data ?? []).map(mapPartner);
  const partners = cmsPartners.length > 0 ? cmsPartners : PLACEHOLDER_PARTNERS;

  /* Gallery - flatten media items across galleries */
  const cmsGallery: GalleryItemData[] = (galleriesRes?.data ?? []).flatMap(
    (entry) =>
      (entry.mediaItems ?? []).map((img, i) => ({
        id: `cms-${entry.id}-${i}`,
        image: mediaUrl(img.url),
        imageAlt: img.alternativeText ?? `${entry.title} - Sarga Horse Sport`,
        category: titleCase(entry.category?.replace(/-/g, " ")),
      })),
  );
  const gallery =
    cmsGallery.length >= 5 ? cmsGallery.slice(0, 5) : PLACEHOLDER_GALLERY;

  /* Ticket CTA */
  const cmsTicket = ticketRes?.data?.[0];
  const ticketCta = cmsTicket
    ? {
        provider: cmsTicket.provider,
        href: cmsTicket.url || "/tickets",
        label: cmsTicket.label ?? "Get tickets",
        eventName: featuredEvent?.title,
        external: Boolean(cmsTicket.url && cmsTicket.url.startsWith("http")),
      }
    : { ...PLACEHOLDER_TICKET, eventName: featuredEvent?.title };

  /* About */
  const business = businessRes?.data?.[0];
  const aboutSection = cmsPage?.sections?.find(
    (section) => section.sectionKey === "about",
  );
  const about = aboutSection
    ? {
        title: aboutSection.title ?? DEFAULT_ABOUT.title,
        body: aboutSection.body ?? DEFAULT_ABOUT.body,
      }
    : business?.overview
      ? { title: DEFAULT_ABOUT.title, body: business.overview }
      : DEFAULT_ABOUT;

  return {
    hero,
    featuredEvent,
    upcomingEvents:
      upcomingEvents.length > 0 ? upcomingEvents : PLACEHOLDER_EVENTS.slice(1),
    seasonEvents:
      seasonEvents.length >= 6
        ? seasonEvents
        : [
            ...seasonEvents,
            ...PLACEHOLDER_EVENTS.filter(
              (e) => !seasonEvents.some((item) => item.href === e.href),
            ),
          ].slice(0, 6),
    ticketCta,
    featuredArticle: featuredArticle ?? null,
    articles:
      restArticles.length >= 3
        ? restArticles
        : [
            ...restArticles,
            ...PLACEHOLDER_ARTICLES.filter(
              (article) =>
                !restArticles.some((item) => item.href === article.href),
            ),
          ].slice(0, 3),
    gallery,
    partners,
    about,
  };
}
