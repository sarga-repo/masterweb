import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";
import { CalendarIcon, PinIcon } from "@/components/ui/hs-icons";
import type { EventCardData } from "@/types/design-system";

type RaceEventCardProps = {
  event: EventCardData;
  priority?: boolean;
  feature?: boolean;
  className?: string;
};

/** Premium race event card - Double-Bezel with cinematic image, discipline chips, hover kinetic tension. */
export function RaceEventCard({
  event,
  priority = false,
  feature = false,
  className = "",
}: RaceEventCardProps) {
  return (
    <Link
      href={event.href}
      className={`hs-card-glass group block h-full focus-visible:outline-none ${feature ? "xl:flex" : "flex flex-col"} ${className}`}
    >
      <div
        className={`relative overflow-hidden ${feature ? "aspect-[16/11] xl:aspect-auto xl:min-h-[24rem] xl:w-[56%]" : "aspect-[4/3]"}`}
      >
        {event.image ? (
          <Image
            src={event.image}
            alt={event.imageAlt ?? event.title}
            fill
            priority={priority}
            sizes={
              feature
                ? "(max-width: 1280px) 100vw, 60vw"
                : "(max-width: 768px) 100vw, 33vw"
            }
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-hs-espresso/60" aria-hidden />
        )}
        <div
          aria-hidden
          className={`absolute inset-0 ${feature ? "bg-gradient-to-t from-black/60 via-black/20 to-black/5xl:bg-gradient-to-r xl:from-black/8 xl:via-black/30 xl:to-black/40" : "bg-gradient-to-t from-black/60 via-black/20 to-black/5"}`}
        />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {event.discipline ? (
            <span className="hs-pill bg-hs-red px-3 py-1.5 text-[0.56rem] font-extrabold uppercase tracking-[0.16em] text-hs-white shadow-[0_0.25rem_1rem_rgb(237_27_47_/_0.35)]">
              {event.discipline}
            </span>
          ) : null}
          {event.status ? (
            <span className="hs-pill bg-hs-cream/90 px-3 py-1.5 text-[0.56rem] font-extrabold uppercase tracking-[0.16em] text-hs-espresso backdrop-blur-sm">
              {event.status}
            </span>
          ) : null}
        </div>
      </div>
      <div
        className={`flex flex-1 flex-col ${feature ? "p-7 sm:p-8 xl:justify-between xl:p-9" : "p-6"}`}
      >
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-[0.64rem] font-semibold uppercase tracking-[0.1em] text-hs-cream/48">
          {event.dateLabel ? (
            <span className="inline-flex items-center gap-1.5">
              <CalendarIcon className="size-3.5 text-hs-orange/80" />
              {event.dateLabel}
            </span>
          ) : null}
          {event.venue ? (
            <span className="inline-flex items-center gap-1.5">
              <PinIcon className="size-3.5 text-hs-orange/80" />
              {event.venue}
            </span>
          ) : null}
        </div>
        <h3
          className={`hs-display mt-4 leading-tight text-hs-cream transition-colors duration-400 group-hover:text-hs-orange ${feature ? "max-w-[13ch] text-[clamp(1.8rem,3vw,3rem)]" : "text-xl"}`}
        >
          {event.title}
        </h3>
        {feature ? (
          <p className="mt-4 max-w-[34rem] text-sm leading-7 text-hs-cream/48">
            Race-day entry, hospitality access, and championship atmosphere
            curated into a single premium spectator moment.
          </p>
        ) : null}
        <div className="mt-auto flex items-end justify-between gap-5 pt-5">
          <span className="inline-flex items-center gap-2 text-[0.64rem] font-extrabold uppercase tracking-[0.14em] text-hs-cream/65 transition-colors duration-400 group-hover:text-hs-orange">
            View race day
            <span className="hs-button-icon size-7">
              <ArrowRightIcon className="size-3.5" />
            </span>
          </span>
          {feature && event.status ? (
            <span className="hidden rounded-full border border-hs-cream/10 bg-hs-cream/[0.04] px-3 py-1.5 text-[0.56rem] font-bold uppercase tracking-[0.16em] text-hs-cream/38 xl:inline-flex">
              {event.status}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
