import type { Metadata } from "next";
import Link from "next/link";

import { PageHero, TicketCtaPanel, ScrollReveal, SectionHeader } from "@/components";
import { fetchTicketsPage } from "@/lib/cms-content";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "Tickets",
  description:
    "Secure Sarga Horse Sport race-day tickets through approved partner platforms. No internal checkout - official partner redirect only.",
  path: "/tickets",
});

export default async function TicketsPage() {
  const tickets = await fetchTicketsPage();
  const active = tickets.filter((t) => t.isActive);

  return (
    <>
      <PageHero
        eyebrow="Tickets"
        title="Witness it live."
        description="Race-day tickets are handled by our approved partner platforms - secure, guaranteed entry, zero markup."
        backgroundImage="/media/news-merdeka.png"
        backgroundAlt="Grandstand crowd watching a derby on race day"
        accent="orange"
      />

      <section className="hs-section hs-shell">
        <SectionHeader
          index="01"
          eyebrow="Official ticketing"
          title="Partner ticketing, centralised."
          description="Every Sarga Horse Sport ticket link routes to an approved partner platform. Sarga never processes payment or runs an internal checkout."
        />

        {active.length > 0 ? (
          <div className="mt-12 flex flex-col gap-6">
            {active.map((ticket, i) => (
              <ScrollReveal key={ticket.id} delay={(i % 3) * 100}>
                <TicketCtaPanel
                  label={ticket.label}
                  href={ticket.href}
                  external={ticket.external}
                  provider={ticket.provider}
                  eventName={ticket.title}
                  embedHref={ticket.embedHref}
                />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="hs-card-glass mt-12 p-12 text-center">
            <p className="hs-display text-2xl text-hs-cream">No tickets on sale right now.</p>
            <p className="mt-3 text-sm text-hs-cream/55">
              New race days are announced regularly - explore what&apos;s coming up.
            </p>
            <Link
              href="/events"
              className="hs-pill mt-6 inline-flex bg-hs-red px-6 py-3 text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-hs-white hover:bg-hs-orange"
            >
              Browse events
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
