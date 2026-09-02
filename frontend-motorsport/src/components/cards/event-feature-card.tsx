import { LocaleLink as Link } from "@/components/i18n/locale-link";

import { ArrowRightIcon } from "@/components/ui/icons";
import { ResilientImage } from "@/components/ui/resilient-image";
import { StatusChip } from "@/components/ui/status-chip";
import type { MotorsportEvent } from "@/types/design-system";

type EventFeatureCardProps = {
  event: MotorsportEvent;
  priority?: boolean;
  tone?: "light" | "dark";
  className?: string;
};

export function EventFeatureCard({
  event,
  priority = false,
  tone = "dark",
  className = "",
}: EventFeatureCardProps) {
  const light = tone === "light";

  return (
    <article
      className={`ms-panel group grid overflow-hidden lg:grid-cols-[minmax(0,1.65fr)_minmax(18rem,0.75fr)] ${light ? "ms-panel--light" : ""} ${className}`}
    >
      <Link
        href={event.href}
        className="relative min-h-[28rem] overflow-hidden text-ms-warm-white lg:min-h-[38rem]"
      >
        <ResilientImage
          src={event.image}
          alt={event.imageAlt}
          fallbackSrc="/media/motorsport-design-hero.png"
          fallbackAlt="Race car throwing sparks at speed on a dusk circuit"
          fill
          priority={priority}
          sizes="(max-width: 1024px) 100vw, 68vw"
          className="bg-ms-charcoal object-contain transition-transform duration-700 ease-(--ease-ms-out) group-hover:scale-[1.025] sm:object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-ms-black/76 via-transparent to-transparent"
        />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 sm:p-8">
          <div>
            <span className="ms-data-label text-ms-ignition-orange">
              Featured transmission
            </span>
            <h3 className="ms-heading-feature mt-3 max-w-[11ch] text-ms-warm-white">
              {event.title}
            </h3>
          </div>
          <span className="hidden size-14 place-items-center border border-ms-warm-white/50 bg-ms-black/60 text-ms-warm-white sm:grid">
            <ArrowRightIcon className="size-5" />
          </span>
        </div>
      </Link>

      <div
        className={`ms-event-feature-details flex flex-col ${light ? "bg-ms-draftline-blue text-ms-warm-white" : "bg-ms-black"}`}
      >
        <div className="flex items-center justify-between border-b border-ms-warm-white/12 p-5">
          <span className="ms-data-label text-ms-warm-white/42">
            Event control
          </span>
          <StatusChip
            status={event.status}
            className="ms-event-feature-status"
          />
        </div>
        <dl className="flex-1">
          {[
            ["Series", event.seriesName],
            ["Class", event.category],
            ["Date", event.dateLabel],
            ["Circuit", event.venue],
          ].map(([label, value], index) =>
            value ? (
              <div key={label} className="border-b border-ms-warm-white/10 p-5">
                <dt className="grid grid-cols-[2rem_1fr]">
                  <span
                    aria-hidden="true"
                    className="font-mono text-[0.58rem] text-ms-warm-white/48"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="ms-data-label text-ms-warm-white/58">
                    {label}
                  </span>
                </dt>
                <dd className="mt-2 pl-8 text-sm font-bold uppercase tracking-[0.06em]">
                  {value}
                </dd>
              </div>
            ) : null,
          )}
        </dl>
        <div className="grid grid-cols-2">
          <Link
            href={event.href}
            style={{
              backgroundColor: "#f5c800",
              color: "#050505",
              borderColor: "rgb(27 27 27 / 0.24)",
            }}
            className="ms-event-feature-file flex min-h-16 items-center justify-center border-r border-ms-warm-white/12 text-[0.65rem] font-black uppercase tracking-[0.16em] transition-colors"
          >
            Event file
          </Link>
          {event.ticketHref ? (
            <Link
              href={event.ticketHref}
              className="flex min-h-16 items-center justify-center bg-ms-apex-crimson text-[0.65rem] font-black uppercase tracking-[0.16em] hover:bg-ms-ignition-orange"
            >
              {event.ticketLabel ?? "Get tickets"}
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
