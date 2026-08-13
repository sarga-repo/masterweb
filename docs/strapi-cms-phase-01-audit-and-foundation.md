# Strapi CMS Content Coverage — Phase 01 Audit and Foundation

## Status

Complete on 2026-08-12. Phase 1 is documentation and contract foundation only;
runtime implementation remains deferred to later approved phases.

## Objective

Convert audit findings into approved implementation contracts, test fixtures,
scope invariants, and migration runbooks without changing public behavior.

## Current State

- `siteScope` and role-scoped workspaces already exist.
- `site-page` already serves Motorsport and Horse Sport static/campaign pages.
- Leadership is global/unscoped.
- News root pages are frontend-only page shells.
- Motorsport Event Hub has a `site-page` record but hardcoded landing copy.

## Problems

- No agreed uniqueness and field contract for News Hub pages.
- Leadership ownership migration is undefined.
- Existing fallback behavior has no explicit rule distinguishing CMS outage from
  incomplete content.
- Documentation and generated schema mirror can drift from `cms/src`.

## Target State

- Approved schema/API/frontend matrix for each affected route.
- Explicit `siteScope` invariants and fallback policy.
- Migration rehearsal checklist and fixture data plan.
- No production content or runtime behavior changed.

## Scope

- Confirm route inventory and current consumers.
- Define `newsHub` page kind and stable section keys.
- Define Leadership migration classification.
- Define query and isolation test cases.
- Record schema mirror/type-generation requirements.

## Out of Scope

- Runtime schema edits.
- New content types or records.
- Frontend rendering changes.
- Production database migration.

## Files Expected to Change

- `docs/strapi-cms-content-coverage-master-plan.md`
- New phase specifications in `docs/`
- Later approved implementation: `cms/src/api/site-page/**`, `cms/src/api/leadership-person/**`, generated types, frontend adapters, tests.

## Migration Strategy

Documentation-only. Phase 2 must export existing Leadership records and classify
each record before backfill. Phase 3/4 must create draft page records without
replacing existing hardcoded runtime content until API and page rendering pass.

## Validation

- `git diff --check` for docs.
- Confirm no non-documentation files changed.
- Review matrix against source schemas and route files.

## Acceptance Criteria

- [x] Every current major root route is listed with evidence.
- [x] Each gap is classified as CMS, shared, scoped, hardcoded, or missing.
- [x] `siteScope` remains canonical ownership mechanism.
- [x] Leadership, News Hub, and Event Hub contracts are additive.
- [x] No runtime implementation files changed.

## Completion Evidence

See `docs/strapi-cms-phase-01-audit-evidence.md` for authority rules,
route-to-consumer evidence, fallback rules, migration rehearsal checklist, and
site-isolation fixture matrix.
