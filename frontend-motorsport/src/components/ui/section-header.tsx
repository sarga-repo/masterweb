type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  index?: string;
  align?: "left" | "split";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  index,
  align = "split",
  className = "",
}: SectionHeaderProps) {
  return (
    <header
      className={`grid gap-8 border-t border-ms-warm-white/16 pt-5 ${
        align === "split"
          ? "lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.6fr)]"
          : "max-w-4xl"
      } ${className}`}
    >
      <div>
        <div className="mb-10 grid grid-cols-[auto_1fr_auto] items-center gap-4">
          {index ? (
            <span className="ms-data-label text-ms-apex-crimson">
              SYS / {index}
            </span>
          ) : null}
          <span className="ms-data-label text-ms-warm-white/48">{eyebrow}</span>
          <span className="flex gap-1" aria-hidden="true">
            <i className="size-1.5 bg-ms-apex-crimson" />
            <i className="size-1.5 bg-ms-ignition-orange" />
            <i className="size-1.5 bg-ms-electric-yellow" />
          </span>
        </div>
        <h2 className="ms-display max-w-[12ch] text-[clamp(2.25rem,5.25vw,4.88rem)] text-ms-warm-white">
          {title}
        </h2>
      </div>
      {description ? (
        <div className="self-end border-l border-ms-slipstream-teal/50 pl-5">
          <span className="ms-data-label text-ms-slipstream-teal">
            System note
          </span>
          <p className="mt-4 text-base leading-7 text-ms-warm-white/62 sm:text-lg">
            {description}
          </p>
        </div>
      ) : null}
    </header>
  );
}
