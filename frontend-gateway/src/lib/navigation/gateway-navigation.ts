import "server-only";

import type { Locale } from "@/lib/i18n/config";
import { getRequestLocale } from "@/lib/i18n/request";
import { navigationItems } from "@/lib/mock-data";
import {
  resolveNavigationDocuments,
  type NavigationItem,
  type NavigationResolution,
  type RawNavigationItem,
} from "@/lib/navigation/contract";
import { strapiFetch } from "@/lib/strapi/client";
import type { StrapiCollectionResponse } from "@/lib/strapi/types";

const QUERY =
  "filters[siteScope][$eq]=gateway&sort=displayOrder:asc&pagination[pageSize]=100";
const NAVIGATION_REVALIDATE_SECONDS = 0;

function repositoryNavigation(locale: Locale): NavigationItem[] {
  const translated = new Map([
    ["About", "Tentang Kami"],
    ["360° Ecosystem", "Ekosistem 360°"],
    ["News & Publication", "Berita & Publikasi"],
    ["Careers", "Karier"],
    ["Get in Touch", "Hubungi Kami"],
    ["Ticket Hub", "Pusat Tiket"],
  ]);

  return navigationItems.map((item, index) => ({
    internalName: `repository-${index}`,
    href: item.href,
    label:
      locale === "id" ? (translated.get(item.label) ?? item.label) : item.label,
    ariaLabel: undefined,
    linkType: "internal",
    emphasis: item.highlight ? "primaryCta" : "default",
    openInNewTab: false,
    displayOrder: (index + 1) * 10,
    enabled: true,
  }));
}

export async function getGatewayNavigation(
  requestedLocale?: Locale,
): Promise<NavigationResolution> {
  const locale = requestedLocale ?? (await getRequestLocale());
  const [englishResponse, localizedResponse] = await Promise.all([
    strapiFetch<StrapiCollectionResponse<RawNavigationItem>>(
      "top-navigation-items",
      {
        query: `locale=en&${QUERY}`,
        revalidate: NAVIGATION_REVALIDATE_SECONDS,
      },
    ),
    locale === "en"
      ? Promise.resolve(null)
      : strapiFetch<StrapiCollectionResponse<RawNavigationItem>>(
          "top-navigation-items",
          {
            query: `locale=${locale}&${QUERY}`,
            revalidate: NAVIGATION_REVALIDATE_SECONDS,
          },
        ),
  ]);

  if (!englishResponse || englishResponse.data.length === 0) {
    return {
      items: repositoryNavigation(locale),
      configured: false,
      source: "repository",
      labelFallback: locale === "id" && !englishResponse,
    };
  }

  const resolved = resolveNavigationDocuments(
    englishResponse.data,
    locale === "en" ? englishResponse.data : (localizedResponse?.data ?? []),
    locale,
  );

  return {
    ...resolved,
    configured: true,
    source: "cms",
  };
}
