"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type PillTab = {
  id: string;
  label: string;
  content?: ReactNode;
};

type PillTabsProps = {
  tabs: PillTab[];
  defaultTabId?: string;
  tone?: "dark" | "light";
  className?: string;
  "aria-label"?: string;
};

/**
 * Accessible pill-style tabs. Selection is conveyed via aria-selected and weight,
 * not colour alone (docs/07 accessibility note). Panels render only when a tab
 * provides `content`.
 */
export function PillTabs({
  tabs,
  defaultTabId,
  tone = "dark",
  className,
  "aria-label": ariaLabel = "Content categories",
}: PillTabsProps) {
  const baseId = useId();
  const [activeId, setActiveId] = useState(defaultTabId ?? tabs[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const hasPanels = tabs.some((tab) => tab.content !== undefined);
  const activeTab = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  function focusTab(id: string) {
    setActiveId(id);
    tabRefs.current[id]?.focus();
  }

  function onKeyDown(event: React.KeyboardEvent, index: number) {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const dir = event.key === "ArrowRight" ? 1 : -1;
      const next = (index + dir + tabs.length) % tabs.length;
      focusTab(tabs[next].id);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusTab(tabs[0].id);
    } else if (event.key === "End") {
      event.preventDefault();
      focusTab(tabs[tabs.length - 1].id);
    }
  }

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={ariaLabel}
        className={cn(
          "flex gap-1 overflow-x-auto rounded-sarga-pill border p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          tone === "dark"
            ? "border-white/15 bg-white/5"
            : "border-sarga-border bg-white",
        )}
      >
        {tabs.map((tab, index) => {
          const selected = tab.id === activeId;
          return (
            <button
              key={tab.id}
              ref={(node) => {
                tabRefs.current[tab.id] = node;
              }}
              role="tab"
              type="button"
              id={`${baseId}-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={
                tab.content !== undefined
                  ? `${baseId}-panel-${tab.id}`
                  : undefined
              }
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveId(tab.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                "shrink-0 whitespace-nowrap rounded-sarga-pill px-6 py-2.5 text-xs font-extrabold uppercase tracking-[0.1em] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-sarga-orange sm:text-sm",
                selected
                  ? "bg-sarga-red text-white"
                  : tone === "dark"
                    ? "text-white/60 hover:text-white"
                    : "text-sarga-text-muted hover:text-sarga-text",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {hasPanels && activeTab?.content !== undefined ? (
        <div
          role="tabpanel"
          id={`${baseId}-panel-${activeTab.id}`}
          aria-labelledby={`${baseId}-tab-${activeTab.id}`}
          className="mt-8"
        >
          {activeTab.content}
        </div>
      ) : null}
    </div>
  );
}
