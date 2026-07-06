import type { SVGProps } from "react";

type MarkProps = SVGProps<SVGSVGElement>;

/**
 * Page-7 brand graphics for Sarga Horse Sport. These translate the three
 * decoration motifs shown in the reference PDF (Horse Sport section) into
 * reusable accents: an orange zig-zag/staircase rhythm, a red dotted texture,
 * and the diagonal slash from the logo mark.
 */

/** Orange zig-zag / staircase rhythm line. */
export function ZigZagMark({
  className,
  ...props
}: MarkProps) {
  return (
    <svg
      viewBox="0 0 120 24"
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path
        d="M2 18 14 6l12 12L38 6l12 12L62 6l12 12L86 6l12 12L110 6"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

/** Red dotted equestrian texture patch (staircase of dots). */
export function DottedMark({ className, ...props }: MarkProps) {
  const dots: Array<[number, number]> = [];
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      // staircase: keep dots near the diagonal band
      if (Math.abs(r - c) <= 1) dots.push([c * 10 + 5, r * 10 + 5]);
    }
  }
  return (
    <svg
      viewBox="0 0 50 50"
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {dots.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2.2" fill="currentColor" />
      ))}
    </svg>
  );
}

/**
 * Descending staircase of rounded orange steps - the page-7 staircase motif as
 * a discrete accent (dividers, corners, eyebrows). Tune count via `steps`.
 */
export function StaircaseMark({
  steps = 6,
  className,
  ...props
}: MarkProps & { steps?: number }) {
  const size = 15;
  const stepX = 17;
  const stepY = 9;
  const width = (steps - 1) * stepX + size;
  const height = (steps - 1) * stepY + size;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {Array.from({ length: steps }).map((_, i) => (
        <rect
          key={i}
          x={i * stepX}
          y={i * stepY}
          width={size}
          height={size}
          rx={3.5}
          opacity={1 - i * (0.5 / steps)}
        />
      ))}
    </svg>
  );
}

/** Diagonal slash (rounded rectangle) from the logo mark. */
export function SlashMark({ className, ...props }: MarkProps) {
  return (
    <svg
      viewBox="0 0 40 60"
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <rect
        x="14"
        y="-4"
        width="14"
        height="68"
        rx="6"
        transform="rotate(20 20 30)"
        fill="currentColor"
      />
    </svg>
  );
}
