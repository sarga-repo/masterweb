import type { Locale } from "@/lib/i18n/config";

export const MOTORSPORT_CMS_TAG = "cms:motorsport";

const ALL_PUBLIC_ROUTES = [
  "/",
  "/about",
  "/contact",
  "/events",
  "/experience",
  "/gallery",
  "/merchandise",
  "/news",
  "/partners",
  "/tickets",
] as const;

const ROUTES_BY_COLLECTION: Record<string, readonly string[]> = {
  "site-pages": ALL_PUBLIC_ROUTES,
  "motorsport-home-pages": ["/"],
  "motorsport-about-pages": ["/about"],
  "motorsport-events-pages": ["/events"],
  "motorsport-news-pages": ["/news"],
  "motorsport-gallery-pages": ["/gallery"],
  "motorsport-merchandise-pages": ["/merchandise"],
  "motorsport-tickets-pages": ["/tickets"],
  "motorsport-contact-pages": ["/contact"],
  "motorsport-partners-pages": ["/partners"],
  "motorsport-experience-pages": ["/experience"],
  sites: ALL_PUBLIC_ROUTES,
  "top-navigation-items": ALL_PUBLIC_ROUTES,
  "motorsport-top-navigation-items": ALL_PUBLIC_ROUTES,
  events: ["/", "/events", "/tickets"],
  "motorsport-events": ["/", "/events", "/tickets"],
  "motorsport-programs": ["/events"],
  "motorsport-riders": ["/events/indonesia-junior-talent-cup/riders"],
  "motorsport-standings": ["/events/indonesia-junior-talent-cup/standings"],
  "motorsport-regulations": ["/events/indonesia-junior-talent-cup/regulation"],
  "news-articles": ["/", "/news"],
  "motorsport-news-articles": ["/", "/news"],
  "media-galleries": ["/", "/gallery"],
  "merchandise-items": ["/merchandise"],
  "motorsport-merchandise-items": ["/merchandise"],
  "ticket-ctas": ["/", "/events", "/tickets"],
  "motorsport-ticket-ctas": ["/", "/events", "/tickets"],
  partners: ["/", "/partners"],
  "motorsport-partners": ["/", "/partners"],
  "leadership-people": ["/about"],
  "motorsport-leadership-people": ["/about"],
  "corporate-reports": ["/about"],
};

export type MotorsportRevalidationPayload = {
  contentType: string;
  documentId?: string;
  locale?: Locale;
  action?: "create" | "update" | "delete" | "publish" | "unpublish";
  slug?: string;
  routePath?: string;
};

export function normalizeCollectionName(contentType: string): string {
  const uidName = contentType.split(".").at(-1) ?? contentType;
  if (uidName.endsWith("s")) return uidName;
  if (uidName.endsWith("y")) return `${uidName.slice(0, -1)}ies`;
  if (uidName.endsWith("person")) return `${uidName.slice(0, -6)}people`;
  return `${uidName}s`;
}

export function cmsFetchTags(
  collection: string,
  locale: Locale,
  documentId?: string,
): string[] {
  const tags = [
    MOTORSPORT_CMS_TAG,
    `${MOTORSPORT_CMS_TAG}:${collection}`,
    `${MOTORSPORT_CMS_TAG}:${collection}:${locale}`,
  ];
  if (documentId) tags.push(`${MOTORSPORT_CMS_TAG}:document:${documentId}`);
  return tags;
}

export function revalidationTargets(payload: MotorsportRevalidationPayload) {
  const collection = normalizeCollectionName(payload.contentType);
  const paths = new Set(ROUTES_BY_COLLECTION[collection] ?? ALL_PUBLIC_ROUTES);

  if (payload.routePath?.startsWith("/")) paths.add(payload.routePath);
  if (payload.slug) {
    if (collection === "news-articles" || collection === "motorsport-news-articles") paths.add(`/news/${payload.slug}`);
    if (collection === "events" || collection === "motorsport-events" || collection === "motorsport-programs") {
      paths.add(`/events/${payload.slug}`);
    }
  }

  const locales: Locale[] = payload.locale ? [payload.locale] : ["en", "id"];
  const tags = new Set<string>();
  for (const locale of locales) {
    for (const tag of cmsFetchTags(collection, locale, payload.documentId)) {
      tags.add(tag);
    }
  }

  return { collection, paths: [...paths], tags: [...tags] };
}
