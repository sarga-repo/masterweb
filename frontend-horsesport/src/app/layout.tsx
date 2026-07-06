import type { Metadata } from "next";

import "@fontsource-variable/archivo";
import "@fontsource-variable/plus-jakarta-sans";

import { HorseSportHeader, HorseSportFooter, SeoJsonLd } from "@/components";
import {
  FOOTER_COLUMNS,
  GATEWAY_LINK,
  LEGAL_LINKS,
  MOTORSPORT_LINK,
  PRIMARY_NAV,
  TICKETS_LINK,
} from "@/lib/navigation";
import { resolveSiteUrl, siteConfig } from "@/lib/site-config";
import "./globals.css";

const socialImage = resolveSiteUrl("/media/horse-sport-hero.png");

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.name} - ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: siteConfig.siteUrl },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "en_US",
    url: siteConfig.siteUrl,
    title: `${siteConfig.name} - ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [
      {
        url: socialImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - ${siteConfig.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} - ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [socialImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SeoJsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: siteConfig.name,
            description: siteConfig.description,
            url: siteConfig.siteUrl,
            logo: socialImage,
            sameAs: [siteConfig.gatewayUrl, siteConfig.motorsportUrl],
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-hs-red focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-hs-white"
        >
          Skip to content
        </a>

        <HorseSportHeader
          navigation={PRIMARY_NAV}
          ticketLink={TICKETS_LINK}
          gatewayLink={GATEWAY_LINK}
          motorsportLink={MOTORSPORT_LINK}
        />

        <main id="main">{children}</main>

        <HorseSportFooter
          columns={FOOTER_COLUMNS}
          crossSiteLinks={[
            { ...GATEWAY_LINK, label: "Visit Sarga.co" },
            MOTORSPORT_LINK,
          ]}
          legalLinks={LEGAL_LINKS}
          copyright={`© ${new Date().getFullYear()} Sarga Horse Sport`}
        />
      </body>
    </html>
  );
}
