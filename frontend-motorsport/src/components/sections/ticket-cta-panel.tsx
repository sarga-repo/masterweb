import { LocaleLink as Link } from "@/components/i18n/locale-link";

import { ArrowRightIcon } from "@/components/ui/icons";
import { ResilientImage } from "@/components/ui/resilient-image";
import type { LinkItem } from "@/types/design-system";

type TicketCtaPanelProps = {
  eyebrow: string;
  title: string;
  description?: string;
  cta: LinkItem;
  provider?: string;
  providerLabel?: string;
  eventMeta?: string;
  eventMetaLabel?: string;
  partnerLabel?: string;
  footerText?: string;
  image?: string;
  surface?: "dark" | "reflected";
};

export function TicketCtaPanel({
  eyebrow,
  title,
  description,
  cta,
  provider,
  providerLabel = "Provider",
  eventMeta,
  eventMetaLabel = "Event",
  partnerLabel = "Partner redirect / Secure",
  footerText,
  image,
  surface = "dark",
}: TicketCtaPanelProps) {
  return (
    <aside
      className={`ms-panel relative overflow-hidden text-ms-warm-white ${surface === "reflected" ? "ms-ticket-panel-reflected" : "bg-ms-black"}`}
    >
      <div className="grid lg:grid-cols-[10rem_minmax(0,1fr)_18rem]">
        <div className="ms-heat-field hidden min-h-full border-r border-ms-warm-white/14 lg:block">
          <div
            className="h-full w-full bg-[repeating-linear-gradient(90deg,transparent_0_7px,rgba(5,5,5,.7)_7px_10px)]"
            aria-hidden="true"
          />
        </div>
        <div className="relative isolate overflow-hidden bg-ms-black">
          {image ? (
            <>
              <ResilientImage
                src={image}
                alt=""
                fallbackSrc="/media/motorsport-design-hero.png"
                width={1600}
                height={900}
                sizes="(min-width: 1024px) calc(100vw - 28rem), 100vw"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-br from-ms-black/95 via-ms-black/80 to-ms-black/60"
                aria-hidden="true"
              />
            </>
          ) : null}
          <div className="relative z-10 p-7 sm:p-12 lg:p-14">
            <p className="ms-data-label text-ms-ignition-orange">{eyebrow}</p>
            <h2 className="ms-heading-section mt-6 max-w-5xl">{title}</h2>
            {description ? (
              <p className="mt-6 max-w-2xl text-base leading-7 text-ms-warm-white/78">
                {description}
              </p>
            ) : null}
            {footerText || eventMeta || provider ? (
              <div className="mt-9 flex flex-wrap gap-5 border-t border-ms-warm-white/20 pt-5">
                {footerText ? (
                  <span className="ms-data-label text-ms-warm-white/70">
                    {footerText}
                  </span>
                ) : null}
                {eventMeta ? (
                  <span className="ms-data-label text-ms-warm-white/70">
                    {eventMetaLabel} / {eventMeta}
                  </span>
                ) : null}
                {provider ? (
                  <span className="ms-data-label text-ms-slipstream-teal">
                    {providerLabel} / {provider}
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
        <Link
          href={cta.href}
          target={cta.external ? "_blank" : undefined}
          rel={cta.external ? "noopener noreferrer" : undefined}
          className="group flex min-h-44 flex-col justify-between border-t border-ms-warm-white/14 bg-ms-apex-crimson p-7 text-ms-black transition-colors hover:bg-ms-ignition-orange lg:min-h-full lg:border-l lg:border-t-0"
        >
          <span className="ms-data-label text-ms-black/70">{partnerLabel}</span>
          <span className="font-display text-2xl uppercase leading-none">
            {cta.label}
          </span>
          <ArrowRightIcon className="size-7 transition-transform group-hover:translate-x-2" />
        </Link>
      </div>
    </aside>
  );
}
