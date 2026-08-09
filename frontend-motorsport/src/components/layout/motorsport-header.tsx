"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { MotorsportLogo } from "@/components/ui/brand-logo";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import type { LinkItem } from "@/types/design-system";

type MotorsportHeaderProps = {
  navigation: LinkItem[];
  ticketLink?: LinkItem;
  gatewayLink?: LinkItem;
  logoHref?: string;
};

export function MotorsportHeader({
  navigation,
  ticketLink,
  gatewayLink,
  logoHref = "/",
}: MotorsportHeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);

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

  return (
    <header className="sticky top-0 z-50 border-b border-ms-warm-white/12 bg-(--ms-nav-surface) backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-[linear-gradient(90deg,#E8192C_0_38%,#FF6B00_38%_60%,#F5C800_60%_72%,#00C4CC_72%_84%,#0033A0_84%)]" />
      <div className="ms-shell grid h-(--ms-header-height) grid-cols-[1fr_auto] items-center gap-4 xl:grid-cols-[minmax(11rem,1fr)_auto_minmax(11rem,1fr)]">
        <Link
          href={logoHref}
          aria-label="Sarga Motorsport home"
          className="shrink-0"
        >
          <MotorsportLogo variant="symbol-sport" priority />
        </Link>

        <nav
          className="hidden justify-self-center xl:flex xl:items-center xl:gap-0.5"
          aria-label="Primary navigation"
        >
          {navigation.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            const isTicket = item.href === ticketLink?.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
                aria-current={active ? "page" : undefined}
                className={
                  isTicket
                    ? `ml-2 border px-4 py-2.5 text-[0.6875rem] font-extrabold uppercase tracking-[0.12em] transition-colors ${
                        active
                          ? "border-ms-apex-crimson bg-ms-apex-crimson text-ms-warm-white"
                          : "border-ms-warm-white/35 text-ms-warm-white hover:border-ms-ignition-orange hover:bg-ms-ignition-orange"
                      }`
                    : `relative px-2.5 py-8 text-[0.6875rem] font-extrabold uppercase tracking-[0.12em] transition-colors after:absolute after:inset-x-2.5 after:bottom-0 after:h-0.5 after:origin-left after:bg-ms-electric-yellow after:transition-transform ${
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

        <div className="hidden justify-self-end xl:flex xl:items-center">
          {gatewayLink ? (
            <a
              href={gatewayLink.href}
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
          aria-label={open ? "Close navigation" : "Open navigation"}
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
        className={`absolute inset-x-0 top-full z-50 h-[calc(100dvh-var(--ms-header-height))] overflow-y-auto bg-[#050505] px-(--ms-page-gutter) py-8 transition-[opacity,visibility] duration-300 xl:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav
          className="flex min-h-full flex-col"
          aria-label="Mobile navigation"
        >
          <div className="border-t border-ms-warm-white/12">
            {navigation.map((item) => {
              const isTicket = item.href === ticketLink?.href;
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noreferrer" : undefined}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`group mt-2 grid grid-cols-[minmax(0,1fr)_auto] items-center border-b px-1 py-4 ${
                    isTicket
                      ? "border-ms-crimson-700 bg-ms-crimson-700 px-5 text-ms-warm-white"
                      : "border-ms-warm-white/12"
                  }`}
                >
                  <span className="font-display text-[clamp(1.5rem,7vw,2.75rem)] font-black uppercase leading-[1.04] transition-colors group-hover:text-ms-ignition-orange">
                    {item.label}
                  </span>
                  <span
                    className={`ms-data-label ${isTicket ? "text-ms-warm-white/75" : "text-ms-warm-white/40"}`}
                  >
                    {active ? "Current" : "Open"} ↗
                  </span>
                </Link>
              );
            })}
          </div>
          <div className="mt-auto flex flex-col gap-4 pt-8 sm:flex-row">
            {gatewayLink ? (
              <a
                href={gatewayLink.href}
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
