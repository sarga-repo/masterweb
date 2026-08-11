import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo/metadata";
import { LocaleLink as Link } from "@/components/i18n/locale-link";

import { PageHero, RaceEventCard, ScrollReveal } from "@/components";
import { fetchEventsPage } from "@/lib/cms-content";
import { getRequestLocale } from "@/lib/i18n/request";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return createMetadata({
    title: "Events",
    description:
      "Upcoming Sarga Horse Sport derbies, turf classics, exhibitions, and hospitality race days.",
    path: "/events",
    locale,
  });
}

type Params = { searchParams: Promise<{ discipline?: string }> };

export default async function EventsPage({ searchParams }: Params) {
  const { discipline } = await searchParams;
  const events = await fetchEventsPage();

  const disciplines = Array.from(
    new Set(events.map((e) => e.discipline).filter(Boolean) as string[]),
  ).sort();

  const active = discipline?.toLowerCase();
  const filtered = active
    ? events.filter((e) => e.discipline?.toLowerCase() === active)
    : events;

  const chip = (label: string, value?: string) => {
    const isActive = value ? active === value.toLowerCase() : !active;
    return (
      <Link
        key={label}
        href={value ? `/events?discipline=${value.toLowerCase()}` : "/events"}
        className={`hs-pill border px-5 py-2.5 text-[0.66rem] font-extrabold uppercase tracking-[0.12em] transition-colors ${
          isActive
            ? "border-hs-orange bg-hs-orange/15 text-hs-orange"
            : "border-hs-cream/20 text-hs-cream/60 hover:border-hs-cream/40 hover:text-hs-cream"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <>
      <PageHero
        eyebrow="Events"
        title="The season on the turf."
        description="National derbies, turf classics, and exhibition meetings across Indonesia's premier equestrian venues."
        backgroundImage="/media/sarga-horse-race-event.png"
        backgroundAlt="Thoroughbreds and jockeys bursting from the starting gate on race day"
        accent="red"
      />

      <section className="hs-section hs-shell">
        <div className="flex flex-wrap gap-3">
          {chip("All")}
          {disciplines.map((d) => chip(d, d))}
        </div>

        {filtered.length > 0 ? (
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((event, i) => (
              <ScrollReveal
                key={event.href}
                delay={(i % 3) * 90}
                className="flex"
              >
                <RaceEventCard event={event} priority={i < 3} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="hs-card-glass mt-12 p-12 text-center">
            <p className="hs-display text-2xl text-hs-cream">
              No events in this category yet.
            </p>
            <p className="mt-3 text-sm text-hs-cream/55">
              Check back soon or view the full calendar.
            </p>
            <Link
              href="/events"
              className="hs-pill mt-6 inline-flex bg-hs-red px-6 py-3 text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-hs-white hover:bg-hs-orange"
            >
              View all events
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
