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
  const value = (await headers()).get("x-sarga-locale");
  if (isLocale(value)) return value;

  // Some reverse proxies drop custom request headers during an internal
  // rewrite. The middleware also stamps the locale cookie on that request so
  // production renders keep the locale selected in the URL.
  const cookieValue = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(cookieValue) ? cookieValue : DEFAULT_LOCALE;
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
