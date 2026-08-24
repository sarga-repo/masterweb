import "server-only";
import { cookies, headers } from "next/headers";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  isLocale,
  stripLocalePrefix,
  type Locale,
} from "./config";

export async function getRequestLocale(): Promise<Locale> {
  const requestHeaders = await headers();
  const value = requestHeaders.get("x-sarga-locale");
  if (isLocale(value)) return value;

  // Some reverse proxies drop custom request headers during an internal
  // rewrite. The middleware also stamps the locale cookie on that request so
  // production renders keep the locale selected in the URL.
  const cookieValue = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (isLocale(cookieValue)) return cookieValue;

  // The proxy adds this marker to the internal rewrite URL. It is a final
  // fallback for hosts that strip both request header and cookie overrides.
  const rewrite = requestHeaders.get("x-middleware-rewrite");
  if (rewrite) {
    try {
      const marker = new URL(rewrite, "http://localhost").searchParams.get(
        "__sarga_locale",
      );
      if (isLocale(marker)) return marker;
    } catch {
      // Ignore malformed proxy metadata and use the default locale.
    }
  }

  return DEFAULT_LOCALE;
}

export async function getRequestLocaleSafe(): Promise<Locale> {
  try {
    return await getRequestLocale();
  } catch {
    return DEFAULT_LOCALE;
  }
}

export async function getRequestPathname(): Promise<string> {
  return stripLocalePrefix((await headers()).get("x-sarga-pathname") || "/");
}
