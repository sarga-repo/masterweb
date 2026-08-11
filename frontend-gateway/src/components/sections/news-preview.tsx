import Image from "next/image";
import { LocaleLink as Link } from "@/components/i18n/locale-link";
import { ArrowRightIcon } from "@/components/ui/icons";
import { resolveContentUrl } from "@/lib/cross-site";
import { formatDisplayDate } from "@/lib/utils";
import type { NewsArticle } from "@/lib/strapi/types";

function articleLink(article: NewsArticle) {
  return resolveContentUrl({
    slug: article.slug,
    contentType: "news",
    siteScope: article.siteScope,
  });
}

export function NewsPreview({ articles }: { articles: NewsArticle[] }) {
  return (
    <section
      id="news"
      className="gateway-section-light relative isolate overflow-hidden py-20 sm:py-28 lg:py-36"
    >
      <div className="site-container relative z-10">
        <div className="flex items-center gap-4 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-sarga-text-muted">
          <span className="text-sarga-red-dark">04</span>
          <span className="h-px w-12 bg-sarga-red-dark" />
          <span>Publications</span>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <h2 className="gateway-section-title max-w-[13ch] font-heading uppercase text-sarga-text">
            One network. Many points of view.
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
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {articles.length > 0 ? (
          <div className="mt-14 grid gap-px bg-sarga-text/15 sm:mt-18 lg:mt-20 lg:grid-cols-3">
            {articles.map((article, index) => {
              const link = articleLink(article);
              return (
                <Link
                  href={link.href}
                  key={article.slug}
                  className="group flex min-h-full flex-col bg-[#fbf8f3] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-sarga-orange"
                  {...(link.isExternal
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-sarga-text">
                    {article.coverImage ? (
                      <Image
                        src={article.coverImage.url}
                        alt={article.coverImage.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                      />
                    ) : (
                      <span className="absolute inset-0 bg-[linear-gradient(145deg,#e4301c,#ff623c_42%,#12141b)]" />
                    )}
                    <span className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center bg-sarga-red text-white transition-transform group-hover:translate-x-1">
                      <ArrowRightIcon className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6 sm:p-7 lg:p-8">
                    <div className="flex items-center justify-between gap-4 text-[0.6rem] font-extrabold uppercase tracking-[0.14em]">
                      <span className="text-sarga-red-dark">
                        {article.isHotTopic ? "Featured" : article.category}
                      </span>
                      <span className="text-sarga-text-muted">
                        {formatDisplayDate(article.publishedDate)}
                      </span>
                    </div>
                    <h3 className="gateway-card-title mt-5 font-heading uppercase text-sarga-text">
                      {article.title}
                    </h3>
                    <p className="mt-5 text-sm leading-6 text-sarga-text-muted sm:text-base sm:leading-7">
                      {article.excerpt}
                    </p>
                    <span className="mt-auto pt-8 font-heading text-xl font-extrabold text-sarga-red/28">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}
