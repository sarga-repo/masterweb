import type { Metadata } from "next";
import type { Seo } from "@/lib/strapi/types";

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
};

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
  const ogImage = resolveOgImageUrl(seo?.ogImageUrl ?? image);

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: { canonical },
    robots: seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type,
      url: canonical,
      siteName: "Sarga.co",
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
