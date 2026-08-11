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
    title: "Press Releases",
    description:
      "Official corporate announcements and statements from Sarga.co.",
    path: "/news/press-releases",
    locale,
    isFallback: locale === "id",
  });
}

export default function PressReleasesPage({
  searchParams,
}: {
  searchParams: Promise<NewsArchiveSearchParams>;
}) {
  return (
    <NewsArchive
      searchParams={searchParams}
      fixedCategory="press-release"
      basePath="/news/press-releases"
    />
  );
}
