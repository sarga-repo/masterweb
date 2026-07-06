# Sarga Website — Multisite Gateway, Motorsport, and Horse Sport

Single-repository multisite web platform for the **Sarga** ecosystem — a group gateway, dedicated motorsport site, and dedicated horse sport site, powered by one shared Strapi CMS.

## Architecture

```text
sarga-website/
├── frontend-gateway/       # Sarga.co — group gateway (Next.js, port 3000)
├── frontend-motorsport/    # motorsport.sarga.co — dedicated motorsport site (Next.js, port 3001)
├── frontend-horsesport/    # horsesport.sarga.co — dedicated horse sport site (Next.js, port 3002)
├── cms/                    # Shared Strapi CMS (port 1337)
├── docker-compose.yml      # PostgreSQL + optional containerized apps
├── docker/                 # Dockerfiles for each service
├── docs/                   # Project documentation
├── docs/motorsport/        # Motorsport-specific specs
├── docs/horsesport/        # Horse Sport-specific specs
├── docs/multisite/         # Shared multisite architecture and CMS strategy
├── prompts/                # AI agent phase prompts
├── prompts/motorsport/     # Motorsport implementation prompts
├── prompts/horsesport/     # Horse Sport implementation prompts
├── assets/brand/           # Logo and brand assets
├── reference/              # Source PDFs and reference material
└── .env.example            # Environment variable reference
```

## Local services

| Site / service | URL | Purpose |
|---|---:|---|
| Sarga.co Gateway | `http://localhost:3000` | Group entry point and ecosystem overview |
| Sarga Motorsport | `http://localhost:3001` | Dedicated motorsport content, events, news, tickets |
| Sarga Horse Sport | `http://localhost:3002` | Dedicated horse sport content, events, derby/turf/stable stories, tickets |
| Strapi CMS | `http://localhost:1337/admin` | Shared content management for all sites |
| PostgreSQL | `localhost:5435` | Shared database, host port avoids local PostgreSQL conflict |

## Tech stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **CMS:** Strapi shared by all sites
- **Database:** PostgreSQL 16 locally through Docker
- **Package manager:** pnpm
- **Containerization:** Docker Compose

## Multisite content model

Content is site-scoped using a `siteScope` field:

```text
gateway | motorsport | horsesport | shared | hidden
```

Recommended behavior:

- Gateway can show high-level teasers for all ecosystem businesses.
- Motorsport content opens on the dedicated Motorsport frontend.
- Horse Sport content opens on the dedicated Horse Sport frontend.
- Shared content can appear on multiple frontends with site-specific visual rendering.
- Ticket CTAs are centralized in Strapi and filtered by site/business.

## Getting started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker (for PostgreSQL)

### 1. Clone and configure

```bash
git clone <repo-url> sarga-website
cd sarga-website
cp .env.example .env
```

### 2. Start the database

```bash
docker compose up -d postgres
```

Run Strapi:

```bash
cd cms
pnpm install
pnpm develop
```

Run the gateway:

```bash
cd frontend-gateway
pnpm install
pnpm dev
```

Run Motorsport:

```bash
cd frontend-motorsport
pnpm install
pnpm dev
```

Run Horse Sport:

```bash
cd frontend-horsesport
pnpm install
pnpm dev
```

## Optional full Docker run

```bash
docker compose --profile apps up --build
```

## Environment variables

Each service has its own environment configuration. See `.env.example` for the full reference.

### Root `.env` (Docker Compose)

PostgreSQL credentials, Strapi secrets, and shared frontend URLs.

### Gateway `frontend-gateway/.env.local`

```env
STRAPI_API_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337
STRAPI_API_TOKEN=
NEXT_PUBLIC_MOTORSPORT_SITE_URL=http://localhost:3001
NEXT_PUBLIC_HORSESPORT_SITE_URL=http://localhost:3002
NEXT_PUBLIC_SITE_KEY=gateway
```

### Motorsport `frontend-motorsport/.env.local`

```env
STRAPI_API_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337
STRAPI_API_TOKEN=
NEXT_PUBLIC_SITE_URL=http://localhost:3001
NEXT_PUBLIC_GATEWAY_SITE_URL=http://localhost:3000
NEXT_PUBLIC_HORSESPORT_SITE_URL=http://localhost:3002
NEXT_PUBLIC_SITE_KEY=motorsport
```

### Horse Sport `frontend-horsesport/.env.local`

```env
STRAPI_API_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337
STRAPI_API_TOKEN=
NEXT_PUBLIC_SITE_URL=http://localhost:3002
NEXT_PUBLIC_GATEWAY_SITE_URL=http://localhost:3000
NEXT_PUBLIC_MOTORSPORT_SITE_URL=http://localhost:3001
NEXT_PUBLIC_SITE_KEY=horsesport

# Optional (safe defaults if unset) — see docs/horsesport/08 for production values
FORM_SUBMISSION_MODE=placeholder   # non-placeholder value persists inquiries to Strapi
RECAPTCHA_SITE_KEY=                 # enables reCAPTCHA when paired with the secret
RECAPTCHA_SECRET_KEY=              # server-side reCAPTCHA verification (secret)
TICKETING_DEEP_LINK_SCHEMES=       # comma-separated allowed deep-link schemes
TICKETING_EMBED_ALLOWLIST=         # comma-separated hosts allowed to iframe-embed (empty = off)
```

## Documentation map

| Document | Purpose |
|---|---|
| `docs/multisite/04_three_site_integration_strategy.md` | Gateway, Motorsport, and Horse Sport routing/content strategy |
| `docs/horsesport/01_horsesport_project_brief.md` | Horse Sport product brief |
| `docs/horsesport/02_horsesport_brand_translation.md` | Brand translation from preview PDF page 7 into web UI direction |
| `docs/horsesport/03_horsesport_sitemap_page_specs.md` | Dedicated Horse Sport sitemap and page specs |
| `docs/horsesport/04_horsesport_design_system.md` | Horse Sport visual system, tokens, components |
| `docs/horsesport/05_horsesport_content_model_extensions.md` | Strapi additions for Horse Sport and three-site publishing |
| `docs/horsesport/06_horsesport_implementation_plan.md` | Phased implementation plan |
| `docs/horsesport/07_horsesport_asset_usage_guideline.md` | Approved logos, imagery, favicon, and asset usage |
| `docs/horsesport/08_horsesport_deployment_handover.md` | Production env, deployment, CMS editorial guide, rollback, monitoring |
| `checklists/horsesport/horsesport_uat_checklist.md` | UAT verification log and sign-off |
| `prompts/horsesport/` | Codex-ready implementation prompts |

## Recommended Codex flow

1. Read `AGENTS.md` and all documents in `docs/horsesport/`.
2. Run `prompts/horsesport/01_repo_restructure.md` first.
3. Run each prompt sequentially and stop after each phase for review.
4. Do not paste all prompts at once.

## Scope exclusions

- No internal payment processing
- No public user accounts/login
- No internal ticketing engine
- No second CMS unless explicitly approved
