import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { GradientRule, PageShell } from "@/components";
import { ArrowRightIcon } from "@/components/ui/icons";
import { fetchArticleBySlug } from "@/lib/cms-data";
import { resolveSiteUrl, resolveSocialImageUrl, siteConfig } from "@/lib/site-config";
import type { MotorsportArticle } from "@/types/design-system";

type Props = { params: Promise<{ slug: string }> };

/* Placeholder articles shown when CMS is unreachable. */
const PLACEHOLDER_MAP: Record<string, MotorsportArticle & { body?: string }> = {
  "the-line-between-control-and-chaos": {
    title: "The line between control and chaos",
    href: "/news/the-line-between-control-and-chaos",
    image: "/media/motorsport-design-hero.png",
    imageAlt: "Race car throwing sparks at high speed",
    category: "Race Report",
    publishedLabel: "02 Jul 2026",
    excerpt:
      "Inside the cockpit of Sarga's opening race weekend — a masterclass in pressure, precision, and the fine art of going fast.",
    body: `The 2026 Sarga Motorsport season opened with a weekend that will be remembered as a masterclass in controlled aggression. From the first rolling start to the final checkered flag, the line between brilliance and disaster was razor-thin — and every driver on the grid knew it.\n\nThe touring car field delivered a spectacle of close-quarters racing that left fans breathless. Door-to-door battles through the mid-pack, strategic pit windows, and a late-race safety car that reshuffled the order entirely. The winner, emerging from the chaos with a margin of just 1.2 seconds, called it "the most intense forty minutes of my career."\n\nOff the track, the fan zones buzzed with energy. Meet-and-greets with riders, simulator challenges, and the first unveiling of the Sarga lifestyle village set the tone for a season that promises to be unlike anything Indonesian motorsport has seen before. This is not just racing — it is a cultural moment.`,
  },
  "riders-rewrite-the-racing-line": {
    title: "Riders rewrite the racing line",
    href: "/news/riders-rewrite-the-racing-line",
    image: "/media/motorcycle-racing-dusk.png",
    imageAlt: "Superbike race pack cornering under circuit lights",
    category: "Motorcycle Racing",
    publishedLabel: "28 Jun 2026",
    excerpt:
      "How Indonesia's fastest riders are reshaping the sport — one apex at a time.",
    body: `There is a quiet revolution happening in Indonesian motorcycle racing, and it is being led by a generation of riders who refuse to accept the old limits. At Mandalika and Sentul alike, superbike and Moto2 competitors are rewriting the racing line itself.\n\nWhat was once considered the optimal braking point is now where the overtakes begin. What was once a safe margin is now the gap riders attempt to close. The result: racing that is closer, faster, and more unpredictable than at any point in the sport's history in this region.\n\nThe Sarga Motorcycle Series has become the proving ground for this new philosophy. Riders are arriving better prepared, with deeper technical understanding and a willingness to push beyond convention. For fans, it means every race weekend brings something unprecedented. For the sport, it signals that Indonesian motorcycle racing has entered a new era.`,
  },
  "building-the-360-racing-ecosystem": {
    title: "Building the 360° racing ecosystem",
    href: "/news/building-the-360-racing-ecosystem",
    image: "/media/motorsport-design-card.png",
    imageAlt: "Aerial view of a motorsport circuit and festival grounds",
    category: "Feature",
    publishedLabel: "15 Jun 2026",
    excerpt:
      "From track to grandstand to livestream — how Sarga is engineering an entire motorsport experience.",
    body: `Sarga Motorsport was never conceived as just a racing team. From the earliest planning stages, the vision was broader: a 360-degree motorsport ecosystem that encompasses competition, community, culture, and commerce.\n\nThe track experience is the core. Professional-grade events across touring car, GT, superbike, and Moto2 disciplines — run to international standards with local soul. But surrounding that core is a layered experience: festival weekends with live music and food villages, fan zones with pit walks and simulators, and a broadcast operation that delivers every session to screens across the archipelago.\n\nThe partnership programme completes the circle. Brands that share Sarga's commitment to excellence gain access to a premium platform for activation, hospitality, and storytelling. Every touchpoint — from the paddock to the pixel — is designed to be world-class. This is motorsport as a total experience, and it is being built right here in Indonesia.`,
  },
  "paddock-pass-behind-the-pit-wall": {
    title: "Paddock pass: behind the pit wall",
    href: "/news/paddock-pass-behind-the-pit-wall",
    image: "/media/motorcycle-racing-dusk.png",
    imageAlt: "Pit crew preparing a motorcycle under paddock lights",
    category: "Lifestyle",
    publishedLabel: "10 Jun 2026",
    excerpt:
      "A rare look at the mechanics, engineers, and unsung heroes who make every race weekend possible.",
    body: `For every moment of on-track glory, there are hundreds of unseen hours behind the pit wall. The mechanics who rebuild gearboxes at 2am. The data engineers who analyse telemetry through the night. The logistics teams who move tonnes of equipment across islands between rounds.\n\nThis is the story of the paddock's unsung heroes — the people who make professional motorsport possible in Indonesia. Without them, the drivers and riders could not compete. Without their precision, their dedication, and their quiet expertise, the spectacle simply does not happen.\n\nSarga Motorsport is committed to celebrating this side of the sport. From paddock tours and behind-the-scenes content to technical features that demystify the engineering, the goal is to bring fans closer to every layer of the operation. Because the real story of racing is never just what happens on the track.`,
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);
  const fallback = PLACEHOLDER_MAP[slug];
  const resolved = article ?? fallback;
  if (!resolved) return { title: "Article not found" };
  const desc =
    resolved.excerpt ??
    `${resolved.title} — Sarga Motorsport news and editorial.`;
  const canonical = resolveSiteUrl(`/news/${slug}`);
  const socialImage = resolveSocialImageUrl(resolved.image);
  return {
    title: resolved.title,
    description: desc,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      url: canonical,
      siteName: siteConfig.name,
      title: resolved.title,
      description: desc,
      images: socialImage
        ? [
            {
              url: socialImage,
              alt: resolved.imageAlt,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: resolved.title,
      description: desc,
      images: socialImage ? [socialImage] : undefined,
    },
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const cmsArticle = await fetchArticleBySlug(slug);
  const article = cmsArticle ?? PLACEHOLDER_MAP[slug] ?? null;
  if (!article) notFound();

  return (
    <PageShell>
      {/* Hero image */}
      <section className="relative overflow-hidden bg-ms-black ms-grain">
        <div className="relative aspect-[21/9] min-h-[40vh]">
          <Image
            src={article.image}
            alt={article.imageAlt}
            fill
            priority
            className="object-cover object-center ms-animate-zoom"
            sizes="100vw"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-ms-black via-ms-black/40 to-transparent"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-ms-black/60 via-transparent to-transparent"
          />
          {/* Dot pattern (track grid) */}
          <div aria-hidden="true" className="ms-track-grid absolute inset-0 opacity-25" />
          {/* Speed lines */}
          <div
            aria-hidden="true"
            className="absolute inset-0 overflow-hidden pointer-events-none"
          >
            <div className="ms-speed-line absolute top-[30%] left-0 h-px w-[35%] bg-gradient-to-r from-transparent via-ms-apex-crimson/20 to-transparent" />
            <div className="ms-speed-line-delay-2 absolute top-[65%] left-0 h-px w-[45%] bg-gradient-to-r from-transparent via-ms-electric-yellow/15 to-transparent" />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-px ms-shimmer"
          />
        </div>
      </section>

      <GradientRule />

      {/* Article body */}
      <article className="ms-section ms-shell">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-[0.62rem] font-bold uppercase tracking-[0.17em]">
            <span className="text-ms-ignition-orange">{article.category}</span>
            <time className="text-ms-warm-white/36">
              {article.publishedLabel}
            </time>
          </div>

          <h1 className="ms-display mt-8 text-[clamp(2.25rem,5.25vw,4.5rem)]">
            {article.title}
          </h1>

          {article.excerpt ? (
            <p className="mt-8 border-l-2 border-ms-apex-crimson pl-5 text-xl leading-8 text-ms-warm-white/65">
              {article.excerpt}
            </p>
          ) : null}

          <div className="mt-12 space-y-6 text-base leading-8 text-ms-warm-white/65">
            {article.body ? (
              article.body.split("\n\n").map((para, i) => <p key={i}>{para}</p>)
            ) : (
              <p>
                Full editorial content will be published here once available
                from the Sarga Motorsport editorial team. Check back soon for
                the complete story.
              </p>
            )}
          </div>
        </div>
      </article>

      {/* Back link */}
      <section className="ms-shell border-t border-ms-warm-white/12 py-12">
        <Link
          href="/news"
          className="group inline-flex items-center gap-3 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-warm-white/58 transition-colors hover:text-ms-warm-white"
        >
          <ArrowRightIcon className="size-4 rotate-180 transition-transform group-hover:-translate-x-1" />
          All news
        </Link>
      </section>
    </PageShell>
  );
}
