# 06 — GWR-CMS-5 CMS i18n and Navigation Foundations

Status: completed 2026-08-11.

## Goal

Enable the CMS foundation safely before changing any public route.

## Deliverables

- Back up PostgreSQL and uploads, restore them to an isolated rehearsal
  environment, and record pre/post document counts.
- Enable/configure Strapi `en` and `id`, keeping `en` as default.
- Apply the approved localization matrix at content-type and field level.
- Add `sourceLocale` to inquiry/newsletter operational records.
- Add localized `top-navigation-item` with URL and structural-parity validation.
- Seed the current English menus and approved Indonesian menu labels
  idempotently without overwriting editor-managed records.
- Add Top Navigation to each managed workspace and RBAC subject list.
- Extend the scope write guard and authenticated UAT for locale creation,
  translation, direct URLs, tampered scope, and structural parity.
- Update generated types and `strapi/content-types.json`.

## Migration rules

- Do not enable localization first on production.
- Preserve existing English `documentId`, draft/publish state, media, relations,
  and scope.
- Do not fabricate Indonesian editorial translations. Only navigation/interface
  labels explicitly approved in the seed may be created automatically.
- Migration must be idempotent and abort on ambiguous or duplicate documents.
- Locale administration remains Super Admin only.

## Verification

- CMS TypeScript, focused tests, production build, and Docker smoke.
- English and Indonesian locale API queries.
- Five-role authenticated workspace matrix.
- Relation, repeatable component, dynamic-zone, draft/publish, clone, and
  delete tests in both locales.
- Exact database and media reconciliation against the pre-migration inventory.

## Approval gate

Stop after the CMS and API contract passes in the rehearsal/local environment.
Do not begin Gateway routing or public language controls until approved.

## Completion result

- The isolated restore and real local database both migrated successfully.
- English remained the default and Indonesian was added idempotently.
- Fifteen editorial/navigation content types are localized; six structural or
  operational types remain non-localized by design.
- Twenty-one seeded menu documents produce matching English and Indonesian
  localizations without overwriting editor-managed records.
- The five-role authenticated workspace/navigation matrix and two-locale
  component/relation/draft/publish/clone tests passed.
- Full evidence and reconciliation are recorded in
  `10_gwr_cms_5_migration_rehearsal.md`.
