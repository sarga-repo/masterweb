import "server-only";

import { mapMedia, strapiFetch } from "@/lib/strapi/client";
import type {
  LeadershipPerson,
  RawLeadershipPerson,
  RawTimelineItem,
  StrapiCollectionResponse,
  TimelineItem,
} from "@/lib/strapi/types";

const TIMELINE_QUERY =
  "populate[image]=true&sort=order:asc&pagination[pageSize]=100";

const LEADERSHIP_QUERY =
  "populate[portrait]=true&sort=order:asc&pagination[pageSize]=100";

function mapTimelineItem(raw: RawTimelineItem): TimelineItem {
  return {
    year: raw.year ?? "",
    label: raw.label ?? "",
    title: raw.title ?? "",
    description: raw.description ?? "",
    image: mapMedia(raw.image, raw.title ?? "Timeline"),
    order: raw.order ?? 0,
  };
}

function mapLeadership(raw: RawLeadershipPerson): LeadershipPerson {
  return {
    name: raw.name ?? "",
    role: raw.role ?? "",
    group: raw.group ?? "board",
    order: raw.order ?? 0,
    portrait: mapMedia(raw.portrait, raw.name ?? "Leadership"),
    biography: raw.biography,
  };
}

/** Fetch all published timeline items from CMS, sorted by order. */
export async function getTimelineItems(): Promise<TimelineItem[]> {
  const res = await strapiFetch<StrapiCollectionResponse<RawTimelineItem>>(
    "timeline-items",
    { query: TIMELINE_QUERY, revalidate: 120 },
  );

  if (!res?.data?.length) return [];

  return res.data.map((item) => mapTimelineItem(item));
}

/** Fetch all published leadership people from CMS, sorted by order. */
export async function getLeadershipPeople(): Promise<LeadershipPerson[]> {
  const res = await strapiFetch<StrapiCollectionResponse<RawLeadershipPerson>>(
    "leadership-people",
    { query: LEADERSHIP_QUERY, revalidate: 120 },
  );

  if (!res?.data?.length) return [];

  return res.data.map((item) => mapLeadership(item));
}
