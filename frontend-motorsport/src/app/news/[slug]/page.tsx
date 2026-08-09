import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { GradientRule, InformationBand, PageShell } from "@/components";
import { ArrowRightIcon, ArrowUpRightIcon } from "@/components/ui/icons";
import { ResilientImage } from "@/components/ui/resilient-image";
import { fetchArticleBySlug, fetchArticles } from "@/lib/cms-data";
import {
  resolveSiteUrl,
  resolveSocialImageUrl,
  siteConfig,
} from "@/lib/site-config";
import type { MotorsportArticle } from "@/types/design-system";

type Props = { params: Promise<{ slug: string }> };

/* Placeholder articles shown when CMS is unreachable. */
const PLACEHOLDER_MAP: Record<string, MotorsportArticle & { body?: string }> = {
  "the-line-between-control-and-chaos": {
    title: "The line between control and chaos",
    href: "/news/the-line-between-control-and-chaos",
    image: "/media/hero/sarga-motorsport-hero-circuit-golden-hour.jpg",
    imageAlt: "Red touring race car accelerating through a tropical circuit",
    category: "Race Report",
    publishedLabel: "02 Jul 2026",
    excerpt:
      "Inside the cockpit of Sarga's opening race weekend - a masterclass in pressure, precision, and the fine art of going fast.",
    body: `The 2026 Sarga Motorsport season opened with a weekend that will be remembered as a masterclass in controlled aggression. From the first rolling start to the final checkered flag, the line between brilliance and disaster was razor-thin - and every driver on the grid knew it.\n\nThe touring car field delivered a spectacle of close-quarters racing that left fans breathless. Door-to-door battles through the mid-pack, strategic pit windows, and a late-race safety car that reshuffled the order entirely. The winner, emerging from the chaos with a margin of just 1.2 seconds, called it "the most intense forty minutes of my career."\n\nOff the track, the fan zones buzzed with energy. Meet-and-greets with riders, simulator challenges, and the first unveiling of the Sarga lifestyle village set the tone for a season that promises to be unlike anything Indonesian motorsport has seen before. This is not just racing - it is a cultural moment.`,
  },
  "riders-rewrite-the-racing-line": {
    title: "Riders rewrite the racing line",
    href: "/news/riders-rewrite-the-racing-line",
    image: "/media/sarga-motorsport-discipline-motorcycle-daylight.jpg",
    imageAlt: "Superbike race pack cornering on a tropical circuit",
    category: "Motorcycle Racing",
    publishedLabel: "28 Jun 2026",
    excerpt:
      "How Indonesia's fastest riders are reshaping the sport - one apex at a time.",
    body: `There is a quiet revolution happening in Indonesian motorcycle racing, and it is being led by a generation of riders who refuse to accept the old limits. At Mandalika and Sentul alike, superbike and Moto2 competitors are rewriting the racing line itself.\n\nWhat was once considered the optimal braking point is now where the overtakes begin. What was once a safe margin is now the gap riders attempt to close. The result: racing that is closer, faster, and more unpredictable than at any point in the sport's history in this region.\n\nThe Sarga Motorcycle Series has become the proving ground for this new philosophy. Riders are arriving better prepared, with deeper technical understanding and a willingness to push beyond convention. For fans, it means every race weekend brings something unprecedented. For the sport, it signals that Indonesian motorcycle racing has entered a new era.`,
  },
  "building-the-360-racing-ecosystem": {
    title: "Building the 360° racing ecosystem",
    href: "/news/building-the-360-racing-ecosystem",
    image: "/media/hero/sarga-motorsport-hero-paddock-ready.jpg",
    imageAlt: "Race crew preparing a touring car in a warm daylight paddock",
    category: "Feature",
    publishedLabel: "15 Jun 2026",
    excerpt:
      "From track to grandstand to livestream - how Sarga is engineering an entire motorsport experience.",
    body: `Sarga Motorsport was never conceived as just a racing team. From the earliest planning stages, the vision was broader: a 360-degree motorsport ecosystem that encompasses competition, community, culture, and commerce.\n\nThe track experience is the core. Professional-grade events across touring car, GT, superbike, and Moto2 disciplines - run to international standards with local soul. But surrounding that core is a layered experience: festival weekends with live music and food villages, fan zones with pit walks and simulators, and a broadcast operation that delivers every session to screens across the archipelago.\n\nThe partnership programme completes the circle. Brands that share Sarga's commitment to excellence gain access to a premium platform for activation, hospitality, and storytelling. Every touchpoint - from the paddock to the pixel - is designed to be world-class. This is motorsport as a total experience, and it is being built right here in Indonesia.`,
  },
  "paddock-pass-behind-the-pit-wall": {
    title: "Paddock pass: behind the pit wall",
    href: "/news/paddock-pass-behind-the-pit-wall",
    image: "/media/sarga-motorsport-discipline-endurance-daylight.jpg",
    imageAlt: "Endurance prototype racing through a tropical circuit",
    category: "Lifestyle",
    publishedLabel: "10 Jun 2026",
    excerpt:
      "A rare look at the mechanics, engineers, and unsung heroes who make every race weekend possible.",
    body: `For every moment of on-track glory, there are hundreds of unseen hours behind the pit wall. The mechanics who rebuild gearboxes at 2am. The data engineers who analyse telemetry through the night. The logistics teams who move tonnes of equipment across islands between rounds.\n\nThis is the story of the paddock's unsung heroes - the people who make professional motorsport possible in Indonesia. Without them, the drivers and riders could not compete. Without their precision, their dedication, and their quiet expertise, the spectacle simply does not happen.\n\nSarga Motorsport is committed to celebrating this side of the sport. From paddock tours and behind-the-scenes content to technical features that demystify the engineering, the goal is to bring fans closer to every layer of the operation. Because the real story of racing is never just what happens on the track.`,
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
    `${resolved.title} - Sarga Motorsport news and editorial.`;
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
  const [cmsArticle, cmsArticles] = await Promise.all([
    fetchArticleBySlug(slug),
    fetchArticles(6),
  ]);
  const article = cmsArticle ?? PLACEHOLDER_MAP[slug] ?? null;
  if (!article) notFound();
  const fallbackArticles = Object.values(PLACEHOLDER_MAP);
  const relatedArticles = (
    cmsArticles.length > 0 ? cmsArticles : fallbackArticles
  )
    .filter((candidate) => candidate.href !== article.href)
    .slice(0, 3);
  const readingMinutes = Math.max(
    1,
    Math.ceil((article.body?.split(/\s+/).length ?? 180) / 210),
  );

  return (
    <PageShell>
      <section className="ms-editorial-intro">
        <div className="ms-shell py-18 sm:py-24">
          <div className="flex flex-wrap gap-x-5 gap-y-3">
            <span className="ms-data-label text-ms-crimson-700">
              {article.category}
            </span>
            <time className="ms-data-label text-ms-ink-500">
              {article.publishedLabel}
            </time>
          </div>
          <h1 className="ms-heading-article mt-8 max-w-[18ch] text-ms-draftline-blue">
            {article.title}
          </h1>
          {article.excerpt ? (
            <p className="mt-8 max-w-3xl border-l-2 border-ms-apex-crimson pl-6 text-xl leading-8 text-ms-ink-700 sm:text-2xl sm:leading-9">
              {article.excerpt}
            </p>
          ) : null}
        </div>
      </section>

      <GradientRule />

      <section className="ms-editorial-canvas">
        <div className="ms-shell py-10 sm:py-14">
          <figure className="relative aspect-[16/10] overflow-hidden bg-ms-cream-200 sm:aspect-[21/9]">
            <ResilientImage
              src={article.image}
              alt={article.imageAlt}
              fallbackSrc="/media/hero/sarga-motorsport-hero-circuit-golden-hour.jpg"
              fallbackAlt="Red touring race car on a warm daylight circuit"
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
            <figcaption className="absolute bottom-0 left-0 bg-ms-warm-white px-5 py-3 text-ms-charcoal sm:px-7">
              <span className="ms-data-label text-ms-orange-800">
                Sarga Motorsport editorial
              </span>
            </figcaption>
          </figure>
        </div>
      </section>

      <article className="ms-editorial-canvas pb-20 pt-8 sm:pb-28 sm:pt-12">
        <div className="ms-shell grid gap-14 lg:grid-cols-[minmax(0,45rem)_minmax(15rem,1fr)] lg:justify-between lg:gap-24">
          <div className="space-y-7 text-[1.05rem] leading-8 text-ms-ink-700">
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

          <aside className="self-start border-t border-ms-charcoal/18 pt-6 lg:sticky lg:top-28">
            <p className="ms-data-label text-ms-crimson-700">Story file</p>
            <dl className="mt-6 border-b border-ms-charcoal/18">
              {[
                ["Published", article.publishedLabel],
                ["Category", article.category],
                ["Read time", `${readingMinutes} min`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="border-t border-ms-charcoal/18 py-4"
                >
                  <dt className="ms-data-label text-ms-ink-500">{label}</dt>
                  <dd className="mt-2 text-sm font-bold text-ms-charcoal">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
            <Link
              href="/news"
              className="group mt-7 inline-flex items-center gap-3 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-draftline-blue"
            >
              <ArrowRightIcon className="size-4 rotate-180 transition-transform group-hover:-translate-x-1" />
              All news
            </Link>
          </aside>
        </div>
      </article>

      <InformationBand
        eyebrow="Editorial note / Sarga Motorsport"
        title="Competition makes the moment. Editorial keeps it moving."
        description={article.excerpt}
        items={[
          { label: "Category", value: article.category },
          { label: "Published", value: article.publishedLabel },
          { label: "Reading", value: `${readingMinutes} min` },
        ]}
      />

      {relatedArticles.length > 0 ? (
        <section className="ms-editorial-muted ms-section">
          <div className="ms-shell">
            <div className="flex flex-col gap-5 border-t border-ms-charcoal/18 pt-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="ms-kicker text-ms-orange-800">Continue reading</p>
                <h2 className="ms-heading-section mt-5 text-ms-charcoal">
                  Related stories.
                </h2>
              </div>
              <Link
                href="/news"
                className="text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-draftline-blue"
              >
                Full archive →
              </Link>
            </div>
            <div className="mt-10 border-b border-ms-charcoal/18">
              {relatedArticles.map((related, index) => (
                <article
                  key={related.href}
                  className="group grid gap-5 border-t border-ms-charcoal/18 py-6 sm:grid-cols-[3rem_10rem_minmax(0,1fr)_auto] sm:items-center"
                >
                  <span className="ms-tabular hidden font-display text-xl text-ms-ink-500 sm:block">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <Link
                    href={related.href}
                    className="relative aspect-[16/10] overflow-hidden bg-ms-cream-200"
                  >
                    <ResilientImage
                      src={related.image}
                      alt={related.imageAlt}
                      fallbackSrc="/media/hero/sarga-motorsport-hero-paddock-ready.jpg"
                      fallbackAlt="Sarga Motorsport paddock in warm daylight"
                      fill
                      sizes="10rem"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                    />
                  </Link>
                  <div>
                    <p className="ms-data-label text-ms-crimson-700">
                      {related.category} / {related.publishedLabel}
                    </p>
                    <h3 className="ms-heading-card mt-3 text-ms-charcoal">
                      <Link href={related.href}>{related.title}</Link>
                    </h3>
                  </div>
                  <Link
                    href={related.href}
                    aria-label={`Read ${related.title}`}
                    className="grid size-11 place-items-center border border-ms-charcoal/18 text-ms-draftline-blue transition-colors hover:bg-ms-apex-crimson hover:text-ms-warm-white"
                  >
                    <ArrowUpRightIcon className="size-4" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </PageShell>
  );
}
