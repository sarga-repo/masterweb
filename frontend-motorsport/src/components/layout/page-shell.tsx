import type { ReactNode } from "react";

import { MotorsportFooter, MotorsportHeader } from "@/components";
import { siteConfig } from "@/lib/site-config";

const NAVIGATION = [
  { label: "Events", href: "/events" },
  { label: "Experience", href: "/experience" },
  { label: "News", href: "/news" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
];

const FOOTER_COLUMNS = [
  {
    title: "Race",
    links: [
      { label: "Events", href: "/events" },
      { label: "Tickets", href: "/tickets" },
      { label: "Experience", href: "/experience" },
    ],
  },
  {
    title: "Stories",
    links: [
      { label: "News", href: "/news" },
      { label: "Gallery", href: "/gallery" },
      { label: "Partners", href: "/partners" },
    ],
  },
  {
    title: "Sarga",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

type PageShellProps = {
  children: ReactNode;
};

/**
 * Shared page wrapper — provides consistent header, footer, and metadata
 * chrome across all Motorsport routes.
 */
export function PageShell({ children }: PageShellProps) {
  return (
    <>
      <MotorsportHeader
        navigation={NAVIGATION}
        ticketLink={{ label: "Tickets", href: "/tickets" }}
        gatewayLink={{
          label: "Sarga.co",
          href: siteConfig.gatewayUrl,
          external: true,
        }}
      />
      <main>{children}</main>
      <MotorsportFooter
        columns={FOOTER_COLUMNS}
        crossSiteLinks={[
          {
            label: "Sarga Horse Sport",
            href: siteConfig.horsesportUrl,
            external: true,
          },
        ]}
        gatewayLink={{
          label: "Visit Sarga.co",
          href: siteConfig.gatewayUrl,
          external: true,
        }}
        legalLinks={[
          { label: "Privacy", href: "/privacy" },
          { label: "Terms", href: "/terms" },
        ]}
        copyright="© 2026 Sarga Motorsport"
      />
    </>
  );
}
