import type { MetadataRoute } from "next";

import { fetchArticles, fetchEvents } from "@/lib/cms-data";
import { getIjtcRiders, IJTC_BASE_PATH } from "@/lib/ijtc-data";
import { siteConfig } from "@/lib/site-config";
import { localizePath } from "@/lib/i18n/config";
import { getMotorsportPageRoutes } from "@/lib/motorsport-page-routes";

function sitemapEntry(
  path: string,
  options: Omit<MetadataRoute.Sitemap[number], "url" | "alternates">,
): MetadataRoute.Sitemap[number] {
  return {
    url: `${siteConfig.siteUrl}${localizePath(path, "en")}`,
    ...options,
    alternates: {
      languages: {
        en: `${siteConfig.siteUrl}${localizePath(path, "en")}`,
        id: `${siteConfig.siteUrl}${localizePath(path, "id")}`,
      },
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, events, ijtcRiders, pageRoutes] = await Promise.all([
    fetchArticles().catch(() => []),
    fetchEvents().catch(() => []),
    getIjtcRiders().catch(() => []),
    getMotorsportPageRoutes().catch(() => new Map()),
  ]);

  const staticPaths = [
    "",
    "/about",
    "/events",
    "/news",
    "/gallery",
    "/merchandise",
    "/tickets",
    "/contact",
    "/events/fia-rallycross-world-cup-indonesia-2026",
    "/events/indonesia-junior-talent-cup",
    "/events/indonesia-junior-talent-cup/race-schedule",
    "/events/indonesia-junior-talent-cup/riders",
    "/events/indonesia-junior-talent-cup/standings",
    "/events/indonesia-junior-talent-cup/about",
    "/events/indonesia-junior-talent-cup/regulation",
    "/events/indonesia-junior-talent-cup/become-riders",
  ].map((path) => pageRoutes.get(path) ?? path);

  // These CMS event records remain useful to editors and local demos but must
  // not create duplicate or placeholder URLs in the public search index.
  const excludedEventHrefs = new Set([
    "/events/fia-rallycross-world-cup-indonesia-2026",
    "/events/sample-event",
  ]);

  return [
    ...staticPaths.map((path) =>
      sitemapEntry(path, {
        changeFrequency:
          path === "" ? ("weekly" as const) : ("monthly" as const),
        priority: path === "" ? 1 : 0.7,
      }),
    ),
    ...articles.map((a) =>
      sitemapEntry(a.href, {
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }),
    ),
    ...events
      .filter((e) => !excludedEventHrefs.has(e.href))
      .map((e) =>
        sitemapEntry(e.href, {
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }),
      ),
    ...ijtcRiders.map((rider) =>
      sitemapEntry(`${IJTC_BASE_PATH}/riders/${rider.slug}`, {
        changeFrequency: "monthly" as const,
        priority: 0.65,
      }),
    ),
  ];
}
