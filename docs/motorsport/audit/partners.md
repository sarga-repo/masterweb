# Sarga Motorsport Partners — CMS ↔ Frontend Audit

Status: Phase A/B/C complete — 2026-08-29

Route: `/partners` and `/{locale}/partners`

Frontend entry: `frontend-motorsport/src/app/partners/page.tsx`

Primary CMS source: `api::motorsport-partners-page.motorsport-partners-page`

Supporting CMS source: Motorsport Partner collection.

## Mapping

| Frontend Section | Frontend Element | CMS Section | CMS Field | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| Metadata | Title/description/social metadata | Partners single type + SEO | `title`, hero fields, `seo.*` | Partially wired | Static metadata is exported; dedicated SEO is not consumed. |
| Routing/governance | Canonical path/ownership | Partners single type | `routePath`, `routeAliases`, `siteScope` | Active/infrastructure | Alias redirects remain lifecycle-only. |
| Availability | Coming Soon state | Page Availability | all fields | Active | Controls disabled page. |
| Hero | Kicker/title/description/background | Page Hero | copy/media/show flags | Active | Rendered by `PageHero`. |
| Information band | Partner-control copy/metrics | Page Information Band | copy, show flags, `metrics[]` | Active | Rendered through the shared adapter. |
| Partner network | Section heading/copy | Partner Network Section | `indexLabel`, `eyebrow`, `title`, `body`, show flags | Active | Header is CMS-driven. |
| Partner network | Logo/name/link cards | Motorsport Partner collection | `name`, `logo`, `websiteUrl`, active/order/site fields | Active | Cards are collection-backed and external links are opened safely. |
| Partner network | “Visit” / “Official network” labels | Partner card layout | no CMS field | Fixed UI copy | These are link-state labels, not partner-specific editorial values. |
| Final CTA | Copy/link | Final CTA Section | `eyebrow`, `title`, `body`, `ctaLabel`, `ctaUrl` | Active with fallback | Show flags and target are not currently applied. |
| Legacy control section | No rendered element | Partners single type | `partnerControlSection` | Retired | Removed from the schema, editor layout, and stored component links after repository-wide consumer verification. |
| Generic section fields | Media/items/legal/secondary CTA/theme | Network/Final CTA sections | shared page-section fields | Not wired | Keep until all common-component consumers are audited. |

## Changes planned for Phase B

- Wire dedicated SEO metadata.
- Honor Final CTA show/target controls.
- Add Partners single-type help text.

No staging environment, remote CMS, or destructive migration was touched.

## Changes made

- Partners metadata now consumes the dedicated SEO component.
- Final CTA now honors CMS show/target controls.
- Added Partners single-type help text.

## Validation result

- Motorsport typecheck passed.
- CMS TypeScript check and JSON schema validation passed.
- No staging environment or remote CMS was touched.
