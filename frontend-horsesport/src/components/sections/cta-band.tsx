import { LocaleLink as Link } from "@/components/i18n/locale-link";
import { ArrowRightIcon } from "@/components/ui/icons";
import type { LinkItem } from "@/types/design-system";

type CtaBandProps = {
  title: string;
  description?: string;
  primaryCta: LinkItem;
  secondaryCta?: LinkItem;
};

/**
 * Full-width closing CTA band - warm charcoal surface + brand rule + capsule
 * CTAs. Replaces the old cream CTA panels for consistency with the homepage.
 */
export function CtaBand({
  title,
  description,
  primaryCta,
  secondaryCta,
}: CtaBandProps) {
  return (
    <section className="hs-charcoal-section hs-section-tight relative overflow-hidden">
      <div
        aria-hidden
        className="hs-luxe-rule absolute inset-x-0 top-0 opacity-50"
      />
      <div className="hs-shell relative">
        <div className="max-w-2xl">
          <h2 className="hs-display text-[clamp(1.9rem,4vw,3.2rem)] text-hs-cream">
            {title}
          </h2>
          {description ? (
            <p className="hs-body-lg mt-4 max-w-xl text-hs-cream/60">
              {description}
            </p>
          ) : null}
          <div className="mt-9 flex flex-wrap gap-4">
            <Link href={primaryCta.href} className="hs-cta-primary">
              <span className="px-3">{primaryCta.label}</span>
              <span className="hs-cta-icon-circle">
                <ArrowRightIcon className="size-4" />
              </span>
            </Link>
            {secondaryCta ? (
              <Link href={secondaryCta.href} className="hs-cta-secondary">
                <span className="px-3">{secondaryCta.label}</span>
                <span className="hs-cta-icon-circle">
                  <ArrowRightIcon className="size-4" />
                </span>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
