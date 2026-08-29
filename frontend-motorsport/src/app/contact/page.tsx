import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/i18n/locale-link";

import {
  MotorsportPageInformationBand,
  PageComingSoon,
  PageHero,
  PageShell,
  SectionHeader,
} from "@/components";
import { MotorsportContactForm } from "@/components/sections/motorsport-contact-form";
import { fetchMotorsportTheme, fetchSitePage } from "@/lib/cms-data";
import { getRequestLocale } from "@/lib/i18n/request";
import {
  isCmsCanonicalSectionVisible,
  isCmsPageVisible,
  isCmsSectionVisible,
} from "@/lib/cms-visibility";
import { createSurfaceSequencer } from "@/lib/surface-sequencer";
import { createMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const page = await fetchSitePage("custom", "/contact", locale);
  return createMetadata({
    title: page?.title ?? "Contact",
    description:
      page?.heroDescription ??
      "Partnership proposals, media requests, ticket support, or a question about Sarga Motorsport.",
    path: "/contact",
    image: page?.heroImage,
    seo: page?.seo
      ? {
          metaTitle: page.seo.metaTitle,
          metaDescription: page.seo.metaDescription,
          ogTitle: page.seo.ogTitle,
          ogDescription: page.seo.ogDescription,
          ogImageUrl: page.seo.ogImage?.url,
          canonicalUrl: page.seo.canonicalUrl,
          noIndex: page.seo.noIndex,
        }
      : undefined,
    locale,
    isFallback: locale === "id" && !page,
  });
}

export default async function ContactPage() {
  const locale = await getRequestLocale();
  const [page, theme] = await Promise.all([
    fetchSitePage("custom", "/contact", locale),
    fetchMotorsportTheme(locale),
  ]);
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
  const contactChannels =
    form?.items
      ?.filter((item) => item.isActive !== false)
      .map((item) => ({
        label: item.title || item.label || "Contact",
        detail: item.description || item.href || "",
        href: item.href?.startsWith("mailto:") ? item.href : undefined,
      }))
      .filter((item) => item.detail.trim()) || [];
  const displayedContactChannels = contactChannels.length
    ? contactChannels
    : [
        { label: "General", detail: "hello@sarga.co", href: "mailto:hello@sarga.co" },
        { label: "Partnerships", detail: "partners@sarga.co", href: "mailto:partners@sarga.co" },
        { label: "Media", detail: "media@sarga.co", href: "mailto:media@sarga.co" },
        { label: "Ticket support", detail: "tickets@sarga.co", href: "mailto:tickets@sarga.co" },
        { label: "Talent programme", detail: "Select IJTC / Become Riders in the form.", href: undefined },
      ];
  const nextAlternatingSurface = createSurfaceSequencer(theme).nextClass;
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
                kicker={
                  page?.hero?.eyebrow ?? page?.navigationLabel ?? "Get in touch"
                }
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

          {isCmsCanonicalSectionVisible(page?.informationBand) ? (
            <div
              data-cms-section-key="information-band"
              data-cms-enabled="true"
            >
              <MotorsportPageInformationBand
                band={page?.informationBand}
                fallback={{
                  eyebrow: "Inquiry control / Direct routing",
                  title: "One form. The right team.",
                  description:
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
              className={`ms-reflected-light-surface ms-section ${nextAlternatingSurface()}`}
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
                      {displayedContactChannels.map((channel) => (
                        <div key={channel.label}>
                          <h3 className="ms-kicker text-ms-ignition-orange">
                            {channel.label}
                          </h3>
                          <p className="mt-2 text-sm text-ms-warm-white/60">
                            {channel.href ? (
                              <a
                                className="hover:text-ms-electric-yellow"
                                href={channel.href}
                              >
                                {channel.detail}
                              </a>
                            ) : (
                              channel.detail
                            )}
                          </p>
                        </div>
                      ))}
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
              className={`ms-blue-heat-surface py-12 sm:py-16 ${nextAlternatingSurface()}`}
            >
              <div className="ms-shell grid gap-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                <div>
                  {finalCta?.showEyebrow !== false ? (
                    <p className="ms-data-label text-ms-slipstream-teal">
                      {finalCta?.eyebrow ?? "Race-day route"}
                    </p>
                  ) : null}
                  {finalCta?.showTitle !== false ? (
                    <h2 className="ms-heading-feature mt-4 max-w-[18ch]">
                      {finalCta?.title ??
                        "Looking for an event or ticket answer?"}
                    </h2>
                  ) : null}
                  {finalCta?.showBody !== false && finalCta?.body ? (
                    <p className="mt-4 max-w-2xl leading-7 text-ms-warm-white/60">
                      {finalCta.body}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-6">
                  {finalCta?.showCta !== false ? (
                    <Link
                      href={finalCtaEventsHref}
                      target={
                        finalCta?.ctaTarget === "newWindow"
                          ? "_blank"
                          : undefined
                      }
                      rel={
                        finalCta?.ctaTarget === "newWindow"
                          ? "noreferrer"
                          : undefined
                      }
                      className="border-b border-ms-electric-yellow/55 pb-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-electric-yellow"
                    >
                      {finalCta?.ctaLabel ?? "Browse events"}
                    </Link>
                  ) : null}
                  {finalCta?.showCta !== false ? (
                    <Link
                      href={
                        finalCta?.secondaryCtaUrl?.startsWith("/")
                          ? finalCta.secondaryCtaUrl
                          : "/tickets"
                      }
                      target={
                        finalCta?.secondaryCtaTarget === "newWindow"
                          ? "_blank"
                          : undefined
                      }
                      rel={
                        finalCta?.secondaryCtaTarget === "newWindow"
                          ? "noreferrer"
                          : undefined
                      }
                      className="border-b border-ms-slipstream-teal/55 pb-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-slipstream-teal"
                    >
                      {finalCta?.secondaryCtaLabel ?? "Ticket support"}
                    </Link>
                  ) : null}
                </div>
              </div>
            </section>
          ) : null}
        </>
      )}
    </PageShell>
  );
}
