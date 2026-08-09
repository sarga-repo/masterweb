import { ResilientImage } from "@/components/ui/resilient-image";
import type { GalleryItem } from "@/types/design-system";

type GalleryMosaicProps = {
  items: GalleryItem[];
  label?: string;
};

const mosaicClasses = [
  "md:col-span-3 md:row-span-5",
  "md:col-span-3 md:row-span-3",
  "md:col-span-3 md:row-span-3",
  "md:col-span-3 md:row-span-5",
  "md:col-span-3 md:row-span-3",
  "md:col-span-3 md:row-span-3",
];

const galleryFallbacks = [
  "/media/motorsport-design-hero.png",
  "/media/motorcycle-racing-dusk.png",
  "/media/sarga-motorsport-bike-and-rally.png",
  "/media/sarga-motorsport-motorbike-race.png",
  "/media/sarga-motorsport-race-nascar-1.png",
  "/media/sarga-motorsport-race-nascar-2.png",
];

export function GalleryMosaic({
  items,
  label = "Motorsport gallery",
}: GalleryMosaicProps) {
  return (
    <section
      aria-label={label}
      className="grid auto-rows-[18rem] grid-flow-dense gap-(--ms-grid-gap) md:grid-cols-12 md:auto-rows-[8rem]"
    >
      {items.map((item, index) => (
        <figure
          key={item.id}
          className={`group relative isolate min-h-[18rem] overflow-hidden bg-ms-charcoal ${
            mosaicClasses[index % mosaicClasses.length]
          }`}
        >
          <ResilientImage
            src={item.image}
            alt={item.imageAlt}
            fallbackSrc={galleryFallbacks[index % galleryFallbacks.length]}
            fallbackAlt="Sarga Motorsport race action"
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover transition duration-700 ease-(--ease-ms-out) group-hover:scale-[1.025] group-hover:saturate-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ms-black/88 via-ms-black/5 to-transparent" />
          {item.eyebrow || item.caption ? (
            <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 p-5 sm:p-7">
              <div>
                {item.eyebrow ? (
                  <p className="ms-kicker text-ms-slipstream-teal">
                    {item.eyebrow}
                  </p>
                ) : null}
                {item.caption ? (
                  <p className="mt-2 font-display text-xl uppercase leading-tight sm:text-2xl">
                    {item.caption}
                  </p>
                ) : null}
              </div>
              <span className="ms-data-label text-ms-warm-white/42">
                {String(index + 1).padStart(2, "0")}
              </span>
            </figcaption>
          ) : null}
        </figure>
      ))}
    </section>
  );
}
