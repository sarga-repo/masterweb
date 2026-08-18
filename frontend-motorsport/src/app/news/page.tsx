import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/i18n/locale-link";

import {
  MotorsportPageInformationBand,
  PageComingSoon,
  PageHero,
  PageShell,
} from "@/components";
import { ArrowRightIcon, ArrowUpRightIcon } from "@/components/ui/icons";
import { ResilientImage } from "@/components/ui/resilient-image";
import { fetchArticles, fetchSitePage } from "@/lib/cms-data";
import type { MotorsportArticle } from "@/types/design-system";
import { createMetadata } from "@/lib/seo/metadata";
import { getRequestLocale } from "@/lib/i18n/request";
import { isStrapiPreviewEnabled } from "@/lib/strapi/client";
import { isCmsPageVisible, isCmsSectionVisible } from "@/lib/cms-visibility";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const page = await fetchSitePage("newsHub");
  return createMetadata({
    title: page?.title ?? "News",
    description:
      page?.heroDescription ??
      "Race reports, rider profiles, technical deep-dives, and lifestyle features from the Sarga Motorsport editorial team.",
    path: "/news",
    locale,
    image: page?.heroImage,
    isFallback: locale === "id" && !page,
  });
}

const PLACEHOLDER: MotorsportArticle[] = [
  {
    title: "The line between control and chaos",
    href: "/news/the-line-between-control-and-chaos",
    image: "/media/hero/sarga-motorsport-hero-circuit-golden-hour.jpg",
    imageAlt: "Red touring race car accelerating through a tropical circuit",
    category: "Race Report",
    publishedLabel: "02 Jul 2026",
    excerpt:
      "Inside the cockpit of Sarga's opening race weekend—a masterclass in pressure, precision, and the fine art of going fast.",
  },
  {
    title: "Riders rewrite the racing line",
    href: "/news/riders-rewrite-the-racing-line",
    image: "/media/sarga-motorsport-discipline-motorcycle-daylight.jpg",
    imageAlt: "Superbike race pack leaning through a tropical circuit corner",
    category: "Motorcycle Racing",
    publishedLabel: "28 Jun 2026",
    excerpt:
      "How Indonesia's fastest riders are reshaping the sport—one apex at a time.",
  },
  {
    title: "Building the 360° racing ecosystem",
    href: "/news/building-the-360-racing-ecosystem",
    image: "/media/hero/sarga-motorsport-hero-paddock-ready.jpg",
    imageAlt: "Driver and race crew preparing in a warm daylight paddock",
    category: "Feature",
    publishedLabel: "15 Jun 2026",
    excerpt:
      "From track to grandstand to livestream—how Sarga is engineering an entire motorsport experience.",
  },
  {
    title: "Paddock pass: behind the pit wall",
    href: "/news/paddock-pass-behind-the-pit-wall",
    image: "/media/sarga-motorsport-discipline-endurance-daylight.jpg",
    imageAlt: "Endurance prototype racing through a tropical circuit",
    category: "Lifestyle",
    publishedLabel: "10 Jun 2026",
    excerpt:
      "A rare look at the mechanics, engineers, and people who make every race weekend possible.",
  },
];

export default async function NewsPage() {
  const [page, cmsArticles] = await Promise.all([
    fetchSitePage("newsHub"),
    fetchArticles(),
  ]);
  const isPreview = await isStrapiPreviewEnabled();
  const articles =
    isPreview || cmsArticles.length > 0 ? cmsArticles : PLACEHOLDER;
  const [featured, ...rest] = articles;
  const controlSection = page?.sections.find(
    (section) => section.sectionKey === "news-control",
  );
  const leadSection = page?.sections.find(
    (section) => section.sectionKey === "lead-story",
  );
  const archiveSection = page?.sections.find(
    (section) => section.sectionKey === "archive-intro",
  );
  const galleryCta = page?.sections.find(
    (section) => section.sectionKey === "news-gallery-cta",
  );
  const pageAvailable = isCmsPageVisible(page?.pageAvailability);

  return (
    <PageShell spectrumSeparators>
      {!pageAvailable ? (
        <PageComingSoon
          availability={page?.pageAvailability ?? { pageEnabled: false }}
        />
      ) : (
        <>
          {page?.heroEnabled !== false ? (
            <div
              data-cms-section-key="hero"
              data-cms-enabled="true"
              data-cms-source={page ? "strapi" : "fallback"}
            >
              <PageHero
                kicker={page?.hero?.eyebrow ?? page?.navigationLabel ?? "Editorial / From the paddock"}
                kickerColor="yellow"
                title={page?.hero?.title ?? page?.heroTitle ?? "News"}
                description={
                  page?.hero?.description ??
                  "Race reports, rider profiles, technical detail, and the culture moving Indonesian motorsport forward—across four wheels and two."
                }
                showKicker={page?.hero?.showEyebrow}
                showTitle={page?.hero?.showTitle}
                showDescription={page?.hero?.showDescription}
                showMedia={page?.hero?.showMedia}
                backgroundImage={page?.heroImage}
                backgroundAlt={page?.heroImageAlt || "Sarga Motorsport editorial scene"}
              >
                <div className="border-t border-ms-warm-white/20 pt-5 sm:max-w-xs sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
                  <p className="ms-data-label text-ms-slipstream-teal">
                    Published archive
                  </p>
                  <p className="ms-tabular mt-4 font-display text-6xl leading-none text-ms-warm-white sm:text-7xl">
                    {String(articles.length).padStart(2, "0")}
                  </p>
                  <p className="mt-3 text-sm text-ms-warm-white/58">
                    Motorsport stories
                  </p>
                </div>
              </PageHero>
            </div>
          ) : null}

          {page?.informationBand || isCmsSectionVisible(controlSection) ? (
            <div data-cms-section-key="news-control" data-cms-enabled="true">
              <MotorsportPageInformationBand
                band={page?.informationBand}
                fallback={{
                  isActive: controlSection?.enabled,
                  eyebrow:
                    controlSection?.eyebrow ?? "Editorial control / Motorsport",
                  title: controlSection?.title ?? "Stories at race pace.",
                  description:
                    controlSection?.body ??
                    "Reports, announcements, people, technology, and culture—published from the Motorsport-scoped editorial feed.",
                  metrics: [
                    {
                      label: "Stories",
                      value: String(articles.length).padStart(2, "0"),
                    },
                    { label: "Lead", value: featured?.category ?? "News" },
                    { label: "Feed", value: "Active" },
                  ],
                }}
              />
            </div>
          ) : null}

          {isCmsSectionVisible(leadSection) ||
          isCmsSectionVisible(archiveSection) ? (
            <section className="ms-news-feed-surface ms-editorial-surface ms-section">
              <div className="ms-shell">
                {isCmsSectionVisible(leadSection) && featured ? (
                  <article
                    data-cms-section-key="lead-story"
                    data-cms-enabled="true"
                    className="grid gap-0 border-y border-ms-warm-white/18 lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,.65fr)]"
                  >
                    <Link
                      href={featured.href}
                      className="group relative aspect-[16/10] overflow-hidden bg-ms-cream-200 lg:aspect-auto lg:min-h-[38rem]"
                    >
                      <ResilientImage
                        src={featured.image}
                        alt={featured.imageAlt}
                        fallbackSrc="/media/hero/sarga-motorsport-hero-circuit-golden-hour.jpg"
                        fallbackAlt="Red touring race car on a warm daylight circuit"
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 68vw"
                        className="object-cover transition-transform duration-700 ease-(--ease-ms-out) group-hover:scale-[1.02]"
                      />
                    </Link>
                    <div className="ms-blue-panel flex flex-col justify-between p-7 sm:p-10 lg:p-12">
                      <div>
                        <div className="flex flex-wrap gap-4">
                          <span className="ms-data-label text-ms-electric-yellow">
                            {featured.category}
                          </span>
                          <time className="ms-news-featured-date ms-data-label text-ms-warm-white/52">
                            {featured.publishedLabel}
                          </time>
                        </div>
                        <h2 className="ms-heading-feature mt-8 text-ms-warm-white">
                          <Link href={featured.href}>{featured.title}</Link>
                        </h2>
                        {featured.excerpt ? (
                          <p className="ms-news-featured-excerpt mt-7 text-base leading-7 text-ms-warm-white/68">
                            {featured.excerpt}
                          </p>
                        ) : null}
                      </div>
                      <Link
                        href={featured.href}
                        className="group mt-12 flex items-center justify-between border-t border-ms-warm-white/18 pt-5 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-slipstream-teal"
                      >
                        Read lead story
                        <ArrowUpRightIcon className="size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>
                    </div>
                  </article>
                ) : null}

                {isCmsSectionVisible(archiveSection) && rest.length > 0 ? (
                  <div
                    data-cms-section-key="archive-intro"
                    data-cms-enabled="true"
                    className="ms-news-latest-surface mt-20 p-5 sm:p-8 lg:p-10"
                  >
                    <div className="grid gap-5 border-t border-ms-warm-white/18 pt-5 sm:grid-cols-[1fr_auto] sm:items-end">
                      <div>
                        <p className="ms-news-archive-eyebrow ms-kicker text-ms-electric-yellow">
                          {archiveSection?.eyebrow ?? "Latest dispatches"}
                        </p>
                        <h2 className="ms-news-archive-heading ms-heading-section mt-5 text-ms-warm-white">
                          {archiveSection?.title ?? "The archive."}
                        </h2>
                      </div>
                      <p className="ms-news-archive-order ms-data-label text-ms-slipstream-teal">
                        {archiveSection?.body ?? "Ordered by publication date"}
                      </p>
                    </div>

                    <ol className="mt-10 border-b border-ms-warm-white/18">
                      {rest.map((article, index) => (
                        <li key={article.href}>
                          <article className="group grid gap-6 border-t border-ms-warm-white/18 py-7 sm:grid-cols-[4rem_13rem_minmax(0,1fr)_auto] sm:items-center">
                            <span className="ms-news-archive-index ms-tabular hidden font-display text-2xl text-ms-warm-white/42 sm:block">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <Link
                              href={article.href}
                              className="relative aspect-[16/10] overflow-hidden bg-ms-cream-200"
                            >
                              <ResilientImage
                                src={article.image}
                                alt={article.imageAlt}
                                fallbackSrc="/media/hero/sarga-motorsport-hero-paddock-ready.jpg"
                                fallbackAlt="Sarga Motorsport paddock in warm daylight"
                                fill
                                sizes="13rem"
                                className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                              />
                            </Link>
                            <div>
                              <div className="flex flex-wrap gap-3">
                                <span className="ms-data-label text-ms-electric-yellow">
                                  {article.category}
                                </span>
                                <time className="ms-news-archive-date ms-data-label text-ms-warm-white/48">
                                  {article.publishedLabel}
                                </time>
                              </div>
                              <h3 className="ms-news-archive-title ms-heading-card mt-4 text-ms-warm-white">
                                <Link href={article.href}>{article.title}</Link>
                              </h3>
                              {article.excerpt ? (
                                <p className="ms-news-archive-excerpt mt-3 max-w-2xl text-sm leading-6 text-ms-warm-white/64">
                                  {article.excerpt}
                                </p>
                              ) : null}
                            </div>
                            <Link
                              href={article.href}
                              aria-label={`Read ${article.title}`}
                              className="ms-news-archive-arrow grid size-12 place-items-center border border-ms-warm-white/20 text-ms-slipstream-teal transition-colors hover:border-ms-apex-crimson hover:bg-ms-apex-crimson hover:text-ms-warm-white"
                            >
                              <ArrowUpRightIcon className="size-5" />
                            </Link>
                          </article>
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : null}
              </div>
            </section>
          ) : null}

          {isCmsSectionVisible(galleryCta) ? (
            <section
              data-cms-section-key="news-gallery-cta"
              data-cms-enabled="true"
              className="ms-news-gallery-cta-surface ms-editorial-dark-surface py-16 sm:py-20"
            >
              <div className="ms-shell flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="ms-kicker text-ms-slipstream-teal">
                    {galleryCta?.eyebrow ?? "Visual archive"}
                  </p>
                  <h2 className="ms-heading-feature mt-5 max-w-[14ch]">
                    {galleryCta?.title ??
                      "See the machines behind the stories."}
                  </h2>
                </div>
                <Link
                  href="/gallery"
                  className="group inline-flex items-center gap-4 border-b border-ms-warm-white/35 pb-3 text-[0.66rem] font-black uppercase tracking-[0.16em]"
                >
                  Open gallery
                  <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </section>
          ) : null}
        </>
      )}
    </PageShell>
  );
}
