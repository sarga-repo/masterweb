/**
 * Cross-site routing.
 *
 * The gateway teases content that is canonically owned by a dedicated frontend
 * (Motorsport, Horse Sport). These helpers decide where a link should open,
 * following docs/multisite/04_three_site_integration_strategy.md:
 *
 *  - If the content's canonical site is a dedicated frontend and that site is
 *    configured, open there (external, new tab).
 *  - Otherwise open the gateway-local page (internal).
 *
 * Centralised here so every teaser (news, events, ecosystem cards, footer)
 * routes identically instead of repeating `siteScope === "..."` checks.
 */
import { horsesportUrl, motorsportUrl } from "./site-config";
import type { SiteScope } from "./strapi/types";

/** Content types the gateway teases; dedicated sites host the canonical page. */
type ContentType = "news" | "events";

export type ContentLink = { href: string; isExternal: boolean };

/** Dedicated-site URL builder for a given canonical site scope. */
function dedicatedUrl(
  siteScope: SiteScope | undefined,
  path: string,
): string | undefined {
  if (siteScope === "motorsport") return motorsportUrl(path);
  if (siteScope === "horsesport") return horsesportUrl(path);
  return undefined;
}

/**
 * Resolve where a piece of teased content should open.
 *
 * Dedicated sites expose `/news/[slug]` and `/events/[slug]`; the gateway
 * exposes `/news/[slug]` and `/ticket-hub/[slug]`.
 */
export function resolveContentUrl(content: {
  slug: string;
  contentType: ContentType;
  siteScope?: SiteScope;
}): ContentLink {
  const { slug, contentType, siteScope } = content;
  const external = dedicatedUrl(siteScope, `/${contentType}/${slug}`);
  if (external) return { href: external, isExternal: true };

  const localPath =
    contentType === "events" ? `/ticket-hub/${slug}` : `/news/${slug}`;
  return { href: localPath, isExternal: false };
}

/**
 * Resolve the home URL of an ecosystem business that has its own dedicated
 * frontend. Returns `undefined` for businesses that live on the gateway detail
 * page (so callers fall back to `/ecosystem/[slug]`).
 */
export function businessSiteUrl(slug: string): string | undefined {
  if (slug === "sarga-motorsport") return motorsportUrl("/");
  if (slug === "sarga-horse-sport") return horsesportUrl("/");
  return undefined;
}

/** Human-friendly label for a dedicated site, used on cross-site CTAs. */
export function dedicatedSiteLabel(siteScope: SiteScope | undefined): string {
  if (siteScope === "motorsport") return "motorsport site";
  if (siteScope === "horsesport") return "horse sport site";
  return "dedicated site";
}
