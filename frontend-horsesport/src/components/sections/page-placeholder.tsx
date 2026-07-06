import Link from "next/link";

import { SectionHeader } from "@/components/ui/section-header";
import { ArrowRightIcon } from "@/components/ui/icons";
import { StaircaseMark } from "@/components/ui/brand-marks";
import type { LinkItem } from "@/types/design-system";

type PagePlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
  /** Bullet list of what the finished page will contain. */
  sections?: string[];
  primaryCta?: LinkItem;
  secondaryCta?: LinkItem;
};

/**
 * Phase 3 shell content. Each route renders a branded, on-message placeholder
 * describing what the finished page will hold. The full CMS-driven experiences
 * arrive in HS-5 (homepage) and HS-6 (pages).
 */
export function PagePlaceholder({
  eyebrow,
  title,
  description,
  sections = [],
  primaryCta,
  secondaryCta,
}: PagePlaceholderProps) {
  return (
    <section className="hs-section hs-shell">
      <div className="grid gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <div>
          <SectionHeader eyebrow={eyebrow} title={title} description={description} />

          {(primaryCta || secondaryCta) && (
            <div className="mt-10 flex flex-wrap gap-4">
              {primaryCta ? (
                <Link
                  href={primaryCta.href}
                  className="hs-pill hs-interactive group inline-flex items-center gap-3 bg-hs-red px-7 py-4 text-[0.7rem] font-extrabold uppercase tracking-[0.14em] text-hs-white hover:bg-hs-orange"
                >
                  {primaryCta.label}
                  <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              ) : null}
              {secondaryCta ? (
                <Link
                  href={secondaryCta.href}
                  className="hs-pill hs-interactive group inline-flex items-center gap-3 border border-hs-cream/20 px-7 py-4 text-[0.7rem] font-extrabold uppercase tracking-[0.14em] text-hs-cream/75 hover:border-hs-orange hover:text-hs-orange"
                >
                  {secondaryCta.label}
                  <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              ) : null}
            </div>
          )}
        </div>

        {sections.length > 0 ? (
          <aside className="hs-card-glass relative p-8 sm:p-10">
            <div aria-hidden className="absolute -right-4 -top-4 size-28 rounded-bl-[var(--radius-hs-lg)] bg-hs-espresso/40" />
            <div className="relative flex items-center gap-3">
              <StaircaseMark steps={5} className="w-16 text-hs-orange" />
              <span className="hs-kicker text-hs-cream/50">On this page</span>
            </div>
            <ul className="mt-7 space-y-4">
              {sections.map((item, i) => (
                <li
                  key={item}
                  className="flex items-baseline gap-4 border-b border-hs-cream/10 pb-4 last:border-0 last:pb-0"
                >
                  <span className="hs-display text-sm text-hs-orange">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm leading-6 text-hs-cream/72">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-7 text-xs leading-6 text-hs-cream/40">
              Full experience arriving in an upcoming build phase.
            </p>
          </aside>
        ) : null}
      </div>
    </section>
  );
}
