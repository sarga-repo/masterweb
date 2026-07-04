import { Hero } from "@/components/sections/hero";
import { AboutPreview } from "@/components/sections/about-preview";
import { EcosystemSection } from "@/components/sections/ecosystem-section";
import { NewsPreview } from "@/components/sections/news-preview";
import { TicketHubCta } from "@/components/sections/ticket-hub-cta";
import { NewsletterSection } from "@/components/sections/newsletter-section";
import { getHomepage } from "@/lib/strapi/homepage";
import { getEcosystemBusinesses } from "@/lib/strapi/ecosystem";
import { getNewsArticles } from "@/lib/strapi/news";
import { createMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const homepage = await getHomepage();
  return createMetadata({
    title: "360° Sport & Entertainment",
    description: homepage.heroDescription,
    path: "/",
    image: homepage.heroImage?.url,
    seo: homepage.seo,
  });
}

export default async function HomePage() {
  // Fetched server-side from Strapi; each service falls back to mock data.
  const [homepage, businesses, articles] = await Promise.all([
    getHomepage(),
    getEcosystemBusinesses(),
    getNewsArticles({ limit: 3 }),
  ]);

  return (
    <>
      <Hero content={homepage} />
      <AboutPreview content={homepage} />
      <EcosystemSection businesses={businesses} />
      <NewsPreview articles={articles} />
      <TicketHubCta />
      <NewsletterSection />
    </>
  );
}
import type { Metadata } from "next";
