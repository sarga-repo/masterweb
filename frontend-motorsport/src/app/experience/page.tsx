import type { Metadata } from "next";
import Image from "next/image";
import { LocaleLink as Link } from "@/components/i18n/locale-link";

import {
  ExperiencePillarCard,
  MotorsportPageInformationBand,
  PageComingSoon,
  PageHero,
  PageShell,
  SectionHeader,
} from "@/components";
import { fetchSitePage } from "@/lib/cms-data";
import { getRequestLocale } from "@/lib/i18n/request";
import {
  isCmsCanonicalSectionVisible,
  isCmsPageVisible,
  isCmsSectionVisible,
} from "@/lib/cms-visibility";
import { createMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const page = await fetchSitePage("custom", "/experience", locale);
  return createMetadata({
    title: page?.title ?? "Experience",
    description:
      page?.heroDescription ??
      "Sarga Motorsport is more than racing - it's a 360° experience of professional competition, lifestyle culture, media coverage, and community energy.",
    path: "/experience",
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

const PILLARS: Array<{
  index: string;
  title: string;
  description: string;
  accent: "crimson" | "orange" | "yellow" | "teal" | "blue";
  href?: string;
}> = [
  {
    index: "01",
    title: "Professional car racing",
    description:
      "Touring, GT, and formula disciplines. Elite drivers, world-class machinery, international competition standards, and the pursuit of the perfect lap.",
    accent: "crimson" as const,
  },
  {
    index: "02",
    title: "Professional motorcycle racing",
    description:
      "Superbike, Moto2, and grassroots two-wheel programs. Precision, bravery, and the purest expression of speed on two wheels.",
    accent: "orange" as const,
  },
  {
    index: "03",
    title: "Lifestyle festival",
    description:
      "Music stages, street food, art installations, and community gatherings. The race weekend extends far beyond the pit wall into a full sensory event.",
    accent: "yellow" as const,
  },
  {
    index: "04",
    title: "Fan & community experience",
    description:
      "Pit walks, meet-and-greets, simulators, fan zones, and VIP paddock access. Every supporter gets closer to the action they love.",
    accent: "teal" as const,
  },
  {
    index: "05",
    title: "Media & broadcast",
    description:
      "Livestream, race reports, photography, rider profiles, and behind-the-scenes storytelling. The feed never stops - 365 days of motorsport coverage.",
    accent: "blue" as const,
  },
  {
    index: "06",
    title: "Venue & circuit experience",
    description:
      "Track days, corporate events, driving experiences, and venue hire. The circuit as a premium destination beyond race weekends.",
    accent: "crimson" as const,
  },
];

export default async function ExperiencePage() {
  const locale = await getRequestLocale();
  const page = await fetchSitePage("custom", "/experience", locale);
  const pillars = page?.sections.find(
    (section) => section.sectionKey === "experience-pillars",
  );
  const track = page?.sections.find(
    (section) => section.sectionKey === "experience-track",
  );
  const cmsPillars =
    pillars?.items
      ?.filter((item) => item.isActive !== false && item.title)
      .map((item, index) => ({
        index: item.label || String(index + 1).padStart(2, "0"),
        title: item.title as string,
        description: item.description || "",
        accent: item.accent || "crimson",
        href: item.href,
      })) ?? [];
  const pillarItems = cmsPillars.length ? cmsPillars : PILLARS;
  const cmsTrackItems =
    track?.items
      ?.filter((item) => item.isActive !== false && item.media)
      .map((item, index) => ({
        src: item.media?.url as string,
        alt: item.mediaAlt || item.media?.alternativeText || item.title || "",
        label: item.label || item.title || `Track / ${index + 1}`,
      })) ?? [];
  const trackItems = cmsTrackItems.length
    ? cmsTrackItems
    : [
        {
          src: "/media/sarga-motorsport-discipline-touring-daylight.jpg",
          alt: "Touring race car competing in warm daylight",
          label: "Four wheels / Touring",
        },
        {
          src: "/media/sarga-motorsport-discipline-motorcycle-daylight.jpg",
          alt: "Motorcycle racers leaning through a circuit corner",
          label: "Two wheels / Road racing",
        },
      ];
  const finalCta = page?.sections.find(
    (section) => section.sectionKey === "experience-final-cta",
  );
  const pageAvailable = isCmsPageVisible(page?.pageAvailability);
  const finalCtaHref = finalCta?.ctaUrl?.startsWith("/")
    ? finalCta.ctaUrl
    : "/events";

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
                kicker={
                  page?.hero?.eyebrow ??
                  page?.navigationLabel ??
                  "Beyond the finish line"
                }
                kickerColor="orange"
                title={page?.hero?.title ?? page?.heroTitle ?? "Experience"}
                showKicker={page?.hero?.showEyebrow}
                showTitle={page?.hero?.showTitle}
                showDescription={page?.hero?.showDescription}
                showMedia={page?.hero?.showMedia}
                backgroundImage={
                  page?.heroImage ||
                  "/media/hero/sarga-motorsport-hero-paddock-ready.jpg"
                }
                backgroundAlt={
                  page?.heroImageAlt ||
                  "Driver and race crew preparing together in a warm daylight paddock"
                }
                accent="teal"
                accentPosition="bottom-right"
                speedLines
                grain
                surface="heat"
                description={
                  page?.heroDescription ||
                  "Sarga Motorsport is more than what happens on track. It's a festival, a broadcast, a fan community, and a premium venue experience - all converging into Indonesia's most ambitious motorsport platform."
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
                  eyebrow: "Experience control / Complete race weekend",
                  title: "Competition is the core. Access completes it.",
                  description:
                    "Six connected chapters carry the audience from racing and rider development into culture, coverage, community, and venue experiences.",
                  metrics: [
                    { label: "Competition", value: "Car + Moto" },
                    { label: "Chapters", value: "06" },
                    { label: "Coverage", value: "Always on" },
                  ],
                }}
              />
            </div>
          ) : null}
          {isCmsSectionVisible(pillars) ? (
            <section
              data-cms-section-key="experience-pillars"
              data-cms-enabled="true"
              className="ms-reflected-light-surface ms-section"
            >
              <div className="ms-shell">
                <SectionHeader
                  index={pillars?.indexLabel ?? "PILLARS"}
                  showIndex={pillars?.showIndex}
                  showEyebrow={pillars?.showEyebrow}
                  showTitle={pillars?.showTitle}
                  showDescription={pillars?.showBody}
                  eyebrow={pillars?.eyebrow ?? "The complete ecosystem"}
                  title={
                    pillars?.title ??
                    "Racing is the core. The rest is the culture."
                  }
                  description={
                    pillars?.body ??
                    "From professional four-wheel and two-wheel competition to lifestyle festivals and always-on media coverage, every dimension gets the stage it deserves."
                  }
                />
                <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
                  {pillarItems.map((pillar, index) => (
                    <ExperiencePillarCard
                      key={pillar.index}
                      index={pillar.index}
                      title={pillar.title}
                      description={pillar.description}
                      accent={pillar.accent}
                      href={pillar.href}
                      className={
                        [
                          "lg:col-span-7",
                          "lg:col-span-5",
                          "lg:col-span-5",
                          "lg:col-span-7",
                          "lg:col-span-7",
                          "lg:col-span-5",
                        ][index]
                      }
                    />
                  ))}
                </div>
              </div>
            </section>
          ) : null}

          {isCmsSectionVisible(track) ? (
            <section
              data-cms-section-key="experience-track"
              data-cms-enabled="true"
              className="ms-blue-heat-surface ms-section"
            >
              <div className="ms-shell">
                <SectionHeader
                  index={track?.indexLabel ?? "TRACK"}
                  showIndex={track?.showIndex}
                  showEyebrow={track?.showEyebrow}
                  showTitle={track?.showTitle}
                  showDescription={track?.showBody}
                  eyebrow={track?.eyebrow ?? "Two forms of precision"}
                  title={
                    track?.title ?? "Four wheels. Two wheels. One standard."
                  }
                  description={
                    track?.body ??
                    "Both programmes share the same commitment to sporting clarity, athlete development, and race-weekend presentation."
                  }
                />
                <div className="mt-14 grid gap-4 md:grid-cols-[1.15fr_.85fr]">
                  {trackItems.map((image) => (
                    <figure
                      key={image.label}
                      className="ms-panel relative aspect-[16/10] overflow-hidden"
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 55vw"
                        className="object-cover"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-[#071a3d]/80 via-transparent to-transparent"
                      />
                      <figcaption className="absolute bottom-6 left-6 ms-kicker text-ms-electric-yellow">
                        {image.label}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </section>
          ) : null}

          {isCmsSectionVisible(finalCta) ? (
            <section
              data-cms-section-key="experience-final-cta"
              data-cms-enabled="true"
              className="ms-reflected-light-surface py-14 sm:py-20"
            >
              <div className="ms-shell grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                <div>
                  {finalCta?.showEyebrow !== false ? (
                    <p className="ms-data-label text-ms-slipstream-teal">
                      {finalCta?.eyebrow ?? "Enter the programme"}
                    </p>
                  ) : null}
                  {finalCta?.showTitle !== false ? (
                    <h2 className="ms-heading-section mt-5 max-w-[15ch]">
                      {finalCta?.title ?? "Find the next race weekend."}
                    </h2>
                  ) : null}
                  {finalCta?.showBody !== false && finalCta?.body ? (
                    <p className="mt-4 max-w-2xl leading-7 text-ms-warm-white/60">
                      {finalCta.body}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-6">
                  {finalCta?.showCta !== false ? (
                    <Link
                      href={finalCtaHref}
                      target={
                        finalCta?.ctaTarget === "newWindow"
                          ? "_blank"
                          : undefined
                      }
                      rel={
                        finalCta?.ctaTarget === "newWindow"
                          ? "noreferrer"
                          : undefined
                      }
                      className="border-b border-ms-electric-yellow/55 pb-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-electric-yellow"
                    >
                      {finalCta?.ctaLabel ?? "Explore events"}
                    </Link>
                  ) : null}
                  {finalCta?.showCta !== false ? (
                    <Link
                      href={
                        finalCta?.secondaryCtaUrl?.startsWith("/")
                          ? finalCta.secondaryCtaUrl
                          : "/contact"
                      }
                      target={
                        finalCta?.secondaryCtaTarget === "newWindow"
                          ? "_blank"
                          : undefined
                      }
                      rel={
                        finalCta?.secondaryCtaTarget === "newWindow"
                          ? "noreferrer"
                          : undefined
                      }
                      className="border-b border-ms-slipstream-teal/55 pb-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-slipstream-teal"
                    >
                      {finalCta?.secondaryCtaLabel ?? "Experience inquiries"}
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
