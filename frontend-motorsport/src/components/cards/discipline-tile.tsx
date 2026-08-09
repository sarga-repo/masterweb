import Link from "next/link";

import { ArrowUpRightIcon } from "@/components/ui/icons";
import { ResilientImage } from "@/components/ui/resilient-image";
import type { DisciplineItem } from "@/types/design-system";

const accents: Record<DisciplineItem["accent"], string> = {
  crimson:
    "bg-[linear-gradient(90deg,var(--color-ms-apex-crimson),#35102e)] text-ms-warm-white",
  orange:
    "bg-[linear-gradient(90deg,var(--color-ms-ignition-orange),#8d190f)] text-ms-warm-white",
  yellow:
    "bg-[linear-gradient(90deg,var(--color-ms-electric-yellow),var(--color-ms-ignition-orange))] text-ms-black",
  teal: "bg-[linear-gradient(90deg,var(--color-ms-slipstream-teal),var(--color-ms-draftline-blue))] text-ms-warm-white",
  blue: "bg-[linear-gradient(90deg,var(--color-ms-draftline-blue),#151345)] text-ms-warm-white",
};

type DisciplineTileProps = {
  item: DisciplineItem;
  priority?: boolean;
};

export function DisciplineTile({
  item,
  priority = false,
}: DisciplineTileProps) {
  const compactTitle = !item.title.includes(" ") && item.title.length >= 9;

  return (
    <Link
      href={item.href}
      className="group relative isolate flex min-h-[31rem] overflow-hidden bg-ms-charcoal focus-visible:z-10"
    >
      <ResilientImage
        src={item.image}
        alt={item.imageAlt}
        fallbackSrc="/media/sarga-motorsport-bike-and-rally.png"
        fallbackAlt="Sarga Motorsport race action"
        fill
        priority={priority}
        sizes="(max-width: 768px) 82vw, (max-width: 1280px) 40vw, 20vw"
        className="object-cover transition duration-700 ease-(--ease-ms-out) group-hover:scale-[1.035] group-hover:saturate-125"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,.03)_12%,rgba(5,5,5,.12)_52%,rgba(5,5,5,.9)_100%)]" />
      <div className="relative mt-auto w-full">
        {item.shortLabel ? (
          <p className="ms-data-label px-5 pb-4 text-ms-warm-white/68">
            {item.shortLabel}
          </p>
        ) : null}
        <div
          className={`grid min-h-20 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-l-4 border-ms-warm-white px-4 py-5 transition-[min-height] duration-300 [container-type:inline-size] group-hover:min-h-24 2xl:gap-4 2xl:px-5 ${accents[item.accent]}`}
        >
          <h3
            className={`ms-heading-card ms-heading-discipline min-w-0 tracking-[-0.02em] ${compactTitle ? "ms-heading-discipline--compact" : ""}`}
          >
            {item.title}
          </h3>
          <ArrowUpRightIcon className="size-5 shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 2xl:size-6" />
        </div>
      </div>
    </Link>
  );
}
