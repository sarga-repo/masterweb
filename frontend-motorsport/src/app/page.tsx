import { LocaleLink as Link } from "@/components/i18n/locale-link";

import {
  EventFeatureCard,
  EventListCard,
  GalleryMosaic,
  InformationBand,
  MotorsportFooter,
  MotorsportHeader,
  MotorsportHero,
  NewsCard,
  NewsletterCtaSection,
  PartnerLogoStrip,
  SargaTimeline,
  SectionHeader,
  TicketCtaPanel,
  WorldOfMotorsport,
  PageComingSoon,
} from "@/components";
import { fetchHomepageData } from "@/lib/homepage-data";
import {
  fetchEcosystemSites,
  fetchLeadership,
  fetchPrograms,
} from "@/lib/cms-data";
import { getRequestLocale } from "@/lib/i18n/request";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getMotorsportNavigation } from "@/lib/navigation-cms";
import { fetchMotorsportChrome } from "@/lib/cms-data";
import { isStrapiPreviewEnabled } from "@/lib/strapi/client";
import { isCmsPageVisible } from "@/lib/cms-visibility";

function SectionLink({
  href,
  label,
  tone = "dark",
}: {
  href: string;
  label: string;
  tone?: "light" | "dark";
}) {
  const light = tone === "light";

  return (
    <Link
      href={href}
      className={`group inline-flex min-h-12 items-center gap-4 border-b py-3 text-[0.66rem] font-black uppercase tracking-[0.16em] transition-colors hover:border-ms-apex-crimson ${light ? "border-ms-draftline-blue/25 text-ms-draftline-blue hover:text-ms-crimson-700" : "border-ms-warm-white/20 text-ms-warm-white/58 hover:text-ms-warm-white"}`}
    >
      <span className="size-1.5 bg-ms-apex-crimson" aria-hidden="true" />
      {label}
      <span
        className="text-base transition-transform group-hover:translate-x-1"
        aria-hidden="true"
      >
        →
      </span>
    </Link>
  );
}

export default async function HomePage() {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const navigation = await getMotorsportNavigation(locale);
  const ticketLink = navigation.items.find(
    (item) => item.emphasis === "primaryCta",
  );
  const [data, leadership, ecosystemSites, chrome, programs, isPreview] =
    await Promise.all([
      fetchHomepageData(locale),
      fetchLeadership(locale),
      fetchEcosystemSites(locale),
      fetchMotorsportChrome(locale),
      fetchPrograms(locale),
      isStrapiPreviewEnabled(),
    ]);
  const publications = Array.from(
    new Map(
      [
        ...(data.featuredArticle ? [data.featuredArticle] : []),
        ...data.articles,
      ].map((article) => [article.href, article]),
    ).values(),
  );
  const footerLinks = (chrome.footerUtilityLinks ?? []).map((item) => ({
    label: item.label,
    href: item.href,
    external: item.linkType === "external",
  }));
  const crossSiteLinks = footerLinks.filter(
    (item) => item.label !== "Visit Sarga.co",
  );
  const eventPrograms =
    programs.length > 0
      ? programs
      : isPreview
        ? []
        : [
            {
              title: "FIA Rallycross World Cup Indonesia 2026",
              eventMenuLabel: "FIA Rallycross",
              eventMenuEnabled: true,
              href: "/events/fia-rallycross-world-cup-indonesia-2026",
            },
            {
              title: "Indonesia Junior Talent Cup",
              eventMenuLabel: "IJTC",
              eventMenuEnabled: true,
              href: "/events/indonesia-junior-talent-cup",
            },
          ];
  const eventChildren = eventPrograms
    .filter((program) => program.eventMenuEnabled !== false)
    .map((program) => ({
      label:
        program.eventMenuLabel ||
        (program.title.length > 30
          ? `${program.title.slice(0, 27).trimEnd()}…`
          : program.title),
      href: program.href,
    }));
  const pageAvailable = isCmsPageVisible(data.page.pageAvailability);

  return (
    <>
      <MotorsportHeader
        navigation={navigation.items}
        ticketLink={ticketLink}
        eventChildren={eventChildren}
        gatewayLink={undefined}
        locale={locale}
        dictionary={dictionary}
        navigationSource={navigation.source}
        logoSrc={chrome.headerLogo}
        logoAlt={chrome.headerLogoAlt}
      />

      <main>
        {!pageAvailable ? (
          <PageComingSoon
            availability={data.page.pageAvailability ?? { pageEnabled: false }}
          />
        ) : (
          <>
            {data.page.heroEnabled ? (
              <div
                data-cms-section-key="hero"
                data-cms-enabled="true"
              >
                <MotorsportHero slides={data.page.heroSlides} />
              </div>
            ) : null}

            {data.page.informationBand.enabled ? (
              <div
                data-cms-section-key="information-band"
                data-cms-enabled="true"
              >
                <InformationBand
                  showMetricGroup={data.page.informationBand.showMetricGroup}
                  eyebrow={data.page.informationBand.eyebrow}
                  title={data.page.informationBand.title}
                  description={data.page.informationBand.description}
                  items={
                    data.page.informationBand.metrics.length > 0
                      ? data.page.informationBand.metrics
                      : [
                          {
                            label: data.page.informationBand.nextEventLabel,
                            value: data.featuredEvent?.dateLabel ?? "TBA",
                          },
                          {
                            label: data.page.informationBand.ticketStatusLabel,
                            value: data.featuredEvent?.status
                              ? data.featuredEvent.status.replaceAll("-", " ")
                              : "Pending",
                          },
                          {
                            label: data.page.informationBand.regionLabel,
                            value: data.page.informationBand.regionValue,
                          },
                        ]
                  }
                />
              </div>
            ) : null}

            {data.page.worldOfMotorsport.enabled ? (
              <div
                data-cms-section-key="world-of-motorsport"
                data-cms-enabled="true"
              >
                <WorldOfMotorsport {...data.page.worldOfMotorsport} />
              </div>
            ) : null}

            {data.page.sections.events.enabled ? (
              <section
                id="upcoming-events"
                data-cms-section-key="upcoming-events"
                data-cms-enabled="true"
                className="ms-home-events-surface ms-reflected-light-surface ms-section"
              >
            <div className="ms-shell">
              <SectionHeader
                index="EVENTS"
                eyebrow={data.page.sections.events.eyebrow}
                title={data.page.sections.events.title}
                description={data.page.sections.events.description}
                tone="dark"
              />

              <div className="mt-12 sm:mt-16">
                {data.featuredEvent ? (
                  <EventFeatureCard
                    event={data.featuredEvent}
                    priority
                    tone="dark"
                  />
                ) : null}
              </div>

              {data.upcomingEvents.length > 0 ? (
                <div className="mt-12 border-b border-ms-warm-white/15">
                  <div className="mb-5 flex items-center justify-between gap-6">
                    <p className="ms-kicker text-ms-ignition-orange">
                      Also on the calendar
                    </p>
                    <span className="ms-data-label text-ms-warm-white/52">
                      {String(data.upcomingEvents.length).padStart(2, "0")}{" "}
                      entries
                    </span>
                  </div>
                  {data.upcomingEvents.slice(0, 3).map((event, index) => (
                    <EventListCard
                      key={event.href}
                      event={event}
                      index={String(index + 1).padStart(2, "0")}
                      tone="dark"
                    />
                  ))}
                </div>
              ) : null}

              <div className="mt-8 flex justify-end">
                <SectionLink
                  href="/events"
                  label="View all events"
                  tone="dark"
                />
              </div>
            </div>
              </section>
            ) : null}

            {data.ticketCta ? (
              <section
                data-cms-section-key="homepage-ticket"
                data-cms-enabled="true"
                className="ms-reflected-light-surface ms-section"
              >
                <div className="ms-shell">
                  <TicketCtaPanel
                    eyebrow={data.ticketCta.eyebrow ?? "Official ticketing"}
                    title={
                      data.ticketCta.title ?? "Be there when the grid goes live."
                    }
                    description={
                      data.ticketCta.description ??
                      "Choose an event and continue to its approved ticketing destination. Sarga Motorsport does not process checkout directly."
                    }
                    eventMeta={
                      data.ticketCta.eventName ?? data.featuredEvent?.title
                    }
                    eventMetaLabel={data.ticketCta.eventLabel}
                    provider={data.ticketCta.provider}
                    providerLabel={data.ticketCta.providerLabel}
                    partnerLabel={data.ticketCta.partnerLabel}
                    footerText={data.ticketCta.footerText}
                    image={data.ticketCta.image}
                    cta={{
                      label: data.ticketCta.label,
                      href: data.ticketCta.href,
                      external: data.ticketCta.href.startsWith("http"),
                    }}
                  />
                </div>
              </section>
            ) : null}

            {data.page.sections.news.enabled ? (
              <section
                data-cms-section-key="latest-news"
                data-cms-enabled="true"
                className="ms-home-news-surface ms-reflected-light-surface ms-section"
              >
            <div className="ms-shell">
              <SectionHeader
                index="NEWS"
                eyebrow={data.page.sections.news.eyebrow}
                title={data.page.sections.news.title}
                description={data.page.sections.news.description}
                tone="dark"
              />

              <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1.45fr)_minmax(18rem,.55fr)] lg:gap-6">
                {data.featuredArticle ? (
                  <NewsCard
                    article={data.featuredArticle}
                    feature
                    tone="dark"
                  />
                ) : null}
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-1">
                  {data.articles.slice(0, 2).map((article) => (
                    <NewsCard
                      key={article.href}
                      article={article}
                      tone="dark"
                    />
                  ))}
                </div>
              </div>

              <div className="mt-10 flex justify-end">
                <SectionLink
                  href="/news"
                  label="Read all stories"
                  tone="dark"
                />
              </div>
            </div>
              </section>
            ) : null}

            {data.page.sections.connectedRecords.enabled ? (
              <div
                data-cms-section-key="connected-records"
                data-cms-enabled="true"
              >
                <SargaTimeline
                  publications={publications}
                  leadership={leadership}
                  ecosystemSites={ecosystemSites}
                />
              </div>
            ) : null}

            {data.page.sections.gallery.enabled ? (
              <section
                data-cms-section-key="gallery"
                data-cms-enabled="true"
                className="ms-section border-y border-ms-warm-white/12 bg-ms-charcoal/45"
              >
            <div className="ms-shell">
              <SectionHeader
                index="GALLERY"
                eyebrow={data.page.sections.gallery.eyebrow}
                title={data.page.sections.gallery.title}
                description={data.page.sections.gallery.description}
              />
              <div className="mt-12 sm:mt-16">
                <GalleryMosaic items={data.gallery.slice(0, 6)} />
              </div>
              <div className="mt-8 flex justify-end">
                <SectionLink href="/gallery" label="Open full gallery" />
              </div>
            </div>
              </section>
            ) : null}

            <div className="bg-ms-black">
              {data.partners.length > 0 ? (
                <PartnerLogoStrip
                  partners={data.partners.slice(0, 5)}
                  label="Official partners & sponsors"
                />
              ) : null}

              <NewsletterCtaSection
                title="Never miss lights-out."
                description="Get race weekend alerts, ticket drops, and exclusive paddock stories delivered to your inbox. No spam—just velocity."
                actionLabel="Subscribe to updates"
                cta={{ label: "contact us directly", href: "/contact" }}
              />
            </div>
          </>
        )}
      </main>

      <MotorsportFooter
        statement={chrome.footerStatement}
        columns={chrome.footerColumns ?? []}
        gatewayLink={undefined}
        crossSiteLinks={crossSiteLinks.filter(
          (item) => item.label !== "Visit Sarga.co",
        )}
        socialLinks={(chrome.footerSocialLinks ?? []).map((item) => ({
          label: item.label,
          href: item.href,
          external: item.linkType === "external",
        }))}
        legalLinks={(chrome.footerUtilityLinks ?? [])
          .filter(
            (item) =>
              item.label !== "Visit Sarga.co" &&
              item.label !== "Sarga Horse Sport",
          )
          .map((item) => ({ label: item.label, href: item.href }))}
        copyright={chrome.footerCopyright ?? "© 2026 Sarga Motorsport"}
        logoSrc={chrome.footerLogo}
        logoAlt={chrome.footerLogoAlt}
      />
    </>
  );
}
