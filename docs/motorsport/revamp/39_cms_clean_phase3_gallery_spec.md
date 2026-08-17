# MSR-CMS-CLEAN-3 — Gallery Single Type and Hero Cleanup

Status: completed 2026-08-15.

Implementation: added the localized Gallery Single Type and migrated the
gallery intro kicker into the Hero contract while retaining Media Gallery
ownership and legacy fallback reads.

## Goal

Give Gallery a dedicated CMS form and remove the confusing `gallery-intro` pseudo-section.

## CMS schema

Create `api::motorsport-gallery-page.motorsport-gallery-page` with:

- internal title;
- `hero` using `motorsport.page-hero`;
- `informationBand` using `motorsport.page-information-band`;
- named `archiveSection` using `motorsport.page-section`;
- page availability;
- SEO.

Gallery images remain in `Media Gallery`; do not duplicate them into the page type.

## Migration mapping

- `heroEnabled` -> `hero.isActive`
- `gallery-intro.eyebrow` -> `hero.eyebrow`
- `heroTitle` -> `hero.title`
- `heroDescription` -> `hero.description`
- `heroMedia` -> `hero.backgroundMedia`
- `gallery-archive` -> `archiveSection`
- Seed an Information Band using approved current Gallery copy and metrics.

Do not migrate the unused `gallery-intro.title` or `gallery-intro.body`; record them in the migration report for editorial review.

## Frontend

- Render Hero and Information Band as separate adjacent sections.
- Remove the Gallery renderer's dependency on `gallery-intro`.
- Keep archive filters, modal, next/previous controls, and Media Gallery sourcing unchanged.
- Keep dual-read fallback until final cutover.

## Tests

- Independent hero, information band, metric group, and archive toggles.
- Hero eyebrow/title/description/media Draft Preview and publish parity.
- Metric group hidden means no metric separators.
- Gallery archive content and modal behavior unchanged.
- EN/ID at 390px and 1440px; no overflow or console errors.

## Exit gate

The editor sees only Gallery fields, no homepage ticket component, no `gallery-intro` key, and no unused Gallery fields. Preview/live parity must pass before continuing.

## Rollback

Restore the Gallery legacy adapter; do not delete the new entry or old Site Page.
