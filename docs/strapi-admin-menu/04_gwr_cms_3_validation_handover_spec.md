# 04 — GWR-CMS-3 RBAC UAT and Editor Handover

## Goal

Prove the segregated workspace contract with real role sessions and document
the operating procedure before resuming Gateway GWR-6.

## UAT matrix

For Gateway, Motorsport, Horse Sport, Shared Library, and Super Admin sessions:

- Verify visible custom workspace entries.
- Verify workspace route allow/deny behavior.
- Verify list rows through workspace and direct Content Manager URLs.
- Verify create, update, clone, delete, publish, and unpublish boundaries where
  supported by the content type.
- Tamper with list filters and submitted `siteScope`; confirm no escalation.
- Verify relationship selectors cannot expose unauthorized records.
- Confirm one managed role per account and document the multi-role rejection.
- Confirm Super Admin remains the only cross-site role.

## Engineering checks

- CMS TypeScript check.
- Strapi production admin build.
- Relevant focused tests.
- Docker Compose CMS smoke test if admin configuration changed materially.
- `git diff --check`.

## Handover updates

- Site-admin quick-start guide with screenshots or concise navigation steps.
- Super Admin scope and shared-content governance guidance.
- Account provisioning and role-assignment steps.
- Media Library shared-pool limitation.
- Staging/production verification checklist.

## Acceptance gate

All role matrices pass, documentation matches observed behavior, and the user
approves resuming Gateway GWR-6.

## Completion evidence — 2026-08-11

GWR-CMS-3 passed the authenticated browser and API UAT matrix for Gateway,
Motorsport, Horse Sport, Shared Library, and Super Admin. Temporary accounts and
records were removed after the run.

- Each managed account saw exactly its own custom workspace; direct access to
  the other three workspace routes was denied.
- Direct Content Manager reads and every tested mutation stayed row-scoped even
  with a modified query filter or direct document URL.
- Create, update, and clone submissions containing a foreign `siteScope` were
  rewritten to the account's managed scope.
- Publish/unpublish succeeded only inside the assigned scope.
- Relation selectors returned only references explicitly allowed for the role.
- Assigning a second managed Sarga role caused the write guard to reject the
  request without changing the record.
- Super Admin retained all four workspaces and deliberate `siteScope` control.

UAT and post-handover regression checks found and resolved three defects:

1. Nested component fields were omitted from generated writable-field
   permissions, which made the SEO component unusable. Permission generation
   now expands component and dynamic-zone field paths recursively.
2. Motorsport relationship selectors could read unrelated global reference
   rows. Dedicated roles now receive conditioned, read-only access only to
   their own Site/Ecosystem Business reference rows.
3. A required `siteScope` field was excluded from both writable and readable
   field lists. This preserved ownership but caused Strapi's native pre-publish
   validation to block Site Page media edits. Managed read permissions now
   include `siteScope`, create/update permissions still exclude it, and the
   server guard also enforces the role scope during publish.

The repeatable authenticated API matrix is
`cms/scripts/validate-workspace-rbac.mjs`; the observed run is recorded in
`uat-results.md`, and the operating procedure is in `editor-handover.md`.
