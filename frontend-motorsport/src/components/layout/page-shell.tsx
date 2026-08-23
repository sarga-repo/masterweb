import type { ReactNode } from "react";

import { MotorsportFooter, MotorsportHeader } from "@/components";
import { getRequestLocale } from "@/lib/i18n/request";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getMotorsportNavigation } from "@/lib/navigation-cms";
import { fetchEventMenuPrograms, fetchMotorsportChrome } from "@/lib/cms-data";
import { isStrapiPreviewEnabled } from "@/lib/strapi/client";
import { buildEventMenuLinks } from "@/lib/event-navigation";

const FOOTER_COLUMNS = [
  {
    title: "Discover",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Events", href: "/events" },
      { label: "News", href: "/news" },
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
  const [chrome, programs, isPreview] = await Promise.all([
    fetchMotorsportChrome(locale),
    fetchEventMenuPrograms(locale),
    isStrapiPreviewEnabled(),
  ]);
  const utilityLinks = (chrome.footerUtilityLinks ?? [])
    .filter((item) => item.label !== "Visit Sarga.co")
    .map((item) => ({
      label: item.label,
      href: item.href,
      external: item.linkType === "external",
    }));
  const ticketLink = navigation.items.find(
    (item) => item.emphasis === "primaryCta",
  );
  const eventChildren = buildEventMenuLinks(programs, isPreview);
  return (
    <>
      <MotorsportHeader
        navigation={navigation.items}
        eventChildren={eventChildren}
        ticketLink={ticketLink}
        gatewayLink={undefined}
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
        crossSiteLinks={utilityLinks}
        gatewayLink={undefined}
        copyright={chrome.footerCopyright ?? "© 2026 Sarga Motorsport"}
        statement={chrome.footerStatement}
        socialLinks={chrome.footerSocialLinks}
        logoSrc={chrome.footerLogo}
        logoAlt={chrome.footerLogoAlt}
      />
    </>
  );
}
