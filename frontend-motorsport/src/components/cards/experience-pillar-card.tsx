import { LocaleLink as Link } from "@/components/i18n/locale-link";

import { ArrowUpRightIcon } from "@/components/ui/icons";

type ExperiencePillarCardProps = {
  index: string;
  title: string;
  description: string;
  href?: string;
  accent?: "crimson" | "orange" | "yellow" | "teal" | "blue";
  className?: string;
};

const ACCENTS = {
  crimson: "text-ms-apex-crimson group-hover:bg-ms-apex-crimson",
  orange: "text-ms-ignition-orange group-hover:bg-ms-ignition-orange",
  yellow: "text-ms-electric-yellow group-hover:bg-ms-electric-yellow",
  teal: "text-ms-slipstream-teal group-hover:bg-ms-slipstream-teal",
  blue: "text-[#4d75da] group-hover:bg-ms-draftline-blue",
};

export function ExperiencePillarCard({
  index,
  title,
  description,
  href,
  accent = "crimson",
  className: additionalClassName = "",
}: ExperiencePillarCardProps) {
  const content = (
    <>
      <span
        className={`font-display text-xl transition-colors ${ACCENTS[accent]}`}
      >
        {index}
      </span>
      <div className="mt-20 sm:mt-28">
        <h3 className="ms-heading-feature">{title}</h3>
        <p className="mt-5 max-w-sm text-sm leading-6 text-ms-warm-white/55">
          {description}
        </p>
      </div>
      {href ? (
        <ArrowUpRightIcon className="absolute right-6 top-6 size-5 text-ms-warm-white/55 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
      ) : null}
    </>
  );

  const className = `group relative block min-h-[22rem] overflow-hidden border border-ms-warm-white/14 bg-[linear-gradient(135deg,rgba(7,26,61,.92),rgba(30,38,74,.88))] p-6 transition-colors hover:border-ms-warm-white/35 before:absolute before:inset-x-0 before:bottom-0 before:h-1 before:bg-current before:transition-[height] before:duration-500 before:ease-(--ease-ms-out) hover:before:h-3 ${additionalClassName}`;

  return href ? (
    <Link href={href} className={className}>
      {content}
    </Link>
  ) : (
    <article className={className}>{content}</article>
  );
}
