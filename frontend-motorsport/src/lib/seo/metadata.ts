import type { Metadata } from "next";
import type { StaticImageData } from "next/image";
import { localeAlternates, localizePath, type Locale } from "@/lib/i18n/config";
import {
  resolveSiteUrl,
  resolveSocialImageUrl,
  siteConfig,
} from "@/lib/site-config";

export type SeoOverrides = {
  metaTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
};

export function createMetadata({
  title,
  description,
  path,
  image,
  seo,
  type = "website",
  locale = "en",
  isFallback = locale === "id",
}: {
  title: string;
  description: string;
  path: string;
  image?: string | StaticImageData;
  seo?: SeoOverrides;
  type?: "website" | "article";
  locale?: Locale;
  isFallback?: boolean;
}): Metadata {
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
