import type { StaticImageData } from "next/image";

function normalizeSiteUrl(value?: string | null) {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed.replace(/\/$/, "");
  }
  return `https://${trimmed.replace(/\/$/, "")}`;
}

export function resolveSiteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.siteUrl}${normalizedPath === "/" ? "" : normalizedPath}`;
}

type SocialImageInput = string | StaticImageData;

export function resolveSocialImageUrl(image?: SocialImageInput) {
  if (!image) return undefined;
  const resolved = typeof image === "string" ? image : image.src;
  if (resolved.startsWith("http://") || resolved.startsWith("https://")) {
    return resolved;
  }
  return resolveSiteUrl(resolved);
}

/**
 * Static brand/site configuration for the Sarga Motorsport frontend.
 * Content that belongs in the CMS is intentionally NOT hardcoded here — this is
 * bootstrap-level metadata only (see docs/motorsport for the full model).
 */
export const siteConfig = {
  name: "Sarga Motorsport",
  shortName: "Sarga Motorsport",
  /** Adrenaline Alchemist brand voice (docs/motorsport/02). */
  tagline: "Racing, amplified.",
  description:
    "The powerhouse of Indonesian motorsport — a premium 360° racing ecosystem of events, campaigns, media, and ticketing.",
  siteKey: process.env.NEXT_PUBLIC_SITE_KEY ?? "sarga-motorsport",
  siteUrl:
    normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
    normalizeSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
    normalizeSiteUrl(process.env.VERCEL_URL) ??
    "http://localhost:3001",
  /** Link back to the Sarga.co group gateway. */
  gatewayUrl:
    normalizeSiteUrl(process.env.NEXT_PUBLIC_GATEWAY_SITE_URL) ??
    "http://localhost:3000",
} as const;
