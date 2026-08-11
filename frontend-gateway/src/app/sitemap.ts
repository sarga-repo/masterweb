import type { MetadataRoute } from "next";
import type { Locale } from "@/lib/i18n/config";
import { localizePath } from "@/lib/i18n/config";
import {
  getEcosystemBusinesses,
  isEcosystemBusinessPageLive,
} from "@/lib/strapi/ecosystem";
import { getEvents } from "@/lib/strapi/events";
import { getNewsArticles } from "@/lib/strapi/news";
import { getJobVacancies } from "@/lib/strapi/jobs";
import {
  getGatewaySitePageByPath,
  isSitePageLive,
} from "@/lib/strapi/site-pages";
import { siteUrl } from "@/lib/seo/metadata";

type SitemapOptions = Omit<MetadataRoute.Sitemap[number], "url" | "alternates">;

function sitemapEntry(
  path: string,
  locale: Locale,
  options: SitemapOptions,
): MetadataRoute.Sitemap[number] {
  return {
    url: `${siteUrl}${localizePath(path, locale)}`,
    ...options,
    alternates: {
      languages: {
        en: `${siteUrl}${localizePath(path, "en")}`,
        id: `${siteUrl}${localizePath(path, "id")}`,
      },
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const managedPagePaths = [
    "/about/history",
    "/about/annual-report",
    "/about/sustainability-report",
  ];
  const staticPaths = [
    "",
    "/about",
    "/about/board-of-directors",
    "/about/company-structure",
    "/ecosystem",
    "/news",
    "/news/press-releases",
    "/careers",
    "/careers/jobs",
    "/contact",
    "/ticket-hub",
  ];

  const [en, id] = await Promise.all(
    (["en", "id"] as const).map(async (locale) => ({
      locale,
      businesses: await getEcosystemBusinesses(locale),
      articles: await getNewsArticles({ locale }),
      events: await getEvents(locale),
      jobs: await getJobVacancies(locale),
      managedPages: await Promise.all(
        managedPagePaths.map((path) => getGatewaySitePageByPath(path, locale)),
      ),
    })),
  );

  const dynamicEntries = [en, id].flatMap((content) => {
    const { locale } = content;
    const translated = <T extends { localization?: { isFallback: boolean } }>(
      item: T,
    ) => locale === "en" || item.localization?.isFallback === false;

    return [
      ...content.managedPages
        .filter((page): page is NonNullable<typeof page> =>
          Boolean(page && isSitePageLive(page) && translated(page)),
        )
        .map((page) =>
          sitemapEntry(page.routePath, locale, {
            changeFrequency: "monthly",
            priority: 0.65,
          }),
        ),
      ...content.businesses
        .filter((item) => isEcosystemBusinessPageLive(item) && translated(item))
        .map((item) =>
          sitemapEntry(`/ecosystem/${item.slug}`, locale, {
            changeFrequency: "monthly",
            priority: 0.7,
          }),
        ),
      ...content.articles.filter(translated).map((item) =>
        sitemapEntry(`/news/${item.slug}`, locale, {
          lastModified: item.publishedDate,
          changeFrequency: "monthly",
          priority: 0.6,
        }),
      ),
      ...content.jobs.filter(translated).map((job) =>
        sitemapEntry(`/careers/jobs/${job.slug}`, locale, {
          lastModified: job.postedDate,
          changeFrequency: "weekly",
          priority: job.vacancyStatus === "open" ? 0.75 : 0.4,
        }),
      ),
      ...content.events
        .filter((item) => item.status !== "hidden" && translated(item))
        .map((item) =>
          sitemapEntry(`/ticket-hub/${item.slug}`, locale, {
            lastModified: item.eventDate,
            changeFrequency: "weekly",
            priority: 0.8,
          }),
        ),
    ];
  });

  // Static Indonesian routes intentionally stay out of the sitemap until their
  // full editorial copy is translated; they remain reachable with noindex.
  return [
    ...staticPaths.map((path) =>
      sitemapEntry(path, "en", {
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.7,
      }),
    ),
    ...dynamicEntries,
  ];
}
