import { LocaleLink as Link } from "@/components/i18n/locale-link";

import { DisciplineGrid } from "@/components/sections/discipline-grid";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import type { DisciplineItem } from "@/types/design-system";

function GlobeMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 96 96"
      className="size-16 shrink-0 text-ms-warm-white sm:size-20"
      fill="none"
    >
      <circle cx="48" cy="48" r="41" stroke="currentColor" strokeWidth="5" />
      <path
        d="M12 42c9 2 15 7 18 14 2 5 7 6 12 3 5-4 9-2 11 3 2 7 7 13 15 18M27 16c5 8 12 10 20 7 6-2 11 0 14 5 4 6 10 8 19 5M52 8c-5 8-6 16-3 23 2 6 0 11-6 15-7 4-11 10-10 18"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

type WorldOfMotorsportProps = {
  eyebrow: string;
  titlePrefix: string;
  titleAccent: string;
  description: string;
  ctaLabel: string;
  ctaUrl: string;
  disciplines: DisciplineItem[];
};

export function WorldOfMotorsport({
  eyebrow,
  titlePrefix,
  titleAccent,
  description,
  ctaLabel,
  ctaUrl,
  disciplines,
}: WorldOfMotorsportProps) {
  return (
    <section className="relative isolate overflow-hidden border-y border-ms-warm-white/12 bg-[#05132c] py-20 text-ms-warm-white sm:py-24 lg:py-28">
      <div
        className="ms-track-grid absolute inset-0 opacity-25"
        aria-hidden="true"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(circle_at_50%_110%,rgba(232,25,44,.7),transparent_42%),radial-gradient(circle_at_0%_100%,rgba(255,107,0,.5),transparent_34%),radial-gradient(circle_at_100%_100%,rgba(0,51,160,.5),transparent_32%)]"
      />

      <div className="ms-shell relative">
        <div className="flex flex-col justify-between gap-8 pb-12 lg:flex-row lg:items-end">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-7">
            <GlobeMark />
            <div>
              <p className="ms-kicker text-ms-slipstream-teal">{eyebrow}</p>
              <h2 className="ms-heading-page mt-3 text-ms-warm-white">
                {titlePrefix}{" "}
                <span className="block text-ms-apex-crimson">
                  {titleAccent}
                </span>
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-ms-warm-white/68">
                {description}
              </p>
            </div>
          </div>
          <Link
            href={ctaUrl}
            className="group inline-flex min-h-12 w-fit items-center gap-3 border-b border-ms-warm-white/30 text-[0.65rem] font-black uppercase tracking-[0.16em] transition-colors hover:border-ms-electric-yellow hover:text-ms-electric-yellow"
          >
            {ctaLabel}
            <ArrowUpRightIcon className="size-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
          </Link>
        </div>

        <DisciplineGrid
          items={disciplines}
          label="Explore motorsport disciplines"
        />
      </div>
    </section>
  );
}
