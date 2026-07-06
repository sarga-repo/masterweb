type EditorialHeadingProps = {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
  light?: boolean;
};

export function EditorialHeading({
  index,
  eyebrow,
  title,
  description,
  light = false,
}: EditorialHeadingProps) {
  return (
    <div className="grid min-w-0 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
      <div className="min-w-0">
        <div
          className={`flex items-center gap-4 text-[0.65rem] font-extrabold uppercase tracking-[0.2em] ${
            light ? "text-white/48" : "text-sarga-text/48"
          }`}
        >
          <span className={light ? "text-sarga-orange" : "text-sarga-red-dark"}>
            {index}
          </span>
          <span
            className={`h-px w-12 ${light ? "bg-sarga-orange" : "bg-sarga-red-dark"}`}
          />
          <span>{eyebrow}</span>
        </div>
        <h2
          className={`mt-8 max-w-full break-words font-heading text-[clamp(2.35rem,10.5vw,2.8rem)] font-bold uppercase leading-[0.88] tracking-[-0.045em] sm:max-w-[13ch] sm:break-normal sm:text-[clamp(2.5rem,3.75vw,4.2rem)] ${
            light ? "text-white" : "text-sarga-black"
          }`}
        >
          {title}
        </h2>
      </div>
      {description ? (
        <p
          className={`max-w-2xl text-base leading-7 sm:text-lg sm:leading-8 lg:justify-self-end ${
            light ? "text-white/62" : "text-sarga-text-muted"
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
