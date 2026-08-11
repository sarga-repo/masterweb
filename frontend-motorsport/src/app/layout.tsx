import type { Metadata } from "next";
import localFont from "next/font/local";
import "@fontsource-variable/noto-sans/wght.css";
import { createMetadata } from "@/lib/seo/metadata";
import { getRequestLocale, getRequestPathname } from "@/lib/i18n/request";
import { resolveSiteUrl, siteConfig } from "@/lib/site-config";
import "./globals.css";

const ownersWide = localFont({
  src: "./fonts/owners-wide-black.ttf",
  display: "swap",
  variable: "--font-owners-wide",
  weight: "900",
  style: "normal",
});
const defaultSocialImage = resolveSiteUrl("/media/motorsport-design-hero.png");

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
      image: defaultSocialImage,
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
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    description: siteConfig.description,
    url: resolveSiteUrl(locale === "id" ? "/id" : "/"),
    logo: defaultSocialImage,
    inLanguage: locale === "id" ? "id-ID" : "en-US",
  };

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={ownersWide.variable}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replaceAll(
              "<",
              "\\u003c",
            ),
          }}
        />
        {children}
      </body>
    </html>
  );
}
