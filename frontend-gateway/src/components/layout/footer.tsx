import { LocaleLink as Link } from "@/components/i18n/locale-link";
import { Logo } from "@/components/ui/logo";
import { RacingGraphic } from "@/components/ui/racing-graphic";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { footerGroups, newsletter, siteMeta } from "@/lib/mock-data";
import { businessSiteUrl } from "@/lib/cross-site";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/request";

export async function Footer() {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  return (
    <footer className="gateway-footer relative isolate overflow-hidden bg-[var(--gateway-surface-footer)] text-white">
      <span
        aria-hidden="true"
        className="velocity-grain absolute inset-0 -z-20"
      />
      <RacingGraphic
        variant="cluster"
        className="absolute -right-28 bottom-0 -z-10 h-auto w-[46rem] max-w-[52vw] rotate-180 text-white opacity-50 max-lg:max-w-[90vw]"
      />
      <div className="site-container pb-8 pt-14 sm:pt-16">
        <div className="grid gap-8 border-b border-white/20 pb-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <h2 className="gateway-section-title max-w-[13ch] font-heading uppercase">
            {dictionary.footer.title}
          </h2>
          <p className="gateway-body-copy max-w-lg text-sm text-white/72 sm:text-base lg:justify-self-end">
            {dictionary.footer.description}
          </p>
        </div>

        <div className="grid gap-10 py-12 sm:grid-cols-2 xl:grid-cols-[1.15fr_0.9fr_0.9fr_1.25fr]">
          {/* Brand */}
          <div>
            <Logo variant="reverse" />
            <p className="gateway-body-copy mt-5 max-w-xs text-sm text-white/68">
              {dictionary.footer.brandDescription}
            </p>
          </div>

          {/* Link columns */}
          {footerGroups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="text-[0.65rem] font-extrabold uppercase tracking-[0.19em] text-white">
                {group.title === "Ecosystem Map"
                  ? dictionary.footer.ecosystemMap
                  : dictionary.footer.publications}
              </h2>
              <ul className="mt-6 space-y-3 text-sm text-white/68">
                {group.items.map((item) => {
                  /* Ecosystem links for businesses with a dedicated frontend
                     (Motorsport, Horse Sport) → that site when configured. */
                  const ecosystemSlug = item.href.startsWith("/ecosystem/")
                    ? item.href.slice("/ecosystem/".length)
                    : undefined;
                  const dedicatedHref = ecosystemSlug
                    ? businessSiteUrl(ecosystemSlug)
                    : undefined;
                  const resolvedHref = dedicatedHref ?? item.href;
                  const isExternal = resolvedHref.startsWith("http");
                  return (
                    <li key={`${group.title}-${item.label}`}>
                      <Link
                        href={resolvedHref}
                        className="transition-[color,transform] duration-200 hover:translate-x-1 hover:text-white"
                        {...(isExternal
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          ))}

          {/* Newsletter */}
          <div>
            <h2 className="text-[0.65rem] font-extrabold uppercase tracking-[0.19em] text-white">
              {dictionary.footer.newsletter}
            </h2>
            <p className="gateway-body-copy mt-5 max-w-xs text-sm text-white/72">
              {dictionary.footer.newsletterDescription}
            </p>
            <NewsletterForm
              id="footer-newsletter-email"
              placeholder={newsletter.placeholder}
              locale={locale}
              tone="dark"
              className="mt-5"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/20 pt-7 text-[0.62rem] font-bold uppercase leading-5 tracking-[0.12em] text-white/76 lg:flex-row lg:items-center lg:justify-between">
          <span>{siteMeta.copyright}</span>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-2">
            <Link
              className="transition-colors hover:text-white"
              href="/privacy-policy"
            >
              {dictionary.footer.privacy}
            </Link>
            <Link className="transition-colors hover:text-white" href="/terms">
              {dictionary.footer.terms}
            </Link>
            <span>{dictionary.footer.location}</span>
          </nav>
        </div>
      </div>
    </footer>
  );
}
