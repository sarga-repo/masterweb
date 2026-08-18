import { Page, useFetchClient, useRBAC } from "@strapi/strapi/admin";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { Link, useLocation } from "react-router-dom";

type WorkspaceKey = "gateway" | "motorsport" | "horsesport" | "shared";

type WorkspaceLink = {
  label: string;
  description: string;
  uid: string;
  group: "Pages" | "Programs" | "Editorial" | "Commerce" | "Library";
  kind?: "collection-types" | "single-types";
  filterByScope?: boolean;
  canCreate?: boolean;
};

type Workspace = {
  title: string;
  linkPrefix?: string;
  eyebrow: string;
  scope: "gateway" | "motorsport" | "horsesport" | "shared";
  accessAction: string;
  description: string;
  warning: string;
  accent: string;
  links: WorkspaceLink[];
  priorityTasks?: PriorityTask[];
  logoSrc?: string;
  logoAlt?: string;
  theme: "light" | "motorsport";
};

type PriorityTask = {
  label: string;
  description: string;
  uid: string;
  filterByScope?: boolean;
};

type SitePageEntry = {
  documentId: string;
  title: string;
  slug: string;
  routePath: string;
  pageKind: string;
  siteScope: string;
};

const CONTENT_LINKS = {
  topNavigation: {
    label: "Top Navigation",
    description:
      "English and Indonesian header labels, visibility, order, destination, and CTA emphasis.",
    uid: "api::top-navigation-item.top-navigation-item",
    group: "Pages",
    filterByScope: true,
  },
  pages: {
    label: "Site pages",
    description:
      "Homepage, About, campaign, merchandise, and legal page content.",
    uid: "api::site-page.site-page",
    group: "Pages",
    filterByScope: true,
  },
  news: {
    label: "News",
    description: "Site-owned and shared news articles.",
    uid: "api::news-article.news-article",
    group: "Editorial",
    filterByScope: true,
  },
  events: {
    label: "Events",
    description:
      "Event records, dates, schedules, venues, and ticket relationships.",
    uid: "api::event.event",
    group: "Editorial",
    filterByScope: true,
  },
  galleries: {
    label: "Media galleries",
    description: "Curated galleries and event-linked media.",
    uid: "api::media-gallery.media-gallery",
    group: "Editorial",
    filterByScope: true,
  },
  tickets: {
    label: "Ticket CTAs",
    description:
      "Approved redirect, deep-link, and allowlisted embed configuration.",
    uid: "api::ticket-cta.ticket-cta",
    group: "Commerce",
    filterByScope: true,
  },
} satisfies Record<string, WorkspaceLink>;

// Motorsport page Single Types are intentionally listed in the Motorsport
// workspace only.  Keeping these links explicit gives editors a clear page
// model to open and prevents them from having to edit the legacy Site Page
// collection for fields that now belong to a dedicated page document.
const MOTORSPORT_PAGE_LINKS: WorkspaceLink[] = [
  {
    label: "Theme Settings",
    description: "Select the approved Motorsport color composition preset.",
    uid: "api::motorsport-theme-settings.motorsport-theme-settings",
    group: "Pages",
    kind: "single-types",
    canCreate: false,
  },
  {
    label: "Homepage",
    description: "Hero, information band, disciplines, ticket CTA, and homepage sections.",
    uid: "api::motorsport-home-page.motorsport-home-page",
    group: "Pages",
    kind: "single-types",
    canCreate: false,
  },
  {
    label: "About Page",
    description: "About hero, information band, capabilities, team, and calls to action.",
    uid: "api::motorsport-about-page.motorsport-about-page",
    group: "Pages",
    kind: "single-types",
    canCreate: false,
  },
  {
    label: "Events Page",
    description: "Events hero, controls, programmes, calendar, and event discovery content.",
    uid: "api::motorsport-events-page.motorsport-events-page",
    group: "Pages",
    kind: "single-types",
    canCreate: false,
  },
  {
    label: "News Page",
    description: "News hero, lead story, archive introduction, and editorial controls.",
    uid: "api::motorsport-news-page.motorsport-news-page",
    group: "Pages",
    kind: "single-types",
    canCreate: false,
  },
  {
    label: "Gallery Page",
    description: "Gallery hero, archive, and gallery call-to-action content.",
    uid: "api::motorsport-gallery-page.motorsport-gallery-page",
    group: "Pages",
    kind: "single-types",
    canCreate: false,
  },
  {
    label: "Merchandise Page",
    description: "Merchandise hero, catalogue, controls, and final call to action.",
    uid: "api::motorsport-merchandise-page.motorsport-merchandise-page",
    group: "Pages",
    kind: "single-types",
    canCreate: false,
  },
  {
    label: "Tickets Page",
    description: "Ticket hero, featured ticket, event tickets, and ticket information.",
    uid: "api::motorsport-tickets-page.motorsport-tickets-page",
    group: "Pages",
    kind: "single-types",
    canCreate: false,
  },
  {
    label: "Contact Page",
    description: "Contact hero, inquiry form, notification copy, and final CTA.",
    uid: "api::motorsport-contact-page.motorsport-contact-page",
    group: "Pages",
    kind: "single-types",
    canCreate: false,
  },
  {
    label: "Partners Page",
    description: "Partner hero, partner network, and closing CTA content.",
    uid: "api::motorsport-partners-page.motorsport-partners-page",
    group: "Pages",
    kind: "single-types",
    canCreate: false,
  },
  {
    label: "Experience Page",
    description: "Experience hero, pillars, track content, and closing CTA.",
    uid: "api::motorsport-experience-page.motorsport-experience-page",
    group: "Pages",
    kind: "single-types",
    canCreate: false,
  },
];

const WORKSPACES: Record<WorkspaceKey, Workspace> = {
  gateway: {
    title: "Sarga Gateway",
    linkPrefix: "Gateway",
    eyebrow: "Site workspace",
    scope: "gateway",
    accessAction: "admin::sarga-workspaces.access-gateway",
    description:
      "Manage Sarga.co corporate and ecosystem entry-point content without mixing it with dedicated-site records.",
    warning:
      "Gateway Admin records are assigned to the Gateway automatically. Super Admin must confirm the intended scope before publishing cross-site content.",
    accent: "#e2321e",
    logoSrc: "/admin-assets/logo-sarga.png",
    logoAlt: "Sarga",
    theme: "light",
    links: [
      {
        label: "Homepage",
        description: "Existing Gateway single-type homepage content.",
        uid: "api::homepage.homepage",
        group: "Pages",
        kind: "single-types",
        canCreate: false,
      },
      CONTENT_LINKS.topNavigation,
      CONTENT_LINKS.pages,
      CONTENT_LINKS.news,
      {
        label: "Leadership",
        description:
          "Gateway leadership profiles, summaries, portraits, and ordering.",
        uid: "api::leadership-person.leadership-person",
        group: "Editorial",
        filterByScope: true,
      },
      CONTENT_LINKS.events,
      CONTENT_LINKS.galleries,
      CONTENT_LINKS.tickets,
      {
        label: "Partners & sponsors",
        description:
          "Gateway-owned partner identities and approved external URLs.",
        uid: "api::partner.partner",
        group: "Library",
        filterByScope: true,
      },
      {
        label: "Corporate reports",
        description:
          "Annual and sustainability report indexes, files, approved URLs, and publication status.",
        uid: "api::corporate-report.corporate-report",
        group: "Editorial",
        filterByScope: true,
      },
      {
        label: "Job vacancies",
        description:
          "Careers disciplines, role details, availability, and approved LinkedIn application links.",
        uid: "api::job-vacancy.job-vacancy",
        group: "Editorial",
        filterByScope: true,
      },
      {
        label: "Ecosystem businesses",
        description: "Gateway cards and dedicated-site routing destinations.",
        uid: "api::ecosystem-business.ecosystem-business",
        group: "Programs",
        filterByScope: true,
      },
    ],
  },
  motorsport: {
    title: "Sarga Motorsport",
    linkPrefix: "Motorsport",
    eyebrow: "Site workspace",
    scope: "motorsport",
    accessAction: "admin::sarga-workspaces.access-motorsport",
    description:
      "Manage the Motorsport public site, IJTC program, FIA Rallycross campaign, editorial feed, merchandise teasers, and ticket journeys.",
    warning:
      "Motorsport Admin records are assigned to Motorsport automatically. Ticketing remains partner redirect/deep-link or approved embed only.",
    accent: "#b94700",
    logoSrc: "/admin-assets/logo-sarga-motorsport-full.png",
    logoAlt: "Sarga Motorsport",
    theme: "motorsport",
    priorityTasks: [
      {
        label: "Edit Motorsport pages",
        description:
          "Homepage, About, Events, News, Gallery, and dedicated page content. Hero and section copy include independent show/hide controls, index labels, and support labels; absent controls keep the existing visible fallback.",
        uid: "api::motorsport-home-page.motorsport-home-page",
      },
      {
        label: "Manage events",
        description: "Dates, schedules, venues, and ticket relationships.",
        uid: "api::motorsport-event.motorsport-event",
      },
      {
        label: "Publish news",
        description: "Motorsport editorial stories and related event coverage.",
        uid: "api::motorsport-news-article.motorsport-news-article",
      },
      {
        label: "Manage programs",
        description: "IJTC, FIA Rallycross, and future program hubs.",
        uid: "api::motorsport-program.motorsport-program",
        filterByScope: true,
      },
    ],
    links: [
      ...MOTORSPORT_PAGE_LINKS,
      {
        label: "Top navigation",
        description: "Motorsport header labels, visibility, order, and destinations.",
        uid: "api::motorsport-top-navigation-item.motorsport-top-navigation-item",
        group: "Pages",
      },
      {
        label: "Programs",
        description:
          "IJTC, FIA Rallycross, race-weekend, and future program hubs.",
        uid: "api::motorsport-program.motorsport-program",
        group: "Programs",
        filterByScope: true,
      },
      {
        label: "Riders",
        description: "Program-linked rider profiles and ordering.",
        uid: "api::motorsport-rider.motorsport-rider",
        group: "Programs",
        filterByScope: true,
      },
      {
        label: "Standings & results",
        description: "Season, round, position, points, and result summaries.",
        uid: "api::motorsport-standing.motorsport-standing",
        group: "Programs",
        filterByScope: true,
      },
      {
        label: "Regulations",
        description: "Versioned, effective-dated program regulation downloads.",
        uid: "api::motorsport-regulation.motorsport-regulation",
        group: "Programs",
        filterByScope: true,
      },
      {
        label: "Merchandise",
        description:
          "Showcase teasers with external or inquiry-only availability.",
        uid: "api::motorsport-merchandise-item.motorsport-merchandise-item",
        group: "Commerce",
      },
      {
        label: "Events",
        description: "Motorsport event records, dates, schedules, venues, and ticket relationships.",
        uid: "api::motorsport-event.motorsport-event",
        group: "Editorial",
      },
      {
        label: "News",
        description: "Motorsport-owned editorial stories, imagery, and related event coverage.",
        uid: "api::motorsport-news-article.motorsport-news-article",
        group: "Editorial",
      },
      {
        label: "Leadership",
        description:
          "Motorsport leadership profiles, summaries, portraits, and ordering.",
        uid: "api::motorsport-leadership-person.motorsport-leadership-person",
        group: "Editorial",
      },
      CONTENT_LINKS.galleries,
      {
        label: "Ticket CTAs",
        description: "Approved Motorsport ticket redirects, deep-links, and partner configuration.",
        uid: "api::motorsport-ticket-cta.motorsport-ticket-cta",
        group: "Commerce",
      },
      {
        label: "Partners & sponsors",
        description:
          "Motorsport-owned partner identities and approved external URLs.",
        uid: "api::motorsport-partner.motorsport-partner",
        group: "Library",
      },
    ],
  },
  horsesport: {
    title: "Sarga Horse Sport",
    linkPrefix: "Horse Sport",
    eyebrow: "Site workspace",
    scope: "horsesport",
    accessAction: "admin::sarga-workspaces.access-horsesport",
    description:
      "Manage dedicated Horse Sport pages, events, news, galleries, and ticket journeys through the shared CMS.",
    warning:
      "Horse Sport Admin records are assigned to Horse Sport automatically. Do not reuse Motorsport-specific program collections.",
    accent: "#d9a441",
    logoSrc: "/admin-assets/logo-sarga-horse-sport-dark.png",
    logoAlt: "Sarga Horse Sport",
    theme: "light",
    links: [
      CONTENT_LINKS.topNavigation,
      CONTENT_LINKS.pages,
      CONTENT_LINKS.events,
      CONTENT_LINKS.news,
      {
        label: "Leadership",
        description:
          "Horse Sport leadership profiles, summaries, portraits, and ordering.",
        uid: "api::leadership-person.leadership-person",
        group: "Editorial",
        filterByScope: true,
      },
      CONTENT_LINKS.galleries,
      CONTENT_LINKS.tickets,
      {
        label: "Partners & sponsors",
        description:
          "Horse Sport-owned partner identities and approved external URLs.",
        uid: "api::partner.partner",
        group: "Library",
        filterByScope: true,
      },
    ],
  },
  shared: {
    title: "Shared Library",
    eyebrow: "Cross-site workspace",
    scope: "shared",
    accessAction: "admin::sarga-workspaces.access-shared",
    description:
      "Manage content deliberately shared across Gateway, Motorsport, and Horse Sport while keeping one source of truth.",
    warning:
      "Shared Library Admin records are assigned to Shared automatically. Confirm reuse and teaser rules before publishing; never duplicate an event or article solely for menu separation.",
    accent: "#00c4cc",
    logoSrc: "/admin-assets/logo-sarga.png",
    logoAlt: "Sarga",
    theme: "light",
    links: [
      CONTENT_LINKS.pages,
      CONTENT_LINKS.news,
      CONTENT_LINKS.events,
      CONTENT_LINKS.galleries,
      CONTENT_LINKS.tickets,
      {
        label: "Partners & sponsors",
        description: "Reusable partner identities and approved external URLs.",
        uid: "api::partner.partner",
        group: "Library",
        filterByScope: true,
      },
      {
        label: "Ecosystem businesses",
        description: "Shared business profiles and dedicated-site routing.",
        uid: "api::ecosystem-business.ecosystem-business",
        group: "Library",
        filterByScope: true,
      },
      {
        label: "Site directory",
        description:
          "Public Sarga websites, destinations, descriptions, logos, and display order.",
        uid: "api::site.site",
        group: "Library",
      },
      {
        label: "Leadership council",
        description:
          "Leadership profiles intentionally shared across approved Sarga sites.",
        uid: "api::leadership-person.leadership-person",
        group: "Library",
        filterByScope: true,
      },
      {
        label: "Corporate timeline",
        description:
          "Shared corporate milestones used by gateway editorial experiences.",
        uid: "api::timeline-item.timeline-item",
        group: "Library",
      },
      {
        label: "Corporate reports",
        description:
          "Shared annual and sustainability report records and approved files.",
        uid: "api::corporate-report.corporate-report",
        group: "Library",
        filterByScope: true,
      },
      {
        label: "Job vacancies",
        description:
          "Shared careers roles and approved LinkedIn application links.",
        uid: "api::job-vacancy.job-vacancy",
        group: "Library",
        filterByScope: true,
      },
    ],
  },
};

function resolveWorkspace(pathname: string): Workspace {
  const key = pathname.split("/").filter(Boolean).at(-1) as WorkspaceKey;
  return WORKSPACES[key] ?? WORKSPACES.gateway;
}

function contentManagerPath(
  link: Pick<WorkspaceLink, "uid" | "kind" | "filterByScope">,
  scope: Workspace["scope"],
): string {
  const kind = link.kind ?? "collection-types";
  const base = `/content-manager/${kind}/${link.uid}`;
  if (!link.filterByScope) return base;

  const params = new URLSearchParams({
    page: "1",
    pageSize: "10",
    "filters[$and][0][siteScope][$eq]": scope,
  });
  return `${base}?${params.toString()}`;
}

function priorityTaskPath(task: PriorityTask, scope: Workspace["scope"]): string {
  return contentManagerPath(task, scope);
}

function createPath(link: WorkspaceLink): string {
  return `/content-manager/collection-types/${link.uid}/create`;
}

function sitePageEditorPath(documentId: string): string {
  const params = new URLSearchParams({
    "plugins[i18n][locale]": "en",
  });
  return `/content-manager/collection-types/api::site-page.site-page/${documentId}?${params.toString()}`;
}

function linkId(link: WorkspaceLink): string {
  return link.uid.replace(/[^a-z0-9]+/gi, "-");
}

function displayLinkLabel(workspace: Workspace, link: WorkspaceLink): string {
  if (!workspace.linkPrefix) return link.label;
  return `${workspace.linkPrefix} ${link.label}`;
}

function groupLinks(workspace: Workspace) {
  const groups = workspace.links.reduce<Record<string, WorkspaceLink[]>>(
    (groups, link) => {
      groups[link.group] ??= [];
      groups[link.group].push(link);
      return groups;
    },
    {},
  );

  return Object.fromEntries(
    ["Pages", "Editorial", "Programs", "Commerce", "Library"]
      .filter((group) => groups[group]?.length)
      .map((group) => [group, groups[group]]),
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100%",
    padding: "28px clamp(20px, 4vw, 64px) 72px",
    background: "var(--ms-workspace-canvas)",
    color: "var(--ms-workspace-text)",
  },
  shell: { maxWidth: 1440, margin: "0 auto" },
  workspaceLayout: {
    display: "grid",
    gridTemplateColumns: "minmax(180px, 220px) minmax(0, 1fr)",
    gap: 24,
    alignItems: "start",
    marginTop: 24,
  },
  subnav: {
    position: "sticky",
    top: 24,
    padding: 12,
    border: "1px solid var(--ms-workspace-border)",
    borderRadius: 10,
    background: "var(--ms-workspace-subtle)",
  },
  subnavGroup: { margin: "0 0 18px" },
  subnavHeading: {
    margin: "0 0 8px",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "var(--ms-workspace-muted)",
  },
  subnavLink: {
    display: "block",
    padding: "9px 10px",
    borderRadius: 6,
    color: "var(--ms-workspace-secondary)",
    fontSize: 13,
    fontWeight: 650,
    lineHeight: 1.35,
    textDecoration: "none",
    transition: "background 160ms ease, color 160ms ease, transform 160ms ease",
  },
  eyebrow: {
    margin: 0,
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "var(--ms-workspace-muted)",
  },
  title: {
    margin: "12px 0 0",
    fontSize: "clamp(34px, 4.5vw, 64px)",
    lineHeight: 1,
    letterSpacing: "-0.035em",
    textTransform: "none",
  },
  description: {
    maxWidth: 760,
    margin: "18px 0 0",
    fontSize: 16,
    lineHeight: 1.7,
    color: "var(--ms-workspace-secondary)",
  },
  notice: {
    marginTop: 12,
    padding: "13px 16px",
    border: "1px solid var(--ms-workspace-border)",
    borderLeftWidth: 5,
    borderRadius: 8,
    background: "var(--ms-workspace-raised)",
    lineHeight: 1.6,
    color: "var(--ms-workspace-secondary)",
  },
  guidanceStack: {
    display: "grid",
    gap: 10,
    marginTop: 12,
  },
  guidance: {
    border: "1px solid var(--ms-workspace-border)",
    borderRadius: 8,
    background: "var(--ms-workspace-raised)",
    color: "var(--ms-workspace-secondary)",
  },
  guidanceSummary: {
    display: "flex",
    minHeight: 48,
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    padding: "12px 16px",
    cursor: "pointer",
    fontWeight: 800,
    listStyle: "none",
  },
  guidanceSummaryNote: {
    color: "var(--ms-workspace-muted)",
    fontSize: 12,
    fontWeight: 500,
  },
  guidanceSummaryEnd: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
  },
  guidanceArrow: {
    display: "inline-grid",
    width: 28,
    height: 28,
    placeItems: "center",
    flex: "0 0 auto",
    border: "1px solid var(--ms-workspace-strong-border)",
    borderRadius: 6,
    color: "var(--ms-workspace-muted)",
    fontSize: 0,
    lineHeight: 1,
    transition: "transform 160ms ease, background 160ms ease",
  },
  guidanceBody: {
    padding: "0 16px 16px",
    borderTop: "1px solid var(--ms-workspace-border)",
    fontSize: 14,
    lineHeight: 1.55,
  },
  guidanceIntro: {
    margin: "14px 0 12px",
  },
  fieldMatrix: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 13,
  },
  fieldMatrixCell: {
    padding: "10px 8px",
    borderBottom: "1px solid var(--ms-workspace-border)",
    textAlign: "left",
    verticalAlign: "top",
  },
  fieldMatrixHeading: {
    color: "var(--ms-workspace-muted)",
    fontSize: 11,
    letterSpacing: ".08em",
    textTransform: "uppercase",
  },
  guidanceList: {
    display: "grid",
    gap: 6,
    margin: "12px 0 0",
    paddingLeft: 18,
  },
  contextBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
    padding: "8px 12px",
    borderRadius: 6,
    background: "var(--ms-workspace-inverse)",
    color: "var(--ms-workspace-inverse-text)",
    fontSize: 12,
    fontWeight: 750,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 16,
    marginTop: 0,
  },
  contentPanel: {
    padding: 16,
    border: "1px solid var(--ms-workspace-border)",
    borderRadius: 10,
    background: "var(--ms-workspace-subtle)",
  },
  contentPanelHeader: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 16,
    margin: "0 0 14px",
  },
  contentPanelTitle: {
    margin: 0,
    fontSize: 13,
    fontWeight: 850,
    letterSpacing: ".14em",
    textTransform: "uppercase",
    color: "var(--ms-workspace-muted)",
  },
  taskSurface: {
    position: "relative",
    isolation: "isolate",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 10,
    marginTop: 24,
    padding: 16,
    borderRadius: 10,
    background: "var(--ms-workspace-inverse)",
    color: "var(--ms-workspace-inverse-text)",
  },
  taskSurfaceHeader: {
    gridColumn: "1 / -1",
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 16,
    padding: "2px 4px 6px",
  },
  taskSurfaceTitle: {
    margin: 0,
    fontSize: 14,
    fontWeight: 800,
    letterSpacing: ".12em",
    textTransform: "uppercase",
  },
  taskSurfaceNote: {
    margin: 0,
    color: "#c7bdae",
    fontSize: 12,
  },
  task: {
    display: "flex",
    minHeight: 108,
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 14,
    padding: 14,
    border: "1px solid rgba(255, 249, 238, .16)",
    borderRadius: 8,
    background: "rgba(255, 249, 238, .06)",
    color: "#fff9ee",
    textDecoration: "none",
    transition: "background 160ms ease, border-color 160ms ease, transform 160ms ease",
  },
  taskLabel: {
    margin: 0,
    fontSize: 16,
    fontWeight: 800,
    lineHeight: 1.2,
  },
  taskDescription: {
    margin: 0,
    color: "#c7bdae",
    fontSize: 13,
    lineHeight: 1.45,
  },
  card: {
    display: "flex",
    minHeight: 0,
    flexDirection: "column",
    padding: 16,
    border: "1px solid var(--ms-workspace-border)",
    borderRadius: 8,
    background: "var(--ms-workspace-raised)",
    scrollMarginTop: 28,
  },
  activeCard: {
    borderColor: "var(--ms-workspace-action)",
    boxShadow: "0 0 0 3px rgba(196, 20, 39, .2), inset 4px 0 0 var(--ms-workspace-action)",
  },
  cardTitle: {
    margin: 0,
    fontSize: 20,
    lineHeight: 1.2,
    textTransform: "none",
  },
  cardDescription: {
    margin: "8px 0 16px",
    lineHeight: 1.55,
    color: "var(--ms-workspace-muted)",
  },
  cardEyebrow: {
    margin: 0,
    color: "var(--ms-workspace-muted)",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: ".12em",
    textTransform: "uppercase",
  },
  actions: { display: "flex", flexWrap: "wrap", gap: 10, marginTop: "auto" },
  primaryAction: {
    minHeight: 40,
    padding: "9px 14px",
    borderRadius: 6,
    background: "var(--ms-workspace-action)",
    color: "var(--ms-workspace-on-action)",
    fontSize: 13,
    fontWeight: 700,
    textDecoration: "none",
  },
  secondaryAction: {
    minHeight: 40,
    padding: "8px 13px",
    border: "1px solid var(--ms-workspace-strong-border)",
    borderRadius: 6,
    color: "var(--ms-workspace-secondary)",
    fontSize: 13,
    fontWeight: 700,
    textDecoration: "none",
  },
  sectionCount: {
    fontSize: 12,
    fontWeight: 700,
    color: "var(--ms-workspace-muted)",
  },
  pageEntryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 10,
  },
  pageEntry: {
    display: "flex",
    minHeight: 112,
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 8,
    padding: 14,
    border: "1px solid var(--ms-workspace-border)",
    borderRadius: 8,
    background: "var(--ms-workspace-raised)",
    color: "var(--ms-workspace-secondary)",
    textDecoration: "none",
    transition: "border-color 160ms ease, transform 160ms ease, box-shadow 160ms ease",
  },
  pageEntryKind: {
    color: "var(--ms-workspace-muted)",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: ".1em",
    textTransform: "uppercase",
  },
  pageEntryTitle: {
    color: "var(--ms-workspace-text)",
    fontSize: 15,
    lineHeight: 1.3,
  },
  pageEntryRoute: {
    color: "var(--ms-workspace-muted)",
    fontSize: 12,
    overflowWrap: "anywhere",
  },
};

const CONTENT_MANAGER_ACTIONS = {
  read: "plugin::content-manager.explorer.read",
  create: "plugin::content-manager.explorer.create",
} as const;

type WorkspaceCardProps = {
  link: WorkspaceLink;
  workspace: Workspace;
  onPermissionResolved: (linkId: string, canRead: boolean) => void;
  isActive: boolean;
};

function WorkspaceCard({
  link,
  workspace,
  onPermissionResolved,
  isActive,
}: WorkspaceCardProps) {
  const permissions = useMemo(
    () => [
      { action: CONTENT_MANAGER_ACTIONS.read, subject: link.uid },
      { action: CONTENT_MANAGER_ACTIONS.create, subject: link.uid },
    ],
    [link.uid],
  );
  const { allowedActions, error, isLoading } = useRBAC(permissions);
  const id = linkId(link);
  const canRead = !error && Boolean(allowedActions.canRead);

  useEffect(() => {
    if (!isLoading) onPermissionResolved(id, canRead);
  }, [canRead, id, isLoading, onPermissionResolved]);

  if (isLoading || !canRead) return null;

  const canCreate =
    (link.kind ?? "collection-types") === "collection-types" &&
    link.canCreate !== false &&
    Boolean(allowedActions.canCreate);

  return (
    <section
      id={id}
      style={{ ...styles.card, ...(isActive ? styles.activeCard : {}) }}
      className={`sarga-workspace-card${isActive ? " is-active" : ""}`}
    >
      <p style={styles.cardEyebrow}>{link.group}</p>
      <h3 style={styles.cardTitle}>{displayLinkLabel(workspace, link)}</h3>
      <p style={styles.cardDescription}>{link.description}</p>
      <div style={styles.actions}>
        <Link
          className="sarga-workspace-primary-action"
          style={styles.primaryAction}
          to={contentManagerPath(link, workspace.scope)}
        >
          Manage content
        </Link>
        {canCreate ? (
          <Link
            className="sarga-workspace-secondary-action"
            style={styles.secondaryAction}
            to={createPath(link)}
          >
            Create new
          </Link>
        ) : null}
      </div>
    </section>
  );
}

function WorkspaceContent({ workspace }: { workspace: Workspace }) {
  const [allowedLinkIds, setAllowedLinkIds] = useState<Set<string>>(
    () => new Set(workspace.links.map(linkId)),
  );
  const [activeLinkId, setActiveLinkId] = useState<string | null>(null);
  const [sitePageEntries, setSitePageEntries] = useState<SitePageEntry[]>([]);
  const [sitePageEntriesLoading, setSitePageEntriesLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { get } = useFetchClient();

  useEffect(() => {
    let cancelled = false;
    setSitePageEntriesLoading(true);
    const params = new URLSearchParams({
      page: "1",
      pageSize: "50",
      sort: "title:asc",
      "filters[$and][0][siteScope][$eq]": workspace.scope,
      "locale": "en",
    });
    get(`/content-manager/collection-types/api::site-page.site-page?${params}`)
      .then((response: { data?: { results?: SitePageEntry[] } }) => {
        if (!cancelled) setSitePageEntries(response.data?.results ?? []);
      })
      .catch(() => {
        if (!cancelled) setSitePageEntries([]);
      })
      .finally(() => {
        if (!cancelled) setSitePageEntriesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [get, workspace.scope]);

  useEffect(() => {
    const page = contentRef.current?.closest<HTMLElement>(
      ".sarga-workspace-page",
    );
    if (!page) return;

    let scrollShell = page.parentElement;
    while (scrollShell && scrollShell !== document.body) {
      const overflowY = getComputedStyle(scrollShell).overflowY;
      if (overflowY === "auto" || overflowY === "scroll") break;
      scrollShell = scrollShell.parentElement;
    }
    if (!scrollShell || scrollShell === document.body) return;

    scrollShell.classList.add("sarga-workspace-scroll-shell");
    if (workspace.theme === "motorsport") {
      scrollShell.classList.add("sarga-workspace-scroll-shell-motorsport");
    }
    return () => {
      scrollShell.classList.remove(
        "sarga-workspace-scroll-shell",
        "sarga-workspace-scroll-shell-motorsport",
      );
    };
  }, [workspace.theme]);
  const handlePermissionResolved = useCallback(
    (id: string, canRead: boolean) => {
      setAllowedLinkIds((current) => {
        const next = new Set(current);
        if (canRead) next.add(id);
        else next.delete(id);
        return next;
      });
    },
    [],
  );
  const allowedLinks = workspace.links.filter((link) =>
    allowedLinkIds.has(linkId(link)),
  );
  const groupedLinks = groupLinks({ ...workspace, links: allowedLinks });

  useEffect(() => {
    const root = contentRef.current;
    if (!root) return;
    const cards = Array.from(
      root.querySelectorAll<HTMLElement>(".sarga-workspace-card"),
    );
    if (!cards.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActiveLinkId(visible[0].target.id);
      },
      { rootMargin: "-18% 0px -62% 0px", threshold: [0, 0.2, 0.6] },
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [allowedLinks.length]);

  const handleSubnavClick = (id: string) => {
    setActiveLinkId(id);
  };

  return (
    <main
      className="sarga-workspace-page"
      data-workspace-scope={workspace.scope}
      style={styles.page}
    >
      <div style={styles.shell}>
        {workspace.logoSrc ? (
          <div className={`sarga-workspace-masthead sarga-workspace-masthead-${workspace.theme}`}>
            <img
              src={workspace.logoSrc}
              alt={workspace.logoAlt}
              width="205"
              height="204"
              className="sarga-workspace-masthead-logo"
            />
            <div>
              <p className="sarga-workspace-eyebrow" style={styles.eyebrow}>
                {workspace.eyebrow}
              </p>
              <h1 style={{ ...styles.title, color: workspace.accent }}>
                {workspace.title}
              </h1>
            </div>
          </div>
        ) : (
          <>
            <p className="sarga-workspace-eyebrow" style={styles.eyebrow}>
              {workspace.eyebrow}
            </p>
            <h1 style={{ ...styles.title, color: workspace.accent }}>
              {workspace.title}
            </h1>
          </>
        )}
        <p style={styles.description}>{workspace.description}</p>

        <div style={styles.contextBadge}>
          Workspace scope
          <span aria-hidden="true">•</span>
          {workspace.scope}
        </div>

        <div style={{ ...styles.notice, borderLeftColor: workspace.accent }}>
          <strong>Publishing guardrail:</strong> {workspace.warning}
        </div>

        {workspace.theme === "motorsport" ? (
          <>
            <section
              style={styles.taskSurface}
              className="sarga-workspace-task-surface"
              aria-labelledby="priority-tasks-title"
            >
              <div style={styles.taskSurfaceHeader}>
                <h2 id="priority-tasks-title" style={styles.taskSurfaceTitle}>
                  Priority tasks
                </h2>
                <p style={styles.taskSurfaceNote}>
                  Start with the work editors open most often.
                </p>
              </div>
              {workspace.priorityTasks?.map((task) => (
                <Link
                  key={task.uid}
                  className="sarga-workspace-task"
                  style={styles.task}
                  to={priorityTaskPath(task, workspace.scope)}
                >
                  <p style={styles.taskLabel}>{task.label}</p>
                  <p style={styles.taskDescription}>{task.description}</p>
                </Link>
              ))}
            </section>
            <div style={styles.guidanceStack}>
              <details style={styles.guidance}>
                <summary style={styles.guidanceSummary}>
                  <span>Site Page field guide</span>
                  <span style={styles.guidanceSummaryEnd}>
                    <span style={styles.guidanceSummaryNote}>
                      Home and About use different fields
                    </span>
                    <span className="sarga-guidance-arrow" style={styles.guidanceArrow} aria-hidden="true" />
                  </span>
                </summary>
                <div style={styles.guidanceBody}>
                  <p style={styles.guidanceIntro}>
                    Keep page-specific fields focused. Empty homepage-only fields
                    on About records are intentional.
                  </p>
                  <table style={styles.fieldMatrix}>
                    <thead>
                      <tr>
                        <th style={{ ...styles.fieldMatrixCell, ...styles.fieldMatrixHeading }}>
                          Page type
                        </th>
                        <th style={{ ...styles.fieldMatrixCell, ...styles.fieldMatrixHeading }}>
                          Use
                        </th>
                        <th style={{ ...styles.fieldMatrixCell, ...styles.fieldMatrixHeading }}>
                          Leave empty
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row" style={styles.fieldMatrixCell}>Homepage</th>
                        <td style={styles.fieldMatrixCell}>
                          Hero slides, featured event, information band, World
                          section, SEO, and homepage sections.
                        </td>
                        <td style={styles.fieldMatrixCell}>About-only sections.</td>
                      </tr>
                      <tr>
                        <th scope="row" style={styles.fieldMatrixCell}>About</th>
                        <td style={styles.fieldMatrixCell}>
                          Hero title, description, media, SEO, and profile,
                          vision, capabilities, team, contact, and ecosystem
                          sections.
                        </td>
                        <td style={styles.fieldMatrixCell}>
                          Hero slides, featured event, information band, and
                          World section.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </details>
              <details style={styles.guidance}>
                <summary style={styles.guidanceSummary}>
                  <span>Shared media selection</span>
                  <span style={styles.guidanceSummaryEnd}>
                    <span style={styles.guidanceSummaryNote}>Browse, select, Finish</span>
                    <span className="sarga-guidance-arrow" style={styles.guidanceArrow} aria-hidden="true" />
                  </span>
                </summary>
                <div style={styles.guidanceBody}>
                  <ul style={styles.guidanceList}>
                    <li>Stay on the Browse tab in the media picker.</li>
                    <li>Tick the checkbox on the asset card.</li>
                    <li>Choose Finish to attach the existing asset.</li>
                    <li>Clicking the preview opens asset details only.</li>
                  </ul>
                  <p style={styles.guidanceIntro}>
                    Media Library is shared across Sarga sites. Folder naming
                    supports organization; it is not a separate security boundary.
                  </p>
                </div>
              </details>
            </div>
          </>
        ) : null}

        <div style={styles.workspaceLayout} className="sarga-workspace-layout">
            <nav
              style={styles.subnav}
              aria-label={`${workspace.title} content sections`}
            >
            {Object.entries(groupedLinks).map(([group, links]) => (
              <div key={group} style={styles.subnavGroup}>
                <h2 style={styles.subnavHeading}>{group}</h2>
                {links.map((link) => (
                  <a
                    key={link.uid}
                    href={`#${linkId(link)}`}
                    className={`sarga-workspace-subnav-link${activeLinkId === linkId(link) ? " is-active" : ""}`}
                    style={styles.subnavLink}
                    aria-current={activeLinkId === linkId(link) ? "location" : undefined}
                    onClick={() => handleSubnavClick(linkId(link))}
                  >
                    {displayLinkLabel(workspace, link)}
                  </a>
                ))}
              </div>
            ))}
          </nav>

          <div ref={contentRef} style={{ display: "grid", gap: 18 }}>
            {Object.entries(groupedLinks).map(([group, links]) => (
              <section key={group} style={styles.contentPanel}>
                <div style={styles.contentPanelHeader}>
                    <h2 style={styles.contentPanelTitle}>{group}</h2>
                  <span style={styles.sectionCount}>
                    {links.length} {links.length === 1 ? "collection" : "collections"}
                  </span>
                </div>
                <div style={styles.grid}>
                  {links.map((link) => (
                    <WorkspaceCard
                      key={link.uid}
                      link={link}
                      workspace={workspace}
                      onPermissionResolved={handlePermissionResolved}
                      isActive={activeLinkId === linkId(link)}
                    />
                  ))}
                </div>
              </section>
            ))}
            {(
              <section
                id={`${workspace.scope}-site-page-entries`}
                style={styles.contentPanel}
                className="sarga-workspace-page-entries"
              >
                <div style={styles.contentPanelHeader}>
                  <div>
                    <p style={styles.cardEyebrow}>Pages</p>
                    <h2 style={styles.contentPanelTitle}>Page entries</h2>
                  </div>
                  <span style={styles.sectionCount}>
                    {sitePageEntriesLoading ? "Loading" : `${sitePageEntries.length} pages`}
                  </span>
                </div>
                <div style={styles.pageEntryGrid}>
                  {sitePageEntries.map((entry) => (
                    <Link
                      key={entry.documentId}
                      to={sitePageEditorPath(entry.documentId)}
                      className="sarga-workspace-page-entry"
                      style={styles.pageEntry}
                    >
                      <span style={styles.pageEntryKind}>{entry.pageKind}</span>
                      <strong style={styles.pageEntryTitle}>{entry.title}</strong>
                      <span style={styles.pageEntryRoute}>
                        {entry.routePath} · {entry.slug}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function WorkspacePage() {
  const { pathname } = useLocation();
  const workspace = resolveWorkspace(pathname);

  return (
    <Page.Protect
      permissions={[{ action: workspace.accessAction, subject: null }]}
    >
      <WorkspaceContent key={workspace.scope} workspace={workspace} />
    </Page.Protect>
  );
}
