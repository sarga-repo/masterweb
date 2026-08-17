# Motorsport CMS ownership and route-management plan

Date: 2026-08-16  
Status: Implemented and validated through `MSR-CMS-OWNERSHIP-7`.  
Scope: Motorsport-owned Strapi content only. Gateway, Horse Sport, and shared-library content remain operational throughout the migration.

## Objective

Give Sarga Motorsport a clear CMS boundary without introducing a second Strapi
instance or breaking the current Next.js frontend, Draft Preview, i18n,
show/hide controls, ticket redirects, or RBAC. Motorsport editors should work
from clearly named `Motorsport ...` collection entries, while genuinely shared
records stay shared.

The current `Motorsport Program`, `Motorsport Regulation`, `Motorsport Rider`,
and `Motorsport Standing` schemas are collection types (many records), not
Single Types. They are already Motorsport-owned and remain unchanged.

## Ownership decision

| Current label | Decision | Target label / UID | Owner |
| --- | --- | --- | --- |
| Ecosystem Business | Keep shared | existing UID | Shared, Motorsport read-only reference |
| Event | Migrate Motorsport records only | `Motorsport Event` / `api::motorsport-event.motorsport-event` | Motorsport |
| Leadership Person | Migrate Motorsport records only | `Motorsport Leadership Person` / `api::motorsport-leadership-person.motorsport-leadership-person` | Motorsport |
| Media Gallery | Keep shared | existing UID | Shared, scope-filtered |
| Merchandise Item | Migrate Motorsport records only | `Motorsport Merchandise Item` / `api::motorsport-merchandise-item.motorsport-merchandise-item` | Motorsport |
| Motorsport Program | Keep | existing UID | Motorsport |
| Motorsport Regulation | Keep | existing UID | Motorsport |
| Motorsport Rider | Keep | existing UID | Motorsport |
| Motorsport Standing | Keep | existing UID | Motorsport |
| News Article | Migrate Motorsport records only | `Motorsport News Article` / `api::motorsport-news-article.motorsport-news-article` | Motorsport |
| Partner | Migrate Motorsport records only | `Motorsport Partner` / `api::motorsport-partner.motorsport-partner` | Motorsport |
| Site | Keep shared | existing UID | Shared site registry |
| Site Page | Deprecate Motorsport records after cutover | legacy rollback archive | No new Motorsport editing |
| Ticket CTA | Migrate Motorsport records only | `Motorsport Ticket CTA` / `api::motorsport-ticket-cta.motorsport-ticket-cta` | Motorsport |
| Top Navigation Item | Migrate Motorsport records only | `Motorsport Top Navigation Item` / `api::motorsport-top-navigation-item.motorsport-top-navigation-item` | Motorsport |

“Migrate Motorsport records only” means records with an explicit Motorsport
scope or an approved Motorsport site relation. Gateway/Horse Sport records stay
in the existing shared collections and are never copied into a Motorsport
collection.

## Safety rules

1. New schemas are additive. No existing collection or record is deleted in the
   first implementation phases.
2. Migration is idempotent and flag-gated (`MOTORSPORT_OWNERSHIP_MIGRATION_MODE`)
   so a normal Strapi boot cannot unexpectedly copy or alter content.
3. Copies preserve English/Indonesian locales, draft/published state, media,
   ordering, and relations. A legacy document-ID mapping is retained.
4. Frontend reads use dedicated Motorsport records only after retirement. Draft
   Preview is exact-document and never falls back to a different record.
5. Legacy Motorsport records are unpublished into a reversible archive, never
   deleted or re-scoped. A Strapi database-store restoration manifest is
   retained for one release cycle.
6. Only `Sarga Motorsport Admin` and Super Admin receive create/update/delete/
   publish permissions for new Motorsport collections and Single Types.

## RoutePath decision

Each of the ten Motorsport page Single Types receives a non-localized,
CMS-visible `routePath` string constrained by a lifecycle validator to the
approved values:

`/`, `/about`, `/events`, `/news`, `/gallery`, `/merchandise`, `/tickets`,
`/contact`, `/partners`, `/experience`.

The field is constrained rather than an arbitrary URL input. The lifecycle
validator rejects duplicates, invalid values, and missing required page paths.
The frontend keeps
the current code route as a fallback when CMS is unavailable. A published route
manifest maps the CMS path to the existing page renderer. When a published path
changes, the previous path is retained as an alias and permanently redirects to
the new path. Preview uses the draft route value for the edited Single Type;
navigation and sitemap use the published manifest.

## Phased delivery

| Phase | Scope | Risk boundary | Exit gate |
| --- | --- | --- | --- |
| `MSR-CMS-OWNERSHIP-0` | Audit, ownership matrix, relation inventory, migration contract | Documentation/read-only checks | Current schemas, RBAC, Preview, and frontend dependencies reconciled |
| `MSR-CMS-OWNERSHIP-1` | Add seven Motorsport collection schemas, types, and RBAC subjects | Additive; no data copied | Strapi compiles; role matrix passes; labels are isolated |
| `MSR-CMS-OWNERSHIP-2` | Idempotent dry-run and copy migration | Flag-gated; no legacy deletes | Zero collisions; complete relation/media/locale report |
| `MSR-CMS-OWNERSHIP-3` | Dedicated-first frontend adapters and revalidation | Dual-read; rollback flag | All Motorsport routes, Preview, EN/ID, and tickets pass |
| `MSR-CMS-OWNERSHIP-4` | `routePath`, validation, manifest, aliases, Preview | Additive resolver/canonical fallback | Invalid/duplicate paths rejected; redirect verified |
| `MSR-CMS-OWNERSHIP-5` | Workspace labels, editor help, authenticated RBAC UAT | Permission changes only for new subjects | Motorsport-only editor access proven |
| `MSR-CMS-OWNERSHIP-6` | Legacy Motorsport archive and shared cleanup | Reversible archive; no deletion | Legacy reads unused; restoration manifest verified |
| `MSR-CMS-OWNERSHIP-7` | Full UAT, deployment, and handover | Release gate | Browser, Preview/live, Docker, seed, and rollback pass |

## Required phase documents

`52_cms_ownership_foundation_spec.md`, `53_cms_ownership_migration_spec.md`,
`54_cms_ownership_frontend_cutover_spec.md`,
`55_cms_routepath_management_spec.md`,
`56_cms_ownership_rbac_workspace_spec.md`, and
`57_cms_ownership_retirement_uat_handover.md`.

## Non-goals

No second CMS, arbitrary CMS-created Next.js routes, payment/checkout/account
work, Gateway/Horse Sport schema migration, or physical deletion of shared or
legacy records is included.
