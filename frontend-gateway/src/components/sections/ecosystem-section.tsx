import Link from "next/link";
import { PillTabs, type PillTab } from "@/components/ui/pill-tabs";
import { EcosystemCard } from "@/components/sections/ecosystem-card";
import { ArrowRightIcon } from "@/components/ui/icons";
import { ecosystemIntro, ecosystemPillars } from "@/lib/mock-data";
import type { EcosystemBusiness } from "@/lib/strapi/types";

export function EcosystemSection({
  businesses,
}: {
  businesses: EcosystemBusiness[];
}) {
  const tabs: PillTab[] = ecosystemPillars.map((pillar) => {
    const pillarBusinesses = businesses
      .filter((business) => business.pillar === pillar.id)
      .sort((a, b) => a.order - b.order);

    return {
      id: pillar.id,
      label: pillar.label,
      content: (
        <div>
          <div className="grid gap-6 border-b border-white/15 pb-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <h3 className="font-heading text-3xl font-bold uppercase leading-[0.92] tracking-[-0.03em] text-white sm:text-[2.4rem]">
              {pillar.headline}
            </h3>
            <p className="max-w-2xl text-sm leading-6 text-white/58 sm:text-base sm:leading-7 lg:justify-self-end">
              {pillar.blurb}
            </p>
          </div>
          {pillarBusinesses.length ? (
            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              {pillarBusinesses.map((business) => (
                <EcosystemCard key={business.slug} business={business} />
              ))}
            </div>
          ) : (
            <div className="mt-8 border border-white/15 px-6 py-16 text-center text-sm uppercase tracking-[0.16em] text-white/50">
              Portfolio announcements in preparation
            </div>
          )}
        </div>
      ),
    };
  });

  return (
    <section
      id="ecosystem"
      className="relative isolate overflow-hidden bg-sarga-black py-20 text-white sm:py-28 lg:py-36"
    >
      <span
        aria-hidden="true"
        className="velocity-grain absolute inset-0 -z-20"
      />
      <span
        aria-hidden="true"
        className="gateway-dark-halo absolute -right-[16rem] top-[8%] -z-10 h-[36rem] w-[36rem] rounded-full"
      />
      <span
        aria-hidden="true"
        className="gateway-signal-line absolute inset-x-0 top-0 -z-10"
      />

      <div className="site-container">
        <div className="flex items-center gap-4 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-white/48">
          <span className="text-sarga-orange">03</span>
          <span className="h-px w-12 bg-sarga-orange" />
          <span>{ecosystemIntro.eyebrow}</span>
        </div>

        <div className="mt-10 grid gap-10 xl:grid-cols-[minmax(0,1.45fr)_minmax(22rem,0.75fr)] xl:items-end">
          <h2 className="min-w-0 font-heading font-bold uppercase leading-[0.72] tracking-[-0.07em]">
            <span className="block text-[clamp(3.8rem,12vw,4.5rem)] text-sarga-red sm:text-[clamp(3.8rem,5vw,5.2rem)]">
              360°
            </span>
            <span className="block text-[clamp(2.1rem,10vw,4rem)] lg:text-[3.75rem] xl:text-[clamp(3.75rem,4.5vw,4.8rem)]">
              Ecosystem
            </span>
          </h2>
          <div className="min-w-0 xl:pb-1">
            <p className="max-w-xl text-base leading-7 text-white/65 sm:text-lg sm:leading-8">
              {ecosystemIntro.description}
            </p>
            <Link
              href="/ecosystem"
              className="group mt-8 inline-flex items-center gap-4 text-[0.65rem] font-extrabold uppercase tracking-[0.16em] text-white"
            >
              View the full network
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </div>
        </div>

        <PillTabs
          tabs={tabs}
          tone="dark"
          className="mt-16 [&_[role=tablist]]:rounded-none [&_[role=tablist]]:border-x-0 [&_[role=tablist]]:border-t-0 [&_[role=tablist]]:bg-transparent [&_[role=tablist]]:p-0 [&_[role=tab]]:flex-1 [&_[role=tab]]:rounded-none [&_[role=tab]]:border-b-2 [&_[role=tab]]:border-transparent [&_[role=tab]]:bg-transparent [&_[role=tab]]:py-4 [&_[aria-selected=true]]:border-sarga-red [&_[aria-selected=true]]:bg-transparent [&_[aria-selected=true]]:text-white"
          aria-label="Ecosystem pillars"
        />
      </div>
    </section>
  );
}
