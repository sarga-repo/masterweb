/**
 * Shared Strapi CMS connection settings for the motorsport frontend.
 *
 * The full typed content services arrive in later phases; this bootstrap module
 * only centralizes environment reading so the app is wired to the same CMS as
 * the gateway (siteScope "motorsport" / "shared").
 */
export const strapiConfig = {
  /**
   * Server-side base URL. Precedence mirrors the gateway client so both
   * frontends resolve identically: explicit server URL, then the internal
   * Docker service hostname, then the public URL, then localhost.
   */
  apiUrl:
    process.env.STRAPI_API_URL ??
    process.env.STRAPI_API_URL_INTERNAL ??
    process.env.NEXT_PUBLIC_STRAPI_API_URL ??
    "http://localhost:1337",
  /** Browser-reachable base URL for absolute media/image links. */
  publicApiUrl:
    process.env.NEXT_PUBLIC_STRAPI_API_URL ?? "http://localhost:1337",
  /** Server-only read token; blank in local dev (public read via seed). */
  apiToken: process.env.STRAPI_API_TOKEN ?? "",
} as const;

export function hasStrapiToken(): boolean {
  return strapiConfig.apiToken.length > 0;
}
