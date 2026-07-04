"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

import type { GalleryItem } from "@/types/design-system";

type GalleryCarouselProps = {
  items: GalleryItem[];
};

export function GalleryCarousel({ items }: GalleryCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = items.length;

  const goTo = useCallback(
    (idx: number) => {
      setActiveIndex(((idx % total) + total) % total);
    },
    [total],
  );

  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying) return;
    timerRef.current = setInterval(() => {
      setActiveIndex((i) => (i + 1) % total);
    }, 4500);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying, total]);

  // Keyboard nav
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const active = items[activeIndex];

  return (
    <div className="relative">
      {/* Main viewport */}
      <div
        className="relative aspect-[16/9] overflow-hidden bg-ms-charcoal cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Crossfade images */}
        {items.map((item, i) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-(--ease-ms-out) ${
              i === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={item.image}
              alt={item.imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 80vw"
              className={`object-cover object-center ${
                i === activeIndex ? "ms-animate-zoom" : ""
              }`}
              priority={i === 0}
            />
          </div>
        ))}

        {/* Gradient overlays */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-20 bg-gradient-to-t from-ms-black via-ms-black/30 to-transparent pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-20 bg-gradient-to-r from-ms-black/60 via-transparent to-ms-black/20 pointer-events-none"
        />

        {/* Grain */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-20 ms-grain pointer-events-none"
        />

        {/* Caption overlay */}
        <div className="absolute inset-x-0 bottom-0 z-30 p-6 sm:p-10">
          <div className="flex items-end justify-between gap-6">
            <div>
              {active.eyebrow ? (
                <span className="ms-kicker text-ms-ignition-orange">
                  {active.eyebrow}
                </span>
              ) : null}
              {active.caption ? (
                <p className="ms-display mt-2 text-[clamp(1.5rem,4vw,3.5rem)]">
                  {active.caption}
                </p>
              ) : null}
            </div>
            <span className="ms-data-label text-ms-warm-white/30 shrink-0">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 z-30 flex size-12 -translate-y-1/2 items-center justify-center border border-ms-warm-white/20 bg-ms-black/60 text-ms-warm-white backdrop-blur-sm transition-all hover:border-ms-apex-crimson hover:bg-ms-black/80 sm:left-6"
          aria-label="Previous image"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="size-5"
            aria-hidden="true"
          >
            <path
              d="M19 12H5M11 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="1.8"
            />
          </svg>
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 z-30 flex size-12 -translate-y-1/2 items-center justify-center border border-ms-warm-white/20 bg-ms-black/60 text-ms-warm-white backdrop-blur-sm transition-all hover:border-ms-apex-crimson hover:bg-ms-black/80 sm:right-6"
          aria-label="Next image"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="size-5"
            aria-hidden="true"
          >
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="1.8"
            />
          </svg>
        </button>

        {/* Speed lines decoration */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-20 overflow-hidden pointer-events-none"
        >
          <div className="ms-speed-line absolute top-[15%] left-0 h-px w-[30%] bg-gradient-to-r from-transparent via-ms-apex-crimson/20 to-transparent" />
          <div className="ms-speed-line-delay-1 absolute top-[85%] left-0 h-px w-[45%] bg-gradient-to-r from-transparent via-ms-slipstream-teal/15 to-transparent" />
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {items.map((item, i) => (
          <button
            key={item.id}
            onClick={() => goTo(i)}
            className={`relative shrink-0 overflow-hidden transition-all duration-300 ${
              i === activeIndex
                ? "ring-2 ring-ms-apex-crimson opacity-100"
                : "opacity-40 hover:opacity-70"
            }`}
            style={{ width: "6rem", height: "4rem" }}
            aria-label={`Go to image ${i + 1}: ${item.caption ?? item.imageAlt}`}
          >
            <Image
              src={item.image}
              alt={item.imageAlt}
              fill
              sizes="6rem"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-px bg-ms-warm-white/10 overflow-hidden">
        <div
          className="h-full bg-ms-apex-crimson transition-all duration-500 ease-(--ease-ms-out)"
          style={{ width: `${((activeIndex + 1) / total) * 100}%` }}
        />
      </div>
    </div>
  );
}
