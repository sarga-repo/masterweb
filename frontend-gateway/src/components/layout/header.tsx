"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationItems } from "@/lib/mock-data";
import { Logo } from "@/components/ui/logo";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const mainNav = navigationItems.filter((item) => !item.highlight);
const ticketItem = navigationItems.find((item) => item.highlight);

export function Header() {
  const pathname = usePathname();

  function isActive(href: string): boolean {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-sarga-black/88 text-white backdrop-blur-xl">
      <div className="site-container flex min-h-20 items-center justify-between gap-6 py-3">
        <div className="flex items-center gap-5">
          <Logo variant="reverse" />
          <span className="hidden border-l border-white/20 pl-5 text-[0.6rem] font-bold uppercase leading-4 tracking-[0.2em] text-white/45 sm:block">
            Group
            <br />
            Gateway
          </span>
        </div>

        {/* Desktop navigation */}
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-[0.68rem] font-bold uppercase tracking-[0.12em] xl:gap-9">
            {mainNav.map((item) => {
              const active = isActive(item.href);
              return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`group relative py-3 transition-colors ${
                    active ? "text-white" : "text-white/72 hover:text-white"
                  }`}
                >
                  {item.label}
                  <span className={`absolute inset-x-0 bottom-1 h-px origin-left bg-sarga-red transition-transform duration-300 ${
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`} />
                </Link>
              </li>
              );
            })}
            {ticketItem ? (
              <li>
                <Link
                  href={ticketItem.href}
                  className="inline-flex min-h-11 items-center bg-sarga-red px-5 text-white transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-sarga-red-dark"
                >
                  {ticketItem.label}
                </Link>
              </li>
            ) : null}
          </ul>
        </nav>

        {/* Mobile navigation — no-JS disclosure drawer */}
        <details className="group lg:hidden">
          <summary
            aria-label="Open menu"
            className="flex cursor-pointer list-none items-center gap-2 border border-white/30 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.08em] marker:hidden [&::-webkit-details-marker]:hidden"
          >
            <MenuIcon className="h-4 w-4 group-open:hidden" />
            <CloseIcon className="hidden h-4 w-4 group-open:block" />
            <span className="group-open:hidden">Menu</span>
            <span className="hidden group-open:inline">Close</span>
          </summary>

          {/* Backdrop */}
          <div className="fixed inset-0 top-20 z-40 hidden bg-black/60 group-open:block" />

          <nav
            aria-label="Mobile"
            className="fixed inset-x-0 top-20 z-50 hidden max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-white/10 bg-sarga-black p-5 group-open:block"
          >
            <ul className="flex flex-col gap-1 text-sm font-bold uppercase tracking-[0.06em]">
              {mainNav.map((item) => {
                const active = isActive(item.href);
                return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block rounded-sarga-sm px-4 py-3.5 transition-colors ${
                      active
                        ? "bg-white/10 text-sarga-red"
                        : "text-white/90 hover:bg-white/10 hover:text-sarga-red"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
                );
              })}
            </ul>
            {ticketItem ? (
              <Link
                href={ticketItem.href}
                className={cn(
                  "mt-4 flex items-center justify-center bg-sarga-red px-5 py-3.5",
                  "text-sm font-extrabold uppercase tracking-[0.06em] text-white transition-colors hover:bg-sarga-red-dark",
                )}
              >
                {ticketItem.label}
              </Link>
            ) : null}
          </nav>
        </details>
      </div>
    </header>
  );
}
