import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo/metadata";

import { PageHero, SectionHeader, ContactForm } from "@/components";
import {
  MailIcon,
  PinIcon,
  TicketIcon,
  RosetteIcon,
} from "@/components/ui/hs-icons";
import { siteConfig } from "@/lib/site-config";
import { getRequestLocale } from "@/lib/i18n/request";
import { fetchHorseSportPage } from "@/lib/cms-content";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return createMetadata({
    title: "Contact",
    description:
      "Reach Sarga Horse Sport for ticketing, partnership, sponsorship, media, and general inquiries.",
    path: "/contact",
    locale,
  });
}

const CHANNELS = [
  {
    label: "General & media",
    value: "Use the form - select your inquiry type",
    Icon: MailIcon,
  },
  {
    label: "Ticketing",
    value: "Tickets are sold via approved partners",
    Icon: TicketIcon,
  },
  {
    label: "Partnerships",
    value: "Tailored proposals for brands & sponsors",
    Icon: RosetteIcon,
  },
  { label: "Based in", value: "Indonesia", Icon: PinIcon },
];

export default async function ContactPage() {
  const page = await fetchHorseSportPage("/contact");
  const intro = page?.sections.find((section) => section.sectionKey === "intro");
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={page?.heroTitle ?? "Let's talk."}
        description={page?.heroDescription ?? "Ticketing, partnership, sponsorship, media, or general - reach the Sarga Horse Sport team."}
        accent="red"
      />

      <section className="hs-section hs-shell">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <SectionHeader
              index="01"
              eyebrow={intro?.eyebrow ?? "Get in touch"}
              title={intro?.title ?? "One team, every inquiry."}
              description={intro?.body ?? "Send us a message and we'll route it to the right team. For tickets, head to our approved partner platforms via the tickets page."}
            />
            <dl className="mt-10 grid gap-5 sm:grid-cols-2">
              {CHANNELS.map((c) => (
                <div
                  key={c.label}
                  className="hs-card-glass flex items-start gap-4 p-5"
                >
                  <c.Icon className="mt-0.5 size-6 shrink-0 text-hs-orange" />
                  <div>
                    <dt className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-hs-cream/45">
                      {c.label}
                    </dt>
                    <dd className="mt-1 text-sm text-hs-cream/80">{c.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
            <p className="mt-8 text-sm text-hs-cream/50">
              Part of the Sarga ecosystem -{" "}
              <a
                href={siteConfig.gatewayUrl}
                className="text-hs-orange hover:underline"
              >
                Sarga.co
              </a>
              .
            </p>
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  );
}
