import Link from "next/link";

import { ArrowUpRightIcon } from "@/components/ui/icons";
import { ResilientImage } from "@/components/ui/resilient-image";
import type { MotorsportArticle } from "@/types/design-system";

type NewsCardProps = {
  article: MotorsportArticle;
  feature?: boolean;
  tone?: "light" | "dark";
};

export function NewsCard({
  article,
  feature = false,
  tone = "dark",
}: NewsCardProps) {
  const light = tone === "light";

  return (
    <article
      className={`group border-t pt-4 ${light ? "border-ms-charcoal/16" : "border-ms-warm-white/15"}`}
    >
      <Link
        href={article.href}
        className={`relative block overflow-hidden bg-ms-charcoal ${feature ? "aspect-[16/9]" : "aspect-[4/3]"}`}
      >
        <ResilientImage
          src={article.image}
          alt={article.imageAlt}
          fallbackSrc="/media/motorcycle-racing-dusk.png"
          fallbackAlt="Motorcycle racers leaning through a circuit corner at dusk"
          fill
          sizes={
            feature
              ? "(max-width: 1024px) 100vw, 66vw"
              : "(max-width: 768px) 100vw, 33vw"
          }
          className="object-cover transition duration-700 ease-(--ease-ms-out) group-hover:scale-[1.03] group-hover:saturate-125"
        />
        <span className="absolute bottom-0 right-0 grid size-14 place-items-center bg-ms-apex-crimson transition-colors group-hover:bg-ms-ignition-orange">
          <ArrowUpRightIcon className="size-5" />
        </span>
      </Link>
      <div className="pt-5">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-[0.62rem] font-bold uppercase tracking-[0.17em]">
          <span
            className={light ? "text-[#712600]" : "text-ms-ignition-orange"}
          >
            {article.category}
          </span>
          <time className={light ? "text-ms-ink-700" : "text-ms-warm-white/36"}>
            {article.publishedLabel}
          </time>
        </div>
        <h3
          className={`mt-4 ${feature ? "ms-heading-feature" : "ms-heading-card"}`}
        >
          <Link href={article.href}>{article.title}</Link>
        </h3>
        {article.excerpt ? (
          <p
            className={`mt-4 max-w-xl text-sm leading-6 ${light ? "text-ms-ink-700" : "text-ms-warm-white/55"}`}
          >
            {article.excerpt}
          </p>
        ) : null}
      </div>
    </article>
  );
}
