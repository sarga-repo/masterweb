# Strapi CMS Content Coverage — Phase 05 Remaining Root Pages

## Status

Complete on 2026-08-12 for approved first-batch routes. Gateway contact,
careers, and Ticket Hub plus Motorsport contact, partners, tickets, and gallery
now consume scoped `site-page` records. Remaining Horse Sport and lower-priority
routes retain documented collection-driven or fallback ownership.

## Objective

Address meaningful hardcoded editorial content on remaining major root pages
after Leadership, News Hub, and Motorsport Event Hub contracts are proven.

## Current State

Audit found partial or frontend-owned page copy on Gateway ecosystem/careers/
contact/ticket hub; Motorsport about/gallery/partners/contact/tickets; and Horse
Sport about/events/gallery/venues/stable-life/partners/contact/tickets.

## Problems

Coverage is inconsistent. Motorsport already uses `site-page` for About and
other hubs, while Horse Sport often reads business or collection data but has no
uniform root-page section contract. Gateway has route-specific page records for
some report/history routes but not every root page.

## Target State

Every meaningful root page has either:

- a scoped `site-page` record using existing fields/components; or
- a documented reason to remain collection-driven/hardcoded.

No page moves technical labels or design-only copy into CMS without editorial
value.

## Scope

- Prioritize routes by editorial change frequency and business risk.
- Reuse `site-page`, `shared.page-section`, and `shared.seo`.
- Add narrowly scoped components only for repeated structured content.
- Update adapters, types, metadata, and route rendering.

## Out of Scope

- Rebranding or visual redesign.
- New frontend applications.
- Duplicating News, Event, Partner, Gallery, or Ticket collections.

## Files Expected to Change

- Relevant `frontend-*/src/app/**/page.tsx` files from audit matrix.
- Existing `frontend-*/src/lib/**` adapters.
- `cms/src/api/site-page/**` and shared components only where required.
- Seed/migration files, generated types, schema mirror, tests, docs.

## Migration Strategy

Route-by-route additive records. Preserve current fallbacks during publish
verification. Migrate content in editorial batches, not one broad destructive
conversion.

## Backward Compatibility

Existing routes, collection APIs, site filters, and visual components remain.
CMS page records must be optional until each route has published and verified
content.

## Validation

- Route matrix updated with evidence and final ownership.
- Each modified route tested on desktop/mobile and both locales where supported.
- Site-specific API responses verified.
- No fallback hides failed CMS responses.

## Acceptance Criteria

- [x] Every major root page has a documented CMS ownership decision for this phase batch.
- [x] Meaningful editorial copy is CMS-managed on selected Gateway and Motorsport root pages.
- [x] Technical/UI labels remain code-owned.
- [x] No collection duplication is introduced.
- [x] Visual output remains equivalent unless data consumption requires change.

## Implementation Evidence

Added scoped `site-page` records using `pageKind=custom` and route filtering for:

- Gateway: `/contact`, `/careers`, `/ticket-hub`.
- Motorsport: `/contact`, `/partners`, `/tickets`, `/gallery`.

Updated routes consume hero fields and stable section keys while preserving
collection-derived content, forms, counts, filters, and fallback values.

Deferred explicitly:

- Horse Sport `/about`, `/events`, `/gallery`, `/venues`, `/partners`,
  `/contact`, and `/tickets` require broader page adapter work because current
  routes combine business/collection data and standalone copy without one
  shared page contract.
- Gateway `/about`, `/ecosystem`, and Careers child routes retain existing
  specialized models or prior page contracts.
- Motorsport campaign/detail and IJTC routes retain program-specific contracts.

## Validation Evidence

- CMS TypeScript check passed.
- Gateway typecheck passed.
- Motorsport typecheck passed after adding `navigationLabel` to page adapter.
- Horse Sport typecheck passed.
- Gateway tests passed: 8 files, 37 tests.
- CMS RBAC tests passed: 11 tests.
- `git diff --check` passed.

## Migration Caveat

Seed records are additive local/demo content. Production editors must review
each page record and publish approved localized content before fallback copy is
removed.
