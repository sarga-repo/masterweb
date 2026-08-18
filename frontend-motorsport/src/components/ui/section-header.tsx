type SectionHeaderProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  descriptionLabel?: string;
  index?: string;
  showIndex?: boolean;
  showEyebrow?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  showDescriptionLabel?: boolean;
  align?: "left" | "split";
  tone?: "light" | "warm" | "dark";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  descriptionLabel = "Overview",
  index,
  showIndex = true,
  showEyebrow = true,
  showTitle = true,
  showDescription = true,
  showDescriptionLabel = true,
  align = "split",
  tone = "dark",
  className = "",
}: SectionHeaderProps) {
  const light = tone === "light" || tone === "warm";
  const warm = tone === "warm";

  return (
    <header
      className={`grid gap-8 border-t pt-5 ${light ? "border-ms-charcoal/18" : "border-ms-warm-white/16"} ${
        align === "split"
          ? "lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.6fr)]"
          : "max-w-4xl"
      } ${className}`}
    >
      <div>
        <div className="mb-10 grid grid-cols-[auto_1fr_auto] items-center gap-4">
          {showIndex && index ? (
            <span
              className={`ms-data-label ${warm ? "text-[#7f0b19]" : light ? "text-ms-crimson-700" : "text-ms-ignition-orange"}`}
            >
              {index}
            </span>
          ) : null}
          {showEyebrow && eyebrow ? (
            <span
              className={`ms-data-label ${warm ? "text-ms-ink-700" : light ? "text-ms-ink-500" : "text-ms-warm-white/48"}`}
            >
              {eyebrow}
            </span>
          ) : null}
          <span className="flex gap-1" aria-hidden="true">
            <i className="size-1.5 bg-ms-apex-crimson" />
            <i className="size-1.5 bg-ms-ignition-orange" />
            <i className="size-1.5 bg-ms-electric-yellow" />
          </span>
        </div>
        {showTitle && title ? (
          <h2
            className={`ms-heading-section max-w-[12ch] ${light ? "text-ms-draftline-blue" : "text-ms-warm-white"}`}
          >
            {title}
          </h2>
        ) : null}
      </div>
      {showDescription && description ? (
        <div
          className={`self-end border-l pl-5 ${light ? "border-ms-apex-crimson/45" : "border-ms-slipstream-teal/50"}`}
        >
          {showDescriptionLabel && descriptionLabel ? (
            <span
              className={`ms-data-label ${warm ? "text-[#712600]" : light ? "text-ms-orange-800" : "text-ms-slipstream-teal"}`}
            >
              {descriptionLabel}
            </span>
          ) : null}
          <p
            className={`mt-4 text-base leading-7 sm:text-lg ${warm ? "text-ms-charcoal" : light ? "text-ms-ink-700" : "text-ms-warm-white/62"}`}
          >
            {description}
          </p>
        </div>
      ) : null}
    </header>
  );
}
