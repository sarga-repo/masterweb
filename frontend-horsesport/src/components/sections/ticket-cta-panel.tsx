import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { TicketIcon } from "@/components/ui/hs-icons";

type TicketCtaPanelProps = {
  label: string;
  href: string;
  external?: boolean;
  provider?: string;
  eventName?: string;
  eventDate?: string;
  /** Allowlisted partner embed src. When set, an iframe renders below the stub. */
  embedHref?: string;
};

/**
 * Ticket-stub CTA — a thin capsule split by a dashed perforation line (with
 * punched notches), echoing a physical race-day ticket. Left stub carries the
 * event + provider; the right stub is the partner-redirect action. No nested
 * boxes, no split grey gradient — one clean, distinctive shape.
 */
export function TicketCtaPanel({
  label,
  href,
  external = false,
  provider,
  eventName,
  eventDate,
  embedHref,
}: TicketCtaPanelProps) {
  const CtaTag = external ? "a" : Link;
  const ctaProps = external
    ? { href, target: "_blank", rel: "noreferrer" }
    : { href };

  return (
    <div className="flex flex-col gap-4">
    <div
      className="relative overflow-hidden rounded-[1.75rem] border border-hs-cream/12 shadow-[var(--shadow-hs-card)] sm:rounded-full"
      style={{
        background:
          "linear-gradient(100deg, #17120d 0%, #1b130f 60%, #251410 100%)",
      }}
    >
      {/* warm glow toward the action side — one restrained accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(42% 130% at 100% 50%, rgb(237 27 47 / 0.16), transparent 62%)",
        }}
      />

      <div className="relative flex flex-col sm:flex-row sm:items-center">
        {/* ── Left stub: event + provider ── */}
        <div className="flex-1 px-8 py-6 sm:py-7 sm:pl-14 sm:pr-9">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <span className="hs-kicker inline-flex items-center gap-2 text-hs-orange">
              <TicketIcon className="size-3.5" />
              {provider ?? "Partner Ticketing"}
            </span>
            {eventDate ? (
              <span className="hs-kicker text-hs-cream/40">{eventDate}</span>
            ) : null}
          </div>
          <h3 className="hs-display mt-3 max-w-[24ch] text-[clamp(1.25rem,2.4vw,1.9rem)] leading-[1] text-hs-cream">
            {eventName ?? "Secure your race-day seats."}
          </h3>
          <p className="mt-2.5 text-[0.78rem] text-hs-cream/45">
            Verified partner redirect · no internal checkout
          </p>
        </div>

        {/* ── Perforation divider (vertical on sm+) ── */}
        <div
          aria-hidden
          className="relative hidden shrink-0 self-stretch sm:flex sm:items-center"
        >
          <span
            className="absolute -top-[7px] left-1/2 size-3.5 -translate-x-1/2 rounded-full border border-hs-cream/12"
            style={{ background: "var(--hs-surface-page)" }}
          />
          <span
            className="absolute -bottom-[7px] left-1/2 size-3.5 -translate-x-1/2 rounded-full border border-hs-cream/12"
            style={{ background: "var(--hs-surface-page)" }}
          />
          <div className="mx-2 h-[56%] w-px border-l border-dashed border-hs-cream/30" />
        </div>
        {/* mobile horizontal perforation */}
        <div
          aria-hidden
          className="mx-8 border-t border-dashed border-hs-cream/25 sm:hidden"
        />

        {/* ── Right stub: action ── */}
        <div className="flex shrink-0 flex-col items-start gap-2.5 px-8 py-6 sm:items-end sm:py-7 sm:pl-9 sm:pr-14">
          <CtaTag {...ctaProps} className="hs-cta-primary">
            <span className="px-3">{label}</span>
            <span className="hs-cta-icon-circle">
              <ArrowUpRightIcon className="size-4" />
            </span>
          </CtaTag>
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-hs-cream/38">
            Guaranteed entry · Zero markup
          </p>
        </div>
      </div>
    </div>

      {/* Allowlisted partner embed (CMS-configured). The redirect CTA above
          remains the primary, accessible path. */}
      {embedHref ? (
        <div className="overflow-hidden rounded-[1.75rem] border border-hs-cream/12">
          <iframe
            src={embedHref}
            title={`${eventName ?? "Ticket"} — partner ticketing`}
            loading="lazy"
            sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
            referrerPolicy="no-referrer"
            className="h-[32rem] w-full bg-hs-black/40"
          />
        </div>
      ) : null}
    </div>
  );
}
