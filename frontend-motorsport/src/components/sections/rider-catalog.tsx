"use client";

import { useMemo, useRef, useState } from "react";

import { RiderProfileCard } from "@/components/cards/rider-profile-card";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";
import type { MotorsportRider } from "@/types/design-system";

const RIDERS_PER_PAGE = 12;
const IJTC_RIDERS_PATH = "/events/indonesia-junior-talent-cup/riders";

export function RiderCatalog({ riders }: { riders: MotorsportRider[] }) {
  const [page, setPage] = useState(1);
  const catalogRef = useRef<HTMLDivElement>(null);
  const pageCount = Math.max(1, Math.ceil(riders.length / RIDERS_PER_PAGE));
  const visibleRiders = useMemo(() => {
    const start = (page - 1) * RIDERS_PER_PAGE;
    return riders.slice(start, start + RIDERS_PER_PAGE);
  }, [page, riders]);

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
    <div ref={catalogRef} tabIndex={-1} className="scroll-mt-32 outline-none">
      <p className="sr-only" aria-live="polite">
        Rider page {page} of {pageCount}. Showing {visibleRiders.length} of{" "}
        {riders.length} riders.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visibleRiders.map((rider, index) => {
          const absoluteIndex = (page - 1) * RIDERS_PER_PAGE + index;
          return (
            <RiderProfileCard
              key={rider.slug}
              rider={rider}
              index={String(absoluteIndex + 1).padStart(2, "0")}
              href={`${IJTC_RIDERS_PATH}/${rider.slug}`}
              compact
            />
          );
        })}
      </div>

      {pageCount > 1 ? (
        <nav
          aria-label="IJTC rider pages"
          className="mt-16 flex flex-wrap items-center justify-between gap-5 border-t border-ms-warm-white/18 pt-6"
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
              aria-label="Previous rider page"
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
                  aria-label={`Rider page ${pageNumber}`}
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
              aria-label="Next rider page"
            >
              <ChevronRightIcon className="size-5" />
            </button>
          </div>
        </nav>
      ) : null}
    </div>
  );
}
