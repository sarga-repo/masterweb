import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EditorialHeading } from "@/components/sections/editorial-heading";
import { EcosystemCard } from "@/components/sections/ecosystem-card";
import { InteriorHero } from "@/components/sections/interior-hero";
import { ArrowRightIcon } from "@/components/ui/icons";
import { ecosystemPillars } from "@/lib/mock-data";
import { dedicatedSiteLabel, resolveContentUrl } from "@/lib/cross-site";
import {
  getEcosystemBusinessBySlug,
  getEcosystemBusinesses,
} from "@/lib/strapi/ecosystem";
import { getEvents } from "@/lib/strapi/events";
import { getNewsArticles } from "@/lib/strapi/news";
import { createMetadata } from "@/lib/seo/metadata";

type BusinessPageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const businesses = await getEcosystemBusinesses();
  return businesses.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BusinessPageProps): Promise<Metadata> {
  const { slug } = await params;
  const business = await getEcosystemBusinessBySlug(slug);
  return createMetadata({
    title: business?.name ?? "Business not found",
    description: business?.shortDescription ?? "Sarga ecosystem business.",
    path: `/ecosystem/${slug}`,
    image: business?.heroImage?.url ?? business?.cardImage?.url,
    seo: business?.seo,
  });
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const { slug } = await params;
  const [business, ecosystemBusinesses, networkArticles, networkEvents] =
    await Promise.all([
      getEcosystemBusinessBySlug(slug),
      getEcosystemBusinesses(),
      getNewsArticles({ limit: 4 }),
      getEvents(),
    ]);
  if (!business) notFound();

  const pillar = ecosystemPillars.find((item) => item.id === business.pillar);
  const related = ecosystemBusinesses
    .filter((item) => item.slug !== business.slug && item.status !== "hidden")
    .slice(0, 2);
  const highlights = business.highlights?.length
    ? business.highlights
    : [
        {
          label: "Governance",
          title: "Shared operating standards",
          description:
            "Central governance and specialist execution keep every Sarga property accountable and adaptable.",
        },
        {
          label: "Commercial",
          title: "Connected partnerships",
          description:
            "Group-wide commercial capability links each discipline to sponsors, venues, media, and audiences.",
        },
        {
          label: "Audience",
          title: "One intelligence layer",
          description:
            "Shared audience insight strengthens programming, distribution, and the live experience.",
        },
      ];
  const gallery = business.gallery?.length
    ? business.gallery
    : [business.heroImage, business.cardImage].filter(
        (image) => image !== undefined,
      );
  const relatedArticles = business.relatedArticles?.length
    ? business.relatedArticles
    : networkArticles.slice(0, 2);
  const relatedEvents = business.relatedEvents?.length
    ? business.relatedEvents
    : networkEvents.slice(0, 1);

  return (
    <>
      <InteriorHero
        index={String(business.order).padStart(2, "0")}
        eyebrow={`${pillar?.label ?? "Ecosystem"} venture`}
        title={business.name}
        description={business.shortDescription}
        image={business.heroImage ?? business.cardImage}
        brandLogo={business.brandLogo}
        meta={[
          `Pillar - ${pillar?.label ?? business.pillar}`,
          `Status - ${business.status === "active" ? "Active" : "Coming soon"}`,
        ]}
      />

      <section className="gateway-surface-light-signature bg-sarga-light py-20 sm:py-28 lg:py-36">
        <div className="site-container grid gap-12 lg:grid-cols-[0.65fr_1.35fr]">
          <div className="flex flex-col items-start gap-6">
            {business.brandLogoDark ?? business.brandLogo ? (
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
            <h2 className="max-w-[15ch] font-heading text-[clamp(2.8rem,10vw,3.2rem)] font-bold uppercase leading-[0.9] tracking-[-0.04em] sm:text-[clamp(2.8rem,3.35vw,3.85rem)]">
              Built to move its category forward.
            </h2>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-sarga-text-muted">
              {business.overview ?? business.shortDescription} As part of Sarga,
              the venture gains access to shared governance, commercial
              partnerships, media capability, and audience infrastructure.
            </p>
            {business.status === "active" && business.ctaUrl ? (
              <Link
                href={business.ctaUrl}
                className="group mt-10 inline-flex items-center gap-4 border-b border-sarga-black pb-2 text-xs font-extrabold uppercase tracking-[0.16em]"
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

      <section className="bg-sarga-black py-20 text-white sm:py-28 lg:py-36">
        <div className="site-container">
          <EditorialHeading
            index="02"
            eyebrow="Operating advantages"
            title="Specialist focus. Group-scale support."
            description="The venture operates with its own category authority while drawing strength from Sarga's shared platform."
            light
          />
          <ol className="mt-16 grid gap-px bg-white/15 lg:grid-cols-3">
            {highlights.map((highlight, index) => (
              <li key={highlight.title} className="bg-sarga-black p-8 sm:p-10">
                <div className="flex items-center justify-between text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-white/40">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span className="text-sarga-red">
                    {highlight.label ?? "Advantage"}
                  </span>
                </div>
                <h3 className="mt-16 font-heading text-3xl font-bold uppercase leading-[0.92] tracking-[-0.04em]">
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
        <section className="gateway-surface-light-signature gateway-surface-light-signature--left bg-white py-20 sm:py-28 lg:py-36">
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
                  <h3 className="mt-3 font-heading text-2xl font-bold uppercase leading-[0.95] tracking-[-0.035em]">
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
                  <h3 className="mt-3 font-heading text-2xl font-bold uppercase leading-[0.95] tracking-[-0.035em]">
                    {event.title}
                  </h3>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="gateway-surface-light-signature gateway-surface-light-signature--left bg-white py-20 sm:py-28 lg:py-36">
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
            <h2 className="mt-4 max-w-[15ch] font-heading text-4xl font-bold uppercase leading-[0.92] tracking-[-0.04em] sm:text-[2.5rem]">
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
