"use client";
import { usePathname } from "next/navigation";
import {
  LOCALE_COOKIE,
  localizePath,
  stripLocalePrefix,
  type Locale,
} from "@/lib/i18n/config";
import type { MotorsportDictionary } from "@/lib/i18n/dictionaries";

export function MotorsportLanguageSelector({
  locale,
  dictionary,
  mobile = false,
}: {
  locale: Locale;
  dictionary: MotorsportDictionary;
  mobile?: boolean;
}) {
  const routePath = stripLocalePrefix(usePathname());
  const options = [
    { locale: "en" as const, label: "English" },
    { locale: "id" as const, label: "Bahasa Indonesia" },
  ];
  return (
    <details className={`group relative ${mobile ? "w-full" : ""}`}>
      <summary
        aria-label={dictionary.chooseLanguage}
        className={`flex cursor-pointer list-none items-center justify-center gap-2 border border-ms-warm-white/25 bg-black/20 font-extrabold uppercase tracking-[0.12em] text-ms-warm-white marker:hidden hover:border-ms-ignition-orange [&::-webkit-details-marker]:hidden ${mobile ? "min-h-14 w-full px-5 text-xs" : "min-h-11 rounded-full px-4 text-[0.625rem]"}`}
      >
        <span aria-hidden="true">◎</span>
        <span>{dictionary.language}</span>
        <span className="text-ms-electric-yellow">{locale.toUpperCase()}</span>
        <span className="text-ms-warm-white/45 transition-transform group-open:rotate-180">
          ▾
        </span>
      </summary>
      <div
        className={`${mobile ? "relative w-full" : "absolute right-0"} z-50 mt-2 min-w-56 border border-ms-warm-white/14 bg-[#080808] p-2 shadow-2xl`}
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
            className={`flex min-h-11 items-center justify-between px-3 text-[0.6875rem] font-bold uppercase tracking-[0.1em] ${option.locale === locale ? "bg-ms-apex-crimson text-ms-warm-white" : "text-ms-warm-white/60 hover:bg-ms-warm-white/8 hover:text-ms-warm-white"}`}
          >
            <span>{option.label}</span>
            {option.locale === locale ? <span>●</span> : null}
          </a>
        ))}
      </div>
    </details>
  );
}
