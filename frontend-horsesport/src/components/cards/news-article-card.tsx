import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";
import type { ArticleCardData } from "@/types/design-system";

type NewsArticleCardProps = {
  article: ArticleCardData;
  feature?: boolean;
  compact?: boolean;
  priority?: boolean;
  /** Surface tone — "cream" for warm editorial (light) sections. */
  tone?: "dark" | "cream";
  className?: string;
};

/** Editorial news card — premium layout with gradient category chip and hover image scale. */
export function NewsArticleCard({
  article,
  feature = false,
  compact = false,
  priority = false,
  tone = "dark",
  className = "",
}: NewsArticleCardProps) {
  const cream = tone === "cream";
  const shell = cream ? "hs-card-glass-light" : "hs-card-glass";
  const dateColor = cream ? "text-hs-espresso/45" : "text-hs-cream/38";
  const titleColor = cream ? "text-hs-espresso" : "text-hs-cream";
  const excerptColor = cream ? "text-hs-espresso/62" : "text-hs-cream/52";
  const readColor = cream ? "text-hs-espresso/60" : "text-hs-cream/60";
  const iconWrap = cream
    ? "grid size-7 place-items-center rounded-full bg-hs-espresso/8 text-hs-espresso"
    : "hs-button-icon size-7";

  return (
    <Link
      href={article.href}
      className={`${shell} group flex h-full overflow-hidden focus-visible:outline-none ${feature || compact ? "flex-col md:flex-row" : "flex-col"} ${className}`}
    >
      <div
        className={`relative overflow-hidden ${feature ? "aspect-[16/10] md:aspect-auto md:w-[48%]" : compact ? "aspect-[16/10] md:w-[42%]" : "aspect-[16/10]"}`}
      >
        {article.image ? (
          <Image
            src={article.image}
            alt={article.imageAlt ?? article.title}
            fill
            priority={priority}
            sizes={
              feature
                ? "(max-width: 768px) 100vw, 50vw"
                : compact
                  ? "(max-width: 768px) 100vw, 40vw"
                  : "(max-width: 768px) 100vw, 33vw"
            }
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-hs-espresso/60" aria-hidden />
        )}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/5"
        />
      </div>
      <div
        className={`flex flex-1 flex-col p-6 ${feature ? "md:justify-center md:p-8" : compact ? "md:justify-center md:p-6" : ""}`}
      >
        <div className="flex items-center gap-3 text-[0.6rem] font-extrabold uppercase tracking-[0.16em]">
          {article.category ? (
            <span className="hs-eyebrow-gradient">{article.category}</span>
          ) : null}
          {article.dateLabel ? (
            <span className={dateColor}>{article.dateLabel}</span>
          ) : null}
        </div>
        <h3
          className={`hs-display mt-3 transition-colors duration-400 group-hover:text-hs-orange ${titleColor} ${feature ? "max-w-[12ch] text-2xl md:text-3xl" : compact ? "text-[1.05rem]" : "text-lg"}`}
        >
          {article.title}
        </h3>
        {article.excerpt ? (
          <p
            className={`mt-3 text-sm leading-6 ${excerptColor} ${feature ? "line-clamp-3 max-w-[34rem]" : "line-clamp-2"}`}
          >
            {article.excerpt}
          </p>
        ) : null}
        <span
          className={`mt-auto inline-flex items-center gap-2 pt-4 text-[0.62rem] font-extrabold uppercase tracking-[0.14em] transition-colors duration-400 group-hover:text-hs-orange ${readColor}`}
        >
          Read story
          <span className={iconWrap}>
            <ArrowRightIcon className="size-3.5" />
          </span>
        </span>
      </div>
    </Link>
  );
}
