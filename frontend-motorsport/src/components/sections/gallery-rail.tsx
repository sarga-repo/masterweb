import Image from "next/image";

import type { GalleryItem } from "@/types/design-system";

type GalleryRailProps = {
  items: GalleryItem[];
  label?: string;
};

export function GalleryRail({
  items,
  label = "Motorsport gallery",
}: GalleryRailProps) {
  return (
    <section aria-label={label}>
      <div className="ms-shell">
        <div className="-mr-(--ms-page-gutter) flex snap-x snap-mandatory gap-4 overflow-x-auto pb-6 [scrollbar-color:var(--color-ms-apex-crimson)_transparent]">
          {items.map((item, index) => (
            <figure
              key={item.id}
              className={`group relative shrink-0 snap-start overflow-hidden bg-ms-charcoal ${index % 3 === 0 ? "w-[82vw] sm:w-[38rem]" : "w-[70vw] sm:w-[28rem]"}`}
            >
              <div className="relative aspect-[4/3] sm:aspect-[16/11]">
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  sizes="(max-width: 640px) 82vw, 38rem"
                  className="object-cover transition-transform duration-700 ease-(--ease-ms-out) group-hover:scale-[1.025]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-ms-black/85 via-transparent to-transparent"
                />
              </div>
              {item.caption || item.eyebrow ? (
                <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-7">
                  <div>
                    {item.eyebrow ? (
                      <span className="ms-kicker text-ms-ignition-orange">
                        {item.eyebrow}
                      </span>
                    ) : null}
                    {item.caption ? (
                      <p className="mt-2 font-display text-xl uppercase sm:text-2xl">
                        {item.caption}
                      </p>
                    ) : null}
                  </div>
                  <span className="font-display text-sm text-ms-warm-white/45">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
