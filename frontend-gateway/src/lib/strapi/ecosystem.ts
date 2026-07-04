import "server-only";

import { mapMedia, mapSeo, strapiFetch } from "@/lib/strapi/client";
import { mapEvent } from "@/lib/strapi/events";
import { mapArticle } from "@/lib/strapi/news";
import type {
  EcosystemBusiness,
  RawEcosystemBusiness,
  StrapiCollectionResponse,
} from "@/lib/strapi/types";
import { ecosystemBusinesses as mockBusinesses } from "@/lib/mock-data";

const POPULATE =
  "populate[cardImage]=true&populate[heroImage]=true&populate[brandLogo]=true&populate[brandLogoDark]=true&populate[gallery]=true&populate[highlights]=true&populate[relatedArticles][populate][coverImage]=true&populate[relatedEvents][populate][coverImage]=true&populate[seo][populate][ogImage]=true&sort=order:asc&pagination[pageSize]=100";

function mapBusiness(raw: RawEcosystemBusiness): EcosystemBusiness {
  return {
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
    order: raw.order ?? 0,
    cardImage: mapMedia(raw.cardImage, raw.name),
    heroImage: mapMedia(raw.heroImage, raw.name),
    brandLogo: mapMedia(raw.brandLogo, `${raw.name} logo`),
    brandLogoDark: mapMedia(raw.brandLogoDark, `${raw.name} logo (dark)`),
    relatedArticles: raw.relatedArticles?.map(mapArticle),
    relatedEvents: raw.relatedEvents?.map(mapEvent),
    seo: mapSeo(raw.seo),
  };
}

/** All non-hidden ecosystem businesses (docs/05 → Ecosystem Business). */
export async function getEcosystemBusinesses(): Promise<EcosystemBusiness[]> {
  const res = await strapiFetch<StrapiCollectionResponse<RawEcosystemBusiness>>(
    "ecosystem-businesses",
    { query: POPULATE, revalidate: 120 },
  );

  if (!res?.data?.length) {
    return mockBusinesses.filter((business) => business.status !== "hidden");
  }

  return res.data
    .map(mapBusiness)
    .filter((business) => business.status !== "hidden")
    .sort((a, b) => a.order - b.order);
}

/** A single business by slug, or null if not found. */
export async function getEcosystemBusinessBySlug(
  slug: string,
): Promise<EcosystemBusiness | null> {
  const query = `filters[slug][$eq]=${encodeURIComponent(slug)}&populate[cardImage]=true&populate[heroImage]=true&populate[brandLogo]=true&populate[brandLogoDark]=true&populate[gallery]=true&populate[highlights]=true&populate[relatedArticles][populate][coverImage]=true&populate[relatedEvents][populate][coverImage]=true&populate[seo][populate][ogImage]=true`;
  const res = await strapiFetch<StrapiCollectionResponse<RawEcosystemBusiness>>(
    "ecosystem-businesses",
    { query, revalidate: 120 },
  );

  const raw = res?.data?.[0];
  if (raw) return mapBusiness(raw);

  // Fallback to mock data.
  return mockBusinesses.find((business) => business.slug === slug) ?? null;
}
