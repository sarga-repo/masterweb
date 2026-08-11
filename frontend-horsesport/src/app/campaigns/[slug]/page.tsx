import type { Metadata } from "next";

import { PageHero, PagePlaceholder } from "@/components";
import { humanizeSlug } from "@/lib/format";
import { createMetadata } from "@/lib/seo/metadata";
import { getRequestLocale } from "@/lib/i18n/request";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const title = humanizeSlug(slug);
  return createMetadata({
    title,
    description: `${title} - a Sarga Horse Sport campaign.`,
    path: `/campaigns/${slug}`,
    locale,
  });
}

export default async function CampaignDetailPage({ params }: Params) {
  const { slug } = await params;
  const title = humanizeSlug(slug);

  return (
    <>
      <PageHero
        eyebrow="Campaign"
        title={title}
        description="A dedicated Horse Sport campaign landing experience."
        backgroundImage="/media/horse-sport-hero.png"
        backgroundAlt="Jockeys racing across a championship turf track"
        accent="orange"
      />
      <PagePlaceholder
        eyebrow="Campaign"
        title="A focused campaign landing page."
        description="This route will render CMS-managed campaign landing pages - hero, narrative sections, and conversion CTAs - reused across the Sarga ecosystem and branded for Horse Sport."
        sections={[
          "Campaign hero and narrative",
          "Feature and highlight sections",
          "Conversion CTAs",
          "Related events and tickets",
        ]}
        primaryCta={{ label: "Explore events", href: "/events" }}
        secondaryCta={{ label: "Back to home", href: "/" }}
      />
    </>
  );
}
