import Image from "next/image";
import Link from "next/link";

import { ArrowUpRightIcon } from "@/components/ui/icons";
import type { MotorsportArticle } from "@/types/design-system";

type NewsCardProps = {
  article: MotorsportArticle;
  feature?: boolean;
};

export function NewsCard({ article, feature = false }: NewsCardProps) {
  return (
    <article className="group border-t border-ms-warm-white/15 pt-4">
      <Link
        href={article.href}
        className={`relative block overflow-hidden bg-ms-charcoal ${feature ? "aspect-[16/9]" : "aspect-[4/3]"}`}
      >
        <Image
          src={article.image}
          alt={article.imageAlt}
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
          <span className="text-ms-ignition-orange">{article.category}</span>
          <time className="text-ms-warm-white/36">
            {article.publishedLabel}
          </time>
        </div>
        <h3
          className={`mt-4 font-display uppercase leading-[0.95] ${feature ? "text-[clamp(2rem,4vw,4.25rem)]" : "text-2xl sm:text-3xl"}`}
        >
          <Link href={article.href}>{article.title}</Link>
        </h3>
        {article.excerpt ? (
          <p className="mt-4 max-w-xl text-sm leading-6 text-ms-warm-white/55">
            {article.excerpt}
          </p>
        ) : null}
      </div>
    </article>
  );
}
