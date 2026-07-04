import "server-only";

import { mapMedia, mapSeo, strapiFetch } from "@/lib/strapi/client";
import type {
  NewsArticle,
  RawNewsArticle,
  StrapiCollectionResponse,
} from "@/lib/strapi/types";
import { newsArticles as mockArticles } from "@/lib/mock-data";

export function mapArticle(raw: RawNewsArticle): NewsArticle {
  return {
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
}): Promise<NewsArticle[]> {
  const pageSize = options?.limit ?? 100;
  const query = `populate[coverImage]=true&populate[seo][populate][ogImage]=true&sort=publishedDate:desc&pagination[pageSize]=${pageSize}`;
  const res = await strapiFetch<StrapiCollectionResponse<RawNewsArticle>>(
    "news-articles",
    { query, revalidate: 60 },
  );

  const articles = res?.data?.length
    ? sortByDateDesc(res.data.map(mapArticle))
    : sortByDateDesc(mockArticles);

  return options?.limit ? articles.slice(0, options.limit) : articles;
}

/** A single article by slug, or null if not found. */
export async function getNewsArticleBySlug(
  slug: string,
): Promise<NewsArticle | null> {
  const query = `filters[slug][$eq]=${encodeURIComponent(slug)}&populate[coverImage]=true&populate[seo][populate][ogImage]=true`;
  const res = await strapiFetch<StrapiCollectionResponse<RawNewsArticle>>(
    "news-articles",
    { query, revalidate: 60 },
  );

  const raw = res?.data?.[0];
  if (raw) return mapArticle(raw);

  return mockArticles.find((article) => article.slug === slug) ?? null;
}
