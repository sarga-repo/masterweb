export const APPROVED_MOTORSPORT_PREVIEW_UIDS = [
  "api::news-article.news-article",
  "api::site-page.site-page",
  "api::motorsport-home-page.motorsport-home-page",
  "api::motorsport-about-page.motorsport-about-page",
  "api::motorsport-events-page.motorsport-events-page",
  "api::motorsport-news-page.motorsport-news-page",
  "api::motorsport-gallery-page.motorsport-gallery-page",
  "api::motorsport-merchandise-page.motorsport-merchandise-page",
  "api::motorsport-tickets-page.motorsport-tickets-page",
  "api::motorsport-contact-page.motorsport-contact-page",
  "api::motorsport-partners-page.motorsport-partners-page",
  "api::motorsport-experience-page.motorsport-experience-page",
  "api::event.event",
  "api::motorsport-event.motorsport-event",
  "api::site.site",
  "api::partner.partner",
  "api::motorsport-partner.motorsport-partner",
  "api::media-gallery.media-gallery",
  "api::merchandise-item.merchandise-item",
  "api::motorsport-merchandise-item.motorsport-merchandise-item",
  "api::ticket-cta.ticket-cta",
  "api::motorsport-ticket-cta.motorsport-ticket-cta",
  "api::top-navigation-item.top-navigation-item",
  "api::motorsport-top-navigation-item.motorsport-top-navigation-item",
  "api::motorsport-program.motorsport-program",
  "api::motorsport-rider.motorsport-rider",
  "api::motorsport-standing.motorsport-standing",
  "api::motorsport-regulation.motorsport-regulation",
  "api::leadership-person.leadership-person",
  "api::motorsport-leadership-person.motorsport-leadership-person",
  "api::motorsport-news-article.motorsport-news-article",
] as const;

export type ApprovedMotorsportPreviewUid =
  (typeof APPROVED_MOTORSPORT_PREVIEW_UIDS)[number];

export type PreviewRelation = {
  slug?: string | null;
  siteScope?: string | null;
};

export type PreviewDocument = {
  slug?: string | null;
  routePath?: string | null;
  siteScope?: string | null;
  program?: PreviewRelation | null;
};

const SECONDARY_COLLECTION_PATHS: Record<string, string> = {
  "api::partner.partner": "/partners",
  "api::media-gallery.media-gallery": "/gallery",
  "api::merchandise-item.merchandise-item": "/merchandise",
  "api::ticket-cta.ticket-cta": "/tickets",
  "api::motorsport-partner.motorsport-partner": "/partners",
  "api::motorsport-merchandise-item.motorsport-merchandise-item":
    "/merchandise",
  "api::motorsport-ticket-cta.motorsport-ticket-cta": "/tickets",
};

const MOTORSPORT_SITE_ROUTES = new Set([
  "/",
  "/about",
  "/events",
  "/events/fia-rallycross-world-cup-indonesia-2026",
  "/events/indonesia-junior-talent-cup",
  "/events/indonesia-junior-talent-cup/about",
  "/events/indonesia-junior-talent-cup/become-riders",
  "/events/indonesia-junior-talent-cup/race-schedule",
  "/events/indonesia-junior-talent-cup/regulation",
  "/events/indonesia-junior-talent-cup/riders",
  "/events/indonesia-junior-talent-cup/standings",
  "/news",
  "/contact",
  "/partners",
  "/tickets",
  "/gallery",
  "/merchandise",
  "/experience",
]);

const LOCALES = new Set(["en", "id"]);
const PREVIEW_STATUSES = new Set(["draft", "published"]);
const SAFE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const LEGACY_FIA_CAMPAIGN_PATH =
  "/campaign/fia-rallycross-world-cup-indonesia-2026";
const CANONICAL_FIA_EVENT_PATH =
  "/events/fia-rallycross-world-cup-indonesia-2026";

export type PreviewLocale = "en" | "id";
export type PreviewStatus = "draft" | "published";

export function isApprovedMotorsportPreviewUid(
  uid: string,
): uid is ApprovedMotorsportPreviewUid {
  return (APPROVED_MOTORSPORT_PREVIEW_UIDS as readonly string[]).includes(uid);
}

export function normalizePreviewLocale(
  locale?: string | null,
): PreviewLocale | null {
  if (locale === "") return "en";
  return locale && LOCALES.has(locale)
    ? (locale as PreviewLocale)
    : locale == null
      ? "en"
      : null;
}

export function normalizePreviewStatus(
  status?: string | null,
): PreviewStatus | null {
  if (status === "modified") return "draft";
  return status && PREVIEW_STATUSES.has(status)
    ? (status as PreviewStatus)
    : null;
}

function localizedPath(pathname: string, locale: string) {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return locale === "id" && normalized !== "/"
    ? `/id${normalized}`
    : locale === "id"
      ? "/id"
      : normalized;
}

function safeSlug(value?: string | null) {
  const slug = value?.trim();
  return slug && slug.length <= 120 && SAFE_SLUG.test(slug) ? slug : null;
}

function isMotorsportDocument(
  uid: string,
  document: PreviewDocument | null | undefined,
) {
  // Dedicated Motorsport content types are already site-scoped by their UID.
  // Some of them intentionally do not expose a siteScope field, including
  // Motorsport News Article, so requiring that field made their CMS preview
  // button resolve to no URL.
  return (
    document?.siteScope === "motorsport" || uid.startsWith("api::motorsport-")
  );
}

function isIjtcProgram(document: PreviewDocument | null | undefined) {
  return document?.program?.slug === "indonesia-junior-talent-cup";
}

export function getMotorsportPreviewPath(
  uid: string,
  document: PreviewDocument | null | undefined,
  locale = "en",
) {
  const normalizedLocale = normalizePreviewLocale(locale);
  if (!normalizedLocale || !isApprovedMotorsportPreviewUid(uid)) return null;

  if (uid === "api::site.site") {
    return document?.slug === "sarga-motorsport"
      ? localizedPath("/", normalizedLocale)
      : null;
  }

  if (!isMotorsportDocument(uid, document)) return null;

  if (uid === "api::site-page.site-page") {
    const routePath = document.routePath?.trim();
    if (routePath === LEGACY_FIA_CAMPAIGN_PATH) {
      return localizedPath(CANONICAL_FIA_EVENT_PATH, normalizedLocale);
    }
    if (!routePath || !MOTORSPORT_SITE_ROUTES.has(routePath)) return null;
    return localizedPath(routePath, normalizedLocale);
  }

  const singleTypePaths: Record<string, string> = {
    "api::motorsport-home-page.motorsport-home-page": "/",
    "api::motorsport-about-page.motorsport-about-page": "/about",
    "api::motorsport-events-page.motorsport-events-page": "/events",
    "api::motorsport-news-page.motorsport-news-page": "/news",
    "api::motorsport-gallery-page.motorsport-gallery-page": "/gallery",
    "api::motorsport-merchandise-page.motorsport-merchandise-page":
      "/merchandise",
    "api::motorsport-tickets-page.motorsport-tickets-page": "/tickets",
    "api::motorsport-contact-page.motorsport-contact-page": "/contact",
    "api::motorsport-partners-page.motorsport-partners-page": "/partners",
    "api::motorsport-experience-page.motorsport-experience-page": "/experience",
  };
  if (singleTypePaths[uid]) {
    const configuredPath = document?.routePath?.trim();
    return localizedPath(
      configuredPath && MOTORSPORT_SITE_ROUTES.has(configuredPath)
        ? configuredPath
        : singleTypePaths[uid],
      normalizedLocale,
    );
  }

  if (
    uid === "api::top-navigation-item.top-navigation-item" ||
    uid ===
      "api::motorsport-top-navigation-item.motorsport-top-navigation-item" ||
    uid === "api::leadership-person.leadership-person" ||
    uid === "api::motorsport-leadership-person.motorsport-leadership-person"
  ) {
    return localizedPath(
      uid.includes("leadership-person") ? "/about" : "/",
      normalizedLocale,
    );
  }

  const secondaryPath = SECONDARY_COLLECTION_PATHS[uid];
  if (secondaryPath) return localizedPath(secondaryPath, normalizedLocale);

  if (uid === "api::motorsport-program.motorsport-program") {
    const slug = safeSlug(document.slug);
    return slug ? localizedPath(`/events/${slug}`, normalizedLocale) : null;
  }

  if (
    uid === "api::motorsport-rider.motorsport-rider" &&
    isIjtcProgram(document)
  ) {
    const programSlug = safeSlug(document.program?.slug);
    const riderSlug = safeSlug(document.slug);
    return programSlug && riderSlug
      ? localizedPath(
          `/events/${programSlug}/riders/${riderSlug}`,
          normalizedLocale,
        )
      : null;
  }

  if (
    uid === "api::motorsport-standing.motorsport-standing" &&
    isIjtcProgram(document)
  ) {
    return localizedPath(
      "/events/indonesia-junior-talent-cup/standings",
      normalizedLocale,
    );
  }

  if (
    uid === "api::motorsport-regulation.motorsport-regulation" &&
    isIjtcProgram(document)
  ) {
    return localizedPath(
      "/events/indonesia-junior-talent-cup/regulation",
      normalizedLocale,
    );
  }

  if (
    uid !== "api::event.event" &&
    uid !== "api::motorsport-event.motorsport-event" &&
    uid !== "api::news-article.news-article" &&
    uid !== "api::motorsport-news-article.motorsport-news-article"
  ) {
    return null;
  }

  const slug = safeSlug(document.slug);
  if (!slug) return null;
  const collectionPath = uid.includes("event") ? "events" : "news";
  return localizedPath(`/${collectionPath}/${slug}`, normalizedLocale);
}
