# AGENTS.md — Instructions for Codex / Coding Agent

You are building the Sarga.co website revamp from scratch.

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
15. `strapi/content-types.json`
16. `reference/source-pdfs/sarga_website_preview.pdf` as a brand and creative-direction reference; page 7 defines the brand foundation and pages 1-5 are implementation examples, not templates
17. `reference/source-pdfs/requirements.pdf` as the original requirement source

## Build rules

- Use Next.js, TypeScript, and Tailwind CSS for frontend.
- Use Strapi as CMS.
- Use PostgreSQL for Strapi production and local Docker Compose.
- Do not build internal payment processing.
- Do not build user account/login for public users.
- Do not build an internal ticketing engine.
- Ticketing must be partner redirect/deep link first, with embed support only as configurable optional enhancement.
- Keep code modular and maintainable.
- Make the website mobile-first and SEO-ready.
- Use static generation where practical.
- Use the official logo assets from `assets/brand/logos/`; copy them into the frontend public assets directory during project bootstrap.
- Use page 7 of `reference/source-pdfs/sarga_website_preview.pdf` as the primary brand reference for color, typography, graphic language, and hero photography style.
- Treat pages 1-5 of the preview PDF as good implementation examples and inspiration only. Do not reproduce their page layouts, section compositions, or component arrangements by default.
- Create an original, premium, internationally competitive frontend UI with confident art direction, refined spacing, editorial hierarchy, responsive composition, purposeful interaction, and accessible behavior.
- Preserve the written product requirements, information architecture, CMS model, content meaning, and user journeys while redesigning their visual expression.
- Do not embed or rasterize the PDF into the website; translate the design into responsive components.
- Use the reverse logo variant for dark header/footer and the default logo on light backgrounds.
- Avoid unnecessary client components.
- Avoid hardcoded content where CMS content is expected.
- Keep local Docker Compose working for `frontend`, `strapi`, and `postgres`; PostgreSQL must use host port `5435`.
- Do not commit secrets or credentials.

## Quality rules

- Add TypeScript types for CMS responses.
- Validate public forms server-side.
- Use semantic HTML.
- Include accessible labels and alt text support.
- Keep images optimized.
- Include 404 handling for missing slugs.
- Include README/deployment documentation updates when adding environment variables.
- When creating or changing local development setup, update `.env.example`, `docker-compose.yml`, and `docs/13_local_docker_deployment.md`.

## Output expectations

Every task should include:

- Summary of changes
- Files changed
- How to test
- Known limitations or assumptions

## Stop conditions

Ask for human confirmation before:

- Introducing payment/account/ticketing engine logic
- Adding paid third-party services
- Changing the agreed stack
- Using unapproved external embeds/scripts
- Making irreversible infrastructure changes
