import type { Locale } from "@/lib/i18n/config";

export type SharedPreviewUid =
  | "api::partner.partner"
  | "api::ticket-cta.ticket-cta"
  | "api::motorsport-ticket-cta.motorsport-ticket-cta"
  | "api::leadership-person.leadership-person"
  | "api::media-gallery.media-gallery";

export type AffectedRouteContext = {
  eventSlug?: string;
  programSlug?: string;
};

const SHARED_RECORD_ROUTES: Record<SharedPreviewUid, string[]> = {
  "api::partner.partner": ["/", "/partners"],
  "api::ticket-cta.ticket-cta": ["/", "/tickets"],
  "api::motorsport-ticket-cta.motorsport-ticket-cta": ["/", "/tickets"],
  "api::leadership-person.leadership-person": ["/", "/about"],
  "api::media-gallery.media-gallery": ["/", "/gallery"],
};

const SAFE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const GLOBAL_CHROME_ROUTES = [
  "/",
  "/about",
  "/contact",
  "/events",
  "/events/{eventSlug}",
  "/events/fia-rallycross-world-cup-indonesia-2026",
  "/events/indonesia-junior-talent-cup",
  "/events/indonesia-junior-talent-cup/about",
  "/events/indonesia-junior-talent-cup/become-riders",
  "/events/indonesia-junior-talent-cup/race-schedule",
  "/events/indonesia-junior-talent-cup/regulation",
  "/events/indonesia-junior-talent-cup/riders",
  "/events/indonesia-junior-talent-cup/riders/{riderSlug}",
  "/events/indonesia-junior-talent-cup/standings",
  "/experience",
  "/gallery",
  "/merchandise",
  "/news",
  "/news/{articleSlug}",
  "/partners",
  "/tickets",
];

function validSlug(value?: string) {
  return value && SAFE_SLUG.test(value) ? value : null;
}

function localize(pathname: string, locale: Locale) {
  return locale === "id"
    ? pathname === "/"
      ? "/id"
      : `/id${pathname}`
    : pathname;
}

export function getSharedRecordAffectedRoutes(
  uid: SharedPreviewUid,
  context: AffectedRouteContext = {},
  locale: Locale = "en",
) {
  const routes = [...SHARED_RECORD_ROUTES[uid]];
  const eventSlug = validSlug(context.eventSlug);
  const programSlug = validSlug(context.programSlug);

  if (
    (uid === "api::partner.partner" ||
      uid === "api::ticket-cta.ticket-cta" ||
      uid === "api::motorsport-ticket-cta.motorsport-ticket-cta") &&
    eventSlug
  ) {
    routes.push(`/events/${eventSlug}`);
  }
  if (
    (uid === "api::ticket-cta.ticket-cta" ||
      uid === "api::motorsport-ticket-cta.motorsport-ticket-cta") &&
    programSlug
  ) {
    routes.push(`/events/${programSlug}`);
  }

  return Array.from(new Set(routes)).map((route) => localize(route, locale));
}

export function getGlobalChromeAffectedRoutes(locale: Locale = "en") {
  return GLOBAL_CHROME_ROUTES.map((route) => localize(route, locale));
}
