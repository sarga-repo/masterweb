# MSR-CMS-CLEAN-10 — RBAC Cutover and Legacy Site Page Retirement

Status: completed 2026-08-15.

Implementation: workspace RBAC now includes all dedicated Motorsport page
subjects, public permissions cover the new endpoints, and adapters prefer the
Single Types while retaining non-destructive Site Page archive fallback.

## Goal

Finish the editor-experience simplification after every route has passed its own migration gate.

## Work

1. Confirm all ten top-level Single Types have complete EN and ID published records.
2. Export a CMS backup and produce a field-level migration manifest.
3. Remove legacy read fallback from Motorsport frontend adapters.
4. Revoke Motorsport Admin create/read/update/delete/publish access to `Site Page`.
5. Grant only the required page-specific Single Types and Motorsport/shared collections.
6. Keep Super Admin access to all content.
7. Archive, but do not delete, Motorsport Site Page records.
8. Remove Motorsport-only fields from the shared Site Page schema only after proving Gateway and Horse Sport do not consume them.
9. Keep shared Site Page itself for Gateway/Horse if still required.
10. Update seed, migration, deployment, RBAC, Preview, and editor-handover documentation.

## Tests and gate

- Motorsport Admin sees page-specific entries and no legacy Site Page menu/workflow.
- Gateway, Horse Sport, Shared Library, and Super Admin isolation tests pass.
- Preview/publish/revalidation work for every new UID.
- Existing Gateway and Horse builds/routes are unchanged.
- CMS export/import rehearsal restores all page types, media relations, localizations, and publish states.

## Rollback

Restore Motorsport Admin Site Page permissions, unarchive legacy entries, and enable legacy adapters from the tagged pre-cutover release.
