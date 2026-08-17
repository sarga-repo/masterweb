# MSR-THEME-2 — Motorsport CMS theme settings

Status: Completed 2026-08-16  
Scope: Motorsport-owned Strapi settings and RBAC.

## Schema

Add a dedicated Motorsport settings Single Type with:

- `themePreset`: required enum (`current-motorsport`, `vendor-editorial`,
  `vendor-night`)
- optional non-visual metadata only if required by the existing settings model

The field is non-localized because it controls presentation, not copy.

## Permissions

- Motorsport Admin: read/update/publish the Motorsport settings record.
- Super Admin: full access.
- Gateway Admin, Horse Sport Admin, and Shared Library Admin: no access.

## Exit criteria

- Admin UI shows a clear preset selector, not raw CSS values.
- Invalid enum values are rejected.
- Existing CMS records and editors remain usable.

## Completion record

- Added the `Motorsport Theme Settings` Single Type with a required,
  non-localized allowlisted `themePreset` enum and private Motorsport scope.
- Added an idempotent bootstrap default of `current-motorsport`.
- Added Motorsport workspace navigation, API-token read permissions, lifecycle
  revalidation registration, and RBAC coverage for Motorsport Admin/Super Admin.
- Gateway, Horse Sport, and Shared Library roles do not receive this subject.
- Validation: CMS TypeScript compilation passed and the schema/permission
  subject references are internally consistent.
