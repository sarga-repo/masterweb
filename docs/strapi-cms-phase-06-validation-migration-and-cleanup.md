# Strapi CMS Content Coverage — Phase 06 Validation, Migration, and Cleanup

## Status

Repository validation and handover preparation complete on 2026-08-12.
Production/staging migration and authenticated CMS UAT remain blocked pending
database access, backup artifacts, editorial ownership classification, and
stakeholder approval.

## Objective

Complete migration, regression validation, editor UAT, fallback cleanup, and
handover after approved implementation phases.

## Current State

The repository has CMS build/type checks, focused access-control tests, seed
bootstrap, frontend adapters, and documented i18n migration rehearsal patterns.
No content-coverage migration has been executed by this planning run. Guarded
preflight, rollback dry-run, and site-isolation commands are now available.

Local 2026-08-12 evidence: CMS build and TypeScript passed; local public API
isolation passed 12/12 checks across Gateway, Motorsport, and Horse Sport. The
guarded preflight and rollback rehearsal both blocked safely because required
release artifacts and approval were absent. No destructive operation ran.

## Problems

- Production migration evidence does not yet exist for Leadership or page records.
- Cross-site API and admin UAT must cover new models and localized records.
- Legacy fallback copy may remain after CMS adoption unless explicitly cleaned.

## Target State

- Backups and rollback plan verified.
- CMS boots, schemas load, and generated contracts match source.
- Site-specific API responses pass.
- Affected frontend routes pass lint/typecheck/test/build.
- Editors can manage content through correct workspaces.
- Obsolete fallback code is removed only after evidence.

## Scope

- Database/uploads backup and restore rehearsal.
- Migration execution for approved schema/data changes.
- API isolation tests for three sites.
- Frontend route regression.
- Admin role/workspace UAT.
- Documentation and handover updates.

## Out of Scope

- New editorial features.
- Design changes.
- Infrastructure replacement.
- Production launch without stakeholder approval.

## Files Expected to Change

- Approved migration/seed files.
- Generated CMS types and `strapi/content-types.json`.
- Focused frontend/CMS tests.
- `docs/PHASE_PROGRESS.md`.
- Phase specifications with implementation status and evidence.

## Migration Strategy

1. Snapshot PostgreSQL and uploads.
2. Restore snapshot in isolated environment.
3. Apply schema and data migrations.
4. Compare pre/post record counts, IDs, locale records, relations, and media.
5. Run API/frontend/admin UAT.
6. Promote only after approval and rollback checkpoint.

## Backward Compatibility

Rollback restores database/uploads and previous frontend build. Additive
records and fields remain preferred. No UID, route, or article/event IDs are
changed.

## Validation Matrix

### CMS

- Strapi boots successfully.
- No UID/content-type conflicts.
- Relations, media, draft/publish, and localized records work.

### API

- Gateway receives Gateway/shared content only.
- Motorsport receives Motorsport/shared content only.
- Horse Sport receives Horse Sport/shared content only.
- Cross-site tampered filters do not bypass admin or public query contracts.

### Frontend

- Gateway `/news` and affected root routes.
- Motorsport `/news`, `/events`, and affected root routes.
- Horse Sport `/news` and affected root routes.
- English and Indonesian routes where supported.

### Engineering

- `pnpm --dir cms tsc --noEmit`
- `pnpm --dir cms build`
- Existing frontend lint/typecheck/test/build commands from each package.
- `git diff --check`

Only report commands actually executed.

## Acceptance Criteria

- [ ] Existing production records and media remain intact. Blocked: no production
  database/uploads backup was available in workspace.
- [ ] All new page records have reviewed ownership and locale status. Blocked:
  seed records are local/demo content and require editorial review.
- [ ] Site isolation passes API and authenticated admin UAT. Repository RBAC
  tests pass; staging API/admin UAT remains pending.
- [x] Affected route consumers typecheck, lint, and build successfully.
- [x] Hardcoded duplicate editorial copy remains until production CMS content is
  verified; no unsafe cleanup was performed.
- [x] `docs/PHASE_PROGRESS.md` records evidence and caveats.
- [ ] Stakeholder approval received before production rollout.

## Validation Evidence

Passed:

- `pnpm --dir cms exec tsc --noEmit`
- `pnpm --dir cms build`
- `node --test src/access-control/sarga-workspaces.test.ts` in `cms`: 11 passed
- `pnpm --dir frontend-gateway typecheck`
- `pnpm --dir frontend-gateway lint`
- `pnpm --dir frontend-gateway test`: 8 files, 37 tests passed
- `pnpm --dir frontend-gateway build`
- `pnpm --dir frontend-motorsport typecheck`
- `pnpm --dir frontend-motorsport lint`
- `pnpm --dir frontend-motorsport build`
- `pnpm --dir frontend-horsesport typecheck`
- `pnpm --dir frontend-horsesport lint`
- `pnpm --dir frontend-horsesport build`
- `git diff --check`

Not available:

- Motorsport/Horse Sport frontend test suites: no installed `vitest` command in
  current package workflow.
- Production/staging API isolation checks.
- Authenticated five-role CMS UAT.
- PostgreSQL/uploads backup restore rehearsal.

## Schema Consistency Evidence

Confirmed manually against source and generated contracts:

- `leadership-person.siteScope` and `leadership-person.site` exist in source
  schema, generated types, and `strapi/content-types.json`.
- `site-page.pageKind` contains `newsHub` in source schema, generated types,
  frontend types, and schema mirror.
- All seeded page records use existing `siteScope`, `routePath`, `pageKind`, and
  `shared.page-section` fields.

## Production Handover Gates

1. Export PostgreSQL and uploads from staging/production.
2. Classify every Leadership record by approved ownership.
3. Restore backup into isolated environment.
4. Apply additive schema/data changes.
5. Compare IDs, locales, relations, publication state, and media.
6. Run API isolation checks for all three site scopes.
7. Run authenticated Gateway/Motorsport/Horse Sport/Shared/Super Admin UAT.
8. Review localized page records and publish status.
9. Capture visual route comparison and rollback checkpoint.
10. Obtain stakeholder approval before production promotion.

No production migration was executed in this phase.
