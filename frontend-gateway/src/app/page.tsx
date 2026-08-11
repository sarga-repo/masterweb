import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { AboutPreview } from "@/components/sections/about-preview";
import { EcosystemSection } from "@/components/sections/ecosystem-section";
import { NewsPreview } from "@/components/sections/news-preview";
import { TicketHubCta } from "@/components/sections/ticket-hub-cta";
import { NewsletterSection } from "@/components/sections/newsletter-section";
import { getHomepage } from "@/lib/strapi/homepage";
import { getEcosystemBusinesses } from "@/lib/strapi/ecosystem";
import { getNewsArticles } from "@/lib/strapi/news";
import { getTimelineItems, getLeadershipPeople } from "@/lib/strapi/about";
import { getGatewaySitePageByPath } from "@/lib/strapi/site-pages";
import { buildAboutTabs } from "@/lib/about-tabs";
import { createMetadata } from "@/lib/seo/metadata";
import { getRequestLocale } from "@/lib/i18n/request";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const homepage = await getHomepage(locale);
  return createMetadata({
    title: "360° Sport & Entertainment",
    description: homepage.heroDescription,
    path: "/",
    image: homepage.heroImage?.url,
    seo: homepage.seo,
    locale,
    isFallback: homepage.localization?.isFallback,
  });
}

export default async function HomePage() {
  const locale = await getRequestLocale();
  // Fetched server-side from Strapi; each service falls back to mock data.
  const [
    homepage,
    businesses,
    articles,
    timelineItems,
    leadershipPeople,
    reportPages,
  ] = await Promise.all([
    getHomepage(locale),
    getEcosystemBusinesses(locale),
    getNewsArticles({ limit: 3, locale }),
    getTimelineItems(locale),
    getLeadershipPeople(locale),
    Promise.all([
      getGatewaySitePageByPath("/about/annual-report", locale),
      getGatewaySitePageByPath("/about/sustainability-report", locale),
    ]),
  ]);
  const aboutTabs = buildAboutTabs(
    timelineItems,
    leadershipPeople,
    reportPages.filter((page) => page !== null),
  );

  return (
    <>
      <Hero content={homepage} />
      <AboutPreview content={homepage} tabs={aboutTabs} />
      <EcosystemSection businesses={businesses} />
      <NewsPreview articles={articles} />
      <TicketHubCta />
      <NewsletterSection />
    </>
  );
}
