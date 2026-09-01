import type { Core } from "@strapi/strapi";

export const PRESENTATION_CONFIG_UID =
  "api::localized-presentation-config.localized-presentation-config" as const;

export const SUPPORTED_LOCALES = ["en", "id"] as const;
export type PresentationLocale = (typeof SUPPORTED_LOCALES)[number];

export type PresentationMode = "local" | "global" | "inherit";

export type PresentationConfigRecord = {
  id?: number;
  documentId?: string;
  contentTypeUid: string;
  documentIdRef: string;
  locale: PresentationLocale;
  mode: PresentationMode;
  sourceLocale?: PresentationLocale | null;
};

/**
 * These are presentation containers, not editorial copy containers. The
 * allowlist deliberately stops at known layout/presentation groups so fields
 * such as title, body, excerpt, labels, and SEO copy remain locale-owned.
 */
export const PRESENTATION_CONTAINER_KEYS = new Set([
  "hero",
  "heroSlides",
  "motorsportPresentation",
  "informationBand",
  "worldSection",
  "ticketSection",
  "latestNewsSection",
  "upcomingEventsSection",
  "gallerySection",
  "partnersSection",
  "connectedRecordsSection",
  "newsletterSection",
  "leadStorySection",
  "archiveIntroSection",
  "galleryCtaSection",
  "pageAvailability",
  "sections",
  "presentationSections",
  "bannerSlides",
  "fiaRallycrossContent",
  "formatSection",
  "rundownSection",
  "raceDayGuideSection",
]);

const PRESENTATION_MEDIA_KEY_PATTERN = /(?:media|mediaItems|image|video)$/i;
const PRESENTATION_CTA_KEY_PATTERN = /cta(?:url|target)$/i;
const PRESENTATION_VISIBILITY_KEY_PATTERN = /(?:enabled|active|visible)$/i;

/**
 * Presentation media fields use several names across the shared schemas
 * (`heroMedia`, `mobilePosterImage`, `heroVideo`, etc.). Alt text is
 * intentionally excluded because it is translated editorial content.
 */
export function isPresentationMediaKey(key: string) {
  return PRESENTATION_MEDIA_KEY_PATTERN.test(key) && !/alt$/i.test(key);
}

/**
 * CTA destinations and targets travel together. CTA labels remain local so
 * each locale can translate the action text independently.
 */
export function isPresentationCtaKey(key: string) {
  return PRESENTATION_CTA_KEY_PATTERN.test(key);
}

/**
 * Shared presentation values. These naming rules cover all current schema
 * variants while keeping dates, generic URLs, labels, descriptions, SEO,
 * and other editorial fields locale-owned.
 */
export function isSharedPresentationKey(key: string) {
  return (
    key.startsWith("show") ||
    key.startsWith("hide") ||
    PRESENTATION_VISIBILITY_KEY_PATTERN.test(key) ||
    isPresentationMediaKey(key) ||
    isPresentationCtaKey(key)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function mergePresentationContainer(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
) {
  for (const [key, targetValue] of Object.entries(target)) {
    const sourceValue = source[key];
    if (sourceValue === undefined) continue;

    if (isSharedPresentationKey(key)) {
      target[key] = sourceValue;
      continue;
    }

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      target[key] = targetValue.map((item, index) => {
        const sourceItem = sourceValue[index];
        if (isRecord(item) && isRecord(sourceItem)) {
          return mergePresentationContainer({ ...item }, sourceItem);
        }
        return item;
      });
      continue;
    }

    if (isRecord(targetValue) && isRecord(sourceValue)) {
      target[key] = mergePresentationContainer({ ...targetValue }, sourceValue);
    }
  }
  return target;
}

/**
 * Merge only shared presentation values from the source locale. This is a
 * pure function so the CMS middleware and future frontend integrations can
 * share the same behavior without duplicating field rules.
 */
export function mergeSharedPresentationFields<T>(target: T, source: unknown): T {
  if (!isRecord(target) || !isRecord(source)) return target;
  const merged = { ...target } as Record<string, unknown>;

  for (const [key, targetValue] of Object.entries(merged)) {
    const sourceValue = source[key];
    if (sourceValue === undefined) continue;
    // Most shared settings live inside named presentation containers, but a
    // few models expose a show/active/media setting at the root level.
    if (!PRESENTATION_CONTAINER_KEYS.has(key) && !isSharedPresentationKey(key)) {
      continue;
    }

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      merged[key] = targetValue.map((item, index) => {
        const sourceItem = sourceValue[index];
        return isRecord(item) && isRecord(sourceItem)
          ? mergePresentationContainer({ ...item }, sourceItem)
          : item;
      });
      continue;
    }

    if (isRecord(targetValue) && isRecord(sourceValue)) {
      merged[key] = mergePresentationContainer({ ...targetValue }, sourceValue);
    }
  }

  return merged as T;
}

const DOCUMENT_UPDATE_METADATA_KEYS = new Set([
  "documentId",
  "createdAt",
  "updatedAt",
  "publishedAt",
  "createdBy",
  "updatedBy",
  "locale",
]);

function documentUpdateValue(value: unknown, key?: string): unknown {
  if (isPresentationMediaKey(key ?? "")) {
    if (Array.isArray(value)) {
      return value.map((item) =>
        isRecord(item) ? item.id ?? item.documentId ?? item : item,
      );
    }
    return isRecord(value) ? value.id ?? value.documentId ?? value : value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => documentUpdateValue(item));
  }
  if (!isRecord(value)) return value;

  return Object.fromEntries(
    Object.entries(value)
      .filter(([entryKey]) => !DOCUMENT_UPDATE_METADATA_KEYS.has(entryKey))
      .map(([entryKey, entryValue]) => [
        entryKey,
        documentUpdateValue(entryValue, entryKey),
      ]),
  );
}

/**
 * Build a Document Service update payload for the current locale. The target
 * supplies all locale-owned copy, then the source replaces only the shared
 * presentation values. This makes "Use global config" a real persisted copy
 * while keeping translated text local.
 */
export function sharedPresentationUpdateData(
  target: unknown,
  source: unknown,
): Record<string, unknown> {
  if (!isRecord(target) || !isRecord(source)) return {};
  const merged = mergeSharedPresentationFields(target, source);

  return Object.fromEntries(
    Object.entries(merged)
      .filter(
        ([key]) =>
          PRESENTATION_CONTAINER_KEYS.has(key) || isSharedPresentationKey(key),
      )
      .map(([key, value]) => [key, documentUpdateValue(value, key)]),
  );
}

export function isSupportedLocale(value: unknown): value is PresentationLocale {
  return value === "en" || value === "id";
}

export function isPresentationModel(
  strapi: Core.Strapi,
  uid: string,
): boolean {
  if (!uid.startsWith("api::") || uid === PRESENTATION_CONFIG_UID) return false;
  const model = strapi.contentTypes[uid];
  if (!model) return false;
  if (model.pluginOptions?.i18n?.localized === true) return true;
  return Object.values(model.attributes ?? {}).some(
    (attribute: any) => attribute?.pluginOptions?.i18n?.localized === true,
  );
}

export function normalizeDocumentId(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}
