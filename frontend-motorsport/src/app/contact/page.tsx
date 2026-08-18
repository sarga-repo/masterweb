import { LocaleLink as Link } from "@/components/i18n/locale-link";

import {
  MotorsportPageInformationBand,
  PageComingSoon,
  PageHero,
  PageShell,
  SectionHeader,
} from "@/components";
import { MotorsportContactForm } from "@/components/sections/motorsport-contact-form";
import { fetchSitePage } from "@/lib/cms-data";
import { getRequestLocale } from "@/lib/i18n/request";
import { isCmsPageVisible, isCmsSectionVisible } from "@/lib/cms-visibility";

export default async function ContactPage() {
  const locale = await getRequestLocale();
  const page = await fetchSitePage("custom", "/contact", locale);
  const inquiry = page?.sections.find(
    (section) => section.sectionKey === "inquiry-control",
  );
  const form = page?.sections.find(
    (section) => section.sectionKey === "inquiry-form",
  );
  const finalCta = page?.sections.find(
    (section) => section.sectionKey === "contact-final-cta",
  );
  const pageAvailable = isCmsPageVisible(page?.pageAvailability);
  const finalCtaEventsHref = finalCta?.ctaUrl?.startsWith("/")
    ? finalCta.ctaUrl
    : "/events";
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
                kicker={page?.hero?.eyebrow ?? page?.navigationLabel ?? "Get in touch"}
                kickerColor="orange"
                title={page?.hero?.title ?? page?.heroTitle ?? "Contact"}
                showKicker={page?.hero?.showEyebrow}
                showTitle={page?.hero?.showTitle}
                showDescription={page?.hero?.showDescription}
                showMedia={page?.hero?.showMedia}
                backgroundImage={
                  page?.heroImage ||
                  "/media/hero/sarga-motorsport-hero-paddock-ready.jpg"
                }
                backgroundAlt={
                  page?.heroImageAlt ||
                  "Sarga Motorsport driver and paddock team preparing in warm daylight"
                }
                accent="teal"
                accentPosition="bottom-left"
                grain
                speedLines
                surface="heat"
                description={
                  page?.heroDescription ??
                  "Partnership proposals, media requests, ticket support, or a question about Sarga Motorsport. We read every message."
                }
              />
            </div>
          ) : null}

          {page?.informationBand || isCmsSectionVisible(inquiry) ? (
            <div data-cms-section-key="inquiry-control" data-cms-enabled="true">
              <MotorsportPageInformationBand
                band={page?.informationBand}
                fallback={{
                  isActive: inquiry?.enabled,
                  eyebrow:
                    inquiry?.eyebrow ?? "Inquiry control / Direct routing",
                  title: inquiry?.title ?? "One form. The right team.",
                  description:
                    inquiry?.body ??
                    "Choose the closest inquiry type and the message is routed to the Motorsport team responsible for it.",
                  metrics: [
                    { label: "Channels", value: "07" },
                    { label: "Accounts", value: "None" },
                    { label: "Reply", value: "Email" },
                  ],
                }}
              />
            </div>
          ) : null}

          {isCmsSectionVisible(form) ? (
            <section
              data-cms-section-key="inquiry-form"
              data-cms-enabled="true"
              className="ms-reflected-light-surface ms-section"
            >
              <div className="ms-shell">
                <div className="grid gap-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
                  <div>
                    <SectionHeader
                      showIndex={form?.showIndex}
                      showEyebrow={form?.showEyebrow}
                      showTitle={form?.showTitle}
                      showDescription={form?.showBody}
                      eyebrow={form?.eyebrow ?? "Inquiry form"}
                      title={form?.title ?? "Send a signal."}
                      description={form?.body}
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
          ) : null}

          {isCmsSectionVisible(finalCta) ? (
            <section
              data-cms-section-key="contact-final-cta"
              data-cms-enabled="true"
              className="ms-blue-heat-surface py-12 sm:py-16"
            >
              <div className="ms-shell grid gap-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                <div>
                  <p className="ms-data-label text-ms-slipstream-teal">
                    {finalCta?.eyebrow ?? "Race-day route"}
                  </p>
                  <h2 className="ms-heading-feature mt-4 max-w-[18ch]">
                    {finalCta?.title ??
                      "Looking for an event or ticket answer?"}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-6">
                  <Link
                    href={finalCtaEventsHref}
                    className="border-b border-ms-electric-yellow/55 pb-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-electric-yellow"
                  >
                    {finalCta?.ctaLabel ?? "Browse events"}
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
          ) : null}
        </>
      )}
    </PageShell>
  );
}
