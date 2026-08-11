import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { resolveSiteUrl, siteUrl } from "@/lib/seo/metadata";
import { createMetadata } from "@/lib/seo/metadata";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getRequestLocale, getRequestPathname } from "@/lib/i18n/request";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta-sans",
  weight: "variable",
});

// Brand display face from the approved Sarga.co preview. The official Google
// Fonts variable file includes the required ExtraBold (800) weight and is kept
// locally so production rendering does not depend on a third-party request.
const zalandoSans = localFont({
  src: "./fonts/zalando-sans-expanded-variable.ttf",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-zalando-sans",
  adjustFontFallback: false,
});

export async function generateMetadata(): Promise<Metadata> {
  const [locale, pathname] = await Promise.all([
    getRequestLocale(),
    getRequestPathname(),
  ]);
  const result = createMetadata({
    title:
      locale === "id"
        ? "Sarga.co | Olahraga & Hiburan 360°"
        : "Sarga.co | 360° Sport & Entertainment",
    description:
      locale === "id"
        ? "Gerbang grup untuk ekosistem olahraga dan hiburan terpadu Sarga."
        : "The group gateway for Sarga's integrated sport and entertainment ecosystem.",
    path: pathname,
    locale,
    image: resolveSiteUrl("/assets/media/sarga-cinematic-hero-concept.png"),
  });

  return {
    ...result,
    metadataBase: new URL(siteUrl),
    applicationName: "Sarga.co",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`h-full antialiased ${plusJakartaSans.variable} ${zalandoSans.variable}`}
    >
      <body className="flex min-h-full flex-col bg-sarga-light text-sarga-text">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sarga-sm focus:bg-sarga-red focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:uppercase focus:text-white"
        >
          {dictionary.shell.skipToContent}
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
