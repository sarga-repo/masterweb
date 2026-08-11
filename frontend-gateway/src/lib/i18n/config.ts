export const SUPPORTED_LOCALES = ["en", "id"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "sarga-locale";

export function isLocale(value: unknown): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}

export function localeFromPathname(pathname: string): Locale {
  return pathname === "/id" || pathname.startsWith("/id/") ? "id" : "en";
}

export function stripLocalePrefix(pathname: string): string {
  if (pathname === "/id") return "/";
  if (pathname.startsWith("/id/")) return pathname.slice(3) || "/";
  return pathname || "/";
}

export function localizePath(pathname: string, locale: Locale): string {
  if (pathname === "") pathname = "/";
  if (!pathname.startsWith("/") || pathname.startsWith("//")) return pathname;
  const normalized = stripLocalePrefix(pathname);
  if (locale === DEFAULT_LOCALE) return normalized;
  return normalized === "/" ? "/id" : `/id${normalized}`;
}

export function localizeHref(href: string, locale: Locale): string {
  if (
    !href.startsWith("/") ||
    href.startsWith("//") ||
    href.startsWith("/api/")
  ) {
    return href;
  }

  const hashIndex = href.indexOf("#");
  const queryIndex = href.indexOf("?");
  const splitAt = [hashIndex, queryIndex]
    .filter((index) => index >= 0)
    .sort((left, right) => left - right)[0];
  const path = splitAt === undefined ? href : href.slice(0, splitAt);
  const suffix = splitAt === undefined ? "" : href.slice(splitAt);
  return `${localizePath(path, locale)}${suffix}`;
}

export function localizeKnownSiteHref(
  href: string,
  locale: Locale,
  configuredSiteUrls: Array<string | undefined> = [
    process.env.NEXT_PUBLIC_GATEWAY_SITE_URL,
    process.env.NEXT_PUBLIC_MOTORSPORT_SITE_URL,
    process.env.NEXT_PUBLIC_HORSESPORT_SITE_URL,
  ],
): string {
  if (href.startsWith("/") && !href.startsWith("//")) {
    return localizeHref(href, locale);
  }
  if (locale === DEFAULT_LOCALE) return href;

  try {
    const destination = new URL(href);
    const knownOrigins = new Set(
      configuredSiteUrls.flatMap((value) => {
        if (!value) return [];
        try {
          return [new URL(value).origin];
        } catch {
          return [];
        }
      }),
    );
    if (!knownOrigins.has(destination.origin)) return href;
    destination.pathname = localizePath(destination.pathname, locale);
    return destination.toString();
  } catch {
    return href;
  }
}

export function localeAlternates(pathname: string) {
  const path = stripLocalePrefix(pathname);
  return {
    en: localizePath(path, "en"),
    id: localizePath(path, "id"),
    "x-default": localizePath(path, "en"),
  };
}
