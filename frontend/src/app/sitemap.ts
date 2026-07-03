import type { MetadataRoute } from "next";
import { getEcosystemBusinesses } from "@/lib/strapi/ecosystem";
import { getEvents } from "@/lib/strapi/events";
import { getNewsArticles } from "@/lib/strapi/news";
import { siteUrl } from "@/lib/seo/metadata";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [businesses, articles, events] = await Promise.all([
    getEcosystemBusinesses(),
    getNewsArticles(),
    getEvents(),
  ]);
  const staticPaths = [
    "",
    "/about",
    "/about/board-of-directors",
    "/about/company-structure",
    "/ecosystem",
    "/news",
    "/careers",
    "/contact",
    "/ticket-hub",
  ];

  return [
    ...staticPaths.map((path) => ({
      url: `${siteUrl}${path}`,
      changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : 0.7,
    })),
    ...businesses.map((item) => ({
      url: `${siteUrl}/ecosystem/${item.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...articles.map((item) => ({
      url: `${siteUrl}/news/${item.slug}`,
      lastModified: item.publishedDate,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...events
      .filter((item) => item.status !== "hidden")
      .map((item) => ({
        url: `${siteUrl}/ticket-hub/${item.slug}`,
        lastModified: item.eventDate,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
  ];
}
