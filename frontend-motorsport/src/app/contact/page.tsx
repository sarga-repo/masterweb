import { LocaleLink as Link } from "@/components/i18n/locale-link";

import {
  InformationBand,
  PageHero,
  PageShell,
  SectionHeader,
} from "@/components";
import { MotorsportContactForm } from "@/components/sections/motorsport-contact-form";

export default function ContactPage() {
  return (
    <PageShell spectrumSeparators>
      <PageHero
        kicker="Get in touch"
        kickerColor="orange"
        title="Contact"
        backgroundImage="/media/hero/sarga-motorsport-hero-paddock-ready.jpg"
        backgroundAlt="Sarga Motorsport driver and paddock team preparing in warm daylight"
        accent="teal"
        accentPosition="bottom-left"
        grain
        speedLines
        surface="heat"
        description="Partnership proposals, media requests, ticket support, or a question about Sarga Motorsport. We read every message."
      />

      <InformationBand
        eyebrow="Inquiry control / Direct routing"
        title="One form. The right team."
        description="Choose the closest inquiry type and the message is routed to the Motorsport team responsible for it."
        items={[
          { label: "Channels", value: "07" },
          { label: "Accounts", value: "None" },
          { label: "Reply", value: "Email" },
        ]}
      />

      <section className="ms-reflected-light-surface ms-section">
        <div className="ms-shell">
          <div className="grid gap-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
            <div>
              <SectionHeader
                eyebrow="Inquiry form"
                title="Send a signal."
                align="left"
              />
              <MotorsportContactForm />
            </div>

            <aside className="ms-blue-panel ms-panel self-start p-8">
              <span className="ms-data-label text-ms-warm-white/42">
                Race control
              </span>
              <div className="mt-8 space-y-6">
                {[
                  ["General", "hello@sarga.co"],
                  ["Partnerships", "partners@sarga.co"],
                  ["Media", "media@sarga.co"],
                  ["Ticket support", "tickets@sarga.co"],
                ].map(([label, email]) => (
                  <div key={label}>
                    <h3 className="ms-kicker text-ms-ignition-orange">
                      {label}
                    </h3>
                    <p className="mt-2 text-sm text-ms-warm-white/60">
                      <a
                        className="hover:text-ms-electric-yellow"
                        href={`mailto:${email}`}
                      >
                        {email}
                      </a>
                    </p>
                  </div>
                ))}
                <div>
                  <h3 className="ms-kicker text-ms-ignition-orange">
                    Talent programme
                  </h3>
                  <p className="mt-2 text-sm text-ms-warm-white/60">
                    Select IJTC / Become Riders in the form.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="ms-blue-heat-surface py-12 sm:py-16">
        <div className="ms-shell grid gap-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div>
            <p className="ms-data-label text-ms-slipstream-teal">
              Race-day route
            </p>
            <h2 className="ms-heading-feature mt-4 max-w-[18ch]">
              Looking for an event or ticket answer?
            </h2>
          </div>
          <div className="flex flex-wrap gap-6">
            <Link
              href="/events"
              className="border-b border-ms-electric-yellow/55 pb-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-electric-yellow"
            >
              Browse events
            </Link>
            <Link
              href="/tickets"
              className="border-b border-ms-slipstream-teal/55 pb-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-slipstream-teal"
            >
              Ticket support
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
