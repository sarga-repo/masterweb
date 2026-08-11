# 01 — Virtual Segregation Architecture

## Objective

Give each public site a dedicated editorial workspace in the single shared
Strapi instance. A managed site administrator must neither see another site's
custom workspace nor choose which site owns a record.

## Role and workspace contract

| Role                     | Custom workspace visibility | Record ownership | Scope field UX   |
| ------------------------ | --------------------------- | ---------------- | ---------------- |
| `sarga-gateway-admin`    | Gateway only                | `gateway`        | Hidden/immutable |
| `sarga-motorsport-admin` | Motorsport only             | `motorsport`     | Hidden/immutable |
| `sarga-horsesport-admin` | Horse Sport only            | `horsesport`     | Hidden/immutable |
| `sarga-shared-admin`     | Shared Library only         | `shared`         | Hidden/immutable |
| `strapi-super-admin`     | All workspaces              | All scopes       | Visible/editable |

The Super Admin role is the only supported cross-site role. The number of Super
Admin user accounts is an operational decision; bootstrap must not delete or
downgrade existing administrators automatically. Assign exactly one managed
workspace role to each site editor.

## Navigation contract

Strapi's supported main navigation API remains flat. Keep one permission-gated
top-level entry for each workspace. Within it, render grouped, prefixed links:

```text
Sarga Gateway
├── Gateway Pages
├── Gateway News
├── Gateway Events
├── Gateway Ticket CTAs
├── Gateway Partners
├── Gateway Careers
└── Gateway Reports

Sarga Motorsport
├── Motorsport Pages
├── Motorsport Programs
├── Motorsport Riders
├── Motorsport Standings
├── Motorsport Regulations
├── Motorsport Events
├── Motorsport News
├── Motorsport Galleries
├── Motorsport Merchandise
├── Motorsport Ticket CTAs
└── Motorsport Partners

Sarga Horse Sport
├── Horse Sport Pages
├── Horse Sport Events
├── Horse Sport News
├── Horse Sport Galleries
├── Horse Sport Ticket CTAs
└── Horse Sport Partners
```

Shared Library stays separate from all three site workspaces. No site role
receives its workspace action.

The workspace route itself must be protected with the corresponding custom
permission. Link visibility alone is insufficient because a known route can be
opened directly.

## Ownership and write contract

`siteScope` remains on every scoped record. For managed site roles:

1. Create/update field permissions exclude `siteScope` from submitted editor
   fields.
2. The workspace shows a read-only context badge such as
   `Workspace: Sarga Motorsport`.
3. The server Document Service guard overwrites scope on create, update, and
   clone with the managed role's assigned value.
4. Read/update/delete/publish permissions retain their existing scope
   conditions.
5. Direct Content Manager URLs and modified query strings cannot expand record
   access.

Super Admin retains the normal field and can deliberately manage `shared` or
`hidden` records. Scope changes by Super Admin are governance-sensitive and
must be included in editorial handover guidance.

## Shared and unscoped content

- `Site`, `Leadership Person`, and `Timeline Item` do not carry `siteScope` and
  remain Shared Library/Super Admin responsibilities.
- Inquiry submissions and newsletter subscriptions remain Super Admin/system
  concerns unless a later approved role contract adds them.
- Media Library files do not carry `siteScope`. Use site-named folders; do not
  treat the shared library as confidential or site-isolated storage.

## Native Content Manager limitation

Prefixed names belong to the custom workspace. The same shared collection has
one global native Content Manager display name, so the native list/edit screen
may still say `News Article` rather than `Gateway News`. This does not weaken
record segregation. Role-dependent renaming of native collections or a full
Content Manager replacement is not included.

## Security invariants

- UI filters are convenience only.
- Menu visibility is convenience only.
- RBAC conditions, field permissions, page protection, and the server write
  guard form the enforcement boundary.
- A managed account with multiple Sarga workspace roles is rejected for writes.
- No managed site role can publish another site's record.
