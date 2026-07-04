import "server-only";

import { mapMedia, mapSeo, strapiFetch } from "@/lib/strapi/client";
import type {
  HomepageContent,
  RawHomepage,
  StrapiSingleResponse,
} from "@/lib/strapi/types";
import { homepage as mockHomepage } from "@/lib/mock-data";

const POPULATE =
  "populate[heroImage]=true&populate[heroImageMobile]=true&populate[seo][populate][ogImage]=true";

/**
 * Homepage single type (docs/05 → Homepage).
 * Falls back to mock content; CMS-provided fields override mock defaults so
 * editorial extras not modelled in Strapi (about eyebrow/highlights) are kept.
 */
export async function getHomepage(): Promise<HomepageContent> {
  const res = await strapiFetch<StrapiSingleResponse<RawHomepage>>("homepage", {
    query: POPULATE,
    revalidate: 120,
  });

  const raw = res?.data;
  if (!raw) return mockHomepage;

  return {
    ...mockHomepage,
    heroEyebrow: raw.heroEyebrow ?? mockHomepage.heroEyebrow,
    heroTitle: raw.heroTitle ?? mockHomepage.heroTitle,
    heroDescription: raw.heroDescription ?? mockHomepage.heroDescription,
    heroImage:
      mapMedia(raw.heroImage, raw.heroTitle ?? "Sarga.co") ??
      mockHomepage.heroImage,
    heroImageMobile:
      mapMedia(raw.heroImageMobile, raw.heroTitle ?? "Sarga.co") ??
      mockHomepage.heroImageMobile,
    primaryCtaLabel: raw.primaryCtaLabel ?? mockHomepage.primaryCtaLabel,
    primaryCtaUrl: raw.primaryCtaUrl ?? mockHomepage.primaryCtaUrl,
    secondaryCtaLabel: raw.secondaryCtaLabel ?? mockHomepage.secondaryCtaLabel,
    secondaryCtaUrl: raw.secondaryCtaUrl ?? mockHomepage.secondaryCtaUrl,
    aboutSummaryTitle: raw.aboutSummaryTitle ?? mockHomepage.aboutSummaryTitle,
    aboutSummaryBody: raw.aboutSummaryBody ?? mockHomepage.aboutSummaryBody,
    seo: mapSeo(raw.seo) ?? mockHomepage.seo,
  };
}
