# CMS Editorial Completeness — Phase 03 Motorsport

## Status

Completed approved implementation batch on 2026-08-12. Motorsport About and FIA
Rallycross campaign presentation now consume scoped CMS sections. Event detail,
IJTC subpages, News detail, and homepage support surfaces remain explicitly
deferred to focused follow-up because their data contracts are not equivalent to
generic route pages.

## Objective

Make all meaningful Motorsport page composition, narrative copy, CTA content, and
editorial media CMS-configurable while preserving program/event data models.

## Scope

- Homepage support surfaces.
- About and leadership presentation.
- Event detail and IJTC subpages.
- Campaign landing pages.
- News detail, gallery, partners, tickets, contact, merchandise.

## Target

Use Motorsport-scoped `site-page` sections for page composition. Extend program
components only where structured campaign data cannot fit existing models.
Keep Event, Program, Rider, Standing, Regulation, Partner, Gallery, and Ticket
CTA collections authoritative for item data.

## Implementation Evidence

- Added Motorsport About sections for operating idea, team introduction, contact
  CTA, and ecosystem CTA.
- Added route-level Campaign page sections for World Cup control, format, rundown,
  race-day guide, and campaign ticket messaging.
- Added `fetchMotorsportPageByRoute` with exact `siteScope=motorsport` and route
  filtering.
- Preserved Event/Program collections and existing campaign facts, rules,
  schedules, ticket destinations, and media.

## Deferred

- Event detail presentation sections.
- IJTC overview/about/subpage narrative and media.
- Motorsport News detail framing.
- Homepage ticket/newsletter support copy.
- Final media/SEO/fallback hardening phase.

## Validation Evidence

- CMS TypeScript check passed.
- CMS production build passed.
- Motorsport typecheck passed.
- Existing Motorsport lint/build validation remains required after remaining
  focused routes are implemented.
- Editorial completeness contract tests passed in Phase 1.
- `git diff --check` passed.
