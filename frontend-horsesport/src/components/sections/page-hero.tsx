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

  return (
    <section className="relative isolate flex min-h-[55vh] items-end overflow-hidden pt-[calc(var(--hs-header-height)+2rem)]">
      {backgroundImage ? (
        <Image src={backgroundImage} alt={backgroundAlt} fill sizes="100vw" priority
          className="hs-animate-zoom absolute inset-0 -z-10 object-cover object-center" />
      ) : null}
      <div aria-hidden className="absolute inset-0 -z-10" style={{
        background: backgroundImage
          ? "linear-gradient(0deg, rgba(8,6,4,0.96) 0%, rgba(8,6,4,0.58) 45%, rgba(8,6,4,0.24) 100%)"
          : `radial-gradient(55% 65% at 18% 0%, ${accentHex}22, transparent 55%), radial-gradient(50% 55% at 92% 100%, #FF6B0018, transparent 55%), #080604`,
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
          <h1 className="hs-display hs-animate-2 mt-6 max-w-[14ch] text-[clamp(2.6rem,7vw,6rem)] leading-[0.9] text-hs-cream">
            {title}
          </h1>
          {description ? (
            <p className="hs-body-lg hs-animate-3 mt-6 max-w-[38rem] text-hs-cream/58">{description}</p>
          ) : null}
          {children ? <div className="hs-animate-4 mt-8">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}
