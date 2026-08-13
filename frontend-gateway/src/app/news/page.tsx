import type { Metadata } from "next";
import {
  NewsArchive,
  type NewsArchiveSearchParams,
} from "@/components/sections/news-archive";
import { createMetadata } from "@/lib/seo/metadata";
import { getRequestLocale } from "@/lib/i18n/request";
import { getGatewaySitePageByPath } from "@/lib/strapi/site-pages";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const page = await getGatewaySitePageByPath("/news", locale);
  return createMetadata({
    title: page?.title ?? "News & Publications",
    description:
      page?.heroDescription ??
      "News, reports, press releases, and editorial stories from across Sarga.",
    path: "/news",
    locale,
    image: page?.heroMedia?.url,
    isFallback: page?.localization?.isFallback ?? locale === "id",
  });
}

export default function NewsPage({
  searchParams,
}: {
  searchParams: Promise<NewsArchiveSearchParams>;
}) {
  return <NewsArchive searchParams={searchParams} />;
}
