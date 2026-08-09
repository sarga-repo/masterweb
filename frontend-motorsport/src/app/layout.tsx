import type { Metadata } from "next";
import localFont from "next/font/local";
import "@fontsource-variable/noto-sans/wght.css";

import { resolveSiteUrl, siteConfig } from "@/lib/site-config";
import "./globals.css";

/** Sarga Motorsport display face (brand target: Owners Wide - Black cut). */
const ownersWide = localFont({
  src: "./fonts/owners-wide-black.ttf",
  display: "swap",
  variable: "--font-owners-wide",
  weight: "900",
  style: "normal",
});

const defaultSocialImage = resolveSiteUrl("/media/motorsport-design-hero.png");

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.name} - ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: {
    canonical: siteConfig.siteUrl,
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "en_US",
    url: siteConfig.siteUrl,
    title: `${siteConfig.name} - ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [
      {
        url: defaultSocialImage,
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
    images: [defaultSocialImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={ownersWide.variable}>
      <body>{children}</body>
    </html>
  );
}
