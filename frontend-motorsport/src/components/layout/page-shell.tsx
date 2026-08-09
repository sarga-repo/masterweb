import type { ReactNode } from "react";

import { MotorsportFooter, MotorsportHeader } from "@/components";
import {
  MOTORSPORT_NAVIGATION,
  MOTORSPORT_TICKET_LINK,
} from "@/lib/navigation";
import { siteConfig } from "@/lib/site-config";

const FOOTER_COLUMNS = [
  {
    title: "Discover",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Events", href: "/events" },
    ],
  },
  {
    title: "Follow",
    links: [
      { label: "News", href: "/news" },
      { label: "Gallery", href: "/gallery" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Race day",
    links: [
      { label: "Tickets", href: "/tickets" },
      { label: "Merchandise", href: "/merchandise" },
    ],
  },
];

type PageShellProps = {
  children: ReactNode;
  spectrumSeparators?: boolean;
};

/**
 * Shared page wrapper - provides consistent header, footer, and metadata
 * chrome across all Motorsport routes.
 */
export function PageShell({
  children,
  spectrumSeparators = false,
}: PageShellProps) {
  return (
    <>
      <MotorsportHeader
        navigation={MOTORSPORT_NAVIGATION}
        ticketLink={MOTORSPORT_TICKET_LINK}
        gatewayLink={{
          label: "Sarga.co",
          href: siteConfig.gatewayUrl,
          external: true,
        }}
      />
      <main className={spectrumSeparators ? "ms-spectrum-sections" : undefined}>
        {children}
      </main>
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
        copyright="© 2026 Sarga Motorsport"
      />
    </>
  );
}
