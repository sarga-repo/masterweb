# CMS Content Manager layout reconciliation

Phase: `MSR-CMS-OPS-4`
Status: implementation complete; staging application pending

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

## Acceptance

- Local and staging component `layouts.edit` signatures match for all
  Motorsport components covered by the migration.
- `page-hero`, `page-information-band`, and `page-section` retain explicit
  `isActive` section controls and the canonical visibility-control order.
- CMS service is active after apply and verify.
- No content record is created, deleted, published, or mutated.
