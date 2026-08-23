import { createHmac, timingSafeEqual } from "node:crypto";

import type { Locale } from "@/lib/i18n/config";

export const MOTORSPORT_PREVIEW_COOKIE = "sarga-motorsport-preview";

const PREVIEW_COLLECTIONS = {
  "api::news-article.news-article": "news-articles",
  "api::site-page.site-page": "site-pages",
  "api::motorsport-home-page.motorsport-home-page": "motorsport-home-page",
  "api::motorsport-about-page.motorsport-about-page": "motorsport-about-page",
  "api::motorsport-events-page.motorsport-events-page": "motorsport-events-page",
  "api::motorsport-news-page.motorsport-news-page": "motorsport-news-page",
  "api::motorsport-gallery-page.motorsport-gallery-page": "motorsport-gallery-page",
  "api::motorsport-merchandise-page.motorsport-merchandise-page": "motorsport-merchandise-page",
  "api::motorsport-tickets-page.motorsport-tickets-page": "motorsport-tickets-page",
  "api::motorsport-contact-page.motorsport-contact-page": "motorsport-contact-page",
  "api::motorsport-partners-page.motorsport-partners-page": "motorsport-partners-page",
  "api::motorsport-experience-page.motorsport-experience-page": "motorsport-experience-page",
  "api::event.event": "events",
  "api::motorsport-event.motorsport-event": "motorsport-events",
  "api::site.site": "sites",
  "api::partner.partner": "partners",
  "api::motorsport-partner.motorsport-partner": "motorsport-partners",
  "api::media-gallery.media-gallery": "media-galleries",
  "api::merchandise-item.merchandise-item": "merchandise-items",
  "api::motorsport-merchandise-item.motorsport-merchandise-item": "motorsport-merchandise-items",
  "api::ticket-cta.ticket-cta": "ticket-ctas",
  "api::motorsport-ticket-cta.motorsport-ticket-cta": "motorsport-ticket-ctas",
  "api::top-navigation-item.top-navigation-item": "top-navigation-items",
  "api::motorsport-top-navigation-item.motorsport-top-navigation-item": "motorsport-top-navigation-items",
  "api::motorsport-program.motorsport-program": "motorsport-programs",
  "api::motorsport-rider.motorsport-rider": "motorsport-riders",
  "api::motorsport-standing.motorsport-standing": "motorsport-standings",
  "api::motorsport-regulation.motorsport-regulation": "motorsport-regulations",
  "api::leadership-person.leadership-person": "leadership-people",
  "api::motorsport-leadership-person.motorsport-leadership-person": "motorsport-leadership-people",
  "api::motorsport-news-article.motorsport-news-article": "motorsport-news-articles",
} as const;

const PREVIEW_SINGLE_TYPE_COLLECTIONS = new Set([
  "motorsport-home-page",
  "motorsport-about-page",
  "motorsport-events-page",
  "motorsport-news-page",
  "motorsport-gallery-page",
  "motorsport-merchandise-page",
  "motorsport-tickets-page",
  "motorsport-contact-page",
  "motorsport-partners-page",
  "motorsport-experience-page",
]);

export type MotorsportPreviewUid = keyof typeof PREVIEW_COLLECTIONS;
export type MotorsportPreviewStatus = "draft" | "published";

export type MotorsportPreviewContext = {
  uid: MotorsportPreviewUid;
  documentId: string;
  locale: Locale;
  status: MotorsportPreviewStatus;
  pathname: string;
  expiresAt: number;
};

const DOCUMENT_ID = /^[a-z0-9]{20,32}$/;

export function isMotorsportPreviewUid(
  value: string | null,
): value is MotorsportPreviewUid {
  return Boolean(value && value in PREVIEW_COLLECTIONS);
}

export function previewCollectionForUid(uid: MotorsportPreviewUid) {
  return PREVIEW_COLLECTIONS[uid];
}

export function isPreviewSingleTypeCollection(collection: string) {
  return PREVIEW_SINGLE_TYPE_COLLECTIONS.has(collection);
}

export function isSafePreviewDocumentId(value: string | null): value is string {
  return Boolean(value && DOCUMENT_ID.test(value));
}

function signature(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function signPreviewContext(
  context: MotorsportPreviewContext,
  secret: string,
) {
  const payload = Buffer.from(JSON.stringify(context)).toString("base64url");
  return `${payload}.${signature(payload, secret)}`;
}

export function verifyPreviewContext(
  value: string | undefined,
  secret: string | undefined,
): MotorsportPreviewContext | null {
  if (!value || !secret) return null;
  const [payload, providedSignature, extra] = value.split(".");
  if (!payload || !providedSignature || extra) return null;
  const expectedSignature = signature(payload, secret);
  const provided = Buffer.from(providedSignature);
  const expected = Buffer.from(expectedSignature);
  if (
    provided.length !== expected.length ||
    !timingSafeEqual(provided, expected)
  )
    return null;

  try {
    const context = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as Partial<MotorsportPreviewContext>;
    return isMotorsportPreviewUid(context.uid ?? null) &&
      isSafePreviewDocumentId(context.documentId ?? null) &&
      (context.locale === "en" || context.locale === "id") &&
      (context.status === "draft" || context.status === "published") &&
      typeof context.pathname === "string" &&
      typeof context.expiresAt === "number" &&
      context.expiresAt > Date.now()
      ? (context as MotorsportPreviewContext)
      : null;
  } catch {
    return null;
  }
}
