import { MarkdownContent } from "@/components/content/markdown-content";
import { ResilientImage } from "@/components/ui/resilient-image";
import { HeroVideo } from "@/components/ui/hero-video";
import { MotorsportMetricGroup } from "@/components/sections/motorsport-metric-group";
import type { MotorsportPageHero as MotorsportPageHeroModel } from "@/lib/motorsport-page-foundation";
type MotorsportPageHeroProps = {
  hero: MotorsportPageHeroModel;
};

function isVideo(media?: { mime?: string }) {
  return media?.mime?.startsWith("video/") ?? false;
}

export function MotorsportPageHero({ hero }: MotorsportPageHeroProps) {
  if (!hero.isActive) return null;

  const media = hero.backgroundMedia;
  const mobileMedia = hero.mobileBackgroundMedia;

  return (
    <section
      className="ms-page-hero relative isolate w-full min-h-[26rem] overflow-hidden bg-ms-charcoal text-ms-warm-white sm:min-h-[32rem]"
      data-cms-section-key="hero"
      data-cms-enabled="true"
    >
      {hero.showMedia && media && isVideo(media) ? (
        <HeroVideo
          mp4={media.mime === "video/mp4" ? media.url : undefined}
          webm={media.mime === "video/webm" ? media.url : undefined}
          objectClassName="object-cover"
        />
      ) : hero.showMedia && media ? (
        <ResilientImage
          src={media.url}
          alt={media.alt ?? ""}
          fallbackSrc="/media/hero/sarga-motorsport-hero-circuit-golden-hour.jpg"
          fallbackAlt="Sarga Motorsport circuit at golden hour"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : null}
      {hero.showMedia && mobileMedia && !isVideo(mobileMedia) ? (
        <ResilientImage
          src={mobileMedia.url}
          alt={mobileMedia.alt ?? ""}
          fallbackSrc="/media/hero/sarga-motorsport-hero-circuit-golden-hour.jpg"
          fallbackAlt="Sarga Motorsport circuit at golden hour"
          fill
          priority
          sizes="100vw"
          className="object-contain bg-ms-charcoal sm:hidden"
        />
      ) : null}
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,.28)_0%,rgba(5,5,5,.08)_42%,rgba(5,5,5,.72)_100%)]"
        aria-hidden="true"
      />
      <div className="ms-shell relative z-10 flex min-h-[26rem] items-end py-14 sm:min-h-[32rem] sm:py-20">
        <div className="max-w-4xl">
          {hero.showEyebrow && hero.eyebrow ? (
            <p className="ms-kicker text-ms-electric-yellow">{hero.eyebrow}</p>
          ) : null}
          {hero.showTitle ? (
            <h1 className="ms-heading-hero mt-5 max-w-[14ch] text-ms-warm-white">
              {hero.title}
            </h1>
          ) : null}
          {hero.showDescription && hero.description ? (
            <MarkdownContent
              value={hero.description}
              className="ms-rich-text mt-6 max-w-2xl text-base leading-7 text-ms-warm-white/90 sm:text-lg sm:leading-8"
            />
          ) : null}
          {hero.showMetricGroup ? (
            <MotorsportMetricGroup
              items={hero.metrics}
              className="mt-8 max-w-2xl"
              labelClassName="text-ms-warm-white/52"
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
