import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo/metadata";
import Link from "next/link";

import { PageHero, NewsArticleCard, ScrollReveal } from "@/components";
import { fetchNewsPage } from "@/lib/cms-content";

export const metadata: Metadata = createMetadata({
  title: "News",
  description:
    "Race results, event announcements, turf and venue stories, stable life, jockey features, and equine performance from Sarga Horse Sport.",
  path: "/news",
});

type Params = { searchParams: Promise<{ category?: string }> };

export default async function NewsPage({ searchParams }: Params) {
  const { category } = await searchParams;
  const articles = await fetchNewsPage();

  const categories = Array.from(
    new Set(articles.map((a) => a.category).filter(Boolean) as string[]),
  ).sort();

  const active = category?.toLowerCase();
  const filtered = active
    ? articles.filter((a) => a.category?.toLowerCase() === active)
    : articles;

  const chip = (label: string, value?: string) => {
    const isActive = value ? active === value.toLowerCase() : !active;
    return (
      <Link
        key={label}
        href={
          value
            ? `/news?category=${encodeURIComponent(value.toLowerCase())}`
            : "/news"
        }
        className={`hs-pill border px-5 py-2.5 text-[0.66rem] font-extrabold uppercase tracking-[0.12em] transition-colors ${
          isActive
            ? "border-hs-orange bg-hs-orange/15 text-hs-orange"
            : "border-hs-cream/20 text-hs-cream/60 hover:border-hs-cream/40 hover:text-hs-cream"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <>
      <PageHero
        eyebrow="News & publications"
        title="Every story from the turf."
        description="Race results, jockey stories, turf and venue development, and stable-life editorial - curated by the Sarga Horse Sport team."
        backgroundImage="/media/news-turf-track.png"
        backgroundAlt="Aerial view of a curved championship turf track"
        accent="turf"
      />

      <section className="hs-section hs-shell">
        <div className="flex flex-wrap gap-3">
          {chip("All")}
          {categories.map((c) => chip(c, c))}
        </div>

        {filtered.length > 0 ? (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((article, i) => (
              <ScrollReveal key={article.href} delay={(i % 3) * 90}>
                <NewsArticleCard article={article} priority={i < 3} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="hs-card-glass mt-12 p-12 text-center">
            <p className="hs-display text-2xl text-hs-cream">
              No stories in this category yet.
            </p>
            <Link
              href="/news"
              className="hs-pill mt-6 inline-flex bg-hs-red px-6 py-3 text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-hs-white hover:bg-hs-orange"
            >
              View all news
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
