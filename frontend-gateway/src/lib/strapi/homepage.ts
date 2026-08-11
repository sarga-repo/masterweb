import "server-only";

import {
  mapHeroVideo,
  mapMedia,
  mapSeo,
  strapiFetchLocalized,
} from "@/lib/strapi/client";
import type { Locale } from "@/lib/i18n/config";
import type {
  HomepageContent,
  RawHomepage,
  StrapiSingleResponse,
} from "@/lib/strapi/types";
import { homepage as mockHomepage } from "@/lib/mock-data";

const POPULATE =
  "populate[heroImage]=true&populate[heroImageMobile]=true&populate[heroVideo][populate][primaryVideo]=true&populate[heroVideo][populate][alternateVideo]=true&populate[heroVideo][populate][posterImage]=true&populate[heroVideo][populate][mobilePosterImage]=true&populate[seo][populate][ogImage]=true";

/**
 * Homepage single type (docs/05 → Homepage).
 * Falls back to mock content; CMS-provided fields override mock defaults so
 * editorial extras not modelled in Strapi (about eyebrow/highlights) are kept.
 */
export async function getHomepage(locale?: Locale): Promise<HomepageContent> {
  const result = await strapiFetchLocalized<StrapiSingleResponse<RawHomepage>>(
    "homepage",
    {
      query: POPULATE,
      revalidate: 120,
      locale,
    },
  );

  const raw = result.response?.data;
  const localization = {
    requestedLocale: result.requestedLocale,
    resolvedLocale: raw ? result.resolvedLocale : ("en" as const),
    isFallback: result.isFallback || (!raw && result.requestedLocale === "id"),
  };
  if (!raw) return { ...mockHomepage, localization };

  return {
    ...mockHomepage,
    localization,
    heroEyebrow: raw.heroEyebrow ?? mockHomepage.heroEyebrow,
    heroTitle: raw.heroTitle ?? mockHomepage.heroTitle,
    heroDescription: raw.heroDescription ?? mockHomepage.heroDescription,
    heroImage:
      mapMedia(raw.heroImage, raw.heroTitle ?? "Sarga.co") ??
      mockHomepage.heroImage,
    heroImageMobile:
      mapMedia(raw.heroImageMobile, raw.heroTitle ?? "Sarga.co") ??
      mockHomepage.heroImageMobile,
    heroVideo: mapHeroVideo(raw.heroVideo, raw.heroTitle ?? "Sarga.co"),
    primaryCtaLabel: raw.primaryCtaLabel ?? mockHomepage.primaryCtaLabel,
    primaryCtaUrl: raw.primaryCtaUrl ?? mockHomepage.primaryCtaUrl,
    secondaryCtaLabel: raw.secondaryCtaLabel ?? mockHomepage.secondaryCtaLabel,
    secondaryCtaUrl: raw.secondaryCtaUrl ?? mockHomepage.secondaryCtaUrl,
    aboutSummaryTitle: raw.aboutSummaryTitle ?? mockHomepage.aboutSummaryTitle,
    aboutSummaryBody: raw.aboutSummaryBody ?? mockHomepage.aboutSummaryBody,
    seo: mapSeo(raw.seo) ?? mockHomepage.seo,
  };
}
