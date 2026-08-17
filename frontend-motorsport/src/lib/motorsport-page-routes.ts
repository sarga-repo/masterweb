import "server-only";

import { fetchStrapiSingle } from "@/lib/strapi/client";
import type { Locale } from "@/lib/i18n/config";

export const MOTORSPORT_APPROVED_PAGE_PATHS = [
  "/",
  "/about",
  "/events",
  "/news",
  "/gallery",
  "/merchandise",
  "/tickets",
  "/contact",
  "/partners",
  "/experience",
] as const;

export type MotorsportPagePath = (typeof MOTORSPORT_APPROVED_PAGE_PATHS)[number];

const PAGE_DEFINITIONS = [
  { endpoint: "motorsport-home-page", defaultPath: "/" },
  { endpoint: "motorsport-about-page", defaultPath: "/about" },
  { endpoint: "motorsport-events-page", defaultPath: "/events" },
  { endpoint: "motorsport-news-page", defaultPath: "/news" },
  { endpoint: "motorsport-gallery-page", defaultPath: "/gallery" },
  { endpoint: "motorsport-merchandise-page", defaultPath: "/merchandise" },
  { endpoint: "motorsport-tickets-page", defaultPath: "/tickets" },
  { endpoint: "motorsport-contact-page", defaultPath: "/contact" },
  { endpoint: "motorsport-partners-page", defaultPath: "/partners" },
  { endpoint: "motorsport-experience-page", defaultPath: "/experience" },
] as const satisfies ReadonlyArray<{
  endpoint: string;
  defaultPath: MotorsportPagePath;
}>;

type RouteDocument = { routePath?: string; routeAliases?: unknown };

export function isMotorsportPagePath(value: unknown): value is MotorsportPagePath {
  return typeof value === "string" && (MOTORSPORT_APPROVED_PAGE_PATHS as readonly string[]).includes(value);
}

/**
 * Returns the published route values managed by the Motorsport page single
 * types. A CMS outage never breaks public navigation: canonical code routes
 * remain the fallback.
 */
export async function getMotorsportPageRoutes(locale: Locale = "en") {
  const records = await Promise.all(
    PAGE_DEFINITIONS.map(async (definition) => ({
      definition,
      response: await fetchStrapiSingle<RouteDocument>(definition.endpoint, {
        locale,
        revalidate: 0,
      }),
    })),
  );

  const resolved = new Map<string, MotorsportPagePath>();
  for (const { definition, response } of records) {
    const candidate = response?.data?.routePath;
    // A duplicated or invalid CMS path must not replace the canonical route.
    if (isMotorsportPagePath(candidate) && !Array.from(resolved.values()).includes(candidate)) {
      resolved.set(definition.defaultPath, candidate);
    } else {
      resolved.set(definition.defaultPath, definition.defaultPath);
    }
  }
  return resolved;
}

export async function resolveMotorsportPageRoute(
  canonicalPath: string,
  locale: Locale = "en",
) {
  const routes = await getMotorsportPageRoutes(locale);
  return routes.get(canonicalPath) ?? canonicalPath;
}

