import Image from "next/image";
import { LocaleLink as Link } from "@/components/i18n/locale-link";
import { ArrowRightIcon } from "@/components/ui/icons";
import { PinIcon } from "@/components/ui/hs-icons";
import type { VenueCardData } from "@/types/design-system";

/** Tall cinematic venue card - immersive 3:4 crop with warm gradient overlay. Double-Bezel architecture. */
export function VenueHighlightCard({ venue }: { venue: VenueCardData }) {
  const Wrapper = venue.href ? Link : "div";
  const wrapperProps = venue.href ? { href: venue.href } : {};

  return (
    <Wrapper
      {...(wrapperProps as { href: string })}
      className="hs-card-glass group block overflow-hidden focus-visible:outline-none"
    >
      <div className="relative flex aspect-[3/4] flex-col justify-end overflow-hidden">
        {venue.image ? (
          <Image
            src={venue.image}
            alt={venue.imageAlt ?? venue.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-hs-espresso/60" aria-hidden />
        )}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/5"
        />
        <div className="relative z-10 p-6">
          {venue.location ? (
            <span className="inline-flex items-center gap-1.5 text-[0.6rem] font-extrabold uppercase tracking-[0.16em] text-hs-orange">
              <PinIcon className="size-3.5" /> {venue.location}
            </span>
          ) : null}
          <h3 className="hs-display mt-3 text-2xl text-hs-white">
            {venue.name}
          </h3>
          {venue.description ? (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-hs-white">
              {venue.description}
            </p>
          ) : null}
          {venue.href ? (
            <span className="mt-4 inline-flex items-center gap-2 text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-hs-white transition-colors duration-400 group-hover:text-hs-orange">
              Explore venue
              <span className="hs-button-icon size-7">
                <ArrowRightIcon className="size-3.5" />
              </span>
            </span>
          ) : null}
        </div>
      </div>
    </Wrapper>
  );
}
