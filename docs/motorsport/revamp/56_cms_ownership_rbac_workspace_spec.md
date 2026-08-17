# MSR-CMS-OWNERSHIP-5 — RBAC and workspace handover

The Motorsport workspace lists Motorsport Event, Motorsport Leadership Person,
Motorsport Merchandise Item, Motorsport News Article, Motorsport Partner,
Motorsport Ticket CTA, and Motorsport Top Navigation Item. Shared references
remain available only where needed and are read-only where possible.

| Role | Dedicated Motorsport collections | Motorsport Single Types | Shared references |
| --- | --- | --- | --- |
| Motorsport Admin | CRUD + publish | CRUD + publish | scoped read/approved access |
| Super Admin | unrestricted | unrestricted | unrestricted |
| Gateway Admin | no access | no access | Gateway/shared only |
| Horse Sport Admin | no access | no access | Horse/shared only |
| Shared Library Admin | no access | no access | shared library only |

The bootstrap RBAC synchronizer is authoritative: it replaces the Motorsport
Admin permission set on every Strapi boot. Its resulting role records must
contain only the dedicated Motorsport collections, Motorsport Program,
Regulation, Rider, Standing, the ten Motorsport page Single Types, the
approved shared references, and media/i18n actions. Legacy shared Motorsport
collection types and `Site Page` must not be granted to Motorsport Admin.

Authenticated UAT must verify direct collection URLs and API actions, not only
sidebar visibility, after a Strapi restart and fresh login. The role-record
check is an additional release gate; it does not replace an editor smoke test.
