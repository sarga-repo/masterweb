"use client";

import { LocaleLink as Link } from "@/components/i18n/locale-link";
import {
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { ArrowRightIcon } from "@/components/ui/icons";
import { ResilientImage } from "@/components/ui/resilient-image";
import { HeroVideo } from "@/components/ui/hero-video";
import type { HomepageHeroSlide, LinkItem } from "@/types/design-system";

const FALLBACK_SLIDE: HomepageHeroSlide = {
  id: "fallback-circuit",
  eyebrow: "Sarga Motorsport / Season 2026",
  title: "Feel the friction.",
  description:
    "World-class competition, human precision, and race weekends built to bring Indonesia closer to the action.",
  image: "/media/hero/sarga-motorsport-hero-circuit-golden-hour.jpg",
  imageAlt:
    "Red and orange touring race car accelerating through a tropical circuit at golden hour",
  subjectAnchor: "right",
  cta: { label: "Explore events", href: "/events" },
};

const ANCHOR_CLASS: Record<HomepageHeroSlide["subjectAnchor"], string> = {
  left: "object-left",
  center: "object-center",
  right: "object-right",
};

type MotorsportHeroProps = {
  slides: HomepageHeroSlide[];
};

function subscribeToReducedMotion(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  queueMicrotask(callback);
  return () => media.removeEventListener("change", callback);
}

function reducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function HeroCta({ item }: { item: LinkItem }) {
  return (
    <Link
      href={item.href}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noreferrer" : undefined}
      className="group inline-flex min-h-16 w-full items-stretch border border-ms-electric-yellow bg-ms-electric-yellow text-ms-charcoal shadow-ms-lift transition-[background-color,border-color,box-shadow] duration-300 ease-(--ease-ms-out) hover:border-ms-warm-white hover:bg-ms-warm-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ms-warm-white motion-reduce:transition-none sm:w-auto"
    >
      <span className="flex min-w-0 flex-1 items-center px-5 py-3 text-[0.6875rem] font-extrabold uppercase tracking-[0.14em] whitespace-nowrap sm:flex-none sm:px-6">
        {item.label}
      </span>
      <span className="grid min-w-16 place-items-center border-l border-ms-charcoal/20 bg-ms-charcoal px-4 text-ms-warm-white transition-colors duration-300 ease-(--ease-ms-out) group-hover:bg-ms-apex-crimson motion-reduce:transition-none">
        <ArrowRightIcon className="size-5" />
      </span>
    </Link>
  );
}

export function MotorsportHero({ slides }: MotorsportHeroProps) {
  const items = slides.length > 0 ? slides : [FALLBACK_SLIDE];
  const [activeIndex, setActiveIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [interactionPaused, setInteractionPaused] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    reducedMotionSnapshot,
    () => false,
  );
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const activeSlide = items[activeIndex] ?? items[0];

  useEffect(() => {
    if (items.length < 2 || userPaused || interactionPaused || reducedMotion)
      return;

    const timer = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      setActiveIndex((current) => (current + 1) % items.length);
    }, 8_000);

    return () => window.clearInterval(timer);
  }, [interactionPaused, items.length, reducedMotion, userPaused]);

  const selectSlide = (nextIndex: number) => {
    const normalized = (nextIndex + items.length) % items.length;
    setActiveIndex(normalized);
    setUserPaused(true);
    setAnnouncement(
      `Showing slide ${normalized + 1} of ${items.length}: ${items[normalized]?.title}`,
    );
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLElement>) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.abs(deltaX) < 50 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
    selectSlide(activeIndex + (deltaX < 0 ? 1 : -1));
  };

  return (
    <section
      className="ms-home-hero relative isolate overflow-hidden bg-ms-charcoal text-ms-warm-white [touch-action:pan-y]"
      aria-label="Featured Sarga Motorsport stories"
      aria-roledescription="carousel"
      onMouseEnter={() => setInteractionPaused(true)}
      onMouseLeave={() => setInteractionPaused(false)}
      onFocusCapture={() => setInteractionPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setInteractionPaused(false);
        }
      }}
      onPointerDown={(event) => {
        pointerStart.current = { x: event.clientX, y: event.clientY };
      }}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        pointerStart.current = null;
      }}
    >
      {items.map((slide, index) => {
        const active = index === activeIndex;
        const anchorClass = ANCHOR_CLASS[slide.subjectAnchor];
        const poster = slide.video?.poster ?? slide.image;
        const mobilePoster = slide.video?.mobilePoster ?? slide.mobileImage;
        const hasMobileArtwork = Boolean(mobilePoster);

        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-[600ms] ease-(--ease-ms-out) motion-reduce:transition-none ${
              active ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={!active}
            aria-label={`${index + 1} of ${items.length}`}
            aria-roledescription="slide"
            role="group"
          >
            <ResilientImage
              src={poster}
              alt={active ? slide.imageAlt : ""}
              fallbackSrc={FALLBACK_SLIDE.image}
              fallbackAlt={FALLBACK_SLIDE.imageAlt}
              fill
              priority={index === 0}
              sizes="100vw"
              data-cms-image-variant="desktop"
              className={`object-cover ${anchorClass} ${hasMobileArtwork ? "hidden sm:block" : ""}`}
            />
            {mobilePoster ? (
              <ResilientImage
                src={mobilePoster}
                alt={active ? slide.imageAlt : ""}
                fallbackSrc={slide.image}
                fallbackAlt={slide.imageAlt}
                fill
                priority={index === 0}
                sizes="100vw"
                data-cms-image-variant="mobile"
                className={`object-contain bg-ms-charcoal sm:hidden ${anchorClass}`}
              />
            ) : null}
            {active && slide.video ? (
              <HeroVideo
                mp4={slide.video.mp4}
                webm={slide.video.webm}
                poster={typeof poster === "string" ? poster : undefined}
                paused={userPaused}
                objectClassName={`object-contain bg-ms-charcoal sm:object-cover ${anchorClass} ${hasMobileArtwork ? "hidden sm:block" : ""}`}
              />
            ) : null}
          </div>
        );
      })}

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,.24)_0%,rgba(5,5,5,.08)_38%,rgba(5,5,5,.62)_100%),linear-gradient(90deg,rgba(5,5,5,.34)_0%,transparent_45%,rgba(5,5,5,.1)_100%)]"
      />

      <div className="ms-shell relative z-10 flex min-h-[inherit] flex-col pb-8 pt-10 sm:pb-10 sm:pt-12">
        <div className="flex flex-1 items-center justify-center py-16 text-center sm:py-20">
          <div className="ms-hero-copy max-w-5xl">
            {activeSlide.eyebrow ? (
              <p className="ms-kicker text-ms-electric-yellow">
                {activeSlide.eyebrow}
              </p>
            ) : null}
            <h1 className="ms-heading-hero mx-auto mt-5 max-w-[11ch] text-ms-warm-white">
              {activeSlide.title}
            </h1>
            {activeSlide.description ? (
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-ms-warm-white/95 sm:text-lg sm:leading-8">
                {activeSlide.description}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-7 border-t border-ms-warm-white/24 pt-5 sm:flex-row sm:items-end sm:justify-between">
          <div
            className="flex flex-wrap items-center gap-2"
            aria-label="Carousel controls"
          >
            {items.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => selectSlide(activeIndex - 1)}
                  className="grid size-10 place-items-center border border-ms-warm-white/30 text-sm transition-colors hover:border-ms-electric-yellow hover:text-ms-electric-yellow"
                  aria-label="Show previous slide"
                >
                  ←
                </button>
                <div className="flex items-center gap-2 px-1">
                  {items.map((slide, index) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => selectSlide(index)}
                      className={`h-1.5 transition-[width,background-color] duration-300 ${
                        index === activeIndex
                          ? "w-8 bg-ms-electric-yellow"
                          : "w-4 bg-ms-warm-white/42 hover:bg-ms-warm-white"
                      }`}
                      aria-label={`Show slide ${index + 1}: ${slide.title}`}
                      aria-current={index === activeIndex ? "true" : undefined}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => selectSlide(activeIndex + 1)}
                  className="grid size-10 place-items-center border border-ms-warm-white/30 text-sm transition-colors hover:border-ms-electric-yellow hover:text-ms-electric-yellow"
                  aria-label="Show next slide"
                >
                  →
                </button>
                {reducedMotion ? (
                  <span className="ms-data-label min-h-10 border-l border-ms-warm-white/24 px-4 py-3 text-ms-warm-white/60">
                    Reduced motion
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setUserPaused((paused) => !paused);
                      setAnnouncement(
                        userPaused
                          ? "Carousel automatic rotation resumed"
                          : "Carousel automatic rotation paused",
                      );
                    }}
                    className="ms-data-label min-h-10 border-l border-ms-warm-white/24 px-4 text-ms-warm-white/70 transition-colors hover:text-ms-warm-white"
                  >
                    {userPaused ? "Play" : "Pause"}
                  </button>
                )}
              </>
            ) : (
              <span className="ms-data-label text-ms-warm-white/55">
                Featured story
              </span>
            )}
          </div>

          {activeSlide.cta ? <HeroCta item={activeSlide.cta} /> : null}
        </div>
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
    </section>
  );
}
