"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import {
  localeFromPathname,
  localizeKnownSiteHref,
} from "@/lib/i18n/config";

export function LocaleLink({
  href,
  ...props
}: ComponentProps<typeof NextLink>) {
  const pathname = usePathname();
  const locale = localeFromPathname(pathname);
  const localizedHref =
    typeof href === "string" ? localizeKnownSiteHref(href, locale) : href;

  return <NextLink href={localizedHref} {...props} />;
}
