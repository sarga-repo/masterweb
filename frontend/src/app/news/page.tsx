import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EditorialHeading } from "@/components/sections/editorial-heading";
import { InteriorHero } from "@/components/sections/interior-hero";
import { ArrowRightIcon } from "@/components/ui/icons";
import { getNewsArticles } from "@/lib/strapi/news";
import type { NewsCategory } from "@/lib/strapi/types";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "News & Publications",
  description:
    "News, reports, press releases, and editorial stories from across Sarga.",
  path: "/news",
});

const categoryLabel = (category: string) => category.replace("-", " ");

const categories = [
  "all",
  "news",
  "publication",
  "press-release",
  "report",
  "magazine",
] as const;

type NewsPageProps = {
  searchParams: Promise<{ category?: string; page?: string }>;
};

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const newsArticles = await getNewsArticles();
  const query = await searchParams;
  const activeCategory = categories.includes(
    query.category as (typeof categories)[number],
  )
    ? (query.category as (typeof categories)[number])
    : "all";
  const filteredArticles =
    activeCategory === "all"
      ? newsArticles
      : newsArticles.filter(
          (article) => article.category === (activeCategory as NewsCategory),
        );
  const [featured, ...remainingArticles] = filteredArticles;
  const pageSize = 6;
  const pageCount = Math.max(1, Math.ceil(remainingArticles.length / pageSize));
  const requestedPage = Number.parseInt(query.page ?? "1", 10);
  const currentPage = Number.isFinite(requestedPage)
    ? Math.min(Math.max(requestedPage, 1), pageCount)
    : 1;
  const articles = remainingArticles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const pageHref = (page: number) => {
    const params = new URLSearchParams();
    if (activeCategory !== "all") params.set("category", activeCategory);
    if (page > 1) params.set("page", String(page));
    const suffix = params.toString();
    return suffix ? `/news?${suffix}` : "/news";
  };

  return (
    <>
      <InteriorHero
        index="03"
        eyebrow="Newsroom and record"
        title="Signals from every arena."
        description="Reporting the decisions, performances, partnerships, and people shaping Sarga's integrated sport and entertainment network."
        meta={["News", "Press releases", "Magazine", "Reports"]}
      />

      <section className="bg-sarga-light py-20 sm:py-28 lg:py-36">
        <div className="site-container">
          <nav
            aria-label="Filter newsroom by category"
            className="mb-14 flex gap-2 overflow-x-auto border-b border-sarga-black/20 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {categories.map((category) => {
              const active = category === activeCategory;
              const href =
                category === "all" ? "/news" : `/news?category=${category}`;
              return (
                <Link
                  key={category}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`shrink-0 px-5 py-3 text-[0.65rem] font-extrabold uppercase tracking-[0.14em] transition-colors ${
                    active
                      ? "bg-sarga-black text-white"
                      : "border border-sarga-black/20 text-sarga-text-muted hover:border-sarga-red hover:text-sarga-red"
                  }`}
                >
                  {categoryLabel(category)}
                </Link>
              );
            })}
          </nav>
          <EditorialHeading
            index="01"
            eyebrow="Lead story"
            title="What the network is watching."
            description="The latest high-priority story from across Sarga's businesses and live properties."
          />
          {featured ? (
            <Link
              href={`/news/${featured.slug}`}
              className="group mt-14 grid overflow-hidden bg-sarga-black text-white lg:grid-cols-[1.15fr_0.85fr]"
            >
              <div className="relative min-h-[22rem] overflow-hidden lg:min-h-[38rem]">
                {featured.coverImage ? (
                  <Image
                    src={featured.coverImage.url}
                    alt={featured.coverImage.alt}
                    fill
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                ) : null}
              </div>
              <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-12">
                <div className="flex items-center justify-between gap-4 text-[0.65rem] font-extrabold uppercase tracking-[0.16em] text-white/50">
                  <span className="text-sarga-orange">Hot topic</span>
                  <time dateTime={featured.publishedDate}>
                    {featured.publishedDate}
                  </time>
                </div>
                <div className="mt-20">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                    {categoryLabel(featured.category)}
                  </p>
                  <h2 className="mt-5 font-heading text-3xl font-black uppercase leading-[0.92] tracking-[-0.035em] sm:text-[2.4rem]">
                    {featured.title}
                  </h2>
                  <p className="mt-6 text-sm leading-7 text-white/58">
                    {featured.excerpt}
                  </p>
                  <span className="mt-10 inline-flex items-center gap-4 text-xs font-extrabold uppercase tracking-[0.16em]">
                    Read the story
                    <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                  </span>
                </div>
              </div>
            </Link>
          ) : (
            <p className="mt-14 border border-sarga-black/20 p-10 text-sm uppercase tracking-[0.16em] text-sarga-text-muted">
              No published stories in this category yet.
            </p>
          )}
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28 lg:py-36">
        <div className="site-container">
          <div className="flex items-end justify-between gap-8 border-b border-sarga-black pb-6">
            <h2 className="font-heading text-3xl font-black uppercase tracking-[-0.03em] sm:text-[2.4rem]">
              The editorial desk
            </h2>
            <span className="hidden text-xs font-bold uppercase tracking-[0.16em] text-sarga-text/45 sm:block">
              {String(remainingArticles.length).padStart(2, "0")} stories
            </span>
          </div>
          <div className="grid lg:grid-cols-2">
            {articles.map((article, index) => (
              <Link
                key={article.slug}
                href={`/news/${article.slug}`}
                className="group border-b border-sarga-black/20 py-10 lg:odd:border-r lg:odd:pr-10 lg:even:pl-10"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-sarga-black">
                  {article.coverImage ? (
                    <Image
                      src={article.coverImage.url}
                      alt={article.coverImage.alt}
                      fill
                      sizes="(min-width: 1024px) 45vw, 100vw"
                      className="object-cover opacity-85 transition duration-700 group-hover:scale-[1.03]"
                    />
                  ) : null}
                  <span className="absolute left-5 top-5 font-heading text-2xl font-black text-white">
                    {String(index + 2).padStart(2, "0")}
                  </span>
                </div>
                <div className="mt-6 flex items-center justify-between text-[0.62rem] font-bold uppercase tracking-[0.15em] text-sarga-text/50">
                  <span className="text-sarga-red">
                    {categoryLabel(article.category)}
                  </span>
                  <time dateTime={article.publishedDate}>
                    {article.publishedDate}
                  </time>
                </div>
                <h3 className="mt-5 max-w-xl font-heading text-2xl font-black uppercase leading-[0.96] tracking-[-0.035em] sm:text-3xl">
                  {article.title}
                </h3>
              </Link>
            ))}
          </div>
          {pageCount > 1 ? (
            <nav
              aria-label="News pagination"
              className="mt-10 flex items-center justify-between border-t border-sarga-black pt-6 text-xs font-extrabold uppercase tracking-[0.14em]"
            >
              {currentPage > 1 ? (
                <Link href={pageHref(currentPage - 1)}>Previous</Link>
              ) : (
                <span className="text-sarga-text/25">Previous</span>
              )}
              <span className="text-sarga-text-muted">
                {currentPage} / {pageCount}
              </span>
              {currentPage < pageCount ? (
                <Link href={pageHref(currentPage + 1)}>Next</Link>
              ) : (
                <span className="text-sarga-text/25">Next</span>
              )}
            </nav>
          ) : null}
        </div>
      </section>
    </>
  );
}
