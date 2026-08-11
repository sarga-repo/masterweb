# AGENTS.md - Sarga Multisite Coding Agent Instructions

You are working inside the **Sarga single-repository multisite web project**.

The project contains three separate public frontends and one shared CMS:

- `frontend-gateway/` - Sarga.co group gateway website.
- `frontend-motorsport/` - dedicated Sarga Motorsport website.
- `frontend-horsesport/` - dedicated Sarga Horse Sport website.
- `cms/` - shared Strapi CMS.
- PostgreSQL is shared by Strapi and must use host port `5435` for local Docker Compose.

## Mandatory reading order

Before coding, read:

1. `README.md`
2. `docs/01_project_brief.md`
3. `docs/02_scope_and_requirements.md`
4. `docs/03_sitemap_information_architecture.md`
5. `docs/04_page_specifications.md`
6. `docs/05_content_model_strapi.md`
7. `docs/06_technical_architecture.md`
8. `docs/07_design_system.md`
9. `docs/08_implementation_plan.md`
10. `docs/09_quality_uat_acceptance.md`
11. `docs/10_deployment_handover_maintenance.md`
12. `docs/11_asset_inventory.md`
13. `docs/12_visual_reference_guideline.md`
14. `docs/13_local_docker_deployment.md`
15. `docs/multisite/01_multisite_architecture_decision.md`
16. `docs/multisite/02_repository_restructure_plan.md`
17. `docs/multisite/03_shared_cms_content_sync_strategy.md`
18. `docs/multisite/04_three_site_integration_strategy.md`
19. `docs/gateway/revamp/README.md`
20. `docs/gateway/revamp/01_reference_and_current_state_audit.md`
21. `docs/gateway/revamp/02_information_architecture_and_page_specs.md`
22. `docs/gateway/revamp/03_visual_typography_layout_spec.md`
23. `docs/gateway/revamp/04_cms_page_activation_contract.md`
24. `docs/gateway/revamp/05_implementation_phases.md`
25. `docs/gateway/revamp/06_testing_uat.md`
26. `docs/motorsport/01_motorsport_project_brief.md`
27. `docs/motorsport/02_motorsport_brand_translation.md`
28. `docs/motorsport/03_motorsport_sitemap_page_specs.md`
29. `docs/motorsport/04_motorsport_design_system.md`
30. `docs/motorsport/05_motorsport_content_model_extensions.md`
31. `docs/motorsport/06_motorsport_implementation_plan.md`
32. `docs/motorsport/revamp/README.md`
33. `docs/motorsport/revamp/01_source_findings.md`
34. `docs/motorsport/revamp/02_brand_layout_direction.md`
35. `docs/motorsport/revamp/03_sitemap_page_specs.md`
36. `docs/motorsport/revamp/04_cms_architecture_admin_ux.md`
37. `docs/motorsport/revamp/05_migration_plan.md`
38. `docs/motorsport/revamp/06_implementation_phases.md`
39. `docs/motorsport/revamp/07_testing_uat.md`
40. `docs/motorsport/revamp/08_deployment_handover.md`
41. `docs/horsesport/01_horsesport_project_brief.md`
42. `docs/horsesport/02_horsesport_brand_translation.md`
43. `docs/horsesport/03_horsesport_sitemap_page_specs.md`
44. `docs/horsesport/04_horsesport_design_system.md`
45. `docs/horsesport/05_horsesport_content_model_extensions.md`
46. `docs/horsesport/06_horsesport_implementation_plan.md`
47. `docs/horsesport/07_horsesport_asset_usage_guideline.md`
48. `reference/source-pdfs/sarga_website_preview.pdf`
49. `reference/source-pdfs/look_and_feel_website_sarga_co.pdf` if present
50. `reference/source-pdfs/sarga.co_sitemap.pdf` if present
51. `reference/source-pdfs/sarga_motorsport_2.pdf` if present
52. `reference/source-pdfs/sarga_motorsport_brand_playbook.pdf` if present
53. `strapi/content-types.json`

## Workspace skill usage

Use local frontend UI skills under:

```text
.agents/skills/
```

For dedicated frontends, use the premium/frontend UI skill to produce international-standard layouts: polished composition, premium spacing, clear editorial hierarchy, strong art direction, responsive behavior, accessible implementation, high-quality motion, and production-ready component structure.

## Core build rules

- Use Next.js, TypeScript, and Tailwind CSS for all frontends.
- Use Strapi as the shared CMS.
- Use PostgreSQL for Strapi local and production-like development.
- Keep one CMS unless explicitly approved otherwise.
- Keep frontend apps separated: do not mix gateway, motorsport, and horsesport components unless they are truly brand-neutral shared utilities.
- Add the new dedicated Horse Sport frontend under `frontend-horsesport/`.
- Update all Docker, README, environment, and deployment references after adding `frontend-horsesport/`.
- Do not build internal payment processing.
- Do not build public user accounts/login.
- Do not build an internal ticketing engine.
- Ticketing must use partner redirect/deep link first; optional embed support must be configurable from CMS.
- Do not commit secrets.

## Sarga.co gateway design rules

- Sarga.co remains the group gateway and corporate ecosystem entry point.
- Use `docs/gateway/revamp/` as the current Gateway implementation source.
- Use the Website Sarga.co Preview and Brand Visual Preview sections of
  `reference/source-pdfs/look_and_feel_website_sarga_co.pdf` as the primary
  Gateway visual reference, while preserving the approved existing theme.
- Use `reference/source-pdfs/sarga.co_sitemap.pdf` as the current Gateway
  information-architecture reference.
- Use Zalando Expanded for display text and Plus Jakarta Sans for body and UI.
- Sarga Venues, Sarga Media, and Sarga Tech use CMS-controlled dedicated pages;
  disabled pages show a branded Coming Soon experience at the canonical URL.
- Gateway ecosystem cards must route to dedicated sites where available:
  - Sarga Horse Sport → `frontend-horsesport/` / horsesport domain
  - Sarga Motorsport → `frontend-motorsport/` / motorsport domain
- Gateway news/events/tickets should render ecosystem teasers and deep-link to dedicated sites when the content belongs to Horse Sport or Motorsport.

## Sarga Motorsport design rules

Use the Motorsport revamp docs as the current implementation source when working on the major revamp. The Look & Feel PDF and `Sarga Motorsport 2.pdf` supersede the older broad Motorsport sitemap, while the existing approved dark premium theme remains valid.

Primary current sources:

- `docs/motorsport/revamp/`
- `reference/source-pdfs/look_and_feel_website_sarga_co.pdf`
- `reference/source-pdfs/sarga_motorsport_2.pdf`
- `reference/source-pdfs/sarga_motorsport_brand_playbook.pdf`

Brand persona: dynamic, captivating, intense - the “Adrenaline Alchemist”.

Design direction:

- Premium motorsport frontend UI, not a copy of the Sarga.co gateway.
- Dark, kinetic, high-contrast visual style.
- Use racing motion, speed blur, asphalt, light trails, cockpit/track/event photography.
- Use Sarga Motorsport colors: Apex Crimson `#E8192C`, Ignition Orange `#FF6B00`, Electric Yellow `#F5C800`, Slipstream Teal `#00C4CC`, Draftline Blue `#0033A0`, Charcoal Black `#1B1B1B`, Warm White `#FFF9EE`.
- Display typeface target: Owners Wide.
- Body typeface target: Noto Sans.
- Use approved logo assets from `assets/brand/motorsport/logos/`.

## Sarga Horse Sport design rules

Use page 7 of `reference/source-pdfs/sarga_website_preview.pdf` as the primary Horse Sport brand foundation reference.

Brand direction:

- Premium equestrian sports frontend UI, distinct from gateway and motorsport.
- Elite, cinematic, elegant, disciplined, and high-performance.
- Use horse racing, jockey, derby, turf, stable, venue, lifestyle, and championship photography.
- Preserve the Sarga red/orange horse-jockey mark, warm equestrian palette, and motion-oriented graphics shown in the source preview.
- Use bold editorial display typography inspired by the Sarga Horse Sport section in page 7; do not blindly copy the gateway layout.
- Use Sarga Horse Sport visual direction from `reference/source-pdfs/sarga_website_preview.pdf` page 7 as the primary brand reference for colors, graphics, typography, and hero photography style.
- Use Sarga Horse Sport visual direction from `reference/source-pdfs/sarga_website_preview.pdf` page 7 as the primary brand reference for colors, graphics, typography, and hero photography style.
- Apply the Horse Sport palette and visual language consistently: Apex Crimson `#E8192C`, Ignition Orange `#FF6B00`, Deep Black `#000000`, Warm White `#FFF9EE`, and soft neutral supporting tones; keep the horse-jockey symbol in its original orange-to-red gradient.
- Display typeface target: use a bold, wide, premium sport-style `STADMITTE`; prioritize strong uppercase headings, heavy weight, tight tracking, and high-impact editorial scale.
- Body typeface target: use a clean modern sans serif `Masifa`; prioritize readability, generous line height, and clear hierarchy across desktop and mobile.
- Use approved logo assets from `assets/brand/horsesport/logos/`.
- Dark premium sections may use the white Horse Sport logo; light/editorial sections may use the black text logo.
- Horse Sport should feel more refined, heritage/equestrian, and hospitality-forward than Motorsport, while still energetic.

## Shared CMS rules

- Content must support `siteScope`: `gateway`, `motorsport`, `horsesport`, `shared`, or `hidden`.
- Editors should have dedicated CMS workspace/menu entry points for Gateway, Motorsport, Horse Sport, and Shared Library while keeping one shared Strapi instance and shared content models where appropriate.
- News, events, ticket CTAs, media, campaigns, sponsors, and forms can be shared across sites but rendered differently per frontend.
- Horse Sport-specific content should live in CMS once and be consumed by `frontend-horsesport/` and optionally previewed on `frontend-gateway/` and `frontend-motorsport/` if editorial rules allow.
- Ticketing CTA data should be centralized in CMS and include provider, redirect URL, optional embed code/config, display rules, and target site scope.
- Never duplicate the same event/news manually in separate CMS collections unless approved.

## Output expectations

Every coding task response must include:

- Summary of changes
- Files changed
- How to test
- Known limitations or assumptions

## Phase progress tracking

`docs/PHASE_PROGRESS.md` is the running record of every completed phase.

- At the end of **every** completed phase, update `docs/PHASE_PROGRESS.md` before finishing.
- Flip the phase status/date in the summary table and append/update the phase section with **What was done**, **Files changed**, **How verified**, and **Notes / caveats**.
- Keep entries concise and factual; do not remove earlier phases.

## Stop conditions

Ask for human confirmation before:

- Adding paid third-party services
- Adding unapproved external scripts/embeds
- Changing the agreed stack
- Creating a second CMS
- Adding payment, checkout, account, or internal ticketing logic
- Making irreversible infrastructure changes

@RTK.md
