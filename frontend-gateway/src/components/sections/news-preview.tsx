import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";
import { resolveContentUrl } from "@/lib/cross-site";
import { formatDisplayDate } from "@/lib/utils";
import type { NewsArticle } from "@/lib/strapi/types";

function StoryMedia({ article }: { article: NewsArticle }) {
  return article.coverImage ? (
    <Image
      src={article.coverImage.url}
      alt={article.coverImage.alt}
      fill
      sizes="(max-width: 1024px) 100vw, 64vw"
      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
    />
  ) : (
    <span className="absolute inset-0 bg-[linear-gradient(145deg,#434343,#1a1f29_58%,#10141b)]" />
  );
}

function articleLink(article: NewsArticle) {
  return resolveContentUrl({
    slug: article.slug,
    contentType: "news",
    siteScope: article.siteScope,
  });
}

export function NewsPreview({ articles }: { articles: NewsArticle[] }) {
  const [featured, ...secondary] = articles;

  return (
    <section
      id="news"
      className="gateway-section-light relative isolate overflow-hidden py-20 sm:py-28 lg:py-36"
    >
      <div className="site-container relative z-10">
        <div className="flex items-center gap-4 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-sarga-text-muted">
          <span className="text-sarga-red-dark">04</span>
          <span className="h-px w-12 bg-sarga-red-dark" />
          <span>Current signal</span>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <h2 className="max-w-[12ch] font-heading text-[clamp(3.25rem,10vw,4rem)] font-bold uppercase leading-[0.86] tracking-[-0.05em] text-sarga-text sm:text-[clamp(3.25rem,4.8vw,4.8rem)]">
            News moves fast.
          </h2>
          <div className="lg:justify-self-end">
            <p className="max-w-lg text-base leading-7 text-sarga-text-muted sm:text-lg">
              Reports from the track, the stable, the venue, and the boardroom.
              One editorial pulse across the Sarga network.
            </p>
            <Link
              href="/news"
              className="group mt-7 inline-flex items-center gap-4 border-b border-sarga-text pb-2 text-[0.65rem] font-extrabold uppercase tracking-[0.16em]"
            >
              Browse all publications
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </div>
        </div>

        {featured ? (
          <div className="mt-16 grid gap-5 lg:mt-20 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="relative">
              {(() => {
                const featuredLink = articleLink(featured);
                return (
                  <Link
                    href={featuredLink.href}
                    className="group relative isolate flex min-h-[34rem] overflow-hidden bg-sarga-black text-white shadow-[0_24px_70px_rgb(16_20_27_/_14%)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-sarga-orange sm:min-h-[42rem]"
                    {...(featuredLink.isExternal
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    <StoryMedia article={featured} />
                    <span className="absolute inset-0 bg-gradient-to-t from-sarga-black via-sarga-black/20 to-transparent" />
                    <div className="relative mt-auto grid w-full gap-6 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-end">
                      <div>
                        <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-sarga-orange">
                          {featured.isHotTopic ? "Featured / " : ""}
                          {formatDisplayDate(featured.publishedDate)}
                        </p>
                        <h3 className="mt-4 max-w-[16ch] font-heading text-3xl font-bold uppercase leading-[0.92] tracking-[-0.03em] sm:text-[2.4rem]">
                          {featured.title}
                        </h3>
                      </div>
                      <span className="flex h-12 w-12 items-center justify-center bg-sarga-red transition-transform duration-300 group-hover:translate-x-1.5 sm:h-14 sm:w-14">
                        <ArrowRightIcon className="h-5 w-5" />
                      </span>
                    </div>
                  </Link>
                );
              })()}
            </div>

            <div className="grid border-t border-sarga-border lg:border-t-0 lg:border-l">
              {secondary.map((article, index) => {
                const link = articleLink(article);
                return (
                  <Link
                    href={link.href}
                    key={article.slug}
                    className="group relative grid min-h-[17rem] gap-6 border-b border-sarga-border py-8 transition-colors duration-300 hover:bg-sarga-light lg:px-8"
                    {...(link.isExternal
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {/* Left accent border on hover */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 bg-sarga-red transition-transform duration-300 group-hover:scale-y-100"
                    />
                    <div className="flex items-start justify-between gap-4">
                      <span className="font-heading text-2xl font-bold text-sarga-red">
                        0{index + 2}
                      </span>
                      <span className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-sarga-text-muted">
                        {formatDisplayDate(article.publishedDate)}
                      </span>
                    </div>
                    <div className="self-end">
                      <h3 className="font-heading text-2xl font-bold uppercase leading-[0.92] tracking-[-0.025em] text-sarga-text sm:text-3xl">
                        {article.title}
                      </h3>
                      <span className="mt-5 inline-flex items-center gap-3 text-[0.62rem] font-extrabold uppercase tracking-[0.15em]">
                        Read the story
                        <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
