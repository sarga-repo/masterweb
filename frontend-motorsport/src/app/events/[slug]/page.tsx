import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/i18n/locale-link";
import { notFound } from "next/navigation";

import {
  InformationBand,
  MotorsportMetricGroup,
  PageHero,
  PageShell,
  PartnerLogoStrip,
  SectionHeader,
  StatusChip,
  TicketCtaPanel,
} from "@/components";
import { ArrowRightIcon } from "@/components/ui/icons";
import {
  fetchEventBySlug,
  fetchPartners,
  mapCmsSeo,
  type CmsSeo,
} from "@/lib/cms-data";
import type {
  MotorsportInformationBandMetric,
  MotorsportPageHero,
  MotorsportPageInformationBand,
} from "@/lib/motorsport-page-foundation";
import { RallycrossCampaignPage } from "@/app/campaign/[slug]/page";
import {
  FIA_RALLYCROSS_PATH,
  FIA_RALLYCROSS_SLUG,
  getFiaRallycrossCampaign,
} from "@/lib/rallycross-data";
import { createMetadata } from "@/lib/seo/metadata";
import { getRequestLocale } from "@/lib/i18n/request";
import { isStrapiPreviewEnabled } from "@/lib/strapi/client";
import type { MotorsportEvent } from "@/types/design-system";

type Props = { params: Promise<{ slug: string }> };

/* Placeholder events shown when CMS is unreachable. */
const PLACEHOLDER_MAP: Record<
  string,
  MotorsportEvent & { description?: string; seo?: CmsSeo | null }
> = {
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
  const [{ slug }, locale] = await Promise.all([params, getRequestLocale()]);
  if (slug === FIA_RALLYCROSS_SLUG) {
    const campaign = await getFiaRallycrossCampaign(locale);
    if (!campaign) return { title: "Event not found" };
    return createMetadata({
      title: campaign.seo?.title ?? campaign.title,
      description: campaign.seo?.description ?? campaign.summary,
      path: FIA_RALLYCROSS_PATH,
      image: campaign.seo?.image ?? campaign.image,
      locale,
      isFallback: Boolean(campaign.seo?.noIndex),
      seo: {
        metaTitle: campaign.seo?.title,
        metaDescription: campaign.seo?.description,
        ogTitle: campaign.seo?.ogTitle,
        ogDescription: campaign.seo?.ogDescription,
        ogImageUrl:
          typeof campaign.seo?.image === "string"
            ? campaign.seo.image
            : campaign.seo?.image?.src,
        canonicalUrl: campaign.seo?.canonical,
        noIndex: campaign.seo?.noIndex,
      },
    });
  }
  const [event, isPreview] = await Promise.all([
    fetchEventBySlug(slug, locale),
    isStrapiPreviewEnabled(),
  ]);
  const fallback = PLACEHOLDER_MAP[slug];
  const resolved = event ?? (isPreview ? undefined : fallback);
  if (!resolved) return { title: "Event not found" };
  const desc = `${resolved.title} - ${resolved.dateLabel} at ${resolved.venue}. Sarga Motorsport event.`;
  return createMetadata({
    title: resolved.title,
    description: desc,
    path: `/events/${slug}`,
    image: resolved.image,
    seo: mapCmsSeo(resolved.seo),
    locale,
  });
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  if (slug === FIA_RALLYCROSS_SLUG) return <RallycrossCampaignPage />;
  const locale = await getRequestLocale();
  const [cmsEvent, isPreview] = await Promise.all([
    fetchEventBySlug(slug, locale),
    isStrapiPreviewEnabled(),
  ]);
  const event =
    cmsEvent ?? (isPreview ? null : (PLACEHOLDER_MAP[slug] ?? null));
  if (!event) notFound();
  const detailEvent = event as typeof event & {
    presentation?: {
      hero?: MotorsportPageHero | null;
      informationBand?: MotorsportPageInformationBand | null;
    };
  };
  const presentationHero = detailEvent.presentation?.hero;
  const presentationBand = detailEvent.presentation?.informationBand;

  const partners =
    event.sponsors?.length || isPreview
      ? (event.sponsors ?? [])
      : await fetchPartners(5, locale);

  return (
    <PageShell spectrumSeparators>
      {presentationHero?.isActive !== false ? (
        <div data-cms-section-key="hero" data-cms-enabled="true">
          <PageHero
            kicker={
              presentationHero?.eyebrow ||
              `${event.category ?? "Motorsport event"}${event.seriesName ? ` / ${event.seriesName}` : ""}`
            }
            kickerColor="yellow"
            title={presentationHero?.title || event.title}
            description={presentationHero?.description}
            showKicker={presentationHero?.showEyebrow}
            showTitle={presentationHero?.showTitle}
            showDescription={presentationHero?.showDescription}
            showMedia={presentationHero?.showMedia}
            backgroundImage={
              presentationHero?.backgroundMedia?.url || event.image
            }
            backgroundAlt={
              presentationHero?.backgroundMedia?.alt || event.imageAlt
            }
            accent="orange"
            accentPosition="bottom-left"
            surface="heat"
            speedLines
            grain
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <StatusChip status={event.status} />
              {presentationHero?.showMetricGroup !== false ? (
                <MotorsportMetricGroup
                  items={
                    presentationHero?.metrics?.length
                      ? presentationHero.metrics
                      : [
                          { label: "Date", value: event.dateLabel },
                          { label: "Circuit", value: event.venue },
                        ]
                  }
                  columns="two"
                  className="flex-1 sm:max-w-2xl"
                  labelClassName="text-ms-warm-white/48"
                  valueClassName="text-ms-warm-white"
                />
              ) : null}
            </div>
          </PageHero>
        </div>
      ) : null}

      <div data-cms-section-key="event-control" data-cms-enabled="true">
        <InformationBand
          isActive={presentationBand?.isActive !== false}
          showEyebrow={presentationBand?.showEyebrow}
          showTitle={presentationBand?.showTitle}
          showDescription={presentationBand?.showDescription}
          eyebrow={
            presentationBand?.eyebrow || "Event control / Published briefing"
          }
          title={
            presentationBand?.title || "One event. Every essential signal."
          }
          description={
            presentationBand?.description ||
            "The published event file keeps date, venue, sporting class, status, and approved ticket routing in one place."
          }
          showMetricGroup={presentationBand?.showMetricGroup !== false}
          items={
            presentationBand?.showMetricGroup === false
              ? []
              : presentationBand?.metrics?.length
                ? presentationBand.metrics.map(
                    (metric: MotorsportInformationBandMetric) => ({
                      label: metric.label,
                      value: metric.value,
                    }),
                  )
                : [
                    {
                      label: "Status",
                      value: event.status.replaceAll("-", " "),
                    },
                    { label: "Class", value: event.category ?? "Motorsport" },
                    {
                      label: "Tickets",
                      value: event.ticketHref ? "Available" : "Pending",
                    },
                  ]
          }
        />
      </div>

      <section
        data-cms-section-key="event-overview"
        data-cms-enabled="true"
        className="ms-blue-heat-surface ms-section"
      >
        <div className="ms-shell grid gap-14 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,.65fr)] lg:gap-20">
          <article>
            <SectionHeader
              index="BRIEFING"
              eyebrow="Event overview"
              title="Race briefing."
              align="left"
            />
            <div className="mt-10 max-w-3xl space-y-6 text-lg leading-8 text-ms-warm-white/72">
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
          </article>

          <aside className="ms-blue-panel self-start p-7 sm:p-8">
            <span className="ms-data-label text-ms-slipstream-teal">
              Event file
            </span>
            <dl className="mt-7 divide-y divide-ms-warm-white/14 border-y border-ms-warm-white/14">
              {[
                ["Series", event.seriesName],
                ["Class", event.category],
                ["Date", event.dateLabel],
                ["Circuit", event.venue],
              ].map(([label, value]) =>
                value ? (
                  <div key={label} className="py-5">
                    <dt className="ms-data-label text-ms-warm-white/42">
                      {label}
                    </dt>
                    <dd className="mt-2 text-sm font-bold uppercase tracking-wide">
                      {value}
                    </dd>
                  </div>
                ) : null,
              )}
            </dl>
          </aside>
        </div>
      </section>

      {event.ticketHref ? (
        <section
          data-cms-section-key="event-ticket"
          data-cms-enabled="true"
          className="ms-reflected-light-surface ms-section"
        >
          <div className="ms-shell">
            <TicketCtaPanel
              eyebrow={event.ticketCard?.eyebrow ?? "Official ticketing"}
              title={event.ticketCard?.title ?? "Secure your seat."}
              description={
                event.ticketCard?.description ??
                "Tickets redirect to our approved partner platform. Secure checkout, guaranteed entry, and no internal payment processing."
              }
              eventMeta={event.ticketCard?.eventMeta ?? event.title}
              eventMetaLabel={event.ticketCard?.eventMetaLabel}
              provider={event.ticketCard?.provider ?? "Official partner"}
              providerLabel={event.ticketCard?.providerLabel}
              partnerLabel={event.ticketCard?.partnerLabel}
              footerText={event.ticketCard?.footerText}
              image={event.ticketCard?.image as string | undefined}
              mobileImage={event.ticketCard?.mobileImage as string | undefined}
              surface="reflected"
              cta={{
                label: event.ticketLabel ?? "Get tickets",
                href: event.ticketHref,
                external: event.ticketHref.startsWith("http"),
              }}
            />
          </div>
        </section>
      ) : null}

      {partners.length > 0 ? (
        <PartnerLogoStrip
          label="Event sponsors"
          partners={partners.slice(0, 5)}
          className="ms-blue-heat-surface"
        />
      ) : null}

      <section className="ms-blue-heat-surface py-12">
        <div className="ms-shell flex flex-wrap items-center justify-between gap-5">
          <Link
            href="/events"
            className="group inline-flex items-center gap-3 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-warm-white/68 transition-colors hover:text-ms-electric-yellow"
          >
            <ArrowRightIcon className="size-4 rotate-180 transition-transform group-hover:-translate-x-1" />
            All events
          </Link>
          {event.ticketHref ? (
            <Link
              href={event.ticketHref}
              target={
                event.ticketHref.startsWith("http") ? "_blank" : undefined
              }
              rel={
                event.ticketHref.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined
              }
              className="group inline-flex items-center gap-3 border-b border-ms-electric-yellow/55 pb-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-electric-yellow"
            >
              {event.ticketLabel ?? "Ticket information"}
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : null}
        </div>
      </section>
    </PageShell>
  );
}
