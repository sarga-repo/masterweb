import type { CSSProperties } from 'react';
import { Link, useLocation } from 'react-router-dom';

type WorkspaceKey = 'gateway' | 'motorsport' | 'horsesport' | 'shared';

type WorkspaceLink = {
  label: string;
  description: string;
  uid: string;
  group: 'Pages' | 'Programs' | 'Editorial' | 'Commerce' | 'Library';
  kind?: 'collection-types' | 'single-types';
  filterByScope?: boolean;
  canCreate?: boolean;
};

type Workspace = {
  title: string;
  eyebrow: string;
  scope: 'gateway' | 'motorsport' | 'horsesport' | 'shared';
  description: string;
  warning: string;
  accent: string;
  links: WorkspaceLink[];
};

const CONTENT_LINKS = {
  pages: {
    label: 'Site pages',
    description:
      'Homepage, About, campaign, merchandise, and legal page content.',
    uid: 'api::site-page.site-page',
    group: 'Pages',
    filterByScope: true,
  },
  news: {
    label: 'News',
    description: 'Site-owned and shared news articles.',
    uid: 'api::news-article.news-article',
    group: 'Editorial',
    filterByScope: true,
  },
  events: {
    label: 'Events',
    description:
      'Event records, dates, schedules, venues, and ticket relationships.',
    uid: 'api::event.event',
    group: 'Editorial',
    filterByScope: true,
  },
  galleries: {
    label: 'Media galleries',
    description: 'Curated galleries and event-linked media.',
    uid: 'api::media-gallery.media-gallery',
    group: 'Editorial',
    filterByScope: true,
  },
  tickets: {
    label: 'Ticket CTAs',
    description:
      'Approved redirect, deep-link, and allowlisted embed configuration.',
    uid: 'api::ticket-cta.ticket-cta',
    group: 'Commerce',
    filterByScope: true,
  },
} satisfies Record<string, WorkspaceLink>;

const WORKSPACES: Record<WorkspaceKey, Workspace> = {
  gateway: {
    title: 'Sarga Gateway',
    eyebrow: 'Site workspace',
    scope: 'gateway',
    description:
      'Manage Sarga.co corporate and ecosystem entry-point content without mixing it with dedicated-site records.',
    warning:
      'Create Gateway-owned records with siteScope = gateway. Use shared only when the same source record is intentionally consumed by multiple sites.',
    accent: '#e2321e',
    links: [
      {
        label: 'Legacy Gateway homepage',
        description: 'Existing Gateway single-type homepage content.',
        uid: 'api::homepage.homepage',
        group: 'Pages',
        kind: 'single-types',
        canCreate: false,
      },
      CONTENT_LINKS.pages,
      CONTENT_LINKS.news,
      CONTENT_LINKS.events,
      CONTENT_LINKS.galleries,
      {
        label: 'Ecosystem businesses',
        description: 'Gateway cards and dedicated-site routing destinations.',
        uid: 'api::ecosystem-business.ecosystem-business',
        group: 'Programs',
        filterByScope: true,
      },
    ],
  },
  motorsport: {
    title: 'Sarga Motorsport',
    eyebrow: 'Site workspace',
    scope: 'motorsport',
    description:
      'Manage the Motorsport public site, IJTC program, FIA Rallycross campaign, editorial feed, merchandise teasers, and ticket journeys.',
    warning:
      'Create Motorsport-owned records with siteScope = motorsport. Ticketing remains partner redirect/deep-link or approved embed only.',
    accent: '#ff5032',
    links: [
      CONTENT_LINKS.pages,
      {
        label: 'Motorsport programs',
        description:
          'IJTC, FIA Rallycross, race-weekend, and future program hubs.',
        uid: 'api::motorsport-program.motorsport-program',
        group: 'Programs',
        filterByScope: true,
      },
      {
        label: 'Riders',
        description: 'Program-linked rider profiles and ordering.',
        uid: 'api::motorsport-rider.motorsport-rider',
        group: 'Programs',
        filterByScope: true,
      },
      {
        label: 'Standings & results',
        description: 'Season, round, position, points, and result summaries.',
        uid: 'api::motorsport-standing.motorsport-standing',
        group: 'Programs',
        filterByScope: true,
      },
      {
        label: 'Regulations',
        description: 'Versioned, effective-dated program regulation downloads.',
        uid: 'api::motorsport-regulation.motorsport-regulation',
        group: 'Programs',
        filterByScope: true,
      },
      {
        label: 'Merchandise',
        description:
          'Showcase teasers with external or inquiry-only availability.',
        uid: 'api::merchandise-item.merchandise-item',
        group: 'Commerce',
        filterByScope: true,
      },
      CONTENT_LINKS.events,
      CONTENT_LINKS.news,
      CONTENT_LINKS.galleries,
      CONTENT_LINKS.tickets,
      {
        label: 'Partners & sponsors',
        description:
          'Motorsport-owned partner identities and approved external URLs.',
        uid: 'api::partner.partner',
        group: 'Library',
        filterByScope: true,
      },
    ],
  },
  horsesport: {
    title: 'Sarga Horse Sport',
    eyebrow: 'Site workspace',
    scope: 'horsesport',
    description:
      'Manage dedicated Horse Sport pages, events, news, galleries, and ticket journeys through the shared CMS.',
    warning:
      'Create Horse Sport-owned records with siteScope = horsesport. Do not reuse Motorsport-specific program collections.',
    accent: '#d9a441',
    links: [
      CONTENT_LINKS.pages,
      CONTENT_LINKS.events,
      CONTENT_LINKS.news,
      CONTENT_LINKS.galleries,
      CONTENT_LINKS.tickets,
      {
        label: 'Partners & sponsors',
        description:
          'Horse Sport-owned partner identities and approved external URLs.',
        uid: 'api::partner.partner',
        group: 'Library',
        filterByScope: true,
      },
    ],
  },
  shared: {
    title: 'Shared Library',
    eyebrow: 'Cross-site workspace',
    scope: 'shared',
    description:
      'Manage content deliberately shared across Gateway, Motorsport, and Horse Sport while keeping one source of truth.',
    warning:
      'Shared content can appear on multiple public sites. Confirm ownership and teaser rules before publishing; never duplicate an event or article solely for menu separation.',
    accent: '#00c4cc',
    links: [
      CONTENT_LINKS.pages,
      CONTENT_LINKS.news,
      CONTENT_LINKS.events,
      CONTENT_LINKS.galleries,
      CONTENT_LINKS.tickets,
      {
        label: 'Partners & sponsors',
        description: 'Reusable partner identities and approved external URLs.',
        uid: 'api::partner.partner',
        group: 'Library',
        filterByScope: true,
      },
      {
        label: 'Ecosystem businesses',
        description: 'Shared business profiles and dedicated-site routing.',
        uid: 'api::ecosystem-business.ecosystem-business',
        group: 'Library',
        filterByScope: true,
      },
      {
        label: 'Site directory',
        description:
          'Public Sarga websites, destinations, descriptions, logos, and display order.',
        uid: 'api::site.site',
        group: 'Library',
      },
      {
        label: 'Leadership council',
        description:
          'Shared leadership profiles, summaries, portraits, and display order.',
        uid: 'api::leadership-person.leadership-person',
        group: 'Library',
      },
      {
        label: 'Corporate timeline',
        description:
          'Shared corporate milestones used by gateway editorial experiences.',
        uid: 'api::timeline-item.timeline-item',
        group: 'Library',
      },
    ],
  },
};

function resolveWorkspace(pathname: string): Workspace {
  const key = pathname.split('/').filter(Boolean).at(-1) as WorkspaceKey;
  return WORKSPACES[key] ?? WORKSPACES.gateway;
}

function contentManagerPath(
  link: WorkspaceLink,
  scope: Workspace['scope'],
): string {
  const kind = link.kind ?? 'collection-types';
  const base = `/content-manager/${kind}/${link.uid}`;
  if (!link.filterByScope) return base;

  const params = new URLSearchParams({
    page: '1',
    pageSize: '10',
    'filters[$and][0][siteScope][$eq]': scope,
  });
  return `${base}?${params.toString()}`;
}

function createPath(link: WorkspaceLink): string {
  return `/content-manager/collection-types/${link.uid}/create`;
}

function linkId(link: WorkspaceLink): string {
  return link.uid.replace(/[^a-z0-9]+/gi, '-');
}

function groupLinks(workspace: Workspace) {
  return workspace.links.reduce<Record<string, WorkspaceLink[]>>(
    (groups, link) => {
      groups[link.group] ??= [];
      groups[link.group].push(link);
      return groups;
    },
    {},
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100%',
    padding: '40px clamp(24px, 4vw, 64px) 64px',
    background: '#f6f6f9',
    color: '#07111f',
  },
  shell: { maxWidth: 1240, margin: '0 auto' },
  workspaceLayout: {
    display: 'grid',
    gridTemplateColumns: 'minmax(180px, 220px) minmax(0, 1fr)',
    gap: 32,
    alignItems: 'start',
    marginTop: 32,
  },
  subnav: {
    position: 'sticky',
    top: 24,
    padding: 18,
    border: '1px solid #dcdce4',
    borderRadius: 10,
    background: '#fff',
  },
  subnavGroup: { margin: '0 0 18px' },
  subnavHeading: {
    margin: '0 0 8px',
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#8e8ea9',
  },
  subnavLink: {
    display: 'block',
    padding: '7px 8px',
    borderRadius: 5,
    color: '#32324d',
    fontSize: 13,
    fontWeight: 650,
    lineHeight: 1.35,
    textDecoration: 'none',
  },
  eyebrow: {
    margin: 0,
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: '#666687',
  },
  title: {
    margin: '12px 0 0',
    fontSize: 'clamp(32px, 4vw, 54px)',
    lineHeight: 1,
    letterSpacing: '-0.035em',
    textTransform: 'none',
  },
  description: {
    maxWidth: 760,
    margin: '18px 0 0',
    fontSize: 16,
    lineHeight: 1.7,
    color: '#4a4a68',
  },
  notice: {
    marginTop: 28,
    padding: '18px 20px',
    border: '1px solid #dcdce4',
    borderLeftWidth: 5,
    borderRadius: 8,
    background: '#fff',
    lineHeight: 1.6,
    color: '#32324d',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 18,
    marginTop: 0,
  },
  card: {
    display: 'flex',
    minHeight: 190,
    flexDirection: 'column',
    padding: 24,
    border: '1px solid #dcdce4',
    borderRadius: 10,
    background: '#fff',
    boxShadow: '0 1px 2px rgba(3, 3, 18, 0.04)',
  },
  cardTitle: {
    margin: 0,
    fontSize: 20,
    lineHeight: 1.2,
    textTransform: 'none',
  },
  cardDescription: {
    margin: '10px 0 20px',
    lineHeight: 1.55,
    color: '#666687',
  },
  actions: { display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 'auto' },
  primaryAction: {
    padding: '10px 14px',
    borderRadius: 6,
    background: '#07111f',
    color: '#fff',
    fontSize: 13,
    fontWeight: 700,
    textDecoration: 'none',
  },
  secondaryAction: {
    padding: '9px 13px',
    border: '1px solid #c7c7d2',
    borderRadius: 6,
    color: '#32324d',
    fontSize: 13,
    fontWeight: 700,
    textDecoration: 'none',
  },
};

export default function WorkspacePage() {
  const { pathname } = useLocation();
  const workspace = resolveWorkspace(pathname);
  const groupedLinks = groupLinks(workspace);

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <p style={styles.eyebrow}>{workspace.eyebrow}</p>
        <h1 style={{ ...styles.title, color: workspace.accent }}>
          {workspace.title}
        </h1>
        <p style={styles.description}>{workspace.description}</p>

        <div style={{ ...styles.notice, borderLeftColor: workspace.accent }}>
          <strong>Publishing guardrail:</strong> {workspace.warning}
        </div>

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
                    style={styles.subnavLink}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ))}
          </nav>

          <div style={styles.grid}>
            {workspace.links.map((link) => (
              <section key={link.uid} id={linkId(link)} style={styles.card}>
                <p style={styles.subnavHeading}>{link.group}</p>
                <h2 style={styles.cardTitle}>{link.label}</h2>
                <p style={styles.cardDescription}>{link.description}</p>
                <div style={styles.actions}>
                  <Link
                    style={styles.primaryAction}
                    to={contentManagerPath(link, workspace.scope)}
                  >
                    Manage content
                  </Link>
                  {(link.kind ?? 'collection-types') === 'collection-types' &&
                  link.canCreate !== false ? (
                    <Link style={styles.secondaryAction} to={createPath(link)}>
                      Create new
                    </Link>
                  ) : null}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
