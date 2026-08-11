import type { Locale } from "@/lib/i18n/config";

export type NavigationLinkType = "internal" | "crossSite" | "external";
export type NavigationEmphasis = "default" | "primaryCta";

export type NavigationItem = {
  internalName: string;
  href: string;
  label: string;
  ariaLabel?: string;
  linkType: NavigationLinkType;
  emphasis: NavigationEmphasis;
  openInNewTab: boolean;
  displayOrder: number;
  enabled: boolean;
};

export type RawNavigationItem = NavigationItem & {
  documentId: string;
  siteScope: string;
  locale: Locale;
};

export type NavigationResolution = {
  items: NavigationItem[];
  configured: boolean;
  source: "cms" | "repository";
  labelFallback: boolean;
};

export function isSafeNavigationHref(
  href: string,
  linkType: NavigationLinkType,
): boolean {
  if (/^[\u0000-\u001f\u007f]|[\\]/.test(href)) return false;
  if (linkType === "internal") {
    return href.startsWith("/") && !href.startsWith("//");
  }

  try {
    const url = new URL(href);
    return (
      url.protocol === "https:" ||
      (url.protocol === "http:" &&
        ["localhost", "127.0.0.1"].includes(url.hostname))
    );
  } catch {
    return false;
  }
}

export function resolveNavigationDocuments(
  english: RawNavigationItem[],
  localized: RawNavigationItem[],
  locale: Locale,
): Pick<NavigationResolution, "items" | "labelFallback"> {
  const localizedByDocument = new Map(
    localized.map((item) => [item.documentId, item]),
  );
  let labelFallback = false;

  const items = english
    .filter((item) => item.siteScope === "gateway" && item.enabled)
    .sort(
      (left, right) =>
        left.displayOrder - right.displayOrder ||
        left.internalName.localeCompare(right.internalName),
    )
    .slice(0, 8)
    .flatMap((master) => {
      if (!isSafeNavigationHref(master.href, master.linkType)) return [];
      const translation =
        locale === "en" ? master : localizedByDocument.get(master.documentId);
      if (locale === "id" && !translation) labelFallback = true;
      return [
        {
          internalName: master.internalName,
          href: master.href,
          label: translation?.label ?? master.label,
          ariaLabel: translation?.ariaLabel ?? master.ariaLabel,
          linkType: master.linkType,
          emphasis: master.emphasis,
          openInNewTab: master.openInNewTab,
          displayOrder: master.displayOrder,
          enabled: master.enabled,
        },
      ];
    });

  return { items, labelFallback };
}
