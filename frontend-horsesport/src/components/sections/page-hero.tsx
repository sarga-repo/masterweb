import type { ReactNode } from "react";
import Image from "next/image";
import { HS_ACCENT_HEX, type HorseSportAccent } from "@/types/design-system";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
  backgroundImage?: string;
  backgroundAlt?: string;
  accent?: HorseSportAccent;
  children?: ReactNode;
};

/** Premium interior-page hero — cinematic scrim, dot texture, zigzag band detail, editorial side panel. */
export function PageHero({
  eyebrow,
  title,
  description,
  backgroundImage,
  backgroundAlt = "",
  accent = "red",
  children,
}: PageHeroProps) {
  const accentHex = HS_ACCENT_HEX[accent];
  const overImage = Boolean(backgroundImage);
  // Light text over a scrimmed photo; warm dark ink on the cheerful light bg.
  const titleColor = overImage ? "text-hs-white" : "text-hs-cream";
  const descColor = overImage ? "text-hs-white/70" : "text-hs-cream/70";

  return (
    <section className="relative isolate flex min-h-[55vh] items-end overflow-hidden pt-[calc(var(--hs-header-height)+2rem)]">
      {backgroundImage ? (
        <Image src={backgroundImage} alt={backgroundAlt} fill sizes="100vw" priority
          className="hs-animate-zoom absolute inset-0 -z-10 object-cover object-center" />
      ) : null}
      <div aria-hidden className="absolute inset-0 -z-10" style={{
        background: overImage
          ? "linear-gradient(0deg, rgba(20,15,10,0.86) 0%, rgba(20,15,10,0.42) 48%, rgba(20,15,10,0.12) 100%)"
          : `radial-gradient(60% 70% at 16% 0%, ${accentHex}1f, transparent 58%), radial-gradient(55% 60% at 92% 100%, #87B2A529, transparent 58%), linear-gradient(180deg, #fbf6e9, #f7eed0)`,
      }} />
      {/* Brand marker — full-height staircase stripes down the left edge */}
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

      <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-hs-cream/8" />

      <div className="hs-shell relative z-10 py-14 sm:py-20">
        <div className="max-w-[52rem]">
          <div className="hs-kicker hs-animate-1 inline-flex items-center gap-3" style={{ color: accentHex }}>
            <span aria-hidden className="hs-rule inline-block h-px w-10 align-middle" />
            {eyebrow}
          </div>
          <h1 className={`hs-display hs-animate-2 mt-6 max-w-[14ch] text-[clamp(2.6rem,7vw,6rem)] leading-[0.9] ${titleColor}`}>
            {title}
          </h1>
          {description ? (
            <p className={`hs-body-lg hs-animate-3 mt-6 max-w-[38rem] ${descColor}`}>{description}</p>
          ) : null}
          {children ? <div className="hs-animate-4 mt-8">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}
