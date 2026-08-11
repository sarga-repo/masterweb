import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/i18n/locale-link";
import { notFound } from "next/navigation";

import {
  Breadcrumbs,
  PageHero,
  RichText,
  SeoJsonLd,
  ArrowRightIcon,
} from "@/components";
import { fetchArticleDetail, fetchNewsPage } from "@/lib/cms-content";
import { createMetadata } from "@/lib/seo/metadata";
import { resolveSiteUrl, siteConfig } from "@/lib/site-config";
import { getRequestLocale } from "@/lib/i18n/request";
import { localizePath } from "@/lib/i18n/config";

type Params = { params: Promise<{ slug: string }> };

/** Pre-render known article slugs; unknown slugs render the not-found UI
 *  (dynamicParams stays true so new CMS articles still render on demand). */
export async function generateStaticParams() {
  const articles = await fetchNewsPage();
  return articles.map((article) => ({
    slug: article.href.replace(/^\/news\//, ""),
  }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const article = await fetchArticleDetail(slug);
  if (!article) notFound();
  return createMetadata({
    title: article.title,
    description: article.excerpt ?? `${article.title} - Sarga Horse Sport.`,
    path: `/news/${slug}`,
    image: article.image,
    type: "article",
    locale,
  });
}

export default async function NewsDetailPage({ params }: Params) {
  const [{ slug }, locale] = await Promise.all([params, getRequestLocale()]);
  const article = await fetchArticleDetail(slug);
  if (!article) notFound();

  const meta = [article.category, article.dateLabel, article.author]
    .filter(Boolean)
    .join(" · ");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    mainEntityOfPage: resolveSiteUrl(localizePath(`/news/${slug}`, locale)),
    inLanguage: locale === "id" ? "id-ID" : "en-US",
    ...(article.publishedIso ? { datePublished: article.publishedIso } : {}),
    ...(article.excerpt ? { description: article.excerpt } : {}),
    ...(article.image ? { image: article.image } : {}),
    author: {
      "@type": article.author ? "Person" : "Organization",
      name: article.author ?? siteConfig.name,
    },
    publisher: { "@type": "Organization", name: siteConfig.name },
  };

  return (
    <>
      <SeoJsonLd data={jsonLd} />
      <PageHero
        eyebrow={article.category ?? "Story"}
        title={article.title}
        description={meta || undefined}
        backgroundImage={article.image}
        backgroundAlt={article.imageAlt ?? article.title}
        accent="turf"
      >
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "News", href: "/news" },
            { label: article.title },
          ]}
        />
      </PageHero>

      <article className="hs-section hs-shell">
        <div className="mx-auto max-w-[var(--spacing-reading)]">
          {article.excerpt ? (
            <p className="hs-display text-[clamp(1.3rem,3vw,1.9rem)] leading-snug text-hs-cream">
              {article.excerpt}
            </p>
          ) : null}
          <div className="mt-8 border-t border-hs-cream/12 pt-8">
            <RichText value={article.body ?? article.excerpt} />
          </div>

          <div className="mt-12">
            <Link
              href="/news"
              className="group inline-flex items-center gap-2 text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-hs-cream/70 hover:text-hs-orange"
            >
              <ArrowRightIcon className="size-4 rotate-180 transition-transform group-hover:-translate-x-1" />
              All news & stories
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
