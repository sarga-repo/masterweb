# Codex Prompt 05 — Pages and Routing

Task: implement all major pages using CMS-ready data.

Pages:

- `/about`
- `/ecosystem`
- `/ecosystem/[slug]`
- `/news`
- `/news/[slug]`
- `/careers`
- `/contact`
- `/ticket-hub`
- `/ticket-hub/[slug]`

Requirements:

- Use page specs from `docs/04_page_specifications.md`.
- Follow the creative model in `docs/07_design_system.md` and `docs/12_visual_reference_guideline.md`: page 7 provides the brand foundation, while pages 1-5 are examples rather than layout templates.
- Give each page an original premium composition while preserving its required content, CMS contract, and user journey.
- Use Strapi service layer where available.
- Add slug-based routing for ecosystem businesses, news articles, and events.
- Add 404 handling.
- Add related content sections where specified.
- Keep page components modular.

Acceptance criteria:

- All routes render.
- Dynamic pages work from slug data.
- Missing slug returns 404.
- Layout is responsive.
- Desktop, tablet, and mobile compositions feel intentionally art-directed and visually consistent with the Sarga brand.
