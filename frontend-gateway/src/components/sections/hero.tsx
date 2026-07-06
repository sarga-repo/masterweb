import Image, { getImageProps } from "next/image";
import { Button } from "@/components/ui/button";
import { RacingGraphic } from "@/components/ui/racing-graphic";
import type { HomepageContent } from "@/lib/strapi/types";

const gatewaySignals = [
  { value: "07", label: "Ecosystem ventures" },
  { value: "04", label: "Connected pillars" },
  { value: "01", label: "Unified gateway" },
] as const;

export function Hero({ content }: { content: HomepageContent }) {
  const heroImage =
    content.heroImage ??
    ({
      url: "/assets/media/sarga-cinematic-hero-concept.png",
      alt: "Horses running alongside a red race car at a modern circuit",
    } as const);
  const heroImageMobile = content.heroImageMobile;
  // Optional runtime override (e.g. a CDN-hosted encode); otherwise the bundled loop is used.
  const heroVideoOverride = process.env.NEXT_PUBLIC_HERO_VIDEO_URL?.trim();
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
      className="velocity-hero relative isolate min-h-[calc(100svh-5rem)] overflow-hidden bg-sarga-black text-white"
    >
      <div className="velocity-hero__media absolute inset-0 -z-20 overflow-hidden">
        <picture>
          {mobileImageProps ? (
            <source
              media="(max-width: 639px)"
              srcSet={mobileImageProps.srcSet}
              sizes={mobileImageProps.sizes}
            />
          ) : null}
          <Image
            src={heroImage.url}
            alt={heroImage.alt}
            fill
            priority
            sizes="100vw"
            className={imageClassName}
          />
        </picture>
        <video
          className="velocity-hero__video absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/assets/media/hero/sarga-hero-loop-poster.jpg"
          aria-hidden="true"
        >
          {heroVideoOverride ? (
            <source src={heroVideoOverride} type="video/mp4" />
          ) : null}
          <source
            src="/assets/media/hero/sarga-hero-loop.webm"
            type="video/webm"
          />
          <source
            src="/assets/media/hero/sarga-hero-loop.mp4"
            type="video/mp4"
          />
        </video>
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
        className="gateway-hero-mark absolute inset-y-0 -left-[20%] -z-[8] h-full w-[68%] text-white max-lg:-left-[38%] max-lg:w-[108%]"
      />

      <div className="site-container relative flex min-h-[calc(100svh-5rem)] flex-col justify-between py-8 sm:py-10 lg:py-12">
        <div className="flex items-center justify-between gap-4 border-b border-white/20 pb-5 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-white/65">
          <span>Independent group gateway</span>
          <span className="hidden sm:inline">Indonesia / Southeast Asia</span>
          <span>Est. 2023</span>
        </div>

        <div className="max-w-[82rem] py-16 sm:py-20 lg:py-24">
          <p className="eyebrow velocity-reveal">{content.heroEyebrow}</p>
          <h1
            aria-label={content.heroTitle}
            className="velocity-title mt-5 max-w-[14ch] font-heading text-[clamp(2.1rem,8.6vw,2.3rem)] font-bold uppercase leading-[0.95] tracking-[-0.055em] sm:text-[clamp(2.75rem,5.3vw,5.8rem)]"
          >
            {content.heroTitle.split(" ").map((word, index) => (
              <span
                aria-hidden="true"
                className="velocity-title__word"
                style={{ animationDelay: `${120 + index * 45}ms` }}
                key={`${word}-${index}`}
              >
                {word}{" "}
              </span>
            ))}
          </h1>
        </div>

        <div className="grid gap-8 border-t border-white/20 pt-7 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="max-w-2xl text-base leading-7 text-white/78 sm:text-lg">
              {content.heroDescription}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href={content.primaryCtaUrl} variant="primary" size="lg">
                {content.primaryCtaLabel}
              </Button>
              <Button
                href={content.secondaryCtaUrl}
                variant="secondary"
                size="lg"
                tone="dark"
              >
                {content.secondaryCtaLabel}
              </Button>
            </div>
          </div>

          <ul className="grid grid-cols-3 border-l border-white/20 max-lg:border-t max-lg:border-l-0 max-lg:pt-6">
            {gatewaySignals.map((signal) => (
              <li
                key={signal.label}
                className="border-r border-white/20 px-4 last:border-r-0 sm:px-6"
              >
                <strong className="block font-heading text-2xl font-bold text-white sm:text-3xl">
                  {signal.value}
                </strong>
                <span className="mt-1 block text-[0.6rem] font-bold uppercase leading-4 tracking-[0.14em] text-white/52 sm:text-[0.65rem]">
                  {signal.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
