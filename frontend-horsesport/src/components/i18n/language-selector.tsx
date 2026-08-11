"use client";
import { usePathname } from "next/navigation";
import {
  LOCALE_COOKIE,
  localizePath,
  stripLocalePrefix,
  type Locale,
} from "@/lib/i18n/config";
import type { HorseSportDictionary } from "@/lib/i18n/dictionaries";

export function HorseSportLanguageSelector({
  locale,
  dictionary,
  mobile = false,
}: {
  locale: Locale;
  dictionary: HorseSportDictionary;
  mobile?: boolean;
}) {
  const routePath = stripLocalePrefix(usePathname());
  const options = [
    { locale: "en" as const, label: "English" },
    { locale: "id" as const, label: "Bahasa Indonesia" },
  ];
  return (
    <details className={`group relative ${mobile ? "w-full max-w-xs" : ""}`}>
      <summary
        aria-label={dictionary.chooseLanguage}
        className={`flex cursor-pointer list-none items-center justify-center gap-2 rounded-full border border-hs-cream/15 bg-hs-black/5 font-semibold uppercase tracking-[0.08em] text-hs-cream marker:hidden transition-colors hover:border-hs-orange/50 [&::-webkit-details-marker]:hidden ${mobile ? "min-h-12 w-full px-5 text-xs" : "min-h-10 px-3.5 text-[0.65rem]"}`}
      >
        <span aria-hidden="true">◎</span>
        <span>{dictionary.language}</span>
        <span className="text-hs-orange">{locale.toUpperCase()}</span>
        <span className="text-hs-cream/40 transition-transform group-open:rotate-180">
          ▾
        </span>
      </summary>
      <div
        className={`${mobile ? "relative w-full" : "absolute right-0"} z-50 mt-2 min-w-56 rounded-2xl border border-hs-cream/10 bg-hs-black/95 p-2 shadow-2xl backdrop-blur-xl`}
      >
        {options.map((option) => (
          <a
            key={option.locale}
            href={localizePath(routePath, option.locale)}
            hrefLang={option.locale}
            lang={option.locale}
            aria-current={option.locale === locale ? "true" : undefined}
            onClick={() => {
              document.cookie = `${LOCALE_COOKIE}=${option.locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
            }}
            className={`flex min-h-11 items-center justify-between rounded-xl px-3 text-xs font-semibold uppercase tracking-[0.08em] ${option.locale === locale ? "bg-hs-orange text-hs-white" : "text-hs-cream/60 hover:bg-hs-cream/8 hover:text-hs-cream"}`}
          >
            <span>{option.label}</span>
            {option.locale === locale ? <span>●</span> : null}
          </a>
        ))}
      </div>
    </details>
  );
}
