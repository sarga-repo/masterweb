import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import faviconImage from "../../assets/images/logos/sarga_co_secondary_full_square.png";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://staging.sarga.co";
const pageTitle = "Sarga.co | 360° Sports & Entertainment Ecosystem";
const pageDescription =
  "Sarga.co is Indonesia's premier integrated sports and entertainment ecosystem.";

const zalando = localFont({
  src: "../../assets/fonts/ZalandoSansExpanded-VariableFont_wght.ttf",
  variable: "--font-zalando",
  weight: "100 900",
  display: "swap",
});

const jakarta = localFont({
  src: "../../assets/fonts/PlusJakartaSans-VariableFont_wght.ttf",
  variable: "--font-jakarta",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: faviconImage.src,
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "SARGA.CO",
    title: pageTitle,
    description: pageDescription,
    locale: "en_US",
    images: [
      {
        url: faviconImage.src,
        width: 2216,
        height: 1801,
        alt: "Sarga.co sports and entertainment ecosystem",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [faviconImage.src],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${zalando.variable} ${jakarta.variable}`}>
      <body>{children}</body>
    </html>
  );
}
