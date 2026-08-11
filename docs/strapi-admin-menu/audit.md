# GWR-CMS-1 Current-State Audit

Date: 2026-08-10
Strapi: 5.49.0

## Executive finding

The repository already has the correct foundation: four permission-gated flat
workspace links, grouped custom workspace pages, site-scoped Content Manager
permissions, and a server write guard. GWR-CMS-2 is a hardening/refinement
phase, not a CMS redesign.

The main missing controls are page-level workspace route protection,
permission-aware workspace actions, and removal of `siteScope` from managed
site-editor field permissions. Prefixing the custom actions is a small UI
change.

## Touchpoint inventory

| Area                | Current implementation                                                                                                                         | Finding                                       |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| Main menu           | `cms/src/admin/app.tsx` registers Gateway, Motorsport, Horse Sport, and Shared Library with separate access actions                            | Keep; supported flat-link approach            |
| Workspace page      | `WorkspacePage.tsx` contains typed workspace definitions, grouped anchor navigation, cards, scoped list URLs, create links, and guardrail copy | Refine rather than replace                    |
| Page protection     | Menu links have permissions, but the shared page component has no `Page.Protect`/`useRBAC` guard                                               | Required in GWR-CMS-2                         |
| Role actions        | `sarga-workspaces.ts` registers four workspace actions and four scope conditions                                                               | Keep                                          |
| Record reads/writes | Read/update/delete/publish use scope conditions                                                                                                | Keep and UAT                                  |
| Create scope        | Create is permitted and Document Service middleware forces the role scope for create/update/clone                                              | Keep; make scope non-editable in UI           |
| Permission fields   | Managed permissions do not currently supply restricted `properties.fields`                                                                     | Exclude `siteScope` for managed create/update |
| Super Admin         | Super Admin permissions are refreshed after custom actions register                                                                            | Keep unrestricted                             |
| Multi-role account  | Writes fail when more than one managed Sarga role is assigned                                                                                  | Keep and document                             |
| Media Library       | Shared upload pool; no `siteScope` on files                                                                                                    | Known limitation, no change                   |

## Workspace link and RBAC comparison

| Workspace      | Custom links present                                                                                                             | Current permitted-but-unlinked subjects | Result                            |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | --------------------------------- |
| Gateway        | Homepage, Site Pages, News, Events, Galleries, Reports, Jobs, Ecosystem Businesses                                               | Ticket CTA, Partner                     | Add prefixed actions in GWR-CMS-2 |
| Motorsport     | Pages, Programs, Riders, Standings, Regulations, Merchandise, Events, News, Galleries, Ticket CTAs, Partners                     | None identified                         | Prefix and permission-filter      |
| Horse Sport    | Pages, Events, News, Galleries, Ticket CTAs, Partners                                                                            | None identified                         | Prefix and permission-filter      |
| Shared Library | Pages, News, Events, Galleries, Ticket CTAs, Partners, Ecosystem Businesses, Site Directory, Leadership, Timeline, Reports, Jobs | None identified                         | Keep isolated from site roles     |

## Schema scope coverage

- Shared editorial types (`site-page`, `news-article`, `event`,
  `media-gallery`, `ticket-cta`, and `partner`) support Gateway, Motorsport,
  Horse Sport, Shared, and Hidden.
- Motorsport program/rider/standing/regulation and merchandise records carry
  the same enum, but managed permissions expose them only to Motorsport.
- Corporate Report and Job Vacancy intentionally support Gateway, Shared, and
  Hidden only.
- Homepage is an unscoped Gateway single type.
- Site, Leadership Person, Timeline Item, Inquiry Submission, and Newsletter
  Subscription have no `siteScope`.

## Risk-ranked GWR-CMS-2 gaps

### High

1. Protect the workspace page itself; hidden menu links do not deny a known
   custom route.
2. Remove `siteScope` from managed-role create/update fields while retaining the
   server overwrite guard.

### Medium

1. Permission-filter every workspace card/action to prevent configuration drift
   from producing visible forbidden links.
2. Add direct route, filter tampering, submitted-scope tampering, clone, and
   relationship-selector tests.

### Low

1. Prefix custom workspace labels by site.
2. Add Gateway Ticket CTA and Partner actions already covered by Gateway RBAC.
3. Replace “choose siteScope” guidance with immutable workspace context.

## Explicit non-gaps

- A native nested Strapi sidebar is not required.
- Duplicate per-site content types are not required.
- Seed or schema changes are not required for navigation segregation.
- Per-role native collection display names are not available through the
  supported menu-link contract and are not an acceptance criterion.

## GWR-CMS-1 verification

- Compared every custom workspace link UID with the managed role subject lists.
- Inspected all current API schemas for `siteScope` presence and enum coverage.
- Confirmed the shared page has grouped navigation and scoped Content Manager
  URLs but no page-level permission wrapper.
- Confirmed this phase changes documentation only; no CMS runtime behavior was
  modified.
