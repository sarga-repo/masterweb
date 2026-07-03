import "server-only";

import { mapMedia, mapSeo, strapiFetch } from "@/lib/strapi/client";
import type {
  EventItem,
  RawEvent,
  StrapiCollectionResponse,
} from "@/lib/strapi/types";
import { events as mockEvents } from "@/lib/mock-data";

export function mapEvent(raw: RawEvent): EventItem {
  return {
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
    seo: mapSeo(raw.seo),
  };
}

/** Events, excluding hidden ones (docs/05 → Event). */
export async function getEvents(): Promise<EventItem[]> {
  const query =
    "populate[coverImage]=true&populate[seo][populate][ogImage]=true&sort=eventDate:asc&pagination[pageSize]=100";
  const res = await strapiFetch<StrapiCollectionResponse<RawEvent>>("events", {
    query,
    revalidate: 60,
  });

  if (!res?.data?.length) return mockEvents;

  return res.data.map(mapEvent).filter((event) => event.status !== "hidden");
}

/** A single event by slug, or null if not found. */
export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  const query = `filters[slug][$eq]=${encodeURIComponent(slug)}&populate[coverImage]=true&populate[seo][populate][ogImage]=true`;
  const res = await strapiFetch<StrapiCollectionResponse<RawEvent>>("events", {
    query,
    revalidate: 60,
  });

  const raw = res?.data?.[0];
  if (raw) return mapEvent(raw);

  return mockEvents.find((event) => event.slug === slug) ?? null;
}
