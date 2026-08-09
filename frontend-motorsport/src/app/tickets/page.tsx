import type { Metadata } from "next";
import Link from "next/link";

import {
  EventListCard,
  InformationBand,
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
    "Secure your seat at Sarga Motorsport events. Curated ticket journey with partner redirects - no internal payment processing.",
};

const PLACEHOLDER_CTAS: Array<{
  label: string;
  provider: string;
  href: string;
  eventName: string;
  embedHref?: string;
}> = [
  {
    label: "Contact ticket desk",
    provider: "Ticketing information",
    href: "/contact",
    eventName: "2026 event availability",
  },
];

export default async function TicketsPage() {
  const [events, ctas] = await Promise.all([fetchEvents(), fetchTicketCtas()]);

  const ticketedEvents = events.filter((e) => e.ticketHref);
  const displayCtas = ctas.length > 0 ? ctas : PLACEHOLDER_CTAS;

  return (
    <PageShell spectrumSeparators>
      <PageHero
        kicker="Curated ticket journey"
        kickerColor="orange"
        title="Tickets"
        backgroundImage="/media/motorsport-design-hero.png"
        backgroundAlt="Race car throwing sparks under circuit lights"
        accent="orange"
        accentPosition="bottom-left"
        grain
        speedLines
        surface="heat"
        description="Sarga Motorsport partners with approved ticketing platforms. Every CTA below redirects to a secure partner checkout - we never process payment directly."
      />

      <InformationBand
        eyebrow="Ticket control / Partner routing"
        title="Your seat. Their secure checkout."
        description="Sarga Motorsport publishes approved destinations but never stores payment details or runs an internal ticket engine."
        items={[
          { label: "Checkout", value: "Partner" },
          { label: "Payment", value: "External" },
          { label: "Support", value: "Available" },
        ]}
      />

      {/* Featured ticket CTA */}
      <section className="ms-reflected-light-surface ms-section">
        <div className="ms-shell">
          <SectionHeader
            eyebrow="Featured ticket"
            title="Secure your seat."
            align="left"
          />
          <div className="mt-12 space-y-8">
            {displayCtas.map((cta, index) => (
              <div key={`${cta.href}-${cta.eventName}-${index}`}>
                <TicketCtaPanel
                  eyebrow="Official partner redirect"
                  title={cta.eventName ?? "Upcoming event"}
                  description="Checkout is handled by our approved ticketing partner. Secure payment, guaranteed entry, zero markup."
                  eventMeta={cta.eventName}
                  provider={cta.provider}
                  surface="reflected"
                  cta={{
                    label: cta.label,
                    href: cta.href,
                    external: cta.href.startsWith("http"),
                  }}
                />
                {/* Optional CMS-driven embed - only rendered when explicitly configured */}
                {cta.embedHref ? (
                  <div className="ms-blue-panel mt-4 p-4">
                    <p className="ms-data-label mb-3 text-ms-warm-white/52">
                      Embedded checkout
                    </p>
                    <iframe
                      src={cta.embedHref}
                      title={`Ticket checkout - ${cta.eventName ?? "event"}`}
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
        </div>
      </section>

      {/* Ticketed events */}
      {ticketedEvents.length > 0 ? (
        <section className="ms-reflected-light-surface ms-section">
          <div className="ms-shell">
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
          </div>
        </section>
      ) : null}

      {/* Info section */}
      <section className="ms-blue-heat-surface py-16">
        <div className="ms-shell grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="ms-heading-feature">How it works.</h2>
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
          <div className="ms-blue-panel ms-panel p-8">
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
