"use client";

import { useMemo, useRef, useState } from "react";

import { MerchandiseCard } from "@/components/cards/merchandise-card";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";
import type { MerchandiseItem } from "@/types/design-system";

const ITEMS_PER_PAGE = 16;

type MerchandiseCatalogProps = {
  items: MerchandiseItem[];
};

export function MerchandiseCatalog({ items }: MerchandiseCatalogProps) {
  const [page, setPage] = useState(1);
  const catalogRef = useRef<HTMLDivElement>(null);
  const pageCount = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));
  const visibleItems = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return items.slice(start, start + ITEMS_PER_PAGE);
  }, [items, page]);

  function moveToPage(nextPage: number) {
    const safePage = Math.min(Math.max(nextPage, 1), pageCount);
    if (safePage === page) return;

    setPage(safePage);
    window.requestAnimationFrame(() => {
      catalogRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
      catalogRef.current?.focus({ preventScroll: true });
    });
  }

  return (
    <div ref={catalogRef} tabIndex={-1} className="scroll-mt-28 outline-none">
      <p className="sr-only" aria-live="polite">
        Catalogue page {page} of {pageCount}. Showing {visibleItems.length} of
        {items.length} items.
      </p>

      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4">
        {visibleItems.map((item, index) => (
          <MerchandiseCard
            key={item.slug}
            item={item}
            index={(page - 1) * ITEMS_PER_PAGE + index}
          />
        ))}
      </div>

      {pageCount > 1 ? (
        <nav
          className="mt-16 flex flex-wrap items-center justify-between gap-5 border-t border-ms-warm-white/18 pt-6"
          aria-label="Merchandise catalogue pages"
        >
          <p className="ms-data-label text-ms-warm-white/56">
            Page {String(page).padStart(2, "0")} /{" "}
            {String(pageCount).padStart(2, "0")}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => moveToPage(page - 1)}
              disabled={page === 1}
              className="grid size-12 place-items-center border border-ms-warm-white/20 text-ms-warm-white transition-colors hover:border-ms-electric-yellow hover:text-ms-electric-yellow disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Previous catalogue page"
            >
              <ChevronLeftIcon className="size-5" />
            </button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => moveToPage(pageNumber)}
                  aria-current={page === pageNumber ? "page" : undefined}
                  aria-label={`Catalogue page ${pageNumber}`}
                  className={`grid size-12 place-items-center border text-xs font-black transition-colors ${
                    page === pageNumber
                      ? "border-ms-apex-crimson bg-ms-apex-crimson text-ms-warm-white"
                      : "border-ms-warm-white/20 text-ms-warm-white/62 hover:border-ms-warm-white/55 hover:text-ms-warm-white"
                  }`}
                >
                  {String(pageNumber).padStart(2, "0")}
                </button>
              ),
            )}
            <button
              type="button"
              onClick={() => moveToPage(page + 1)}
              disabled={page === pageCount}
              className="grid size-12 place-items-center border border-ms-warm-white/20 text-ms-warm-white transition-colors hover:border-ms-electric-yellow hover:text-ms-electric-yellow disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Next catalogue page"
            >
              <ChevronRightIcon className="size-5" />
            </button>
          </div>
        </nav>
      ) : null}
    </div>
  );
}
