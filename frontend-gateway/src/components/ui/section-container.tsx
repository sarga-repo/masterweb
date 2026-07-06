import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { RacingGraphic } from "@/components/ui/racing-graphic";

type SectionSurface = "light" | "dark" | "black" | "transparent";

const surfaces: Record<SectionSurface, string> = {
  light: "bg-sarga-light text-sarga-text",
  dark: "bg-sarga-dark text-white",
  black: "bg-sarga-black text-white",
  transparent: "",
};

type SectionContainerProps = HTMLAttributes<HTMLElement> & {
  /** Rendered wrapper element (defaults to <section>). */
  as?: ElementType;
  surface?: SectionSurface;
  /** Overlay the diagonal racing motif on dark surfaces. */
  motif?: boolean;
  /** Optional section header rendered above `children`. */
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  /** Constrain the inner width to the site container (default true). */
  contained?: boolean;
  /** Vertical rhythm around the section. */
  spacing?: "sm" | "md" | "lg";
};

const spacings = {
  sm: "py-12 sm:py-16",
  md: "py-16 sm:py-20 lg:py-24",
  lg: "py-20 sm:py-28 lg:py-32",
} as const;

export function SectionContainer({
  as,
  surface = "transparent",
  motif = false,
  eyebrow,
  title,
  description,
  contained = true,
  spacing = "md",
  className,
  children,
  ...rest
}: SectionContainerProps) {
  const Tag = as ?? "section";
  const hasHeader = Boolean(eyebrow || title || description);

  return (
    <Tag
      className={cn(
        "relative isolate",
        surfaces[surface],
        spacings[spacing],
        className,
      )}
      {...rest}
    >
      {motif ? (
        <RacingGraphic
          variant="cluster"
          className="absolute left-0 top-0 -z-10 h-auto w-[44rem] max-w-[80vw] text-white"
        />
      ) : null}
      <div className={contained ? "site-container" : undefined}>
        {hasHeader ? (
          <header className="mb-10 max-w-3xl sm:mb-12">
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            {title ? (
              <h2 className="mt-3 font-heading text-4xl font-bold uppercase leading-[0.96] tracking-[-0.025em] sm:text-[2.4rem] lg:text-5xl">
                {title}
              </h2>
            ) : null}
            {description ? (
              <div className="mt-5 text-base leading-7 opacity-80 sm:text-lg">
                {description}
              </div>
            ) : null}
          </header>
        ) : null}
        {children}
      </div>
    </Tag>
  );
}
