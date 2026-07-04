import { NewsletterForm } from "@/components/forms/newsletter-form";
import { newsletterSection } from "@/lib/mock-data";

/**
 * Homepage Newsletter section (docs/04 → Newsletter, preview PDF page 5 direction).
 * Reuses the shared, server-routed NewsletterForm.
 */
export function NewsletterSection() {
  return (
    <section
      id="newsletter"
      className="relative isolate overflow-hidden bg-sarga-black py-16 text-white sm:py-20"
    >
      <span
        aria-hidden="true"
        className="gateway-newsletter-glow absolute -right-40 top-1/2 -z-10 h-96 w-96 -translate-y-1/2 rounded-full"
      />
      <span
        aria-hidden="true"
        className="velocity-grain absolute inset-0 -z-20"
      />

      <div className="site-container">
        <div className="grid gap-10 border-y border-white/15 py-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-center lg:py-14">
          <div>
            <p className="eyebrow">{newsletterSection.eyebrow}</p>
            <h2 className="mt-4 font-heading text-3xl font-black uppercase leading-[0.94] tracking-[-0.03em] sm:text-[2.4rem]">
              {newsletterSection.title}
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-6 text-white/58 sm:text-base">
              {newsletterSection.description}
            </p>
          </div>
          <NewsletterForm
            id="home-newsletter-email"
            placeholder={newsletterSection.placeholder}
            tone="dark"
            showConsent
            className="w-full max-w-none justify-self-stretch lg:justify-self-end"
          />
        </div>
      </div>
    </section>
  );
}
