"use client";

import Image from "next/image";
import { LocaleLink as Link } from "@/components/i18n/locale-link";
import { useState } from "react";

import {
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@/components/ui/icons";
import type { CampaignSlide } from "@/types/design-system";

type CampaignBannerSliderProps = {
  slides: CampaignSlide[];
  label?: string;
};

export function CampaignBannerSlider({
  slides,
  label = "Event campaign highlights",
}: CampaignBannerSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (slides.length === 0) return null;

  const activeSlide = slides[activeIndex];
  const hasActiveImage = Boolean(activeSlide.image);
  const selectRelative = (offset: number) => {
    setActiveIndex(
      (current) => (current + offset + slides.length) % slides.length,
    );
  };

  return (
    <section
      className="relative isolate w-full min-h-0 aspect-[4/5] overflow-hidden bg-ms-charcoal sm:aspect-auto sm:min-h-[42rem]"
      aria-label={label}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          aria-hidden={index !== activeIndex}
          className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${
            index === activeIndex
              ? "opacity-100"
              : "pointer-events-none opacity-0"
          }`}
        >
          {slide.image ? (
            <Image
              src={slide.image}
              alt={index === activeIndex ? (slide.imageAlt ?? "") : ""}
              fill
              priority={index === 0}
              sizes="100vw"
              className={`object-cover ${slide.mobileImage ? "hidden sm:block" : ""}`}
            />
          ) : null}
          {slide.mobileImage ? (
            <Image
              src={slide.mobileImage}
              alt={index === activeIndex ? (slide.imageAlt ?? "") : ""}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover sm:hidden"
            />
          ) : null}
        </div>
      ))}

      {!hasActiveImage ? (
        <>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,.94)_0%,rgba(5,5,5,.7)_48%,rgba(5,5,5,.12)_78%),linear-gradient(0deg,rgba(5,5,5,.92)_0%,transparent_50%)]" />
          <div
            className="absolute inset-y-0 left-[44%] hidden w-[18%] -skew-x-12 bg-ms-apex-crimson/28 mix-blend-screen lg:block"
            aria-hidden="true"
          />
        </>
      ) : null}

      <div className="ms-shell relative flex min-h-0 flex-col justify-end py-12 sm:min-h-[42rem] sm:py-16 lg:justify-center">
        <div className="max-w-5xl" aria-live="polite">
          {activeSlide.eyebrow ? (
            <p className="ms-kicker text-ms-ignition-orange">
              {activeSlide.eyebrow}
            </p>
          ) : null}
          <h2 className="ms-heading-hero mt-5 max-w-5xl">
            {activeSlide.headline}
          </h2>
          <p className="mt-6 max-w-3xl font-display text-xl uppercase leading-tight sm:text-3xl">
            {activeSlide.eventTitle}
          </p>
          {activeSlide.description ? (
            <p className="mt-5 max-w-2xl text-sm leading-7 text-ms-warm-white/72 sm:text-base">
              {activeSlide.description}
            </p>
          ) : null}
          <div className="ms-tabular mt-7 flex flex-wrap gap-x-8 gap-y-3 text-xs font-bold uppercase tracking-[0.12em] text-ms-warm-white/65">
            {activeSlide.dateLabel ? (
              <span>{activeSlide.dateLabel}</span>
            ) : null}
            {activeSlide.venue ? <span>{activeSlide.venue}</span> : null}
          </div>
          {activeSlide.cta ? (
            <Link
              href={activeSlide.cta.href}
              target={activeSlide.cta.external ? "_blank" : undefined}
              rel={activeSlide.cta.external ? "noopener noreferrer" : undefined}
              className="mt-9 inline-flex items-center gap-8 bg-ms-apex-crimson px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-white transition-colors hover:bg-ms-ignition-orange"
            >
              {activeSlide.cta.label}
              <ArrowRightIcon className="size-5" />
            </Link>
          ) : null}
        </div>

        <div className="mt-12 flex items-center gap-3 lg:absolute lg:bottom-12 lg:right-(--ms-page-gutter) lg:mt-0">
          <span className="ms-data-label mr-3 text-ms-warm-white/55">
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(slides.length).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={() => selectRelative(-1)}
            className="grid size-12 place-items-center border border-ms-warm-white/30 bg-ms-black/45 transition-colors hover:border-ms-warm-white hover:bg-ms-warm-white hover:text-ms-black"
            aria-label="Previous campaign slide"
          >
            <ChevronLeftIcon className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => selectRelative(1)}
            className="grid size-12 place-items-center border border-ms-warm-white/30 bg-ms-black/45 transition-colors hover:border-ms-warm-white hover:bg-ms-warm-white hover:text-ms-black"
            aria-label="Next campaign slide"
          >
            <ChevronRightIcon className="size-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
