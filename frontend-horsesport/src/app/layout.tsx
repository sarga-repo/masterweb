import type { Metadata } from "next";

import "@fontsource-variable/archivo";
import "@fontsource-variable/plus-jakarta-sans";

import { HorseSportHeader, HorseSportFooter, SeoJsonLd } from "@/components";
import {
  FOOTER_COLUMNS,
  GATEWAY_LINK,
  LEGAL_LINKS,
  MOTORSPORT_LINK,
} from "@/lib/navigation";
import { resolveSiteUrl, siteConfig } from "@/lib/site-config";
import { createMetadata } from "@/lib/seo/metadata";
import { getRequestLocale, getRequestPathname } from "@/lib/i18n/request";
import "./globals.css";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getHorseSportNavigation } from "@/lib/navigation-cms";
import { localizeExternalSiteHref } from "@/lib/i18n/config";

const socialImage = resolveSiteUrl("/media/horse-sport-hero.png");

export async function generateMetadata(): Promise<Metadata> {
  const [locale, pathname] = await Promise.all([
    getRequestLocale(),
    getRequestPathname(),
  ]);
  return {
    ...createMetadata({
      title: `${siteConfig.name} - ${siteConfig.tagline}`,
      description: siteConfig.description,
      path: pathname,
      image: socialImage,
      locale,
    }),
    metadataBase: new URL(siteConfig.siteUrl),
    applicationName: siteConfig.name,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const navigation = await getHorseSportNavigation(locale);
  const ticketLink = navigation.items.find(
    (item) => item.emphasis === "primaryCta",
  ) ??
    navigation.items.find((item) => item.href === "/tickets") ?? {
      internalName: "tickets-fallback",
      label: locale === "id" ? "Tiket" : "Tickets",
      href: "/tickets",
      emphasis: "primaryCta" as const,
      openInNewTab: false,
      displayOrder: 999,
    };
  const primaryNavigation = navigation.items.filter(
    (item) => item !== ticketLink,
  );
  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <body>
        <SeoJsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: siteConfig.name,
            description: siteConfig.description,
            url: siteConfig.siteUrl,
            logo: socialImage,
            inLanguage: locale === "id" ? "id-ID" : "en-US",
            sameAs: [siteConfig.gatewayUrl, siteConfig.motorsportUrl],
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-hs-red focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-hs-white"
        >
          {dictionary.skipToContent}
        </a>

        <HorseSportHeader
          navigation={primaryNavigation}
          ticketLink={ticketLink}
          gatewayLink={GATEWAY_LINK}
          motorsportLink={MOTORSPORT_LINK}
          locale={locale}
          dictionary={dictionary}
          navigationSource={navigation.source}
        />

        <main id="main">{children}</main>

        <HorseSportFooter
          columns={FOOTER_COLUMNS}
          crossSiteLinks={[
            {
              ...GATEWAY_LINK,
              label: "Visit Sarga.co",
              href: localizeExternalSiteHref(GATEWAY_LINK.href, locale),
            },
            {
              ...MOTORSPORT_LINK,
              href: localizeExternalSiteHref(MOTORSPORT_LINK.href, locale),
            },
          ]}
          legalLinks={LEGAL_LINKS}
          copyright={`© ${new Date().getFullYear()} Sarga Horse Sport`}
        />
      </body>
    </html>
  );
}
