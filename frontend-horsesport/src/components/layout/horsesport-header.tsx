"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HorseSportLogo } from "@/components/ui/brand-logo";
import { ArrowRightIcon, ArrowUpRightIcon, MenuIcon, CloseIcon } from "@/components/ui/icons";
import type { LinkItem } from "@/types/design-system";

type HorseSportHeaderProps = {
  navigation: LinkItem[];
  ticketLink: LinkItem;
  gatewayLink: LinkItem;
  motorsportLink: LinkItem;
};

/**
 * Premium floating glass island header — Editorial Luxury direction.
 *
 * Detached pill-shaped container with heavy backdrop-blur, suspended from the
 * top of the viewport. Desktop: logo left, nav center, CTA right.
 * Mobile: logo left, hamburger right → fullscreen overlay with staggered
 * link reveals and hamburger → X morph.
 */
export function HorseSportHeader({
  navigation,
  ticketLink,
  gatewayLink,
  motorsportLink,
}: HorseSportHeaderProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on Escape
  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
  }, []);
  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* Floating island pill */}
      <header
        className="fixed inset-x-0 top-4 z-50 flex justify-center px-4 sm:top-5 sm:px-6"
        role="banner"
      >
        <nav
          className="flex w-full max-w-[86rem] items-center justify-between rounded-full border border-hs-cream/10 bg-hs-white/85 px-5 py-3 shadow-[0_0.75rem_2.5rem_rgb(20_20_25_/_0.12)] backdrop-blur-2xl sm:px-7 sm:py-3.5"
          aria-label="Primary navigation"
        >
          {/* Logo */}
          <Link href="/" className="shrink-0" aria-label="Sarga Horse Sport — Home">
            <HorseSportLogo variant="black" className="w-[clamp(8rem,13vw,11rem)]" priority />
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden items-center gap-1 lg:flex" role="list">
            {navigation.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`hs-kicker relative rounded-full px-4 py-2.5 text-[0.78rem] font-semibold tracking-[0.06em] transition-colors duration-350 ${
                      active
                        ? "text-hs-orange"
                        : "text-hs-cream/88 hover:text-hs-orange"
                    }`}
                  >
                    {link.label}
                    {active ? (
                      <span
                        aria-hidden
                        className="absolute inset-x-3 -bottom-px h-[2px] rounded-full bg-hs-orange/60"
                      />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop CTA + hamburger */}
          <div className="flex items-center gap-3">
            <Link
              href={ticketLink.href}
              className="hs-cta-primary hidden sm:inline-flex"
            >
              <span className="px-2">{ticketLink.label}</span>
              <span className="hs-cta-icon-circle">
                <ArrowRightIcon className="size-3.5" />
              </span>
            </Link>

            {/* Hamburger — morphs to X */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="relative grid size-10 place-items-center rounded-full border border-hs-cream/10 bg-hs-cream/[0.04] text-hs-cream/75 backdrop-blur-sm transition-colors duration-300 hover:border-hs-cream/25 hover:text-hs-cream lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <span
                className={`absolute transition-all duration-400 ${
                  open ? "rotate-45 opacity-0" : "rotate-0 opacity-100"
                }`}
              >
                <MenuIcon className="size-5" />
              </span>
              <span
                className={`absolute transition-all duration-400 ${
                  open ? "rotate-0 opacity-100" : "-rotate-45 opacity-0"
                }`}
              >
                <CloseIcon className="size-5" />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Fullscreen mobile overlay */}
      <div
        className={`fixed inset-0 z-40 flex flex-col bg-hs-black/92 backdrop-blur-3xl transition-all duration-600 lg:hidden ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        {/* Decorative atmosphere */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/3 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-8 blur-3xl"
          style={{ background: "radial-gradient(circle, rgb(255 107 0 / 0.6), transparent 70%)" }}
        />

        {/* Spacer for the floating header height */}
        <div className="h-24 shrink-0" />

        {/* Nav links — staggered reveal */}
        <nav className="flex flex-1 flex-col items-center justify-center gap-1 px-6" aria-label="Mobile navigation">
          {navigation.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`hs-display text-[clamp(2rem,6vw,3rem)] leading-[1.1] transition-all duration-500 ${
                open
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0"
              } ${
                isActive(link.href) ? "text-hs-orange" : "text-hs-cream/72 hover:text-hs-cream"
              }`}
              style={{ transitionDelay: open ? `${150 + i * 70}ms` : "0ms" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Cross-site links + CTA */}
        <div
          className={`flex flex-col items-center gap-5 px-6 pb-12 transition-all duration-500 delay-600 ${
            open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <Link
            href={ticketLink.href}
            onClick={() => setOpen(false)}
            className="hs-cta-primary"
          >
            <span className="px-3">{ticketLink.label}</span>
            <span className="hs-cta-icon-circle">
              <ArrowRightIcon className="size-4" />
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <a
              href={gatewayLink.href}
              target={gatewayLink.external ? "_blank" : undefined}
              rel={gatewayLink.external ? "noreferrer" : undefined}
              className="inline-flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-hs-cream/38 transition-colors duration-300 hover:text-hs-cream/70"
            >
              {gatewayLink.label}
              <ArrowUpRightIcon className="size-3" />
            </a>
            <a
              href={motorsportLink.href}
              target={motorsportLink.external ? "_blank" : undefined}
              rel={motorsportLink.external ? "noreferrer" : undefined}
              className="inline-flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-hs-cream/38 transition-colors duration-300 hover:text-hs-cream/70"
            >
              {motorsportLink.label}
              <ArrowUpRightIcon className="size-3" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
