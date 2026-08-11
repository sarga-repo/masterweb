import "server-only";

import { mapMedia, mapSeo, strapiFetchLocalized } from "@/lib/strapi/client";
import type { Locale } from "@/lib/i18n/config";
import type {
  EventItem,
  LocalizationState,
  RawEvent,
  StrapiCollectionResponse,
} from "@/lib/strapi/types";
import { events as mockEvents } from "@/lib/mock-data";

export function mapEvent(
  raw: RawEvent,
  localization?: LocalizationState,
): EventItem {
  return {
    localization,
    title: raw.title,
    slug: raw.slug,
    description: raw.description ?? "",
    eventDate: raw.eventDate,
    endDate: raw.endDate,
    venue: raw.venue,
    coverImage: mapMedia(raw.coverImage, raw.title),
    ticketCtaLabel: raw.ticketCtaLabel,
    ticketUrl: raw.ticketUrl,
    embedUrl: raw.embedUrl,
    ticketIntegrationType: raw.ticketIntegrationType,
    status: raw.eventStatus,
    siteScope: raw.siteScope,
    seo: mapSeo(raw.seo),
  };
}

/** Events, excluding hidden ones (docs/05 → Event). */
export async function getEvents(locale?: Locale): Promise<EventItem[]> {
  const query =
    "populate[coverImage]=true&populate[seo][populate][ogImage]=true&sort=eventDate:asc&pagination[pageSize]=100";
  const result = await strapiFetchLocalized<StrapiCollectionResponse<RawEvent>>(
    "events",
    {
      query,
      revalidate: 60,
      locale,
    },
  );
  const res = result.response;
  const localization = {
    requestedLocale: result.requestedLocale,
    resolvedLocale: result.resolvedLocale,
    isFallback: result.isFallback,
  };

  if (!res?.data?.length)
    return mockEvents.map((event) => ({
      ...event,
      localization: {
        ...localization,
        resolvedLocale: "en",
        isFallback: result.requestedLocale === "id",
      },
    }));

  return res.data
    .map((item) => mapEvent(item, localization))
    .filter((event) => event.status !== "hidden");
}

/** A single event by slug, or null if not found. */
export async function getEventBySlug(
  slug: string,
  locale?: Locale,
): Promise<EventItem | null> {
  const query = `filters[slug][$eq]=${encodeURIComponent(slug)}&populate[coverImage]=true&populate[seo][populate][ogImage]=true`;
  const result = await strapiFetchLocalized<StrapiCollectionResponse<RawEvent>>(
    "events",
    {
      query,
      revalidate: 60,
      locale,
    },
  );
  const res = result.response;
  const localization = {
    requestedLocale: result.requestedLocale,
    resolvedLocale: result.resolvedLocale,
    isFallback: result.isFallback,
  };

  const raw = res?.data?.[0];
  if (raw) return mapEvent(raw, localization);

  const fallback = mockEvents.find((event) => event.slug === slug);
  return fallback
    ? {
        ...fallback,
        localization: {
          ...localization,
          resolvedLocale: "en",
          isFallback: result.requestedLocale === "id",
        },
      }
    : null;
}
