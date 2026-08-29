import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/i18n/locale-link";

import {
  MotorsportPageInformationBand,
  PageComingSoon,
  PageHero,
  PageShell,
  SectionHeader,
} from "@/components";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { ResilientImage } from "@/components/ui/resilient-image";
import { fetchPartners, fetchSitePage } from "@/lib/cms-data";
import type { PartnerItem } from "@/types/design-system";
import { getRequestLocale } from "@/lib/i18n/request";
import { isStrapiPreviewEnabled } from "@/lib/strapi/client";
import {
  isCmsCanonicalSectionVisible,
  isCmsPageVisible,
  isCmsSectionVisible,
} from "@/lib/cms-visibility";
import { createMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const page = await fetchSitePage("custom", "/partners", locale);
  return createMetadata({
    title: page?.title ?? "Partners",
    description:
      page?.heroDescription ??
      "Official partners and sponsors of Sarga Motorsport - the brands fuelling Indonesia's premier racing ecosystem.",
    path: "/partners",
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

const PLACEHOLDER: PartnerItem[] = [
  {
    name: "Sarga Motorsport",
    logo: "/brand/logo-sarga-motorsport-symbol-sport.png",
  },
  {
    name: "Sarga - parent group",
    logo: "/brand/logo-sarga-motorsport-part-of-sarga.png",
    href: "https://sarga.co",
  },
  {
    name: "Sarga Motorsport wordmark",
    logo: "/brand/logo-sarga-motorsport-symbol-sport.png",
  },
];

export default async function PartnersPage() {
  const locale = await getRequestLocale();
  const [page, cmsPartners] = await Promise.all([
    fetchSitePage("custom", "/partners", locale),
    fetchPartners(20, locale),
  ]);
  const isPreview = await isStrapiPreviewEnabled();
  const network = page?.sections.find(
    (section) => section.sectionKey === "partner-network",
  );
  const finalCta = page?.sections.find(
    (section) => section.sectionKey === "partners-final-cta",
  );
  const pageAvailable = isCmsPageVisible(page?.pageAvailability);
  const finalCtaHref = finalCta?.ctaUrl?.startsWith("/")
    ? finalCta.ctaUrl
    : "/contact";
  const partners =
    isPreview || cmsPartners.length > 0 ? cmsPartners : PLACEHOLDER;

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
                  "Official partners & sponsors"
                }
                kickerColor="orange"
                title={page?.hero?.title ?? page?.heroTitle ?? "Partners"}
                showKicker={page?.hero?.showEyebrow}
                showTitle={page?.hero?.showTitle}
                showDescription={page?.hero?.showDescription}
                showMedia={page?.hero?.showMedia}
                backgroundImage={
                  page?.heroImage ||
                  "/media/hero/sarga-motorsport-hero-circuit-golden-hour.jpg"
                }
                backgroundAlt={
                  page?.heroImageAlt ||
                  "Sarga Motorsport circuit and grandstand in warm golden-hour light"
                }
                accent="blue"
                accentPosition="bottom-right"
                grain
                speedLines
                surface="heat"
                description={
                  page?.heroDescription ??
                  "The brands and organisations fuelling the Sarga Motorsport ecosystem. Together we build the stage for Indonesia's most ambitious racing platform."
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
                  eyebrow: "Partner control / Shared platform",
                  title: "One grid. Shared ambition.",
                  description:
                    "The partner network supports competition, event delivery, audience experience, and long-term talent development.",
                  metrics: [
                    {
                      label: "Network",
                      value: String(partners.length).padStart(2, "0"),
                    },
                    { label: "Scope", value: "Motorsport" },
                    { label: "Inquiries", value: "Open" },
                  ],
                }}
              />
            </div>
          ) : null}

          {isCmsSectionVisible(network) ? (
            <section
              data-cms-section-key="partner-network"
              data-cms-enabled="true"
              className="ms-reflected-light-surface ms-section"
            >
              <div className="ms-shell">
                <SectionHeader
                  index={network?.indexLabel ?? "NETWORK"}
                  showIndex={network?.showIndex}
                  showEyebrow={network?.showEyebrow}
                  showTitle={network?.showTitle}
                  showDescription={network?.showBody}
                  eyebrow={network?.eyebrow ?? "Official partners"}
                  title={network?.title ?? "The grid."}
                  description={
                    network?.body ??
                    "Published partner records come from the shared CMS and remain scoped to the Motorsport site."
                  }
                />
                <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {partners.map((partner, index) => {
                    const content = (
                      <>
                        <span className="absolute left-6 top-6 font-display text-lg text-ms-warm-white/24">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <ResilientImage
                          src={partner.logo}
                          alt={partner.name}
                          fallbackSrc="/brand/logo-sarga-motorsport-symbol-sport.png"
                          fallbackAlt="Sarga Motorsport"
                          width={220}
                          height={100}
                          className="max-h-16 w-auto max-w-[11rem] object-contain brightness-0 invert opacity-70 transition duration-300 group-hover:opacity-100"
                        />
                        <span className="ms-data-label text-center text-ms-warm-white/56">
                          {partner.name}
                        </span>
                        {partner.href ? (
                          <span className="inline-flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-ms-slipstream-teal">
                            Visit <ArrowUpRightIcon className="size-3.5" />
                          </span>
                        ) : (
                          <span className="ms-data-label text-ms-electric-yellow">
                            Official network
                          </span>
                        )}
                      </>
                    );

                    const className =
                      "group relative flex min-h-[18rem] flex-col items-center justify-center gap-7 border border-ms-warm-white/14 bg-[linear-gradient(135deg,rgba(7,26,61,.94),rgba(30,38,74,.9))] p-10 transition-colors hover:border-ms-slipstream-teal/55";

                    return partner.href ? (
                      <a
                        key={partner.name}
                        href={partner.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={className}
                      >
                        {content}
                      </a>
                    ) : (
                      <article key={partner.name} className={className}>
                        {content}
                      </article>
                    );
                  })}
                </div>
              </div>
            </section>
          ) : null}

          {isCmsSectionVisible(finalCta) ? (
            <section
              data-cms-section-key="partners-final-cta"
              data-cms-enabled="true"
              className="ms-blue-heat-surface py-16 sm:py-20"
            >
              <div className="ms-shell grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                <div>
                  {finalCta?.showEyebrow !== false ? (
                    <span className="ms-data-label text-ms-slipstream-teal">
                      {finalCta?.eyebrow ?? "Partnership inquiries"}
                    </span>
                  ) : null}
                  {finalCta?.showTitle !== false ? (
                    <h2 className="ms-heading-section mt-6 max-w-[12ch]">
                      {finalCta?.title ?? "Join the grid."}
                    </h2>
                  ) : null}
                  {finalCta?.showBody !== false ? (
                    <p className="mt-6 max-w-xl text-base leading-7 text-ms-warm-white/64">
                      {finalCta?.body ??
                        "We work with brands that share our commitment to performance, responsible event delivery, and meaningful community access."}
                    </p>
                  ) : null}
                </div>
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
                    className="group inline-flex h-(--ms-control-height) items-center gap-3 bg-ms-apex-crimson px-8 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-warm-white transition-colors hover:bg-ms-ignition-orange"
                  >
                    {finalCta?.ctaLabel ?? "Partnership inquiry"}
                    <ArrowUpRightIcon className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                ) : null}
              </div>
            </section>
          ) : null}
        </>
      )}
    </PageShell>
  );
}
