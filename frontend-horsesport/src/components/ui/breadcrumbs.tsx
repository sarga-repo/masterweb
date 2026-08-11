import { LocaleLink as Link } from "@/components/i18n/locale-link";

import type { CrumbItem } from "@/types/design-system";

/** Accessible breadcrumb trail for interior/detail pages. */
export function Breadcrumbs({ items }: { items: CrumbItem[] }) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-hs-cream/45">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-2">
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-hs-cream"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={last ? "text-hs-orange" : undefined}
                  aria-current={last ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!last ? (
                <span aria-hidden className="text-hs-cream/25">
                  /
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
