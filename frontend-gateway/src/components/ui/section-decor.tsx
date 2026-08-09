import { cn } from "@/lib/utils";
import { RacingGraphic } from "@/components/ui/racing-graphic";

type SectionDecorProps = {
  /** Visual variant matching the parent section surface. */
  variant: "light" | "dark" | "accent";
  /** Add horizontal speed-line accents. */
  speedLines?: boolean;
  /** Render a gradient divider at the top or bottom edge. */
  divider?: "top" | "bottom";
  /** Additional class for the outer wrapper. */
  className?: string;
};

/**
 * Layered decorative overlays for gateway sections.
 *
 * - `light`: race flag bands + dot grid + mesh + ambient glow + hero net
 * - `dark`: grain + race flag bands + ambient glow-dark + optional speed lines
 * - `accent`: racing graphic bands + grain + shimmer (for red/accent sections)
 *
 * All decorative layers are `aria-hidden` and respect `prefers-reduced-motion`.
 */
export function SectionDecor({
  variant,
  speedLines = false,
  divider,
  className,
}: SectionDecorProps) {
  return (
    <>
      {/* Top divider */}
      {divider === "top" ? (
        <span
          aria-hidden="true"
          className="gateway-section-divider absolute inset-x-0 top-0 z-0"
        />
      ) : null}

      {/* ── Light variant layers ────────────────────────────────────── */}
      {variant === "light" ? (
        <>
          {/* Race flag diagonal bands (background texture) */}
          <span
            aria-hidden="true"
            className="gateway-race-flag-light absolute inset-0 z-0 pointer-events-none"
          />
          {/* Dot grid pattern */}
          <span
            aria-hidden="true"
            className="gateway-dot-grid absolute inset-0 z-0 pointer-events-none"
          />
          {/* Triangular mesh pattern (repeating) */}
          <span
            aria-hidden="true"
            className="gateway-mesh-light absolute inset-0 z-0 pointer-events-none"
          />
          {/* Ambient color glow */}
          <span
            aria-hidden="true"
            className="gateway-ambient-glow absolute inset-0 z-0 pointer-events-none"
          />
          {/* Hero-style triangular net (right side, fades in) */}
          <span
            aria-hidden="true"
            className="gateway-hero-net absolute inset-y-0 right-0 z-0 w-[55%] pointer-events-none max-md:w-full max-md:opacity-30"
          />
        </>
      ) : null}

      {/* ── Dark variant layers ─────────────────────────────────────── */}
      {variant === "dark" ? (
        <>
          {/* Grain texture */}
          <span
            aria-hidden="true"
            className="velocity-grain absolute inset-0 z-0 pointer-events-none"
          />
          {/* Race flag diagonal bands (white on dark) */}
          <span
            aria-hidden="true"
            className="gateway-race-flag-dark absolute inset-0 z-0 pointer-events-none"
          />
          {/* Ambient glow */}
          <span
            aria-hidden="true"
            className="gateway-ambient-glow-dark absolute inset-0 z-0 pointer-events-none"
          />
        </>
      ) : null}

      {/* ── Accent (red) variant layers ─────────────────────────────── */}
      {variant === "accent" ? (
        <>
          <span
            aria-hidden="true"
            className="velocity-grain absolute inset-0 z-0 pointer-events-none"
          />
          <RacingGraphic
            variant="bands"
            className={cn(
              "absolute inset-y-0 -right-[30%] -z-10 h-full w-[85%] rotate-180 text-white pointer-events-none",
            )}
          />
        </>
      ) : null}

      {/* Speed line accents */}
      {speedLines ? (
        <>
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-[28%] z-0 pointer-events-none"
          >
            <span className="gateway-speed-line block h-px" />
          </span>
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-[72%] z-0 pointer-events-none"
          >
            <span className="gateway-speed-line block h-px opacity-50" />
          </span>
        </>
      ) : null}

      {/* Bottom divider */}
      {divider === "bottom" ? (
        <span
          aria-hidden="true"
          className="gateway-section-divider absolute inset-x-0 bottom-0 z-0"
        />
      ) : null}

      {/* Custom className slot */}
      {className ? (
        <span
          aria-hidden="true"
          className={cn("absolute inset-0 z-0 pointer-events-none", className)}
        />
      ) : null}
    </>
  );
}

/**
 * Thin gradient line that transitions between two sections.
 * Place between adjacent <section> elements on the homepage.
 */
export function SectionDivider() {
  return <div aria-hidden="true" className="gateway-section-divider" />;
}
