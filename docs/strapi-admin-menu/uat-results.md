# GWR-CMS-3 Authenticated RBAC UAT Results

Date: 2026-08-11
Strapi: 5.49.0
Database: local PostgreSQL (`sarga_strapi`)

## Result

Pass. Five real admin sessions were tested through the login UI and authenticated
Content Manager API. Temporary `codex-uat-*` users and records were deleted at
the end of the run.

| Role                 | Visible custom workspaces | Own rows/actions | Foreign route/row mutations | Scope field                         |
| -------------------- | ------------------------: | ---------------: | --------------------------: | ----------------------------------- |
| Gateway Admin        |                         1 |             Pass |                      Denied | Readable for validation; non-editable |
| Motorsport Admin     |                         1 |             Pass |                      Denied | Readable for validation; non-editable |
| Horse Sport Admin    |                         1 |             Pass |                      Denied | Readable for validation; non-editable |
| Shared Library Admin |                         1 |             Pass |                      Denied | Readable for validation; non-editable |
| Super Admin          |                         4 |             Pass |           Allowed by design | Deliberately editable               |

For every managed role, the API matrix passed scoped list reads, tampered list
filters, create, update, clone, delete, publish, unpublish, relationship
selectors, and direct cross-role GET/PUT/DELETE/publish attempts. A temporary
multi-role assignment was also rejected before data mutation.

## Defects closed during UAT

- Nested component field permissions now include paths such as
  `seo.metaTitle`; Content Manager read permissions receive the same explicit
  field list so detail forms do not mask authorized fields after a role
  resynchronization.
- Managed read permissions include `siteScope` so Strapi can validate the
  required ownership field before publishing. Create/update permissions exclude
  it, and the request guard forces the managed role's scope during publish.
- Site and Ecosystem Business relations now use narrow read-only conditions so
  relation pickers cannot enumerate another site's references.

## Repeat the API matrix

Create disposable accounts in a non-production environment, keep credentials in
the environment/secret store, then run from the repository root:

```bash
CMS_UAT_BASE_URL=https://cms-staging.example.com \
CMS_UAT_PASSWORD='<temporary shared UAT password>' \
CMS_UAT_GATEWAY_EMAIL='<gateway UAT email>' \
CMS_UAT_MOTORSPORT_EMAIL='<motorsport UAT email>' \
CMS_UAT_HORSESPORT_EMAIL='<horse sport UAT email>' \
CMS_UAT_SHARED_EMAIL='<shared UAT email>' \
CMS_UAT_SUPERADMIN_EMAIL='<super admin UAT email>' \
pnpm --dir cms uat:workspace-rbac
```

The script creates uniquely named test News records, validates the matrix, and
cleans those records in a `finally` path. Delete the disposable admin accounts
afterward and confirm no `codex-uat-*` records remain. Never run this harness
against production without an approved maintenance window and disposable test
accounts.

## Browser smoke checklist

For each managed account: log in, confirm one Sarga workspace link, confirm the
other three `/admin/sarga-workspaces/*` routes are denied, open/create its News
record, confirm the workspace badge is immutable, add SEO metadata, and inspect
a relationship selector. For Motorsport Admin, replace a Site Page hero-slide
image by selecting an existing Browse-tab asset checkbox, save, publish, and
confirm the record remains `motorsport`. Confirm the inline media-picker help is
visible and that clicking the preview opens Details without selecting it. For
Super Admin, confirm four workspace links and the editable scope control.

## Known native behavior

Strapi's stock sidebar is flat. A dedicated role may also see a narrowly
conditioned read-only Site or Ecosystem Business collection because Content
Manager relation selectors require target read permission. Only the role-owned
reference row is readable and no create/update/delete/publish permission is
granted. The Media Library remains one shared, non-confidential asset pool.
The automated matrix asserts Media Library read/create permissions and an
authenticated existing-asset list response for every managed role.
Update/delete remains Super Admin-only because Strapi combines those
shared-pool actions.
