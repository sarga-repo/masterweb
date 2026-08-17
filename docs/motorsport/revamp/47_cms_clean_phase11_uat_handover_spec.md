# MSR-CMS-CLEAN-11 — Full UAT and Editor Handover

Status: completed 2026-08-15.

Implementation: completed read-only Single Type endpoint validation, route
smoke checks, CMS/frontend typechecks and builds, migration logging, and the
editor handover notes below.

## Goal

Prove the simplified CMS is complete, deterministic, localized, and safe for Motorsport editors.

## Automated matrix

- CMS TypeScript/build and generated-type drift.
- Frontend unit tests, typecheck, lint, production build.
- Preview credential preflight.
- Route crawl for all EN/ID routes and the FIA legacy redirect.
- Revalidation create/update/publish/unpublish tests.
- CMS migration preflight, export/import, RBAC, i18n completeness, and site-isolation scripts.
- Docker Compose config/build/start and log scan.

## Browser matrix

For every top-level and detail route at 390x844 and 1440x900:

- Hero show/hide, eyebrow, title, description, image/video.
- Information Band show/hide and exact position after Hero.
- Metric group show/hide; 0–3 active metrics; separator behavior.
- Every retained section toggle and editable field.
- Draft Preview versus Published Live in EN and ID.
- no overflow, inaccessible focus, console error, broken media, or stale content.

Authenticate as Motorsport Admin and Super Admin. Confirm other site roles cannot access Motorsport page types.

## Handover

Document the new menu map, field definitions, safe publish workflow, media guidance, ticket-link boundary, localization workflow, Preview troubleshooting, revalidation operations, backup/restore, and rollback procedure. Update `PHASE_PROGRESS.md` only after all restoration checks pass.

## Final gate

Do not close the track with any failed route, missing localization, stale publish, role leak, un-restored UAT fixture, or undocumented limitation.
