# Sarga Motorsport Experience — CMS ↔ Frontend Audit

Status: Phase A/B/C complete — 2026-08-29

Route: `/experience` and `/{locale}/experience`

Frontend entry: `frontend-motorsport/src/app/experience/page.tsx`

Primary CMS source: `api::motorsport-experience-page.motorsport-experience-page`

## Mapping

| Frontend Section | Frontend Element | CMS Section | CMS Field | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| Metadata | Title/description/social metadata | Experience single type + SEO | `title`, hero fields, `seo.*` | Partially wired | Static metadata is exported; dedicated SEO is not consumed. |
| Routing/governance | Canonical path/ownership | Experience single type | `routePath`, `routeAliases`, `siteScope` | Active/infrastructure | Alias redirects remain lifecycle-only. |
| Availability | Coming Soon state | Page Availability | all fields | Active | Controls disabled page. |
| Hero | Kicker/title/description/background | Page Hero | copy/media/show flags | Active | Passed to `PageHero`. |
| Information band | Experience-control copy/metrics | Page Information Band | copy, show flags, `metrics[]` | Active | Rendered through the shared adapter. |
| Pillars | Section heading/copy | Pillars Section | copy/show flags | Active | Rendered by `SectionHeader`. |
| Pillars | Six pillar cards | Pillars Section → Section Item | `items[].isActive`, `label`, `title`, `description`, `accent` | Active | CMS cards are mapped; the href field is currently not passed to the card component. |
| Pillars | Card destinations | Section Item | `href`, `hrefLabel` | Not wired | `ExperiencePillarCard` currently renders no link; fields are not visible. |
| Track | Section heading/copy | Track Section | copy/show flags | Active | Rendered by `SectionHeader`. |
| Track | Track images/captions | Track Section → Section Item | `items[].isActive`, `media`, `mediaAlt`, `label`, `title` | Active | Images and labels are rendered; fallback labels remain for empty CMS items. |
| Final CTA | Copy/link | Final CTA Section | `eyebrow`, `title`, `body`, main/secondary CTA fields | Partially wired | Copy and labels are active; body, show flags, and target controls need wiring. |
| Legacy control section | No rendered element | Experience single type | `experienceControlSection` | Retired | Removed from the schema, editor layout, and stored component links after repository-wide consumer verification. |
| Generic fields | Media/items/theme/legal | Pillars/Track/Final CTA sections | shared page-section fields | Partially used | Items are active for Pillars/Track; other generic fields remain route-specific gaps. |

## Changes planned for Phase B

- Wire Experience page metadata and SEO.
- Pass CMS pillar destinations to the pillar card or remove destination fields
  after confirming no editor content depends on them.
- Honor Final CTA body/show/target controls.
- Add Experience single-type help text.

No staging environment, remote CMS, or destructive migration was touched.

## Changes made

- Experience metadata now consumes the dedicated SEO component.
- CMS pillar links are now passed to `ExperiencePillarCard`.
- Final CTA body, visibility, and new-window target controls are now honored.
- Added Experience single-type help text.

## Validation result

- Motorsport typecheck passed.
- CMS TypeScript check and JSON schema validation passed.
- No staging environment or remote CMS was touched.
