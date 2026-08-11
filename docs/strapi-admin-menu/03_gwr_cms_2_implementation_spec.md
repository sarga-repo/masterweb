# 03 — GWR-CMS-2 Segregated Workspace UX and Automatic Scope

## Goal

Implement the smallest supported Strapi change that gives site administrators
one clearly branded workspace, prefixed content actions, protected workspace
routes, and no editable site selector.

## Planned changes

### Workspace configuration

- Refactor workspace labels into an explicit, typed per-workspace matrix.
- Prefix site-owned actions with `Gateway`, `Motorsport`, or `Horse Sport`.
- Add currently permitted but missing Gateway Ticket CTA and Partner actions.
- Retain grouped Pages, Programs, Editorial, Commerce, and Library navigation.
- Show an immutable workspace badge and remove instructions to select a scope.
- Filter cards/actions through the current administrator's permissions.

### Route protection

- Protect each `/sarga-workspaces/<scope>` page with its corresponding custom
  action using Strapi's supported page/RBAC components.
- Render an unauthorized state for direct cross-workspace route attempts.

### Field permissions and server enforcement

- Extend managed create/update permission properties so `siteScope` is not an
  editor-writable field.
- Derive the permitted field list from the registered content-type schema rather
  than maintaining a second handwritten list.
- Preserve the existing scope conditions for read/update/delete/publish.
- Preserve and test the write guard for create/update/clone/publish.
- Leave Super Admin permissions and scope visibility unrestricted.

### Documentation

- Update editor-facing language from “select siteScope” to “scope is assigned
  automatically from your workspace role.”

## Expected files

- `cms/src/admin/extensions/sarga-workspaces/WorkspacePage.tsx`
- `cms/src/access-control/sarga-workspaces.ts`
- focused admin/RBAC tests or verification scripts if the repository supports
  them
- impacted CMS and Gateway documentation
- `docs/PHASE_PROGRESS.md`

No schema or seed change is expected.

## Acceptance gate

- Each managed role sees exactly one custom workspace menu.
- Direct access to a different workspace route is denied.
- Managed create/edit forms do not offer an editable `siteScope` field. The
  value may be returned read-only because Strapi requires it for native publish
  validation.
- Created, updated, and cloned records always retain the assigned site scope.
- Super Admin sees all workspaces and retains deliberate scope control.
- Strapi type-check and production admin build pass.

Stop after implementation evidence and await approval before GWR-CMS-3.

## Implementation result

Status: completed 2026-08-11.

- Site-owned workspace actions are prefixed and Gateway now exposes its Ticket
  CTA, Partner, Corporate Report, and Job Vacancy actions.
- Every workspace page is protected by its custom access action; cards, create
  actions, and in-page navigation are filtered through the current role's
  Content Manager permissions.
- Managed create/update permissions derive writable fields from the registered
  schema and exclude `siteScope`. Read permissions include the stored scope so
  Strapi can validate required fields before publishing, while the Document
  Service guard assigns the role scope for create/update/clone/publish
  operations.
- The workspace header displays an immutable scope badge and no longer instructs
  managed editors to choose a site scope.
- Focused permission tests, CMS TypeScript compilation, and the production admin
  build pass. Runtime database inspection confirms zero managed-role writable
  permissions containing `siteScope`, one workspace action per managed role,
  and all four workspace actions for Super Admin.

Authenticated browser UAT for each provisioned managed role and Super Admin is
reserved for GWR-CMS-3. The available browser session reached the Strapi login
screen but did not have reusable administrator credentials.
