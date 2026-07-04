import Image from "next/image";
import Link from "next/link";

import { ArrowUpRightIcon } from "@/components/ui/icons";
import { StatusChip } from "@/components/ui/status-chip";
import type { MotorsportEvent } from "@/types/design-system";

type EventListCardProps = {
  event: MotorsportEvent;
  index?: string;
};

export function EventListCard({ event, index }: EventListCardProps) {
  return (
    <article className="group grid border-t border-ms-warm-white/15 py-5 sm:grid-cols-[5rem_12rem_minmax(0,1fr)_auto] sm:items-center sm:gap-6">
      <span className="hidden font-display text-lg text-ms-warm-white/28 sm:block">
        {index}
      </span>
      <Link
        href={event.href}
        className="relative aspect-[16/10] overflow-hidden bg-ms-charcoal"
      >
        <Image
          src={event.image}
          alt={event.imageAlt}
          fill
          sizes="12rem"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="mt-5 min-w-0 sm:mt-0">
        <div className="flex flex-wrap items-center gap-3">
          <StatusChip status={event.status} />
          <span className="ms-kicker text-ms-warm-white/38">
            {event.dateLabel}
          </span>
        </div>
        <h3 className="mt-4 font-display text-2xl uppercase leading-[0.98] sm:text-3xl">
          {event.title}
        </h3>
        <p className="mt-2 text-sm text-ms-warm-white/52">{event.venue}</p>
      </div>
      <Link
        href={event.href}
        aria-label={`View ${event.title}`}
        className="mt-5 grid size-12 place-items-center border border-ms-warm-white/18 transition-colors hover:border-ms-apex-crimson hover:bg-ms-apex-crimson sm:mt-0"
      >
        <ArrowUpRightIcon className="size-5" />
      </Link>
    </article>
  );
}
