import { cn } from "@/lib/utils";

type RacingGraphicProps = {
  variant: "bands" | "cluster";
  className?: string;
};

/**
 * Vector interpretation of the Sarga racing motif from preview PDF page 7.
 * `bands` is the oversized two-row hero crop; `cluster` is the compact
 * staggered mark used in the ecosystem and footer compositions.
 */
export function RacingGraphic({ variant, className }: RacingGraphicProps) {
  if (variant === "bands") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 1400 900"
        preserveAspectRatio="none"
        className={cn("pointer-events-none", className)}
      >
        <path
          d="M235 0h230L175 450H-55L235 0Z"
          fill="currentColor"
          opacity=".035"
        />
        <path
          d="M695 0h230L635 450H405L695 0Z"
          fill="currentColor"
          opacity=".085"
        />
        <path
          d="M1155 0h230L1095 450H865L1155 0Z"
          fill="currentColor"
          opacity=".14"
        />

        <path
          d="M175 450h230L115 900H-115l290-450Z"
          fill="currentColor"
          opacity=".035"
        />
        <path
          d="M635 450h230L575 900H345l290-450Z"
          fill="currentColor"
          opacity=".085"
        />
        <path
          d="M1095 450h230L1035 900H805l290-450Z"
          fill="currentColor"
          opacity=".14"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 810 280"
      preserveAspectRatio="xMinYMin meet"
      className={cn("pointer-events-none", className)}
    >
      <g fill="currentColor">
        <path d="M130 0h72l-81 140H49L130 0Z" opacity=".025" />
        <path d="M265 0h72l-81 140h-72L265 0Z" opacity=".06" />
        <path d="M400 0h72l-81 140h-72L400 0Z" opacity=".095" />
        <path d="M535 0h72l-81 140h-72L535 0Z" opacity=".13" />
        <path d="M670 0h72l-81 140h-72L670 0Z" opacity=".17" />

        <path d="M117 140h72l-81 140H36l81-140Z" opacity=".025" />
        <path d="M252 140h72l-81 140h-72l81-140Z" opacity=".06" />
        <path d="M387 140h72l-81 140h-72l81-140Z" opacity=".095" />
        <path d="M522 140h72l-81 140h-72l81-140Z" opacity=".13" />
        <path d="M657 140h72l-81 140h-72l81-140Z" opacity=".17" />
      </g>
    </svg>
  );
}

export function HeroMesh({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1000 900"
      preserveAspectRatio="none"
      className={cn("pointer-events-none", className)}
    >
      <defs>
        <pattern
          id="hero-triangle-mesh"
          width="24"
          height="21"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0 21 12 0l12 21M0 21h24M0 0l12 21L24 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.45"
          />
        </pattern>
        <linearGradient id="hero-mesh-fade" x1="0" x2="1">
          <stop offset="0" stopColor="white" stopOpacity="0" />
          <stop offset=".14" stopColor="white" stopOpacity=".72" />
          <stop offset=".72" stopColor="white" stopOpacity=".68" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <mask id="hero-mesh-mask">
          <rect width="1000" height="900" fill="url(#hero-mesh-fade)" />
        </mask>
      </defs>
      <rect
        width="1000"
        height="900"
        fill="url(#hero-triangle-mesh)"
        mask="url(#hero-mesh-mask)"
      />
    </svg>
  );
}
