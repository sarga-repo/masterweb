# Sarga Website - Multisite Gateway, Motorsport, and Horse Sport

Single-repository multisite web platform for the **Sarga** ecosystem - a group gateway, dedicated motorsport site, and dedicated horse sport site, powered by one shared Strapi CMS.

## Architecture

```text
sarga-website/
├── frontend-gateway/       # Sarga.co - group gateway (Next.js, port 3000)
├── frontend-motorsport/    # motorsport.sarga.co - dedicated motorsport site (Next.js, port 3001)
├── frontend-horsesport/    # horsesport.sarga.co - dedicated horse sport site (Next.js, port 3002)
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

| Site / service    |                           URL | Purpose                                                                   |
| ----------------- | ----------------------------: | ------------------------------------------------------------------------- |
| Sarga.co Gateway  |       `http://localhost:3000` | Group entry point and ecosystem overview                                  |
| Sarga Motorsport  |       `http://localhost:3001` | Dedicated motorsport content, events, news, tickets                       |
| Sarga Horse Sport |       `http://localhost:3002` | Dedicated horse sport content, events, derby/turf/stable stories, tickets |
| Strapi CMS        | `http://localhost:1337/admin` | Shared content management for all sites                                   |
| PostgreSQL        |              `localhost:5435` | Shared database, host port avoids local PostgreSQL conflict               |

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

## CMS admin access segregation

The single Strapi instance creates four managed administration roles:

| Role code                | Visible custom workspace | Server-assigned `siteScope` |
| ------------------------ | ------------------------ | --------------------------- |
| `sarga-gateway-admin`    | Sarga Gateway            | `gateway`                   |
| `sarga-motorsport-admin` | Sarga Motorsport         | `motorsport`                |
| `sarga-horsesport-admin` | Sarga Horse Sport        | `horsesport`                |
| `sarga-shared-admin`     | Shared Library           | `shared`                    |

Super Admin sees all four workspaces and retains unrestricted system access.
Site admins receive only their workspace action and site-relevant content types;
Content Manager reads/updates/deletes/publishes are filtered by `siteScope`, and
admin creates/updates are forced to the account's assigned scope.

GWR-CMS-2/3 remove `siteScope` from managed site-editor field access, protect
direct workspace routes, permission-filters workspace actions, and prefixes
site-owned custom actions. Authenticated UAT verifies direct URLs, tampered
filters/submissions, clone, publish, relation, and multi-role boundaries.
`siteScope` remains stored internally and editable only for Super Admin; see
`docs/strapi-admin-menu/`.

Dedicated roles receive conditioned read-only access only to the Site and/or
Ecosystem Business reference row needed by their relation selectors. Those
reference rows cannot be mutated. Nested components such as SEO remain writable
inside the role's owned record.

Strapi's stock v5 main sidebar supports flat links, not nested child menu items.
The four role-filtered workspace entries therefore open dashboards with grouped
Pages, Programs, Editorial, Commerce, and Library sub-navigation.

## Bilingual CMS content and dynamic top navigation

GWR-CMS-5 enables Strapi English (`en`) and Indonesian (`id`) editorial
localizations and adds per-site CMS-managed Top Navigation records. English is
the default and structural master; managed site roles can edit both languages
only within their workspace, while locale administration remains Super Admin
only. Navigation exposes an `enabled` toggle, display order, emphasis, safe URL
validation, and localized label/ARIA text.

GWR-CMS-6 and GWR-CMS-7 now apply this contract to all three frontends: English
URLs remain unprefixed, Indonesian uses `/id`, each branded header resolves its
enabled/order/CTA structure from the CMS, and the language dropdown preserves
equivalent paths. Missing Indonesian editorial records fall back as complete
English records and are marked `noindex`; fields are never mixed across
languages. Cross-site ecosystem links retain the selected locale. The
implementation and migration evidence are documented in
`docs/strapi-admin-menu/`.

GWR-CMS-8 adds repeatable `pnpm --dir cms i18n:completeness` and
`pnpm --dir cms i18n:compare` commands for translation ownership and exact
source/target content-media reconciliation. The isolated local restore and UAT
pass are documented in
`docs/strapi-admin-menu/16_gwr_cms_8_migration_uat_handover.md`; staging and
stakeholder sign-off remain deployment gates.

## Exchange Online mail transport

GWR-CMS-MAIL-2 adds an opt-in Strapi/Nodemailer transport for Microsoft
Exchange Online using app-only OAuth2 and mandatory STARTTLS. OAuth remains the
default and production target. After Sarga IT supplies a dedicated Entra
credential and mailbox-scoped Exchange authorization, staging operators can
run `pnpm --dir cms mail:verify` to authenticate without sending a message. See
`docs/strapi-admin-menu/12_gwr_cms_mail_2_oauth_transport_spec.md` for the
environment, rotation, and rollback contract.

GWR-CMS-MAIL-3 adds opt-in post-persistence inquiry notifications with fixed
Gateway/Motorsport/Horse Sport recipient allowlists, bilingual templates, and
bounded retries. `MAIL_NOTIFICATIONS_ENABLED=false` remains the default, and
newsletter campaigns/visitor receipts are not connected. GWR-CMS-MAIL-4 adds a
staging-only controlled-send command and launch checklist; production remains
disabled until the real Microsoft tenant UAT gates are signed.

For the time-boxed 2026-08-14 launch contingency, GWR-CMS-MAIL-4.1 adds an
explicit Exchange password mode for an eligible existing tenant. It requires a
risk acknowledgement and expiry, is hard-limited to 2026-12-15, and remains
disabled unless `MAIL_AUTH_MODE=basic` is deliberately selected. Store the
password only in the protected server environment and migrate to OAuth before
the configured expiry. See
`docs/strapi-admin-menu/15_gwr_cms_mail_4_1_temporary_basic_auth_fallback.md`.

Optional dedicated admin accounts can be created on bootstrap with the
`CMS_<SITE>_ADMIN_EMAIL` and `CMS_<SITE>_ADMIN_PASSWORD` variables documented in
`cms/.env.example`. Credentials are one-time provisioning inputs: never commit
them, and remove the email/password pair after the account exists. Existing
users are not reassigned or password-reset automatically.

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

If `cms/package.json` or `cms/pnpm-lock.yaml` changed and the existing Strapi
container uses an older named dependency volume, refresh it without deleting
database/uploads volumes:

```bash
docker compose --profile apps exec -T -e CI=true strapi pnpm install --frozen-lockfile
docker compose --profile apps restart strapi
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

# Optional (safe defaults if unset) - see docs/horsesport/08 for production values
FORM_SUBMISSION_MODE=placeholder   # non-placeholder value persists inquiries to Strapi
RECAPTCHA_SITE_KEY=                 # enables reCAPTCHA when paired with the secret
RECAPTCHA_SECRET_KEY=              # server-side reCAPTCHA verification (secret)
TICKETING_DEEP_LINK_SCHEMES=       # comma-separated allowed deep-link schemes
TICKETING_EMBED_ALLOWLIST=         # comma-separated hosts allowed to iframe-embed (empty = off)
```

### Strapi `cms/.env`

Use `cms/.env.example` for database/secrets plus optional one-time site-admin
provisioning. For example, setting the Motorsport email/password pair creates
an active user with only the managed `sarga-motorsport-admin` role. Passwords
must satisfy Strapi's 8-72 byte upper/lowercase/number policy.

## Documentation map

| Document                                                                | Purpose                                                                                                        |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `docs/multisite/04_three_site_integration_strategy.md`                  | Gateway, Motorsport, and Horse Sport routing/content strategy                                                  |
| `docs/gateway/revamp/README.md`                                         | Current Sarga.co Gateway reference-aligned revamp package                                                      |
| `docs/gateway/revamp/02_information_architecture_and_page_specs.md`     | Gateway sitemap, canonical routes, navigation, and page templates                                              |
| `docs/gateway/revamp/04_cms_page_activation_contract.md`                | CMS-controlled full-page and Coming Soon behaviour for dedicated Gateway pages                                 |
| `docs/strapi-admin-menu/README.md`                                      | Approval-gated per-site CMS workspace segregation architecture, phase specifications, and audit                |
| `docs/strapi-admin-menu/18_gwr_cms_9_multisite_hero_video_spec.md`      | CMS-managed MP4/WebM hero contract for Gateway, Motorsport, and Horse Sport                                    |
| `docs/strapi-admin-menu/19_gwr_cms_10_motorsport_home_sections_spec.md` | Motorsport Race Control and World of Motorsport CMS authoring contract                                         |
| `checklists/gateway/gateway_revamp_phase_checklist.md`                  | Approval-gated Gateway revamp phase checklist                                                                  |
| `docs/motorsport/revamp/README.md`                                      | Current major Motorsport revamp package based on the Look & Feel and Motorsport sitemap PDFs                   |
| `docs/motorsport/revamp/03_sitemap_page_specs.md`                       | Current Motorsport sitemap and page specs                                                                      |
| `docs/motorsport/revamp/04_cms_architecture_admin_ux.md`                | Dedicated CMS workspace/menu UX while keeping one shared Strapi instance                                       |
| `docs/motorsport/revamp/12_final_validation_launch_readiness.md`        | Final Motorsport route, browser, Lighthouse, CMS, Docker, redirect, and launch-readiness evidence              |
| `docs/14_ubuntu_single_vm_production_deployment.md`                     | Ubuntu 22.04.5 single-VM deployment for three frontends, Strapi, PostgreSQL, Nginx, systemd, and Let's Encrypt |
| `docs/15_strapi_content_media_promotion.md`                             | Exact encrypted CMS content/media promotion from local to staging and approved staging to production           |
| `checklists/motorsport/motorsport_revamp_phase_checklist.md`            | Phase checklist for the new Motorsport revamp track                                                            |
| `prompts/motorsport/revamp/`                                            | Codex-ready implementation prompts for the Motorsport revamp                                                   |
| `docs/horsesport/01_horsesport_project_brief.md`                        | Horse Sport product brief                                                                                      |
| `docs/horsesport/02_horsesport_brand_translation.md`                    | Brand translation from preview PDF page 7 into web UI direction                                                |
| `docs/horsesport/03_horsesport_sitemap_page_specs.md`                   | Dedicated Horse Sport sitemap and page specs                                                                   |
| `docs/horsesport/04_horsesport_design_system.md`                        | Horse Sport visual system, tokens, components                                                                  |
| `docs/horsesport/05_horsesport_content_model_extensions.md`             | Strapi additions for Horse Sport and three-site publishing                                                     |
| `docs/horsesport/06_horsesport_implementation_plan.md`                  | Phased implementation plan                                                                                     |
| `docs/horsesport/07_horsesport_asset_usage_guideline.md`                | Approved logos, imagery, favicon, and asset usage                                                              |
| `docs/horsesport/08_horsesport_deployment_handover.md`                  | Production env, deployment, CMS editorial guide, rollback, monitoring                                          |
| `checklists/horsesport/horsesport_uat_checklist.md`                     | UAT verification log and sign-off                                                                              |
| `prompts/horsesport/`                                                   | Codex-ready implementation prompts                                                                             |

## Recommended Codex flow

1. For Gateway revamp work, read `AGENTS.md`, then
   `docs/gateway/revamp/README.md`, and execute one GWR phase at a time.
2. For the Motorsport revamp, read `docs/motorsport/revamp/README.md` and run
   its prompts sequentially.
3. For Horse Sport work, read `docs/horsesport/` and use
   `prompts/horsesport/`.
4. Stop after every phase for review and approval.

## CMS-managed hero video

All three public sites support optional muted MP4/WebM hero loops from the
shared Strapi instance. Gateway and Horse Sport configure one `Hero Video` on
their home record; each of the maximum three Motorsport hero slides may
configure its own video. Posters remain the default/fallback, only the active
slide loads, playback has a visible pause control, and reduced-motion visitors
receive the static poster. See the GWR-CMS-9 specification and editor handover
before uploading or promoting media.

## Scope exclusions

- No internal payment processing
- No public user accounts/login
- No internal ticketing engine
- No second CMS unless explicitly approved
