import "server-only";

import { mapMedia, mapSeo, strapiFetchLocalized } from "@/lib/strapi/client";
import type { Locale } from "@/lib/i18n/config";
import type {
  NewsArticle,
  LocalizationState,
  RawNewsArticle,
  StrapiCollectionResponse,
} from "@/lib/strapi/types";
import { newsArticles as mockArticles } from "@/lib/mock-data";

export function mapArticle(
  raw: RawNewsArticle,
  localization?: LocalizationState,
): NewsArticle {
  return {
    localization,
    title: raw.title,
    slug: raw.slug,
    excerpt: raw.excerpt ?? "",
    body: raw.body,
    category: raw.category ?? "news",
    publishedDate: raw.publishedDate ?? "",
    isHotTopic: raw.isHotTopic ?? false,
    author: raw.author,
    coverImage: mapMedia(raw.coverImage, raw.title),
    siteScope: raw.siteScope,
    seo: mapSeo(raw.seo),
  };
}

function sortByDateDesc(articles: NewsArticle[]): NewsArticle[] {
  return [...articles].sort((a, b) =>
    b.publishedDate.localeCompare(a.publishedDate),
  );
}

/** News articles, newest first (docs/05 → News Article). Optional `limit`. */
export async function getNewsArticles(options?: {
  limit?: number;
  category?: NewsArticle["category"];
  locale?: Locale;
}): Promise<NewsArticle[]> {
  const pageSize = options?.limit ?? 100;
  const categoryFilter = options?.category
    ? `filters[category][$eq]=${encodeURIComponent(options.category)}&`
    : "";
  const query = `${categoryFilter}populate[coverImage]=true&populate[seo][populate][ogImage]=true&sort=publishedDate:desc&pagination[pageSize]=${pageSize}`;
  const result = await strapiFetchLocalized<
    StrapiCollectionResponse<RawNewsArticle>
  >("news-articles", { query, revalidate: 60, locale: options?.locale });
  const res = result.response;
  const localization: LocalizationState = {
    requestedLocale: result.requestedLocale,
    resolvedLocale: result.resolvedLocale,
    isFallback: result.isFallback,
  };

  const articles = res
    ? sortByDateDesc(res.data.map((item) => mapArticle(item, localization)))
    : sortByDateDesc(
        options?.category
          ? mockArticles.filter(
              (article) => article.category === options.category,
            )
          : mockArticles,
      ).map<NewsArticle>((item) => ({
        ...item,
        localization: {
          ...localization,
          resolvedLocale: "en",
          isFallback: result.requestedLocale === "id",
        },
      }));

  return options?.limit ? articles.slice(0, options.limit) : articles;
}

/** A single article by slug, or null if not found. */
export async function getNewsArticleBySlug(
  slug: string,
  locale?: Locale,
): Promise<NewsArticle | null> {
  const query = `filters[slug][$eq]=${encodeURIComponent(slug)}&populate[coverImage]=true&populate[seo][populate][ogImage]=true`;
  const result = await strapiFetchLocalized<
    StrapiCollectionResponse<RawNewsArticle>
  >("news-articles", { query, revalidate: 60, locale });
  const res = result.response;
  const localization: LocalizationState = {
    requestedLocale: result.requestedLocale,
    resolvedLocale: result.resolvedLocale,
    isFallback: result.isFallback,
  };

  const raw = res?.data?.[0];
  if (raw) return mapArticle(raw, localization);

  const fallback = mockArticles.find((article) => article.slug === slug);
  return fallback
    ? {
        ...fallback,
        localization: {
          ...localization,
          resolvedLocale: "en",
          isFallback: result.requestedLocale === "id",
        },
      }
    : null;
}
