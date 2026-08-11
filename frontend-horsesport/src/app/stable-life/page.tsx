import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo/metadata";

import {
  PageHero,
  SectionHeader,
  ScrollReveal,
  NewsArticleCard,
} from "@/components";
import { fetchNewsPage } from "@/lib/cms-content";
import { getRequestLocale } from "@/lib/i18n/request";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return createMetadata({
    title: "Stable Life",
    description:
      "The discipline behind the sport - horses, jockeys, training, veterinary care, and race-day preparation.",
    path: "/stable-life",
    locale,
  });
}

const STABLE_CATEGORIES = ["stable", "jockey", "equine"];

export default async function StableLifePage() {
  const articles = await fetchNewsPage();
  const stable = articles.filter((a) =>
    STABLE_CATEGORIES.some((c) => a.category?.toLowerCase().includes(c)),
  );
  const items = stable.length > 0 ? stable : articles.slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow="Stable Life"
        title="The discipline behind the sport."
        description="Inside the stable - training, veterinary care, jockey routines, and the craft that shapes a champion."
        backgroundImage="/media/news-stable.png"
        backgroundAlt="Elite race horse inside a premium stable interior"
        accent="brown"
      />

      <section className="hs-section hs-shell">
        <ScrollReveal>
          <SectionHeader
            index="01"
            eyebrow="Editorial hub"
            title="Where champions are made."
            description="Nutrition, veterinary care, and the daily routines that shape a championship contender - plus the jockeys and equine athletes at the heart of the sport."
          />
        </ScrollReveal>

        {items.length > 0 ? (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <ScrollReveal key={item.href} delay={(i % 3) * 90}>
                <NewsArticleCard article={item} priority={i < 3} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="hs-card-glass mt-12 p-12 text-center">
            <p className="hs-display text-2xl text-hs-cream">
              Stable stories are on the way.
            </p>
            <p className="mt-3 text-sm text-hs-cream/55">
              Check back soon for stable-life editorial.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
