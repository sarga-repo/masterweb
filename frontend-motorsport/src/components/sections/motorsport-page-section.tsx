import { LocaleLink } from "@/components/i18n/locale-link";
import { ResilientImage } from "@/components/ui/resilient-image";
import type { MotorsportNamedPageSection } from "@/lib/motorsport-page-foundation";

type MotorsportPageSectionProps = {
  section: MotorsportNamedPageSection;
};

export function MotorsportPageSection({ section }: MotorsportPageSectionProps) {
  if (!section.isActive) return null;

  return (
    <section
      className={`ms-section ms-page-section ms-page-section-${section.theme}`}
      data-cms-section-key="named-section"
      data-cms-enabled="true"
    >
      <div className="ms-shell grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,.6fr)] lg:items-center">
        <div>
          {section.eyebrow ? (
            <p className="ms-kicker text-ms-electric-yellow">
              {section.eyebrow}
            </p>
          ) : null}
          <h2 className="ms-heading-section mt-4">{section.title}</h2>
          {section.body ? (
            <p className="mt-5 max-w-2xl leading-7 text-ms-warm-white/72">
              {section.body}
            </p>
          ) : null}
          {section.ctaLabel && section.ctaUrl ? (
            <LocaleLink
              href={section.ctaUrl}
              target={section.ctaTarget === "newWindow" ? "_blank" : undefined}
              rel={section.ctaTarget === "newWindow" ? "noreferrer" : undefined}
              className="mt-7 inline-flex border-b border-ms-electric-yellow py-2 text-xs font-extrabold uppercase tracking-[0.12em] text-ms-warm-white"
            >
              {section.ctaLabel}
            </LocaleLink>
          ) : null}
        </div>
        {section.media ? (
          <div className="relative aspect-[4/3] overflow-hidden bg-ms-charcoal">
            <ResilientImage
              src={section.media.url}
              alt={section.media.alt ?? ""}
              fallbackSrc="/media/hero/sarga-motorsport-hero-circuit-golden-hour.jpg"
              fallbackAlt="Sarga Motorsport circuit at golden hour"
              fill
              sizes="(min-width: 1024px) 35vw, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
