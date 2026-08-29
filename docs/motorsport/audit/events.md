# Sarga Motorsport Events Hub — CMS ↔ Frontend Audit

Status: Phase A/B/C complete — 2026-08-29

Route: `/events` and `/{locale}/events`

Frontend entry: `frontend-motorsport/src/app/events/page.tsx`

Primary CMS source: `api::motorsport-events-page.motorsport-events-page`

Supporting CMS sources: Motorsport Program and Motorsport Event collections.

## Mapping

| Frontend Section | Frontend Element | CMS Section | CMS Field | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| Page identity/SEO | Browser title and social metadata | Events single type | `title`, `heroDescription`, `heroImage`, `seo.*` | Partially wired | The page currently exports static metadata instead of reading the dedicated single type. This is fixed in Phase B. |
| Page routing | Canonical route and alias lifecycle | Events single type | `routePath`, `routeAliases` | Active / lifecycle-only | Canonical path is active; aliases are maintained by CMS registry but not redirected by frontend. |
| Governance | Motorsport ownership | Events single type | `siteScope` | Infrastructure/private | Not public content. |
| Availability | Full-page Coming Soon state | Page Availability | all fields | Active | Used by `isCmsPageVisible()` and `PageComingSoon`. |
| Hero | Kicker/title/description/background | Page Hero | `eyebrow`, `title`, `description`, `backgroundMedia`, `backgroundAlt`, `showEyebrow`, `showTitle`, `showDescription`, `showMedia` | Active | Mapped by the shared page adapter and passed to `PageHero`. |
| Hero | Optional mobile media and actions | Page Hero | `mobileBackgroundMedia`, `primaryCta*`, `secondaryCta*` | Not wired by `PageHero` | Shared contract fields are present, but this route only passes the desktop background and text. |
| Information band | Event-control copy/metrics | Page Information Band | `isActive`, copy fields, `show*`, `metrics[]` | Active | Rendered through `MotorsportPageInformationBand`; fallback metrics are derived from the live collection when empty. |
| Programmes | Section visibility/header | Programmes Section | `isActive`, `indexLabel`, `eyebrow`, `title`, `body`, `showIndex`, `showEyebrow`, `showTitle`, `showBody` | Active | Passed to `SectionHeader`. |
| Programmes | Program cards | Motorsport Program collection | `title`, `slug`, `programType`, `programStatus`, `seasonLabel`, `summary`, `mainHeadline`, `eventStartDate`, `eventEndDate`, `venue`, `heroMedia`, CTA fields | Active | `fetchPrograms()` maps these fields into `ProgramCard`. |
| Programmes | Program order and type label | Motorsport Program collection | no sort field; `programType` | Hardcoded presentation rule | Hub order is hardcoded Rallycross → IJTC → other, and type labels are frontend constants. This is acceptable as a stable product taxonomy until editorial ordering is explicitly required. |
| Programmes | Program-specific fields | Motorsport Program collection | `bannerSlides`, `rundown`, `eventRules`, `riders`, `standings`, `regulations`, `presentationSections`, `becomeRiders*` | Not used on hub; used by detail routes | Do not delete from the collection during this page phase. Program schema segregation is handled in the detail/program audit after all consumers are traced. |
| Calendar | Section visibility/header | Calendar Section | `isActive`, `indexLabel`, `eyebrow`, `title`, `body`, `showIndex`, `showEyebrow`, `showTitle`, `showBody` | Active | Rendered by `SectionHeader`. |
| Calendar | Status legend | Calendar Section | no fields | Fixed UI taxonomy | Announced, Tickets open, and Live are frontend status legend labels; status values themselves come from Event records. |
| Calendar | Event list cards | Motorsport Event collection | `title`, `slug`, `eventDate`, `endDate`, `venue`, `eventStatus`, `racingCategory`, `seriesName`, `coverImage`/fallback hero media, ticket relation | Active | Active/upcoming events are filtered, ordered, and mapped by `fetchEvents()`. |
| Calendar | Empty state | Calendar Section | no field | Hardcoded / missing CMS field | “No upcoming events are published yet.” is a system empty-state message, not an editorial record. |
| Legacy control section | No rendered element | Events single type | `eventControlSection` | Retired | Removed from the schema, editor layout, and stored component links after repository-wide consumer verification. |
| Generic section fields | No rendered element on this route | Programmes/Calendar Section | `media`, `items`, `legalText`, `secondaryCta*`, `theme` | Not wired on Events hub | Shared component fields are currently not consumed by this page layout. Keep until all shared-component consumers are audited. |

## Program schema architecture decision

The Events hub only needs a common program-card projection. The same
`motorsport-program` records also back dedicated program detail routes, where
IJTC-only and campaign-only fields are consumed. Splitting the collection in
the hub phase would risk breaking relations, slugs, ticket ownership, and
existing detail URLs.

Safest recommendation: retain one stable program record and migrate the
program-specific groups behind dedicated nested components or dedicated
related records only after the detail-route audit proves the full field
matrix. Do not expose a second copy of the same program in CMS. Any future
split must be additive, include an idempotent relation-preserving migration,
and keep the existing slug as the canonical URL.

## Changes made in Phase B

- Events metadata now reads the dedicated single type and its SEO component
  through `createMetadata()`.
- Retired the unused `eventControlSection` from the schema, editor layout, and
  stored component links after repository-wide consumer verification.

## Validation result

- Motorsport typecheck, build, and lint passed.
- CMS TypeScript check and JSON schema validation passed.
- No staging environment or remote CMS was touched.
