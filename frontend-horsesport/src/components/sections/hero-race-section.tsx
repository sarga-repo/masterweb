"use client";

import Image from "next/image";
import { useState } from "react";
import { LocaleLink as Link } from "@/components/i18n/locale-link";
import { ArrowRightIcon, ArrowUpRightIcon } from "@/components/ui/icons";
import { HeroVideo, type HeroVideoSource } from "@/components/ui/hero-video";
import type { LinkItem, StatItem } from "@/types/design-system";

type HeroRaceSectionProps = {
  eyebrow: string;
  title: string;
  description?: string;
  image: string;
  mobileImage?: string;
  imageAlt: string;
  /** Optional cinematic background loop; the image stays as poster/fallback. */
  video?: HeroVideoSource;
  primaryCta?: LinkItem;
  secondaryCta?: LinkItem;
  stats?: StatItem[];
  priority?: boolean;
};

/**
 * Cinematic hero - editorial "cinematic pacing" in the manner of the gateway /
 * motorsport heroes: full-bleed photography, a strong directional scrim, a top
 * data rail, an oversized title, and a single bottom stat band (no duplicate
 * stat panels). Warm Horse Sport brand treatment throughout.
 */
export function HeroRaceSection({
  eyebrow,
  title,
  description,
  image,
  mobileImage,
  imageAlt,
  video,
  primaryCta,
  secondaryCta,
  stats = [],
  priority = true,
}: HeroRaceSectionProps) {
  const [videoPaused, setVideoPaused] = useState(false);
  return (
    <section className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority={priority}
        sizes="100vw"
        className={`hs-animate-zoom absolute inset-0 -z-10 object-cover object-center ${mobileImage ? "hidden sm:block" : ""}`}
      />
      {mobileImage ? (
        <Image
          src={mobileImage}
          alt={imageAlt}
          fill
          priority={priority}
          sizes="100vw"
          className="hs-animate-zoom absolute inset-0 -z-10 object-cover object-center sm:hidden"
        />
      ) : null}
      {video ? <HeroVideo {...video} paused={videoPaused} /> : null}

      {/* Directional cinematic scrim - darker at top (nav legibility), heavy at
          bottom, weighted to the left where the copy sits. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.45) 24%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.95) 100%), linear-gradient(90deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.5) 48%, transparent 78%)",
        }}
      />
      {/* Single warm brand bloom - one restrained accent */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 55% at 10% 100%, rgb(237 27 47 / 0.2), transparent 58%)",
        }}
      />

      {/* Brand marker - three full-height staircase stripes down the LEFT edge,
          faded top + bottom. Sits over the darkest part of the scrim. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-0 hidden select-none pl-2 lg:flex lg:gap-8"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="hs-zigzag-pattern block h-full w-12"
            style={{
              opacity: 0.08,
              WebkitMaskImage:
                "linear-gradient(180deg, black 0%, black 45%, transparent 85%)",
              maskImage:
                "linear-gradient(180deg, black 0%, black 45%, transparent 85%)",
            }}
          />
        ))}
      </div>

      <div className="hs-shell relative z-10 flex min-h-[100dvh] flex-col pb-10 pt-[calc(var(--hs-header-height)+1.75rem)] sm:pb-12">
        {/* ── Top data rail ── */}
        <div className="flex items-center justify-between gap-4 border-b border-hs-white/16 pb-5">
          <span className="hs-kicker inline-flex items-center gap-3 text-hs-orange">
            <span
              aria-hidden
              className="hs-rule inline-block h-px w-10 align-middle"
            />
            {eyebrow}
          </span>
          <span className="hs-kicker hidden text-hs-white/45 sm:inline">
            Championship Calendar
          </span>
          <span className="hs-kicker text-hs-white/45">Est. 2023 · IDN</span>
        </div>

        {/* ── Title block (grows, sits low) ── */}
        <div className="flex flex-1 flex-col justify-end pt-16">
          <h1 className="hs-display max-w-[13ch] text-[clamp(3rem,8vw,7.5rem)] leading-[0.86] text-hs-white">
            {title}
          </h1>
          {description ? (
            <p
              className="hs-body-lg mt-6 max-w-[34rem] border-l-2 border-hs-red pl-5 text-hs-white/72"
              style={{ color: "rgb(255 249 238 / 0.72)" }}
            >
              {description}
            </p>
          ) : null}

          {(primaryCta || secondaryCta) && (
            <div className="mt-9 flex flex-wrap gap-4">
              {primaryCta ? (
                <Link href={primaryCta.href} className="hs-cta-primary">
                  <span className="px-3">{primaryCta.label}</span>
                  <span className="hs-cta-icon-circle">
                    <ArrowRightIcon className="size-4" />
                  </span>
                </Link>
              ) : null}
              {secondaryCta ? (
                <Link
                  href={secondaryCta.href}
                  className="hs-cta-secondary"
                  style={{ color: "#FFF9EE" }}
                >
                  <span className="px-3">{secondaryCta.label}</span>
                  <span className="hs-cta-icon-circle">
                    <ArrowUpRightIcon className="size-4" />
                  </span>
                </Link>
              ) : null}
            </div>
          )}
        </div>

        {/* ── Single bottom stat band ── */}
        {stats.length > 0 ? (
          <dl className="mt-14 grid grid-cols-2 border-t border-hs-white/16 pt-7 sm:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`px-0 sm:px-6 ${i === 0 ? "sm:pl-0" : ""} ${i > 0 ? "sm:border-l sm:border-hs-white/12" : ""} max-sm:mb-4`}
              >
                <dt className="hs-kicker text-hs-white/45">{stat.label}</dt>
                <dd className="hs-display mt-2 text-[clamp(1.6rem,2.4vw,2.1rem)] text-hs-white">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>

      {/* Signature bottom brand bar */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-10 h-1 bg-[linear-gradient(90deg,#ED1B2F,#FF6B00,#D4A843)]"
      />
      {video ? (
        <button
          type="button"
          aria-pressed={videoPaused}
          onClick={() => setVideoPaused((paused) => !paused)}
          className="absolute bottom-7 right-5 z-20 min-h-11 border border-hs-white/40 bg-hs-black/55 px-4 text-xs font-bold uppercase tracking-[0.12em] text-hs-white backdrop-blur-sm transition-colors hover:border-hs-orange hover:text-hs-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hs-white motion-reduce:hidden sm:right-8"
        >
          {videoPaused ? "Play background video" : "Pause background video"}
        </button>
      ) : null}
    </section>
  );
}
