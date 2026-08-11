import "server-only";
import { headers } from "next/headers";
import {
  DEFAULT_LOCALE,
  isLocale,
  stripLocalePrefix,
  type Locale,
} from "./config";

export async function getRequestLocale(): Promise<Locale> {
  const value = (await headers()).get("x-sarga-locale");
  return isLocale(value) ? value : DEFAULT_LOCALE;
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
