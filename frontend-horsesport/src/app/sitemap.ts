import type { MetadataRoute } from "next";

import { fetchEventsPage, fetchNewsPage } from "@/lib/cms-content";
import { siteConfig } from "@/lib/site-config";

const STATIC_PATHS = [
  "",
  "/about",
  "/events",
  "/tickets",
  "/news",
  "/gallery",
  "/venues",
  "/stable-life",
  "/partners",
  "/contact",
];

/**
 * Site-specific sitemap: static routes plus dynamic event/news detail pages
 * from the shared CMS (scoped to Horse Sport). Each dedicated frontend owns the
 * canonical URLs for its own content (docs/multisite/04).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [events, articles] = await Promise.all([
    fetchEventsPage(),
    fetchNewsPage(),
  ]);

  const staticEntries = STATIC_PATHS.map((path) => ({
    url: `${siteConfig.siteUrl}${path}`,
    changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
    priority: path === "" ? 1 : 0.7,
  }));

  const eventEntries = events.map((event) => ({
    url: `${siteConfig.siteUrl}${event.href}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const articleEntries = articles.map((article) => ({
    url: `${siteConfig.siteUrl}${article.href}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...eventEntries, ...articleEntries];
}
