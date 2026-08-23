# MSR-CMS-CLEAN-5A — Editorial coverage and strict audit closure

Status: Done 2026-08-23

## What was done

- Extended the reusable Motorsport page section with optional legal text,
  secondary CTA fields, and ordered repeatable section items with item-level
  visibility, media, alt text, accent, and links.
- Added the reusable `motorsport.page-section-item` component and Content
  Manager layout so editors see item visibility/order before editorial content.
- Wired CMS ownership for the remaining editorial surfaces:
  - Homepage Newsletter legal copy and secondary contact action.
  - About operating-idea content and independent Contact/Ecosystem CTA markers.
  - News Gallery CTA label and destination.
  - Merchandise, Partners, Experience, and Contact final CTA destinations and
    body/action fields.
  - Ticket Info bullet items and support action.
  - Experience pillars and track media items.
- Classified the remaining shared Ticket CTA collection as compatibility-only
  for non-Motorsport scopes and legacy rollback; it is no longer an active
  Motorsport source.
- Closed the strict alignment audit for all ten Motorsport page routes.

## Files changed

- `cms/src/components/motorsport/page-section.json`
- `cms/src/components/motorsport/page-section-item.json`
- `cms/src/migrations/motorsport-program-editor-layout.ts`
- `cms/scripts/audit-motorsport-cms-frontend-alignment.mjs`
- `cms/types/generated/components.d.ts`
- `cms/types/generated/contentTypes.d.ts`
- `frontend-motorsport/src/components/sections/newsletter-cta.tsx`
- `frontend-motorsport/src/lib/cms-page-order.ts`
- `frontend-motorsport/src/lib/cms-data.ts`
- `frontend-motorsport/src/lib/homepage-data.ts`
- `frontend-motorsport/src/app/{page,about,news,merchandise,tickets,partners,experience,contact}/page.tsx`
- `docs/motorsport/revamp/79_cms_clean_followup_phase5_execution.md`
- `docs/PHASE_PROGRESS.md`
- `checklists/motorsport/motorsport_revamp_phase_checklist.md`

## How verified

- Strapi type generation passed with zero warnings/errors.
- Strict alignment audit passed: 10 pages, 0 structural issues, 0 documented
  findings, and 0 active duplicate source sets.
- Focused frontend tests passed: 14 tests.
- Motorsport typecheck, lint, formatting, and production build passed with all
  50 routes generated.
- CMS typecheck and production admin build passed.
- `git diff --check` passed.

## Notes / caveats

- Curated fallback copy/cards remain for CMS outage or unmigrated records; CMS
  values take precedence whenever present.
- Contact form categories and email routing remain application-owned operational
  configuration and were intentionally not moved into editorial CMS fields.
- No legacy records or schemas were physically deleted. Live authenticated CMS
  content reconciliation and browser Preview UAT remain deployment-level gates.
