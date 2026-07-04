import Link from "next/link";

import {
  BrandStorySection,
  CountdownBadge,
  EventFeatureCard,
  EventListCard,
  ExperiencePillarCard,
  GalleryRail,
  GradientRule,
  MotorsportFooter,
  MotorsportHeader,
  MotorsportHero,
  NewsletterCtaSection,
  NewsCard,
  PartnerLogoStrip,
  SectionHeader,
  TicketCtaPanel,
} from "@/components";
import { fetchHomepageData } from "@/lib/homepage-data";
import { siteConfig } from "@/lib/site-config";

/* -------------------------------------------------------------------------- */
/*  Navigation                                                                */
/* -------------------------------------------------------------------------- */

const NAVIGATION = [
  { label: "Events", href: "/events" },
  { label: "Experience", href: "/experience" },
  { label: "News", href: "/news" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
];

/* -------------------------------------------------------------------------- */
/*  Brand story / ecosystem pillars                                           */
/* -------------------------------------------------------------------------- */

const ECOSYSTEM_PILLARS = [
  {
    index: "01",
    title: "Professional car racing",
    description:
      "Touring, GT, and formula disciplines — elite drivers, world-class machinery, and international competition standards.",
    accent: "crimson" as const,
  },
  {
    index: "02",
    title: "Professional motorcycle racing",
    description:
      "Superbike, Moto2, and grassroots two-wheel programs — precision, bravery, and the purest form of racing.",
    accent: "orange" as const,
  },
  {
    index: "03",
    title: "Lifestyle festival",
    description:
      "Music, culture, food, and community — the race weekend extends far beyond the pit wall into a full sensory event.",
    accent: "yellow" as const,
  },
  {
    index: "04",
    title: "Fan & community experience",
    description:
      "Pit walks, meet-and-greets, simulators, and fan zones — every supporter gets closer to the action.",
    accent: "teal" as const,
  },
  {
    index: "05",
    title: "Media & broadcast",
    description:
      "Livestream, editorial storytelling, galleries, and behind-the-scenes access that keeps the energy alive 365 days a year.",
    accent: "blue" as const,
  },
  {
    index: "06",
    title: "Venue & circuit experience",
    description:
      "Track days, corporate events, and driving experiences — the circuit as a premium destination beyond race weekends.",
    accent: "crimson" as const,
  },
];

/* -------------------------------------------------------------------------- */
/*  Experience pillars (homepage section — shorter cards)                     */
/* -------------------------------------------------------------------------- */

const EXPERIENCE_CARDS = [
  {
    index: "01",
    title: "Race day energy",
    description:
      "The roar of engines, the smell of rubber, and the tension before lights-out. Nothing replaces being there.",
    href: "/experience",
    accent: "crimson" as const,
  },
  {
    index: "02",
    title: "Beyond the grid",
    description:
      "Festival stages, street food, fan zones, and community — the weekend is bigger than any single race.",
    href: "/experience",
    accent: "orange" as const,
  },
  {
    index: "03",
    title: "Always-on coverage",
    description:
      "Livestream, race reports, photography, and paddock stories — the feed never stops.",
    href: "/experience",
    accent: "teal" as const,
  },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default async function HomePage() {
  const data = await fetchHomepageData();

  return (
    <>
      {/* 1. Header / navigation */}
      <MotorsportHeader
        navigation={NAVIGATION}
        ticketLink={{ label: "Tickets", href: "/tickets" }}
        gatewayLink={{
          label: "Sarga.co",
          href: siteConfig.gatewayUrl,
          external: true,
        }}
      />

      <main>
        {/* 2. Cinematic hero */}
        <MotorsportHero
          eyebrow="Sarga Motorsport / Season 2026"
          title="Feel the friction."
          description="Indonesia's premier motorsport ecosystem. Elite racing, unfiltered energy, and a 360° experience built for those who live for the apex."
          image="/media/sarga-motorsport-hero-poster.jpg"
          imageAlt="Formula car powering away from behind on a floodlit night circuit, throwing sparks"
          video={{
            webm: "/media/sarga-motorsport-hero.webm",
            mp4: "/media/sarga-motorsport-hero.mp4",
            poster: "/media/sarga-motorsport-hero-poster.jpg",
            objectClassName: "object-cover object-[64%_center]",
          }}
          endorsement={{
            src: "/brand/logo-part-of-sarga-endorsement-white.png",
            alt: "Sarga Motorsport — part of Sarga.co",
          }}
          primaryCta={{ label: "View events", href: "/events" }}
          secondaryCta={{ label: "Get tickets", href: "/tickets" }}
          meta={[
            {
              label: "Next race",
              value: data.featuredEvent?.dateLabel ?? "TBA",
            },
            { label: "Circuit", value: data.featuredEvent?.venue ?? "TBA" },
            { label: "Status", value: data.featuredEvent?.status ?? "TBA" },
            { label: "Discipline", value: "Car + Motorcycle" },
          ]}
          priority
        />

        <GradientRule />

        {/* 3. Featured event / ticket CTA */}
        <section className="ms-section ms-shell">
          <SectionHeader
            index="EVENT"
            eyebrow="Featured race weekend"
            title="Next on the grid."
            description="The upcoming headline event in the Sarga Motorsport calendar. Secure your seat before the grid fills up."
          />
          <div className="mt-14">
            {data.featuredEvent ? (
              <EventFeatureCard event={data.featuredEvent} priority />
            ) : null}
          </div>
          {data.ticketCta ? (
            <div className="mt-12">
              <TicketCtaPanel
                eyebrow="Official ticketing"
                title="Witness it live."
                description="Tickets redirect to our approved partner platform. Secure checkout, guaranteed entry, zero markup."
                eventMeta={
                  data.ticketCta.eventName ?? data.featuredEvent?.title
                }
                provider={data.ticketCta.provider}
                cta={{
                  label: data.ticketCta.label,
                  href: data.ticketCta.href,
                  external: data.ticketCta.href.startsWith("http"),
                }}
              />
            </div>
          ) : null}
        </section>

        {/* 4. Brand story / 360° racing ecosystem */}
        <BrandStorySection
          eyebrow="The 360° racing ecosystem"
          title="More than a race."
          body="Sarga Motorsport is Indonesia's most ambitious motorsport platform — a convergence of professional racing, lifestyle culture, broadcast media, and community experience. From four-wheel touring and GT to two-wheel superbike and Moto2, every discipline gets the stage it deserves."
          image="/media/motorcycle-racing-dusk.png"
          imageAlt="Superbike riders leaning through a sweeping corner under dusk circuit lights"
          cta={{ label: "Explore the ecosystem", href: "/about" }}
          pillars={ECOSYSTEM_PILLARS}
        />

        <GradientRule />

        {/* 5. Upcoming events */}
        <section className="ms-section ms-shell">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              index="CALENDAR"
              eyebrow="Upcoming race weekends"
              title="The season ahead."
              description="Car and motorcycle racing across Indonesia's premier circuits. Filter by discipline, category, or ticket availability."
            />
            <CountdownBadge
              targetDate="2026-09-18T09:00:00+07:00"
              className="shrink-0"
            />
          </div>
          <div className="mt-14">
            {data.upcomingEvents.map((event, i) => (
              <EventListCard
                key={event.href}
                event={event}
                index={String(i + 1).padStart(2, "0")}
              />
            ))}
          </div>
          <div className="mt-10 border-t border-ms-warm-white/12 pt-6">
            <Link
              href="/events"
              className="group inline-flex items-center gap-3 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-warm-white/58 transition-colors hover:text-ms-warm-white"
            >
              View full calendar
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </section>

        {/* 6. Experience pillars */}
        <section className="ms-heat-field ms-section">
          <div className="ms-shell">
            <SectionHeader
              index="EXPERIENCE"
              eyebrow="Beyond the finish line"
              title="Racing is the core. The rest is the culture."
              description="Sarga Motorsport is more than what happens on track. It's a festival, a broadcast, a fan community, and a premium venue experience."
            />
            <div className="mt-16 grid gap-4 md:grid-cols-3">
              {EXPERIENCE_CARDS.map((card) => (
                <ExperiencePillarCard
                  key={card.index}
                  index={card.index}
                  title={card.title}
                  description={card.description}
                  href={card.href}
                  accent={card.accent}
                />
              ))}
            </div>
          </div>
        </section>

        <GradientRule />

        {/* 7. News / media highlights */}
        <section className="ms-section ms-shell">
          <SectionHeader
            index="MEDIA"
            eyebrow="Latest from the paddock"
            title="Every frame carries velocity."
            description="Race reports, rider profiles, technical deep-dives, and lifestyle features — curated by the Sarga Motorsport editorial team."
          />
          <div className="mt-14 grid gap-10 lg:grid-cols-[1.6fr_0.8fr]">
            {data.featuredArticle ? (
              <NewsCard article={data.featuredArticle} feature />
            ) : null}
            <div className="flex flex-col gap-10">
              {data.articles.slice(0, 2).map((article) => (
                <NewsCard key={article.href} article={article} />
              ))}
            </div>
          </div>
          <div className="mt-10 border-t border-ms-warm-white/12 pt-6">
            <Link
              href="/news"
              className="group inline-flex items-center gap-3 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-warm-white/58 transition-colors hover:text-ms-warm-white"
            >
              All news & stories
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </section>

        {/* 8. Gallery strip */}
        <section className="pb-(--ms-section-space)">
          <div className="ms-shell mb-12">
            <SectionHeader
              eyebrow="Trackside capture feed"
              title="Motion, recorded."
              align="left"
            />
          </div>
          <GalleryRail items={data.gallery} />
          <div className="ms-shell mt-8">
            <Link
              href="/gallery"
              className="group inline-flex items-center gap-3 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-warm-white/58 transition-colors hover:text-ms-warm-white"
            >
              Full gallery
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </section>

        {/* 9. Partner / sponsor strip */}
        <PartnerLogoStrip
          label="Official partners & sponsors"
          partners={data.partners}
        />

        {/* 10. Newsletter / contact CTA */}
        <NewsletterCtaSection
          eyebrow="Stay in the race"
          title="Never miss lights-out."
          description="Get race weekend alerts, ticket drops, and exclusive paddock stories delivered to your inbox. No spam — just velocity."
          actionLabel="Subscribe to updates"
          cta={{ label: "contact us directly", href: "/contact" }}
        />
      </main>

      {/* 11. Footer */}
      <MotorsportFooter
        columns={[
          {
            title: "Race",
            links: [
              { label: "Events", href: "/events" },
              { label: "Tickets", href: "/tickets" },
              { label: "Experience", href: "/experience" },
            ],
          },
          {
            title: "Stories",
            links: [
              { label: "News", href: "/news" },
              { label: "Gallery", href: "/gallery" },
              { label: "Partners", href: "/partners" },
            ],
          },
          {
            title: "Sarga",
            links: [
              { label: "About", href: "/about" },
              { label: "Contact", href: "/contact" },
            ],
          },
        ]}
        gatewayLink={{
          label: "Visit Sarga.co",
          href: siteConfig.gatewayUrl,
          external: true,
        }}
        legalLinks={[
          { label: "Privacy", href: "/privacy" },
          { label: "Terms", href: "/terms" },
        ]}
        copyright="© 2026 Sarga Motorsport"
      />
    </>
  );
}
