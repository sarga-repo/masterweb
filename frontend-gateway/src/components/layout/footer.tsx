import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { RacingGraphic } from "@/components/ui/racing-graphic";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { footerGroups, newsletter, siteMeta } from "@/lib/mock-data";
import { businessSiteUrl } from "@/lib/cross-site";

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-sarga-black text-white">
      <span
        aria-hidden="true"
        className="velocity-grain absolute inset-0 -z-20"
      />
      <RacingGraphic
        variant="cluster"
        className="absolute -right-28 bottom-0 -z-10 h-auto w-[52rem] max-w-[55vw] rotate-180 text-white max-lg:max-w-[90vw]"
      />
      <div className="site-container pb-8 pt-16 sm:pt-20">
        <div className="grid gap-8 border-b border-white/15 pb-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <h2 className="max-w-[13ch] font-heading text-[clamp(3rem,10vw,3.5rem)] font-black uppercase leading-[0.86] tracking-[-0.045em] sm:text-[clamp(3rem,4vw,4.2rem)]">
            One network. Many ways in.
          </h2>
          <p className="max-w-lg text-sm leading-6 text-white/55 sm:text-base sm:leading-7 lg:justify-self-end">
            Follow the sport, enter the venue, read the signal, or start a
            partnership. Sarga is designed as one connected gateway.
          </p>
        </div>

        <div className="grid gap-12 py-14 lg:grid-cols-[1.1fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <Logo variant="reverse" />
            <p className="mt-5 max-w-xs text-sm leading-6 text-white/55">
              A shared gateway for Sarga&apos;s integrated sport and
              entertainment ecosystem.
            </p>
          </div>

          {/* Link columns */}
          {footerGroups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="text-[0.65rem] font-extrabold uppercase tracking-[0.19em] text-white">
                {group.title}
              </h2>
              <ul className="mt-6 space-y-3 text-sm text-white/55">
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
              {newsletter.title}
            </h2>
            <p className="mt-5 max-w-xs text-sm leading-6 text-white/60">
              {newsletter.description}
            </p>
            <NewsletterForm
              id="footer-newsletter-email"
              placeholder={newsletter.placeholder}
              tone="dark"
              className="mt-5"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/15 pt-7 text-[0.62rem] font-bold uppercase leading-5 tracking-[0.12em] text-white/70 sm:flex-row sm:justify-between">
          {siteMeta.copyright}
          <span>Jakarta / Indonesia</span>
        </div>
      </div>
    </footer>
  );
}
