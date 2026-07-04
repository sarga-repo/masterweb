import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { GradientRule, PageShell, SectionHeader } from "@/components";
import { ArrowRightIcon, ArrowUpRightIcon } from "@/components/ui/icons";
import { fetchEvents } from "@/lib/cms-data";
import { siteConfig } from "@/lib/site-config";

/* -------------------------------------------------------------------------- */
/*  CMS campaign type (future-proofed — campaigns will be a Strapi collection) */
/* -------------------------------------------------------------------------- */

type CampaignSection = {
  type: "hero" | "body" | "cta" | "gallery";
  headline?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
  image?: string;
  imageAlt?: string;
};

type Campaign = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  heroImage: string;
  heroImageAlt: string;
  accentColor: string;
  sections: CampaignSection[];
  relatedEventSlug?: string;
};

/* -------------------------------------------------------------------------- */
/*  Fetcher — attempts CMS first, falls back to placeholder campaigns          */
/* -------------------------------------------------------------------------- */

async function fetchCampaignBySlug(slug: string): Promise<Campaign | null> {
  // TODO: Replace with real Strapi "campaigns" collection fetch once model exists.
  // For now, return a placeholder campaign keyed by slug so the route is live.
  const placeholders: Record<string, Campaign> = {
    "season-opener-2026": {
      slug: "season-opener-2026",
      title: "Season Opener 2026",
      tagline: "The grid awakens.",
      description:
        "The 2026 Sarga Motorsport season kicks off with a double-header weekend of touring car and superbike action. Two disciplines. One circuit. Zero compromise.",
      heroImage: "/media/motorsport-design-hero.png",
      heroImageAlt:
        "Touring race car throwing sparks on a dusk circuit — Season Opener 2026",
      accentColor: "#E8192C",
      sections: [
        {
          type: "body",
          headline: "Two disciplines. One stage.",
          body: "The Season Opener brings together the best of four-wheel and two-wheel racing in a single, electrifying weekend. Touring cars push the limits on Saturday; superbikes take over on Sunday. Every session is a statement.",
        },
        {
          type: "cta",
          headline: "Secure your grid pass.",
          ctaLabel: "Get tickets",
          ctaHref: "/tickets",
        },
        {
          type: "body",
          headline: "Beyond the track.",
          body: "The Season Opener is more than just racing. Fan zones, pit walks, live music, and food villages turn the circuit into a full motorsport festival. Arrive early, stay late — this is where the season begins.",
        },
      ],
    },
  };

  return placeholders[slug] ?? null;
}

/* -------------------------------------------------------------------------- */
/*  Metadata                                                                   */
/* -------------------------------------------------------------------------- */

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const campaign = await fetchCampaignBySlug(slug);
  if (!campaign) return { title: "Campaign not found" };
  return {
    title: `${campaign.title} — ${siteConfig.name}`,
    description: campaign.description,
    openGraph: {
      title: campaign.title,
      description: campaign.tagline,
      images: [{ url: campaign.heroImage }],
    },
  };
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default async function CampaignPage(props: Props) {
  const { slug } = await props.params;
  const campaign = await fetchCampaignBySlug(slug);
  if (!campaign) notFound();

  // Fetch related events for the "Up next" section
  const allEvents = await fetchEvents(6);
  const upcomingEvents = allEvents.slice(0, 3);

  return (
    <PageShell>
      {/* Hero */}
      <section className="ms-grain relative isolate flex min-h-[85vh] items-end overflow-hidden">
        <Image
          src={campaign.heroImage}
          alt={campaign.heroImageAlt}
          fill
          sizes="100vw"
          priority
          className="absolute inset-0 object-cover object-center ms-animate-zoom"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-ms-black via-ms-black/60 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-ms-black/80 via-transparent to-transparent"
        />
        {/* Dot pattern (track grid) */}
        <div aria-hidden="true" className="ms-track-grid absolute inset-0 opacity-25" />
        {/* Speed lines */}
        <div
          aria-hidden="true"
          className="absolute inset-0 overflow-hidden pointer-events-none"
        >
          <div className="ms-speed-line absolute top-[20%] left-0 h-px w-[40%] bg-gradient-to-r from-transparent via-ms-apex-crimson/30 to-transparent" />
          <div className="ms-speed-line-delay-1 absolute top-[45%] left-0 h-px w-[55%] bg-gradient-to-r from-transparent via-ms-ignition-orange/20 to-transparent" />
          <div className="ms-speed-line-delay-2 absolute top-[70%] left-0 h-px w-[35%] bg-gradient-to-r from-transparent via-ms-slipstream-teal/25 to-transparent" />
        </div>
        {/* Shimmer accent */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px ms-shimmer"
        />
        <div className="ms-shell relative z-10 pb-16 pt-40 sm:pb-24">
          <span
            className="ms-kicker ms-animate-stagger-1"
            style={{ color: campaign.accentColor }}
          >
            {campaign.tagline}
          </span>
          <h1 className="ms-display ms-animate-stagger-2 mt-6 text-[clamp(4rem,12vw,11rem)] leading-[0.88]">
            {campaign.title}
          </h1>
          <p className="ms-animate-stagger-3 mt-6 max-w-2xl text-lg leading-8 text-ms-warm-white/70">
            {campaign.description}
          </p>
          <Link
            href={
              campaign.sections.find((s) => s.type === "cta")?.ctaHref ??
              "/tickets"
            }
            className="ms-animate-stagger-4 group mt-10 inline-flex h-(--ms-control-height) items-center gap-4 bg-ms-apex-crimson px-8 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-warm-white transition-colors hover:bg-ms-ignition-orange"
          >
            {campaign.sections.find((s) => s.type === "cta")?.ctaLabel ??
              "Get tickets"}
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <GradientRule />

      {/* Dynamic sections */}
      {campaign.sections
        .filter((s) => s.type === "body")
        .map((section, idx) => (
          <section
            key={idx}
            className={`ms-section ms-shell ${idx % 2 !== 0 ? "ms-heat-field" : ""}`}
          >
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className={idx % 2 !== 0 ? "lg:order-2" : ""}>
                <SectionHeader
                  index={`SECTION ${String(idx + 1).padStart(2, "0")}`}
                  eyebrow="Campaign"
                  title={section.headline ?? ""}
                  align="left"
                />
                {section.body ? (
                  <p className="mt-6 max-w-xl text-base leading-8 text-ms-warm-white/60">
                    {section.body}
                  </p>
                ) : null}
              </div>
              <div
                className={`ms-slant relative aspect-[4/3] overflow-hidden ${idx % 2 !== 0 ? "lg:order-1" : ""}`}
              >
                <Image
                  src={campaign.heroImage}
                  alt={section.headline ?? campaign.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-ms-black/40 to-transparent"
                />
              </div>
            </div>
          </section>
        ))}

      {/* CTA band */}
      {campaign.sections.filter((s) => s.type === "cta").length > 0 && (
        <section className="ms-shell border-t border-ms-warm-white/12 py-16">
          <div className="ms-panel bg-ms-black p-10 sm:p-14">
            <span className="ms-data-label text-ms-slipstream-teal">
              Don&apos;t miss it
            </span>
            <h2 className="ms-display mt-6 max-w-[12ch] text-[clamp(2.5rem,5vw,5rem)]">
              {campaign.sections.find((s) => s.type === "cta")?.headline ??
                "Be there."}
            </h2>
            <Link
              href={
                campaign.sections.find((s) => s.type === "cta")?.ctaHref ??
                "/tickets"
              }
              className="group mt-8 inline-flex items-center gap-3 border-b border-ms-apex-crimson pb-2 text-[0.66rem] font-black uppercase tracking-[0.16em] transition-colors hover:text-ms-ignition-orange"
            >
              {campaign.sections.find((s) => s.type === "cta")?.ctaLabel ??
                "Get tickets"}
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      )}

      {/* Upcoming events teaser */}
      {upcomingEvents.length > 0 && (
        <>
          <GradientRule />
          <section className="ms-section ms-shell">
            <SectionHeader
              eyebrow="On the calendar"
              title="Up next."
              description="More racing. More energy. See what's coming up on the Sarga Motorsport calendar."
            />
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event) => (
                <Link
                  key={event.slug}
                  href={event.href}
                  className="group ms-panel relative flex flex-col overflow-hidden bg-ms-black transition-colors hover:bg-ms-graphite"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={event.image}
                      alt={event.imageAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-ms-black/60 to-transparent"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-6">
                    <span className="ms-data-label text-ms-warm-white/38">
                      {event.dateLabel}
                    </span>
                    <h3 className="ms-display text-lg leading-tight">
                      {event.title}
                    </h3>
                    <p className="text-xs text-ms-warm-white/50">
                      {event.venue}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-3 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-ms-slipstream-teal transition-colors group-hover:text-ms-warm-white">
                      View event
                      <ArrowUpRightIcon className="size-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Back link */}
      <div className="ms-shell border-t border-ms-warm-white/12 py-10">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-ms-warm-white/50 transition-colors hover:text-ms-warm-white"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="size-4"
          >
            <path
              d="M20 12H5M11 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="1.8"
            />
          </svg>
          All events
        </Link>
      </div>
    </PageShell>
  );
}
