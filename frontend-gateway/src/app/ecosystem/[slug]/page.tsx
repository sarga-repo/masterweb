import type { Metadata } from "next";
import Image from "next/image";
import { LocaleLink as Link } from "@/components/i18n/locale-link";
import { notFound, redirect } from "next/navigation";
import { ComingSoonPage } from "@/components/sections/coming-soon-page";
import { EditorialHeading } from "@/components/sections/editorial-heading";
import { EcosystemCard } from "@/components/sections/ecosystem-card";
import { InteriorHero } from "@/components/sections/interior-hero";
import { ArrowRightIcon } from "@/components/ui/icons";
import { ecosystemPillars } from "@/lib/mock-data";
import {
  businessSiteUrl,
  dedicatedSiteLabel,
  resolveContentUrl,
  safeBusinessCtaUrl,
} from "@/lib/cross-site";
import {
  getEcosystemBusinessBySlug,
  getEcosystemBusinesses,
  isDedicatedSiteBusiness,
  isEcosystemBusinessPageLive,
} from "@/lib/strapi/ecosystem";
import { createMetadata } from "@/lib/seo/metadata";
import { getRequestLocale } from "@/lib/i18n/request";

type BusinessPageProps = { params: Promise<{ slug: string }> };

const venturePresentation: Record<
  string,
  {
    accent: "venue" | "media" | "technology";
    proposition: string;
    capabilityTitle: string;
    capabilityClass: string;
  }
> = {
  "sarga-venues": {
    accent: "venue",
    proposition: "Places engineered for performance and belonging.",
    capabilityTitle: "Operational precision. Human-scale hospitality.",
    capabilityClass:
      "bg-[radial-gradient(circle_at_16%_80%,rgba(226,50,30,.34),transparent_28%),linear-gradient(125deg,#311722_0%,#713225_55%,#aa5a35_100%)]",
  },
  "sarga-media": {
    accent: "media",
    proposition: "Every moment deserves a wider signal.",
    capabilityTitle: "Editorial authority. Broadcast-grade delivery.",
    capabilityClass:
      "bg-[radial-gradient(circle_at_18%_82%,rgba(226,50,30,.26),transparent_28%),linear-gradient(125deg,#17263d_0%,#3d526b_56%,#714039_100%)]",
  },
  "sarga-tech": {
    accent: "technology",
    proposition: "The system behind seamless participation.",
    capabilityTitle: "Connected data. Frictionless access.",
    capabilityClass:
      "bg-[radial-gradient(circle_at_18%_82%,rgba(0,196,204,.26),transparent_28%),linear-gradient(125deg,#102830_0%,#28535a_58%,#74402d_100%)]",
  },
};

export async function generateStaticParams() {
  const businesses = await getEcosystemBusinesses("en");
  return businesses.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BusinessPageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const business = await getEcosystemBusinessBySlug(slug, locale);
  const metadata = createMetadata({
    title: business?.name ?? "Business not found",
    description: business?.shortDescription ?? "Sarga ecosystem business.",
    path: `/ecosystem/${slug}`,
    image: business?.heroImage?.url ?? business?.cardImage?.url,
    seo: business?.seo,
    locale,
    isFallback: business?.localization?.isFallback ?? locale === "id",
  });
  const shouldNoIndex =
    !business ||
    business.status === "hidden" ||
    isDedicatedSiteBusiness(business) ||
    (!isEcosystemBusinessPageLive(business) &&
      business.pageAvailability?.noIndexWhileDisabled !== false);
  if (shouldNoIndex) {
    metadata.robots = { index: false, follow: true };
  }
  return metadata;
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const business = await getEcosystemBusinessBySlug(slug, locale);
  if (!business || business.status === "hidden") notFound();

  if (isDedicatedSiteBusiness(business)) {
    const dedicatedUrl = businessSiteUrl(
      business.slug,
      business.dedicatedSiteUrl,
    );
    if (dedicatedUrl) redirect(dedicatedUrl);
    return (
      <ComingSoonPage
        name={business.name}
        description={`${business.name} is served by a dedicated Sarga website. Its deployment URL is not configured in this environment.`}
        availability={{
          pageEnabled: false,
          comingSoonEyebrow: `${business.name} / Dedicated website`,
          comingSoonTitle: "The dedicated site is being connected.",
          showNotifyCta: false,
          noIndexWhileDisabled: true,
        }}
        accent="default"
      />
    );
  }

  if (!isEcosystemBusinessPageLive(business)) {
    return (
      <ComingSoonPage
        name={business.name}
        description={business.shortDescription}
        availability={business.pageAvailability}
        accent={venturePresentation[business.slug]?.accent ?? "default"}
      />
    );
  }

  const ecosystemBusinesses = await getEcosystemBusinesses();

  const pillar = ecosystemPillars.find((item) => item.id === business.pillar);
  const related = ecosystemBusinesses
    .filter((item) => item.slug !== business.slug && item.status !== "hidden")
    .slice(0, 2);
  const presentation = venturePresentation[business.slug] ?? {
    accent: "media" as const,
    proposition: "Built to move its category forward.",
    capabilityTitle: "Specialist focus. Group-scale support.",
    capabilityClass:
      "bg-[linear-gradient(125deg,#17263d_0%,#3d526b_58%,#713f39_100%)]",
  };
  const highlights = business.highlights ?? [];
  const gallery = business.gallery?.length
    ? business.gallery
    : [business.heroImage, business.cardImage].filter(
        (image) => image !== undefined,
      );
  const relatedArticles = business.relatedArticles ?? [];
  const relatedEvents = business.relatedEvents ?? [];
  const ctaUrl = safeBusinessCtaUrl(business.ctaUrl);

  return (
    <>
      <InteriorHero
        index={String(business.order).padStart(2, "0")}
        eyebrow={`${pillar?.label ?? "Ecosystem"} venture`}
        title={business.name}
        description={business.shortDescription}
        image={business.heroImage ?? business.cardImage}
        brandLogo={business.brandLogo}
        tone={presentation.accent === "venue" ? "red" : "slate"}
        meta={[`Pillar - ${pillar?.label ?? business.pillar}`, "Status - Live"]}
      />

      <section className="gateway-warm-panel py-20 sm:py-28 lg:py-36">
        <div className="site-container grid gap-12 lg:grid-cols-[0.65fr_1.35fr]">
          <div className="flex flex-col items-start gap-6">
            {(business.brandLogoDark ?? business.brandLogo) ? (
              <div className="w-[8rem] sm:w-[10rem]">
                <Image
                  src={(business.brandLogoDark ?? business.brandLogo)!.url}
                  alt={(business.brandLogoDark ?? business.brandLogo)!.alt}
                  width={200}
                  height={100}
                  className="h-auto w-full object-contain"
                />
              </div>
            ) : null}
            <div className="flex items-start gap-4 text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-sarga-text/45">
              <span className="text-sarga-red">Overview</span>
              <span className="mt-2 h-px flex-1 bg-sarga-black/20" />
            </div>
          </div>
          <div>
            <h2 className="gateway-section-title max-w-[15ch] font-heading uppercase">
              {presentation.proposition}
            </h2>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-sarga-text-muted">
              {business.overview ?? business.shortDescription} As part of Sarga,
              the venture gains access to shared governance, commercial
              partnerships, media capability, and audience infrastructure.
            </p>
            {ctaUrl ? (
              <Link
                href={ctaUrl}
                className="group mt-10 inline-flex items-center gap-4 border-b border-sarga-black pb-2 text-xs font-extrabold uppercase tracking-[0.16em]"
                {...(ctaUrl.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {business.ctaLabel}
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <p className="mt-10 inline-flex border border-sarga-black/20 px-5 py-4 text-xs font-extrabold uppercase tracking-[0.16em] text-sarga-text/55">
                Detailed launch information in preparation
              </p>
            )}
          </div>
        </div>
      </section>

      <section
        className={`${presentation.capabilityClass} py-20 text-white sm:py-28 lg:py-36`}
      >
        <div className="site-container">
          <EditorialHeading
            index="02"
            eyebrow="Operating advantages"
            title={presentation.capabilityTitle}
            description="CMS-managed capabilities explain how this venture combines category authority with Sarga's shared operating platform."
            light
          />
          <ol className="mt-16 grid gap-px bg-white/20 lg:grid-cols-3">
            {highlights.map((highlight, index) => (
              <li
                key={highlight.title}
                className="bg-[rgba(16,20,27,.72)] p-8 backdrop-blur-sm sm:p-10"
              >
                <div className="flex items-center justify-between text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-white/40">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span className="text-sarga-red">
                    {highlight.label ?? "Advantage"}
                  </span>
                </div>
                <h3 className="gateway-card-title mt-16 font-heading uppercase">
                  {highlight.title}
                </h3>
                <p className="mt-5 text-sm leading-7 text-white/55">
                  {highlight.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {gallery.length ? (
        <section className="gateway-warm-panel py-20 sm:py-28 lg:py-36">
          <div className="site-container">
            <EditorialHeading
              index="03"
              eyebrow="In motion"
              title="The discipline, seen from inside."
              description="A living media field prepared for CMS-managed photography and campaign footage."
            />
            <div className="mt-16 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
              {gallery.slice(0, 2).map((image, index) => (
                <figure
                  key={`${image.url}-${index}`}
                  className={`relative overflow-hidden bg-sarga-black ${
                    index === 0
                      ? "min-h-[24rem] lg:min-h-[40rem]"
                      : "min-h-[28rem] lg:min-h-[40rem]"
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    sizes={
                      index === 0
                        ? "(min-width: 1024px) 65vw, 100vw"
                        : "(min-width: 1024px) 32vw, 100vw"
                    }
                    className="object-cover"
                  />
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {relatedArticles.length || relatedEvents.length ? (
        <section className="gateway-surface-light-signature bg-sarga-light py-20 sm:py-28 lg:py-36">
          <div className="site-container">
            <EditorialHeading
              index="04"
              eyebrow="Related signals"
              title="Stories and moments around the venture."
              description="Attached CMS relationships take priority; broader network content keeps the page useful while a venture library is growing."
            />
            <div className="mt-16 grid gap-6 lg:grid-cols-3">
              {relatedArticles.map((article) => {
                const { href, isExternal } = resolveContentUrl({
                  slug: article.slug,
                  contentType: "news",
                  siteScope: article.siteScope,
                });
                return (
                  <Link
                    key={article.slug}
                    href={href}
                    className="group border-t border-sarga-black/20 pt-5"
                    {...(isExternal
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    <div className="relative aspect-[3/2] overflow-hidden bg-sarga-black">
                      {article.coverImage ? (
                        <Image
                          src={article.coverImage.url}
                          alt={article.coverImage.alt}
                          fill
                          sizes="(min-width: 1024px) 33vw, 100vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      ) : null}
                    </div>
                    <p className="mt-5 text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-sarga-red">
                      {article.category.replace("-", " ")}
                    </p>
                    <h3 className="gateway-card-title mt-3 font-heading uppercase">
                      {article.title}
                    </h3>
                  </Link>
                );
              })}
              {relatedEvents.map((event) => {
                const { href, isExternal } = resolveContentUrl({
                  slug: event.slug,
                  contentType: "events",
                  siteScope: event.siteScope,
                });
                return (
                  <Link
                    key={event.slug}
                    href={href}
                    className="group border-t border-sarga-black/20 pt-5"
                    {...(isExternal
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    <div className="relative aspect-[3/2] overflow-hidden bg-sarga-black">
                      {event.coverImage ? (
                        <Image
                          src={event.coverImage.url}
                          alt={event.coverImage.alt}
                          fill
                          sizes="(min-width: 1024px) 33vw, 100vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      ) : null}
                    </div>
                    <p className="mt-5 text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-sarga-red">
                      {isExternal
                        ? `On the ${dedicatedSiteLabel(event.siteScope)}`
                        : "Live event"}
                    </p>
                    <h3 className="gateway-card-title mt-3 font-heading uppercase">
                      {event.title}
                    </h3>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      <section className="gateway-warm-panel py-20 sm:py-28 lg:py-36">
        <div className="site-container">
          <EditorialHeading
            index="Next"
            eyebrow="Continue exploring"
            title="The network is the advantage."
            description="Move laterally across Sarga's connected portfolio and see how each discipline strengthens the next."
          />
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {related.map((item) => (
              <EcosystemCard key={item.slug} business={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="gateway-surface-accent-signature bg-sarga-red py-16 text-white sm:py-20">
        <div className="site-container grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-white/65">
              Continue the journey
            </p>
            <h2 className="gateway-section-title mt-4 max-w-[15ch] font-heading uppercase">
              Enter the live calendar or start a partnership.
            </h2>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/ticket-hub"
              className="inline-flex items-center justify-center gap-4 bg-white px-6 py-5 text-xs font-extrabold uppercase tracking-[0.16em] text-sarga-red"
            >
              Ticket Hub
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-4 border border-white/60 px-6 py-5 text-xs font-extrabold uppercase tracking-[0.16em]"
            >
              Start a conversation
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
