# MSR-CMS-CLEAN-1 — Shared Component and Adapter Foundation

Status: completed 2026-08-15.

## Goal

Create the reusable CMS and frontend contracts without switching any public route.

## CMS work

1. Add `motorsport.page-hero` with the exact fields defined in the master plan.
2. Add `motorsport.page-information-band`.
3. Add `motorsport.information-band-metric`, maximum three per band.
4. Add `motorsport.page-section` for named page fields without `sectionKey`.
5. Keep existing components and `Site Page` schema unchanged.
6. Regenerate Strapi TypeScript types.

## Frontend work

1. Add typed DTOs and pure mappers for Hero, Information Band, metrics, and named sections.
2. Add shared renderers that preserve current Motorsport visual classes.
3. Keep homepage carousel support separate but compatible with the Hero contract.
4. Add a single-type fetch helper supporting locale, exact Preview document ID/status, published cache tags, and explicit loaded/empty/error states.
5. Do not import the new renderer into a public route yet.

## Tests

- Component schema validation.
- Type generation and CMS TypeScript.
- Mapper tests: active/inactive hero, band, metric group, individual metrics, image/video, EN/ID.
- `showMetricGroup=false` produces no metric markup or separators.
- Fetch tests distinguish empty from error and never fall back during exact Preview.
- Existing Motorsport build and route crawl remain unchanged.

## Implementation result

- Added `motorsport.page-hero`, `motorsport.page-information-band`,
  `motorsport.information-band-metric`, and `motorsport.page-section` schemas.
- Generated Strapi component types for the new contracts.
- Added typed frontend DTOs and pure mappers in
  `src/lib/motorsport-page-foundation.ts`.
- Added a shared static Hero renderer, Information Band adapter, and named
  section renderer. None is imported by a public route yet.
- Added a Single Type REST reader in `src/lib/strapi/client.ts` with exact
  Preview document-ID verification, locale handling, cache tags, and the same
  fail-closed error states as collection reads.
- Did not switch any public route or migrate any content.

## Exit gate

No route behavior or existing CMS form may change. Proceed only when CMS build, frontend typecheck/lint/build, mapper tests, Preview preflight, and route crawl pass.

## Rollback

Remove the unused new components/helpers. No content migration is involved.

## Verification

- Strapi type generation completed with zero warnings or errors.
- CMS TypeScript and admin production build passed.
- Motorsport TypeScript, ESLint, and production build passed.
- Five foundation tests and seventeen existing Preview/visibility/revalidation
  tests passed.
- `git diff --check` passed.
- Public route adapters were not changed, so no browser route migration was
  required in this foundation phase.

## Files changed

- `cms/src/components/motorsport/page-hero.json`
- `cms/src/components/motorsport/page-information-band.json`
- `cms/src/components/motorsport/information-band-metric.json`
- `cms/src/components/motorsport/page-section.json`
- `cms/types/generated/components.d.ts`
- `frontend-motorsport/src/components/sections/information-band.tsx`
- `frontend-motorsport/src/components/sections/motorsport-page-hero.tsx`
- `frontend-motorsport/src/components/sections/motorsport-page-information-band.tsx`
- `frontend-motorsport/src/components/sections/motorsport-page-section.tsx`
- `frontend-motorsport/src/components/index.ts`
- `frontend-motorsport/src/lib/motorsport-page-foundation.ts`
- `frontend-motorsport/src/lib/motorsport-page-foundation.test.ts`
- `frontend-motorsport/src/lib/strapi/client.ts`
