import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "@fontsource-variable/noto-sans/wght.css";
import { createMetadata } from "@/lib/seo/metadata";
import { getRequestLocale, getRequestPathname } from "@/lib/i18n/request";
import { resolveSiteUrl, siteConfig } from "@/lib/site-config";
import { fetchMotorsportTheme } from "@/lib/cms-data";
import { motorsportThemeAttribute } from "@/lib/motorsport-theme";
import { getMotorsportPreviewContext } from "@/lib/preview/preview-request-context";
import PreviewLiveRefresh from "@/components/preview-live-refresh";
import { draftMode } from "next/headers";
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
  const [locale, theme, mode, previewContext] = await Promise.all([
    getRequestLocale(),
    getRequestLocale().then(fetchMotorsportTheme),
    draftMode(),
    getMotorsportPreviewContext(),
  ]);
  const isLivePreview = mode.isEnabled && Boolean(previewContext);
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
      data-ms-theme={motorsportThemeAttribute(theme)}
      data-scroll-behavior="smooth"
      className={ownersWide.variable}
    >
      <body>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XE9P5PDJZ2"
          strategy="afterInteractive"
        />
        <Script id="google-tag-config" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-XE9P5PDJZ2');`}
        </Script>
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
        {isLivePreview ? <PreviewLiveRefresh /> : null}
      </body>
    </html>
  );
}
