import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InteriorHero } from "@/components/sections/interior-hero";
import { SafeRichText } from "@/components/content/safe-rich-text";
import { JsonLd } from "@/components/seo/json-ld";
import { ArrowRightIcon } from "@/components/ui/icons";
import { getNewsArticleBySlug, getNewsArticles } from "@/lib/strapi/news";
import { createMetadata, siteUrl } from "@/lib/seo/metadata";

type ArticlePageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const articles = await getNewsArticles();
  return articles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsArticleBySlug(slug);
  return createMetadata({
    title: article?.title ?? "Article not found",
    description: article?.excerpt ?? "Sarga news article.",
    path: `/news/${slug}`,
    image: article?.coverImage?.url,
    seo: article?.seo,
    type: "article",
  });
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const [article, articles] = await Promise.all([
    getNewsArticleBySlug(slug),
    getNewsArticles(),
  ]);
  if (!article) notFound();
  const related = articles
    .filter((item) => item.slug !== article.slug)
    .sort(
      (a, b) =>
        Number(b.category === article.category) -
        Number(a.category === article.category),
    )
    .slice(0, 2);
  const articleUrl = `${siteUrl}/news/${article.slug}`;
  const shareText = encodeURIComponent(article.title);
  const shareUrl = encodeURIComponent(articleUrl);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: article.title,
          description: article.excerpt,
          datePublished: article.publishedDate,
          author: {
            "@type": article.author ? "Person" : "Organization",
            name: article.author ?? "Sarga.co",
          },
          publisher: { "@type": "Organization", name: "Sarga.co" },
          mainEntityOfPage: `${siteUrl}/news/${article.slug}`,
          image: article.coverImage?.url,
        }}
      />
      <InteriorHero
        index="Story"
        eyebrow={article.category.replace("-", " ")}
        title={article.title}
        description={article.excerpt}
        image={article.coverImage}
        meta={[
          `Published - ${article.publishedDate}`,
          article.author ? `By - ${article.author}` : "Sarga editorial desk",
        ]}
      />

      <article className="gateway-surface-light-signature bg-white py-20 sm:py-28 lg:py-36">
        <div className="site-container grid gap-12 lg:grid-cols-[0.55fr_1.45fr]">
          <aside className="border-t border-sarga-black pt-5 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-sarga-text/45">
            <p>Filed under</p>
            <p className="mt-3 text-sarga-red">
              {article.category.replace("-", " ")}
            </p>
          </aside>
          <div className="max-w-3xl">
            <p className="font-heading text-3xl font-bold leading-[1.02] tracking-[-0.035em] sm:text-5xl">
              {article.excerpt}
            </p>
            <SafeRichText
              content={article.body}
              fallback="Sarga's latest development reflects the value of connecting sporting operations, venue capability, media reach, and technology through one coordinated platform."
              className="mt-12 space-y-7 text-base leading-8 text-sarga-text-muted sm:text-lg sm:leading-9"
            />
            <nav
              aria-label="Share this article"
              className="mt-12 flex flex-wrap gap-3 border-t border-sarga-black/20 pt-6"
            >
              <a
                href={`mailto:?subject=${shareText}&body=${shareUrl}`}
                className="border border-sarga-black/20 px-5 py-3 text-[0.65rem] font-extrabold uppercase tracking-[0.14em]"
              >
                Share by email
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-sarga-black/20 px-5 py-3 text-[0.65rem] font-extrabold uppercase tracking-[0.14em]"
              >
                LinkedIn
              </a>
            </nav>
            <Link
              href="/news"
              className="group mt-14 inline-flex items-center gap-4 border-b border-sarga-black pb-2 text-xs font-extrabold uppercase tracking-[0.16em]"
            >
              Back to newsroom
              <ArrowRightIcon className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>
        </div>
      </article>

      <section className="gateway-surface-light-signature gateway-surface-light-signature--left bg-sarga-light py-20 sm:py-28 lg:py-36">
        <div className="site-container">
          <div className="flex items-end justify-between gap-8 border-b border-sarga-black pb-6">
            <h2 className="font-heading text-3xl font-bold uppercase tracking-[-0.03em] sm:text-[2.4rem]">
              Continue reading
            </h2>
            <span className="hidden text-xs font-bold uppercase tracking-[0.16em] text-sarga-text/45 sm:block">
              Related signals
            </span>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/news/${item.slug}`}
                className="group grid gap-6 border-b border-sarga-black/20 pb-8 sm:grid-cols-[0.8fr_1.2fr]"
              >
                <div className="relative aspect-[3/2] overflow-hidden bg-sarga-black">
                  {item.coverImage ? (
                    <Image
                      src={item.coverImage.url}
                      alt={item.coverImage.alt}
                      fill
                      sizes="(min-width: 1024px) 22vw, 45vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  ) : null}
                </div>
                <div>
                  <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-sarga-red">
                    {item.category.replace("-", " ")}
                  </p>
                  <h3 className="mt-3 font-heading text-2xl font-bold uppercase leading-[0.95] tracking-[-0.035em]">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-sarga-text-muted">
                    {item.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
