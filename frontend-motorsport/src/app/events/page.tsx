import type { Metadata } from "next";

import {
  EventListCard,
  PageHero,
  PageShell,
  SectionHeader,
  StatusChip,
} from "@/components";
import { fetchEvents } from "@/lib/cms-data";
import type { MotorsportEvent } from "@/types/design-system";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Upcoming and past motorsport events — car racing, motorcycle racing, and festival weekends across Indonesia.",
};

/* Placeholder events shown when CMS is unreachable. */
const PLACEHOLDER: MotorsportEvent[] = [
  {
    title: "Race Weekend Indonesia",
    href: "/events/race-weekend-indonesia",
    dateLabel: "18–20 Sep 2026",
    venue: "Sentul International Circuit, Jakarta",
    image: "/media/motorsport-design-hero.png",
    imageAlt: "Touring race car throwing sparks on a circuit at dusk",
    status: "tickets-open",
    category: "Touring Car",
    seriesName: "Sarga Motorsport Series",
    ticketHref: "/tickets",
  },
  {
    title: "Superbike Night Sessions",
    href: "/events/superbike-night-sessions",
    dateLabel: "04 Oct 2026",
    venue: "Mandalika International Street Circuit",
    image: "/media/motorcycle-racing-dusk.png",
    imageAlt: "Superbike riders leaning through a circuit corner at dusk",
    status: "announced",
    category: "Superbike",
    seriesName: "Sarga Motorcycle Series",
  },
  {
    title: "GT Endurance Challenge",
    href: "/events/gt-endurance-challenge",
    dateLabel: "22 Nov 2026",
    venue: "Sentul International Circuit",
    image: "/media/motorsport-design-card.png",
    imageAlt: "GT race car under floodlights on a night circuit",
    status: "announced",
    category: "GT",
    seriesName: "Sarga Motorsport Series",
  },
  {
    title: "Moto Festival Weekend",
    href: "/events/moto-festival-weekend",
    dateLabel: "13 Dec 2026",
    venue: "Mandalika International Street Circuit",
    image: "/media/motorcycle-racing-dusk.png",
    imageAlt: "Motorcycle racers in a pack under sunny skies",
    status: "tickets-open",
    category: "Moto2",
    seriesName: "Sarga Motorcycle Series",
    ticketHref: "/tickets",
  },
];

export default async function EventsPage() {
  const cmsEvents = await fetchEvents();
  const events = cmsEvents.length > 0 ? cmsEvents : PLACEHOLDER;

  /* Group: upcoming (tickets-open / announced / live) vs past (completed / cancelled) */
  const upcoming = events.filter(
    (e) => !["completed", "cancelled"].includes(e.status),
  );
  const past = events.filter((e) =>
    ["completed", "cancelled"].includes(e.status),
  );

  return (
    <PageShell>
      {/* Page hero */}
      <PageHero
        kicker="Season 2026"
        kickerColor="orange"
        title="Events"
        accent="crimson"
        accentPosition="top-right"
        speedLines
        grain
        description="Car racing, motorcycle racing, and festival weekends across Indonesia's premier circuits. Filter by discipline, category, or ticket availability."
      />

      {/* Filters legend */}
      <section className="ms-shell border-b border-ms-warm-white/12 py-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="ms-data-label text-ms-warm-white/42">Status</span>
          <StatusChip status="announced" />
          <StatusChip status="tickets-open" />
          <StatusChip status="live" />
          <StatusChip status="sold-out" />
          <StatusChip status="completed" />
        </div>
      </section>

      {/* Upcoming events */}
      <section className="ms-section ms-shell">
        <SectionHeader
          index="UPCOMING"
          eyebrow="Race calendar"
          title="The grid."
          align="left"
        />
        <div className="mt-12">
          {upcoming.length > 0 ? (
            upcoming.map((event, i) => (
              <EventListCard
                key={event.href}
                event={event}
                index={String(i + 1).padStart(2, "0")}
              />
            ))
          ) : (
            <p className="border-t border-ms-warm-white/12 py-10 text-ms-warm-white/50">
              No upcoming events at this time. Check back soon.
            </p>
          )}
        </div>
      </section>

      {/* Past events */}
      {past.length > 0 ? (
        <section className="ms-section ms-shell border-t border-ms-warm-white/12">
          <SectionHeader
            index="ARCHIVE"
            eyebrow="Past race weekends"
            title="Results."
            align="left"
          />
          <div className="mt-12">
            {past.map((event, i) => (
              <EventListCard
                key={event.href}
                event={event}
                index={String(i + 1).padStart(2, "0")}
              />
            ))}
          </div>
        </section>
      ) : null}
    </PageShell>
  );
}
