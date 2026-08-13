# Strapi CMS Content Coverage — Phase 04 Motorsport Event Hub

## Status

Complete on 2026-08-12. Motorsport `/events` now consumes page-level editorial
sections from the existing scoped Event Hub record.

## Objective

Move meaningful Motorsport `/events` landing-page editorial copy into the
existing Motorsport `site-page` Event Hub record, including the blue
information-band content.

## Current State

`frontend-motorsport/src/app/events/page.tsx` fetches `fetchSitePage("eventHub")`
for hero fields, while these remain hardcoded:

- `Event control / Live index`
- `Programmes with a pulse.`
- `International campaigns...`
- `Featured pathways`
- `Choose your entry point.`
- `A world-stage campaign...`
- `Upcoming events`
- `The next grid.`
- `Current Motorsport-scoped events...`

Programs and individual Events are CMS collections and must remain separate.

## Problems

The Event Hub has partial page management. Editors can change hero copy but not
the blue band or section introductions.

## Target State

Existing `site-page` `pageKind=eventHub`, `siteScope=motorsport` owns ordered
`shared.page-section` entries with stable keys. Existing event/program queries
continue supplying cards, counts, dates, statuses, and ticket routing.

## Scope

- Populate existing page sections for Event Hub copy.
- Add only missing fields if section component cannot represent validated need.
- Update adapter types and page rendering.
- Preserve event/program fallback and scope filters.

## Out of Scope

- Changing Event or Motorsport Program schemas.
- Changing event card layout, status semantics, or ticket provider.
- Redesigning blue-band visual treatment.

## Files Expected to Change

- `frontend-motorsport/src/app/events/page.tsx`
- `frontend-motorsport/src/lib/cms-data.ts`
- `cms/src/api/site-page/**` only if schema gap confirmed
- `cms/src/seed.ts` for additive local page sections
- generated types and schema mirror
- focused page adapter tests

## Content Model Changes

Preferred contract:

```text
event-control: eyebrow, title, body
programmes:    eyebrow, title, body
calendar:      eyebrow, title, body
```

Stat labels may remain technical/UI-derived from live counts unless editors
need to rename them. If they need editorial control, add a Motorsport-specific
component rather than overloading generic section body text.

## Frontend Changes

Resolve section copy by `sectionKey`, with current copy as unavailable-record
fallback only. Do not use fallback to overwrite a successfully returned field.
`fetchSitePage("eventHub")` remains exact-scope.

## Migration Strategy

Create/update only the existing Motorsport Event Hub page record and sections.
No Event record migration. Compare blue-band and section rendering before
publishing.

## Backward Compatibility

Existing event/program records, URLs, ticket CTAs, and empty states remain.
Absent sections use current approved copy until CMS content is published.

## Validation

- CMS page response is `siteScope=motorsport`, `pageKind=eventHub`.
- Blue-band copy changes through CMS without code deployment.
- Event/program counts and ticket routes remain correct.
- No Gateway/Horse Sport page or Event data appears.

## Acceptance Criteria

- [x] Motorsport `/events` hero remains CMS-managed.
- [x] Blue-section eyebrow/title/description are CMS-managed.
- [x] Programme and calendar section introductions are CMS-managed.
- [x] Individual Event entries remain separate.
- [x] Existing event URLs, counts, status chips, and ticket links remain valid.

## Implementation Evidence

- Reused `api::site-page.site-page` `pageKind=eventHub`.
- Added seeded `shared.page-section` records with stable keys:
  `event-control`, `programmes`, and `calendar`.
- Updated `frontend-motorsport/src/app/events/page.tsx` to resolve all landing
  copy by section key and retain approved fallback values when sections are
  absent.
- Event and Motorsport Program collections remain unchanged and continue to
  provide live cards, dates, status, counts, and ticket routing.
- No visual/layout component changes were introduced.

## Validation Evidence

- CMS TypeScript check passed.
- CMS production build passed.
- Motorsport typecheck passed.
- Gateway and CMS regression checks remained available from prior phases.
- `git diff --check` passed.

## Migration Caveat

Seed section content is additive local/demo content. Production editors must
review and publish Event Hub sections before fallback copy is removed.
