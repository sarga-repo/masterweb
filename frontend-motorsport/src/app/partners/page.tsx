import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { GradientRule, PageHero, PageShell, SectionHeader } from "@/components";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { fetchPartners } from "@/lib/cms-data";
import type { PartnerItem } from "@/types/design-system";

export const metadata: Metadata = {
  title: "Partners",
  description:
    "Official partners and sponsors of Sarga Motorsport — the brands fuelling Indonesia's premier racing ecosystem.",
};

const PLACEHOLDER: PartnerItem[] = [
  {
    name: "Sarga Motorsport",
    logo: "/brand/logo-sarga-motorsport-symbol-sport.png",
  },
  {
    name: "Sarga — parent group",
    logo: "/brand/logo-sarga-motorsport-part-of-sarga.png",
    href: "https://sarga.co",
  },
  {
    name: "Sarga Motorsport wordmark",
    logo: "/brand/logo-sarga-motorsport-symbol-sport.png",
  },
];

export default async function PartnersPage() {
  const cmsPartners = await fetchPartners();
  const partners = cmsPartners.length > 0 ? cmsPartners : PLACEHOLDER;

  return (
    <PageShell>
      <PageHero
        kicker="Official partners & sponsors"
        kickerColor="orange"
        title="Partners"
        accent="blue"
        accentPosition="bottom-right"
        grain
        description="The brands and organisations fuelling the Sarga Motorsport ecosystem. Together we build the stage for Indonesia's most ambitious racing platform."
      />

      <GradientRule />

      {/* Partners grid */}
      <section className="ms-section ms-shell">
        <SectionHeader
          eyebrow="Partner network"
          title="The grid."
          align="left"
        />
        <div className="mt-14 grid gap-px bg-ms-warm-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="group flex min-h-[16rem] flex-col items-center justify-center gap-6 bg-ms-black p-10 transition-colors hover:bg-ms-graphite"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={200}
                height={90}
                className="max-h-14 w-auto max-w-[10rem] object-contain opacity-60 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
              />
              <span className="ms-data-label text-ms-warm-white/42 text-center">
                {partner.name}
              </span>
              {partner.href ? (
                <a
                  href={partner.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-ms-slipstream-teal transition-colors hover:text-ms-warm-white"
                >
                  Visit <ArrowUpRightIcon className="size-3.5" />
                </a>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      {/* Partnership CTA */}
      <section className="ms-shell border-t border-ms-warm-white/12 py-16">
        <div className="ms-panel bg-ms-black p-10 sm:p-14">
          <span className="ms-data-label text-ms-slipstream-teal">
            Partnership inquiries
          </span>
          <h2 className="ms-display mt-6 max-w-[12ch] text-[clamp(2.5rem,5vw,5rem)]">
            Join the grid.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-ms-warm-white/60">
            Interested in partnering with Sarga Motorsport? We work with brands
            that share our commitment to excellence, performance, and community.
          </p>
          <Link
            href="/contact"
            className="group mt-8 inline-flex items-center gap-3 border-b border-ms-apex-crimson pb-2 text-[0.66rem] font-black uppercase tracking-[0.16em] transition-colors hover:text-ms-ignition-orange"
          >
            Get in touch
            <ArrowUpRightIcon className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
