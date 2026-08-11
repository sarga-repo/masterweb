import "server-only";

import {
  mapMedia,
  mapPageAvailability,
  mapSeo,
  strapiFetchLocalized,
} from "@/lib/strapi/client";
import type { Locale } from "@/lib/i18n/config";
import { mapEvent } from "@/lib/strapi/events";
import { mapArticle } from "@/lib/strapi/news";
import type {
  EcosystemBusiness,
  LocalizationState,
  RawEcosystemBusiness,
  StrapiCollectionResponse,
} from "@/lib/strapi/types";
import { ecosystemBusinesses as mockBusinesses } from "@/lib/mock-data";

const POPULATE =
  "populate[cardImage]=true&populate[heroImage]=true&populate[logo]=true&populate[gallery]=true&populate[highlights]=true&populate[pageAvailability][populate][comingSoonMedia]=true&populate[relatedArticles][populate][coverImage]=true&populate[relatedEvents][populate][coverImage]=true&populate[seo][populate][ogImage]=true&sort=order:asc&pagination[pageSize]=100";

function mapBusiness(
  raw: RawEcosystemBusiness,
  localization?: LocalizationState,
): EcosystemBusiness {
  return {
    localization,
    name: raw.name,
    slug: raw.slug,
    pillar: raw.pillar,
    shortDescription: raw.shortDescription,
    overview: raw.overview,
    highlights: raw.highlights,
    gallery: raw.gallery
      ?.map((image) => mapMedia(image, raw.name))
      .filter((image) => image !== undefined),
    ctaLabel: raw.ctaLabel ?? "Find Out More",
    ctaUrl: raw.ctaUrl,
    status: raw.businessStatus ?? "active",
    launchTarget: raw.launchTarget,
    pageAvailability: mapPageAvailability(raw.pageAvailability, raw.name),
    order: raw.order ?? 0,
    cardImage: mapMedia(raw.cardImage, raw.name),
    heroImage: mapMedia(raw.heroImage, raw.name),
    brandLogo: mapMedia(raw.brandLogo ?? raw.logo, `${raw.name} logo`),
    brandLogoDark: mapMedia(raw.brandLogoDark, `${raw.name} logo (dark)`),
    dedicatedSiteKey: raw.dedicatedSiteKey,
    dedicatedSiteUrl: raw.dedicatedSiteUrl,
    relatedArticles: raw.relatedArticles?.map((item) =>
      mapArticle(item, localization),
    ),
    relatedEvents: raw.relatedEvents?.map((item) =>
      mapEvent(item, localization),
    ),
    seo: mapSeo(raw.seo),
  };
}

/** All non-hidden ecosystem businesses (docs/05 → Ecosystem Business). */
export async function getEcosystemBusinesses(
  locale?: Locale,
): Promise<EcosystemBusiness[]> {
  const result = await strapiFetchLocalized<
    StrapiCollectionResponse<RawEcosystemBusiness>
  >("ecosystem-businesses", { query: POPULATE, revalidate: 120, locale });
  const res = result.response;
  const localization = {
    requestedLocale: result.requestedLocale,
    resolvedLocale: result.resolvedLocale,
    isFallback: result.isFallback,
  };

  if (res) {
    return res.data
      .map((item) => mapBusiness(item, localization))
      .filter((business) => business.status !== "hidden")
      .sort((a, b) => a.order - b.order);
  }

  return mockBusinesses
    .filter((business) => business.status !== "hidden")
    .map((business) => ({
      ...business,
      localization: {
        ...localization,
        resolvedLocale: "en",
        isFallback: result.requestedLocale === "id",
      },
    }));
}

/** A single business by slug, or null if not found. */
export async function getEcosystemBusinessBySlug(
  slug: string,
  locale?: Locale,
): Promise<EcosystemBusiness | null> {
  const query = `filters[slug][$eq]=${encodeURIComponent(slug)}&populate[cardImage]=true&populate[heroImage]=true&populate[logo]=true&populate[gallery]=true&populate[highlights]=true&populate[pageAvailability][populate][comingSoonMedia]=true&populate[relatedArticles][populate][coverImage]=true&populate[relatedEvents][populate][coverImage]=true&populate[seo][populate][ogImage]=true`;
  const result = await strapiFetchLocalized<
    StrapiCollectionResponse<RawEcosystemBusiness>
  >("ecosystem-businesses", { query, revalidate: 120, locale });
  const res = result.response;
  const localization = {
    requestedLocale: result.requestedLocale,
    resolvedLocale: result.resolvedLocale,
    isFallback: result.isFallback,
  };

  if (res) {
    const raw = res.data[0];
    return raw ? mapBusiness(raw, localization) : null;
  }

  // Fallback to mock data.
  const fallback = mockBusinesses.find((business) => business.slug === slug);
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

/** True when this business belongs on a separately deployed Sarga site. */
export function isDedicatedSiteBusiness(business: EcosystemBusiness): boolean {
  return (
    business.dedicatedSiteKey === "motorsport" ||
    business.dedicatedSiteKey === "horsesport" ||
    business.slug === "sarga-motorsport" ||
    business.slug === "sarga-horse-sport"
  );
}

/** Full internal page eligibility. Disabled/incomplete pages stay Coming Soon. */
export function isEcosystemBusinessPageLive(
  business: EcosystemBusiness,
): boolean {
  if (business.status === "hidden" || isDedicatedSiteBusiness(business)) {
    return false;
  }
  const enabled =
    business.pageAvailability?.pageEnabled ?? business.status === "active";
  return Boolean(
    enabled && business.overview?.trim() && business.highlights?.length,
  );
}
