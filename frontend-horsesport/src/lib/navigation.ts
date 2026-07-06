import type { LinkItem } from "@/types/design-system";
import { siteConfig } from "@/lib/site-config";

/** Primary global navigation (docs/horsesport/03). */
export const PRIMARY_NAV: LinkItem[] = [
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Tickets", href: "/tickets" },
  { label: "News", href: "/news" },
  { label: "Gallery", href: "/gallery" },
  { label: "Venues", href: "/venues" },
  { label: "Contact", href: "/contact" },
];

export const TICKETS_LINK: LinkItem = { label: "Tickets", href: "/tickets" };

/** Cross-site secondary links back into the Sarga ecosystem. */
export const GATEWAY_LINK: LinkItem = {
  label: "Sarga.co",
  href: siteConfig.gatewayUrl,
  external: true,
};

export const MOTORSPORT_LINK: LinkItem = {
  label: "Sarga Motorsport",
  href: siteConfig.motorsportUrl,
  external: true,
};

/** Footer link columns. */
export const FOOTER_COLUMNS: { title: string; links: LinkItem[] }[] = [
  {
    title: "Compete",
    links: [
      { label: "Events", href: "/events" },
      { label: "Tickets", href: "/tickets" },
      { label: "Venues", href: "/venues" },
    ],
  },
  {
    title: "Stories",
    links: [
      { label: "News", href: "/news" },
      { label: "Gallery", href: "/gallery" },
      { label: "Stable Life", href: "/stable-life" },
    ],
  },
  {
    title: "Sarga",
    links: [
      { label: "About", href: "/about" },
      { label: "Partners", href: "/partners" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export const LEGAL_LINKS: LinkItem[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];
