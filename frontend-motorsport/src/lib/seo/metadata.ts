import type { Metadata } from "next";
import type { StaticImageData } from "next/image";
import { localeAlternates, localizePath, type Locale } from "@/lib/i18n/config";
import {
  resolveSiteUrl,
  resolveSocialImageUrl,
  siteConfig,
} from "@/lib/site-config";

export function createMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  locale = "en",
  isFallback = locale === "id",
}: {
  title: string;
  description: string;
  path: string;
  image?: string | StaticImageData;
  type?: "website" | "article";
  locale?: Locale;
  isFallback?: boolean;
}): Metadata {
  const canonical = resolveSiteUrl(localizePath(path, locale));
  const alternatePaths = localeAlternates(path);
  const ogImage = resolveSocialImageUrl(image);
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: Object.fromEntries(
        Object.entries(alternatePaths).map(([key, value]) => [
          key,
          resolveSiteUrl(value),
        ]),
      ),
    },
    robots: isFallback ? { index: false, follow: true } : undefined,
    openGraph: {
      type,
      url: canonical,
      siteName: siteConfig.name,
      locale: locale === "id" ? "id_ID" : "en_US",
      alternateLocale: locale === "id" ? ["en_US"] : ["id_ID"],
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}
