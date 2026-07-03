# Sarga.co Website Revamp — Initial Development Specification Package

Prepared date: 2026-07-02

## Local development quick start

Phase 1 provides separate Next.js and Strapi applications backed by PostgreSQL:

```text
frontend/   # Next.js App Router website
cms/        # Strapi CMS and API
```

Start the complete local stack with Docker Compose:

```bash
cp .env.example .env
docker compose up --build
```

Alternatively, run only PostgreSQL in Docker and keep Strapi and the frontend
on the host (see `docs/13_local_docker_deployment.md`, "Hybrid workflow"):

```bash
docker compose up -d postgres
cd cms && pnpm develop        # uses cms/.env → localhost:5435
cd frontend && pnpm dev       # uses frontend/.env.local → http://localhost:1337
```

Local endpoints:

- Frontend: `http://localhost:3000`
- Strapi admin: `http://localhost:1337/admin`
- PostgreSQL from host tools: `localhost:5435`

The `.env.example` values are development placeholders only. Replace all Strapi
keys and database credentials before using a shared, staging, or production
environment. The checked-in Strapi database configuration uses PostgreSQL only;
SQLite is not part of the local setup.

## Strapi content integration

The frontend reads Strapi through server-only typed services in
`frontend/src/lib/strapi/`. Homepage, ecosystem, news, and event routes use the
CMS when it is reachable and retain bundled mock content as a local-development
fallback.

With `SEED_DEMO_CONTENT=true` (the local default in `.env.example`), Strapi
seeds demo Homepage, Ecosystem Business, News Article, and Event records on
first startup and grants the public role read access to those endpoints, so
the local frontend renders CMS content immediately without an API token. The
seed is idempotent — it only runs while the content types are empty. Disable
it outside local development.

For a shared or production environment (or with the seed disabled), after
creating the first Strapi administrator at `http://localhost:1337/admin`:

1. Create and publish the Homepage, Ecosystem Business, News Article, and Event
   records.
2. Create a least-privilege API token with read access to those public content
   types.
3. Set `STRAPI_API_TOKEN` in the uncommitted root `.env` file.
4. Restart the frontend so the server process receives the token.

`STRAPI_API_TOKEN` is intentionally server-only. Browser-reachable media URLs
use `NEXT_PUBLIC_STRAPI_API_URL`; no private token is included in client code.
Contact and newsletter submission UI remains reserved for Phase 6, although
their Strapi schemas and server transport are prepared in this phase.

This package converts the uploaded vendor briefing and website preview into a practical planning pack for Codex-assisted implementation.

## Project context

Sarga.co will be revamped from an existing corporate-style website into a **Group Gateway** for the Sarga ecosystem. The website must act as the parent gateway for Sarga business units and IPs, including:

- Sarga Horse Sport
- Sarga Motorsport
- Other future Sarga businesses, such as Sarga Media, Sarga Festival, Sarga Rising Star, Sarga Venues, and Sarga Tech

The agreed CMS direction is **Strapi**.

## Recommended stack summary

- Frontend: Next.js, TypeScript, Tailwind CSS
- CMS: Strapi
- Database: PostgreSQL for Strapi
- Media storage: S3-compatible object storage or cloud provider storage
- Hosting: Vercel/Netlify for frontend, managed container/VPS/PaaS for Strapi
- Ticketing: partner redirect/deep link first; embedded widget only if partner supports stable embed
- Scope exclusion: no internal payment, no user account system, no internal ticketing engine in this phase

## Folder contents

This package is already structured to be copied into a new repository.

```text
sarga_website_codex_ready_package/
├── AGENTS.md
├── README.md
├── docs/
│   ├── 01_project_brief.md
│   ├── 02_scope_and_requirements.md
│   ├── 03_sitemap_information_architecture.md
│   ├── 04_page_specifications.md
│   ├── 05_content_model_strapi.md
│   ├── 06_technical_architecture.md
│   ├── 07_design_system.md
│   ├── 08_implementation_plan.md
│   ├── 09_quality_uat_acceptance.md
│   ├── 10_deployment_handover_maintenance.md
│   ├── 11_asset_inventory.md
│   ├── 12_visual_reference_guideline.md
│   └── 13_local_docker_deployment.md
├── prompts/
│   ├── 00_master_instruction.md
│   ├── 01_project_bootstrap.md
│   ├── 02_design_system_and_layout.md
│   ├── 03_homepage.md
│   ├── 04_strapi_integration.md
│   ├── 05_pages_and_routing.md
│   ├── 06_forms_ticketing_seo.md
│   ├── 07_testing_uat.md
│   └── 08_deployment_handover.md
├── docker-compose.yml
├── .env.example
├── .dockerignore
├── docker/
│   ├── frontend.Dockerfile
│   └── strapi.Dockerfile
├── assets/
│   └── brand/
│       └── logos/
│           ├── logo-sarga.png
│           └── logo-sarga-reverse.png
├── reference/
│   └── source-pdfs/
│       ├── requirements.pdf
│       └── sarga_website_preview.pdf
├── strapi/
│   └── content-types.json
└── checklists/
    ├── prototype_3_day_checklist.md
    ├── uat_checklist.md
    └── go_live_checklist.md
```

## How to use with Codex

1. Create an empty repository, for example `sarga-website-revamp`.
2. Copy the full contents of this package into the repository root.
3. Keep `AGENTS.md` at the repository root so Codex can read the main build instructions.
4. Start Codex with `prompts/00_master_instruction.md`.
5. Execute prompts in order from `01` to `08`.
6. Ask Codex to copy the included logos from `assets/brand/logos/` into the frontend public assets folder during Phase 1.
7. Ask Codex to use page 7 of `reference/source-pdfs/sarga_website_preview.pdf` for the Sarga brand foundation and pages 1-5 as non-binding implementation inspiration.
8. Ask Codex to follow `docs/13_local_docker_deployment.md` and keep local Docker Compose working for `frontend`, `strapi`, and `postgres`.
9. Use the prompts in order from `01` to `08`; do not paste all prompts at once.
10. Review every generated change through commit diff before continuing to the next phase.

## Local Docker Compose target

The package now includes local deployment scaffolding:

```text
docker-compose.yml
docker/frontend.Dockerfile
docker/strapi.Dockerfile
.env.example
docs/13_local_docker_deployment.md
```

After Codex creates the `frontend/` and `cms/` applications, the local stack should run with:

```bash
cp .env.example .env
docker compose up --build
```

Local service URLs:

- Frontend: `http://localhost:3000`
- Strapi admin/API: `http://localhost:1337`
- PostgreSQL from host machine: `localhost:5435`

PostgreSQL intentionally uses host port `5435` to avoid conflict with a local PostgreSQL running on `5432`.

## Key assumptions to validate with Sarga

- Final official copywriting, legal name, logos, colors, and media assets will be provided by Sarga.
- The preview PDF is included in `reference/source-pdfs/`. Page 7 is the brand guideline for colors, graphics, typefaces, and hero-image style. The website pages shown elsewhere in the PDF are examples, not layouts to reproduce.
- The production UI should be an original, premium, internationally competitive interpretation of the Sarga brand while preserving the approved scope, content hierarchy, and user journeys.
- Partner ticketing platform is not yet fixed.
- Newsletter storage/integration is not yet fixed.
- Career form or recruitment link provider is not yet fixed.
- Exact traffic estimate is not provided yet; hosting sizing is prepared with scalable assumptions.

## Phase 6 environment notes

- `FORM_SUBMISSION_MODE=placeholder` enables local validation/UI testing
  without retaining personal data. Production should use `strapi` with a
  server-only create token.
- `RECAPTCHA_SECRET_KEY` is an optional server verification integration point;
  enable it only with an approved client adapter.
- `TICKETING_DEEP_LINK_SCHEMES` and `TICKETING_EMBED_ALLOWLIST` are
  comma-separated approval lists. Raw CMS embed code is never rendered.

## Hero motion asset

The homepage includes a lightweight CSS motion treatment around its static
poster. For true horse and car movement, provide an approved seamless WebM or
MP4 loop through `NEXT_PUBLIC_HERO_VIDEO_URL`. The video is muted, inline,
looped, and hidden when reduced motion is requested; the CMS image remains the
poster and fallback.
