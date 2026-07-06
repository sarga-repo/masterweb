import { mediaUrl, type StrapiMedia } from "@/lib/strapi/client";

export type ResolvedImage = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

/**
 * Map a Strapi media entry to props consumable by the design-system image
 * primitives. Keeps CMS shape out of the presentational components (pages do
 * the mapping, components take plain `src`/`alt`).
 */
export function resolveStrapiImage(
  media: StrapiMedia | null | undefined,
  fallback?: ResolvedImage,
): ResolvedImage | undefined {
  if (!media?.url) return fallback;
  return {
    src: mediaUrl(media.url),
    alt: media.alternativeText ?? fallback?.alt ?? "",
    width: media.width,
    height: media.height,
  };
}
