import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import faviconImage from "../../assets/images/logos/sarga_co_secondary_full_square.png";

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
  title: "Sarga.co | 360° Sports & Entertainment Ecosystem",
  description:
    "Sarga.co is Indonesia's premier integrated sports and entertainment ecosystem.",
  icons: {
    icon: faviconImage.src,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${zalando.variable} ${jakarta.variable}`}>
      <body>{children}</body>
    </html>
  );
}
