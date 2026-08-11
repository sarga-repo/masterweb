"use client";

import Image, { getImageProps } from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RacingGraphic } from "@/components/ui/racing-graphic";
import type { HomepageContent } from "@/lib/strapi/types";
import { HeroVideo } from "@/components/ui/hero-video";

export function Hero({ content }: { content: HomepageContent }) {
  const [videoPaused, setVideoPaused] = useState(false);
  const heroImage =
    content.heroImage ??
    ({
      url: "/assets/media/sarga-cinematic-hero-concept.png",
      alt: "Horses running alongside a red race car at a modern circuit",
    } as const);
  const displayHeroImage = content.heroVideo?.posterImage ?? heroImage;
  const heroImageMobile =
    content.heroVideo?.mobilePosterImage ?? content.heroImageMobile;
  const imageClassName = "velocity-hero__image object-cover object-center";
  const mobileImageProps = heroImageMobile
    ? getImageProps({
        src: heroImageMobile.url,
        alt: heroImageMobile.alt,
        fill: true,
        priority: true,
        sizes: "100vw",
        className: imageClassName,
      }).props
    : undefined;

  return (
    <section
      id="hero"
      className="velocity-hero relative isolate min-h-[calc(100svh-5rem)] overflow-hidden bg-sarga-light text-sarga-text sm:min-h-[44rem]"
    >
      <div className="velocity-hero__media absolute inset-0 -z-20 overflow-hidden">
        <picture className="relative block h-full w-full">
          {mobileImageProps ? (
            <source
              media="(max-width: 639px)"
              srcSet={mobileImageProps.srcSet}
              sizes={mobileImageProps.sizes}
            />
          ) : null}
          <Image
            src={displayHeroImage.url}
            alt={displayHeroImage.alt}
            fill
            priority
            sizes="100vw"
            className={imageClassName}
          />
        </picture>
        {content.heroVideo ? (
          <HeroVideo
            mp4={content.heroVideo.mp4}
            webm={content.heroVideo.webm}
            poster={displayHeroImage.url}
            paused={videoPaused}
          />
        ) : null}
      </div>
      <span
        aria-hidden="true"
        className="velocity-hero__veil absolute inset-0 -z-10"
      />
      <span
        aria-hidden="true"
        className="velocity-grain absolute inset-0 -z-[9]"
      />
      <RacingGraphic
        variant="bands"
        className="gateway-hero-mark absolute inset-y-0 -left-[22%] -z-[8] h-full w-[62%] text-sarga-red max-sm:-left-[76%] max-sm:w-[178%] max-sm:text-white"
      />

      <div className="site-container relative flex min-h-[calc(100svh-5rem)] items-center py-12 sm:min-h-[44rem] sm:py-14 lg:py-16">
        <div className="max-w-[58rem] pt-4 max-sm:self-start max-sm:pt-10">
          <p className="eyebrow velocity-reveal max-sm:text-sarga-orange">
            {content.heroEyebrow}
          </p>
          <h1
            aria-label={content.heroTitle}
            className="velocity-title gateway-display-hero mt-5 max-w-[15ch] font-heading uppercase text-sarga-text max-sm:text-white"
          >
            {content.heroTitle.split(" ").map((word, index) => (
              <span
                aria-hidden="true"
                className={`velocity-title__word ${
                  word.length >= 13 ? "velocity-title__word--long" : ""
                }`}
                style={{ animationDelay: `${120 + index * 45}ms` }}
                key={`${word}-${index}`}
              >
                {word}{" "}
              </span>
            ))}
          </h1>
          <p className="gateway-body-lead mt-5 max-w-[44ch] text-sarga-text-muted max-sm:text-white/76">
            {content.heroDescription}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href={content.primaryCtaUrl} variant="primary" size="lg">
              {content.primaryCtaLabel}
            </Button>
            <Button
              href={content.secondaryCtaUrl}
              variant="secondary"
              size="lg"
              tone="light"
              className="max-sm:border-white/50 max-sm:text-white max-sm:hover:bg-white/10"
            >
              {content.secondaryCtaLabel}
            </Button>
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="gateway-hero-horizon absolute inset-x-0 bottom-0 h-[3px]"
      />
      {content.heroVideo ? (
        <button
          type="button"
          aria-pressed={videoPaused}
          onClick={() => setVideoPaused((paused) => !paused)}
          className="absolute bottom-6 right-6 z-20 min-h-11 border border-white/45 bg-black/45 px-4 text-xs font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm transition-colors hover:bg-black/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:hidden"
        >
          {videoPaused ? "Play background video" : "Pause background video"}
        </button>
      ) : null}
    </section>
  );
}
