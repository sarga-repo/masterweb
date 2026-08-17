# Motorsport CMS Preview Phase 5 Extension

## Document status

- Phase: 5 extension - Merchandise, Contact, Experience, and global sections
- Status: Implemented
- Date: 2026-08-15
- Scope: Remaining root pages and shared PageShell consumers

## What changed

### Merchandise

- Added explicit locale to Site Page and Merchandise reads.
- Draft-empty Merchandise collections remain empty in Preview.
- Published mode retains curated merchandise fallback items.
- Existing item-level media fallbacks remain available for incomplete records.

### Contact

- Added explicit locale to the Contact Site Page read.
- CMS-managed hero and inquiry sections now follow requested locale through the
  shared draft-aware client.
- Static form structure remains unchanged; no account or ticketing behavior was
  added.

### Experience

- Added explicit locale to the Experience Site Page read.
- CMS-managed hero, control, pillars, and track section copy now follows draft
  status and requested locale.
- Current individual experience pillar cards remain repository-defined because no
  repeatable CMS pillar component is consumed by this route.

### Global sections

- Added global header/footer affected-route contract covering:
  - Homepage
  - Root hubs
  - Event and news detail templates
  - Rallycross canonical campaign route
  - IJTC parent and child routes
  - Merchandise, Contact, Experience, Partners, Tickets, and Gallery
  - English and Indonesian variants
- Existing PageShell behavior continues to pass explicit locale to navigation,
  site chrome, and program dropdown reads.
- Preview-only navigation/program fallbacks remain suppressed as implemented in
  Phase 2.

## Verification

- Affected-route and Preview tests: 11/11 passed.
- Motorsport typecheck passed.
- Motorsport ESLint passed.
- Motorsport production build passed.
- Preview formatting passed.
- `git diff --check` passed.
- Draft Merchandise API smoke check: HTTP 200.
- Draft Contact Site Page API smoke check: HTTP 200.
- Draft Experience Site Page API smoke check: HTTP 200.
- Draft Motorsport Site chrome API smoke check: HTTP 200.

## Known limitations

- Browser Content Manager mutation UAT remains pending.
- Experience pillar cards are not individually CMS-editable in current schema;
  only route sections and copy are Preview-managed.
- Global footer/header optional field fallbacks remain for incomplete Site
  records; valid draft values override them.
- Gateway and Horse Sport Preview remain out of scope.
