import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  GradientRule,
  PageShell,
  PartnerLogoStrip,
  SectionHeader,
  StatusChip,
  TicketCtaPanel,
} from "@/components";
import { ArrowRightIcon } from "@/components/ui/icons";
import { fetchEventBySlug, fetchPartners } from "@/lib/cms-data";
import { resolveSiteUrl, resolveSocialImageUrl, siteConfig } from "@/lib/site-config";
import type { MotorsportEvent } from "@/types/design-system";

type Props = { params: Promise<{ slug: string }> };

/* Placeholder events shown when CMS is unreachable. */
const PLACEHOLDER_MAP: Record<string, MotorsportEvent & { description?: string }> = {
  "race-weekend-indonesia": {
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
    description:
      "The flagship Sarga Motorsport weekend - touring cars, GT machinery, and a full festival programme across three days at Sentul International Circuit. Expect world-class racing, immersive fan zones, and the debut of Sarga’s signature race-weekend experience.",
  },
  "superbike-night-sessions": {
    title: "Superbike Night Sessions",
    href: "/events/superbike-night-sessions",
    dateLabel: "04 Oct 2026",
    venue: "Mandalika International Street Circuit",
    image: "/media/motorcycle-racing-dusk.png",
    imageAlt: "Superbike riders leaning through a circuit corner at dusk",
    status: "announced",
    category: "Superbike",
    seriesName: "Sarga Motorcycle Series",
    description:
      "Under the floodlights at Mandalika, Indonesia’s fastest superbike riders push machinery to the limit. A one-day, high-intensity programme of qualifying, sprint, and feature races - all under the night sky.",
  },
  "gt-endurance-challenge": {
    title: "GT Endurance Challenge",
    href: "/events/gt-endurance-challenge",
    dateLabel: "22 Nov 2026",
    venue: "Sentul International Circuit",
    image: "/media/motorsport-design-card.png",
    imageAlt: "GT race car under floodlights on a night circuit",
    status: "announced",
    category: "GT",
    seriesName: "Sarga Motorsport Series",
    description:
      "A gruelling endurance format that tests driver stamina, team strategy, and engineering excellence. GT-class machines battle through stints, pit stops, and changing track conditions in a showcase of motorsport endurance.",
  },
  "moto-festival-weekend": {
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
    description:
      "The season finale doubles as a full festival weekend - Moto2 racing, live music, food villages, and a celebration of the entire Sarga community. Two-wheeled action meets lifestyle culture at Mandalika.",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await fetchEventBySlug(slug);
  const fallback = PLACEHOLDER_MAP[slug];
  const resolved = event ?? fallback;
  if (!resolved) return { title: "Event not found" };
  const desc = `${resolved.title} - ${resolved.dateLabel} at ${resolved.venue}. Sarga Motorsport event.`;
  const canonical = resolveSiteUrl(`/events/${slug}`);
  const socialImage = resolveSocialImageUrl(resolved.image);
  return {
    title: resolved.title,
    description: desc,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: siteConfig.name,
      title: resolved.title,
      description: desc,
      images: socialImage
        ? [
            {
              url: socialImage,
              alt: resolved.imageAlt,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: resolved.title,
      description: desc,
      images: socialImage ? [socialImage] : undefined,
    },
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const cmsEvent = await fetchEventBySlug(slug);
  const event = cmsEvent ?? PLACEHOLDER_MAP[slug] ?? null;
  if (!event) notFound();

  const partners = await fetchPartners(5);

  return (
    <PageShell>
      {/* Hero */}
      <section className="ms-grain relative isolate overflow-hidden bg-ms-black">
        <Image
          src={event.image}
          alt={event.imageAlt}
          fill
          priority
          className="object-cover object-center ms-animate-zoom"
          sizes="100vw"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(0deg,rgba(5,5,5,.95)_0%,rgba(5,5,5,.5)_40%,rgba(5,5,5,.2)_70%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-ms-black/70 via-transparent to-transparent"
        />
        {/* Dot pattern (track grid) */}
        <div aria-hidden="true" className="ms-track-grid absolute inset-0 opacity-25" />
        {/* Speed lines */}
        <div
          aria-hidden="true"
          className="absolute inset-0 overflow-hidden pointer-events-none"
        >
          <div className="ms-speed-line absolute top-[25%] left-0 h-px w-[40%] bg-gradient-to-r from-transparent via-ms-apex-crimson/25 to-transparent" />
          <div className="ms-speed-line-delay-1 absolute top-[60%] left-0 h-px w-[55%] bg-gradient-to-r from-transparent via-ms-ignition-orange/18 to-transparent" />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px ms-shimmer"
        />
        <div className="ms-shell relative z-10 flex min-h-[65vh] flex-col justify-end py-16 sm:py-24">
          <div className="flex flex-wrap items-center gap-4 ms-animate-stagger-1">
            <StatusChip status={event.status} />
            {event.category ? (
              <span className="ms-kicker text-ms-ignition-orange">
                {event.category}
              </span>
            ) : null}
            {event.seriesName ? (
              <span className="ms-data-label text-ms-slipstream-teal">
                {event.seriesName}
              </span>
            ) : null}
          </div>
          <h1 className="ms-display ms-animate-stagger-2 mt-8 max-w-[14ch] text-[clamp(3rem,7.5vw,6.75rem)]">
            {event.title}
          </h1>
          <div className="ms-animate-stagger-3 mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-ms-warm-white/16 pt-6">
            <div>
              <span className="ms-data-label text-ms-warm-white/38">Date</span>
              <p className="mt-1 text-sm font-bold uppercase tracking-wide">
                {event.dateLabel}
              </p>
            </div>
            <div>
              <span className="ms-data-label text-ms-warm-white/38">
                Circuit
              </span>
              <p className="mt-1 text-sm font-bold uppercase tracking-wide">
                {event.venue}
              </p>
            </div>
          </div>
        </div>
      </section>

      <GradientRule />

      {/* Event body */}
      <section className="ms-section ms-shell">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.6fr)]">
          <div>
            <SectionHeader
              eyebrow="Event overview"
              title="Race briefing."
              align="left"
            />
            <div className="mt-10 max-w-3xl space-y-6 text-base leading-8 text-ms-warm-white/65">
              {event.description ? (
                <p>{event.description}</p>
              ) : (
                <p>
                  Full event details, schedule, and visitor information will be
                  published here once available from the Sarga Motorsport race
                  control team.
                </p>
              )}
            </div>
          </div>
          <aside className="ms-panel bg-ms-black p-6">
            <span className="ms-data-label text-ms-warm-white/42">
              Session data
            </span>
            <dl className="mt-6 space-y-5">
              {[
                ["Series", event.seriesName],
                ["Class", event.category],
                ["Date", event.dateLabel],
                ["Circuit", event.venue],
              ].map(([label, value]) =>
                value ? (
                  <div key={label}>
                    <dt className="ms-data-label text-ms-warm-white/34">
                      {label}
                    </dt>
                    <dd className="mt-1 text-sm font-bold uppercase tracking-wide">
                      {value}
                    </dd>
                  </div>
                ) : null,
              )}
            </dl>
          </aside>
        </div>
      </section>

      {/* Ticket CTA */}
      {event.ticketHref ? (
        <section className="ms-shell pb-(--ms-section-space)">
          <TicketCtaPanel
            eyebrow="Official ticketing"
            title="Secure your seat."
            description="Tickets redirect to our approved partner platform. Secure checkout, guaranteed entry."
            eventMeta={event.title}
            provider="Official partner"
            cta={{
              label: "Get tickets",
              href: event.ticketHref,
              external: event.ticketHref.startsWith("http"),
            }}
          />
        </section>
      ) : null}

      <GradientRule />

      {/* Sponsors */}
      {partners.length > 0 ? (
        <div className="mt-0">
          <PartnerLogoStrip
            label="Event sponsors"
            partners={partners.slice(0, 5)}
          />
        </div>
      ) : null}

      {/* Back link */}
      <section className="ms-shell py-12">
        <Link
          href="/events"
          className="group inline-flex items-center gap-3 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-warm-white/58 transition-colors hover:text-ms-warm-white"
        >
          <ArrowRightIcon className="size-4 rotate-180 transition-transform group-hover:-translate-x-1" />
          All events
        </Link>
      </section>
    </PageShell>
  );
}
