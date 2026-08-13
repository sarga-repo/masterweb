# CMS Editorial Completeness — Phase 06 Migration, UAT, and Handover

## Objective

Migrate reviewed content safely, validate site isolation and page completeness,
remove only verified duplicate fallback content, and hand over operations.

## Gates

- PostgreSQL/uploads backup and isolated restore.
- Editorial ownership and content review complete.
- API scope UAT for Gateway, Motorsport, Horse Sport, Shared, and hidden data.
- Authenticated admin workspace/RBAC UAT.
- English/Indonesian content/media review.
- Route visual regression and accessibility review.
- Rollback checkpoint and stakeholder approval.

## Out of Scope Without Approval

- Production migration.
- Destructive data cleanup.
- Fallback removal before CMS verification.
- New third-party services.

## Repository Implementation

- `pnpm --dir cms migration:preflight -- --archive <snapshot>` validates archive
  presence, checksum, Git SHA sidecar, disabled demo seed, and explicit approval.
  It never imports or mutates content.
- `pnpm --dir cms rollback:rehearsal -- --database <dump> --uploads <archive>`
  verifies paired backup artifacts only. It never drops, restores, or deletes
  databases/uploads.
- `pnpm --dir cms uat:site-isolation` probes Gateway, Motorsport, and Horse Sport
  API scopes. It requires reachable CMS and exits blocked when unavailable.

## Current Execution Result

- Production migration: **blocked**, because no staging/production archive,
  database/uploads backup, credentials, or stakeholder approval exists in this
  workspace.
- Rollback rehearsal: **dry-run tooling ready**, destructive restore intentionally
  not executed.
- Authenticated admin UAT: **blocked**, requires CMS UAT credentials and staging.
- Public API isolation UAT: **blocked unless CMS is running**, command available.
- Frontend build/type/test evidence: retained from Phases 4 and 5.

### Local Evidence — 2026-08-12

- CMS build passed: `npm run build` in `cms`.
- CMS TypeScript compilation passed: `npx tsc --noEmit -p tsconfig.json`.
- Local API isolation passed: `uat:site-isolation`, 12/12 scope/collection checks.
  Counts: Gateway pages 11/news 3; Motorsport pages 11/events 5/news 4/tickets
  4; Horse Sport pages 6/events 3/news 5/tickets 2.
- Migration preflight blocked safely without archive, disabled seed flag, and
  approval. No import executed.
- Rollback rehearsal blocked safely without paired database/uploads backup. No
  restore or destructive operation executed.

### Browser and CMS UAT Evidence — 2026-08-12

- CMS admin: HTTP 200.
- Gateway: `/` and `/news` HTTP 200; one H1 each; no horizontal overflow at
  1200px.
- Motorsport: `/` and `/news` HTTP 200; one H1 each; no horizontal overflow at
  1200px.
- Horse Sport: `/` and `/news` HTTP 200; one H1 each; no horizontal overflow at
  1200px; browser console reported no errors.
- All six `robots.txt` and `sitemap.xml` endpoints returned HTTP 200.
- Local API isolation: 12/12 checks passed.
- i18n completeness: 116 English records, 21 Indonesian records, 95 records
  requiring Indonesian editorial action.
- Authenticated workspace/RBAC UAT: blocked because `CMS_UAT_PASSWORD` and
  authenticated staging credentials are unavailable.
- i18n compare: blocked because source/target inventory files were not supplied.

## Handover Checklist

1. Build and deploy exact reviewed Git SHA to staging and production candidates.
2. Set `SEED_DEMO_CONTENT=false` outside local development.
3. Export encrypted source CMS archive with checksum and Git SHA sidecars.
4. Take paired target PostgreSQL and uploads backups.
5. Run migration preflight, then guarded Strapi import during maintenance window.
6. Recreate target admin users and least-privilege API tokens; transfer secrets
   through approved secret management only.
7. Run `uat:site-isolation`, i18n inventory/compare, frontend smoke checks, and
   authenticated workspace/RBAC UAT.
8. Capture route, media, accessibility, SEO, and performance evidence.
9. Keep editorial access closed until rollback checkpoint and stakeholder sign-off.
10. Retain archive checksum, backup paths, UAT results, operator, timestamps, and
    release Git SHA in restricted release records.
