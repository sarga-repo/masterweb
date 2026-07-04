"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-ms-warm-white/12 bg-(--ms-nav-surface) backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-[linear-gradient(90deg,#E8192C_0_38%,#FF6B00_38%_60%,#F5C800_60%_72%,#00C4CC_72%_84%,#0033A0_84%)]" />
      <div className="ms-shell grid h-(--ms-header-height) grid-cols-[auto_1fr_auto] items-center gap-6">
        <Link
          href={logoHref}
          aria-label="Sarga Motorsport home"
          className="shrink-0"
        >
          <MotorsportLogo variant="symbol-sport" priority />
        </Link>

        <nav
          className="hidden justify-self-center border-x border-ms-warm-white/10 px-8 lg:flex lg:items-center lg:gap-7"
          aria-label="Primary navigation"
        >
          {navigation.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
                aria-current={active ? "page" : undefined}
                className={`relative py-8 text-[0.62rem] font-extrabold uppercase tracking-[0.17em] transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:bg-ms-electric-yellow after:transition-transform ${
                  active
                    ? "text-ms-warm-white after:scale-x-100"
                    : "text-ms-warm-white/58 after:scale-x-0 hover:text-ms-warm-white hover:after:scale-x-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <span className="ms-data-label flex items-center gap-2 text-ms-slipstream-teal">
            <span
              className="size-1.5 bg-ms-slipstream-teal"
              aria-hidden="true"
            />
            Race control
          </span>
          {gatewayLink ? (
            <a
              href={gatewayLink.href}
              target={gatewayLink.external ? "_blank" : undefined}
              rel={gatewayLink.external ? "noreferrer" : undefined}
              className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-ms-warm-white/45 transition-colors hover:text-ms-warm-white"
            >
              {gatewayLink.label}
            </a>
          ) : null}
          {ticketLink ? (
            <Link
              href={ticketLink.href}
              className="border-l border-ms-warm-white/16 bg-ms-apex-crimson px-5 py-3 text-[0.64rem] font-black uppercase tracking-[0.16em] text-ms-warm-white transition-colors hover:bg-ms-ignition-orange"
            >
              {ticketLink.label}
            </Link>
          ) : null}
        </div>

        <button
          type="button"
          className="grid size-11 place-items-center border border-ms-warm-white/20 text-ms-warm-white lg:hidden"
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
        id="motorsport-mobile-menu"
        className={`absolute inset-x-0 top-full z-50 h-[calc(100dvh-var(--ms-header-height))] overflow-y-auto bg-[#050505] px-(--ms-page-gutter) py-10 transition-[opacity,visibility] duration-300 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav
          className="flex min-h-full flex-col"
          aria-label="Mobile navigation"
        >
          <div className="border-t border-ms-warm-white/12">
            {navigation.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="group grid grid-cols-[3rem_1fr_auto] items-center border-b border-ms-warm-white/12 py-5"
              >
                <span className="ms-data-label text-ms-warm-white/32">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-[clamp(1.8rem,9vw,3.25rem)] font-black uppercase leading-none transition-colors group-hover:text-ms-apex-crimson">
                  {item.label}
                </span>
                <span className="ms-data-label text-ms-warm-white/30">
                  Open ↗
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-auto flex flex-col gap-4 pt-10 sm:flex-row">
            {ticketLink ? (
              <Link
                href={ticketLink.href}
                onClick={() => setOpen(false)}
                className="bg-ms-apex-crimson px-6 py-4 text-center text-xs font-black uppercase tracking-[0.16em]"
              >
                {ticketLink.label}
              </Link>
            ) : null}
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
