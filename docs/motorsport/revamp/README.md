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

| Document                                    | Purpose                                                                                                                         |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `01_source_findings.md`                     | What the PDFs and existing repo imply.                                                                                          |
| `02_brand_layout_direction.md`              | Motorsport visual direction, layout grammar, imagery, typography, and motion rules.                                             |
| `03_sitemap_page_specs.md`                  | Target sitemap, route map, page requirements, and content ownership.                                                            |
| `04_cms_architecture_admin_ux.md`           | Shared Strapi architecture plus dedicated site workspaces/menu UX.                                                              |
| `05_migration_plan.md`                      | Data/content/route migration sequence and compatibility rules.                                                                  |
| `06_implementation_phases.md`               | Phased delivery plan for the revamp.                                                                                            |
| `07_testing_uat.md`                         | QA, accessibility, CMS, SEO, and UAT acceptance plan.                                                                           |
| `08_deployment_handover.md`                 | Release, rollback, editorial handover, and post-launch checks.                                                                  |
| `09_discovery_inventory.md`                 | MSR-1 inventory of current routes, CMS content, assets, gaps, and later implementation files.                                   |
| `10_warm_visual_redesign_audit.md`          | MSR-RD1 page-accurate source audit, current implementation gaps, route targets, CMS impact, and controlled redesign sub-phases. |
| `11_redesign_foundations_page_templates.md` | MSR-RD2 design thesis, accessible surface/type rules, navigation and carousel contracts, and route-template families.           |
| `11_redesign_foundations.tokens.json`       | Machine-readable primitive → semantic → component token handoff for MSR-RD3.                                                    |
| `12_final_validation_launch_readiness.md`   | MSR-RD6/MSR-8 route, browser, Lighthouse, CMS, Docker, redirect, and conditional-launch evidence.                               |

## Implementation rule

Do not start frontend implementation until the phase owner confirms the phase prompt. The revamp should be delivered in small phases because it changes public navigation, CMS editing flow, content structure, and page design at the same time.

The post-MSR-5 warm visual redesign follows the MSR-RD1 through MSR-RD6
sub-phases in `10_warm_visual_redesign_audit.md`. Complete and approve each
sub-phase before proceeding to the next. MSR-6 and MSR-7 must adopt the
approved MSR-RD2 foundations in
`11_redesign_foundations_page_templates.md` instead of extending the older
black-dominant surface system.
