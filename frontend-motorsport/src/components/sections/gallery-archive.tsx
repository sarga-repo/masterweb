"use client";

import { useEffect, useRef, useState } from "react";

import {
  ArrowUpRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
} from "@/components/ui/icons";
import { ResilientImage } from "@/components/ui/resilient-image";
import type { GalleryItem } from "@/types/design-system";

export type GalleryFilterKey =
  | "all"
  | "race-day"
  | "stable-life"
  | "venue"
  | "jockey"
  | "hospitality"
  | "press"
  | "circuit"
  | "two-wheels"
  | "mixed-surface"
  | "other";

type GalleryArchiveProps = {
  items: GalleryItem[];
  availableCategories?: string[];
  activeFilter?: GalleryFilterKey;
  page?: number;
  pageCount?: number;
};

const FILTERS: Array<{ key: GalleryFilterKey; label: string }> = [
  { key: "all", label: "All frames" },
  { key: "race-day", label: "Race day" },
  { key: "stable-life", label: "Stable life" },
  { key: "venue", label: "Venue" },
  { key: "jockey", label: "Jockey" },
  { key: "hospitality", label: "Hospitality" },
  { key: "press", label: "Press" },
  { key: "circuit", label: "Circuit" },
  { key: "two-wheels", label: "Two wheels" },
  { key: "mixed-surface", label: "Mixed surface" },
  { key: "other", label: "Other" },
];

const GRID_CLASSES = [
  "md:col-span-7",
  "md:col-span-5",
  "md:col-span-5",
  "md:col-span-7",
  "md:col-span-8",
  "md:col-span-4",
];

const ASPECT_CLASSES = [
  "aspect-[16/10]",
  "aspect-[4/3]",
  "aspect-[4/3]",
  "aspect-[16/10]",
  "aspect-[16/9]",
  "aspect-[4/3]",
];

const FALLBACKS = [
  "/media/hero/sarga-motorsport-hero-circuit-golden-hour.jpg",
  "/media/sarga-motorsport-discipline-motorcycle-daylight.jpg",
  "/media/hero/sarga-motorsport-hero-rally-highlands.jpg",
  "/media/sarga-motorsport-discipline-touring-daylight.jpg",
];

function itemCategory(item: GalleryItem): Exclude<GalleryFilterKey, "all"> {
  const explicitCategory = item.category?.trim().toLowerCase();
  const cmsCategories: Array<Exclude<GalleryFilterKey, "all">> = [
    "race-day",
    "stable-life",
    "venue",
    "jockey",
    "hospitality",
    "press",
    "circuit",
    "two-wheels",
    "mixed-surface",
    "other",
  ];
  if (cmsCategories.includes(explicitCategory as Exclude<GalleryFilterKey, "all">)) {
    return explicitCategory as Exclude<GalleryFilterKey, "all">;
  }

  const imageSource =
    typeof item.image === "string" ? item.image : item.image.src;
  const text =
    `${item.eyebrow ?? ""} ${item.caption ?? ""} ${item.imageAlt} ${imageSource}`.toLowerCase();

  if (
    text.includes("motorcycle") ||
    text.includes("superbike") ||
    text.includes("two wheel") ||
    text.includes("rider")
  ) {
    return "two-wheels";
  }

  if (
    text.includes("rally") ||
    text.includes("gravel") ||
    text.includes("mixed surface") ||
    text.includes("off-road")
  ) {
    return "mixed-surface";
  }

  return "other";
}

function displayEyebrow(item: GalleryItem) {
  const eyebrow = item.eyebrow?.trim();
  return !eyebrow || /^gal+ery$/i.test(eyebrow) ? "Gallery" : eyebrow;
}

function displayCaption(item: GalleryItem, index: number) {
  const caption = item.caption?.trim();
  if (caption && !/^gal+ery\s*-\s*sarga motorsport$/i.test(caption)) {
    return caption;
  }

  const categoryLabel: Record<Exclude<GalleryFilterKey, "all">, string> = {
    "race-day": "Race-day action",
    "stable-life": "Stable life",
    venue: "Venue focus",
    jockey: "Jockey profile",
    hospitality: "Hospitality",
    press: "Press frame",
    circuit: "Circuit velocity",
    "two-wheels": "Two-wheel pressure",
    "mixed-surface": "Mixed-surface attack",
    other: "Motorsport frame",
  };

  return `${categoryLabel[itemCategory(item)]} / Frame ${String(index + 1).padStart(2, "0")}`;
}
export function GalleryArchive({
  items,
  availableCategories = [],
  activeFilter = "all",
  page = 1,
  pageCount = 1,
}: GalleryArchiveProps) {
  const visibleFilters = FILTERS.filter(
    (filter) =>
      filter.key === "all" || availableCategories.includes(filter.key),
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const filteredItems = items;
  const selectedItem =
    selectedIndex === null ? null : filteredItems[selectedIndex];
  const modalOpen = selectedIndex !== null;
  useEffect(() => {
    if (!modalOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedIndex(null);
        window.requestAnimationFrame(() => openerRef.current?.focus());
        return;
      }

      if (event.key === "ArrowLeft") {
        setSelectedIndex((current) =>
          current === null
            ? null
            : (current - 1 + filteredItems.length) % filteredItems.length,
        );
        return;
      }

      if (event.key === "ArrowRight") {
        setSelectedIndex((current) =>
          current === null ? null : (current + 1) % filteredItems.length,
        );
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        ),
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [filteredItems.length, modalOpen]);

  function openImage(index: number) {
    openerRef.current = document.activeElement as HTMLElement | null;
    setSelectedIndex(index);
  }

  function closeImage() {
    setSelectedIndex(null);
    window.requestAnimationFrame(() => openerRef.current?.focus());
  }

  function galleryHref(nextPage: number, nextFilter: GalleryFilterKey) {
    const params = new URLSearchParams();
    if (nextPage > 1) params.set("page", String(nextPage));
    if (nextFilter !== "all") params.set("category", nextFilter);
    const query = params.toString();
    return query ? `/gallery?${query}` : "/gallery";
  }

  return (
    <div>
      <div className="ms-gallery-control-reflection flex flex-col gap-5 border-y border-ms-warm-white/18 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="ms-data-label text-ms-slipstream-teal">
            Archive control
          </p>
          <p className="mt-2 text-sm text-ms-warm-white/58" aria-live="polite">
            {String(filteredItems.length).padStart(2, "0")} frames visible
          </p>
        </div>
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          role="group"
          aria-label="Filter gallery"
        >
          {visibleFilters.map((option) => (
            <a
              key={option.key}
              href={galleryHref(1, option.key)}
              aria-current={activeFilter === option.key ? "page" : undefined}
              className={`min-h-11 shrink-0 border px-4 py-3 text-[0.62rem] font-black uppercase tracking-[0.14em] transition-colors ${
                activeFilter === option.key
                  ? "border-ms-apex-crimson bg-ms-apex-crimson text-ms-warm-white"
                  : "border-ms-warm-white/16 text-ms-warm-white/58 hover:border-ms-warm-white/45 hover:text-ms-warm-white"
              }`}
            >
              {option.label}
            </a>
          ))}
        </div>
      </div>

      {items.length > 0 ? (
        <div className="mt-8 grid gap-4 md:grid-cols-12">
          {items.map((item, index) => {
            const caption = displayCaption(item, index);
            const eyebrow = displayEyebrow(item);

            return (
              <figure
                key={item.id}
                className={`group overflow-hidden bg-[#071a3d] text-ms-warm-white ${GRID_CLASSES[index % GRID_CLASSES.length]}`}
              >
                <button
                  type="button"
                  onClick={() => openImage(index)}
                  aria-haspopup="dialog"
                  aria-label={`View full image: ${caption}`}
                  className={`relative block w-full cursor-zoom-in overflow-hidden bg-ms-charcoal text-left ${ASPECT_CLASSES[index % ASPECT_CLASSES.length]}`}
                >
                  <ResilientImage
                    src={item.image}
                    alt={item.imageAlt}
                    fallbackSrc={FALLBACKS[index % FALLBACKS.length]}
                    fallbackAlt="Sarga Motorsport race action in warm daylight"
                    fill
                    sizes="(max-width: 768px) 100vw, 66vw"
                    className="object-cover transition duration-700 ease-(--ease-ms-out) group-hover:scale-[1.025] group-hover:saturate-110"
                  />
                  <span className="absolute bottom-0 right-0 grid size-12 place-items-center bg-ms-apex-crimson text-ms-warm-white transition-colors group-hover:bg-ms-ignition-orange">
                    <ArrowUpRightIcon className="size-4" />
                  </span>
                </button>
                <figcaption className="ms-gallery-caption flex min-h-24 items-end justify-between gap-5 p-5 sm:p-6">
                  <div>
                    <p className="ms-data-label text-ms-electric-yellow">{eyebrow}</p>
                    <p className="mt-2 font-display text-xl uppercase leading-tight">{caption}</p>
                  </div>
                  <span className="ms-tabular text-xs font-bold text-ms-warm-white/52">
                    {String((page - 1) * 8 + index + 1).padStart(2, "0")}
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      ) : (
        <div className="mt-8 border border-ms-warm-white/14 p-8 text-sm text-ms-warm-white/58">
          No published frames match this filter yet.
        </div>
      )}
      {pageCount > 1 ? (
        <nav className="mt-16 flex flex-wrap items-center justify-between gap-5 border-t border-ms-warm-white/18 pt-6" aria-label="Gallery pages">
          <p className="ms-data-label text-ms-warm-white/56">
            Page {String(page).padStart(2, "0")} / {String(pageCount).padStart(2, "0")}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <a href={page > 1 ? galleryHref(page - 1, activeFilter) : undefined} aria-disabled={page === 1} aria-label="Previous gallery page" className="grid size-12 place-items-center border border-ms-warm-white/20 text-ms-warm-white disabled:opacity-30">
              <ChevronLeftIcon className="size-5" />
            </a>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
              <a key={pageNumber} href={galleryHref(pageNumber, activeFilter)} aria-current={page === pageNumber ? "page" : undefined} aria-label={`Gallery page ${pageNumber}`} className={`grid size-12 place-items-center border text-xs font-black ${page === pageNumber ? "border-ms-apex-crimson bg-ms-apex-crimson text-ms-warm-white" : "border-ms-warm-white/20 text-ms-warm-white/62"}`}>
                {String(pageNumber).padStart(2, "0")}
              </a>
            ))}
            <a href={page < pageCount ? galleryHref(page + 1, activeFilter) : undefined} aria-disabled={page === pageCount} aria-label="Next gallery page" className="grid size-12 place-items-center border border-ms-warm-white/20 text-ms-warm-white disabled:opacity-30">
              <ChevronRightIcon className="size-5" />
            </a>
          </div>
        </nav>
      ) : null}
      {selectedItem && selectedIndex !== null ? (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="gallery-lightbox-title"
          className="fixed inset-0 z-[100] grid bg-ms-black/94 p-3 backdrop-blur-md sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeImage();
          }}
        >
          <div className="relative m-auto flex h-full max-h-[calc(100svh-1.5rem)] w-full max-w-[96rem] flex-col overflow-hidden border border-ms-warm-white/16 bg-[#071126] shadow-2xl sm:max-h-[calc(100svh-3rem)]">
            <header className="flex min-h-16 items-center justify-between gap-6 border-b border-ms-warm-white/14 px-4 sm:px-6">
              <p className="ms-data-label text-ms-slipstream-teal">
                Full frame / {String(selectedIndex + 1).padStart(2, "0")} of {" "}
                {String(filteredItems.length).padStart(2, "0")}
              </p>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeImage}
                className="grid size-11 place-items-center border border-ms-warm-white/18 text-ms-warm-white transition-colors hover:border-ms-apex-crimson hover:bg-ms-apex-crimson"
                aria-label="Close full image"
              >
                <CloseIcon className="size-5" />
              </button>
            </header>

            <div className="relative min-h-0 flex-1 bg-ms-black">
              <ResilientImage
                src={selectedItem.image}
                alt={selectedItem.imageAlt}
                fallbackSrc={FALLBACKS[selectedIndex % FALLBACKS.length]}
                fallbackAlt="Sarga Motorsport race action"
                fill
                sizes="100vw"
                className="object-contain"
              />
              <button
                type="button"
                onClick={() =>
                  setSelectedIndex(
                    (selectedIndex - 1 + filteredItems.length) %
                      filteredItems.length,
                  )
                }
                className="absolute left-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center border border-ms-warm-white/25 bg-ms-black/72 text-ms-warm-white transition-colors hover:border-ms-electric-yellow hover:text-ms-electric-yellow sm:left-6 sm:size-14"
                aria-label="Previous image"
              >
                <ChevronLeftIcon className="size-6" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setSelectedIndex((selectedIndex + 1) % filteredItems.length)
                }
                className="absolute right-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center border border-ms-warm-white/25 bg-ms-black/72 text-ms-warm-white transition-colors hover:border-ms-electric-yellow hover:text-ms-electric-yellow sm:right-6 sm:size-14"
                aria-label="Next image"
              >
                <ChevronRightIcon className="size-6" />
              </button>
            </div>

            <footer className="ms-gallery-caption flex items-end justify-between gap-6 px-5 py-5 sm:px-7">
              <div>
                {selectedItem.eyebrow ? (
                  <p className="ms-data-label text-ms-electric-yellow">
                    {displayEyebrow(selectedItem)}
                  </p>
                ) : null}
                <h2
                  id="gallery-lightbox-title"
                  className="mt-2 font-display text-xl uppercase leading-none text-ms-warm-white sm:text-2xl"
                >
                  {displayCaption(selectedItem, selectedIndex)}
                </h2>
              </div>
              <p className="hidden text-xs text-ms-warm-white/48 sm:block">
                Use ← → keys to browse
              </p>
            </footer>
          </div>
        </div>
      ) : null}
    </div>
  );
}
