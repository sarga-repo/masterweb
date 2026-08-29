# Sarga Motorsport Tickets — CMS ↔ Frontend Audit

Status: Phase A/B/C complete — 2026-08-29

Route: `/tickets` and `/{locale}/tickets`

Frontend entry: `frontend-motorsport/src/app/tickets/page.tsx`

Primary CMS source: `api::motorsport-tickets-page.motorsport-tickets-page`

Supporting CMS sources: Motorsport Ticket CTA and Motorsport Event collections.

## Mapping

| Frontend Section | Frontend Element | CMS Section | CMS Field | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| Page metadata | Title/description/social metadata | Tickets single type + SEO | `title`, hero fields, `seo.*` | Partially wired | Route metadata is static; wire the dedicated SEO component in Phase B. |
| Routing/governance | Canonical path/ownership | Tickets single type | `routePath`, `routeAliases`, `siteScope` | Active/infrastructure | Alias redirect gap remains documented. |
| Availability | Coming Soon state | Page Availability | all fields | Active | Controls disabled-page presentation. |
| Hero | Kicker/title/description/background | Page Hero | copy/media/show flags | Active | Rendered by `PageHero`. |
| Information band | Ticket-control copy/metrics | Page Information Band | copy, show flags, `metrics[]` | Active | Empty metrics use fixed support metrics. |
| Featured tickets | Section heading/visibility | Featured Ticket Section | `indexLabel`, `eyebrow`, `title`, `body`, show flags | Active | Header is CMS-driven. |
| Featured tickets | Partner CTA cards | Motorsport Ticket CTA collection | `label`, `title`, `description`, provider/event/partner fields, media, `url`, `ctaType`, active window | Active | Dedicated Motorsport CTA records are the source of truth; safe URL validation remains in the adapter. |
| Featured tickets | Optional embed | Ticket CTA | `embedConfigJson`/safe URL | Active when explicitly configured | Embed is opt-in and sandboxed; no internal checkout is created. |
| Ticketed events | Heading/visibility | Ticketed Events Section | copy and show flags | Active | Event rows come from collection records with ticket destinations. |
| Ticketed events | Event rows | Motorsport Event → Ticket CTA relation | event fields and ticket relation | Active | Only events with a resolved ticket href are shown. |
| Ticket information | Instructions list | Ticket Info Section → Section Item | `items[].isActive`, `description`, `title`, `label` | Active with fallback | Items are CMS-driven; four fixed instructions appear only when no active items exist. |
| Ticket information | Support copy | Ticket Info Section | `body` | Active with fallback | Rendered as rich text. |
| Ticket information | Support CTA | Ticket Info Section | `secondaryCtaLabel`, `secondaryCtaUrl` | Active with fallback | Link values are used; visibility and target are not currently applied. |
| Ticket control section | No rendered element | Tickets single type | `ticketControlSection` | Retired | Removed from the schema, editor layout, and stored component links after repository-wide consumer verification. |
| Generic section fields | Media/items/CTA/theme | Featured/ticketed/info sections | shared page-section fields | Partially used | Items are used by Ticket Info; other generic fields are not used in this layout. |

## Changes planned for Phase B

- Wire Tickets page metadata and SEO.
- Honor Ticket Info title/body/secondary CTA visibility and target controls.
- Add Tickets single-type help text.

## Safety decision

The dedicated Motorsport Ticket CTA collection remains the single owner for
Motorsport ticket redirects and approved embeds. Do not merge it back into the
shared Ticket CTA collection or add checkout logic.

No staging environment, remote CMS, or destructive migration was touched.

## Changes made

- Tickets metadata now consumes the dedicated SEO component.
- Ticket Info title/body/secondary CTA visibility and new-window target
  controls are now respected.
- Added Tickets single-type help text.

## Validation result

- Motorsport typecheck passed.
- CMS TypeScript check and JSON schema validation passed.
- No staging environment or remote CMS was touched.
