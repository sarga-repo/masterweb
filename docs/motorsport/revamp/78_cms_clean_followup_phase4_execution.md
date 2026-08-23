# MSR-CMS-CLEAN-4A — Canonical source enforcement follow-up

Status: Done 2026-08-23

## What was done

- Made `informationBand.isActive` the only Information Band visibility owner
  for the Motorsport top-level routes. Legacy `*ControlSection` values are no
  longer read for visibility or fallback copy.
- Removed legacy control sections from the per-route frontend section adapter;
  the visible marker is now `information-band`, followed by the actual named
  page sections in CMS order.
- Switched the Motorsport homepage ticket panel to the dedicated
  `motorsport-ticket-ctas` collection. Shared `ticket-ctas` remains available
  for other site scopes and rollback, but is no longer a Motorsport homepage
  source.
- Removed inline event ticket fields from the Motorsport frontend ticket
  resolution path; event ticket destinations now come from related dedicated
  Ticket CTA records.
- Added persisted Content Manager layouts for the nine non-home Motorsport
  Single Types. They place Hero → Information Band → editorial sections →
  availability/SEO and omit legacy control rows.

## Files changed

- `frontend-motorsport/src/lib/cms-visibility.ts`
- `frontend-motorsport/src/lib/cms-visibility.test.ts`
- `frontend-motorsport/src/components/sections/motorsport-page-information-band.tsx`
- `frontend-motorsport/src/lib/cms-page-order.ts`
- `frontend-motorsport/src/lib/cms-page-order.test.ts`
- `frontend-motorsport/src/lib/homepage-data.ts`
- `frontend-motorsport/src/lib/cms-data.ts`
- `frontend-motorsport/src/app/{events,news,merchandise,tickets,partners,experience,contact}/page.tsx`
- `cms/src/migrations/motorsport-program-editor-layout.ts`
- `cms/scripts/audit-motorsport-cms-frontend-alignment.mjs`
- `docs/motorsport/revamp/78_cms_clean_followup_phase4_execution.md`

## How verified

- Focused frontend tests passed: 14 tests.
- Motorsport typecheck, lint, formatting, and production build passed; the
  build generated all 50 routes.
- CMS typecheck and production admin build passed.
- Alignment audit passed with zero structural issues; the inventory now shows
  13 documented findings and 2 schema-level duplicate source sets.
- `git diff --check` passed.

## Notes / caveats

- No database records or schemas were deleted. Legacy fields remain available
  for migration and rollback, but are removed from persisted Motorsport page
  editor layouts and public frontend reads.
- The shared Ticket CTA collection remains necessary for Gateway/Horse Sport
  ownership and is not globally archived in this Motorsport-only phase.
- Live authenticated CMS content reconciliation and browser Preview UAT remain
  later gates.
