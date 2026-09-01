import type { Core } from "@strapi/strapi";
import { PRESENTATION_CONFIG_UID } from "../presentation-config/contract";

const MOTORSPORT_MODELS = [
  "api::motorsport-theme-settings.motorsport-theme-settings",
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
  "api::site.site",
  "api::top-navigation-item.top-navigation-item",
  "api::event.event",
  "api::motorsport-program.motorsport-program",
  "api::motorsport-rider.motorsport-rider",
  "api::motorsport-standing.motorsport-standing",
  "api::motorsport-regulation.motorsport-regulation",
  "api::news-article.news-article",
  "api::media-gallery.media-gallery",
  "api::merchandise-item.merchandise-item",
  "api::ticket-cta.ticket-cta",
  "api::partner.partner",
  "api::leadership-person.leadership-person",
  "api::corporate-report.corporate-report",
  "api::motorsport-event.motorsport-event",
  "api::motorsport-leadership-person.motorsport-leadership-person",
  "api::motorsport-merchandise-item.motorsport-merchandise-item",
  "api::motorsport-news-article.motorsport-news-article",
  "api::motorsport-partner.motorsport-partner",
  "api::motorsport-ticket-cta.motorsport-ticket-cta",
  "api::motorsport-top-navigation-item.motorsport-top-navigation-item",
  PRESENTATION_CONFIG_UID,
] as const;

type LifecycleResult = Record<string, unknown> | undefined;

function relevantToMotorsport(result: LifecycleResult) {
  const scope = result?.siteScope;
  if (typeof scope !== "string") return true;
  return scope === "motorsport" || scope === "shared" || scope === "hidden";
}

function payloadFor(
  action: string,
  event: { model: { uid: string }; result?: LifecycleResult },
) {
  const result = event.result ?? {};
  const isPresentationConfig = event.model.uid === PRESENTATION_CONFIG_UID;
  return {
    // Presentation metadata is stored in a sidecar row, but the frontend
    // cache must be invalidated as if the underlying localized document had
    // changed.
    contentType:
      isPresentationConfig && typeof result.contentTypeUid === "string"
        ? result.contentTypeUid
        : event.model.uid,
    action,
    documentId:
      isPresentationConfig && typeof result.documentIdRef === "string"
        ? result.documentIdRef
        : typeof result.documentId === "string"
          ? result.documentId
          : undefined,
    locale:
      result.locale === "en" || result.locale === "id"
        ? result.locale
        : undefined,
    slug: typeof result.slug === "string" ? result.slug : undefined,
    routePath:
      typeof result.routePath === "string" ? result.routePath : undefined,
  };
}

async function notifyFrontend(
  strapi: Core.Strapi,
  action: string,
  event: { model: { uid: string }; result?: LifecycleResult },
) {
  if (!relevantToMotorsport(event.result)) return;
  const url = process.env.MOTORSPORT_FRONTEND_REVALIDATE_URL;
  const secret = process.env.MOTORSPORT_REVALIDATION_SECRET;
  if (!url || !secret) return;

  const payload = payloadFor(action, event);
  let lastStatus: number | undefined;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-sarga-revalidation-secret": secret,
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(2_000),
      });
      lastStatus = response.status;
      if (response.ok) return;
    } catch {
      lastStatus = undefined;
    }
  }

  strapi.log.error("[motorsport-revalidation] frontend notification failed", {
    contentType: payload.contentType,
    action,
    status: lastStatus ?? "unreachable",
    attempts: 3,
  });
}

export function registerMotorsportRevalidation(strapi: Core.Strapi) {
  if (
    !process.env.MOTORSPORT_FRONTEND_REVALIDATE_URL ||
    !process.env.MOTORSPORT_REVALIDATION_SECRET
  ) {
    strapi.log.info(
      "[motorsport-revalidation] disabled; endpoint or secret is not configured",
    );
    return;
  }

  strapi.db.lifecycles.subscribe({
    models: [...MOTORSPORT_MODELS],
    afterCreate: (event) => notifyFrontend(strapi, "create", event),
    afterUpdate: (event) => notifyFrontend(strapi, "update", event),
    afterDelete: (event) => notifyFrontend(strapi, "delete", event),
  });
}
