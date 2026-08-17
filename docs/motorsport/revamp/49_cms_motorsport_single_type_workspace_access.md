# Motorsport Single-Type workspace access

## Decision

The dedicated Motorsport page documents are managed from the Motorsport
workspace only. The `Sarga Motorsport Admin` role receives Content Manager
read, create, update, delete, and publish permissions for the ten
`motorsport-*-page` Single Types. Gateway and Horse Sport roles do not receive
those permissions. Super Admin retains access to all content types.

The custom Motorsport workspace lists each Single Type explicitly so an editor
can open the correct page document without searching the legacy `Site Page`
collection:

- Homepage
- About Page
- Events Page
- News Page
- Gallery Page
- Merchandise Page
- Tickets Page
- Contact Page
- Partners Page
- Experience Page

## Existing database repair

Workspace permissions are reconciled during Strapi bootstrap through the
existing `buildRolePermissions`/`assignPermissions` flow. The role definition
now places the dedicated Single Types in the Motorsport role (and removes them
from Gateway). Restarting Strapi once applies the permission delta to an
existing local or staging database; no manual role editing is required.

## Editor workflow

1. Sign in as `Sarga Motorsport Admin`.
2. Open the Motorsport workspace entry in the admin sidebar.
3. Choose a `Motorsport ... Page` card and select **Manage content**.
4. Edit the page, save the draft, and publish when the content is approved.

The legacy `Site Page` collection remains available for records that have not
yet been migrated. It is not the editor location for the dedicated Single
Types.

## Verification

- Motorsport Admin can see and open all ten dedicated page cards.
- Gateway Admin and Horse Sport Admin cannot see or open those cards.
- Super Admin can see all page Single Types.
- `SINGLE TYPES` in Content Manager is populated for Motorsport Admin after a
  fresh admin session (or a hard refresh after the Strapi restart).
