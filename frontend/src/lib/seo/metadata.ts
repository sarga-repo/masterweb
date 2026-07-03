import type { Metadata } from "next";
import type { Seo } from "@/lib/strapi/types";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

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
  const canonical =
    seo?.canonicalUrl ?? `${siteUrl}${path === "/" ? "" : path}`;
  const resolvedTitle = seo?.metaTitle ?? title;
  const resolvedDescription = seo?.metaDescription ?? description;
  const ogTitle = seo?.ogTitle ?? resolvedTitle;
  const ogDescription = seo?.ogDescription ?? resolvedDescription;
  const ogImage = seo?.ogImageUrl ?? image;

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
