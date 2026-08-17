# MSR-CMS-CLEAN-9 — Common and Detail Template Presentation Contract

Status: completed 2026-08-15.

Implementation: added the optional `motorsport.detail-presentation` component
to Event, News Article, Motorsport Program, and Motorsport Rider records;
Event and News detail routes now honor independently visible Hero/Band overrides.

## Goal

Ensure non-Single-Type Motorsport routes also present a Hero followed by an Information Band without creating one CMS page type per record.

## Data ownership

- News detail: Hero derives from article category/title/excerpt/cover. The band derives from editable article metadata such as category, publication date, and read time.
- Event detail: add an optional Motorsport presentation component to `Event`, containing Hero overrides and Information Band. Existing event fields remain fallbacks.
- Motorsport Program/FIA/IJTC: add an optional route-presentation list keyed by approved route name. Each item contains Hero and Information Band.
- Rider detail: Hero derives from rider name/summary/portrait; the band derives from editable rider number, nationality, team, or programme data.

Approved IJTC route keys are `overview`, `about`, `become-riders`, `race-schedule`, `riders`, `rider-detail`, `standings`, and `regulation`. Reject duplicate route keys in validation.

## Rendering rules

- Hero and band remain independently showable.
- Detail templates render the band immediately after the Hero.
- `showMetricGroup=false` hides metrics and separators.
- Existing detail body, tabs, grids, tables, ticket links, and CTAs remain unchanged.
- Missing optional presentation data uses documented record-derived values, never unrelated repository content.

## Preview and revalidation

Extend exact Preview population for presentation components and programme relations. Revalidate the exact localized detail route and affected indexes. Preserve canonical FIA routing and campaign alias redirect.

## Tests and gate

Test one News article, one generic Event, FIA, all IJTC route keys, and one Rider in Draft and Published EN/ID. Assert independent visibility, media/copy edits, metric group behavior, canonical redirects, immediate invalidation, and unchanged body functionality at mobile/desktop widths.

## Rollback

Detail templates can revert to their current record-derived Hero and omit the new band while keeping added optional fields.
