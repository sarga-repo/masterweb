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
import { fetchMotorsportPageByRoute } from "@/lib/cms-data";

type Props = { params: Promise<{ slug: string }> };

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
  const [campaign, page] = await Promise.all([
    getFiaRallycrossCampaign(locale),
    fetchMotorsportPageByRoute(FIA_RALLYCROSS_PATH, locale),
  ]);
  if (!campaign) notFound();
  const section = (key: string) =>
    page?.sections.find((item) => item.sectionKey === key);
  const ticketCta = campaign.ticketCta;
  const dos = campaign.rules.filter((rule) => rule.type === "do");
  const donts = campaign.rules.filter((rule) => rule.type === "dont");

  return (
    <PageShell spectrumSeparators>
      <PageHero
        kicker={
          page?.navigationLabel ?? "FIA / Rallycross World Cup / Indonesia 2026"
        }
        kickerColor="yellow"
        title={campaign.headline ?? "First Time, Wild Action, Closer Than Ever"}
        description={campaign.summary}
        backgroundImage={campaign.image}
        backgroundAlt={campaign.imageAlt}
        accent="crimson"
        accentPosition="bottom-left"
        surface="heat"
        speedLines
        grain
      >
        <div className="flex flex-wrap gap-4">
          {ticketCta ? (
            <Link
              href={ticketCta.href}
              target={ticketCta.external ? "_blank" : undefined}
              rel={ticketCta.external ? "noopener noreferrer" : undefined}
              className="group inline-flex h-(--ms-control-height) items-center gap-5 bg-ms-apex-crimson px-7 text-[0.66rem] font-black uppercase tracking-[0.16em] text-white transition-colors hover:bg-ms-ignition-orange"
            >
              {ticketCta.label}
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : null}
          <Link
            href="#rundown"
            className="inline-flex h-(--ms-control-height) items-center border border-ms-warm-white/40 px-7 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-warm-white transition-colors hover:border-ms-warm-white hover:bg-ms-warm-white hover:text-ms-black"
          >
            View the rundown
          </Link>
        </div>
      </PageHero>

      <InformationBand
        eyebrow="World Cup control / Jakarta"
        title={campaign.title}
        description={
          section("world-cup-control")?.body ??
          "Two days of explosive starts, mixed-surface strategy, and a compact race format that keeps every spectator close to the decisive action."
        }
        showMetricGroup={campaign.informationBand?.showMetricGroup ?? true}
        items={campaign.informationBand?.metrics?.length
          ? campaign.informationBand.metrics
          : [
          { label: "Date", value: campaign.dateLabel ?? "5-6 December 2026" },
          {
            label: "Venue",
            value: campaign.venue ?? "Jakarta International E-Prix Circuit",
          },
          { label: "Status", value: "Tickets open" },
        ]}
      />

      <CampaignBannerSlider
        slides={campaign.slides}
        label="FIA Rallycross World Cup Indonesia campaign highlights"
      />

      <section className="ms-reflected-light-surface ms-section">
        <div className="ms-shell">
          <SectionHeader
            index="RX / FORMAT"
            eyebrow={
              section("format")?.eyebrow ?? "Mixed surface / Maximum pressure"
            }
            title={section("format")?.title ?? "Every heat changes the order."}
            description={
              section("format")?.body ??
              "Rallycross compresses starts, contact, strategy, and elimination into a format designed for immediate spectator energy."
            }
          />
          <div className="mt-12 grid gap-px overflow-hidden border border-ms-warm-white/14 bg-ms-warm-white/14 md:grid-cols-3">
            {[
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
            ].map((item) => (
              <article
                key={item.index}
                className="ms-rx-format-card min-h-72 bg-[#081a3a]/88 p-7 sm:p-9"
              >
                <p className={`ms-tabular text-2xl font-black ${item.tone}`}>
                  {item.index}
                </p>
                <h3 className="ms-heading-card mt-20">{item.title}</h3>
                <p className="mt-4 text-sm leading-6 text-ms-warm-white/62">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="rundown"
        className="ms-blue-heat-surface ms-section scroll-mt-24"
      >
        <div className="ms-shell">
          <SectionHeader
            index="RX / RUNDOWN"
            eyebrow={section("rundown")?.eyebrow ?? "5-6 December 2026"}
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

      <section
        id="race-day-guide"
        className="ms-reflected-light-surface ms-section scroll-mt-24"
      >
        <div className="ms-shell">
          <SectionHeader
            index="RX / GUIDE"
            eyebrow={
              section("race-day-guide")?.eyebrow ?? "Race-day essentials"
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

      {ticketCta ? (
        <section className="ms-blue-heat-surface ms-section">
          <div className="ms-shell">
            <TicketCtaPanel
              eyebrow={
                section("campaign-ticket")?.eyebrow ?? "Official ticketing"
              }
              title={
                section("campaign-ticket")?.title ??
                "First time. Be there for the first launch."
              }
              description={
                section("campaign-ticket")?.body ??
                "Review availability before continuing to the approved ticketing partner. Sarga Motorsport does not process checkout or payment on this website."
              }
              cta={ticketCta}
              provider={ticketCta.provider}
              eventMeta={`${campaign.dateLabel ?? "5-6 December 2026"} / ${
                campaign.venue ?? "Jakarta International E-Prix Circuit"
              }`}
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
