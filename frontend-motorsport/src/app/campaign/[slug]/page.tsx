import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

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
import { resolveSiteUrl, resolveSocialImageUrl } from "@/lib/site-config";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return [{ slug: FIA_RALLYCROSS_SLUG }];
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  if (slug !== FIA_RALLYCROSS_SLUG) return { title: "Campaign not found" };

  const campaign = await getFiaRallycrossCampaign();
  const canonical = campaign.seo?.canonical ?? FIA_RALLYCROSS_PATH;
  const canonicalUrl = canonical.startsWith("/")
    ? resolveSiteUrl(canonical)
    : canonical;
  const socialImage = resolveSocialImageUrl(
    campaign.seo?.image ?? campaign.image,
  );

  return {
    title: campaign.seo?.title ?? campaign.title,
    description: campaign.seo?.description ?? campaign.summary,
    alternates: { canonical: canonicalUrl },
    robots: campaign.seo?.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: campaign.seo?.ogTitle ?? campaign.headline ?? campaign.title,
      description:
        campaign.seo?.ogDescription ??
        campaign.seo?.description ??
        campaign.summary,
      url: canonicalUrl,
      type: "website",
      images: socialImage
        ? [{ url: socialImage, alt: campaign.imageAlt }]
        : undefined,
    },
  };
}

export default async function CampaignPage(props: Props) {
  const { slug } = await props.params;
  if (slug !== FIA_RALLYCROSS_SLUG) notFound();

  const campaign = await getFiaRallycrossCampaign();
  const ticketCta = campaign.ticketCta ?? {
    label: "Get Your Ticket Now",
    href: "/tickets",
  };
  const dos = campaign.rules.filter((rule) => rule.type === "do");
  const donts = campaign.rules.filter((rule) => rule.type === "dont");

  return (
    <PageShell spectrumSeparators>
      <PageHero
        kicker="FIA / Rallycross World Cup / Indonesia 2026"
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
          <Link
            href={ticketCta.href}
            target={ticketCta.external ? "_blank" : undefined}
            rel={ticketCta.external ? "noopener noreferrer" : undefined}
            className="group inline-flex h-(--ms-control-height) items-center gap-5 bg-ms-apex-crimson px-7 text-[0.66rem] font-black uppercase tracking-[0.16em] text-white transition-colors hover:bg-ms-ignition-orange"
          >
            {ticketCta.label}
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
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
        description="Two days of explosive starts, mixed-surface strategy, and a compact race format that keeps every spectator close to the decisive action."
        items={[
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
            eyebrow="Mixed surface / Maximum pressure"
            title="Every heat changes the order."
            description="Rallycross compresses starts, contact, strategy, and elimination into a format designed for immediate spectator energy."
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
                className="min-h-72 bg-[#081a3a]/88 p-7 sm:p-9"
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
            eyebrow="5-6 December 2026"
            title="Two days. One World Cup."
            description="Session times are managed in the Sarga CMS and remain subject to sporting or operational updates."
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
            eyebrow="Race-day essentials"
            title="Know before you go."
            description="A practical spectator guide for a smooth arrival and a safe, high-energy weekend at the circuit."
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

      <section className="ms-blue-heat-surface ms-section">
        <div className="ms-shell">
          <TicketCtaPanel
            eyebrow="Official ticketing"
            title="First time. Be there for the first launch."
            description="Review availability before continuing to the approved ticketing partner. Sarga Motorsport does not process checkout or payment on this website."
            cta={ticketCta}
            provider={ticketCta.provider}
            eventMeta={`${campaign.dateLabel ?? "5-6 December 2026"} / ${
              campaign.venue ?? "Jakarta International E-Prix Circuit"
            }`}
            surface="reflected"
          />
        </div>
      </section>

      <section className="ms-blue-heat-surface py-12">
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
