import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/i18n/locale-link";

import {
  EventListCard,
  MotorsportPageInformationBand,
  PageComingSoon,
  PageHero,
  PageShell,
  SectionHeader,
  TicketCtaPanel,
} from "@/components";
import { MarkdownContent } from "@/components/content/markdown-content";
import { ArrowRightIcon } from "@/components/ui/icons";
import {
  fetchEvents,
  fetchMotorsportTheme,
  fetchSitePage,
  fetchTicketCtas,
} from "@/lib/cms-data";
import { getRequestLocale } from "@/lib/i18n/request";
import { isStrapiPreviewEnabled } from "@/lib/strapi/client";
import {
  isCmsCanonicalSectionVisible,
  isCmsPageVisible,
  isCmsSectionVisible,
} from "@/lib/cms-visibility";
import { createSurfaceSequencer } from "@/lib/surface-sequencer";
import { createMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const page = await fetchSitePage("custom", "/tickets", locale);
  return createMetadata({
    title: page?.title ?? "Tickets",
    description:
      page?.heroDescription ??
      "Secure your seat at Sarga Motorsport events. Curated ticket journey with partner redirects - no internal payment processing.",
    path: "/tickets",
    image: page?.heroImage,
    seo: page?.seo
      ? {
          metaTitle: page.seo.metaTitle,
          metaDescription: page.seo.metaDescription,
          ogTitle: page.seo.ogTitle,
          ogDescription: page.seo.ogDescription,
          ogImageUrl: page.seo.ogImage?.url,
          canonicalUrl: page.seo.canonicalUrl,
          noIndex: page.seo.noIndex,
        }
      : undefined,
    locale,
    isFallback: locale === "id" && !page,
  });
}

const PLACEHOLDER_CTAS: Array<{
  label: string;
  provider: string;
  href: string;
  eventName: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  eventMeta?: string;
  eventMetaLabel?: string;
  providerLabel?: string;
  partnerLabel?: string;
  footerText?: string;
  image?: string;
  mobileImage?: string;
  embedHref?: string;
}> = [
  {
    label: "Contact ticket desk",
    provider: "Ticketing information",
    href: "/contact",
    eventName: "2026 event availability",
  },
];

export default async function TicketsPage() {
  const locale = await getRequestLocale();
  const [page, events, ctas, isPreview, theme] = await Promise.all([
    fetchSitePage("custom", "/tickets", locale),
    fetchEvents(50, locale),
    fetchTicketCtas(locale),
    isStrapiPreviewEnabled(),
    fetchMotorsportTheme(locale),
  ]);
  const featured = page?.sections.find(
    (section) => section.sectionKey === "featured-ticket",
  );
  const info = page?.sections.find(
    (section) => section.sectionKey === "ticket-info",
  );
  const ticketedEventsSection = page?.sections.find(
    (section) => section.sectionKey === "ticketed-events",
  );
  const pageAvailable = isCmsPageVisible(page?.pageAvailability);
  const ticketInfoItems =
    info?.items
      ?.filter((item) => item.isActive !== false)
      .map((item) => item.description || item.title || item.label)
      .filter((item): item is string => Boolean(item?.trim())) ?? [];
  const displayedTicketInfoItems = ticketInfoItems.length
    ? ticketInfoItems
    : [
        "Select an event and click the ticket CTA.",
        "You will be redirected to our approved ticketing partner.",
        "Complete your purchase on the partner platform securely.",
        "Receive your confirmation and show up on race day.",
      ];

  const ticketedEvents = events.filter((e) => e.ticketHref);
  const displayCtas = isPreview || ctas.length > 0 ? ctas : PLACEHOLDER_CTAS;
  const nextAlternatingSurface = createSurfaceSequencer(theme).nextClass;

  return (
    <PageShell spectrumSeparators>
      {!pageAvailable ? (
        <PageComingSoon
          availability={page?.pageAvailability ?? { pageEnabled: false }}
        />
      ) : (
        <>
          {page?.heroEnabled !== false ? (
            <div data-cms-section-key="hero" data-cms-enabled="true">
              <PageHero
                kicker={page?.navigationLabel ?? "Curated ticket journey"}
                kickerColor="orange"
                title={page?.heroTitle ?? "Tickets"}
                backgroundImage={
                  page?.heroImage || "/media/motorsport-design-hero.png"
                }
                backgroundAlt={
                  page?.heroImageAlt ||
                  "Race car throwing sparks under circuit lights"
                }
                accent="orange"
                accentPosition="bottom-left"
                grain
                speedLines
                surface="heat"
                description={
                  page?.heroDescription ??
                  "Sarga Motorsport partners with approved ticketing platforms. Every CTA below redirects to a secure partner checkout - we never process payment directly."
                }
              />
            </div>
          ) : null}

          {isCmsCanonicalSectionVisible(page?.informationBand) ? (
            <div
              data-cms-section-key="information-band"
              data-cms-enabled="true"
            >
              <MotorsportPageInformationBand
                band={page?.informationBand}
                fallback={{
                  eyebrow: "Ticket control / Partner routing",
                  title: "Your seat. Their secure checkout.",
                  description:
                    "Sarga Motorsport publishes approved destinations but never stores payment details or runs an internal ticket engine.",
                  metrics: [
                    { label: "Checkout", value: "Partner" },
                    { label: "Payment", value: "External" },
                    { label: "Support", value: "Available" },
                  ],
                }}
              />
            </div>
          ) : null}

          {/* Featured ticket CTA */}
          {isCmsSectionVisible(featured) ? (
            <section
              data-cms-section-key="featured-ticket"
              data-cms-enabled="true"
              className={`ms-reflected-light-surface ms-section ${nextAlternatingSurface()}`}
            >
              <div className="ms-shell">
                <SectionHeader
                  showIndex={featured?.showIndex}
                  showEyebrow={featured?.showEyebrow}
                  showTitle={featured?.showTitle}
                  showDescription={featured?.showBody}
                  eyebrow={featured?.eyebrow ?? "Featured ticket"}
                  title={featured?.title ?? "Secure your seat."}
                  align="left"
                />
                <div className="mt-12 space-y-8">
                  {displayCtas.map((cta, index) => (
                    <div key={`${cta.href}-${cta.eventName}-${index}`}>
                      <TicketCtaPanel
                        eyebrow={cta.eyebrow ?? "Official partner redirect"}
                        title={cta.title ?? cta.eventName ?? "Upcoming event"}
                        description={
                          cta.description ??
                          "Checkout is handled by our approved ticketing partner. Secure payment, guaranteed entry, zero markup."
                        }
                        eventMeta={cta.eventMeta ?? cta.eventName}
                        eventMetaLabel={cta.eventMetaLabel}
                        provider={cta.provider}
                        providerLabel={cta.providerLabel}
                        partnerLabel={cta.partnerLabel}
                        footerText={cta.footerText}
                        image={cta.image}
                        mobileImage={cta.mobileImage}
                        surface="reflected"
                        cta={{
                          label: cta.label,
                          href: cta.href,
                          external: cta.href.startsWith("http"),
                        }}
                      />
                      {/* Optional CMS-driven embed - only rendered when explicitly configured */}
                      {cta.embedHref ? (
                        <div className="ms-blue-panel mt-4 p-4">
                          <p className="ms-data-label mb-3 text-ms-warm-white/52">
                            Embedded checkout
                          </p>
                          <iframe
                            src={cta.embedHref}
                            title={`Ticket checkout - ${cta.eventName ?? "event"}`}
                            className="h-[32rem] w-full border-0"
                            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                            referrerPolicy="no-referrer"
                            loading="lazy"
                          />
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ) : null}

          {/* Ticketed events */}
          {isCmsSectionVisible(ticketedEventsSection) &&
          ticketedEvents.length > 0 ? (
            <section
              data-cms-section-key="ticketed-events"
              data-cms-enabled="true"
              className={`ms-reflected-light-surface ms-section ${nextAlternatingSurface()}`}
            >
              <div className="ms-shell">
                <SectionHeader
                  index={ticketedEventsSection?.indexLabel ?? "TICKETS"}
                  showIndex={ticketedEventsSection?.showIndex}
                  showEyebrow={ticketedEventsSection?.showEyebrow}
                  showTitle={ticketedEventsSection?.showTitle}
                  showDescription={ticketedEventsSection?.showBody}
                  eyebrow={
                    ticketedEventsSection?.eyebrow ??
                    "Events with tickets available"
                  }
                  title={ticketedEventsSection?.title ?? "On sale now."}
                  description={ticketedEventsSection?.body}
                  align="left"
                />
                <div className="mt-12">
                  {ticketedEvents.map((event, i) => (
                    <EventListCard
                      key={event.href}
                      event={event}
                      index={String(i + 1).padStart(2, "0")}
                    />
                  ))}
                </div>
              </div>
            </section>
          ) : null}

          {/* Info section */}
          {isCmsSectionVisible(info) ? (
            <section
              data-cms-section-key="ticket-info"
              data-cms-enabled="true"
              className={`ms-blue-heat-surface py-16 ${nextAlternatingSurface()}`}
            >
              <div className="ms-shell grid gap-10 lg:grid-cols-2">
                <div>
                  {info?.showTitle !== false ? (
                    <h2 className="ms-heading-feature">
                      {info?.title ?? "How it works."}
                    </h2>
                  ) : null}
                  <ul className="mt-8 space-y-5 text-base leading-7 text-ms-warm-white/60">
                    {displayedTicketInfoItems.map((item, index) => (
                      <li key={item} className="flex gap-4">
                        <span
                          className={`mt-1 block h-6 w-1 ${["bg-ms-apex-crimson", "bg-ms-ignition-orange", "bg-ms-electric-yellow", "bg-ms-slipstream-teal"][index % 4]}`}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="ms-blue-panel ms-panel p-8">
                  <span className="ms-data-label text-ms-warm-white/42">
                    Ticket support
                  </span>
                  {info?.showBody !== false ? (
                    <MarkdownContent
                      value={
                        info?.body ??
                        "Need help with your ticket? Contact our support team for event-specific inquiries, group bookings, or accessibility requests."
                      }
                      className="ms-rich-text mt-6 text-base leading-7 text-ms-warm-white/60"
                    />
                  ) : null}
                  {info?.showCta !== false ? (
                    <Link
                      href={
                        info?.secondaryCtaUrl?.startsWith("/")
                          ? info.secondaryCtaUrl
                          : "/contact"
                      }
                      target={
                        info?.secondaryCtaTarget === "newWindow"
                          ? "_blank"
                          : undefined
                      }
                      rel={
                        info?.secondaryCtaTarget === "newWindow"
                          ? "noreferrer"
                          : undefined
                      }
                      className="group mt-8 inline-flex items-center gap-3 border-b border-ms-apex-crimson pb-2 text-[0.66rem] font-black uppercase tracking-[0.16em] transition-colors hover:text-ms-ignition-orange"
                    >
                      {info?.secondaryCtaLabel ?? "Contact support"}
                      <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  ) : null}
                </div>
              </div>
            </section>
          ) : null}
        </>
      )}
    </PageShell>
  );
}
