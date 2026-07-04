import type { Metadata } from "next";
import Link from "next/link";
import { EditorialHeading } from "@/components/sections/editorial-heading";
import { InteriorHero } from "@/components/sections/interior-hero";
import { ArrowRightIcon } from "@/components/ui/icons";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "Careers",
  description:
    "Build the next generation of sport and entertainment with Sarga.",
  path: "/careers",
});

const disciplines = [
  [
    "01",
    "Sport operations",
    "Competition delivery, athlete services, sporting regulation, and performance programs.",
  ],
  [
    "02",
    "Venue & experience",
    "Track operations, hospitality, guest experience, safety, and event production.",
  ],
  [
    "03",
    "Media & creative",
    "Broadcast, editorial, brand systems, content production, and commercial storytelling.",
  ],
  [
    "04",
    "Technology & group",
    "Product, data, partnerships, finance, governance, and shared corporate operations.",
  ],
] as const;

export default function CareersPage() {
  return (
    <>
      <InteriorHero
        index="05"
        eyebrow="Join the network"
        title="Build what the crowd remembers."
        description="Sarga brings together operators, creators, engineers, and sporting specialists who want to shape experiences at national scale."
        image={{
          url: "/assets/media/sarga-motorsport-concept.png",
          alt: "Motorsport team environment at a modern racing circuit",
        }}
        meta={[
          "Cross-disciplinary teams",
          "Indonesia",
          "Performance culture",
          "Open roster in preparation",
        ]}
      />

      <section className="gateway-surface-light-signature bg-sarga-light py-20 sm:py-28 lg:py-36">
        <div className="site-container">
          <EditorialHeading
            index="01"
            eyebrow="Where you can move"
            title="Many disciplines. One standard."
            description="We build teams around expertise, accountability, and the willingness to move across conventional category lines."
          />
          <ol className="mt-16 grid border-l border-t border-sarga-black/20 sm:grid-cols-2">
            {disciplines.map(([index, title, description]) => (
              <li
                key={index}
                className="min-h-[20rem] border-b border-r border-sarga-black/20 p-7 sm:p-10"
              >
                <span className="font-heading text-2xl font-black text-sarga-red">
                  {index}
                </span>
                <h3 className="mt-16 font-heading text-3xl font-black uppercase leading-[0.94] tracking-[-0.03em]">
                  {title}
                </h3>
                <p className="mt-6 max-w-md text-sm leading-7 text-sarga-text-muted">
                  {description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="gateway-surface-accent-signature gateway-surface-accent-signature--left bg-sarga-red py-20 text-white sm:py-28 lg:py-36">
        <div className="site-container grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <h2 className="max-w-full break-words font-heading text-[clamp(2.1rem,9.5vw,3rem)] font-black uppercase leading-[0.88] tracking-[-0.045em] sm:max-w-[14ch] sm:text-[clamp(3rem,4.4vw,4.8rem)]">
            No generic applications. Make your intent count.
          </h2>
          <div>
            <p className="text-base leading-8 text-white/72">
              The official opportunity roster and approved recruitment links
              will appear here when roles are opened. Until then, partnership
              and talent inquiries can begin through the contact desk.
            </p>
            <Link
              href="/contact"
              className="group mt-9 inline-flex items-center gap-4 border-b border-white pb-2 text-xs font-extrabold uppercase tracking-[0.16em]"
            >
              Contact the group
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
