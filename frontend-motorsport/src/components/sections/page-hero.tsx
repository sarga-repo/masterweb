import type { ReactNode } from "react";
import Image from "next/image";

type AccentColor = "crimson" | "orange" | "yellow" | "teal" | "blue";

const ACCENT_MAP: Record<AccentColor, string> = {
  crimson: "#E8192C",
  orange: "#FF6B00",
  yellow: "#F5C800",
  teal: "#00C4CC",
  blue: "#0033A0",
};

type PageHeroProps = {
  kicker: string;
  kickerColor?: AccentColor | string;
  title: string;
  description?: string;
  /** Optional background image path */
  backgroundImage?: string;
  backgroundAlt?: string;
  /** Accent color for radial gradient bloom */
  accent?: AccentColor;
  /** Position of the radial gradient bloom */
  accentPosition?:
    "top-right" | "top-left" | "bottom-right" | "bottom-left" | "center";
  /** Extra content rendered below description */
  children?: ReactNode;
  /** Minimal height variant (no full-viewport) */
  compact?: boolean;
  /** Show animated speed lines */
  speedLines?: boolean;
  /** Grain overlay */
  grain?: boolean;
};

const POSITION_MAP: Record<string, string> = {
  "top-right": "ellipse_at_top_right",
  "top-left": "ellipse_at_top_left",
  "bottom-right": "ellipse_at_bottom_right",
  "bottom-left": "ellipse_at_bottom_left",
  center: "ellipse_at_center",
};

export function PageHero({
  kicker,
  kickerColor,
  title,
  description,
  backgroundImage,
  backgroundAlt = "",
  accent = "crimson",
  accentPosition = "top-right",
  children,
  compact = false,
  speedLines = false,
  grain = false,
}: PageHeroProps) {
  const accentHex = ACCENT_MAP[accent] ?? accent;
  const kickerStyle = kickerColor
    ? { color: ACCENT_MAP[kickerColor as AccentColor] ?? kickerColor }
    : { color: ACCENT_MAP.orange };
  const gradientPos = POSITION_MAP[accentPosition] ?? "ellipse_at_top_right";

  return (
    <section
      className={`relative isolate overflow-hidden border-b border-ms-warm-white/12 ${
        compact
          ? "py-20 sm:py-28"
          : "min-h-[60vh] flex items-end py-20 sm:py-28"
      } ${grain ? "ms-grain" : ""}`}
    >
      {/* Background image (optional cinematic layer) */}
      {backgroundImage ? (
        <Image
          src={backgroundImage}
          alt={backgroundAlt}
          fill
          sizes="100vw"
          priority
          className="absolute inset-0 object-cover object-center ms-animate-zoom"
        />
      ) : null}

      {/* Multi-layer gradient stack */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: backgroundImage
            ? `linear-gradient(0deg, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.55) 40%, rgba(5,5,5,0.25) 70%)`
            : `radial-gradient(${gradientPos.replace(/_/g, " ")}, ${accentHex}18, transparent 60%)`,
        }}
      />
      {/* Secondary accent bloom (always present, subtle) */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `radial-gradient(${gradientPos.replace(/_/g, " ")}, ${accentHex}14, transparent 55%)`,
        }}
      />
      {/* Opposing accent counter-glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse_at_${
            accentPosition.includes("right") ? "bottom_left" : "bottom_right"
          }, ${ACCENT_MAP.teal}08, transparent 50%)`.replace(/_/g, " "),
        }}
      />

      {/* Dot pattern (track grid) */}
      <div
        aria-hidden="true"
        className="ms-track-grid absolute inset-0 opacity-25"
      />

      {/* Speed lines (kinetic energy) */}
      {speedLines ? (
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
          <div className="ms-speed-line absolute top-[20%] left-0 h-px w-[40%] bg-gradient-to-r from-transparent via-ms-apex-crimson/30 to-transparent" />
          <div className="ms-speed-line-delay-1 absolute top-[45%] left-0 h-px w-[55%] bg-gradient-to-r from-transparent via-ms-ignition-orange/20 to-transparent" />
          <div className="ms-speed-line-delay-2 absolute top-[70%] left-0 h-px w-[35%] bg-gradient-to-r from-transparent via-ms-slipstream-teal/25 to-transparent" />
        </div>
      ) : null}

      {/* Shimmer strip (premium accent rail) */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-px ms-shimmer"
      />

      {/* Content */}
      <div className="ms-shell relative z-10">
        <span className="ms-kicker ms-animate-stagger-1" style={kickerStyle}>
          {kicker}
        </span>
        <h1 className="ms-display ms-animate-stagger-2 mt-6 text-[clamp(4rem,10vw,9rem)]">
          {title}
        </h1>
        {description ? (
          <p className="ms-animate-stagger-3 mt-6 max-w-2xl text-lg leading-8 text-ms-warm-white/60">
            {description}
          </p>
        ) : null}
        {children ? (
          <div className="ms-animate-stagger-4 mt-8">{children}</div>
        ) : null}
      </div>
    </section>
  );
}
