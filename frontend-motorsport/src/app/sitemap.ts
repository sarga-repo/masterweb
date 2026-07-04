import type { MetadataRoute } from "next";

import { fetchArticles, fetchEvents } from "@/lib/cms-data";
import { siteConfig } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, events] = await Promise.all([
    fetchArticles().catch(() => []),
    fetchEvents().catch(() => []),
  ]);

  const staticPaths = [
    "",
    "/about",
    "/events",
    "/news",
    "/tickets",
    "/contact",
  ];

  return [
    ...staticPaths.map((path) => ({
      url: `${siteConfig.siteUrl}${path}`,
      changeFrequency:
        path === "" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : 0.7,
    })),
    ...articles.map((a) => ({
      url: `${siteConfig.siteUrl}${a.href}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...events.map((e) => ({
      url: `${siteConfig.siteUrl}${e.href}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
