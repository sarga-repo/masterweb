import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/i18n/locale-link";
import { notFound } from "next/navigation";
import { permanentRedirect } from "next/navigation";

import {
  CampaignBannerSlider,
  InformationBand,
  PageHero,
  PageShell,
  ScheduleCard,
  SectionHeader,
  TicketCtaPanel,
} from "@/components";
import { ArrowRightIcon } from "@/components/ui/icons";
import {
  FIA_RALLYCROSS_PATH,
  FIA_RALLYCROSS_SLUG,
  getFiaRallycrossCampaign,
} from "@/lib/rallycross-data";
import { createMetadata } from "@/lib/seo/metadata";
import { getRequestLocale } from "@/lib/i18n/request";
import {
  fetchMotorsportPageByRoute,
  fetchMotorsportTheme,
} from "@/lib/cms-data";
import { mergeAuthoritativeCmsSections } from "@/lib/cms-page-order";
import { createSurfaceSequencer } from "@/lib/surface-sequencer";

type Props = { params: Promise<{ slug: string }> };

type CampaignRouteSection = {
  sectionKey: string;
  eyebrow?: string;
  title?: string;
  body?: string;
  enabled?: boolean;
  indexLabel?: string;
  showIndex?: boolean;
  showEyebrow?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  showMedia?: boolean;
  showCta?: boolean;
  items?: Array<{
    isActive?: boolean;
    sortOrder?: number;
    label?: string;
    title?: string;
    description?: string;
    media?: unknown;
    mediaAlt?: string;
    accent?: "crimson" | "orange" | "yellow" | "teal" | "blue";
    href?: string;
    hrefLabel?: string;
  }>;
};

const FORMAT_ACCENT_CLASSES = {
  crimson: "text-ms-apex-crimson",
  orange: "text-ms-ignition-orange",
  yellow: "text-ms-electric-yellow",
  teal: "text-ms-slipstream-teal",
  blue: "text-ms-draftline-blue",
} as const;

export function generateStaticParams() {
  return [{ slug: FIA_RALLYCROSS_SLUG }];
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const [{ slug }, locale] = await Promise.all([
    props.params,
    getRequestLocale(),
  ]);
  if (slug !== FIA_RALLYCROSS_SLUG) return { title: "Campaign not found" };

  const campaign = await getFiaRallycrossCampaign(locale);
  if (!campaign) return { title: "Campaign not found" };
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

export default async function CampaignPage(props: Props) {
  const { slug } = await props.params;
  if (slug !== FIA_RALLYCROSS_SLUG) notFound();
  permanentRedirect(FIA_RALLYCROSS_PATH);
}

export async function RallycrossCampaignPage() {
  const locale = await getRequestLocale();
  const [campaign, page, theme] = await Promise.all([
    getFiaRallycrossCampaign(locale),
    fetchMotorsportPageByRoute(FIA_RALLYCROSS_PATH, locale),
    fetchMotorsportTheme(locale),
  ]);
  if (!campaign) notFound();
  // The grouped FIA content is the campaign's source of truth after the local
  // migration. Keep the legacy presentation sections as a per-section
  // fallback so older or partially migrated records remain renderable.
  const legacyPresentationSections: CampaignRouteSection[] = (
    campaign.presentationSections ?? []
  ).map((item) => ({
    sectionKey: item.sectionKey,
    eyebrow: item.eyebrow,
    title: item.title,
    body: item.body,
    enabled: item.isActive,
    indexLabel: item.indexLabel,
    showIndex: item.showIndex,
    showEyebrow: item.showEyebrow,
    showTitle: item.showTitle,
    showDescription: item.showBody,
    showMedia: item.showMedia,
    showCta: item.showCta,
    items: item.items,
  }));
  const groupedPresentationSections: CampaignRouteSection[] = [
    campaign.fiaRallycrossContent?.formatSection,
    campaign.fiaRallycrossContent?.rundownSection,
    campaign.fiaRallycrossContent?.raceDayGuideSection,
  ]
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .map((item) => ({
      sectionKey: item.sectionKey,
      eyebrow: item.eyebrow,
      title: item.title,
      body: item.body,
      enabled: item.isActive,
      indexLabel: item.indexLabel,
      showIndex: item.showIndex,
      showEyebrow: item.showEyebrow,
      showTitle: item.showTitle,
      showDescription: item.showBody,
      items: item.items,
    }));
  const groupedByKey = new Map(
    groupedPresentationSections.map((item) => [item.sectionKey, item]),
  );
  const legacyByKey = new Map(
    legacyPresentationSections.map((item) => [item.sectionKey, item]),
  );
  const presentationSections: CampaignRouteSection[] = groupedPresentationSections.length
    ? (["format", "rundown", "race-day-guide"]
        .map((key) => groupedByKey.get(key) ?? legacyByKey.get(key))
        .filter((item): item is CampaignRouteSection => Boolean(item)))
    : legacyPresentationSections;
  const routeSections = mergeAuthoritativeCmsSections(
    presentationSections,
    page?.sections ?? [],
  );
  const sectionConfig = (key: string) =>
    routeSections.find((item) => item.sectionKey === key);
  const section = (key: string) => {
    const configured = sectionConfig(key);
    return configured && configured.enabled !== false ? configured : undefined;
  };
  const isSectionVisible = (key: string) =>
    sectionConfig(key)?.enabled !== false;
  const ticketCta = campaign.ticketCta;
  const campaignTicketSection = sectionConfig("campaign-ticket");
  const hero = campaign.presentationHero;
  const informationBand = campaign.informationBand;
  const informationBandSection = sectionConfig("world-cup-control");
  const dos = campaign.rules.filter((rule) => rule.type === "do");
  const donts = campaign.rules.filter((rule) => rule.type === "dont");
  const nextAlternatingSurface = createSurfaceSequencer(theme).nextClass;
  const formatSection = section("format");
  const formatItems = formatSection?.items
    ?.filter((item) => item.isActive !== false && item.title?.trim())
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  const formatCards = formatItems?.length
    ? formatItems.map((item, index) => {
        const title = item.title?.trim() ?? "Item";
        return {
          index: item.label?.trim() || String(index + 1).padStart(2, "0"),
          title,
          body: item.description?.trim(),
          tone: FORMAT_ACCENT_CLASSES[item.accent ?? "crimson"],
        };
      })
    : [
        {
          index: "01",
          title: "Launch",
          body: "Multiple cars attack the first corner together, turning reaction time into instant track position.",
          tone: "text-ms-apex-crimson",
        },
        {
          index: "02",
          title: "Joker lap",
          body: "Every driver must take the alternate route, creating a strategy window that can reverse the running order.",
          tone: "text-ms-ignition-orange",
        },
        {
          index: "03",
          title: "Final",
          body: "The fastest qualifiers advance through elimination races into one decisive World Cup showdown.",
          tone: "text-ms-slipstream-teal",
        },
      ];
  const primaryHeroCta =
    hero?.showPrimaryCta !== false
      ? (hero?.primaryCta ??
        (ticketCta
          ? {
              label: ticketCta.label,
              href: ticketCta.href,
              external: ticketCta.external,
              openInNewTab: ticketCta.external,
            }
          : undefined))
      : undefined;
  const secondaryHeroCta =
    hero?.showSecondaryCta !== false
      ? (hero?.secondaryCta ?? {
          label: "View the rundown",
          href: "#rundown",
        })
      : undefined;

  return (
    <PageShell spectrumSeparators>
      {hero?.isActive !== false ? (
        <PageHero
          kicker={
            hero?.eyebrow ??
            page?.navigationLabel ??
            "FIA / Rallycross World Cup / Indonesia 2026"
          }
          kickerColor="yellow"
          showKicker={hero?.showEyebrow ?? true}
          title={
            hero?.title ||
            campaign.headline ||
            "First Time, Wild Action, Closer Than Ever"
          }
          showTitle={hero?.showTitle ?? true}
          description={hero?.description ?? campaign.summary}
          showDescription={hero?.showDescription ?? true}
          showMedia={hero?.showMedia ?? true}
          backgroundImage={hero?.backgroundMedia?.url ?? campaign.image}
          backgroundAlt={hero?.backgroundMedia?.alt ?? campaign.imageAlt}
          accent="crimson"
          accentPosition="bottom-left"
          surface="heat"
          speedLines
          grain
        >
          <div className="flex flex-wrap gap-4">
            {primaryHeroCta ? (
              <Link
                href={primaryHeroCta.href}
                target={primaryHeroCta.openInNewTab ? "_blank" : undefined}
                rel={
                  primaryHeroCta.openInNewTab
                    ? "noopener noreferrer"
                    : undefined
                }
                className="group inline-flex h-(--ms-control-height) items-center gap-5 bg-ms-apex-crimson px-7 text-[0.66rem] font-black uppercase tracking-[0.16em] text-white transition-colors hover:bg-ms-ignition-orange"
              >
                {primaryHeroCta.label}
                <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : null}
            {secondaryHeroCta ? (
              <Link
                href={secondaryHeroCta.href}
                target={secondaryHeroCta.openInNewTab ? "_blank" : undefined}
                rel={
                  secondaryHeroCta.openInNewTab
                    ? "noopener noreferrer"
                    : undefined
                }
                className="inline-flex h-(--ms-control-height) items-center border border-ms-warm-white/40 px-7 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-warm-white transition-colors hover:border-ms-warm-white hover:bg-ms-warm-white hover:text-ms-black"
              >
                {secondaryHeroCta.label}
              </Link>
            ) : null}
          </div>
        </PageHero>
      ) : null}

      <InformationBand
        isActive={
          informationBand?.isActive ?? informationBandSection?.enabled ?? true
        }
        showEyebrow={
          informationBand?.showEyebrow ??
          informationBandSection?.showEyebrow ??
          true
        }
        showTitle={
          informationBand?.showTitle ??
          informationBandSection?.showTitle ??
          true
        }
        showDescription={
          informationBand?.showDescription ??
          informationBandSection?.showDescription ??
          true
        }
        eyebrow={
          informationBand?.eyebrow ??
          informationBandSection?.eyebrow ??
          "World Cup control / Jakarta"
        }
        title={
          informationBand?.title ??
          informationBandSection?.title ??
          campaign.title
        }
        description={
          section("world-cup-control")?.body ??
          informationBand?.description ??
          "Two days of explosive starts, mixed-surface strategy, and a compact race format that keeps every spectator close to the decisive action."
        }
        showMetricGroup={informationBand?.showMetricGroup ?? true}
        items={
          informationBand?.metrics?.length
            ? informationBand.metrics
            : [
                {
                  label: "Date",
                  value: campaign.dateLabel ?? "5-6 December 2026",
                },
                {
                  label: "Venue",
                  value:
                    campaign.venue ?? "Jakarta International E-Prix Circuit",
                },
                { label: "Status", value: "Tickets open" },
              ]
        }
      />

      <CampaignBannerSlider
        slides={campaign.slides}
        label="FIA Rallycross World Cup Indonesia campaign highlights"
      />

      {isSectionVisible("format") ? (
        <section
          data-cms-section-key="format"
          data-cms-enabled="true"
          className={`ms-reflected-light-surface ms-section ${nextAlternatingSurface()}`}
        >
          <div className="ms-shell">
            <SectionHeader
              index={formatSection?.indexLabel ?? "RX / FORMAT"}
              eyebrow={
                section("format")?.eyebrow ?? "Mixed surface / Maximum pressure"
              }
              showIndex={section("format")?.showIndex ?? true}
              showEyebrow={section("format")?.showEyebrow ?? true}
              showTitle={section("format")?.showTitle ?? true}
              showDescription={section("format")?.showDescription ?? true}
              title={
                section("format")?.title ?? "Every heat changes the order."
              }
              description={
                section("format")?.body ??
                "Rallycross compresses starts, contact, strategy, and elimination into a format designed for immediate spectator energy."
              }
            />
            <div className="mt-12 grid gap-px overflow-hidden border border-ms-warm-white/14 bg-ms-warm-white/14 md:grid-cols-3">
              {formatCards.map((item) => (
                <article
                  key={item.index}
                  className="ms-rx-format-card min-h-72 bg-[#081a3a]/88 p-7 sm:p-9"
                >
                  <p className={`ms-tabular text-2xl font-black ${item.tone}`}>
                    {item.index}
                  </p>
                  <h3 className="ms-heading-card mt-20">{item.title}</h3>
                  {item.body ? (
                    <p className="mt-4 text-sm leading-6 text-ms-warm-white/62">
                      {item.body}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {isSectionVisible("rundown") ? (
        <section
          id="rundown"
          data-cms-section-key="rundown"
          data-cms-enabled="true"
          className={`ms-blue-heat-surface ms-section scroll-mt-24 ${nextAlternatingSurface()}`}
        >
          <div className="ms-shell">
            <SectionHeader
              index={section("rundown")?.indexLabel ?? "RX / RUNDOWN"}
              eyebrow={section("rundown")?.eyebrow ?? "5-6 December 2026"}
              showIndex={section("rundown")?.showIndex ?? true}
              showEyebrow={section("rundown")?.showEyebrow ?? true}
              showTitle={section("rundown")?.showTitle ?? true}
              showDescription={section("rundown")?.showDescription ?? true}
              title={section("rundown")?.title ?? "Two days. One World Cup."}
              description={
                section("rundown")?.body ??
                "Session times are managed in the Sarga CMS and remain subject to sporting or operational updates."
              }
            />
            <div className="mt-12 space-y-5">
              {campaign.schedule.map((entry) => (
                <ScheduleCard key={entry.id} entry={entry} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {isSectionVisible("race-day-guide") ? (
        <section
          id="race-day-guide"
          data-cms-section-key="race-day-guide"
          data-cms-enabled="true"
          className={`ms-reflected-light-surface ms-section scroll-mt-24 ${nextAlternatingSurface()}`}
        >
          <div className="ms-shell">
            <SectionHeader
              index={section("race-day-guide")?.indexLabel ?? "RX / GUIDE"}
              eyebrow={
                section("race-day-guide")?.eyebrow ?? "Race-day essentials"
              }
              showIndex={section("race-day-guide")?.showIndex ?? true}
              showEyebrow={section("race-day-guide")?.showEyebrow ?? true}
              showTitle={section("race-day-guide")?.showTitle ?? true}
              showDescription={
                section("race-day-guide")?.showDescription ?? true
              }
              title={section("race-day-guide")?.title ?? "Know before you go."}
              description={
                section("race-day-guide")?.body ??
                "A practical spectator guide for a smooth arrival and a safe, high-energy weekend at the circuit."
              }
            />
            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              {[
                { label: "Do", rules: dos, accent: "teal" },
                { label: "Do not", rules: donts, accent: "crimson" },
              ].map((group) => (
                <div
                  key={group.label}
                  className="ms-panel overflow-hidden bg-[#071a3d]/90"
                >
                  <div
                    className={`border-b border-ms-warm-white/14 px-7 py-5 ${
                      group.accent === "teal"
                        ? "bg-ms-slipstream-teal text-ms-black"
                        : "bg-ms-apex-crimson text-ms-warm-white"
                    }`}
                  >
                    <h3 className="font-display text-2xl uppercase">
                      {group.label}
                    </h3>
                  </div>
                  <div className="divide-y divide-ms-warm-white/12">
                    {group.rules.map((rule, index) => (
                      <article
                        key={rule.id}
                        className="grid gap-5 p-7 sm:grid-cols-[3rem_minmax(0,1fr)]"
                      >
                        <span className="ms-tabular text-sm font-black text-ms-warm-white/38">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <h4 className="font-display text-xl uppercase leading-tight">
                            {rule.title}
                          </h4>
                          <p className="mt-3 text-sm leading-6 text-ms-warm-white/60">
                            {rule.description}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {ticketCta &&
      isSectionVisible("campaign-ticket") &&
      campaignTicketSection?.showCta !== false ? (
        <section
          data-cms-section-key="campaign-ticket"
          data-cms-enabled="true"
          className={`ms-blue-heat-surface ms-section ${nextAlternatingSurface()}`}
        >
          <div className="ms-shell">
            <TicketCtaPanel
              eyebrow={
                ticketCta.eyebrow ??
                section("campaign-ticket")?.eyebrow ??
                "Official ticketing"
              }
              title={
                ticketCta.title ??
                section("campaign-ticket")?.title ??
                "First time. Be there for the first launch."
              }
              description={
                ticketCta.description ??
                section("campaign-ticket")?.body ??
                "Review availability before continuing to the approved ticketing partner. Sarga Motorsport does not process checkout or payment on this website."
              }
              cta={ticketCta}
              provider={ticketCta.provider}
              providerLabel={ticketCta.providerLabel}
              partnerLabel={ticketCta.partnerLabel}
              footerText={ticketCta.footerText}
              eventMeta={
                ticketCta.eventMeta ??
                `${campaign.dateLabel ?? "5-6 December 2026"} / ${
                  campaign.venue ?? "Jakarta International E-Prix Circuit"
                }`
              }
              eventMetaLabel={ticketCta.eventMetaLabel}
              image={ticketCta.image as string | undefined}
              mobileImage={ticketCta.mobileImage as string | undefined}
              surface="reflected"
            />
          </div>
        </section>
      ) : null}

      <section className="ms-rx-footer-cta ms-blue-heat-surface py-12">
        <div className="ms-shell flex flex-wrap items-center justify-between gap-6 border-t border-ms-warm-white/14 pt-10">
          <Link
            href="/events"
            className="border-b border-ms-slipstream-teal/55 pb-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-slipstream-teal"
          >
            All events
          </Link>
          <Link
            href="/contact"
            className="border-b border-ms-electric-yellow/55 pb-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-electric-yellow"
          >
            Campaign inquiries
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
