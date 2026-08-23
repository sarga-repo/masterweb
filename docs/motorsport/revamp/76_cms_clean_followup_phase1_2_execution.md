# MSR-CMS-CLEAN-1/2 — Alignment foundation and homepage execution

Date: 2026-08-23
Status: completed

This follow-up execution continues the historical CLEAN-0–11 migration without
rewriting its phase records. It closes the first two alignment findings from
the read-only reassessment in `75_cms_clean_alignment_phase0_audit.md`.

## CLEAN-1 — Ordered adapter and canonical Information Band

### What changed

- Replaced the global `sectionKeys` union in `cms-data.ts` with a per-route
  ordered field contract.
- Kept stable frontend render keys while mapping each page's named CMS fields
  in editor/schema order.
- Ensured About capabilities remains between Profile and Team in the normalized
  adapter output.
- Added `isCmsCanonicalSectionVisible()`: a populated canonical
  `informationBand` owns visibility; legacy `*ControlSection` is consulted only
  when the canonical component is absent.
- Applied canonical Information Band visibility to About, Events, News,
  Gallery, Merchandise, Tickets, Partners, Experience, and Contact.
- Added focused mapper and visibility tests.

### Gate

- Motorsport typecheck passed.
- CMS typecheck passed.
- Focused frontend tests passed: 14 tests.
- Motorsport production build passed and generated 50 routes.
- Prettier and `git diff --check` passed.

## CLEAN-2 — Homepage named CMS coverage

### What changed

- Added named localized `gallerySection`, `partnersSection`, and
  `newsletterSection` fields to the Motorsport Home Single Type.
- Added the same fields to the persisted Content Manager form order after
  Connected Records and before technical settings.
- Extended the legacy-to-Single-Type migration mapping for the new sections and
  preserved the existing partner visibility flag as compatibility data.
- Wired homepage Gallery, Partners, and Newsletter markers to the named CMS
  sections and their `isActive`/copy fields.
- Preserved the existing partner collection, newsletter API, and ticketing
  behavior; CMS owns editorial content and visibility, not submission logic.
- Regenerated Strapi content types.

### Gate

- Strapi type generation completed with zero warnings or errors.
- CMS production admin build passed.
- Motorsport production build passed and generated 50 routes.
- Focused frontend tests, typecheck, formatting, and `git diff --check` passed.
- Static alignment audit reports zero structural schema-field issues.

## Files changed

- `cms/src/api/motorsport-home-page/content-types/motorsport-home-page/schema.json`
- `cms/src/migrations/motorsport-page-single-types.ts`
- `cms/src/migrations/motorsport-program-editor-layout.ts`
- `cms/types/generated/contentTypes.d.ts`
- `cms/types/generated/components.d.ts`
- `frontend-motorsport/src/lib/cms-data.ts`
- `frontend-motorsport/src/lib/cms-page-order.ts`
- `frontend-motorsport/src/lib/cms-page-order.test.ts`
- `frontend-motorsport/src/lib/cms-visibility.ts`
- `frontend-motorsport/src/lib/cms-visibility.test.ts`
- `frontend-motorsport/src/lib/homepage-data.ts`
- `frontend-motorsport/src/app/page.tsx`
- `frontend-motorsport/src/app/{about,events,news,gallery,merchandise,tickets,partners,experience,contact}/page.tsx`

## Remaining gate

Authenticated CMS editor UAT and live EN/ID content verification remain for
the later migration/cutover phases. The new Content Manager layout is additive
and is applied by the existing Strapi bootstrap repair; it does not migrate or
delete records.
