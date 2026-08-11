"use client";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { localeFromPathname, localizeHref } from "@/lib/i18n/config";
export function LocaleLink({
  href,
  ...props
}: ComponentProps<typeof NextLink>) {
  const locale = localeFromPathname(usePathname());
  return (
    <NextLink
      href={typeof href === "string" ? localizeHref(href, locale) : href}
      {...props}
    />
  );
}
