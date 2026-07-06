import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/forms/contact-form";
import { EditorialHeading } from "@/components/sections/editorial-heading";
import { InteriorHero } from "@/components/sections/interior-hero";
import { ArrowRightIcon } from "@/components/ui/icons";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "Get in Touch",
  description:
    "Start a partnership, media, event, or corporate conversation with Sarga.",
  path: "/contact",
});

const inquiryPaths = [
  [
    "01",
    "Partnerships",
    "Brand alliances, sponsorship, venue collaboration, and ecosystem opportunities.",
  ],
  [
    "02",
    "Media desk",
    "Press information, interview requests, accreditation, and publication inquiries.",
  ],
  [
    "03",
    "Events",
    "Organizer coordination, hospitality, event access, and ticketing-partner questions.",
  ],
  [
    "04",
    "Corporate",
    "Governance, investor-facing information, careers, and general group inquiries.",
  ],
] as const;

export default function ContactPage() {
  return (
    <>
      <InteriorHero
        index="06"
        eyebrow="Open a conversation"
        title="Start with the right signal."
        description="Choose the route that best fits your inquiry. Sarga's group desk will direct approved requests to the right operating team."
        meta={["Partnerships", "Media", "Events", "Corporate"]}
      />

      <section className="gateway-surface-light-signature bg-white py-20 sm:py-28 lg:py-36">
        <div className="site-container">
          <EditorialHeading
            index="01"
            eyebrow="Inquiry map"
            title="A direct route into the network."
            description="Choose the closest route below, then give the group desk enough context to connect you with the right operating team."
          />
          <div className="mt-16 border-t border-sarga-black">
            {inquiryPaths.map(([index, title, description]) => (
              <div
                key={index}
                className="group grid gap-5 border-b border-sarga-black/20 py-8 sm:grid-cols-[5rem_0.8fr_1.2fr_auto] sm:items-center lg:py-10"
              >
                <span className="font-heading text-2xl font-bold text-sarga-red">
                  {index}
                </span>
                <h2 className="font-heading text-3xl font-bold uppercase tracking-[-0.04em]">
                  {title}
                </h2>
                <p className="max-w-xl text-sm leading-7 text-sarga-text-muted">
                  {description}
                </p>
                <ArrowRightIcon className="hidden h-5 w-5 transition-transform group-hover:translate-x-1 sm:block" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="gateway-surface-light-signature gateway-surface-light-signature--left bg-sarga-light py-20 sm:py-28 lg:py-36">
        <div className="site-container grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div>
            <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-sarga-red">
              02 / Inquiry form
            </p>
            <h2 className="mt-5 max-w-[12ch] font-heading text-4xl font-bold uppercase leading-[0.92] tracking-[-0.04em] sm:text-[2.5rem]">
              Context moves conversations faster.
            </h2>
            <p className="mt-7 max-w-lg text-sm leading-7 text-sarga-text-muted">
              Required fields are marked. Submissions are validated on the
              server before being routed to Strapi or the configured delivery
              service.
            </p>
          </div>
          <div className="border-t border-sarga-black pt-8">
            <ContactForm />
          </div>
        </div>
      </section>

      <section className="bg-sarga-black py-20 text-white sm:py-28 lg:py-36">
        <div className="site-container grid gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <h2 className="max-w-full break-words font-heading text-[clamp(2.1rem,9.5vw,3rem)] font-bold uppercase leading-[0.88] tracking-[-0.045em] sm:max-w-[13ch] sm:text-[clamp(3rem,4.4vw,4.8rem)]">
            The next move begins with context.
          </h2>
          <div>
            <p className="text-base leading-8 text-white/62">
              Every inquiry is validated server-side and routed by inquiry type.
              No third-party embed or unapproved client script has been
              introduced.
            </p>
            <Link
              href="/about"
              className="group mt-9 inline-flex items-center gap-4 border-b border-white pb-2 text-xs font-extrabold uppercase tracking-[0.16em]"
            >
              Understand the group
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
