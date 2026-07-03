import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";
import { RacingGraphic } from "@/components/ui/racing-graphic";
import { ticketHubCta } from "@/lib/mock-data";

export function TicketHubCta() {
  return (
    <section className="relative isolate overflow-hidden bg-sarga-red-dark text-white">
      <span
        aria-hidden="true"
        className="velocity-grain absolute inset-0 -z-20"
      />
      <RacingGraphic
        variant="bands"
        className="absolute inset-y-0 -right-[30%] -z-10 h-full w-[85%] rotate-180 text-white"
      />
      <div className="site-container py-20 sm:py-28 lg:py-36">
        <div className="flex items-center gap-4 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-white">
          <span>05</span>
          <span className="h-px w-12 bg-white/70" />
          <span>{ticketHubCta.eyebrow}</span>
        </div>

        <div className="mt-12 grid min-w-0 gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="min-w-0">
            <h2 className="max-w-full break-words font-heading text-[clamp(2.4rem,12vw,3.5rem)] font-black uppercase leading-[0.86] tracking-[-0.05em] sm:max-w-[14ch] sm:text-[clamp(3rem,4.8vw,5rem)]">
              Move from spectator to the centre of it.
            </h2>
            <p className="mt-9 max-w-2xl text-base leading-7 text-white/78 sm:text-lg sm:leading-8">
              {ticketHubCta.description}
            </p>
          </div>

          <Link
            href={ticketHubCta.ctaUrl}
            className="group flex h-40 w-40 shrink-0 flex-col items-center justify-center gap-4 rounded-full border border-white/65 text-center text-[0.65rem] font-extrabold uppercase tracking-[0.15em] transition-[background-color,color,transform] duration-300 hover:-translate-y-2 hover:bg-white hover:text-sarga-red sm:h-48 sm:w-48"
          >
            {ticketHubCta.ctaLabel}
            <ArrowRightIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
