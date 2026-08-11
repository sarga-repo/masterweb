# 05 — Approval-Gated Implementation Phases

No phase proceeds without user approval of the previous phase.

| Phase      | Title                                        | Outcome                                                                                     |
| ---------- | -------------------------------------------- | ------------------------------------------------------------------------------------------- |
| GWR-0      | Discovery and specification                  | Approved audit, IA, design, CMS contract, and UAT plan                                      |
| GWR-1      | CMS and information architecture foundations | Page availability, missing page records/routes, seed migration, and typed adapters          |
| GWR-2      | Typography, tokens, and global shell         | Approved Zalando weight, Plus Jakarta Sans, responsive type scale, header, footer, surfaces |
| GWR-3      | Homepage reference alignment                 | Warm hero, About interaction, ecosystem composition, publications, ticket/newsletter flow   |
| GWR-4      | Corporate and report pages                   | About, History, Board, Structure, Annual Report, Sustainability, Careers, Contact           |
| GWR-5      | Ecosystem hub and dedicated pages            | Sports deep links; Venues, Media, Tech live/Coming Soon templates                           |
| GWR-CMS-1  | CMS workspace architecture and audit         | Approved virtual-segregation contract and current-state gap analysis                        |
| GWR-CMS-2  | Segregated CMS workspace implementation      | Prefixed site menus, protected routes, permission-aware actions, automatic immutable scope  |
| GWR-CMS-3  | CMS RBAC UAT and handover                    | Role/bypass/tamper validation and editor operating guide                                    |
| GWR-CMS-4  | i18n and navigation architecture             | Locale/URL/content matrix, dynamic-navigation contract, migration risks, and rollout plan   |
| GWR-CMS-5  | CMS i18n and navigation foundations          | Localized schemas/API, migration rehearsal, navigation model, RBAC, and seeds               |
| GWR-CMS-6  | Gateway i18n and dynamic navigation          | English parity, `/id`, dictionaries, language control, CMS menu, hreflang, and sitemap      |
| GWR-CMS-7  | Dedicated-site i18n/navigation rollout       | Motorsport and Horse Sport locale, shell, content, metadata, and navigation integration     |
| GWR-CMS-8  | i18n migration, UAT, and handover            | Staging migration, two-locale/five-role UAT, deployment, rollback, and editor handover      |
| GWR-CMS-9  | Multisite hero video                         | Shared CMS MP4/WebM hero media, three-site rendering, controls, fallback, and handover      |
| GWR-CMS-10 | Motorsport homepage managed sections         | Race Control Event/copy and ordered World of Motorsport discipline authoring                |
| GWR-6      | Publications and Ticket Hub                  | News, Press Releases, article detail, ticket discovery/detail visual alignment              |
| GWR-7      | Cross-route QA and launch readiness          | Responsive, accessibility, CMS, SEO, redirects, Docker, regression, handover                |

## GWR-0 — Discovery and specification

Deliverables:

- Reference and current-state audit.
- Target route and navigation map.
- Visual, typography, photography, and layout contract.
- CMS page-availability contract.
- Phase checklist and UAT criteria.

No production UI or schema change occurs in GWR-0.

## GWR-1 — CMS and IA foundations

Status: completed and approved 2026-08-10.

- Add the page-availability component and validation.
- Extend `Site Page` page kinds only where required.
- Seed History, report landing records, and the three internal ecosystem page
  availability records without replacing editorial content.
- Add missing route shells and typed CMS adapters.
- Make Press Releases a filtered News channel.
- Resolve the current ecosystem request `400` and document API contracts.

Approval gate: CMS fields, route ownership, seed safety, and Coming Soon
behaviour must be demonstrated before visual implementation.

## GWR-2 — Typography, tokens, and shell

Status: completed and approved 2026-08-10.

- Install the approved/licensed Zalando ExtraBold asset if supplied or legally
  available through the brand source.
- Implement the responsive type and spacing tokens.
- Recalibrate header navigation size/alignment and global footer.
- Add heading overflow protections and shared surface/section primitives.

Approval gate: desktop, laptop, tablet, and mobile shell screenshots.

## GWR-3 — Homepage

Status: completed and approved 2026-08-10.

- Recompose the hero to match the warm reference hierarchy.
- Make About views functional and CMS-backed.
- Rebuild the ecosystem area with reference colour and content hierarchy.
- Refine publication cards, Ticket Hub CTA, and newsletter progression.
- Remove or relocate hero metrics that weaken clarity.

Approval gate: full homepage visual review and functional interaction review.

Implementation result:

- Warm, still-image hero aligned to the reference hierarchy, with the former
  data rail and decorative venture metrics removed.
- Shared CMS-backed About adapter used by the homepage and About page for
  timeline, leadership, and managed report landing records.
- Accessible left-menu About switcher with scrollable, linked content and an
  accessible ecosystem pillar switcher.
- Reference-aligned red/orange 360° ecosystem field, balanced publication grid,
  rectangular Ticket Hub action, Slate newsletter transition, and branded
  section separators.
- Browser-reviewed at 320, 375, 768, 1024, 1440, and 1920 pixels with no
  horizontal overflow or console warnings.

## GWR-4 — Corporate pages

Status: completed 2026-08-10; awaiting user approval before GWR-5.

Implement the corporate route family with distinct, consistent templates and
CMS ownership. No report download is exposed without a real managed file/URL.

Implementation result:

- Rebuilt About, History, Board of Directors, Company Structure, Careers, and
  Contact as distinct corporate templates using the approved Gateway tokens.
- Extended Careers with live discipline counts, a CMS-backed searchable and
  paginated vacancy roster, reusable job detail pages, and HTTPS LinkedIn-only
  application actions.
- Connected History to managed timeline entries, Board to leadership records,
  and Company Structure to live ecosystem business records rather than copied
  page data.
- Added a site-scoped Corporate Report collection and reusable Annual and
  Sustainability report indexes. Downloads remain disabled until an editor
  supplies an approved file or HTTPS URL; forthcoming records stay informative.
- Verified all eight routes at six responsive viewports with no horizontal or
  heading overflow, and confirmed clean browser console output.

Approval gate: route-by-route content, layout, and responsive review.

## GWR-5 — Ecosystem pages

Status: completed 2026-08-10; awaiting user approval before GWR-6.

- Refine ecosystem hub categories and external sport links.
- Implement Sarga Venues, Media, and Tech capability pages.
- Implement branded Coming Soon template and editor toggle behaviour.
- Verify no duplicate Motorsport/Horse Sport content.

Implementation result:

- Reworked the ecosystem hub into a warm editorial portfolio map with
  accessible Sports, Venue, Media, and Technology category switching and
  truthful Live, Coming Soon, and Dedicated Site card states.
- Motorsport and Horse Sport resolve to configured dedicated frontends, with a
  validated CMS URL fallback for environments where the public URL variables
  are absent. Their Gateway detail routes remain non-canonical and noindex.
- Added distinct Venues, Media, and Tech proposition/capability art direction
  on the shared live-page framework, plus branded CMS-managed Coming Soon
  variants at the same canonical URLs.
- Backfilled missing proposition and capability content idempotently without
  overwriting editor values. The activation guard now requires an overview and
  at least one capability, while imagery and related content remain optional.
- Verified live/disabled toggles, default `noindex,follow`, sitemap omission,
  hidden/missing `404`, safe CTA destinations, responsive layouts, and tab
  keyboard behavior.

Approval gate: CMS toggle demonstration and all three page states.

## GWR-CMS-1 — CMS workspace architecture and audit

Status: completed 2026-08-10; awaiting user approval before GWR-CMS-2.

- Adopt virtual segregation: one shared CMS and shared content models, with a
  dedicated custom workspace per site role.
- Retain `siteScope` internally as the ownership/security discriminator while
  removing manual scope selection from managed site-editor workflows.
- Audit workspace links, role subjects, schema scope coverage, route
  protection, field permissions, and shared-media limitations.
- Define the smallest supported Strapi implementation and approval-gated UAT.

Specification and audit: `docs/strapi-admin-menu/`.

Approval gate: architecture, audit findings, implementation delta, and known
native Content Manager limitations.

## GWR-CMS-2 — Segregated CMS workspace implementation

Status: completed 2026-08-11; awaiting user approval before GWR-CMS-3.

- Prefix custom workspace actions by site.
- Protect custom workspace routes and permission-filter their actions.
- Remove `siteScope` from managed create/update field access while preserving
  server-side assignment and row-level RBAC conditions.
- Keep Super Admin unrestricted and keep Shared Library isolated from site
  roles.

Implementation evidence: prefixed and protected workspaces, permission-filtered
actions, non-writable managed-role scope, focused permission tests, persisted
role inspection, CMS type-check, and production admin build. Authenticated
role-by-role browser UAT remains the GWR-CMS-3 gate.

## GWR-CMS-3 — CMS RBAC UAT and handover

Status: completed 2026-08-11; awaiting user approval before resuming GWR-6.

- Complete real-session UAT for all managed roles and Super Admin.
- Test direct URL, query-filter, submitted-scope, clone, relation, and publish
  bypass attempts.
- Update editor, account-provisioning, staging, production, and shared-media
  operating guidance.

Implementation evidence: authenticated five-role browser sessions and an API
bypass/tamper matrix passed. UAT also closed nested-component field-permission
and relationship-reference exposure defects. See `docs/strapi-admin-menu/` for
the results and operating guide.

Approval gate: all role matrices pass before Gateway GWR-6 resumes.

## GWR-CMS-4 — i18n and dynamic navigation architecture

Status: completed 2026-08-11.

- Audit built-in Strapi i18n readiness, locales, schemas, hard-coded menus,
  frontend route/layout metadata, and role implications.
- Define English-unprefixed and Indonesian `/id` URL behavior.
- Define editorial localization, static interface dictionary, whole-record
  fallback, canonical/hreflang, and sitemap contracts.
- Define a site-scoped localized Top Navigation collection with a global
  visibility/order/link contract and strict repository fallback.
- Split implementation and launch into four further approval-gated phases.

Assessment and phase specifications: `docs/strapi-admin-menu/05` through `09`.

Approval gate: locale policy, localization matrix, navigation ownership,
migration safeguards, and effort estimate.

## GWR-CMS-5 — CMS i18n and navigation foundations

Status: completed 2026-08-11.

Rehearsed migration on a restored database, enabled `en`/`id`, localized
approved content fields, added Top Navigation, extended workspaces/RBAC, and
proved the localized API plus five-role authoring contract.

Approval gate: CMS/API and migration-rehearsal evidence before public routing.

## GWR-CMS-6 — Gateway i18n and dynamic navigation

Status: completed 2026-08-11; awaiting approval before GWR-CMS-7.

Pilot bilingual URL/content/shell/SEO behavior and CMS navigation on Sarga.co
while preserving all existing English routes.

Approval gate: Gateway two-locale browser, content, navigation, and SEO UAT.

## GWR-CMS-7 — dedicated-site rollout

Status: completed 2026-08-11.

Apply the approved behavior independently to Motorsport and Horse Sport.

Approval gate: both branded sites pass two-locale and navigation UAT.

## GWR-CMS-8 — migration, UAT, and handover

Status: repository implementation and isolated local rehearsal completed
2026-08-11; awaiting staging promotion and stakeholder launch approval.

Promote to staging, reconcile content/media/localizations, complete five-role
and cross-site UAT, and update production/editor/rollback handover.

Approval gate: final stakeholder launch decision before Gateway GWR-6 resumes.

## GWR-CMS-9 — multisite hero video

Status: repository implementation completed 2026-08-11; approved production
video assets and staging-domain media verification remain editorial/release
gates.

- Add a reusable MP4/WebM/poster component to Homepage and Site Page.
- Allow one Gateway or Horse Sport hero video and one video on each of a maximum
  three Motorsport hero slides.
- Preserve image fallback, mount only active video, use metadata preload, and
  expose pause/play controls.
- Respect reduced motion without mounting the video and document upload,
  promotion, Nginx, backup, and rollback requirements.

Approval gate: CMS editing and local browser behavior pass before approved
assets are promoted to staging. This phase does not resume Gateway GWR-6.

## GWR-CMS-10 — Motorsport homepage managed sections

Status: repository implementation completed 2026-08-11; staging promotion
remains part of the existing GWR-CMS-8 external gate.

- Move Race Control copy, labels, region, enabled state, and optional featured
  Event relation into the Motorsport Home Site Page.
- Move World of Motorsport heading/CTA copy and up to six enabled, ordered,
  image-manageable discipline cards into the same record.
- Preserve the approved visual layout, local media/content fallback, scoped
  role permissions, i18n behavior, and safe link/event handling.
- Backfill only missing development fields and document the editor workflow.

Approval gate: local schema, API, RBAC, frontend, build, and responsive browser
checks pass. This phase does not resume Gateway GWR-6.

## GWR-6 — Publications and tickets

Implement publication filtering/detail hierarchy and align Ticket Hub pages
without adding checkout, payment, or account logic.

Approval gate: editorial filters, redirects, and outbound ticket safety.

## GWR-7 — QA and handover

- Automated lint/type/build and relevant unit/integration checks.
- Browser UAT across target viewports and routes.
- Accessibility, keyboard, reduced motion, image, SEO, sitemap, and redirects.
- CMS seed/migration and Docker regression.
- Update deployment and content-editor handover documentation.

Approval gate: final UAT evidence and launch decision.
