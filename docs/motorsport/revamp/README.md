# Sarga Motorsport Revamp Spec Package

This folder is the current source of truth for the major Sarga Motorsport UI, sitemap, and CMS admin UX revamp.

## Source references

- `reference/source-pdfs/look_and_feel_website_sarga_co.pdf`
- `reference/source-pdfs/sarga_motorsport_2.pdf`
- `reference/source-pdfs/sarga_motorsport_brand_playbook.pdf`
- Existing implementation in `frontend-motorsport/`
- Shared Strapi implementation in `cms/`

## Revamp goals

1. Rework `frontend-motorsport/` layout and visual direction to follow the
   Motorsport section of the Look & Feel PDF with a warmer, cleaner editorial
   balance. Dark surfaces remain intentional accents rather than the default
   page background.
2. Replace the current broad sitemap with the event-program sitemap from `Sarga Motorsport 2.pdf`.
3. Improve Strapi editor UX so Gateway, Motorsport, and Horse Sport each have a dedicated CMS workspace/menu, while retaining one shared Strapi instance and shared content architecture.

## Document map

| Document                                         | Purpose                                                                                                                         |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `01_source_findings.md`                          | What the PDFs and existing repo imply.                                                                                          |
| `02_brand_layout_direction.md`                   | Motorsport visual direction, layout grammar, imagery, typography, and motion rules.                                             |
| `03_sitemap_page_specs.md`                       | Target sitemap, route map, page requirements, and content ownership.                                                            |
| `04_cms_architecture_admin_ux.md`                | Shared Strapi architecture plus dedicated site workspaces/menu UX.                                                              |
| `05_migration_plan.md`                           | Data/content/route migration sequence and compatibility rules.                                                                  |
| `06_implementation_phases.md`                    | Phased delivery plan for the revamp.                                                                                            |
| `07_testing_uat.md`                              | QA, accessibility, CMS, SEO, and UAT acceptance plan.                                                                           |
| `08_deployment_handover.md`                      | Release, rollback, editorial handover, and post-launch checks.                                                                  |
| `09_discovery_inventory.md`                      | MSR-1 inventory of current routes, CMS content, assets, gaps, and later implementation files.                                   |
| `10_warm_visual_redesign_audit.md`               | MSR-RD1 page-accurate source audit, current implementation gaps, route targets, CMS impact, and controlled redesign sub-phases. |
| `11_redesign_foundations_page_templates.md`      | MSR-RD2 design thesis, accessible surface/type rules, navigation and carousel contracts, and route-template families.           |
| `11_redesign_foundations.tokens.json`            | Machine-readable primitive → semantic → component token handoff for MSR-RD3.                                                    |
| `12_final_validation_launch_readiness.md`        | MSR-RD6/MSR-8 route, browser, Lighthouse, CMS, Docker, redirect, and conditional-launch evidence.                               |
| `28_cms_preview_live_consistency_plan.md`        | Motorsport-only diagnosis and gated plan for deterministic draft Preview and published output.                                  |
| `29_cms_uat_phase1_fetch_auth_spec.md`           | Durable Preview credential, fetch-state, error, and preflight contract.                                                         |
| `30_cms_uat_phase2_exact_preview_spec.md`        | Exact `documentId`, locale, status, route, and duplicate-record reconciliation contract.                                        |
| `31_cms_uat_phase3_rendering_parity_spec.md`     | Cross-route hero, section visibility, fallback, and browser-marker contract.                                                    |
| `32_cms_uat_phase4_publish_invalidation_spec.md` | Published cache tags, Strapi-triggered revalidation, and live parity contract.                                                  |
| `33_cms_uat_phase5_cross_page_uat_spec.md`       | Authenticated reversible EN/ID desktop/mobile UAT and editor handover.                                                          |
| `34_cms_preview_live_operations_handover.md`     | Token rotation, editor map, Preview diagnostics, revalidation operations, and repeatable validation.                            |
| `35_cms_uat_restoration_manifest.md`             | Reversible mutation restoration evidence and intentionally retained Draft controls.                                             |
| `36_cms_page_model_simplification_plan.md`       | Decision record and gated migration plan for page-specific Motorsport Single Types and shared opening components.               |
| `37_cms_clean_phase1_foundation_spec.md`         | Reusable Hero, Information Band, metric, named-section, and fetch-adapter foundation.                                           |
| `38_cms_clean_phase2_homepage_spec.md`           | Homepage Single Type pilot, migration, Preview, revalidation, and rollback contract.                                            |
| `39_cms_clean_phase3_gallery_spec.md`            | Gallery Single Type and `gallery-intro` to `hero.eyebrow` cleanup.                                                              |
| `40_cms_clean_phase4_about_spec.md`              | About Single Type migration and leadership compatibility contract.                                                              |
| `41_cms_clean_phase5_events_hub_spec.md`         | Events hub Single Type while retaining Event and Motorsport Program collections.                                                |
| `42_cms_clean_phase6_news_hub_spec.md`           | News hub Single Type while retaining News Article detail ownership.                                                             |
| `43_cms_clean_phase7_commerce_pages_spec.md`     | Tickets and Merchandise page-specific models with unchanged provider/catalogue boundaries.                                      |
| `44_cms_clean_phase8_support_pages_spec.md`      | Contact, Partners, and Experience page-specific model migrations.                                                               |
| `45_cms_clean_phase9_detail_templates_spec.md`   | Shared Hero and Information Band contract for collection-driven detail/support routes.                                          |
| `46_cms_clean_phase10_cutover_spec.md`           | RBAC cutover, migration backup, and non-destructive legacy Site Page retirement.                                                |
| `47_cms_clean_phase11_uat_handover_spec.md`      | Full EN/ID Preview/live, browser, Docker, migration, role, and editor-handover acceptance matrix.                               |
| `51_cms_ownership_plan.md`                       | Motorsport CMS ownership matrix, constrained routePath decision, and phased migration plan.                                     |
| `52_cms_ownership_foundation_spec.md`            | Additive dedicated collection schemas and RBAC foundation.                                                                      |
| `53_cms_ownership_migration_spec.md`             | Dry-run, idempotent copy, relation mapping, and rollback contract.                                                               |
| `54_cms_ownership_frontend_cutover_spec.md`      | Dedicated-first adapters, fallback, seed, revalidation, and route UAT.                                                           |
| `55_cms_routepath_management_spec.md`            | Constrained Single-Type routePath, resolver, aliases, and redirects.                                                            |
| `56_cms_ownership_rbac_workspace_spec.md`        | Motorsport workspace labels and role matrix.                                                                                     |
| `57_cms_ownership_retirement_uat_handover.md`    | Legacy archive, full UAT matrix, rollback, and editor handover.                                                                  |
| `59_vendor_theme_color_plan.md`                  | Motorsport-only vendor color/theme track, preset strategy, precedence, scope, and phased delivery.                              |
| `60_vendor_theme_phase0_source_validation_spec.md` | Vendor palette confirmation and approved preset decision gate.                                                                  |
| `61_vendor_theme_phase1_token_foundation_spec.md` | Semantic CSS token contract for the approved Motorsport presets.                                                                |
| `62_vendor_theme_phase2_cms_settings_spec.md`    | Motorsport theme settings Single Type and RBAC contract.                                                                        |
| `63_vendor_theme_phase3_runtime_preview_spec.md` | Draft/live theme resolution, root attribute, fallback, and revalidation contract.                                               |
| `64_vendor_theme_phase4_5_qa_handover_spec.md`   | Vendor preset visual QA, cross-route UAT, and editor handover requirements.                                                     |
| `73_vendor_editorial_cross_page_surface_rhythm_plan.md` | Cross-route Vendor Editorial cream/charcoal alternation contract and small execution phases after the completed homepage rhythm. |
| `74_vendor_editorial_ijtc_surface_rhythm.md` | Vendor Editorial surface rhythm rollout for the IJTC hub, sub-pages, and rider detail route. |
| `75_cms_clean_alignment_phase0_audit.md`       | Read-only CMS/frontend order, coverage, visibility, duplicate-source, and admin UX reassessment for the cleansing follow-up. |
| `76_cms_clean_followup_phase1_2_execution.md`  | Execution evidence for the ordered adapter, canonical Information Band, and homepage named-section coverage follow-up. |
| `77_cms_clean_followup_phase3_execution.md`   | Gallery legacy-field cleanup evidence: canonical Hero eyebrow/metrics and archive-only body ownership. |
| `78_cms_clean_followup_phase4_execution.md`   | Canonical Information Band and Motorsport Ticket CTA read cutover, plus editor-layout cleanup for legacy control fields. |
| `79_cms_clean_followup_phase5_execution.md`   | Final editorial coverage, reusable section items, strict audit closure, and CMS/frontend handover evidence. |
| `80_cms_show_field_defaults_and_operational_gate.md` | Editorial `show*` defaults, existing-record backfill, verification, and local operational-gate evidence. |
| `81_cms_live_preview_mvp.md` | Saved-draft live Preview heartbeat, automatic refresh, security boundary, and unsaved-edit limitation. |
| `82_cms_side_by_side_preview.md` | Motorsport split-pane CMS editor and private frontend Preview workspace. |
| `83_cms_integrated_content_manager_preview.md` | Integrated Content Manager Preview action and side-by-side editor flow. |

## Implementation rule

Do not start frontend implementation until the phase owner confirms the phase prompt. The revamp should be delivered in small phases because it changes public navigation, CMS editing flow, content structure, and page design at the same time.

The post-MSR-5 warm visual redesign follows the MSR-RD1 through MSR-RD6
sub-phases in `10_warm_visual_redesign_audit.md`. Complete and approve each
sub-phase before proceeding to the next. MSR-6 and MSR-7 must adopt the
approved MSR-RD2 foundations in
`11_redesign_foundations_page_templates.md` instead of extending the older
black-dominant surface system.

The CMS simplification track follows `MSR-CMS-CLEAN-0` through
`MSR-CMS-CLEAN-11` in `36_cms_page_model_simplification_plan.md`. The
implementation and UAT track is complete through CLEAN-11; legacy Site Page
records remain archived for rollback and are no longer the primary Motorsport
read path.
Execute one phase at a time and do not advance past a failed migration,
Preview, live, localization, RBAC, or browser gate.
