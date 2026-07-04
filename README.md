# Sarga Website

Single-repository multisite web platform for the **Sarga** ecosystem — a group gateway and a dedicated motorsport site, powered by a shared Strapi CMS.

## Architecture

```text
sarga-website/
├── frontend-gateway/      # Sarga.co — group gateway (Next.js, port 3000)
├── frontend-motorsport/   # Sarga Motorsport — dedicated site (Next.js, port 3001)
├── cms/                   # Shared Strapi CMS (port 1337)
├── docker-compose.yml     # PostgreSQL + optional containerized apps
├── docker/                # Dockerfiles for each service
├── docs/                  # Project documentation (brief, specs, design, deployment)
├── checklists/            # UAT and go-live checklists
├── prompts/               # AI agent phase prompts (build history)
├── assets/brand/          # Logo and brand assets
├── reference/             # Source PDFs and reference material
└── .env.example           # Environment variable reference
```

### Sites

| Site | URL (local) | Purpose |
|------|-------------|---------|
| **Sarga.co Gateway** | `http://localhost:3000` | Group entry point — ecosystem overview, corporate info, links to business units |
| **Sarga Motorsport** | `http://localhost:3001` | Dedicated motorsport site — events, news, tickets, gallery, dark kinetic design |
| **Strapi CMS** | `http://localhost:1337/admin` | Shared content management for both sites |
| **PostgreSQL** | `localhost:5435` | Shared database (host port `5435` to avoid conflict with local Postgres on `5432`) |

### Tech stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **CMS:** Strapi (headless, shared between both frontends)
- **Database:** PostgreSQL 16 (in Docker locally)
- **Package manager:** pnpm
- **Containerization:** Docker Compose

### Content model

Content is site-scoped using a `siteScope` field (`gateway`, `motorsport`, `shared`, `hidden`):

- **News articles**, **events**, **partners**, **media galleries**, and **ticket CTAs** can target one or both sites.
- Motorsport content is authored once in the CMS and consumed by both frontends where configured.
- Cross-site teasers: events/news can flag `showOnGateway` / `showOnMotorsport` for appearances on the other site.

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

### 3. Start Strapi CMS

```bash
cd cms
pnpm install
pnpm develop
```

Strapi starts at `http://localhost:1337`. On first run, create an admin account at `http://localhost:1337/admin`.

With `SEED_DEMO_CONTENT=true` (the default), Strapi seeds demo content and grants public read access so frontends work immediately without an API token.

### 4. Start the gateway frontend

```bash
cd frontend-gateway
pnpm install
pnpm dev
```

### 5. Start the motorsport frontend

```bash
cd frontend-motorsport
pnpm install
pnpm dev
```

### Local URLs

| Service | URL |
|---------|-----|
| Gateway | http://localhost:3000 |
| Motorsport | http://localhost:3001 |
| Strapi admin | http://localhost:1337/admin |
| Strapi API | http://localhost:1337/api |
| PostgreSQL | localhost:5435 |

### Optional: full containerized stack

Run all services in Docker:

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
```

### Motorsport `frontend-motorsport/.env.local`

```env
STRAPI_API_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337
STRAPI_API_TOKEN=
NEXT_PUBLIC_SITE_URL=http://localhost:3001
NEXT_PUBLIC_GATEWAY_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_KEY=sarga-motorsport
```

### CMS `cms/.env`

```env
DATABASE_HOST=localhost
DATABASE_PORT=5435
DATABASE_NAME=sarga_strapi
DATABASE_USERNAME=sarga
DATABASE_PASSWORD=sarga_local_password
# Plus APP_KEYS, API_TOKEN_SALT, ADMIN_JWT_SECRET, etc. (see cms/.env.example)
```

## Key features

### Gateway (sarga.co)
- Corporate ecosystem gateway with business unit cards, news, events, and ticket hub
- Links to Sarga Motorsport site for motorsport-scoped content
- Scope-aware routing: motorsport news/events link to the dedicated motorsport frontend

### Motorsport (motorsport.sarga.co)
- Dark, kinetic, high-contrast premium motorsport UI
- 11 page routes: home, events, tickets, experience, news, gallery, partners, about, contact, campaigns
- Server-side validated contact form with rate limiting and honeypot spam protection
- Optional ticket embed iframe support (CMS-configured)
- Dynamic sitemap.xml and robots.txt
- Open Graph metadata on all pages

### Shared CMS
- Site-scoped content types: news articles, events, ticket CTAs, partners, media galleries, ecosystem businesses
- Cross-site visibility flags for teasers and shared content
- Idempotent demo seed for local development

## Build and verify

```bash
# Gateway
cd frontend-gateway && pnpm build

# Motorsport
cd frontend-motorsport && pnpm build

# CMS type check
cd cms && npx tsc --noEmit
```

## Documentation

| Document | Description |
|----------|-------------|
| `docs/01_project_brief.md` | Project overview and goals |
| `docs/06_technical_architecture.md` | Technical design decisions |
| `docs/07_design_system.md` | Gateway design system |
| `docs/10_deployment_handover_maintenance.md` | Deployment, production, and maintenance guide |
| `docs/13_local_docker_deployment.md` | Detailed local Docker setup |
| `docs/motorsport/04_motorsport_design_system.md` | Motorsport brand and design tokens |
| `docs/PHASE_PROGRESS.md` | Build history — all 10 phases logged |
| `checklists/go_live_checklist.md` | Production go-live checklist |
| `checklists/motorsport/motorsport_uat_checklist.md` | Motorsport UAT results |

## Project status

All 10 build phases are complete:

| Phase | Title | Status |
|-------|-------|--------|
| 1 | Repository restructure | ✅ Done |
| 2 | Shared CMS multisite model | ✅ Done |
| 3 | Motorsport frontend bootstrap | ✅ Done |
| 4 | Motorsport design system | ✅ Done |
| 5 | Motorsport homepage | ✅ Done |
| 6 | Motorsport pages | ✅ Done |
| 7 | Gateway integration | ✅ Done |
| 8 | Forms, ticketing, SEO | ✅ Done |
| 9 | Quality & UAT | ✅ Done |
| 10 | Deployment & handover | ✅ Done |

See `docs/PHASE_PROGRESS.md` for detailed phase logs.

## Scope exclusions

- No internal payment processing
- No public user accounts or login
- No internal ticketing engine (partner redirect/deep link only)

## Production deployment

See `docs/10_deployment_handover_maintenance.md` for full production guidance. Recommended approach:

- **Frontends:** Vercel (separate projects for gateway and motorsport)
- **Strapi:** Strapi Cloud, Railway, or managed container
- **PostgreSQL:** Managed database (Supabase, Neon, AWS RDS)
- **Media:** S3-compatible storage (Cloudflare R2, AWS S3)

Key production steps:
1. Replace all placeholder secrets
2. Set `SEED_DEMO_CONTENT=false`
3. Create least-privilege API tokens
4. Configure S3 media storage
5. Enable HTTPS on all domains
6. Set `FORM_SUBMISSION_MODE=strapi` with create-permission token

## Source references

- `reference/source-pdfs/requirements.pdf` — vendor briefing
- `reference/source-pdfs/sarga_website_preview.pdf` — gateway visual reference
- `reference/source-pdfs/sarga_motorsport_brand_playbook.pdf` — motorsport brand system
- `assets/brand/logos/` — Sarga.co logo variants
- `assets/brand/motorsport/logos/` — Sarga Motorsport logo variants
