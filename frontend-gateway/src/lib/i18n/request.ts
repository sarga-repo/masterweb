import "server-only";

import { headers } from "next/headers";
import {
  DEFAULT_LOCALE,
  isLocale,
  stripLocalePrefix,
  type Locale,
} from "@/lib/i18n/config";

export async function getRequestLocale(): Promise<Locale> {
  const value = (await headers()).get("x-sarga-locale");
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export async function getRequestPathname(): Promise<string> {
  const value = (await headers()).get("x-sarga-pathname");
  return stripLocalePrefix(value || "/");
}
