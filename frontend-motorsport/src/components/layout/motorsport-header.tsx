"use client";

import { LocaleLink as Link } from "@/components/i18n/locale-link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { MotorsportLogo } from "@/components/ui/brand-logo";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import type { LinkItem } from "@/types/design-system";
import type { SiteNavigationItem } from "@/lib/navigation-cms";
import type { Locale } from "@/lib/i18n/config";
import type { MotorsportDictionary } from "@/lib/i18n/dictionaries";
import { localizeExternalSiteHref, stripLocalePrefix } from "@/lib/i18n/config";
import { MotorsportLanguageSelector } from "@/components/i18n/language-selector";

type MotorsportHeaderProps = {
  navigation: SiteNavigationItem[];
  ticketLink?: SiteNavigationItem;
  gatewayLink?: LinkItem;
  logoHref?: string;
  locale: Locale;
  dictionary: MotorsportDictionary;
  navigationSource: "cms" | "repository";
  logoSrc?: string;
  logoAlt?: string;
  eventChildren?: LinkItem[];
};

export function MotorsportHeader({
  navigation,
  ticketLink,
  gatewayLink,
  logoHref = "/",
  locale,
  dictionary,
  navigationSource,
  logoSrc,
  logoAlt,
  eventChildren = [],
}: MotorsportHeaderProps) {
  const pathname = usePathname();
  const normalizedPath = stripLocalePrefix(pathname);
  const [open, setOpen] = useState(false);
  const [eventOpen, setEventOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const eventMenuRef = useRef<HTMLDivElement>(null);
  const mobileEventMenuRef = useRef<HTMLDivElement>(null);
  const visibleNavigation = navigation.filter(
    (item) => item.href !== "/events" || eventChildren.length > 0,
  );

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = menuPanelRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    const focusTimer = window.setTimeout(() => {
      focusable?.[0]?.focus();
    }, 320);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab" || !focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!eventOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      const isInsideDesktopMenu = eventMenuRef.current?.contains(target);
      const isInsideMobileMenu = mobileEventMenuRef.current?.contains(target);
      if (!isInsideDesktopMenu && !isInsideMobileMenu) {
        setEventOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setEventOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [eventOpen]);

  return (
    <header
      data-navigation-source={navigationSource}
      className="sticky top-0 z-50 isolate overflow-visible border-b border-ms-warm-white/12 bg-(--ms-nav-surface) text-ms-warm-white backdrop-blur-xl"
    >
      <div className="absolute inset-x-0 top-0 h-0.5 bg-[linear-gradient(90deg,#E8192C_0_38%,#FF6B00_38%_60%,#F5C800_60%_72%,#00C4CC_72%_84%,#0033A0_84%)]" />
      <div className="ms-shell grid h-(--ms-header-height) grid-cols-[1fr_auto] items-center gap-4 xl:grid-cols-[minmax(11rem,1fr)_auto_minmax(11rem,1fr)]">
        <Link href={logoHref} aria-label={dictionary.home} className="shrink-0">
          <MotorsportLogo
            src={logoSrc}
            alt={logoAlt}
            variant="symbol-sport"
            priority
          />
        </Link>

        <nav
          className="hidden justify-self-center xl:flex xl:items-center xl:gap-0.5"
          aria-label={dictionary.primaryNavigation}
        >
          {visibleNavigation.map((item) => {
            const active =
              normalizedPath === item.href ||
              (item.href !== "/" && normalizedPath.startsWith(item.href));
            const isTicket = item.href === ticketLink?.href;
            const isEvent = item.href === "/events";

            if (isEvent) {
              return (
                <div key={item.href} ref={eventMenuRef} className="relative">
                  <button
                    type="button"
                    aria-expanded={eventOpen}
                    aria-haspopup="menu"
                    aria-controls="motorsport-event-menu"
                    onClick={() => setEventOpen((value) => !value)}
                    className={`ms-nav-label relative px-2.5 py-8 transition-colors after:absolute after:inset-x-2.5 after:bottom-0 after:h-0.5 after:origin-left after:bg-ms-electric-yellow after:transition-transform ${
                      active
                        ? "text-ms-warm-white after:scale-x-100"
                        : "text-ms-warm-white/58 after:scale-x-0 hover:text-ms-warm-white hover:after:scale-x-100"
                    }`}
                  >
                    {item.label}
                    <span className="ml-1 text-[0.55rem]" aria-hidden="true">
                      {eventOpen ? "▲" : "▼"}
                    </span>
                  </button>
                  {eventOpen ? (
                    <div
                      id="motorsport-event-menu"
                      role="menu"
                      className="absolute left-1/2 top-full z-[100] min-w-64 -translate-x-1/2 border border-ms-warm-white/14 bg-(--ms-nav-surface) p-2 shadow-2xl"
                    >
                      {eventChildren.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          role="menuitem"
                          onClick={() => setEventOpen(false)}
                          className="ms-nav-label block px-4 py-3 text-left text-ms-warm-white/72 transition-colors hover:bg-ms-apex-crimson hover:text-ms-warm-white focus:bg-ms-apex-crimson focus:text-ms-warm-white"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
                aria-current={active ? "page" : undefined}
                className={
                  isTicket
                    ? `ms-nav-label ml-2 border px-4 py-2.5 transition-colors ${
                        active
                          ? "border-ms-apex-crimson bg-ms-apex-crimson text-ms-warm-white"
                          : "border-ms-warm-white/35 text-ms-warm-white hover:border-ms-ignition-orange hover:bg-ms-ignition-orange"
                      }`
                    : `ms-nav-label relative px-2.5 py-8 transition-colors after:absolute after:inset-x-2.5 after:bottom-0 after:h-0.5 after:origin-left after:bg-ms-electric-yellow after:transition-transform ${
                        active
                          ? "text-ms-warm-white after:scale-x-100"
                          : "text-ms-warm-white/58 after:scale-x-0 hover:text-ms-warm-white hover:after:scale-x-100"
                      }`
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden justify-self-end gap-3 xl:flex xl:items-center">
          <MotorsportLanguageSelector locale={locale} dictionary={dictionary} />
          {gatewayLink ? (
            <a
              href={localizeExternalSiteHref(gatewayLink.href, locale)}
              target={gatewayLink.external ? "_blank" : undefined}
              rel={gatewayLink.external ? "noreferrer" : undefined}
              className="border-l border-ms-warm-white/14 pl-4 text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-ms-warm-white/55 transition-colors hover:text-ms-warm-white"
            >
              {gatewayLink.label}
            </a>
          ) : null}
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          className="col-start-2 grid size-11 place-items-center justify-self-end border border-ms-warm-white/20 text-ms-warm-white xl:col-start-3 xl:hidden"
          aria-expanded={open}
          aria-controls="motorsport-mobile-menu"
          aria-label={
            open ? dictionary.closeNavigation : dictionary.openNavigation
          }
          onClick={() => setOpen((value) => !value)}
        >
          {open ? (
            <CloseIcon className="size-5" />
          ) : (
            <MenuIcon className="size-5" />
          )}
        </button>
      </div>

      <div
        ref={menuPanelRef}
        id="motorsport-mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Motorsport navigation"
        className={`absolute inset-x-0 top-full z-50 h-[calc(100dvh-var(--ms-header-height))] overflow-y-auto bg-[#050505] px-(--ms-page-gutter) py-5 transition-[opacity,visibility] duration-300 xl:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav
          className="flex min-h-full flex-col"
          aria-label={dictionary.mobileNavigation}
        >
          <div className="border-t border-ms-warm-white/12">
            {visibleNavigation.map((item) => {
              const isTicket = item.href === ticketLink?.href;
              const isEvent = item.href === "/events";
              const active =
                normalizedPath === item.href ||
                (item.href !== "/" && normalizedPath.startsWith(item.href));

              if (isEvent) {
                  return (
                    <div
                      key={item.href}
                      ref={mobileEventMenuRef}
                      className="border-b border-ms-warm-white/12"
                    >
                    <button
                      type="button"
                      aria-expanded={eventOpen}
                      aria-controls="motorsport-mobile-event-menu"
                      onClick={() => setEventOpen((value) => !value)}
                      className="group grid w-full grid-cols-[minmax(0,1fr)_auto] items-center px-1 py-3 text-left"
                    >
                      <span className="font-display text-[clamp(1.25rem,5.2vw,2.25rem)] font-black uppercase leading-[1.04] transition-colors group-hover:text-ms-ignition-orange">
                        {item.label}
                      </span>
                      <span className="ms-data-label text-ms-warm-white/40">
                        {eventOpen ? "Close" : "Open"} ↗
                      </span>
                    </button>
                    {eventOpen ? (
                      <div
                        id="motorsport-mobile-event-menu"
                        role="menu"
                        className="mb-3 ml-4 border-l border-ms-warm-white/14 pl-4"
                      >
                        {eventChildren.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            role="menuitem"
                            onClick={(event) => {
                              event.stopPropagation();
                              setEventOpen(false);
                              setOpen(false);
                            }}
                            className="block border-b border-ms-warm-white/10 py-2.5 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-ms-warm-white/68 hover:text-ms-electric-yellow"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noreferrer" : undefined}
                  onClick={() => {
                    setEventOpen(false);
                    setOpen(false);
                  }}
                  aria-current={active ? "page" : undefined}
                  className={`group mt-1 grid grid-cols-[minmax(0,1fr)_auto] items-center border-b px-1 py-3 ${
                    isTicket
                      ? "border-ms-crimson-700 bg-ms-crimson-700 px-5 text-ms-warm-white"
                      : "border-ms-warm-white/12"
                  }`}
                >
                  <span className="font-display text-[clamp(1.25rem,5.2vw,2.25rem)] font-black uppercase leading-[1.04] transition-colors group-hover:text-ms-ignition-orange">
                    {item.label}
                  </span>
                  <span
                    className={`ms-data-label ${isTicket ? "text-ms-warm-white/75" : "text-ms-warm-white/40"}`}
                  >
                    {active ? dictionary.current : dictionary.open} ↗
                  </span>
                </Link>
              );
            })}
          </div>
          <div className="mt-auto flex flex-col gap-3 pt-5 sm:flex-row">
            <MotorsportLanguageSelector
              locale={locale}
              dictionary={dictionary}
              mobile
            />
            {gatewayLink ? (
              <a
                href={localizeExternalSiteHref(gatewayLink.href, locale)}
                className="border border-ms-warm-white/20 px-6 py-4 text-center text-xs font-bold uppercase tracking-[0.16em]"
              >
                {gatewayLink.label}
              </a>
            ) : null}
          </div>
        </nav>
      </div>
    </header>
  );
}
