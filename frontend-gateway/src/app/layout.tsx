import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { resolveSiteUrl, siteUrl } from "@/lib/seo/metadata";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta-sans",
  weight: "variable",
});

const zalandoSansExpanded = localFont({
  src: "./fonts/zalando-sans-expanded-latin.woff2",
  display: "swap",
  variable: "--font-zalando-sans-expanded",
  weight: "200 900",
  style: "normal",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sarga.co | 360° Sport & Entertainment",
    template: "%s | Sarga.co",
  },
  description:
    "The group gateway for Sarga's integrated sport and entertainment ecosystem.",
  applicationName: "Sarga.co",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    siteName: "Sarga.co",
    locale: "en_US",
    url: siteUrl,
    title: "Sarga.co | 360° Sport & Entertainment",
    description:
      "The group gateway for Sarga's integrated sport and entertainment ecosystem.",
    images: [
      {
        url: resolveSiteUrl("/assets/media/sarga-cinematic-hero-concept.png"),
        width: 1200,
        height: 630,
        alt: "Sarga.co | 360° Sport & Entertainment",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sarga.co | 360° Sport & Entertainment",
    description:
      "The group gateway for Sarga's integrated sport and entertainment ecosystem.",
    images: [resolveSiteUrl("/assets/media/sarga-cinematic-hero-concept.png")],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${plusJakartaSans.variable} ${zalandoSansExpanded.variable}`}
    >
      <body className="flex min-h-full flex-col bg-sarga-white text-sarga-text">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sarga-sm focus:bg-sarga-red focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:uppercase focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main-content" className="flex flex-1 flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
