/**
 * Gateway site configuration.
 *
 * Centralises cross-site URLs and helpers used when the gateway needs to link
 * to other Sarga frontend properties (e.g. the dedicated Motorsport site).
 */

/** Absolute URL of the dedicated Sarga Motorsport frontend (if configured). */
export const motorsportSiteUrl = (
  process.env.NEXT_PUBLIC_MOTORSPORT_SITE_URL ?? ""
).replace(/\/$/, "");

/** True when a dedicated motorsport frontend URL is available. */
export function isMotorsportSiteConfigured(): boolean {
  return Boolean(motorsportSiteUrl);
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
  if (!isMotorsportSiteConfigured()) return undefined;
  return `${motorsportSiteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
