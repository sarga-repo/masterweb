import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/i18n/locale-link";

import {
  InformationBand,
  PageHero,
  PageShell,
  SectionHeader,
} from "@/components";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { ResilientImage } from "@/components/ui/resilient-image";
import { fetchPartners, fetchSitePage } from "@/lib/cms-data";
import type { PartnerItem } from "@/types/design-system";

export const metadata: Metadata = {
  title: "Partners",
  description:
    "Official partners and sponsors of Sarga Motorsport - the brands fuelling Indonesia's premier racing ecosystem.",
};

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
  const [page, cmsPartners] = await Promise.all([fetchSitePage("custom", "/partners"), fetchPartners()]);
  const control = page?.sections.find((section) => section.sectionKey === "partner-control");
  const network = page?.sections.find((section) => section.sectionKey === "partner-network");
  const partners = cmsPartners.length > 0 ? cmsPartners : PLACEHOLDER;

  return (
    <PageShell spectrumSeparators>
      <PageHero
         kicker={page?.navigationLabel ?? "Official partners & sponsors"}
        kickerColor="orange"
         title={page?.heroTitle ?? "Partners"}
        backgroundImage="/media/hero/sarga-motorsport-hero-circuit-golden-hour.jpg"
        backgroundAlt="Sarga Motorsport circuit and grandstand in warm golden-hour light"
        accent="blue"
        accentPosition="bottom-right"
        grain
        speedLines
        surface="heat"
         description={page?.heroDescription ?? "The brands and organisations fuelling the Sarga Motorsport ecosystem. Together we build the stage for Indonesia's most ambitious racing platform."}
      />

      <InformationBand
         eyebrow={control?.eyebrow ?? "Partner control / Shared platform"}
         title={control?.title ?? "One grid. Shared ambition."}
         description={control?.body ?? "The partner network supports competition, event delivery, audience experience, and long-term talent development."}
        items={[
          { label: "Network", value: String(partners.length).padStart(2, "0") },
          { label: "Scope", value: "Motorsport" },
          { label: "Inquiries", value: "Open" },
        ]}
      />

      <section className="ms-reflected-light-surface ms-section">
        <div className="ms-shell">
          <SectionHeader
            index="NETWORK"
             eyebrow={network?.eyebrow ?? "Official partners"}
             title={network?.title ?? "The grid."}
             description={network?.body ?? "Published partner records come from the shared CMS and remain scoped to the Motorsport site."}
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

      <section className="ms-blue-heat-surface py-16 sm:py-20">
        <div className="ms-shell grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <span className="ms-data-label text-ms-slipstream-teal">
              Partnership inquiries
            </span>
            <h2 className="ms-heading-section mt-6 max-w-[12ch]">
              Join the grid.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-ms-warm-white/64">
              We work with brands that share our commitment to performance,
              responsible event delivery, and meaningful community access.
            </p>
          </div>
          <Link
            href="/contact"
            className="group inline-flex h-(--ms-control-height) items-center gap-3 bg-ms-apex-crimson px-8 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-warm-white transition-colors hover:bg-ms-ignition-orange"
          >
            Partnership inquiry
            <ArrowUpRightIcon className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
