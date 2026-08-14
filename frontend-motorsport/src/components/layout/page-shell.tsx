import type { ReactNode } from "react";

import { MotorsportFooter, MotorsportHeader } from "@/components";
import { siteConfig } from "@/lib/site-config";
import { getRequestLocale } from "@/lib/i18n/request";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getMotorsportNavigation } from "@/lib/navigation-cms";
import { fetchMotorsportChrome } from "@/lib/cms-data";
import { localizeExternalSiteHref } from "@/lib/i18n/config";

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
export async function PageShell({
  children,
  spectrumSeparators = false,
}: PageShellProps) {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const navigation = await getMotorsportNavigation(locale);
  const chrome = await fetchMotorsportChrome();
  const utilityLinks = (chrome.footerUtilityLinks ?? []).map((item) => ({
    label: item.label,
    href: item.href,
    external: item.linkType === "external",
  }));
  const gatewayLink = utilityLinks.find(
    (item) => item.label === "Visit Sarga.co",
  );
  const ticketLink = navigation.items.find(
    (item) => item.emphasis === "primaryCta",
  );
  return (
    <>
      <MotorsportHeader
        navigation={navigation.items}
        ticketLink={ticketLink}
        gatewayLink={
          gatewayLink ?? {
            label: "Sarga.co",
            href: localizeExternalSiteHref(siteConfig.gatewayUrl, locale),
            external: true,
          }
        }
        locale={locale}
        dictionary={dictionary}
        navigationSource={navigation.source}
        logoSrc={chrome.headerLogo}
        logoAlt={chrome.headerLogoAlt}
      />
      <main className={spectrumSeparators ? "ms-spectrum-sections" : undefined}>
        {children}
      </main>
      <MotorsportFooter
        columns={chrome.footerColumns ?? FOOTER_COLUMNS}
        crossSiteLinks={utilityLinks.filter(
          (item) => item.label !== gatewayLink?.label,
        )}
        gatewayLink={{
          label: "Visit Sarga.co",
          href: localizeExternalSiteHref(siteConfig.gatewayUrl, locale),
          external: true,
        }}
        copyright={chrome.footerCopyright ?? "© 2026 Sarga Motorsport"}
        statement={chrome.footerStatement}
        logoSrc={chrome.footerLogo}
        logoAlt={chrome.footerLogoAlt}
      />
    </>
  );
}
