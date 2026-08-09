import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  Breadcrumbs,
  PageHero,
  RichText,
  SectionHeader,
  TicketCtaPanel,
  SeoJsonLd,
} from "@/components";
import {
  CalendarIcon,
  PinIcon,
  TrackIcon,
  ClockIcon,
} from "@/components/ui/hs-icons";
import { fetchEventDetail, fetchEventsPage } from "@/lib/cms-content";
import { createMetadata } from "@/lib/seo/metadata";
import { resolveSiteUrl, siteConfig } from "@/lib/site-config";

type Params = { params: Promise<{ slug: string }> };

/** Pre-render known event slugs; unknown slugs 404 (dynamicParams stays true
 *  so new CMS events still render on demand via ISR). */
export async function generateStaticParams() {
  const events = await fetchEventsPage();
  return events.map((event) => ({
    slug: event.href.replace(/^\/events\//, ""),
  }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const event = await fetchEventDetail(slug);
  if (!event) notFound();
  return createMetadata({
    title: event.title,
    description:
      event.description?.slice(0, 155) ??
      `${event.title} - Sarga Horse Sport event.`,
    path: `/events/${slug}`,
    image: event.image,
    type: "article",
  });
}

function Meta({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 border-b border-hs-cream/8 pb-4 last:border-0 last:pb-0">
      <span className="mt-0.5 shrink-0 text-hs-orange">{icon}</span>
      <div>
        <dt className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-hs-cream/45">
          {label}
        </dt>
        <dd className="mt-1 text-sm font-medium text-hs-cream">{value}</dd>
      </div>
    </div>
  );
}

export default async function EventDetailPage({ params }: Params) {
  const { slug } = await params;
  const event = await fetchEventDetail(slug);
  if (!event) notFound();

  const dateRange = event.endDateLabel
    ? `${event.dateLabel} – ${event.endDateLabel}`
    : event.dateLabel;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    url: resolveSiteUrl(`/events/${slug}`),
    ...(event.description ? { description: event.description } : {}),
    ...(event.startDateIso ? { startDate: event.startDateIso } : {}),
    ...(event.endDateIso ? { endDate: event.endDateIso } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    ...(event.venue
      ? {
          location: {
            "@type": "Place",
            name: event.venue,
            ...(event.venueAddress ? { address: event.venueAddress } : {}),
          },
        }
      : {}),
    ...(event.image ? { image: event.image } : {}),
    organizer: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.siteUrl,
    },
    ...(event.ticket
      ? {
          offers: {
            "@type": "Offer",
            url: event.ticket.href,
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
  };

  return (
    <>
      <SeoJsonLd data={jsonLd} />
      <PageHero
        eyebrow={event.discipline ?? "Event"}
        title={event.title}
        description={
          dateRange
            ? `${dateRange}${event.venue ? ` · ${event.venue}` : ""}`
            : undefined
        }
        backgroundImage={event.image}
        backgroundAlt={event.imageAlt ?? event.title}
        accent="red"
      >
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Events", href: "/events" },
            { label: event.title },
          ]}
        />
      </PageHero>

      <section className="hs-section hs-shell">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_0.9fr] lg:items-start">
          <div>
            {event.description ? (
              <>
                <SectionHeader
                  eyebrow="About the event"
                  title="Race-day briefing."
                />
                <RichText value={event.description} className="mt-6" />
              </>
            ) : null}

            {event.schedule.length > 0 ? (
              <div className="mt-14">
                <SectionHeader eyebrow="Programme" title="Race schedule." />
                <ul className="mt-6 divide-y divide-hs-cream/10 overflow-hidden rounded-[var(--radius-hs-lg)] border border-hs-cream/12">
                  {event.schedule.map((row, i) => (
                    <li
                      key={i}
                      className="flex flex-wrap items-baseline gap-x-6 gap-y-1 bg-hs-surface-panel p-5"
                    >
                      <span className="inline-flex items-center gap-2 text-sm font-bold text-hs-orange">
                        <ClockIcon className="size-4" />
                        {row.time ?? row.day ?? "TBA"}
                      </span>
                      <span className="hs-display text-base text-hs-cream">
                        {row.label}
                      </span>
                      {row.description ? (
                        <span className="w-full text-sm text-hs-cream/55">
                          {row.description}
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {event.hospitalityInfo ? (
              <div className="mt-14">
                <SectionHeader
                  eyebrow="Hospitality"
                  title="Race-day experience."
                />
                <RichText value={event.hospitalityInfo} className="mt-6" />
              </div>
            ) : null}

            {event.stableAccessInfo ? (
              <div className="mt-14">
                <SectionHeader
                  eyebrow="Stable access"
                  title="Behind the scenes."
                />
                <RichText value={event.stableAccessInfo} className="mt-6" />
              </div>
            ) : null}
          </div>

          <aside className="lg:sticky lg:top-28">
            <div className="hs-card-glass p-7">
              <h2 className="hs-kicker hs-eyebrow-gradient">Event details</h2>
              <dl className="mt-6 space-y-5">
                <Meta
                  icon={<CalendarIcon className="size-4" />}
                  label="Date"
                  value={dateRange}
                />
                <Meta
                  icon={<PinIcon className="size-4" />}
                  label="Venue"
                  value={event.venue}
                />
                <Meta
                  icon={<PinIcon className="size-4" />}
                  label="Address"
                  value={event.venueAddress}
                />
                <Meta
                  icon={<TrackIcon className="size-4" />}
                  label="Track"
                  value={event.trackType}
                />
                <Meta
                  icon={<TrackIcon className="size-4" />}
                  label="Class"
                  value={event.raceClass}
                />
                <Meta
                  icon={<TrackIcon className="size-4" />}
                  label="Status"
                  value={event.status}
                />
              </dl>
            </div>
          </aside>
        </div>

        {event.ticket ? (
          <div className="mt-14">
            <TicketCtaPanel
              label={event.ticket.label}
              href={event.ticket.href}
              external={event.ticket.external}
              provider={event.ticket.provider}
              eventName={event.title}
              eventDate={dateRange}
              embedHref={event.ticket.embedHref}
            />
          </div>
        ) : null}
      </section>
    </>
  );
}
