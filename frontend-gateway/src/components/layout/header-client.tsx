"use client";

import { usePathname } from "next/navigation";
import { LocaleLink as Link } from "@/components/i18n/locale-link";
import { Logo } from "@/components/ui/logo";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import { stripLocalePrefix, type Locale } from "@/lib/i18n/config";
import type { GatewayDictionary } from "@/lib/i18n/dictionaries";
import type { NavigationItem } from "@/lib/navigation/contract";
import { cn } from "@/lib/utils";
import { LanguageSelector } from "@/components/i18n/language-selector";

type HeaderClientProps = {
  locale: Locale;
  items: NavigationItem[];
  dictionary: GatewayDictionary;
  navigationSource: "cms" | "repository";
};

export function HeaderClient({
  locale,
  items,
  dictionary,
  navigationSource,
}: HeaderClientProps) {
  const pathname = usePathname();
  const normalizedPath = stripLocalePrefix(pathname);
  const mainNav = items.filter((item) => item.emphasis !== "primaryCta");
  const ticketItem = items.find((item) => item.emphasis === "primaryCta");

  function isActive(href: string): boolean {
    if (!href.startsWith("/") || href.startsWith("//")) return false;
    const normalizedHref = stripLocalePrefix(href);
    if (normalizedHref === "/") return normalizedPath === "/";
    return (
      normalizedPath === normalizedHref ||
      normalizedPath.startsWith(`${normalizedHref}/`)
    );
  }

  function externalProps(item: NavigationItem) {
    return item.openInNewTab
      ? { target: "_blank" as const, rel: "noopener noreferrer" }
      : {};
  }

  const renderLinkLabel = (item: NavigationItem) => item.label;

  return (
    <header
      className="sticky top-0 z-50 border-b border-white/10 bg-[var(--gateway-midnight)] text-white"
      data-navigation-source={navigationSource}
    >
      <div className="site-container grid min-h-[var(--gateway-header-height)] grid-cols-[1fr_auto] items-center gap-5 py-3 xl:grid-cols-[minmax(10rem,1fr)_auto_minmax(10rem,1fr)]">
        <div className="flex min-w-0 items-center gap-5 xl:col-start-1">
          <Logo variant="reverse" />
          <span className="hidden border-l border-white/20 pl-5 text-[0.6rem] font-bold uppercase leading-4 tracking-[0.2em] text-white/45 2xl:block">
            {dictionary.shell.groupGateway.split(" ").map((part) => (
              <span key={part} className="block">
                {part}
              </span>
            ))}
          </span>
        </div>

        <nav
          aria-label={dictionary.shell.primaryNavigation}
          className="hidden justify-self-center xl:col-start-2 xl:block"
        >
          <ul className="flex items-center gap-6 whitespace-nowrap text-[0.72rem] font-bold uppercase tracking-[0.085em] 2xl:gap-8">
            {mainNav.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.internalName}>
                  <Link
                    href={item.href}
                    aria-label={item.ariaLabel}
                    aria-current={active ? "page" : undefined}
                    className={`group relative py-3 transition-colors ${
                      active ? "text-white" : "text-white/72 hover:text-white"
                    }`}
                    {...externalProps(item)}
                  >
                    {renderLinkLabel(item)}
                    <span
                      className={`absolute inset-x-0 bottom-1 h-px origin-left bg-sarga-red transition-transform duration-300 ${
                        active
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
            {ticketItem ? (
              <li>
                <Link
                  href={ticketItem.href}
                  aria-label={ticketItem.ariaLabel}
                  aria-current={isActive(ticketItem.href) ? "page" : undefined}
                  className="inline-flex min-h-11 items-center border border-white/35 px-5 text-white transition-[background-color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-sarga-red hover:bg-sarga-red aria-[current=page]:border-sarga-red aria-[current=page]:bg-sarga-red"
                  {...externalProps(ticketItem)}
                >
                  {renderLinkLabel(ticketItem)}
                </Link>
              </li>
            ) : null}
            <li>
              <LanguageSelector locale={locale} />
            </li>
          </ul>
        </nav>

        <details className="group justify-self-end xl:hidden">
          <summary
            aria-label={dictionary.shell.openMenu}
            className="flex cursor-pointer list-none items-center gap-2 border border-white/30 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.08em] marker:hidden [&::-webkit-details-marker]:hidden"
          >
            <MenuIcon className="h-4 w-4 group-open:hidden" />
            <CloseIcon className="hidden h-4 w-4 group-open:block" />
            <span className="group-open:hidden">{dictionary.shell.menu}</span>
            <span className="hidden group-open:inline">
              {dictionary.shell.close}
            </span>
          </summary>

          <div className="fixed inset-0 top-[var(--gateway-header-height)] z-40 hidden bg-black/60 group-open:block" />

          <nav
            aria-label={dictionary.shell.mobileNavigation}
            className="fixed inset-x-0 top-[var(--gateway-header-height)] z-50 hidden max-h-[calc(100dvh-var(--gateway-header-height))] overflow-y-auto border-t border-white/10 bg-[var(--gateway-midnight)] p-5 group-open:block"
          >
            <ul className="flex flex-col gap-1 text-sm font-bold uppercase tracking-[0.06em]">
              {mainNav.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.internalName}>
                    <Link
                      href={item.href}
                      aria-label={item.ariaLabel}
                      aria-current={active ? "page" : undefined}
                      className={`block rounded-sarga-sm px-4 py-3.5 transition-colors ${
                        active
                          ? "bg-white/10 text-sarga-red"
                          : "text-white/90 hover:bg-white/10 hover:text-sarga-red"
                      }`}
                      {...externalProps(item)}
                    >
                      {renderLinkLabel(item)}
                    </Link>
                  </li>
                );
              })}
            </ul>
            {ticketItem ? (
              <Link
                href={ticketItem.href}
                aria-label={ticketItem.ariaLabel}
                aria-current={isActive(ticketItem.href) ? "page" : undefined}
                className={cn(
                  "mt-4 flex items-center justify-center bg-sarga-red px-5 py-3.5",
                  "text-sm font-extrabold uppercase tracking-[0.06em] text-white transition-colors hover:bg-sarga-red-dark",
                )}
                {...externalProps(ticketItem)}
              >
                {renderLinkLabel(ticketItem)}
              </Link>
            ) : null}
            <div className="mt-3">
              <LanguageSelector locale={locale} mobile />
            </div>
          </nav>
        </details>
      </div>
    </header>
  );
}
