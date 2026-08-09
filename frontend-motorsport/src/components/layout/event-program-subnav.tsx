"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { ProgramNavItem } from "@/types/design-system";

type EventProgramSubnavProps = {
  programLabel: string;
  items: ProgramNavItem[];
  cta?: ProgramNavItem;
};

export function EventProgramSubnav({
  programLabel,
  items,
  cta,
}: EventProgramSubnavProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label={`${programLabel} sections`}
      className="sticky top-(--ms-header-height) z-40 border-b border-ms-warm-white/12 bg-ms-black/94 backdrop-blur-xl"
    >
      <div className="ms-shell flex items-stretch gap-5">
        <div className="hidden shrink-0 items-center border-r border-ms-warm-white/12 pr-5 lg:flex">
          <span className="ms-data-label max-w-28 text-ms-slipstream-teal">
            {programLabel}
          </span>
        </div>
        <div className="ms-scrollbar flex min-w-0 flex-1 snap-x overflow-x-auto">
          {items.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative shrink-0 snap-start px-4 py-5 text-[0.64rem] font-extrabold uppercase tracking-[0.13em] transition-colors after:absolute after:inset-x-4 after:bottom-0 after:h-0.5 after:bg-ms-electric-yellow ${
                  active
                    ? "text-ms-warm-white after:scale-x-100"
                    : "text-ms-warm-white/48 after:scale-x-0 hover:text-ms-warm-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
        {cta ? (
          <Link
            href={cta.href}
            aria-current={pathname === cta.href ? "page" : undefined}
            className="flex shrink-0 items-center bg-ms-apex-crimson px-4 text-[0.61rem] font-black uppercase tracking-[0.12em] transition-colors hover:bg-ms-ignition-orange sm:px-5 sm:text-[0.64rem]"
          >
            {cta.label}
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
