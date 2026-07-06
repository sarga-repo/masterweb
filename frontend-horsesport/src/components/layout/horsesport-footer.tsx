import Link from "next/link";
import { HorseSportLogo } from "@/components/ui/brand-logo";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import {
  InstagramIcon,
  YoutubeIcon,
  XIcon,
  ThreadsIcon,
  FacebookIcon,
} from "@/components/ui/social-icons";
import type { LinkItem } from "@/types/design-system";

const SOCIAL = [
  { label: "Instagram", href: "https://instagram.com", Icon: InstagramIcon },
  { label: "YouTube", href: "https://youtube.com", Icon: YoutubeIcon },
  { label: "X", href: "https://x.com", Icon: XIcon },
  { label: "Threads", href: "https://threads.net", Icon: ThreadsIcon },
  { label: "Facebook", href: "https://facebook.com", Icon: FacebookIcon },
];

type FooterColumn = { title: string; links: LinkItem[] };

type HorseSportFooterProps = {
  columns: FooterColumn[];
  crossSiteLinks: LinkItem[];
  legalLinks: LinkItem[];
  copyright: string;
};

/**
 * Premium editorial footer — dark panel with cream dot texture, zigzag band
 * top edge, and generous spatial rhythm. Uses the Horse Sport brand logo and
 * warm accent touches. Designed as a destination, not an afterthought.
 */
export function HorseSportFooter({
  columns,
  crossSiteLinks,
  legalLinks,
  copyright,
}: HorseSportFooterProps) {
  return (
    <footer
      className="bg-black relative overflow-hidden"
      role="contentinfo"
    >
      {/* Top ember glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full opacity-6 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse, rgb(255 107 0 / 0.7), transparent 70%)",
        }}
      />

      {/* Brand marker — three full-height staircase stripes down the RIGHT edge,
          faded top + bottom (mirrors the hero's left marker) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 hidden select-none pr-2 lg:flex lg:flex-row-reverse lg:gap-8"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="hs-zigzag-pattern block h-full w-12"
            style={{
              opacity: 0.08,
              WebkitMaskImage:
                "linear-gradient(180deg, black 0%, black 45%, transparent 85%)",
              maskImage:
                "linear-gradient(180deg, black 0%, black 45%, transparent 85%)",
            }}
          />
        ))}
      </div>

      <div className="hs-shell relative py-16 sm:py-20 md:py-24">
        <div className="mb-10 max-w-[28rem]">
          <p className="hs-kicker text-hs-orange">Horse sport by Sarga</p>
          <h2 className="hs-display mt-4 max-w-[12ch] text-[clamp(2rem,4.5vw,3.6rem)] text-white">
            Where sport meets spectacle.
          </h2>
        </div>
        {/* Top row: logo + columns */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" aria-label="Sarga Horse Sport — Home">
              <HorseSportLogo
                variant="white"
                className="w-[clamp(9rem,14vw,12rem)]"
              />
            </Link>
            <p className="mt-6 max-w-[18rem] text-sm leading-6 text-gray-300">
              Championship equestrian sport, premium hospitality, and
              international-grade race day experiences.
            </p>

            {/* Cross-site ecosystem links */}
            {crossSiteLinks.length > 0 ? (
              <div className="mt-7 flex flex-wrap gap-3">
                {crossSiteLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noreferrer" : undefined}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-gray-300 backdrop-blur-sm transition-colors duration-300 hover:border-white/40 hover:text-white"
                  >
                    {link.label}
                    <ArrowUpRightIcon className="size-3" />
                  </a>
                ))}
              </div>
            ) : null}

            {/* Social */}
            <ul className="mt-8 flex items-center gap-3" role="list">
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="grid size-9 place-items-center rounded-full border border-white/15 text-gray-300 transition-colors duration-300 hover:border-hs-orange/50 hover:text-hs-orange"
                  >
                    <s.Icon className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[0.66rem] font-extrabold uppercase tracking-[0.18em] text-gray-300">
                {col.title}
              </h4>
              <ul className="mt-5 space-y-3.5" role="list">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-300 transition-colors duration-300 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact column */}
          <div>
            <h4 className="text-[0.66rem] font-extrabold uppercase tracking-[0.18em] text-gray-300">
              Connect
            </h4>
            <ul className="mt-5 space-y-3.5" role="list">
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-300 transition-colors duration-300 hover:text-white"
                >
                  Contact us
                </Link>
              </li>
              <li>
                <Link
                  href="/partners"
                  className="text-sm text-gray-300 transition-colors duration-300 hover:text-white"
                >
                  Partnerships
                </Link>
              </li>
              <li>
                <Link
                  href="/tickets"
                  className="text-sm text-gray-300 transition-colors duration-300 hover:text-white"
                >
                  Hospitality
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar: luxe rule + legal + copyright */}
        <div className="mt-16 sm:mt-20">
          <div className="hs-luxe-rule mb-8" />
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="text-[0.64rem] text-gray-400">{copyright}</p>
            {legalLinks.length > 0 ? (
              <nav aria-label="Legal links">
                <ul className="flex flex-wrap gap-x-6 gap-y-2" role="list">
                  {legalLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[0.64rem] text-gray-400 transition-colors duration-300 hover:text-gray-300"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
