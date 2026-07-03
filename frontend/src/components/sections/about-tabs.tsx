"use client";

import { useId, useRef, useState, type UIEvent } from "react";
import type { AboutTab } from "@/lib/mock-data";

export function AboutTabs({ tabs }: { tabs: AboutTab[] }) {
  const baseId = useId();
  const [activeId, setActiveId] = useState(tabs[0]?.id);
  const [scrollProgress, setScrollProgress] = useState(0);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const activeTab = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  function selectTab(id: AboutTab["id"]) {
    setActiveId(id);
    setScrollProgress(0);
  }

  function selectAndFocus(id: AboutTab["id"]) {
    selectTab(id);
    tabRefs.current[id]?.focus();
  }

  function onKeyDown(event: React.KeyboardEvent, index: number) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (index + direction + tabs.length) % tabs.length;
    selectAndFocus(tabs[nextIndex].id);
  }

  function onTimelineScroll(event: UIEvent<HTMLDivElement>) {
    const viewport = event.currentTarget;
    const scrollableDistance = viewport.scrollHeight - viewport.clientHeight;
    setScrollProgress(
      scrollableDistance > 0 ? viewport.scrollTop / scrollableDistance : 0,
    );
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="About Sarga"
        className="flex overflow-x-auto border-b border-sarga-text/25 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((tab, index) => {
          const selected = tab.id === activeId;
          return (
            <button
              key={tab.id}
              ref={(node) => {
                tabRefs.current[tab.id] = node;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => selectTab(tab.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={`relative min-w-max flex-1 px-4 pb-5 text-left text-[0.68rem] font-extrabold uppercase tracking-[0.14em] transition-colors sm:text-center sm:text-xs lg:text-sm ${
                selected
                  ? "text-sarga-red after:absolute after:inset-x-0 after:bottom-[-1px] after:h-1 after:bg-sarga-red"
                  : "text-sarga-text hover:text-sarga-red"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel-${activeTab.id}`}
        aria-labelledby={`${baseId}-tab-${activeTab.id}`}
        className="pt-9"
      >
        {activeTab.items.length > 0 ? (
          <div className="grid lg:grid-cols-[2px_minmax(0,1fr)] lg:gap-10">
            <div
              aria-hidden="true"
              className="relative hidden bg-sarga-border lg:block"
              data-testid="timeline-scroll-track"
            >
              <span
                className="absolute inset-x-0 top-0 h-[62%] bg-sarga-text transition-transform duration-150"
                style={{
                  transform: `translateY(${scrollProgress * 61.3}%)`,
                }}
              />
            </div>
            <div
              className="about-timeline-scroll lg:max-h-[28.5rem] lg:overflow-y-auto lg:pr-3"
              data-testid="timeline-scroll-viewport"
              onScroll={onTimelineScroll}
            >
              <ol>
                {activeTab.items.map((item) => (
                  <li
                    key={`${activeTab.id}-${item.title}`}
                    className="min-h-[11rem] border-b border-sarga-black/15 py-8 first:pt-0 last:border-b-0 last:pb-0"
                  >
                    <div className="grid gap-5 sm:grid-cols-[8.5rem_1fr] sm:items-start">
                      <div
                        aria-hidden="true"
                        className={`aspect-[4/3] overflow-hidden ${item.imageClass}`}
                      >
                        <span className="block h-full w-full bg-[linear-gradient(135deg,transparent_35%,rgba(255,255,255,.22)_35%_50%,transparent_50%)]" />
                      </div>
                      <div>
                        <p className="text-xs font-extrabold uppercase tracking-[0.04em] text-sarga-red sm:text-sm">
                          {item.meta}
                        </p>
                        <h3 className="mt-3 max-w-2xl font-heading text-2xl font-black uppercase leading-[0.95] tracking-[-0.035em] text-sarga-text sm:text-3xl">
                          {item.title}
                        </h3>
                        <p className="mt-4 max-w-3xl text-sm leading-7 text-sarga-text-muted sm:text-base">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ) : (
          <div className="border-l-[3px] border-sarga-text py-5 pl-8 sm:pl-10">
            <p className="max-w-2xl text-base leading-7 text-sarga-text-muted">
              {activeTab.emptyMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
