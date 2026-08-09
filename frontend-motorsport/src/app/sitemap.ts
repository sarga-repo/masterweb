import type { MetadataRoute } from "next";

import { fetchArticles, fetchEvents } from "@/lib/cms-data";
import { getIjtcRiders, IJTC_BASE_PATH } from "@/lib/ijtc-data";
import { siteConfig } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, events, ijtcRiders] = await Promise.all([
    fetchArticles().catch(() => []),
    fetchEvents().catch(() => []),
    getIjtcRiders().catch(() => []),
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
    "/campaign/fia-rallycross-world-cup-indonesia-2026",
    "/events/indonesia-junior-talent-cup",
    "/events/indonesia-junior-talent-cup/race-schedule",
    "/events/indonesia-junior-talent-cup/riders",
    "/events/indonesia-junior-talent-cup/standings",
    "/events/indonesia-junior-talent-cup/about",
    "/events/indonesia-junior-talent-cup/regulation",
    "/events/indonesia-junior-talent-cup/become-riders",
  ];

  // These CMS event records remain useful to editors and local demos but must
  // not create duplicate or placeholder URLs in the public search index.
  const excludedEventHrefs = new Set([
    "/events/fia-rallycross-world-cup-indonesia-2026",
    "/events/sample-event",
  ]);

  return [
    ...staticPaths.map((path) => ({
      url: `${siteConfig.siteUrl}${path}`,
      changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : 0.7,
    })),
    ...articles.map((a) => ({
      url: `${siteConfig.siteUrl}${a.href}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...events
      .filter((e) => !excludedEventHrefs.has(e.href))
      .map((e) => ({
        url: `${siteConfig.siteUrl}${e.href}`,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ...ijtcRiders.map((rider) => ({
      url: `${siteConfig.siteUrl}${IJTC_BASE_PATH}/riders/${rider.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
  ];
}
