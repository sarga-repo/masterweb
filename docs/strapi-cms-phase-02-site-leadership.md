# Strapi CMS Content Coverage — Phase 02 Site Leadership

## Status

Complete on 2026-08-12. Leadership ownership is now additive and scoped. Horse
Sport has a CMS workspace scope and query contract, but no public Leadership
renderer was added because no existing Horse Sport page consumes Leadership.

## Objective

Make Leadership content independently manageable for Gateway, Motorsport, and
Horse Sport while preserving the existing collection and records.

## Current State

`cms/src/api/leadership-person/content-types/leadership-person/schema.json`
defines one localized collection with no `siteScope` or `site` relation.
Gateway fetches all published Leadership records in
`frontend-gateway/src/lib/strapi/about.ts`. Motorsport fetches the same global
collection in `frontend-motorsport/src/lib/cms-data.ts`. Horse Sport has no
Leadership consumer.

## Problems

- Global records can appear on unintended sites.
- Dedicated site editors cannot own Leadership records through existing scope
  RBAC.
- No Horse Sport leadership rendering contract exists.

## Target State

One `leadership-person` collection with explicit ownership:

```text
siteScope: gateway | motorsport | horsesport | shared | hidden
site: optional relation to api::site.site
```

Frontends fetch `[siteScope, shared]` and apply existing locale rules. Shared
records are deliberate, not an implicit default.

## Scope

- Additive schema and generated types.
- Backfill existing records to reviewed ownership.
- Extend workspace permissions and admin cards.
- Update Gateway and Motorsport adapters.
- Decide and implement Horse Sport Leadership placement only if approved.
- Add isolation and migration tests.

## Out of Scope

- Separate collection types per site.
- Leadership redesign.
- Timeline ownership changes.
- Media Library isolation.

## Files Expected to Change

- `cms/src/api/leadership-person/content-types/leadership-person/schema.json`
- `cms/src/access-control/sarga-workspaces.ts`
- `cms/src/admin/extensions/sarga-workspaces/WorkspacePage.tsx`
- `cms/src/seed.ts` only for empty local fixtures/backfill-safe behavior
- `cms/types/generated/**`
- `strapi/content-types.json`
- `frontend-gateway/src/lib/strapi/about.ts`
- `frontend-gateway/src/lib/strapi/types.ts`
- `frontend-motorsport/src/lib/cms-data.ts`
- Horse Sport adapter/page files if leadership placement is approved
- focused tests and migration documentation

## Content Model Changes

Existing fields remain. Add `siteScope` required after backfill and optional
`site` many-to-one relation. Keep `name`, stable ordering, localized editorial
fields, portrait, draft/publish, and collection UID unchanged.

## Frontend Changes

Adapters must include exact scope filters and populate portrait. Normalizers
must retain locale metadata. No component layout changes are required.

## Migration Strategy

1. Backup database/uploads.
2. Add nullable scope with safe temporary default `shared`.
3. Export and classify every existing record.
4. Backfill reviewed values.
5. Validate counts and public responses per site.
6. Enforce required field and managed-role write guard.
7. Roll back by restoring backup if classification or API checks fail.

## Backward Compatibility

Existing collection route, IDs, localized documents, and fields remain. During
rollout adapters may query `shared` to preserve current visibility, but must not
query all records without a scope filter after migration.

## Validation

- Gateway returns only Gateway/shared approved people.
- Motorsport returns only Motorsport/shared approved people.
- Horse Sport returns only Horse Sport/shared approved people.
- Managed roles cannot create/update another scope.
- Existing portraits and localized documents remain available.
- CMS typecheck/build and all affected frontend checks pass.

## Acceptance Criteria

- [x] Gateway Leadership only returns approved Gateway/shared records.
- [x] Motorsport Leadership only returns approved Motorsport/shared records.
- [x] Horse Sport Leadership behavior is explicitly documented as deferred because no existing renderer consumes it.
- [x] Existing Leadership content remains available through `shared` backfill/default behavior.
- [x] No duplicate Leadership collection exists.
- [x] No frontend route is broken by query/type changes.

## Implementation Evidence

- `leadership-person` retains collection name, UID, localization, draft/publish,
  existing fields, and record IDs.
- Added `siteScope` with rollout-safe default `shared` and optional `site`
  relation. Production records still require editorial classification before
  assigning site-specific ownership.
- Gateway query filters `siteScope in [gateway, shared]`.
- Motorsport query filters `siteScope in [motorsport, shared]`.
- Dedicated Gateway, Motorsport, and Horse Sport workspaces expose filtered
  Leadership links. Shared Library retains filtered shared Leadership access.
- Managed roles now receive conditioned Leadership permissions; `siteScope` is
  readable for validation but excluded from create/update writable fields.
- Local idempotent seed adds `siteScope=shared` to demo records and fills the
  field on existing seed-matched records when missing. This is not a substitute
  for production export/classification/migration.

## Validation Evidence

- CMS TypeScript check passed.
- CMS workspace access tests passed: 11 tests.
- Gateway typecheck passed.
- Motorsport typecheck passed.
- Gateway frontend tests passed: 8 files, 37 tests.
- `git diff --check` passed.
- CMS Prettier check was unavailable because CMS package has no installed
  `prettier` binary.
