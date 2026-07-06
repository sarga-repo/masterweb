import type { Metadata } from "next";

import {
  resolveSiteUrl,
  resolveSocialImageUrl,
  siteConfig,
} from "@/lib/site-config";

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
}: MetadataInput): Metadata {
  const canonical = seo?.canonicalUrl ?? resolveSiteUrl(path);
  const resolvedTitle = seo?.metaTitle ?? title;
  const resolvedDescription = seo?.metaDescription ?? description;
  const ogTitle = seo?.ogTitle ?? resolvedTitle;
  const ogDescription = seo?.ogDescription ?? resolvedDescription;
  const ogImage = resolveSocialImageUrl(seo?.ogImageUrl ?? image);

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: { canonical },
    robots: seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type,
      url: canonical,
      siteName: siteConfig.name,
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
