import type { Metadata } from "next";

import {
  EventListCard,
  InformationBand,
  PageHero,
  PageShell,
  ProgramCard,
  SectionHeader,
  StatusChip,
} from "@/components";
import { fetchEvents, fetchPrograms, fetchSitePage } from "@/lib/cms-data";
import type { MotorsportEvent, MotorsportProgram } from "@/types/design-system";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Enter Sarga Motorsport programmes, international campaigns, and upcoming race weekends across Indonesia.",
};

const FALLBACK_PROGRAMS: MotorsportProgram[] = [
  {
    title: "FIA Rallycross World Cup Indonesia 2026",
    slug: "fia-rallycross-world-cup-indonesia-2026",
    href: "/campaign/fia-rallycross-world-cup-indonesia-2026",
    programType: "rallycross",
    status: "ticketsOpen",
    seasonLabel: "2026",
    summary:
      "FIA Rallycross arrives in Indonesia for a high-intensity two-day race and fan experience at Jakarta International E-Prix Circuit.",
    headline: "First Time, Wild Action, Closer Than Ever",
    dateLabel: "05–06 Dec 2026",
    venue: "Jakarta International E-Prix Circuit",
    image: "/media/sarga-motorsport-bike-and-rally.png",
    imageAlt: "Rallycross car and motorcycle race action",
    ctaLabel: "Explore campaign",
  },
  {
    title: "Indonesia Junior Talent Cup",
    slug: "indonesia-junior-talent-cup",
    href: "/events/indonesia-junior-talent-cup",
    programType: "juniorTalentCup",
    status: "registrationOpen",
    seasonLabel: "2026 Season",
    summary:
      "A structured development programme for Indonesia's next generation of motorcycle racing talent.",
    headline: "The next generation starts here.",
    image: "/media/sarga-motorsport-motorbike-race.png",
    imageAlt: "Young motorcycle racers competing on circuit",
    ctaLabel: "Explore IJTC",
  },
];

const FALLBACK_EVENTS: MotorsportEvent[] = [
  {
    title: "Race Weekend Indonesia",
    href: "/events/race-weekend-indonesia",
    dateLabel: "18–20 Sep 2026",
    venue: "Sentul International Circuit, Jakarta",
    image: "/media/motorsport-design-hero.png",
    imageAlt: "Touring race car throwing sparks on a dusk circuit",
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
    imageAlt: "Superbike riders cornering under circuit lights",
    status: "announced",
    category: "Superbike",
  },
  {
    title: "GT Endurance Challenge",
    href: "/events/gt-endurance-challenge",
    dateLabel: "22 Nov 2026",
    venue: "Sentul International Circuit",
    image: "/media/motorsport-design-card.png",
    imageAlt: "GT race car under night circuit lights",
    status: "announced",
    category: "GT",
  },
];

export default async function EventsPage() {
  const [page, cmsPrograms, cmsEvents] = await Promise.all([
    fetchSitePage("eventHub"),
    fetchPrograms(),
    fetchEvents(),
  ]);
  const programs = cmsPrograms.length > 0 ? cmsPrograms : FALLBACK_PROGRAMS;
  const events = cmsEvents.length > 0 ? cmsEvents : FALLBACK_EVENTS;
  const programRank = (program: MotorsportProgram) =>
    program.programType === "rallycross"
      ? 0
      : program.programType === "juniorTalentCup"
        ? 1
        : 2;
  const orderedPrograms = [...programs].sort(
    (a, b) => programRank(a) - programRank(b),
  );
  const upcoming = events.filter(
    (event) => !["completed", "cancelled"].includes(event.status),
  );
  const ticketedCount = upcoming.filter((event) => event.ticketHref).length;
  const section = (key: string) =>
    page?.sections.find((item) => item.sectionKey === key);
  const eventControl = section("event-control");
  const programmes = section("programmes");
  const calendar = section("calendar");

  return (
    <PageShell spectrumSeparators>
      <PageHero
        kicker="Programmes / Season 2026"
        kickerColor="orange"
        title={page?.heroTitle || "Events"}
        description={
          page?.heroDescription ||
          "Enter FIA Rallycross, follow the Indonesia Junior Talent Cup, and find the next race weekend."
        }
        backgroundImage={page?.heroImage}
        backgroundAlt={page?.heroImageAlt}
        accent="crimson"
        accentPosition="top-right"
        speedLines
        grain
        surface="heat"
      />

      <InformationBand
        eyebrow={eventControl?.eyebrow ?? "Event control / Live index"}
        title={eventControl?.title ?? "Programmes with a pulse."}
        description={
          eventControl?.body ??
          "International campaigns, development pathways, and race weekends-each with clear status and approved ticket routing."
        }
        items={[
          {
            label: "Programmes",
            value: String(orderedPrograms.length).padStart(2, "0"),
          },
          {
            label: "Upcoming",
            value: String(upcoming.length).padStart(2, "0"),
          },
          {
            label: "Tickets open",
            value: String(ticketedCount).padStart(2, "0"),
          },
        ]}
      />

      <section className="ms-events-programmes-surface ms-reflected-light-surface ms-section">
        <div className="ms-shell">
          <SectionHeader
            index="PROGRAMMES"
            eyebrow={programmes?.eyebrow ?? "Featured pathways"}
            title={programmes?.title ?? "Choose your entry point."}
            description={
              programmes?.body ??
              "A world-stage campaign and a national talent-development programme lead the Motorsport calendar."
            }
          />
          <div className="mt-14 space-y-6">
            {orderedPrograms.map((program, index) => (
              <ProgramCard
                key={program.slug}
                program={program}
                feature={index === 0}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="ms-events-calendar-surface ms-reflected-light-surface ms-section">
        <div className="ms-shell">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeader
              index="CALENDAR"
              eyebrow={calendar?.eyebrow ?? "Upcoming events"}
              title={calendar?.title ?? "The next grid."}
              description={
                calendar?.body ??
                "Current Motorsport-scoped events, ordered by the live CMS calendar."
              }
            />
            <div className="flex flex-wrap gap-3 pb-1">
              <StatusChip status="announced" />
              <StatusChip status="tickets-open" />
              <StatusChip status="live" />
            </div>
          </div>
          <div className="mt-14 border-b border-ms-warm-white/15">
            {upcoming.length > 0 ? (
              upcoming.map((event, index) => (
                <EventListCard
                  key={event.href}
                  event={event}
                  index={String(index + 1).padStart(2, "0")}
                />
              ))
            ) : (
              <p className="border-t border-ms-warm-white/12 py-10 text-ms-warm-white/50">
                No upcoming events are published yet.
              </p>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
