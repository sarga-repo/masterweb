# CMS Content Manager layout reconciliation

Phase: `MSR-CMS-OPS-4`
Status: completed 2026-08-24

## Purpose

Strapi stores Content Manager edit layouts in `strapi_core_store_settings`,
separately from component schemas. The local and staging databases therefore
drifted even though their source schemas matched. In staging, several
Motorsport visibility controls appeared before the editorial content; local
held the agreed editorial order and placed the relevant `show*` controls after
the content/media fields.

## Implementation

- Added `cms/src/migrations/motorsport-content-manager-layout.ts` with the
  local Motorsport component layouts as the canonical contract.
- The migration updates only `layouts.edit`; Content Manager metadata, list
  layouts, content records, and schemas are preserved.
- Existing field metadata is retained when a field is reordered.
- Unknown fields are appended rather than deleted, protecting future schema
  additions.
- The migration is opt-in and idempotent through
  `MOTORSPORT_CONTENT_MANAGER_LAYOUT_MODE=dry-run|apply|verify`.
- Staging can run it through a temporary systemd environment override without
  editing the protected CMS environment file.

## Runbook

Run a database backup first, then restart the CMS once for each mode:

```bash
MOTORSPORT_CONTENT_MANAGER_LAYOUT_MODE=dry-run systemctl restart sarga-cms
MOTORSPORT_CONTENT_MANAGER_LAYOUT_MODE=apply systemctl restart sarga-cms
MOTORSPORT_CONTENT_MANAGER_LAYOUT_MODE=verify systemctl restart sarga-cms
```

The environment variable must be supplied as a one-time service-manager
override and cleared after each run. Normal CMS startup leaves the migration
disabled.

## Acceptance evidence

- Local and staging MD5 signatures match for all 16 Motorsport component
  `layouts.edit` values.
- Staging dry-run found 5 differences; apply repaired those 5 layouts.
- Staging verify returned `checked: 16, changed: 0, missing: 0`.
- `page-hero`, `page-information-band`, and `page-section` retain explicit
  `isActive` section controls and the canonical visibility-control order.
- CMS service is active and the temporary migration environment is cleared.
- No content record was created, deleted, published, or mutated.
