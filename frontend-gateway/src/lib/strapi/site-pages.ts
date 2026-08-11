import "server-only";

import type { Metadata } from "next";
import {
  mapMedia,
  mapPageAvailability,
  mapSeo,
  strapiFetchLocalized,
} from "@/lib/strapi/client";
import type { Locale } from "@/lib/i18n/config";
import type {
  RawSitePage,
  LocalizationState,
  SitePage,
  StrapiCollectionResponse,
} from "@/lib/strapi/types";
import { createMetadata } from "@/lib/seo/metadata";

const POPULATE =
  "populate[heroMedia]=true&populate[pageAvailability][populate][comingSoonMedia]=true&populate[sections]=true&populate[seo][populate][ogImage]=true";

const gatewayPageFallbacks: Record<string, SitePage> = {
  "/about/history": {
    title: "Sarga History",
    slug: "gateway-history",
    routePath: "/about/history",
    siteScope: "gateway",
    pageKind: "history",
    navigationLabel: "History",
    heroTitle: "Built across every arena.",
    heroDescription:
      "A living record of the decisions, partnerships, and operating milestones that shaped Sarga's integrated ecosystem.",
    pageAvailability: {
      pageEnabled: true,
      showNotifyCta: false,
      noIndexWhileDisabled: true,
    },
    sections: [
      {
        sectionKey: "history-record",
        eyebrow: "Corporate record",
        title: "The group trajectory",
        body: "Published milestones are managed through the shared corporate timeline.",
        theme: "light",
      },
    ],
  },
  "/about/annual-report": {
    title: "Annual Report",
    slug: "gateway-annual-report",
    routePath: "/about/annual-report",
    siteScope: "gateway",
    pageKind: "reportIndex",
    navigationLabel: "Annual Report",
    heroTitle: "Performance, documented.",
    heroDescription:
      "Approved annual reports and corporate performance publications from the Sarga ecosystem.",
    pageAvailability: {
      pageEnabled: true,
      showNotifyCta: false,
      noIndexWhileDisabled: true,
    },
    sections: [
      {
        sectionKey: "annual-report-library",
        eyebrow: "Annual reporting",
        title: "Approved publications",
        body: "No annual report file is published yet. Approved files and destinations will appear here when supplied through Strapi.",
        theme: "light",
      },
    ],
  },
  "/about/sustainability-report": {
    title: "Sustainability Report",
    slug: "gateway-sustainability-report",
    routePath: "/about/sustainability-report",
    siteScope: "gateway",
    pageKind: "reportIndex",
    navigationLabel: "Sustainability Report",
    heroTitle: "Progress with a longer horizon.",
    heroDescription:
      "Approved sustainability reporting across sport, venues, operations, communities, and responsible growth.",
    pageAvailability: {
      pageEnabled: true,
      showNotifyCta: false,
      noIndexWhileDisabled: true,
    },
    sections: [
      {
        sectionKey: "sustainability-report-library",
        eyebrow: "Sustainability reporting",
        title: "Commitments and evidence",
        body: "No sustainability report file is published yet. Approved reports will appear here when supplied through Strapi.",
        theme: "light",
      },
    ],
  },
};

function mapSitePage(
  raw: RawSitePage,
  localization: LocalizationState,
): SitePage {
  return {
    localization,
    title: raw.title,
    slug: raw.slug,
    routePath: raw.routePath,
    siteScope: raw.siteScope,
    pageKind: raw.pageKind,
    navigationLabel: raw.navigationLabel,
    heroTitle: raw.heroTitle,
    heroDescription: raw.heroDescription,
    heroMedia: mapMedia(raw.heroMedia, raw.heroTitle ?? raw.title),
    pageAvailability: mapPageAvailability(
      raw.pageAvailability,
      raw.heroTitle ?? raw.title,
    ),
    sections: (raw.sections ?? []).flatMap((section) => {
      if (!section.sectionKey || !section.title) return [];
      return [
        {
          sectionKey: section.sectionKey,
          eyebrow: section.eyebrow,
          title: section.title,
          body: section.body,
          media: mapMedia(section.media, section.title),
          ctaLabel: section.ctaLabel,
          ctaUrl: section.ctaUrl,
          ctaTarget: section.ctaTarget,
          theme: section.theme,
        },
      ];
    }),
    seo: mapSeo(raw.seo),
  };
}

export function isSitePageLive(page: SitePage): boolean {
  return page.pageAvailability?.pageEnabled ?? true;
}

export function createSitePageMetadata(page: SitePage): Metadata {
  const metadata = createMetadata({
    title: page.title,
    description:
      page.heroDescription ?? `${page.title}, published by Sarga.co.`,
    path: page.routePath,
    image: page.heroMedia?.url,
    seo: page.seo,
    locale: page.localization?.requestedLocale,
    isFallback: page.localization?.isFallback,
  });
  if (
    !isSitePageLive(page) &&
    (page.pageAvailability?.noIndexWhileDisabled ?? true)
  ) {
    metadata.robots = { index: false, follow: true };
  }
  return metadata;
}

export async function getGatewaySitePageByPath(
  routePath: string,
  locale?: Locale,
): Promise<SitePage | null> {
  const query = `filters[routePath][$eq]=${encodeURIComponent(routePath)}&filters[siteScope][$eq]=gateway&${POPULATE}`;
  const result = await strapiFetchLocalized<
    StrapiCollectionResponse<RawSitePage>
  >("site-pages", { query, revalidate: 120, locale });
  const response = result.response;

  if (response) {
    const raw = response.data[0];
    return raw
      ? mapSitePage(raw, {
          requestedLocale: result.requestedLocale,
          resolvedLocale: result.resolvedLocale,
          isFallback: result.isFallback,
        })
      : null;
  }

  const fallback = gatewayPageFallbacks[routePath];
  return fallback
    ? {
        ...fallback,
        localization: {
          requestedLocale: result.requestedLocale,
          resolvedLocale: "en",
          isFallback: result.requestedLocale === "id",
        },
      }
    : null;
}
