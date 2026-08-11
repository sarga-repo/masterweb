# Sarga.co Gateway Revamp Checklist

## GWR-0 — Discovery and specification

- [x] Review Website Sarga.co Preview and Brand Visual Preview.
- [x] Review `sarga.co_sitemap.pdf`.
- [x] Audit current routes, homepage structure, fonts, and CMS models.
- [x] Define source precedence and scope boundary.
- [x] Define target IA and page templates.
- [x] Define typography, visual, photography, and responsive rules.
- [x] Define CMS full-page/Coming Soon contract.
- [x] Define implementation phases and UAT gates.

## GWR-1 — CMS and IA foundations

- [x] Implement reusable page availability component.
- [x] Add CMS validation and Gateway admin guidance.
- [x] Add missing site-page seed records and safe migration.
- [x] Add missing route shells and typed adapters.
- [x] Implement Press Releases channel filter.
- [x] Resolve ecosystem API `400`.
- [x] Verify seed idempotency and role segregation.

## GWR-2 — Typography, tokens, and shell

- [x] Obtain approved Zalando ExtraBold asset or record launch blocker.
- [x] Implement responsive type/line-height tokens.
- [x] Recalibrate navigation size and alignment.
- [x] Recalibrate footer and shared surfaces.
- [x] Add cross-route heading overflow protection.
- [x] Capture and internally review shell screenshots at required viewports.
- [x] Obtain stakeholder approval before starting GWR-3.

## GWR-3 — Homepage

- [x] Recompose warm reference-aligned hero.
- [x] Remove or relocate nonessential hero metrics.
- [x] Make About views functional and CMS-managed.
- [x] Align ecosystem composition and interaction.
- [x] Refine News, Ticket Hub, newsletter, and transitions.
- [x] Complete internal responsive and interaction review.
- [x] Obtain stakeholder approval before starting GWR-4.

## GWR-4 — Corporate pages

- [x] About hub.
- [x] History.
- [x] Board of Directors.
- [x] Company Structure.
- [x] Annual Report.
- [x] Sustainability Report.
- [x] Careers.
- [x] CMS-managed career discipline counts and vacancy roster.
- [x] Vacancy keyword/type/mode filters and eight-item pagination.
- [x] Reusable vacancy detail route and validated LinkedIn apply links.
- [x] Contact.
- [x] Complete internal responsive, interaction, and console review.
- [x] Obtain stakeholder approval before starting GWR-5.

## GWR-5 — Ecosystem pages

- [x] Ecosystem hub.
- [x] Motorsport and Horse Sport external links.
- [x] Sarga Venues full and Coming Soon states.
- [x] Sarga Media full and Coming Soon states.
- [x] Sarga Tech full and Coming Soon states.
- [x] Sitemap/noindex/404 behaviour.
- [x] CMS toggle and content-readiness regression.
- [x] Responsive, keyboard, and console review.
- [ ] Obtain stakeholder approval before starting GWR-6.

## GWR-CMS-1 — CMS workspace architecture and audit

- [x] Approve virtual segregation instead of duplicated per-site collections.
- [x] Define managed-role, Super Admin, and Shared Library boundaries.
- [x] Define automatic immutable `siteScope` behavior for managed site roles.
- [x] Audit workspace links, RBAC subjects, write guard, and schema scope coverage.
- [x] Record native Content Manager and shared Media Library limitations.
- [x] Create implementation and validation specifications.
- [x] Obtain stakeholder approval before starting GWR-CMS-2.

## GWR-CMS-2 — Segregated CMS workspace implementation

- [x] Prefix site-owned workspace actions.
- [x] Add missing Gateway Ticket CTA and Partner actions.
- [x] Protect direct custom workspace routes.
- [x] Permission-filter workspace cards and actions.
- [x] Remove `siteScope` from managed create/update field permissions.
- [x] Preserve server-assigned scope and Super Admin control.
- [x] Pass CMS type-check and production admin build.
- [x] Obtain stakeholder approval before starting GWR-CMS-3.

## GWR-CMS-3 — CMS RBAC UAT and handover

- [x] Test every managed role and Super Admin session.
- [x] Test direct routes, modified filters, submitted scope, clone, and relations.
- [x] Verify Shared Library remains absent from dedicated site roles.
- [x] Update editor and deployment handover guidance.
- [x] Obtain stakeholder approval to assess the i18n/navigation continuation.

## GWR-CMS-4 — i18n and dynamic navigation architecture

- [x] Audit current Strapi i18n/locales and localization schema state.
- [x] Audit hard-coded navigation and locale handling across all three sites.
- [x] Define English/Indonesian URL, fallback, SEO, and dictionary contracts.
- [x] Define CMS Top Navigation ownership, fields, toggle, order, and fallback.
- [x] Define localization matrix, migration safeguards, risks, and effort.
- [x] Create GWR-CMS-5 through GWR-CMS-8 phase specifications.
- [x] Obtain stakeholder approval before starting GWR-CMS-5.

## GWR-CMS-5 — CMS i18n and navigation foundations

- [x] Rehearse migration against a restored database copy.
- [x] Configure `en` and `id` and apply the approved localization matrix.
- [x] Add Top Navigation schema, validation, seeds, workspace, and RBAC.
- [x] Verify localized API, draft/publish, relations, and role boundaries.
- [x] Obtain stakeholder approval before starting GWR-CMS-6.

## GWR-CMS-6 — Gateway i18n and dynamic navigation

- [x] Preserve unprefixed English routes and add `/id` routes.
- [x] Add Gateway dictionaries and language control.
- [x] Integrate locale-aware Strapi content and CMS top navigation.
- [x] Verify metadata, hreflang, sitemap, fallback, responsive, and keyboard behavior.
- [x] Obtain stakeholder approval before starting GWR-CMS-7.

## GWR-CMS-7 — Motorsport and Horse Sport rollout

- [x] Add locale routing, dictionaries, and language controls to both sites.
- [x] Integrate each site's scoped CMS top navigation.
- [x] Verify all localized content adapters and cross-site locale links.
- [x] Complete responsive, accessibility, and role-segregation UAT.
- [x] Obtain stakeholder approval before starting GWR-CMS-8.

## GWR-CMS-8 — migration, UAT, and handover

- [x] Rehearse and exactly reconcile CMS content/media/localizations in an
      isolated restored database.
- [ ] Promote and reconcile the approved archive on the staging VM.
- [x] Complete local two-locale/five-role and three-site browser UAT.
- [ ] Repeat the authenticated/browser matrix on staging HTTPS domains.
- [x] Complete local SEO, sitemap, Docker, backup, and rollback checks.
- [ ] Capture the production backup/rollback drill and launch approval.
- [x] Hand over bilingual editorial and navigation procedures.
- [ ] Obtain stakeholder approval before resuming GWR-6.

## GWR-CMS-9 — multisite hero video

- [x] Add reusable CMS video/poster fields without weakening per-site RBAC.
- [x] Support Gateway and Horse Sport home video with image fallback.
- [x] Support video per Motorsport slide and cap the carousel at three slides.
- [x] Mount only active video and provide pause/play and reduced-motion behavior.
- [x] Verify schema, type generation, tests, builds, responsive playback, and
      static fallback.
- [x] Document editorial, media promotion, VM/Nginx, backup, and staging checks.
- [ ] Upload business-approved video sources and repeat HTTPS staging UAT.

## GWR-CMS-10 — Motorsport homepage managed sections

- [x] Add scoped Race Control and World of Motorsport CMS components.
- [x] Add optional featured Event relation with Motorsport/shared validation.
- [x] Add enabled, ordered, image-manageable discipline cards with safe links.
- [x] Backfill only missing development fields without replacing editor data.
- [x] Verify recursive managed-role fields and immutable site scope.
- [x] Verify API, desktop/mobile rendering, fallback, build, and documentation.
- [ ] Promote the reviewed CMS snapshot and repeat role/browser checks on staging.

## GWR-6 — Publications and tickets

- [ ] News hub.
- [ ] Press Releases filter.
- [ ] Article detail.
- [ ] Ticket Hub and detail.
- [ ] External ticket safety.

## GWR-7 — QA and launch readiness

- [ ] Responsive visual UAT.
- [ ] Accessibility and keyboard UAT.
- [ ] Reduced-motion UAT.
- [ ] CMS and seed/migration regression.
- [ ] SEO, sitemap, redirects, and metadata.
- [ ] Docker Compose regression.
- [ ] Deployment/editor handover updates.
- [ ] Final approval.
