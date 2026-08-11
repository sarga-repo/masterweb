"use client";

import { LocaleLink as Link } from "@/components/i18n/locale-link";
import {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type UIEvent,
} from "react";

import { ArrowUpRightIcon } from "@/components/ui/icons";
import { ResilientImage } from "@/components/ui/resilient-image";
import type {
  EcosystemSite,
  MotorsportArticle,
  TeamMember,
} from "@/types/design-system";

type PanelId = "publications" | "leadership" | "ecosystem";

type SargaTimelineProps = {
  publications: MotorsportArticle[];
  leadership: TeamMember[];
  ecosystemSites: EcosystemSite[];
};

const TABS: Array<{ id: PanelId; label: string }> = [
  { id: "publications", label: "History timeline" },
  { id: "leadership", label: "Leadership council" },
  { id: "ecosystem", label: "Sarga ecosystem" },
];

const PUBLICATION_FALLBACKS = [
  "/media/motorsport-design-hero.png",
  "/media/motorcycle-racing-dusk.png",
  "/media/sarga-motorsport-bike-and-rally.png",
];

export function SargaTimeline({
  publications,
  leadership,
  ecosystemSites,
}: SargaTimelineProps) {
  const baseId = useId();
  const viewportRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<PanelId, HTMLButtonElement | null>>({
    publications: null,
    leadership: null,
    ecosystem: null,
  });
  const [activeId, setActiveId] = useState<PanelId>("publications");
  const [scrollProgress, setScrollProgress] = useState(0);

  function selectPanel(id: PanelId) {
    setActiveId(id);
    setScrollProgress(0);
    viewportRef.current?.scrollTo({ top: 0 });
  }

  function onTabKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const direction = event.key === "ArrowDown" ? 1 : -1;
    const nextIndex = (index + direction + TABS.length) % TABS.length;
    const next = TABS[nextIndex];
    selectPanel(next.id);
    tabRefs.current[next.id]?.focus();
  }

  function onPanelScroll(event: UIEvent<HTMLDivElement>) {
    const viewport = event.currentTarget;
    const distance = viewport.scrollHeight - viewport.clientHeight;
    setScrollProgress(distance > 0 ? viewport.scrollTop / distance : 0);
  }

  return (
    <section
      id="sarga-content-hub"
      className="border-y border-ms-warm-white/12 bg-ms-charcoal py-20 sm:py-24 lg:py-28"
    >
      <div className="ms-shell">
        <div className="mb-12 max-w-3xl">
          <p className="ms-kicker text-ms-ignition-orange">
            Part of Sarga.co / Connected records
          </p>
          <h2 className="ms-heading-section mt-4">
            Explore the Sarga network.
          </h2>
          <p className="mt-5 max-w-2xl leading-7 text-ms-warm-white/58">
            Browse published stories, meet the leadership council, and move
            directly between the active Sarga websites.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(14rem,.58fr)_4px_minmax(0,1.42fr)] lg:gap-10">
          <div
            role="tablist"
            aria-label="Explore Sarga content"
            aria-orientation="vertical"
            className="space-y-2"
          >
            {TABS.map((tab, index) => {
              const selected = activeId === tab.id;
              return (
                <button
                  key={tab.id}
                  ref={(node) => {
                    tabRefs.current[tab.id] = node;
                  }}
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${tab.id}`}
                  aria-controls={`${baseId}-panel-${tab.id}`}
                  aria-selected={selected}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => selectPanel(tab.id)}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                  className={`block min-h-16 w-full border-b px-6 py-5 text-left font-display text-lg uppercase leading-none transition-colors sm:text-xl ${
                    selected
                      ? "border-transparent bg-[linear-gradient(90deg,var(--color-ms-ignition-orange),var(--color-ms-apex-crimson),transparent)] text-ms-warm-white"
                      : "border-ms-warm-white/10 text-ms-warm-white/58 hover:border-ms-warm-white/25 hover:text-ms-warm-white"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div
            role="progressbar"
            aria-label="Active panel scroll progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(scrollProgress * 100)}
            className="relative hidden overflow-hidden bg-ms-warm-white/18 lg:block"
          >
            <span
              className="absolute inset-x-0 top-0 h-28 bg-ms-warm-white transition-[top] duration-150"
              style={{ top: `${scrollProgress * 78}%` }}
            />
          </div>

          <div
            ref={viewportRef}
            role="tabpanel"
            id={`${baseId}-panel-${activeId}`}
            aria-labelledby={`${baseId}-tab-${activeId}`}
            tabIndex={0}
            onScroll={onPanelScroll}
            className="ms-scrollbar max-h-[30rem] min-w-0 overflow-y-auto overscroll-contain pr-2 sm:pr-4"
          >
            {activeId === "publications" ? (
              <PublicationList items={publications} />
            ) : null}
            {activeId === "leadership" ? (
              <LeadershipList items={leadership} />
            ) : null}
            {activeId === "ecosystem" ? (
              <EcosystemList items={ecosystemSites} />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function PublicationList({ items }: { items: MotorsportArticle[] }) {
  if (items.length === 0)
    return <EmptyPanel message="No publications are currently published." />;

  return (
    <ol className="divide-y divide-ms-warm-white/12">
      {items.slice(0, 8).map((article, index) => (
        <li key={article.href}>
          <Link
            href={article.href}
            className="group grid min-h-40 gap-5 py-7 first:pt-0 sm:grid-cols-[8.5rem_minmax(0,1fr)_auto] sm:gap-8"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-ms-black">
              <ResilientImage
                src={article.image}
                alt={article.imageAlt}
                fallbackSrc={
                  PUBLICATION_FALLBACKS[index % PUBLICATION_FALLBACKS.length]
                }
                fallbackAlt="Sarga Motorsport publication"
                fill
                sizes="136px"
                className="object-cover transition duration-500 group-hover:scale-[1.04]"
              />
            </div>
            <div>
              <p className="ms-data-label text-ms-ignition-orange">
                {article.publishedLabel} / {article.category}
              </p>
              <h3 className="mt-3 text-xl font-bold leading-tight text-ms-warm-white transition-colors group-hover:text-ms-electric-yellow sm:text-2xl">
                {article.title}
              </h3>
              {article.excerpt ? (
                <p className="mt-3 line-clamp-2 max-w-3xl text-sm leading-6 text-ms-warm-white/56">
                  {article.excerpt}
                </p>
              ) : null}
            </div>
            <ArrowUpRightIcon className="mt-1 hidden size-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 sm:block" />
          </Link>
        </li>
      ))}
    </ol>
  );
}

function LeadershipList({ items }: { items: TeamMember[] }) {
  if (items.length === 0)
    return (
      <EmptyPanel message="Leadership profiles are awaiting publication." />
    );

  return (
    <ol className="divide-y divide-ms-warm-white/12">
      {items.map((person, index) => (
        <li key={`${person.name}-${person.role ?? "leadership"}`}>
          <Link
            href="/about#team"
            className="group grid min-h-40 gap-5 py-7 first:pt-0 sm:grid-cols-[8.5rem_minmax(0,1fr)_auto] sm:gap-8"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-ms-black">
              <ResilientImage
                src={person.portrait}
                alt={person.portraitAlt}
                fallbackSrc={
                  PUBLICATION_FALLBACKS[index % PUBLICATION_FALLBACKS.length]
                }
                fallbackAlt="Sarga leadership"
                fill
                sizes="136px"
                className="object-cover grayscale transition duration-500 group-hover:scale-[1.04] group-hover:grayscale-0"
              />
            </div>
            <div>
              <p className="ms-data-label text-ms-slipstream-teal">
                {person.group ?? "leadership"} /{" "}
                {person.role ?? "Council member"}
              </p>
              <h3 className="mt-3 text-xl font-bold leading-tight text-ms-warm-white transition-colors group-hover:text-ms-electric-yellow sm:text-2xl">
                {person.name}
              </h3>
              <p className="mt-3 line-clamp-2 max-w-3xl text-sm leading-6 text-ms-warm-white/56">
                {person.summary ??
                  `Part of the Sarga leadership team guiding sporting standards, operations, and long-term platform development.`}
              </p>
            </div>
            <ArrowUpRightIcon className="mt-1 hidden size-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 sm:block" />
          </Link>
        </li>
      ))}
    </ol>
  );
}

function EcosystemList({ items }: { items: EcosystemSite[] }) {
  if (items.length === 0)
    return <EmptyPanel message="No ecosystem websites are currently active." />;

  return (
    <ol className="divide-y divide-ms-warm-white/12">
      {items.map((site, index) => (
        <li key={site.slug}>
          <Link
            href={site.href}
            target={site.external ? "_blank" : undefined}
            rel={site.external ? "noreferrer" : undefined}
            className="group grid min-h-40 gap-5 py-7 first:pt-0 sm:grid-cols-[8.5rem_minmax(0,1fr)_auto] sm:items-center sm:gap-8"
          >
            <div className="relative grid aspect-[4/3] place-items-center overflow-hidden border border-ms-warm-white/12 bg-ms-black">
              {site.logo ? (
                <ResilientImage
                  src={site.logo}
                  alt={site.logoAlt ?? site.name}
                  fallbackSrc="/brand/logo-sarga-motorsport-symbol-sport.png"
                  fallbackAlt="Sarga ecosystem"
                  fill
                  sizes="136px"
                  className="object-contain p-4"
                />
              ) : (
                <span className="font-display text-3xl text-ms-warm-white/28">
                  {String(index + 1).padStart(2, "0")}
                </span>
              )}
            </div>
            <div>
              <p className="ms-data-label text-ms-ignition-orange">
                {site.themeKey ?? "Sarga site"} / Active website
              </p>
              <h3 className="mt-3 text-2xl font-bold leading-tight text-ms-warm-white transition-colors group-hover:text-ms-electric-yellow">
                {site.name}
              </h3>
              {site.description ? (
                <p className="mt-3 max-w-3xl text-sm leading-6 text-ms-warm-white/56">
                  {site.description}
                </p>
              ) : null}
            </div>
            <ArrowUpRightIcon className="mt-1 hidden size-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 sm:block" />
          </Link>
        </li>
      ))}
    </ol>
  );
}

function EmptyPanel({ message }: { message: string }) {
  return (
    <div className="border-l-2 border-ms-ignition-orange py-5 pl-6">
      <p className="text-sm leading-7 text-ms-warm-white/58">{message}</p>
    </div>
  );
}
