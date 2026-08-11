"use client";

import Image from "next/image";
import { LocaleLink as Link } from "@/components/i18n/locale-link";
import {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type UIEvent,
} from "react";
import { ArrowRightIcon } from "@/components/ui/icons";
import type { AboutTab } from "@/lib/mock-data";

export function HomeAboutNavigator({ tabs }: { tabs: AboutTab[] }) {
  const baseId = useId();
  const [activeId, setActiveId] = useState(tabs[0]?.id);
  const [scrollProgress, setScrollProgress] = useState(0);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const activeTab = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  function select(id: AboutTab["id"]) {
    setActiveId(id);
    setScrollProgress(0);
  }

  function focusTab(id: AboutTab["id"]) {
    select(id);
    tabRefs.current[id]?.focus();
  }

  function onKeyDown(event: KeyboardEvent, index: number) {
    if (
      !["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(event.key)
    ) {
      return;
    }
    event.preventDefault();
    const direction = ["ArrowDown", "ArrowRight"].includes(event.key) ? 1 : -1;
    const nextIndex = (index + direction + tabs.length) % tabs.length;
    focusTab(tabs[nextIndex].id);
  }

  function onScroll(event: UIEvent<HTMLDivElement>) {
    const viewport = event.currentTarget;
    const distance = viewport.scrollHeight - viewport.clientHeight;
    setScrollProgress(distance > 0 ? viewport.scrollTop / distance : 0);
  }

  if (!activeTab) return null;

  return (
    <div className="grid overflow-hidden border border-sarga-text/12 bg-white shadow-[var(--gateway-shadow-elevated)] lg:grid-cols-[0.36fr_0.64fr]">
      <div className="gateway-about-menu relative isolate overflow-hidden bg-sarga-text p-6 text-white sm:p-8 lg:p-10">
        <span className="text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-white/58">
          Corporate record
        </span>
        <p className="gateway-card-title mt-5 max-w-[12ch] font-heading uppercase">
          See how the group is built.
        </p>

        <div
          role="tablist"
          aria-label="About Sarga corporate record"
          className="mt-10 flex gap-2 overflow-x-auto [scrollbar-width:none] lg:flex-col lg:gap-0 [&::-webkit-scrollbar]:hidden"
        >
          {tabs.map((tab, index) => {
            const selected = tab.id === activeTab.id;
            return (
              <button
                key={tab.id}
                ref={(node) => {
                  tabRefs.current[tab.id] = node;
                }}
                type="button"
                role="tab"
                id={`${baseId}-home-tab-${tab.id}`}
                aria-selected={selected}
                aria-controls={`${baseId}-home-panel-${tab.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => select(tab.id)}
                onKeyDown={(event) => onKeyDown(event, index)}
                className={`group flex min-w-max items-center justify-between gap-6 border border-white/15 px-5 py-4 text-left text-[0.68rem] font-extrabold uppercase tracking-[0.13em] transition-colors focus-visible:outline-sarga-orange lg:min-w-0 lg:border-x-0 lg:border-t-0 lg:px-0 lg:py-6 ${
                  selected
                    ? "bg-sarga-red text-white lg:bg-transparent lg:text-sarga-orange"
                    : "text-white/62 hover:text-white"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  aria-hidden="true"
                  className={`h-2 w-2 shrink-0 rounded-full transition-colors ${
                    selected ? "bg-sarga-orange" : "bg-white/20"
                  }`}
                />
              </button>
            );
          })}
        </div>

        <Link
          href="/about"
          className="group mt-10 inline-flex items-center gap-4 text-[0.65rem] font-extrabold uppercase tracking-[0.15em] text-white"
        >
          Explore the corporate root
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-home-panel-${activeTab.id}`}
        aria-labelledby={`${baseId}-home-tab-${activeTab.id}`}
        className="relative bg-[#fbf8f3] p-6 sm:p-8 lg:p-10"
      >
        <div className="mb-7 flex items-end justify-between gap-5 border-b border-sarga-text/15 pb-5">
          <div>
            <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-sarga-red-dark">
              Active view
            </p>
            <h3 className="mt-2 font-heading text-2xl font-extrabold uppercase leading-none tracking-[-0.03em] text-sarga-text sm:text-3xl">
              {activeTab.label}
            </h3>
          </div>
          <span className="hidden text-[0.6rem] font-bold uppercase tracking-[0.15em] text-sarga-text-muted sm:block">
            Scroll to explore
          </span>
        </div>

        {activeTab.items.length > 0 ? (
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute inset-y-0 right-0 hidden w-px bg-sarga-text/15 lg:block"
            >
              <span
                className="absolute inset-x-0 top-0 h-24 bg-sarga-red transition-transform duration-150"
                style={{ transform: `translateY(${scrollProgress * 320}%)` }}
              />
            </div>
            <div
              className="home-about-scroll max-h-[31rem] overflow-y-auto pr-1 lg:pr-8"
              onScroll={onScroll}
            >
              <ol className="divide-y divide-sarga-text/15">
                {activeTab.items.map((item) => {
                  const content = (
                    <>
                      <div className="relative aspect-[4/3] overflow-hidden bg-sarga-text/10 sm:aspect-square">
                        {item.image ? (
                          <Image
                            src={item.image.url}
                            alt={item.image.alt}
                            fill
                            sizes="(max-width: 640px) 100vw, 144px"
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.035]"
                          />
                        ) : (
                          <span className="absolute inset-0 bg-[linear-gradient(135deg,#e4301c,#ff6b35_48%,#12141b)] opacity-90" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.13em] text-sarga-red-dark">
                          {item.meta}
                        </p>
                        <h4 className="gateway-card-title mt-3 font-heading uppercase text-sarga-text">
                          {item.title}
                        </h4>
                        <p className="mt-4 max-w-2xl text-sm leading-6 text-sarga-text-muted sm:text-base sm:leading-7">
                          {item.description}
                        </p>
                      </div>
                      {item.href ? (
                        <span className="hidden h-10 w-10 shrink-0 items-center justify-center border border-sarga-text/20 transition-colors group-hover:border-sarga-red group-hover:bg-sarga-red group-hover:text-white sm:flex">
                          <ArrowRightIcon className="h-4 w-4" />
                        </span>
                      ) : null}
                    </>
                  );

                  return (
                    <li key={`${activeTab.id}-${item.title}`}>
                      {item.href ? (
                        <Link
                          href={item.href}
                          className="group grid gap-5 py-7 first:pt-0 sm:grid-cols-[9rem_1fr_auto] sm:items-center"
                        >
                          {content}
                        </Link>
                      ) : (
                        <article className="group grid gap-5 py-7 first:pt-0 sm:grid-cols-[9rem_1fr_auto] sm:items-center">
                          {content}
                        </article>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        ) : (
          <p className="max-w-2xl border-l-2 border-sarga-red py-4 pl-6 text-base leading-7 text-sarga-text-muted">
            {activeTab.emptyMessage}
          </p>
        )}
      </div>
    </div>
  );
}
