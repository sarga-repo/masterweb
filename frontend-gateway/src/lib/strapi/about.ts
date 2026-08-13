import "server-only";

import { mapMedia, strapiFetchLocalized } from "@/lib/strapi/client";
import type { Locale } from "@/lib/i18n/config";
import type {
  LeadershipPerson,
  LocalizationState,
  RawLeadershipPerson,
  RawTimelineItem,
  StrapiCollectionResponse,
  TimelineItem,
} from "@/lib/strapi/types";

const TIMELINE_QUERY =
  "populate[image]=true&sort=order:asc&pagination[pageSize]=100";

const LEADERSHIP_QUERY =
  "filters[siteScope][$in][0]=gateway&filters[siteScope][$in][1]=shared&populate[portrait]=true&sort=order:asc&pagination[pageSize]=100";

function mapTimelineItem(
  raw: RawTimelineItem,
  localization: LocalizationState,
): TimelineItem {
  return {
    localization,
    year: raw.year ?? "",
    label: raw.label ?? "",
    title: raw.title ?? "",
    description: raw.description ?? "",
    image: mapMedia(raw.image, raw.title ?? "Timeline"),
    order: raw.order ?? 0,
  };
}

function mapLeadership(
  raw: RawLeadershipPerson,
  localization: LocalizationState,
): LeadershipPerson {
  return {
    localization,
    name: raw.name ?? "",
    role: raw.role ?? "",
    group: raw.group ?? "board",
    order: raw.order ?? 0,
    portrait: mapMedia(raw.portrait, raw.name ?? "Leadership"),
    biography: raw.summary,
  };
}

/** Fetch all published timeline items from CMS, sorted by order. */
export async function getTimelineItems(
  locale?: Locale,
): Promise<TimelineItem[]> {
  const result = await strapiFetchLocalized<
    StrapiCollectionResponse<RawTimelineItem>
  >("timeline-items", { query: TIMELINE_QUERY, revalidate: 120, locale });
  const res = result.response;

  if (!res?.data?.length) return [];

  const localization = {
    requestedLocale: result.requestedLocale,
    resolvedLocale: result.resolvedLocale,
    isFallback: result.isFallback,
  };
  return res.data.map((item) => mapTimelineItem(item, localization));
}

/** Fetch all published leadership people from CMS, sorted by order. */
export async function getLeadershipPeople(
  locale?: Locale,
): Promise<LeadershipPerson[]> {
  const result = await strapiFetchLocalized<
    StrapiCollectionResponse<RawLeadershipPerson>
  >("leadership-people", { query: LEADERSHIP_QUERY, revalidate: 120, locale });
  const res = result.response;

  if (!res?.data?.length) return [];

  const localization = {
    requestedLocale: result.requestedLocale,
    resolvedLocale: result.resolvedLocale,
    isFallback: result.isFallback,
  };
  return res.data.map((item) => mapLeadership(item, localization));
}
