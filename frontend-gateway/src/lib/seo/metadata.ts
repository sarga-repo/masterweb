import type { Metadata } from "next";
import type { Seo } from "@/lib/strapi/types";
import {
  DEFAULT_LOCALE,
  localeAlternates,
  localizePath,
  type Locale,
} from "@/lib/i18n/config";

function normalizeSiteUrl(value?: string | null) {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed.replace(/\/$/, "");
  }
  return `https://${trimmed.replace(/\/$/, "")}`;
}

export const siteUrl =
  normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
  normalizeSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
  normalizeSiteUrl(process.env.VERCEL_URL) ??
  "http://localhost:3000";

export function resolveSiteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalizedPath === "/" ? "" : normalizedPath}`;
}

export function resolveOgImageUrl(image?: string) {
  if (!image) return undefined;
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }
  return resolveSiteUrl(image);
}

type MetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  seo?: Seo;
  type?: "website" | "article";
  locale?: Locale;
  isFallback?: boolean;
};

export function createMetadata({
  title,
  description,
  path,
  image,
  seo,
  type = "website",
  locale = DEFAULT_LOCALE,
  isFallback = false,
}: MetadataInput): Metadata {
  const localizedPath = localizePath(path, locale);
  const canonical =
    locale === DEFAULT_LOCALE && seo?.canonicalUrl
      ? seo.canonicalUrl
      : resolveSiteUrl(localizedPath);
  const alternatePaths = localeAlternates(path);
  const resolvedTitle = seo?.metaTitle ?? title;
  const resolvedDescription = seo?.metaDescription ?? description;
  const ogTitle = seo?.ogTitle ?? resolvedTitle;
  const ogDescription = seo?.ogDescription ?? resolvedDescription;
  const ogImage = resolveOgImageUrl(seo?.ogImageUrl ?? image);

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
      siteName: "Sarga.co",
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
