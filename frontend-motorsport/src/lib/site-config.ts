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
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001",
  /** Link back to the Sarga.co group gateway. */
  gatewayUrl:
    process.env.NEXT_PUBLIC_GATEWAY_SITE_URL ?? "http://localhost:3000",
} as const;
