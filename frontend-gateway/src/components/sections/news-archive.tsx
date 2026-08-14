import Image from "next/image";
import { LocaleLink as Link } from "@/components/i18n/locale-link";
import { EditorialHeading } from "@/components/sections/editorial-heading";
import { InteriorHero } from "@/components/sections/interior-hero";
import { ArrowRightIcon } from "@/components/ui/icons";
import { getNewsArticles } from "@/lib/strapi/news";
import { getGatewaySitePageByPath } from "@/lib/strapi/site-pages";
import type { NewsCategory } from "@/lib/strapi/types";
import { getRequestLocale } from "@/lib/i18n/request";

export const gatewayNewsCategories = [
  "all",
  "news",
  "publication",
  "press-release",
  "report",
  "magazine",
] as const;

export type GatewayNewsCategory = (typeof gatewayNewsCategories)[number];
export type NewsArchiveSearchParams = { category?: string; page?: string };

const categoryLabel = (category: string) => category.replace("-", " ");

function categoryHref(category: GatewayNewsCategory): string {
  if (category === "all") return "/news";
  if (category === "press-release") return "/news/press-releases";
  return `/news?category=${category}`;
}

export async function NewsArchive({
  searchParams,
  fixedCategory,
  basePath = "/news",
}: {
  searchParams: Promise<NewsArchiveSearchParams>;
  fixedCategory?: Exclude<GatewayNewsCategory, "all">;
  basePath?: string;
}) {
  const locale = await getRequestLocale();
  const page = await getGatewaySitePageByPath("/news", locale);
  const query = await searchParams;
  const activeCategory: GatewayNewsCategory = fixedCategory
    ? fixedCategory
    : gatewayNewsCategories.includes(query.category as GatewayNewsCategory)
      ? (query.category as GatewayNewsCategory)
      : "all";
  const newsArticles = await getNewsArticles({
    locale,
    category:
      activeCategory === "all" ? undefined : (activeCategory as NewsCategory),
  });
  const [featured, ...remainingArticles] = newsArticles;
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
  const isPressArchive = activeCategory === "press-release";
  const leadSection = page?.sections.find(
    (section) => section.sectionKey === "lead-story",
  );
  const archiveSection = page?.sections.find(
    (section) => section.sectionKey === "archive-intro",
  );

  const pageHref = (page: number) => {
    const params = new URLSearchParams();
    if (!fixedCategory && activeCategory !== "all") {
      params.set("category", activeCategory);
    }
    if (page > 1) params.set("page", String(page));
    const suffix = params.toString();
    return suffix ? `${basePath}?${suffix}` : basePath;
  };

  return (
    <>
      <InteriorHero
        index="03"
        eyebrow={
          isPressArchive
            ? "Official corporate record"
            : (page?.navigationLabel ?? "Newsroom and record")
        }
        title={
          isPressArchive
            ? "Official releases. On the record."
            : (page?.heroTitle ?? "Signals from every arena.")
        }
        description={
          isPressArchive
            ? "Approved corporate announcements and official statements published by Sarga.co."
            : (page?.heroDescription ??
              "Reporting the decisions, performances, partnerships, and people shaping Sarga's integrated sport and entertainment network.")
        }
        image={{
          url: "/assets/media/leadership/governance-editorial-concept.png",
          alt: "Editorial and corporate leaders in a dark Sarga studio setting",
        }}
        meta={["News", "Press releases", "Magazine", "Reports"]}
      />

      <section className="gateway-section-light relative isolate overflow-hidden py-20 sm:py-28 lg:py-36">
        <div className="site-container relative z-10">
          <nav
            aria-label="Filter newsroom by category"
            className="mb-16 flex gap-8 overflow-x-auto border-b border-sarga-black/15 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {gatewayNewsCategories.map((category) => {
              const active = category === activeCategory;
              return (
                <Link
                  key={category}
                  href={categoryHref(category)}
                  aria-current={active ? "page" : undefined}
                  className={`relative shrink-0 pb-5 text-[0.65rem] font-extrabold uppercase tracking-[0.14em] transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:transition-transform ${
                    active
                      ? "text-sarga-black after:scale-x-100 after:bg-sarga-red"
                      : "text-sarga-text-muted after:scale-x-0 after:bg-sarga-red hover:text-sarga-red hover:after:scale-x-100"
                  }`}
                >
                  {categoryLabel(category)}
                </Link>
              );
            })}
          </nav>
          <EditorialHeading
            index="01"
            eyebrow={
              isPressArchive
                ? "Latest release"
                : (leadSection?.eyebrow ?? "Lead story")
            }
            title={
              isPressArchive
                ? "The latest official statement."
                : (leadSection?.title ?? "What the network is watching.")
            }
            description={
              isPressArchive
                ? "The newest approved corporate release from the Sarga group."
                : (leadSection?.body ??
                  "The latest high-priority story from across Sarga's businesses and live properties.")
            }
          />
          {featured ? (
            <Link
              href={`/news/${featured.slug}`}
              className="group mt-14 grid overflow-hidden bg-sarga-black text-white shadow-[0_24px_70px_rgb(16_20_27_/_14%)] lg:grid-cols-[1.15fr_0.85fr]"
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
                  <span className="text-sarga-orange">
                    {isPressArchive ? "Official release" : "Hot topic"}
                  </span>
                  <time dateTime={featured.publishedDate}>
                    {featured.publishedDate}
                  </time>
                </div>
                <div className="mt-20">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                    {categoryLabel(featured.category)}
                  </p>
                  <h2 className="mt-5 font-heading text-3xl font-bold uppercase leading-[0.92] tracking-[-0.035em] sm:text-[2.4rem]">
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

      <section className="gateway-surface-light-signature gateway-surface-light-signature--left border-t border-sarga-black/10 bg-white py-20 sm:py-28 lg:py-36">
        <div className="site-container relative z-10">
          <div className="flex items-end justify-between gap-8 border-b border-sarga-black pb-6">
            <h2 className="font-heading text-3xl font-bold uppercase tracking-[-0.03em] sm:text-[2.4rem]">
              {isPressArchive
                ? "Release archive"
                : (archiveSection?.title ?? "The editorial desk")}
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
                className="group border-b border-sarga-black/15 py-10 lg:odd:border-r lg:odd:pr-10 lg:even:pl-10"
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
                  <span className="absolute left-5 top-5 font-heading text-2xl font-bold text-white">
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
                <h3 className="mt-5 max-w-xl font-heading text-2xl font-bold uppercase leading-[0.96] tracking-[-0.035em] sm:text-3xl">
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
