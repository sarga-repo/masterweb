import Image from "next/image";
import type { GalleryItemData } from "@/types/design-system";

type GalleryMosaicProps = {
  items: GalleryItemData[];
  /** Homepage hero-bento layout (5 images, one large lead). Off = uniform grid. */
  featured?: boolean;
};

/** Shared image cell content (image + overlay + chip + caption). */
function CellInner({
  item,
  priority,
}: {
  item: GalleryItemData;
  priority?: boolean;
}) {
  return (
    <>
      {item.image ? (
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-hs-espresso/60" aria-hidden />
      )}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-hs-black/85 via-hs-black/22 to-hs-black/8"
      />
      {item.category ? (
        <span className="absolute left-4 top-4 z-10 rounded-full border border-hs-cream/15 bg-hs-black/40 px-3 py-1.5 text-[0.56rem] font-extrabold uppercase tracking-[0.16em] text-hs-cream/80 backdrop-blur-sm">
          {item.category}
        </span>
      ) : null}
      {item.caption ? (
        <p className="absolute inset-x-0 bottom-0 z-10 p-5 text-sm font-semibold leading-snug text-hs-cream/90 sm:text-base">
          {item.caption}
        </p>
      ) : null}
    </>
  );
}

/**
 * Gallery mosaic. `featured` renders a clean hero-bento (one 2×2 lead + four
 * equal cells → a full 2×4 block, no holes); otherwise a uniform responsive
 * grid. The "view full gallery" action lives outside as a standard capsule CTA
 * for consistency with the other sections.
 */
export function GalleryMosaic({ items, featured = false }: GalleryMosaicProps) {
  if (items.length === 0) return null;

  if (featured) {
    const grid = items.slice(0, 5);
    return (
      <div className="grid auto-rows-[minmax(12rem,auto)] grid-cols-1 gap-3 sm:gap-4 md:grid-cols-4">
        {grid.map((item, i) => (
          <figure
            key={item.id}
            className={`hs-card-glass group relative overflow-hidden ${
              i === 0
                ? "md:col-span-2 md:row-span-2"
                : "md:col-span-1 md:row-span-1"
            }`}
          >
            <div className="relative h-full min-h-[14rem] overflow-hidden md:min-h-0">
              <CellInner item={item} priority={i === 0} />
            </div>
          </figure>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
      {items.map((item, i) => (
        <figure
          key={item.id}
          className="hs-card-glass group relative aspect-[4/3] overflow-hidden"
        >
          <CellInner item={item} priority={i === 0} />
        </figure>
      ))}
    </div>
  );
}
