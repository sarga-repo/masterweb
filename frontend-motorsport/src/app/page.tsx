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
} from "@/components";
import { fetchHomepageData } from "@/lib/homepage-data";
import { fetchEcosystemSites, fetchLeadership } from "@/lib/cms-data";
import { siteConfig } from "@/lib/site-config";
import { localizeExternalSiteHref } from "@/lib/i18n/config";
import { getRequestLocale } from "@/lib/i18n/request";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getMotorsportNavigation } from "@/lib/navigation-cms";

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
  const [data, leadership, ecosystemSites] = await Promise.all([
    fetchHomepageData(),
    fetchLeadership(),
    fetchEcosystemSites(),
  ]);
  const publications = Array.from(
    new Map(
      [
        ...(data.featuredArticle ? [data.featuredArticle] : []),
        ...data.articles,
      ].map((article) => [article.href, article]),
    ).values(),
  );

  return (
    <>
      <MotorsportHeader
        navigation={navigation.items}
        ticketLink={ticketLink}
        gatewayLink={{
          label: "Sarga.co",
          href: localizeExternalSiteHref(siteConfig.gatewayUrl, locale),
          external: true,
        }}
        locale={locale}
        dictionary={dictionary}
        navigationSource={navigation.source}
      />

      <main>
        <MotorsportHero slides={data.page.heroSlides} />

        {data.page.informationBand.enabled ? (
          <InformationBand
            eyebrow={data.page.informationBand.eyebrow}
            title={data.page.informationBand.title}
            description={data.page.informationBand.description}
            items={[
              {
                label: data.page.informationBand.nextEventLabel,
                value: data.featuredEvent?.dateLabel ?? "TBA",
              },
              {
                label: data.page.informationBand.ticketStatusLabel,
                value: data.featuredEvent?.status ?? "Announced",
              },
              {
                label: data.page.informationBand.regionLabel,
                value: data.page.informationBand.regionValue,
              },
            ]}
          />
        ) : null}

        {data.page.worldOfMotorsport.enabled ? (
          <WorldOfMotorsport {...data.page.worldOfMotorsport} />
        ) : null}

        <section
          id="upcoming-events"
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
              <SectionLink href="/events" label="View all events" tone="dark" />
            </div>

            {data.ticketCta ? (
              <div className="mt-16">
                <TicketCtaPanel
                  eyebrow="Official ticketing"
                  title="Be there when the grid goes live."
                  description="Choose an event and continue to its approved ticketing destination. Sarga Motorsport does not process checkout directly."
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
          </div>
        </section>

        <section className="ms-home-news-surface ms-reflected-light-surface ms-section">
          <div className="ms-news-race-flag" aria-hidden="true">
            {Array.from({ length: 12 }, (_, index) => (
              <span key={index} />
            ))}
          </div>
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
                <NewsCard article={data.featuredArticle} feature tone="dark" />
              ) : null}
              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-1">
                {data.articles.slice(0, 2).map((article) => (
                  <NewsCard key={article.href} article={article} tone="dark" />
                ))}
              </div>
            </div>

            <div className="mt-10 flex justify-end">
              <SectionLink href="/news" label="Read all stories" tone="dark" />
            </div>
          </div>
        </section>

        <SargaTimeline
          publications={publications}
          leadership={leadership}
          ecosystemSites={ecosystemSites}
        />

        <section className="ms-section border-y border-ms-warm-white/12 bg-ms-charcoal/45">
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
      </main>

      <MotorsportFooter
        statement="Racing, amplified."
        columns={[
          {
            title: "Discover",
            links: [
              { label: "Home", href: "/" },
              { label: "About", href: "/about" },
              { label: "Events", href: "/events" },
            ],
          },
          {
            title: "Follow",
            links: [
              { label: "News", href: "/news" },
              { label: "Gallery", href: "/gallery" },
              { label: "Contact", href: "/contact" },
            ],
          },
          {
            title: "Race day",
            links: [
              { label: "Tickets", href: "/tickets" },
              { label: "Merchandise", href: "/merchandise" },
            ],
          },
        ]}
        gatewayLink={{
          label: "Visit Sarga.co",
          href: localizeExternalSiteHref(siteConfig.gatewayUrl, locale),
          external: true,
        }}
        crossSiteLinks={[
          {
            label: "Sarga Horse Sport",
            href: localizeExternalSiteHref(siteConfig.horsesportUrl, locale),
            external: true,
          },
        ]}
        copyright="© 2026 Sarga Motorsport"
      />
    </>
  );
}
