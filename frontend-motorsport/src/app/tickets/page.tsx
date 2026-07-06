import type { Metadata } from "next";
import Link from "next/link";

import {
  EventListCard,
  GradientRule,
  PageHero,
  PageShell,
  SectionHeader,
  TicketCtaPanel,
} from "@/components";
import { ArrowRightIcon } from "@/components/ui/icons";
import { fetchEvents, fetchTicketCtas } from "@/lib/cms-data";

export const metadata: Metadata = {
  title: "Tickets",
  description:
    "Secure your seat at Sarga Motorsport events. Curated ticket journey with partner redirects — no internal payment processing.",
};

const PLACEHOLDER_CTAS: Array<{
  label: string;
  provider: string;
  href: string;
  eventName: string;
  embedCode?: string;
}> = [
  {
    label: "Get tickets",
    provider: "Official ticketing partner",
    href: "#",
    eventName: "Race Weekend Indonesia",
  },
];

export default async function TicketsPage() {
  const [events, ctas] = await Promise.all([fetchEvents(), fetchTicketCtas()]);

  const ticketedEvents = events.filter((e) => e.ticketHref);
  const displayCtas = ctas.length > 0 ? ctas : PLACEHOLDER_CTAS;

  return (
    <PageShell>
      <PageHero
        kicker="Curated ticket journey"
        kickerColor="orange"
        title="Tickets"
        accent="orange"
        accentPosition="bottom-left"
        grain
        description="Sarga Motorsport partners with approved ticketing platforms. Every CTA below redirects to a secure partner checkout — we never process payment directly."
      />

      <GradientRule />

      {/* Featured ticket CTA */}
      <section className="ms-section ms-shell">
        <SectionHeader
          eyebrow="Featured ticket"
          title="Secure your seat."
          align="left"
        />
        <div className="mt-12 space-y-8">
          {displayCtas.map((cta) => (
            <div key={cta.href + cta.eventName}>
              <TicketCtaPanel
                eyebrow="Official partner redirect"
                title={cta.eventName ?? "Upcoming event"}
                description="Checkout is handled by our approved ticketing partner. Secure payment, guaranteed entry, zero markup."
                eventMeta={cta.eventName}
                provider={cta.provider}
                cta={{
                  label: cta.label,
                  href: cta.href,
                  external: cta.href.startsWith("http"),
                }}
              />
              {/* Optional CMS-driven embed — only rendered when explicitly configured */}
              {cta.embedCode ? (
                <div className="mt-4 border border-ms-warm-white/12 bg-ms-black p-4">
                  <p className="ms-data-label mb-3 text-ms-warm-white/42">
                    Embedded checkout
                  </p>
                  <iframe
                    src={cta.embedCode}
                    title={`Ticket checkout — ${cta.eventName ?? "event"}`}
                    className="h-[32rem] w-full border-0"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      {/* Ticketed events */}
      {ticketedEvents.length > 0 ? (
        <section className="ms-section ms-shell border-t border-ms-warm-white/12">
          <SectionHeader
            index="TICKETS"
            eyebrow="Events with tickets available"
            title="On sale now."
            align="left"
          />
          <div className="mt-12">
            {ticketedEvents.map((event, i) => (
              <EventListCard
                key={event.href}
                event={event}
                index={String(i + 1).padStart(2, "0")}
              />
            ))}
          </div>
        </section>
      ) : null}

      {/* Info section */}
      <section className="ms-shell border-t border-ms-warm-white/12 py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="ms-display text-[clamp(1.5rem,3vw,3rem)]">
              How it works.
            </h2>
            <ul className="mt-8 space-y-5 text-base leading-7 text-ms-warm-white/60">
              <li className="flex gap-4">
                <span className="mt-1 block h-6 w-1 bg-ms-apex-crimson" />
                Select an event and click the ticket CTA.
              </li>
              <li className="flex gap-4">
                <span className="mt-1 block h-6 w-1 bg-ms-ignition-orange" />
                You&apos;ll be redirected to our approved ticketing partner.
              </li>
              <li className="flex gap-4">
                <span className="mt-1 block h-6 w-1 bg-ms-electric-yellow" />
                Complete your purchase on the partner platform securely.
              </li>
              <li className="flex gap-4">
                <span className="mt-1 block h-6 w-1 bg-ms-slipstream-teal" />
                Receive your confirmation and show up on race day.
              </li>
            </ul>
          </div>
          <div className="ms-panel bg-ms-black p-8">
            <span className="ms-data-label text-ms-warm-white/42">
              Ticket support
            </span>
            <p className="mt-6 text-base leading-7 text-ms-warm-white/60">
              Need help with your ticket? Contact our support team for
              event-specific inquiries, group bookings, or accessibility
              requests.
            </p>
            <Link
              href="/contact"
              className="group mt-8 inline-flex items-center gap-3 border-b border-ms-apex-crimson pb-2 text-[0.66rem] font-black uppercase tracking-[0.16em] transition-colors hover:text-ms-ignition-orange"
            >
              Contact support
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
