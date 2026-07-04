import type { Metadata } from "next";

import {
  GradientRule,
  NewsCard,
  PageHero,
  PageShell,
  SectionHeader,
} from "@/components";
import { fetchArticles } from "@/lib/cms-data";
import type { MotorsportArticle } from "@/types/design-system";

export const metadata: Metadata = {
  title: "News",
  description:
    "Race reports, rider profiles, technical deep-dives, and lifestyle features from the Sarga Motorsport editorial team.",
};

const PLACEHOLDER: MotorsportArticle[] = [
  {
    title: "The line between control and chaos",
    href: "/news/the-line-between-control-and-chaos",
    image: "/media/motorsport-design-hero.png",
    imageAlt: "Race car throwing sparks at high speed",
    category: "Race Report",
    publishedLabel: "02 Jul 2026",
    excerpt:
      "Inside the cockpit of Sarga's opening race weekend — a masterclass in pressure, precision, and the fine art of going fast.",
  },
  {
    title: "Riders rewrite the racing line",
    href: "/news/riders-rewrite-the-racing-line",
    image: "/media/motorcycle-racing-dusk.png",
    imageAlt: "Superbike race pack cornering under circuit lights",
    category: "Motorcycle Racing",
    publishedLabel: "28 Jun 2026",
    excerpt:
      "How Indonesia's fastest riders are reshaping the sport — one apex at a time.",
  },
  {
    title: "Building the 360° racing ecosystem",
    href: "/news/building-the-360-racing-ecosystem",
    image: "/media/motorsport-design-card.png",
    imageAlt: "Aerial view of a motorsport circuit and festival grounds",
    category: "Feature",
    publishedLabel: "15 Jun 2026",
    excerpt:
      "From track to grandstand to livestream — how Sarga is engineering an entire motorsport experience.",
  },
  {
    title: "Paddock pass: behind the pit wall",
    href: "/news/paddock-pass-behind-the-pit-wall",
    image: "/media/motorcycle-racing-dusk.png",
    imageAlt: "Pit crew preparing a motorcycle under paddock lights",
    category: "Lifestyle",
    publishedLabel: "10 Jun 2026",
    excerpt:
      "A rare look at the mechanics, engineers, and unsung heroes who make every race weekend possible.",
  },
];

export default async function NewsPage() {
  const cmsArticles = await fetchArticles();
  const articles = cmsArticles.length > 0 ? cmsArticles : PLACEHOLDER;

  const [featured, ...rest] = articles;

  return (
    <PageShell>
      <PageHero
        kicker="Editorial feed"
        kickerColor="orange"
        title="News"
        accent="yellow"
        accentPosition="top-left"
        speedLines
        grain
        description="Race reports, rider profiles, technical deep-dives, and lifestyle features — curated by the Sarga Motorsport editorial team. Car and motorcycle racing, always in frame."
      />

      <GradientRule />

      {/* Featured + grid */}
      <section className="ms-section ms-shell">
        {featured ? (
          <div className="grid gap-10 lg:grid-cols-[1.6fr_0.8fr]">
            <NewsCard article={featured} feature />
            <div className="flex flex-col gap-10">
              {rest.slice(0, 2).map((a) => (
                <NewsCard key={a.href} article={a} />
              ))}
            </div>
          </div>
        ) : null}
      </section>

      {/* Remaining articles */}
      {rest.length > 2 ? (
        <section className="ms-section ms-shell border-t border-ms-warm-white/12">
          <SectionHeader
            eyebrow="More stories"
            title="The archive."
            align="left"
          />
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {rest.slice(2).map((a) => (
              <NewsCard key={a.href} article={a} />
            ))}
          </div>
        </section>
      ) : null}
    </PageShell>
  );
}
