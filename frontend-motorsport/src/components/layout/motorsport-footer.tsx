import Link from "next/link";

import { MotorsportLogo } from "@/components/ui/brand-logo";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import type { LinkItem } from "@/types/design-system";

type FooterColumn = {
  title: string;
  links: LinkItem[];
};

type MotorsportFooterProps = {
  columns: FooterColumn[];
  socialLinks?: LinkItem[];
  legalLinks?: LinkItem[];
  gatewayLink?: LinkItem;
  /** Cross-links into other Sarga dedicated sites (e.g. Horse Sport). */
  crossSiteLinks?: LinkItem[];
  copyright: string;
  statement?: string;
};

export function MotorsportFooter({
  columns,
  socialLinks = [],
  legalLinks = [],
  gatewayLink,
  crossSiteLinks = [],
  copyright,
  statement = "Racing, amplified.",
}: MotorsportFooterProps) {
  return (
    <footer className="relative overflow-hidden border-t border-ms-warm-white/12 bg-ms-charcoal">
      <div
        aria-hidden="true"
        className="ms-track-grid absolute inset-0 opacity-40"
      />
      <div className="ms-shell relative py-16 sm:py-20">
        <div className="grid gap-14 border-b border-ms-warm-white/12 pb-14 lg:grid-cols-[1.1fr_1.9fr]">
          <div>
            <MotorsportLogo variant="part-of-sarga" className="w-52" />
            <p className="ms-heading-section mt-10 max-w-xl text-ms-warm-white">
              {statement}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.title}>
                <h2 className="ms-kicker text-ms-ignition-orange">
                  {column.title}
                </h2>
                <ul className="mt-6 space-y-3">
                  {column.links.map((item) => (
                    <li key={`${column.title}-${item.href}`}>
                      <Link
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noreferrer" : undefined}
                        className="text-sm text-ms-warm-white/62 transition-colors hover:text-ms-warm-white"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-8 pt-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {socialLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-ms-warm-white/65 hover:text-ms-electric-yellow"
              >
                {item.label} <ArrowUpRightIcon className="size-3.5" />
              </a>
            ))}
            {crossSiteLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-ms-warm-white/65 hover:text-ms-electric-yellow"
              >
                {item.label} <ArrowUpRightIcon className="size-3.5" />
              </a>
            ))}
            {gatewayLink ? (
              <a
                href={gatewayLink.href}
                target={gatewayLink.external ? "_blank" : undefined}
                rel={gatewayLink.external ? "noreferrer" : undefined}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-ms-warm-white/65 hover:text-ms-electric-yellow"
              >
                {gatewayLink.label} <ArrowUpRightIcon className="size-3.5" />
              </a>
            ) : null}
          </div>
          <div className="flex flex-col gap-3 text-xs text-ms-warm-white/38 sm:flex-row sm:items-center">
            <span>{copyright}</span>
            {legalLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-ms-warm-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
