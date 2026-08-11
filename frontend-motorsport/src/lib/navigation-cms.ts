import "server-only";
import type { Locale } from "@/lib/i18n/config";
import { fetchStrapiList } from "@/lib/strapi/client";
import { MOTORSPORT_NAVIGATION } from "@/lib/navigation";

export type SiteNavigationItem = {
  internalName: string;
  label: string;
  ariaLabel?: string;
  href: string;
  external?: boolean;
  emphasis: "default" | "primaryCta";
  openInNewTab: boolean;
  displayOrder: number;
};
type RawItem = SiteNavigationItem & {
  documentId: string;
  siteScope: string;
  enabled: boolean;
};
const NAVIGATION_REVALIDATE_SECONDS = 0;

function safe(item: RawItem) {
  if (item.href.startsWith("/") && !item.href.startsWith("//")) return true;
  try {
    const url = new URL(item.href);
    return (
      url.protocol === "https:" ||
      (url.protocol === "http:" &&
        ["localhost", "127.0.0.1"].includes(url.hostname))
    );
  } catch {
    return false;
  }
}

export async function getMotorsportNavigation(locale: Locale) {
  const filters = { "filters[siteScope][$eq]": "motorsport" };
  const [english, localized] = await Promise.all([
    fetchStrapiList<RawItem>("top-navigation-items", {
      filters,
      sort: "displayOrder:asc",
      limit: 100,
      locale: "en",
      revalidate: NAVIGATION_REVALIDATE_SECONDS,
    }),
    locale === "en"
      ? Promise.resolve(null)
      : fetchStrapiList<RawItem>("top-navigation-items", {
          filters,
          sort: "displayOrder:asc",
          limit: 100,
          locale,
          revalidate: NAVIGATION_REVALIDATE_SECONDS,
        }),
  ]);
  if (!english?.data.length) {
    return {
      source: "repository" as const,
      items: MOTORSPORT_NAVIGATION.map((item, index) => ({
        internalName: `repository-${index}`,
        ...item,
        label:
          locale === "id"
            ? ({
                Home: "Beranda",
                About: "Tentang",
                Event: "Acara",
                News: "Berita",
                Gallery: "Galeri",
                Merchandise: "Merchandise",
                Contact: "Kontak",
                Ticket: "Tiket",
              }[item.label] ?? item.label)
            : item.label,
        emphasis:
          item.href === "/tickets"
            ? ("primaryCta" as const)
            : ("default" as const),
        openInNewTab: false,
        displayOrder: index * 10,
      })),
    };
  }
  const translated = new Map(
    (localized?.data ?? []).map((item) => [item.documentId, item]),
  );
  const items = english.data
    .filter((item) => item.enabled && safe(item))
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .slice(0, 8)
    .map((item) => {
      const copy = locale === "id" ? translated.get(item.documentId) : item;
      return {
        internalName: item.internalName,
        label: copy?.label ?? item.label,
        ariaLabel: copy?.ariaLabel ?? item.ariaLabel,
        href: item.href,
        external: !item.href.startsWith("/"),
        emphasis: item.emphasis,
        openInNewTab: item.openInNewTab,
        displayOrder: item.displayOrder,
      };
    });
  return { source: "cms" as const, items };
}
