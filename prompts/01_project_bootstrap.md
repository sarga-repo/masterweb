# Codex Prompt 01 — Project Bootstrap

Task: initialize the Sarga.co website project.

Requirements:
- Create a Next.js App Router project using TypeScript.
- Configure Tailwind CSS.
- Configure ESLint and Prettier.
- Create the recommended folder structure from `docs/06_technical_architecture.md`.
- Add placeholder environment variable documentation.
- Add basic layout shell.
- Add initial routes:
  - `/`
  - `/about`
  - `/ecosystem`
  - `/ecosystem/[slug]`
  - `/news`
  - `/news/[slug]`
  - `/careers`
  - `/contact`
  - `/ticket-hub`
  - `/ticket-hub/[slug]`
- Do not implement Strapi integration yet.
- Use temporary mock data in a clearly named `src/lib/mock-data.ts`.

Acceptance criteria:
- Project builds successfully.
- Routes return basic placeholder pages.
- Tailwind classes work.
- No secrets are committed.


Also copy the included official logo files from `assets/brand/logos/` into the frontend public assets folder and wire them into the base navigation and footer. Use the reverse logo for dark header/footer.


Reference assets:
- Keep `reference/source-pdfs/sarga_website_preview.pdf` and `reference/source-pdfs/requirements.pdf` in the repository for traceability.
- Copy logo assets from `assets/brand/logos/` into the frontend public assets folder.


Additional local Docker requirement:

- Create the Next.js app under `frontend/`.
- Create the Strapi app under `cms/`.
- Ensure the provided `docker-compose.yml`, `docker/frontend.Dockerfile`, and `docker/strapi.Dockerfile` work with that folder structure.
- Ensure PostgreSQL is exposed on host port `5435` and Strapi connects to it internally on `postgres:5432`.
- Update README with `cp .env.example .env` and `docker compose up --build` instructions.
- Do not use SQLite for Strapi local development.
