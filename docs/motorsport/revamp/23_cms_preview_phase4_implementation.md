# Motorsport CMS Preview Phase 4 Implementation

## Document status

- Phase: 4 - IJTC Program and child-page Preview
- Status: Implemented
- Date: 2026-08-15
- Scope: Program, schedule, riders, rider detail, standings, regulation, About,
  and Become Riders routes

## What changed

### Draft-aware IJTC data adapters

IJTC adapters now preserve CMS draft state:

- Draft programs do not fall back to demo program data when missing.
- Draft schedules preserve empty `rundown` collections.
- Draft rider lists preserve empty results.
- Draft rider detail records resolve to not-found when absent.
- Draft standings preserve empty classifications.
- Draft regulations preserve missing/inactive document state.
- Public non-Preview requests retain existing curated demo fallbacks.

Regulation UI now shows pending publication metadata without inventing a CMS
regulation record when Preview has no active draft regulation.

### Explicit locale propagation

Locale now flows through:

- Program lookup
- Rider list and detail lookup
- Standings lookup
- Regulation lookup
- IJTC layout/subnavigation
- All IJTC child pages
- Rider metadata generation

### Program-owned chrome

IJTC subnavigation now uses CMS program values for:

- Season label
- Become Riders label
- Become Riders URL

Hidden or missing draft programs render the existing Coming Soon state through the
IJTC layout instead of exposing demo child content.

### Relation-owned Preview routes

Existing centralized CMS Preview resolution was verified for:

- Program -> `/events/{programSlug}`
- Rider -> `/events/indonesia-junior-talent-cup/riders/{riderSlug}`
- Standing -> `/events/indonesia-junior-talent-cup/standings`
- Regulation -> `/events/indonesia-junior-talent-cup/regulation`

CMS handler relation population remains `program` for rider, standing, and
regulation documents. Frontend relation queries retain program slug filters and
localized draft reads.

### Build-safe Preview detection

IJTC Preview detection now catches missing request context during static
generation. `generateStaticParams()` and sitemap generation use published-mode
fallback behavior at build time, while request-time Preview remains draft-aware.

## Route coverage

- `/events/indonesia-junior-talent-cup`
- `/events/indonesia-junior-talent-cup/race-schedule`
- `/events/indonesia-junior-talent-cup/riders`
- `/events/indonesia-junior-talent-cup/riders/{riderSlug}`
- `/events/indonesia-junior-talent-cup/standings`
- `/events/indonesia-junior-talent-cup/regulation`
- `/events/indonesia-junior-talent-cup/about`
- `/events/indonesia-junior-talent-cup/become-riders`
- English and Indonesian localized path variants

## Verification

- Motorsport typecheck passed.
- Motorsport ESLint passed.
- Motorsport production build passed.
- Motorsport Preview tests: 7/7 passed.
- CMS Preview tests: 8/8 passed.
- `git diff --check` passed.
- Local draft IJTC Program API smoke check returned HTTP 200 with `rundown`
  population and parent program fields.

## Known limitations

- Browser Content Manager mutation UAT remains pending.
- Local Indonesian IJTC records are incomplete; English fallback remains
  expected when localized records are absent.
- Demo fallback records remain intentionally available outside Preview for local
  development and public resilience.
