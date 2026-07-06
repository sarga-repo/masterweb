import type { ReactNode } from "react";

type SectionHeaderProps = {
  eyebrow?: string;
  /** Optional two-digit section index (e.g. "01") for consistent numbering. */
  index?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
  children?: ReactNode;
};

/** Refined section header — editorial-luxury typography with a numbered gradient eyebrow. */
export function SectionHeader({
  eyebrow,
  index,
  title,
  description,
  align = "left",
  light = false,
  children,
}: SectionHeaderProps) {
  const alignment =
    align === "center" ? "items-center text-center" : "items-start";
  const titleColor = light ? "text-hs-espresso" : "text-hs-cream";
  const descColor = light ? "text-hs-espresso/58" : "text-hs-cream/55";

  return (
    <div
      className={`flex max-w-3xl flex-col ${alignment} ${align === "center" ? "mx-auto" : ""}`}
    >
      {eyebrow ? (
        <span className="hs-kicker inline-flex items-center gap-2.5 text-hs-orange">
          {index ? <span className="tabular-nums text-hs-orange/70">{index}</span> : null}
          <span
            aria-hidden
            className="hs-rule inline-block h-px w-10 align-middle"
          />
          {eyebrow}
        </span>
      ) : null}
      <h2
        className={`hs-display mt-5 max-w-[11ch] text-[clamp(2.1rem,4.4vw,4rem)] tracking-tight ${titleColor}`}
      >
        {title}
      </h2>
      {description ? (
        <p className={`hs-body-lg mt-5 max-w-[38rem] ${descColor}`}>
          {description}
        </p>
      ) : null}
      {children ? <div className="mt-8">{children}</div> : null}
    </div>
  );
}
