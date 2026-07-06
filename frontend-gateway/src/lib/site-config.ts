/**
 * Gateway site configuration.
 *
 * Centralises cross-site URLs and helpers used when the gateway needs to link
 * to other Sarga frontend properties (e.g. the dedicated Motorsport and Horse
 * Sport sites). Higher-level routing (which site a piece of content opens on)
 * lives in `./cross-site`.
 */

function normalizeSiteUrl(value?: string | null): string {
  return (value ?? "").trim().replace(/\/$/, "");
}

function buildUrl(base: string, path: string): string | undefined {
  if (!base) return undefined;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Absolute URL of the dedicated Sarga Motorsport frontend (if configured). */
export const motorsportSiteUrl = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_MOTORSPORT_SITE_URL,
);

/** Absolute URL of the dedicated Sarga Horse Sport frontend (if configured). */
export const horsesportSiteUrl = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_HORSESPORT_SITE_URL,
);

/** True when a dedicated motorsport frontend URL is available. */
export function isMotorsportSiteConfigured(): boolean {
  return Boolean(motorsportSiteUrl);
}

/** True when a dedicated horse sport frontend URL is available. */
export function isHorsesportSiteConfigured(): boolean {
  return Boolean(horsesportSiteUrl);
}

/**
 * Build an absolute URL on the motorsport site.
 * Returns `undefined` when the motorsport site is not configured, so callers
 * can fall back to the gateway-local URL.
 *
 * @example motorsportUrl("/events/race-weekend-indonesia")
 *          → "http://localhost:3001/events/race-weekend-indonesia"
 */
export function motorsportUrl(path: string): string | undefined {
  return buildUrl(motorsportSiteUrl, path);
}

/**
 * Build an absolute URL on the horse sport site.
 * Returns `undefined` when the horse sport site is not configured, so callers
 * can fall back to the gateway-local URL.
 *
 * @example horsesportUrl("/events/sarga-national-derby")
 *          → "http://localhost:3002/events/sarga-national-derby"
 */
export function horsesportUrl(path: string): string | undefined {
  return buildUrl(horsesportSiteUrl, path);
}
