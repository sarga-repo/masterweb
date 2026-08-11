import type { Metadata } from "next";
import {
  NewsArchive,
  type NewsArchiveSearchParams,
} from "@/components/sections/news-archive";
import { createMetadata } from "@/lib/seo/metadata";
import { getRequestLocale } from "@/lib/i18n/request";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return createMetadata({
    title: "News & Publications",
    description:
      "News, reports, press releases, and editorial stories from across Sarga.",
    path: "/news",
    locale,
    isFallback: locale === "id",
  });
}

export default function NewsPage({
  searchParams,
}: {
  searchParams: Promise<NewsArchiveSearchParams>;
}) {
  return <NewsArchive searchParams={searchParams} />;
}
