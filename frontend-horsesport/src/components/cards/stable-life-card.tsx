import Image from "next/image";
import Link from "next/link";

import { ArrowRightIcon } from "@/components/ui/icons";
import type { ArticleCardData } from "@/types/design-system";

/**
 * Editorial stable-life card on a warm cream surface - the light/heritage
 * counterpoint to the dark cinematic cards.
 */
export function StableLifeCard({ item }: { item: ArticleCardData }) {
  return (
    <Link
      href={item.href}
      className="hs-card-glass-light group flex flex-col focus-visible:outline-none"
    >
      <div className="relative aspect-[5/4] overflow-hidden">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.imageAlt ?? item.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-hs-espresso/60" aria-hidden />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        {item.category ? (
          <span className="text-[0.64rem] font-extrabold uppercase tracking-[0.16em] text-hs-brown">
            {item.category}
          </span>
        ) : null}
        <h3 className="hs-display mt-3 text-lg leading-tight text-hs-black transition-colors group-hover:text-hs-red">
          {item.title}
        </h3>
        {item.excerpt ? (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-hs-black/65">
            {item.excerpt}
          </p>
        ) : null}
        <span className="mt-5 inline-flex items-center gap-2 text-[0.66rem] font-extrabold uppercase tracking-[0.14em] text-hs-black/70">
          Read more
          <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
