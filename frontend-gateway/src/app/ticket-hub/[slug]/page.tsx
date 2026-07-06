import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InteriorHero } from "@/components/sections/interior-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { ArrowRightIcon } from "@/components/ui/icons";
import { getEventBySlug, getEvents } from "@/lib/strapi/events";
import { motorsportUrl } from "@/lib/site-config";
import { createMetadata, siteUrl } from "@/lib/seo/metadata";
import { safeTicketEmbedUrl, safeTicketUrl } from "@/lib/ticketing/safe-url";

type EventPageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const events = await getEvents();
  return events.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  return createMetadata({
    title: event?.title ?? "Event not found",
    description: event?.description ?? "Sarga live event.",
    path: `/ticket-hub/${slug}`,
    image: event?.coverImage?.url,
    seo: event?.seo,
  });
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  /* Motorsport-scoped events: redirect visitors to the dedicated site. */
  const motorsportHref =
    event.siteScope === "motorsport"
      ? motorsportUrl(`/events/${event.slug}`)
      : undefined;

  const ticketUrl = safeTicketUrl(event.ticketUrl, event.ticketIntegrationType);
  const embedUrl =
    event.ticketIntegrationType === "embed"
      ? safeTicketEmbedUrl(event.embedUrl)
      : undefined;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Event",
          name: event.title,
          description: event.description,
          startDate: event.eventDate,
          endDate: event.endDate,
          eventStatus: "https://schema.org/EventScheduled",
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          location: event.venue
            ? { "@type": "Place", name: event.venue }
            : undefined,
          image: event.coverImage?.url,
          url: `${siteUrl}/ticket-hub/${event.slug}`,
          offers: ticketUrl
            ? {
                "@type": "Offer",
                url: ticketUrl,
                availability: "https://schema.org/InStock",
              }
            : undefined,
        }}
      />
      <InteriorHero
        index="Live"
        eyebrow={event.status ?? "Event"}
        title={event.title}
        description={event.description}
        image={event.coverImage}
        meta={[
          event.eventDate
            ? `Starts - ${event.eventDate}`
            : "Date to be announced",
          event.endDate ? `Ends - ${event.endDate}` : "Single-day experience",
          event.venue ?? "Venue to be announced",
          "Tickets via approved partner",
        ]}
      />

      <section className="gateway-surface-light-signature bg-sarga-light py-20 sm:py-28 lg:py-36">
        <div className="site-container grid gap-12 lg:grid-cols-[0.65fr_1.35fr]">
          <div className="border-t border-sarga-black pt-5 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-sarga-text/45">
            Event access protocol
          </div>
          <div>
            <h2 className="max-w-[15ch] font-heading text-[clamp(3rem,10vw,3.25rem)] font-bold uppercase leading-[0.9] tracking-[-0.04em] sm:text-[clamp(3rem,3.6vw,4rem)]">
              One weekend. Every Sarga world in motion.
            </h2>
            <p className="mt-8 max-w-3xl text-lg leading-9 text-sarga-text-muted">
              {event.description}
            </p>
            {motorsportHref ? (
              <a
                href={motorsportHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-10 inline-flex items-center gap-4 bg-sarga-red px-7 py-5 text-xs font-extrabold uppercase tracking-[0.16em] text-white"
              >
                View on Sarga Motorsport
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            ) : ticketUrl ? (
              <a
                href={ticketUrl}
                rel="noopener noreferrer"
                target="_blank"
                className="group mt-10 inline-flex items-center gap-4 bg-sarga-red px-7 py-5 text-xs font-extrabold uppercase tracking-[0.16em] text-white"
              >
                {event.ticketCtaLabel ?? "Continue to ticket partner"}
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            ) : (
              <p className="mt-10 inline-flex border border-sarga-black/20 px-6 py-5 text-xs font-extrabold uppercase tracking-[0.16em] text-sarga-text/55">
                {event.ticketCtaLabel ?? "Partner ticket link coming soon"}
              </p>
            )}
            <p className="mt-6 max-w-2xl text-xs leading-6 text-sarga-text/48">
              No payment occurs on Sarga.co. When released, the ticket action
              will open the organizer&apos;s approved external platform.
            </p>
            <Link
              href="/ticket-hub"
              className="group mt-12 inline-flex items-center gap-4 border-b border-sarga-black pb-2 text-xs font-extrabold uppercase tracking-[0.16em]"
            >
              Back to Ticket Hub
              <ArrowRightIcon className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {embedUrl ? (
        <section className="bg-sarga-black py-20 text-white sm:py-28">
          <div className="site-container">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-5 border-b border-white/20 pb-6">
              <div>
                <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-sarga-red">
                  Approved partner embed
                </p>
                <h2 className="mt-3 font-heading text-3xl font-bold uppercase tracking-[-0.03em] sm:text-[2rem]">
                  Continue with the ticket partner.
                </h2>
              </div>
              <a
                href={ticketUrl ?? embedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-extrabold uppercase tracking-[0.16em]"
              >
                Open partner site ↗
              </a>
            </div>
            <iframe
              src={embedUrl}
              title={`${event.title} ticket partner`}
              loading="lazy"
              sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-scripts allow-same-origin"
              referrerPolicy="strict-origin-when-cross-origin"
              className="min-h-[42rem] w-full border border-white/20 bg-white"
            />
          </div>
        </section>
      ) : null}
    </>
  );
}
