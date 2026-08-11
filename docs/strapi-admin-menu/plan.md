# Plan: Strapi Per-Site Workspace Segregation

## Decision

Keep one Strapi 5.49 CMS, the existing shared content types, and the internal
`siteScope` ownership field. Give each managed site administrator one dedicated,
prefixed workspace and make scope assignment automatic and immutable for that
role.

This is **virtual segregation**:

- Gateway Admin sees only Gateway workspace navigation and `gateway` records.
- Motorsport Admin sees only Motorsport workspace navigation and `motorsport`
  records.
- Horse Sport Admin sees only Horse Sport workspace navigation and
  `horsesport` records.
- Shared Library Admin, if retained operationally, sees only Shared Library and
  `shared` records.
- Super Admin is the only cross-site role and sees every workspace and record.

Managed site editors do not choose `siteScope`. The field remains in storage and
in backend enforcement because a menu label is not a data-security boundary.

## Why this approach

- Prevents accidental cross-site publishing without duplicating schemas.
- Keeps existing frontend API contracts and migrations stable.
- Uses supported Strapi menu, Content Manager, and RBAC extension points.
- Avoids a fragile native-sidebar override; Strapi's main menu-link API is flat.
- Costs materially less than three sets of News, Event, Page, Gallery, Partner,
  and Ticket CTA collections.

## Approval-gated phases

| Phase     | Title                                       | Outcome                                                                                               | Status              |
| --------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------- |
| GWR-CMS-1 | Architecture and current-state audit        | Approved ownership, navigation, RBAC, field, test, and non-goal contract                              | Complete 2026-08-10 |
| GWR-CMS-2 | Segregated workspace UX and automatic scope | Prefixed site menus, protected workspace routes, permission-aware links, immutable managed-role scope | Complete 2026-08-11 |
| GWR-CMS-3 | RBAC UAT and editor handover                | Role-by-role bypass/tamper testing, CMS build regression, and operating guide                         | Complete 2026-08-11 |
| GWR-CMS-4 | i18n and dynamic navigation architecture    | Repository audit, locale/URL/content matrix, navigation contract, risks, effort, and phased specs     | Complete 2026-08-11 |
| GWR-CMS-5 | CMS i18n and navigation foundations         | Rehearsed localization migration, top-navigation model, RBAC, seeds, and localized API contract       | Complete 2026-08-11 |
| GWR-CMS-6 | Gateway i18n and dynamic navigation         | English parity, `/id` routes, language switch, CMS navigation, dictionaries, hreflang, and sitemap    | Complete 2026-08-11 |
| GWR-CMS-7 | Motorsport and Horse Sport rollout          | Dedicated-site bilingual routing, dictionaries, navigation, cross-site locale behavior, and UAT       | Complete 2026-08-11 |
| GWR-CMS-8 | Migration, complete UAT, and handover       | Staging promotion, five-role/two-locale UAT, deployment, rollback, editor guide, and launch readiness | Not started         |

Detailed specifications:

- `01_architecture_spec.md`
- `02_gwr_cms_1_audit_spec.md`
- `03_gwr_cms_2_implementation_spec.md`
- `04_gwr_cms_3_validation_handover_spec.md`
- `05_gwr_cms_4_i18n_navigation_assessment.md`
- `06_gwr_cms_5_cms_i18n_navigation_spec.md`
- `07_gwr_cms_6_gateway_i18n_navigation_spec.md`
- `08_gwr_cms_7_dedicated_sites_i18n_navigation_spec.md`
- `09_gwr_cms_8_i18n_migration_uat_handover_spec.md`
- `10_gwr_cms_5_migration_rehearsal.md`
- `audit.md` — completed GWR-CMS-1 evidence and gaps

## Scope boundary

This sub-track does not:

- create a second CMS or database;
- create per-site duplicate collections;
- patch or fork Strapi's native sidebar;
- replace the native Content Manager list/edit screens;
- change frontend public query contracts;
- duplicate existing shared editorial collections per locale or site;
- promise per-site Media Library row isolation.

The native Content Manager may retain a collection's global display name after
an editor follows a prefixed workspace link. The records and actions remain
site-scoped by RBAC. Replacing the complete native Content Manager is outside
this lower-effort implementation.

## Approval gate

GWR-CMS-7 is complete. Do not start staging migration, full authenticated UAT,
or launch handover until the user approves GWR-CMS-8. Gateway GWR-6 remains
paused.
