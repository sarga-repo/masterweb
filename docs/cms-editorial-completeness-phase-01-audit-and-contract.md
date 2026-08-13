# CMS Editorial Completeness — Phase 01 Audit and Contract

## Status

Complete on 2026-08-12. Route/section/media baseline and executable contract
tests are in place. No CMS migration or public rendering changes were made.

## Objective

Establish complete route, section, copy, CTA, and media inventory before moving
additional content into Strapi.

## Scope

- Every public route under all three frontend `src/app` trees.
- Every meaningful section heading/body/CTA/media source.
- CMS model/query/type/transformer/render chain.
- Static, fallback, technical, and missing classifications.
- Page-key and section-key naming contract.

## Out of Scope

- Runtime schema changes.
- Content migration.
- Design changes.
- Fallback removal.

## Deliverables

- Route inventory.
- Section-level content matrix.
- Media source inventory.
- Static editorial classification.
- Proposed page/section keys.
- Completeness test strategy.
- Frozen inventory: `docs/cms-editorial-completeness-phase-01-inventory.md`.
- Contract tests: `cms/src/editorial-completeness.test.ts`.

## Acceptance Criteria

- [x] Every public route is listed.
- [x] Every meaningful section has CMS source or documented gap.
- [x] Every editorial media path has CMS source or explicit fallback status.
- [x] Technical/UI strings are separated from editorial strings.
- [x] No CMS migration or public rendering implementation began in Phase 1.

## Verification

- `node --test cms/src/editorial-completeness.test.ts` passes four contract tests.
- Inventory and policy reviewed against current three-frontend route trees.
