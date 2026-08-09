# Motorsport Revamp - Master Instruction

Use this prompt before running any Motorsport revamp phase.

## Scope

Work only in the Sarga repository. The revamp targets:

- `frontend-motorsport/`
- `cms/` only when a phase explicitly asks for CMS changes
- `docs/`
- `prompts/`
- `checklists/`

Do not modify Gateway or Horse Sport public UI unless the phase explicitly requires cross-site integration.

## Mandatory reading

Read:

- `AGENTS.md`
- `docs/motorsport/revamp/README.md`
- `docs/motorsport/revamp/01_source_findings.md`
- `docs/motorsport/revamp/02_brand_layout_direction.md`
- `docs/motorsport/revamp/03_sitemap_page_specs.md`
- `docs/motorsport/revamp/04_cms_architecture_admin_ux.md`
- `docs/motorsport/revamp/05_migration_plan.md`
- `docs/motorsport/revamp/06_implementation_phases.md`
- `docs/motorsport/revamp/07_testing_uat.md`
- `docs/motorsport/revamp/08_deployment_handover.md`
- `reference/source-pdfs/look_and_feel_website_sarga_co.pdf`
- `reference/source-pdfs/sarga_motorsport_2.pdf`

## Guardrails

- Keep one shared Strapi CMS.
- Keep the existing approved Motorsport theme, but align layout and brand visual to the Look & Feel PDF.
- Follow the sitemap in `Sarga Motorsport 2.pdf`.
- Do not add checkout, payment, public account, or internal ticketing.
- Use partner redirects/deep links/allowlisted embeds for tickets.
- Preserve existing routes where practical and add redirects only after approval.
- Update `docs/PHASE_PROGRESS.md` and `checklists/motorsport/motorsport_revamp_phase_checklist.md` after every completed phase.

