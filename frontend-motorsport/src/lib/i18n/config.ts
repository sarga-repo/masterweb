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
  return locale === "en"
    ? normalized
    : normalized === "/"
      ? "/id"
      : `/id${normalized}`;
}

export function localizeHref(href: string, locale: Locale): string {
  if (
    !href.startsWith("/") ||
    href.startsWith("//") ||
    href.startsWith("/api/")
  )
    return href;
  const splitAt = [href.indexOf("#"), href.indexOf("?")]
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0];
  const path = splitAt === undefined ? href : href.slice(0, splitAt);
  return `${localizePath(path, locale)}${splitAt === undefined ? "" : href.slice(splitAt)}`;
}

export function localizeExternalSiteHref(href: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return href;

  try {
    const url = new URL(href);
    url.pathname = localizePath(url.pathname || "/", locale);
    return url.toString();
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
