import type { Metadata } from "next";

import {
  resolveSiteUrl,
  resolveSocialImageUrl,
  siteConfig,
} from "@/lib/site-config";
import { localeAlternates, localizePath, type Locale } from "@/lib/i18n/config";

/** Optional CMS-driven SEO overrides (mirrors the shared Strapi `seo` shape). */
export type SeoOverrides = {
  metaTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
};

type MetadataInput = {
  title: string;
  description: string;
  /** Route path for canonical + OG url, e.g. "/events/derby". */
  path: string;
  /** Page-specific social image (absolute or site-relative). */
  image?: string;
  seo?: SeoOverrides;
  type?: "website" | "article";
  locale?: Locale;
  isFallback?: boolean;
};

/**
 * Build per-page metadata with canonical URL, Open Graph, and Twitter cards,
 * honouring optional CMS SEO overrides. Pair with the root layout defaults in
 * `app/layout.tsx` (which sets metadataBase + site-wide fallbacks).
 */
export function createMetadata({
  title,
  description,
  path,
  image,
  seo,
  type = "website",
  locale = "en",
  isFallback = locale === "id",
}: MetadataInput): Metadata {
  const canonical =
    locale === "en" && seo?.canonicalUrl
      ? seo.canonicalUrl
      : resolveSiteUrl(localizePath(path, locale));
  const alternatePaths = localeAlternates(path);
  const resolvedTitle = seo?.metaTitle ?? title;
  const resolvedDescription = seo?.metaDescription ?? description;
  const ogTitle = seo?.ogTitle ?? resolvedTitle;
  const ogDescription = seo?.ogDescription ?? resolvedDescription;
  const ogImage = resolveSocialImageUrl(seo?.ogImageUrl ?? image);

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: {
      canonical,
      languages: Object.fromEntries(
        Object.entries(alternatePaths).map(([key, value]) => [
          key,
          resolveSiteUrl(value),
        ]),
      ),
    },
    robots:
      seo?.noIndex || isFallback
        ? { index: false, follow: isFallback }
        : undefined,
    openGraph: {
      type,
      url: canonical,
      siteName: siteConfig.name,
      locale: locale === "id" ? "id_ID" : "en_US",
      alternateLocale: locale === "id" ? ["en_US"] : ["id_ID"],
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}
