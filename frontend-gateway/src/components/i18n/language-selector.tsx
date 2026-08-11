"use client";

import { usePathname } from "next/navigation";
import {
  LOCALE_COOKIE,
  localizePath,
  stripLocalePrefix,
  type Locale,
} from "@/lib/i18n/config";

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3.8 12h16.4M12 3.5c2.2 2.3 3.3 5.1 3.3 8.5S14.2 18.2 12 20.5M12 3.5C9.8 5.8 8.7 8.6 8.7 12s1.1 6.2 3.3 8.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function LanguageSelector({
  locale,
  mobile = false,
}: {
  locale: Locale;
  mobile?: boolean;
}) {
  const pathname = usePathname();
  const routePath = stripLocalePrefix(pathname);

  return (
    <details className={`group relative ${mobile ? "w-full" : ""}`}>
      <summary
        aria-label={locale === "id" ? "Pilih bahasa" : "Choose language"}
        className={`flex cursor-pointer list-none items-center justify-center gap-2 border border-white/25 font-extrabold uppercase tracking-[0.1em] text-white transition-colors marker:hidden hover:border-white/55 [&::-webkit-details-marker]:hidden ${
          mobile
            ? "min-h-12 w-full px-5 text-sm"
            : "min-h-11 rounded-full px-4 text-[0.66rem]"
        }`}
      >
        <GlobeIcon />
        <span>{locale === "id" ? "Bahasa" : "Language"}</span>
        <span className="text-sarga-red">{locale.toUpperCase()}</span>
        <span
          aria-hidden="true"
          className="text-white/45 transition-transform group-open:rotate-180"
        >
          ▾
        </span>
      </summary>
      <div
        className={`z-50 mt-2 min-w-52 border border-white/15 bg-[var(--gateway-midnight)] p-2 shadow-2xl ${
          mobile ? "relative w-full" : "absolute right-0"
        }`}
      >
        {(["en", "id"] as const).map((option) => {
          const active = option === locale;
          return (
            <a
              key={option}
              href={localizePath(routePath, option)}
              hrefLang={option}
              lang={option}
              aria-current={active ? "true" : undefined}
              onClick={() => {
                document.cookie = `${LOCALE_COOKIE}=${option}; Path=/; Max-Age=31536000; SameSite=Lax`;
              }}
              className={`flex min-h-11 items-center justify-between px-3 text-xs font-bold uppercase tracking-[0.08em] transition-colors ${
                active
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/8 hover:text-white"
              }`}
            >
              <span>{option === "en" ? "English" : "Bahasa Indonesia"}</span>
              {active ? <span className="text-sarga-red">●</span> : null}
            </a>
          );
        })}
      </div>
    </details>
  );
}
