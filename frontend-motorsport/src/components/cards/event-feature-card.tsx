import Image from "next/image";
import Link from "next/link";

import { ArrowRightIcon } from "@/components/ui/icons";
import { StatusChip } from "@/components/ui/status-chip";
import type { MotorsportEvent } from "@/types/design-system";

type EventFeatureCardProps = {
  event: MotorsportEvent;
  priority?: boolean;
  className?: string;
};

export function EventFeatureCard({
  event,
  priority = false,
  className = "",
}: EventFeatureCardProps) {
  return (
    <article
      className={`ms-panel group grid overflow-hidden lg:grid-cols-[minmax(0,1.65fr)_minmax(18rem,0.75fr)] ${className}`}
    >
      <Link
        href={event.href}
        className="relative min-h-[28rem] overflow-hidden lg:min-h-[38rem]"
      >
        <Image
          src={event.image}
          alt={event.imageAlt}
          fill
          priority={priority}
          sizes="(max-width: 1024px) 100vw, 68vw"
          className="object-cover transition-transform duration-700 ease-(--ease-ms-out) group-hover:scale-[1.025]"
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
            <h3 className="ms-display mt-3 max-w-[11ch] text-[clamp(2.03rem,3.75vw,4.13rem)]">
              {event.title}
            </h3>
          </div>
          <span className="hidden size-14 place-items-center border border-ms-warm-white/35 bg-ms-black/50 sm:grid">
            <ArrowRightIcon className="size-5" />
          </span>
        </div>
      </Link>

      <div className="flex flex-col bg-ms-black">
        <div className="flex items-center justify-between border-b border-ms-warm-white/12 p-5">
          <span className="ms-data-label text-ms-warm-white/42">
            Event control
          </span>
          <StatusChip status={event.status} />
        </div>
        <dl className="flex-1">
          {[
            ["Series", event.seriesName],
            ["Class", event.category],
            ["Date", event.dateLabel],
            ["Circuit", event.venue],
          ].map(([label, value], index) =>
            value ? (
              <div
                key={label}
                className="grid grid-cols-[2rem_1fr] border-b border-ms-warm-white/10 p-5"
              >
                <span className="font-mono text-[0.58rem] text-ms-warm-white/24">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <dt className="ms-data-label text-ms-warm-white/34">
                    {label}
                  </dt>
                  <dd className="mt-2 text-sm font-bold uppercase tracking-[0.06em]">
                    {value}
                  </dd>
                </div>
              </div>
            ) : null,
          )}
        </dl>
        <div className="grid grid-cols-2">
          <Link
            href={event.href}
            className="flex min-h-16 items-center justify-center border-r border-ms-warm-white/12 text-[0.65rem] font-black uppercase tracking-[0.16em] transition-colors hover:bg-ms-warm-white/8 hover:text-ms-electric-yellow"
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
