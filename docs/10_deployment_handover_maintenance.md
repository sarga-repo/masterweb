# 10 - Deployment, Handover, Hypercare, and Maintenance

## Architecture overview

The Sarga website uses a **single-repository multisite architecture**:

```text
sarga-website/
├── frontend-gateway/      # Sarga.co group gateway (Next.js, port 3000)
├── frontend-motorsport/   # Sarga Motorsport dedicated site (Next.js, port 3001)
├── frontend-horsesport/   # Sarga Horse Sport dedicated site (Next.js, port 3002)
├── cms/                   # Shared Strapi CMS (port 1337)
├── docker-compose.yml     # Local PostgreSQL + optional containerized apps
└── .env.example           # Root environment variable reference
```

- **Three frontends** share one Strapi CMS.
- Content is site-scoped: `gateway`, `motorsport`, `horsesport`, `shared`, or `hidden`.
- News and events can appear on multiple sites but render with each site's own design.
- Business content is authored once in CMS and consumed by the frontends where configured.

> Horse Sport-specific deployment, editorial, rollback, and monitoring detail
> lives in [`docs/horsesport/08_horsesport_deployment_handover.md`](horsesport/08_horsesport_deployment_handover.md).
> This document is the group-wide reference.

> The approved initial staging/production baseline for one Ubuntu 22.04.5 LTS
> VM is [`docs/14_ubuntu_single_vm_production_deployment.md`](14_ubuntu_single_vm_production_deployment.md).
> It supersedes hosted-service examples where they conflict with the selected
> topology and includes Node, PostgreSQL, four systemd services, four Nginx
> server blocks, Let's Encrypt issuance/renewal, backup, rollback, and UAT.

> Exact CMS content and Media Library promotion is documented in
> [`docs/15_strapi_content_media_promotion.md`](15_strapi_content_media_promotion.md).
> It is the required initial local-to-staging and approved staging-to-production
> procedure; it removes the need to recreate content or upload assets manually.

## Deployment environments

### Development

- Local developer machines
- Local Strapi and PostgreSQL
- Seed content for dev

### Staging

- Public/private staging URL
- Connected to staging Strapi
- Used for UAT

### Production

- sarga.co
- Production Strapi admin
- Production PostgreSQL
- Local Strapi uploads on the initial single VM, backed up together with the
  database; approved object storage can be introduced later as a migration
- CDN and SSL

### CMS data promotion policy

- Local startup seed (`SEED_DEMO_CONTENT=true`) is limited to disposable
  development databases.
- Initial staging is populated from an encrypted full Strapi archive created
  from the reviewed local CMS snapshot. The archive includes content,
  relations, configuration, schemas, and uploaded media.
- Initial production is populated from the frozen, stakeholder-approved
  staging snapshot, never directly from a developer laptop.
- Every import is a full replacement and requires a target PostgreSQL/uploads
  backup, matching CMS schema commit, checksum verification, a maintenance
  window, and post-import UAT.
- Admin accounts and API tokens are environment-specific and are recreated or
  verified after import. They are not assumed to be present in the archive.
- After go-live, production is authoritative; never overwrite it with an older
  full snapshot containing stale content or missing form submissions.

## Environment variable inventory

### Root `.env` (Docker Compose + shared)

| Variable                          | Purpose                       | Local default           | Production                    |
| --------------------------------- | ----------------------------- | ----------------------- | ----------------------------- |
| `POSTGRES_DB`                     | PostgreSQL database name      | `sarga_strapi`          | Managed DB name               |
| `POSTGRES_USER`                   | PostgreSQL user               | `sarga`                 | Managed DB user               |
| `POSTGRES_PASSWORD`               | PostgreSQL password           | `sarga_local_password`  | Strong secret                 |
| `SEED_DEMO_CONTENT`               | Seed demo data on Strapi boot | `true`                  | `false`                       |
| `STRAPI_APP_KEYS`                 | Strapi encryption keys        | `change_me_*`           | Unique secrets                |
| `STRAPI_API_TOKEN_SALT`           | API token salt                | `change_me_*`           | Unique secret                 |
| `STRAPI_ADMIN_JWT_SECRET`         | Admin JWT secret              | `change_me_*`           | Unique secret                 |
| `STRAPI_TRANSFER_TOKEN_SALT`      | Transfer token salt           | `change_me_*`           | Unique secret                 |
| `STRAPI_JWT_SECRET`               | JWT secret                    | `change_me_*`           | Unique secret                 |
| `STRAPI_ENCRYPTION_KEY`           | Encryption key                | `change_me_*`           | Unique secret                 |
| `NEXT_PUBLIC_SITE_URL`            | Gateway public URL            | `http://localhost:3000` | `https://sarga.co`            |
| `NEXT_PUBLIC_MOTORSPORT_SITE_URL` | Motorsport public URL         | `http://localhost:3001` | `https://motorsport.sarga.co` |
| `NEXT_PUBLIC_HORSESPORT_SITE_URL` | Horse Sport public URL        | `http://localhost:3002` | `https://horsesport.sarga.co` |
| `NEXT_PUBLIC_GATEWAY_SITE_URL`    | Gateway URL (for cross-links) | `http://localhost:3000` | `https://sarga.co`            |
| `NEXT_PUBLIC_STRAPI_API_URL`      | Browser-reachable Strapi URL  | `http://localhost:1337` | `https://cms.sarga.co`        |
| `STRAPI_API_URL`                  | Server-side Strapi URL        | `http://localhost:1337` | `https://cms.sarga.co`        |
| `STRAPI_API_TOKEN`                | Read-only frontend token      | (blank)                 | Least-privilege token         |
| `FORM_SUBMISSION_MODE`            | Form backend mode             | `placeholder`           | `strapi`                      |
| `RECAPTCHA_SITE_KEY`              | reCAPTCHA client key          | (blank)                 | If approved                   |
| `RECAPTCHA_SECRET_KEY`            | reCAPTCHA server key          | (blank)                 | If approved                   |
| `TICKETING_DEEP_LINK_SCHEMES`     | Allowed app schemes           | (blank)                 | If needed                     |
| `TICKETING_EMBED_ALLOWLIST`       | Allowed iframe hosts          | (blank)                 | If needed                     |

### Gateway `frontend-gateway/.env.local`

| Variable                          | Purpose                   | Local default           |
| --------------------------------- | ------------------------- | ----------------------- |
| `STRAPI_API_URL`                  | Server-side content fetch | `http://localhost:1337` |
| `NEXT_PUBLIC_STRAPI_API_URL`      | Browser media URLs        | `http://localhost:1337` |
| `STRAPI_API_TOKEN`                | Read-only token           | (blank)                 |
| `NEXT_PUBLIC_MOTORSPORT_SITE_URL` | Link to motorsport site   | `http://localhost:3001` |
| `NEXT_PUBLIC_HORSESPORT_SITE_URL` | Link to horse sport site  | `http://localhost:3002` |

### Motorsport `frontend-motorsport/.env.local`

| Variable                          | Purpose                   | Local default           |
| --------------------------------- | ------------------------- | ----------------------- |
| `STRAPI_API_URL`                  | Server-side content fetch | `http://localhost:1337` |
| `NEXT_PUBLIC_STRAPI_API_URL`      | Browser media URLs        | `http://localhost:1337` |
| `STRAPI_API_TOKEN`                | Read-only token           | (blank)                 |
| `NEXT_PUBLIC_SITE_URL`            | This site's URL           | `http://localhost:3001` |
| `NEXT_PUBLIC_GATEWAY_SITE_URL`    | Link back to gateway      | `http://localhost:3000` |
| `NEXT_PUBLIC_HORSESPORT_SITE_URL` | Link to horse sport site  | `http://localhost:3002` |
| `NEXT_PUBLIC_SITE_KEY`            | CMS site scope identifier | `sarga-motorsport`      |

### Horse Sport `frontend-horsesport/.env.local`

| Variable                                      | Purpose                                                 | Local default           |
| --------------------------------------------- | ------------------------------------------------------- | ----------------------- |
| `STRAPI_API_URL`                              | Server-side content fetch                               | `http://localhost:1337` |
| `NEXT_PUBLIC_STRAPI_API_URL`                  | Browser media URLs                                      | `http://localhost:1337` |
| `STRAPI_API_TOKEN`                            | Read token; **create** on `inquiry-submissions` in prod | (blank)                 |
| `NEXT_PUBLIC_SITE_URL`                        | This site's URL                                         | `http://localhost:3002` |
| `NEXT_PUBLIC_GATEWAY_SITE_URL`                | Link back to gateway                                    | `http://localhost:3000` |
| `NEXT_PUBLIC_MOTORSPORT_SITE_URL`             | Link to motorsport site                                 | `http://localhost:3001` |
| `NEXT_PUBLIC_SITE_KEY`                        | CMS site scope identifier                               | `sarga-horse-sport`     |
| `FORM_SUBMISSION_MODE`                        | Contact form backend mode                               | `placeholder`           |
| `RECAPTCHA_SITE_KEY` / `RECAPTCHA_SECRET_KEY` | reCAPTCHA (optional)                                    | (blank)                 |
| `TICKETING_DEEP_LINK_SCHEMES`                 | Allowed ticket deep-link schemes                        | (blank)                 |
| `TICKETING_EMBED_ALLOWLIST`                   | Allowed ticket iframe hosts                             | (blank)                 |

> Form/ticketing toggles apply to any frontend that ships those features; Horse
> Sport uses all of them (see docs/horsesport/08). Gateway/Motorsport read the
> same keys from the root `.env` where relevant.

### CMS `cms/.env`

| Variable              | Purpose               | Local default          |
| --------------------- | --------------------- | ---------------------- |
| `HOST`                | Bind address          | `0.0.0.0`              |
| `PORT`                | Strapi port           | `1337`                 |
| `DATABASE_HOST`       | PostgreSQL host       | `localhost`            |
| `DATABASE_PORT`       | PostgreSQL port       | `5435`                 |
| `DATABASE_NAME`       | Database name         | `sarga_strapi`         |
| `DATABASE_USERNAME`   | Database user         | `sarga`                |
| `DATABASE_PASSWORD`   | Database password     | `sarga_local_password` |
| `DATABASE_SSL`        | SSL for DB connection | `false`                |
| `APP_KEYS`            | Encryption keys       | `change_me_*`          |
| `API_TOKEN_SALT`      | API token salt        | `change_me_*`          |
| `ADMIN_JWT_SECRET`    | Admin JWT secret      | `change_me_*`          |
| `TRANSFER_TOKEN_SALT` | Transfer token salt   | `change_me_*`          |
| `JWT_SECRET`          | JWT secret            | `change_me_*`          |
| `ENCRYPTION_KEY`      | Encryption key        | `change_me_*`          |
| `SEED_DEMO_CONTENT`   | Seed demo data        | `true`                 |

### PostgreSQL

| Parameter      | Value                  |
| -------------- | ---------------------- |
| Host port      | `5435`                 |
| Container port | `5432`                 |
| Database       | `sarga_strapi`         |
| User           | `sarga`                |
| Password       | `sarga_local_password` |

## Local development setup

### Prerequisites

Before starting, make sure you have these installed:

| Tool                                                             | Minimum version | Purpose                            |
| ---------------------------------------------------------------- | --------------- | ---------------------------------- |
| [Node.js](https://nodejs.org)                                    | 22 LTS          | Runtime for Strapi and Next.js     |
| [pnpm](https://pnpm.io)                                          | 9+              | Package manager for all three apps |
| [Docker Desktop](https://www.docker.com/products/docker-desktop) | Latest          | Runs PostgreSQL in a container     |
| [Git](https://git-scm.com)                                       | Latest          | Clone the repository               |

Verify your installation:

```bash
node --version    # v22.x.x
pnpm --version    # 9.x.x or higher
docker --version  # 24.x or higher
git --version     # 2.x
```

### Architecture overview (local)

```text
┌───────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────┐
│ Gateway Frontend  │ │ Motorsport Frontend │ │ Horse Sport Frontend│ │  Strapi CMS     │
│ localhost:3000    │ │ localhost:3001      │ │ localhost:3002      │ │  localhost:1337 │
│ (Next.js)         │ │ (Next.js)           │ │ (Next.js)           │ │  (Node.js)      │
└─────────┬─────────┘ └──────────┬──────────┘ └──────────┬──────────┘ └────────┬────────┘
          │                      │                        │                     │
          │   fetch content      │    fetch content       │   fetch content     │
          └──────────────────────┴───────────┬────────────┴─────────────────────┘
                                              │
                                      ┌───────┴────────┐
                                      │ PostgreSQL     │
                                      │ localhost:5435 │
                                      │ (Docker)       │
                                      └────────────────┘
```

- **PostgreSQL** runs in Docker (port `5435` on host → `5432` in container).
- **Strapi CMS** runs on the host (port `1337`), connects to PostgreSQL.
- **Gateway frontend** runs on the host (port `3000`), fetches content from Strapi.
- **Motorsport frontend** runs on the host (port `3001`), fetches content from Strapi.
- **Horse Sport frontend** runs on the host (port `3002`), fetches content from Strapi.
- All host-based apps talk to each other via `localhost`.

### Step 1: Clone the repository

```bash
git clone <repository-url> sarga-website
cd sarga-website
```

### Step 2: Set up environment variables

#### Root `.env` (used by Docker Compose for PostgreSQL)

```bash
# Copy the template
cp .env.example .env
```

The defaults in `.env.example` work for local development. Key values:

```env
POSTGRES_DB=sarga_strapi
POSTGRES_USER=sarga
POSTGRES_PASSWORD=sarga_local_password
SEED_DEMO_CONTENT=true
STRAPI_APP_KEYS=change_me_1,change_me_2,change_me_3,change_me_4
```

> **Note:** `SEED_DEMO_CONTENT=true` automatically seeds sample content (timeline, leadership, ecosystem businesses, news) on Strapi's first boot. This is idempotent - it only seeds when content types are empty.

#### Gateway frontend `.env.local`

Create `frontend-gateway/.env.local`:

```env
# Strapi API URLs (server-side and browser-reachable)
STRAPI_API_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337

# Leave blank - local dev uses Strapi's public read permissions from the seed
STRAPI_API_TOKEN=

# Motorsport site URL for cross-site links
NEXT_PUBLIC_MOTORSPORT_SITE_URL=http://localhost:3001
```

#### Motorsport frontend `.env.local`

Create `frontend-motorsport/.env.local`:

```env
# Strapi API URLs
STRAPI_API_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337

# Leave blank - local dev uses public read permissions
STRAPI_API_TOKEN=

# This site's URL and link back to gateway
NEXT_PUBLIC_SITE_URL=http://localhost:3001
NEXT_PUBLIC_GATEWAY_SITE_URL=http://localhost:3000

# CMS site scope identifier
NEXT_PUBLIC_SITE_KEY=sarga-motorsport
```

#### Horse Sport frontend `.env.local`

Create `frontend-horsesport/.env.local`:

```env
# Strapi API URLs
STRAPI_API_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337

# Leave blank - local dev uses public read permissions
STRAPI_API_TOKEN=

# This site's URL and cross-site links
NEXT_PUBLIC_SITE_URL=http://localhost:3002
NEXT_PUBLIC_GATEWAY_SITE_URL=http://localhost:3000
NEXT_PUBLIC_MOTORSPORT_SITE_URL=http://localhost:3001

# CMS site scope identifier
NEXT_PUBLIC_SITE_KEY=sarga-horse-sport

# Optional feature toggles (safe defaults if unset - see docs/horsesport/08)
FORM_SUBMISSION_MODE=placeholder
RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=
TICKETING_DEEP_LINK_SCHEMES=
TICKETING_EMBED_ALLOWLIST=
```

### Step 3: Start PostgreSQL in Docker

Open **Terminal 1**:

```bash
# Start the PostgreSQL container
docker compose up -d postgres

# Verify it's running
docker compose ps
```

Expected output:

```text
NAME                    STATUS
sarga-postgres-local    Up (healthy)
```

PostgreSQL is now accessible at `localhost:5435` (host) → `5432` (container).

> **Why port 5435?** Avoids conflicts with any local PostgreSQL installation that may already use port `5432`.

### Step 4: Start Strapi CMS

Open **Terminal 2**:

```bash
# Navigate to the CMS directory
cd cms

# Install dependencies
pnpm install

# Start Strapi in development mode
pnpm develop
```

**First boot** takes 1–3 minutes as Strapi:

1. Compiles TypeScript source
2. Runs database migrations against PostgreSQL
3. Creates content types from the schema
4. Seeds demo content (because `SEED_DEMO_CONTENT=true`)
5. Grants public read permissions on content types

You'll see output like:

```text
[INFO]  Starting Strapi...
[INFO]  Database connection successful
[INFO]  Seeding demo content...
[INFO]  Seed complete: 3 timeline items, 6 leadership people, ...
[INFO]  Strapi started on http://localhost:1337
```

**Verify:**

- Strapi admin: [http://localhost:1337/admin](http://localhost:1337/admin)
- First visit: create your admin account (email + password)
- API: [http://localhost:1337/api/ecosystem-businesses](http://localhost:1337/api/ecosystem-businesses) should return JSON

### Step 5: Start Gateway frontend

Open **Terminal 3**:

```bash
# Navigate to the gateway directory
cd frontend-gateway

# Install dependencies
pnpm install

# Start the Next.js dev server with Turbopack
pnpm dev
```

The gateway starts at [http://localhost:3000](http://localhost:3000).

**Verify:**

- Homepage: [http://localhost:3000](http://localhost:3000)
- About page: [http://localhost:3000/about](http://localhost:3000/about)
- Ecosystem: [http://localhost:3000/ecosystem](http://localhost:3000/ecosystem)
- News: [http://localhost:3000/news](http://localhost:3000/news)

### Step 6: Start Motorsport frontend

Open **Terminal 4**:

```bash
# Navigate to the motorsport directory
cd frontend-motorsport

# Install dependencies
pnpm install

# Start the Next.js dev server with Turbopack
pnpm dev --port 3001
```

The motorsport site starts at [http://localhost:3001](http://localhost:3001).

**Verify:**

- Homepage: [http://localhost:3001](http://localhost:3001)

### Step 7: Start Horse Sport frontend

Open **Terminal 5**:

```bash
# Navigate to the horse sport directory
cd frontend-horsesport

# Install dependencies
pnpm install

# Start the Next.js dev server (the dev script binds --port 3002)
pnpm dev
```

The horse sport site starts at [http://localhost:3002](http://localhost:3002).

**Verify:**

- Homepage: [http://localhost:3002](http://localhost:3002)
- Events: [http://localhost:3002/events](http://localhost:3002/events)
- Contact: [http://localhost:3002/contact](http://localhost:3002/contact)

### Summary of local URLs

| Service              | URL                                                        | Terminal            |
| -------------------- | ---------------------------------------------------------- | ------------------- |
| PostgreSQL (host)    | `localhost:5435`                                           | Terminal 1 (Docker) |
| Strapi admin         | [http://localhost:1337/admin](http://localhost:1337/admin) | Terminal 2          |
| Strapi API           | [http://localhost:1337/api](http://localhost:1337/api)     | Terminal 2          |
| Gateway frontend     | [http://localhost:3000](http://localhost:3000)             | Terminal 3          |
| Motorsport frontend  | [http://localhost:3001](http://localhost:3001)             | Terminal 4          |
| Horse Sport frontend | [http://localhost:3002](http://localhost:3002)             | Terminal 5          |

### Quick-start cheat sheet

If everything is already set up (dependencies installed, `.env` files exist), use this to start all services:

```bash
# Terminal 1: Database
docker compose up -d postgres

# Terminal 2: CMS (wait for "Strapi started" message)
cd cms && pnpm develop

# Terminal 3: Gateway (after Strapi is ready)
cd frontend-gateway && pnpm dev

# Terminal 4: Motorsport (after Strapi is ready)
cd frontend-motorsport && pnpm dev --port 3001

# Terminal 5: Horse Sport (after Strapi is ready)
cd frontend-horsesport && pnpm dev
```

> **Important:** Always start Strapi **before** the frontends. The frontends fetch content from Strapi on page load. If Strapi isn't ready, the frontends fall back to bundled mock data - which is fine for UI development but won't show CMS-managed content.

### Troubleshooting

| Issue                                           | Solution                                                                                                                                     |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `Port 5435 already in use`                      | Another service uses port 5435. Stop it or change `ports` in `docker-compose.yml`.                                                           |
| `Port 3000 already in use`                      | Run gateway on a different port: `pnpm dev --port 3002`                                                                                      |
| `ECONNREFUSED localhost:1337`                   | Strapi isn't running yet. Start it first (`cd cms && pnpm develop`).                                                                         |
| Strapi shows `relation "X" does not exist`      | Database migration failed. Delete the DB volume and restart: `docker compose down -v && docker compose up -d postgres`, then restart Strapi. |
| Frontend shows mock data instead of CMS content | `STRAPI_API_TOKEN` is blank and public permissions weren't granted. Re-seed by restarting Strapi with `SEED_DEMO_CONTENT=true`.              |
| `pnpm: command not found`                       | Install pnpm: `npm install -g pnpm` or `corepack enable` (Node 22+).                                                                         |
| Docker not running                              | Start Docker Desktop and wait for it to show "running".                                                                                      |
| Turbopack crash or panic                        | Delete the `.next` cache: `rm -rf frontend-gateway/.next` and restart.                                                                       |

### Reset everything (fresh start)

```bash
# Stop all Docker containers
docker compose down

# Delete the PostgreSQL volume (wipes all CMS data)
docker compose down -v

# Clean Node.js caches (optional)
rm -rf cms/node_modules cms/.strapi
rm -rf frontend-gateway/node_modules frontend-gateway/.next
rm -rf frontend-motorsport/node_modules frontend-motorsport/.next
rm -rf frontend-horsesport/node_modules frontend-horsesport/.next

# Start from scratch
# Follow Steps 3–6 above
```

### Full containerized stack (alternative)

If you prefer running everything in Docker (slower startup, but no host Node.js needed):

```bash
# Start all services in containers (postgres + strapi + all three frontends)
docker compose --profile apps up --build
```

This runs all 5 services in Docker. Access:

- Gateway: `http://localhost:3000`
- Motorsport: `http://localhost:3001`
- Horse Sport: `http://localhost:3002`
- Strapi: `http://localhost:1337`
- PostgreSQL: `localhost:5435`

> **Note:** Containerized mode is slower for development (no hot-reload). Use the host-based workflow (Steps 3–6) for active development.

## Production deployment options

### Option A: Vercel + Managed Strapi + Supabase (recommended)

- **Frontends:** Deploy all three Next.js apps to Vercel (separate projects).
- **Strapi:** Use Strapi Cloud, Railway, or a managed container (DigitalOcean App Platform, AWS ECS).
- **PostgreSQL:** Supabase (free tier available, managed PostgreSQL with automatic backups).
- **Media:** Supabase Storage or S3-compatible storage (Cloudflare R2, AWS S3, DigitalOcean Spaces).
- **CDN:** Vercel Edge Network (frontends) + Cloudflare/CDN for Strapi media.

#### Step-by-step: Supabase database setup

1. **Create a Supabase project**
   - Go to [https://supabase.com](https://supabase.com) and sign in.
   - Click **New Project**.
   - Fill in:
     - **Name:** `sarga-strapi` (or your preferred name)
     - **Database Password:** generate a strong password (save it securely)
     - **Region:** choose the region closest to your users (e.g. `Southeast Asia (Singapore)` for Indonesia)
     - **Pricing Plan:** Free tier is sufficient to start
   - Click **Create new project** and wait for provisioning (~2 minutes).

2. **Get connection details**
   - In the Supabase dashboard, go to **Project Settings → Database**.
   - Under **Connection string**, select **Transaction** pooler mode.
   - Copy these values:
     - `DATABASE_HOST` - e.g. `aws-0-ap-southeast-1.pooler.supabase.com`
     - `DATABASE_PORT` - `6543` (pooler port) or `5432` (direct)
     - `DATABASE_NAME` - `postgres`
     - `DATABASE_USERNAME` - `postgres.[project-ref]`
     - `DATABASE_PASSWORD` - the password you set during project creation
   - Under **Connection pooling**, note the pooler connection string for Strapi.

3. **Configure SSL**
   - Supabase requires SSL for external connections.
   - Set `DATABASE_SSL=true` in Strapi's environment.
   - Strapi's `pg` driver accepts `rejectUnauthorized: false` for Supabase - configure in `cms/config/database.ts`:
     ```ts
     export default ({ env }) => ({
       connection: {
         client: "postgres",
         connection: {
           host: env("DATABASE_HOST"),
           port: env.int("DATABASE_PORT", 5432),
           database: env("DATABASE_NAME", "postgres"),
           user: env("DATABASE_USERNAME"),
           password: env("DATABASE_PASSWORD"),
           ssl: env.bool("DATABASE_SSL", false)
             ? { rejectUnauthorized: false }
             : false,
         },
       },
     });
     ```

4. **Enable automatic backups**
   - In Supabase dashboard: **Settings → Database → Backups**.
   - Free tier: daily PITR (Point-in-Time Recovery) with 7-day retention.
   - Pro tier: PITR with 30-day retention.

#### Step-by-step: Strapi CMS deployment (Railway / Docker)

Strapi cannot run on Vercel (it requires a persistent Node.js server). Use Railway or a Docker host.

##### Option 1: Railway (recommended for Strapi)

1. **Create a Railway project**
   - Go to [https://railway.app](https://railway.app) and sign in with GitHub.
   - Click **New Project → Deploy from GitHub repo**.
   - Connect your `sarga-website` repository.
   - Set the **Root Directory** to `cms/`.

2. **Configure build and start commands**
   - In the Railway service settings:
     - **Build Command:** `pnpm install && pnpm build`
     - **Start Command:** `pnpm start`
   - Set **Node version** to `22` via `NIXPACKS_NODE_VERSION=22`.

3. **Set environment variables in Railway**
   - Go to your service → **Variables** tab and add:
     ```env
     DATABASE_HOST=<supabase-host>
     DATABASE_PORT=6543
     DATABASE_NAME=postgres
     DATABASE_USERNAME=postgres.<project-ref>
     DATABASE_PASSWORD=<supabase-password>
     DATABASE_SSL=true
     APP_KEYS=<generate-4-unique-keys>
     API_TOKEN_SALT=<generate-unique-salt>
     ADMIN_JWT_SECRET=<generate-unique-secret>
     TRANSFER_TOKEN_SALT=<generate-unique-salt>
     JWT_SECRET=<generate-unique-secret>
     ENCRYPTION_KEY=<generate-unique-key>
     SEED_DEMO_CONTENT=false
     ```
   - Generate secrets using: `openssl rand -base64 32` (run 6 times for each key).

4. **Set public networking**
   - In Railway service settings → **Networking** → **Generate Domain**.
   - Railway assigns a public URL like `cms-sarga-strapi.up.railway.app`.
   - This becomes your `STRAPI_API_URL` for all three frontends.

5. **Deploy**
   - Railway auto-deploys on push to the connected branch.
   - First deployment: Strapi builds, runs migrations against Supabase, then boots.
   - Visit `<railway-url>/admin` to create the first admin account.

6. **Create API tokens**
   - In Strapi admin → **Settings → API Tokens → Create new API Token**.
   - Token 1: `frontend-gateway-read`
     - Type: **Read-only**
     - Description: "Read-only token for Sarga gateway frontend"
   - Token 2: `frontend-motorsport-read`
     - Type: **Read-only**
     - Description: "Read-only token for Sarga Motorsport frontend"
   - Token 3: `frontend-horsesport-read`
     - Type: **Custom** - read on rendered collections **plus create on
       `inquiry-submissions`** (contact form persistence). Least-privilege; no
       other write scopes.
     - Description: "Horse Sport frontend - read + inquiry create"
   - Copy all three tokens for the Vercel environment variables.

##### Option 2: Docker on a VPS

1. Provision a VPS (DigitalOcean, Hetzner, AWS EC2) with Docker installed.
2. Clone the repository and copy `cms/` to the server.
3. Create `cms/.env` with the Supabase connection details (same variables as Railway).
4. Build and run:
   ```bash
   docker build -f docker/strapi.Dockerfile -t sarga-cms .
   docker run -d --name sarga-cms --env-file cms/.env -p 1337:1337 sarga-cms
   ```
5. Set up a reverse proxy (Caddy/nginx) with HTTPS pointing to `cms.sarga.co`.

#### Step-by-step: Vercel deployment - Gateway frontend (`sarga.co`)

1. **Import the project**
   - Go to [https://vercel.com](https://vercel.com) → **Add New → Project**.
   - Import your Git repository (`sarga-website`).
   - **Root Directory:** `frontend-gateway`
   - **Framework Preset:** `Next.js`
   - Vercel auto-detects Next.js settings.

2. **Configure build settings**
   - **Install Command:** `pnpm install`
   - **Build Command:** `pnpm build`
   - **Output Directory:** `.next` (auto-detected)
   - **Node.js Version:** `22.x`
   - **Package Manager:** `pnpm`

3. **Set environment variables**
   - In the project settings → **Environment Variables**, add for **Production**:
     ```env
     STRAPI_API_URL=https://<your-strapi-railway-url>
     NEXT_PUBLIC_STRAPI_API_URL=https://<your-strapi-railway-url>
     STRAPI_API_TOKEN=<frontend-gateway-read-token>
     NEXT_PUBLIC_MOTORSPORT_SITE_URL=https://motorsport.sarga.co
     NEXT_PUBLIC_HORSESPORT_SITE_URL=https://horsesport.sarga.co
     NEXT_PUBLIC_SITE_URL=https://sarga.co
     ```

4. **Configure custom domain**
   - In Vercel project → **Settings → Domains**.
   - Add `sarga.co`.
   - Follow the DNS instructions:
     - Add an **A record** pointing to Vercel's IP (`76.76.21.21`), or
     - Add a **CNAME** pointing to `cname.vercel-dns.com`.
   - Vercel auto-provisions SSL via Let's Encrypt.

5. **Deploy**
   - Click **Deploy** (or push to the connected branch for auto-deploy).
   - Vercel builds the Next.js app and deploys to the edge network.
   - Verify: visit `https://sarga.co` and check all pages load.
   - Verify cross-site links to `motorsport.sarga.co` work.

6. **Preview deployments**
   - Vercel auto-creates preview URLs for every pull request.
   - Each PR gets a unique URL like `sarga-website-<branch>.vercel.app`.
   - Set preview environment variables (same as production, but can point to staging Strapi).

#### Step-by-step: Vercel deployment - Motorsport frontend (`motorsport.sarga.co`)

1. **Create a second Vercel project**
   - Vercel dashboard → **Add New → Project**.
   - Import the same Git repository (`sarga-website`).
   - **Root Directory:** `frontend-motorsport`
   - **Framework Preset:** `Next.js`

2. **Configure build settings** (same as gateway)
   - **Install Command:** `pnpm install`
   - **Build Command:** `pnpm build`
   - **Node.js Version:** `22.x`
   - **Package Manager:** `pnpm`

3. **Set environment variables**
   - For **Production**:
     ```env
     STRAPI_API_URL=https://<your-strapi-railway-url>
     NEXT_PUBLIC_STRAPI_API_URL=https://<your-strapi-railway-url>
     STRAPI_API_TOKEN=<frontend-motorsport-read-token>
     NEXT_PUBLIC_SITE_URL=https://motorsport.sarga.co
     NEXT_PUBLIC_GATEWAY_SITE_URL=https://sarga.co
     NEXT_PUBLIC_HORSESPORT_SITE_URL=https://horsesport.sarga.co
     NEXT_PUBLIC_SITE_KEY=sarga-motorsport
     ```

4. **Configure custom domain**
   - **Settings → Domains** → Add `motorsport.sarga.co`.
   - In your DNS provider, add a **CNAME** record:
     - `motorsport` → `cname.vercel-dns.com`
   - Vercel auto-provisions SSL.

5. **Deploy and verify**
   - Push to the connected branch.
   - Verify: visit `https://motorsport.sarga.co`.
   - Verify cross-site links back to `sarga.co` work.
   - Verify CMS content loads (news, events, ecosystem pages).

#### Step-by-step: Vercel deployment - Horse Sport frontend (`horsesport.sarga.co`)

1. **Create a third Vercel project**
   - Vercel dashboard → **Add New → Project**.
   - Import the same Git repository (`sarga-website`).
   - **Root Directory:** `frontend-horsesport`
   - **Framework Preset:** `Next.js`

2. **Configure build settings** (same as the others)
   - **Install Command:** `pnpm install`
   - **Build Command:** `pnpm build`
   - **Node.js Version:** `22.x`
   - **Package Manager:** `pnpm`

3. **Set environment variables**
   - For **Production**:
     ```env
     STRAPI_API_URL=https://<your-strapi-railway-url>
     NEXT_PUBLIC_STRAPI_API_URL=https://<your-strapi-railway-url>
     STRAPI_API_TOKEN=<frontend-horsesport-token>   # read + create on inquiry-submissions
     NEXT_PUBLIC_SITE_URL=https://horsesport.sarga.co
     NEXT_PUBLIC_GATEWAY_SITE_URL=https://sarga.co
     NEXT_PUBLIC_MOTORSPORT_SITE_URL=https://motorsport.sarga.co
     NEXT_PUBLIC_SITE_KEY=sarga-horse-sport
     # Enable real inquiry persistence + safety toggles as needed:
     FORM_SUBMISSION_MODE=strapi
     RECAPTCHA_SITE_KEY=            # optional
     RECAPTCHA_SECRET_KEY=         # optional (secret)
     TICKETING_DEEP_LINK_SCHEMES=  # optional
     TICKETING_EMBED_ALLOWLIST=    # optional; empty = iframe embeds off
     ```

4. **Configure custom domain**
   - **Settings → Domains** → Add `horsesport.sarga.co`.
   - In your DNS provider, add a **CNAME** record:
     - `horsesport` → `cname.vercel-dns.com`
   - Vercel auto-provisions SSL.

5. **Deploy and verify**
   - Push to the connected branch.
   - Verify: visit `https://horsesport.sarga.co` (see the smoke checklist in
     `docs/horsesport/08`).
   - Verify cross-site links back to `sarga.co` / `motorsport.sarga.co` work.
   - Verify the contact form persists an `inquiry-submissions` record with
     `sourceSite=horsesport`, and a ticket CTA opens the partner URL.

#### Step-by-step: Supabase Storage for media (optional)

If using Supabase Storage instead of local uploads:

1. **Create a storage bucket**
   - Supabase dashboard → **Storage** → **New bucket**.
   - Name: `strapi-uploads`
   - Set to **Public** (so frontend can access media URLs directly).

2. **Configure bucket policies**
   - Add a policy allowing public `SELECT` (read) access.
   - Add a policy allowing authenticated `INSERT` (upload) from Strapi.

3. **Install Strapi upload provider**

   ```bash
   cd cms && pnpm add @strapi/provider-upload-aws-s3
   ```
   - Supabase Storage is S3-compatible.
   - Configure in `cms/config/plugins.ts`:
     ```ts
     export default ({ env }) => ({
       upload: {
         config: {
           provider: "aws-s3",
           providerOptions: {
             s3Options: {
               credentials: {
                 accessKeyId: env("SUPABASE_S3_ACCESS_KEY"),
                 secretAccessKey: env("SUPABASE_S3_SECRET_KEY"),
               },
               endpoint: env("SUPABASE_S3_ENDPOINT"),
               region: env("SUPABASE_REGION", "ap-southeast-1"),
               params: {
                 Bucket: env("SUPABASE_S3_BUCKET", "strapi-uploads"),
               },
               forcePathStyle: true,
             },
           },
         },
       },
     });
     ```

4. **Update Next.js image config**
   - In each frontend's `next.config.ts` (`frontend-gateway`,
     `frontend-motorsport`, `frontend-horsesport`), add the Supabase Storage
     hostname to `remotePatterns`:
     ```ts
     remotePatterns: [
       ...strapiImagePattern(),
       {
         protocol: 'https',
         hostname: '<project-ref>.supabase.co',
         pathname: '/storage/**',
       },
     ],
     ```

#### Post-deployment verification checklist

After deploying all four services (Strapi + 3 frontends), verify:

| Check                      | Gateway (`sarga.co`)     | Motorsport (`motorsport.sarga.co`) | Horse Sport (`horsesport.sarga.co`) |
| -------------------------- | ------------------------ | ---------------------------------- | ----------------------------------- |
| Homepage loads             | ☐                        | ☐                                  | ☐                                   |
| About page                 | ☐                        | -                                  | ☐                                   |
| Ecosystem / listing pages  | ☐                        | ☐                                  | ☐ (events/news/gallery)             |
| News page                  | ☐                        | ☐                                  | ☐                                   |
| CMS content fetches        | ☐                        | ☐                                  | ☐                                   |
| Images render (next/image) | ☐                        | ☐                                  | ☐                                   |
| Cross-site links work      | ☐ → MS/HS                | ☐ → GW/HS                          | ☐ → GW/MS                           |
| Forms submit               | ☐                        | ☐                                  | ☐ (inquiry `sourceSite=horsesport`) |
| Ticket CTA → partner URL   | -                        | ☐                                  | ☐                                   |
| SSL/HTTPS active           | ☐                        | ☐                                  | ☐                                   |
| Lighthouse score ≥ 85      | ☐                        | ☐                                  | ☐                                   |
| Strapi admin accessible    | ☐ (`cms.sarga.co/admin`) | -                                  | -                                   |
| API tokens working         | ☐                        | ☐                                  | ☐                                   |
| Media uploads work in CMS  | ☐                        | -                                  | -                                   |

### Option B: Docker Compose on VPS

- Deploy the full stack on a single VPS using Docker Compose.
- Use a reverse proxy (Caddy, nginx, Traefik) for HTTPS and domain routing.
- Suitable for staging or low-traffic production.

### Option C: Kubernetes

- For high-availability, multi-region deployments.
- Use managed Kubernetes (GKE, EKS, AKS) with Strapi and frontends as separate deployments.
- Requires more operational overhead.

### Domain routing

| Domain                                 | Target                              |
| -------------------------------------- | ----------------------------------- |
| `sarga.co`                             | Gateway frontend                    |
| `motorsport.sarga.co` or `ms.sarga.co` | Motorsport frontend                 |
| `horsesport.sarga.co`                  | Horse Sport frontend                |
| `cms.sarga.co` or `admin.sarga.co`     | Strapi admin                        |
| `api.sarga.co`                         | Strapi API (optional, if separated) |

### Production checklist

1. Replace all `change_me_*` secrets with strong, unique values.
2. Set `SEED_DEMO_CONTENT=false`.
3. Import the approved encrypted CMS snapshot using
   `docs/15_strapi_content_media_promotion.md`; verify checksum, source commit,
   collection counts, relations, and all uploaded media.
4. Create or verify Strapi admin accounts and strong passwords.
5. Create least-privilege API tokens for each frontend.
6. Confirm local uploads are included in the paired backup policy; migrate to
   S3-compatible storage only after separate approval.
7. Enable HTTPS on all domains.
8. Set up PostgreSQL and uploads backups (daily minimum).
9. Configure a CDN only if approved for frontend static assets and media.
10. Set `FORM_SUBMISSION_MODE=strapi` with a create-permission token (Horse Sport
    contact form persists to `inquiry-submissions`).
11. Test all cross-site links (gateway ↔ motorsport ↔ horse sport).
12. Configure `TICKETING_EMBED_ALLOWLIST` / `TICKETING_DEEP_LINK_SCHEMES` only if
    partner embeds/deep links are used (empty = redirect-only).

## CMS maintenance notes

### Content ownership

- **Gateway content** (`siteScope: gateway`): managed via Strapi admin, rendered only on sarga.co.
- **Motorsport content** (`siteScope: motorsport`): managed via Strapi admin, rendered only on the motorsport site.
- **Horse Sport content** (`siteScope: horsesport`): managed via Strapi admin, rendered only on the horse sport site. Events use the `business` relation and news use `relatedBusinesses` set to `sarga-horse-sport`.
- **Shared content** (`siteScope: shared`): can appear on multiple sites with each site's own design.
- **Cross-site teasers:** events/news can have `showOnGateway` / `showOnMotorsport` / `showOnHorseSport` flags for teaser appearances on other sites.
- Horse Sport editorial detail: [`docs/horsesport/08`](horsesport/08_horsesport_deployment_handover.md) §3.

### Admin roles and account provisioning

- Managed role codes are `sarga-gateway-admin`, `sarga-motorsport-admin`,
  `sarga-horsesport-admin`, and `sarga-shared-admin`. Each sees one custom
  workspace and records matching only its assigned `siteScope`.
- Super Admin sees all four workspaces and remains the only supported cross-site
  administrator. Do not assign more than one managed site role to an account.
- Roles and their managed permissions synchronize at every Strapi startup.
- To create a dedicated user, temporarily provide the matching
  `CMS_<SITE>_ADMIN_EMAIL/PASSWORD` pair from the secret store, start Strapi,
  confirm login/access, then remove the pair. Never commit credentials. Existing
  users are not reassigned or password-reset automatically.
- The Media Library remains a shared asset pool. Managed site roles can
  view/upload/download/copy assets but do not receive the combined asset
  update/delete permission; use site-named folders.

### Content types

| Content type       | Scope field | Key fields                                                                      |
| ------------------ | ----------- | ------------------------------------------------------------------------------- |
| News Article       | `siteScope` | title, slug, excerpt, body, category, heroImage                                 |
| Event              | `siteScope` | title, slug, date, venue, status, racingCategory, ticketCtas                    |
| Ticket CTA         | `siteScope` | label, provider, ctaType (redirect/deepLink/embed), url, embedUrl, relatedEvent |
| Inquiry Submission | -           | name, email, inquiryType, message, `sourceSite`, submittedAt, status            |
| Partner            | `siteScope` | name, logo, website, partnershipType                                            |
| Media Gallery      | `siteScope` | title, images                                                                   |
| Ecosystem Business | `siteScope` | name, slug, description, logo, website                                          |
| Site               | -           | name, slug, url (for cross-site configuration)                                  |

### Content sync rules

- Content is authored **once** in the shared CMS.
- No manual duplication between gateway, motorsport, and horse sport.
- Site scope filters determine where content appears.
- When adding new content, always set `siteScope` explicitly (and the business
  relation for horse sport events/news).
- Motorsport/Horse Sport events/news with `showOnGateway: true` appear as teasers
  on the gateway, deep-linking to the dedicated site when canonical.

### Backup and restore

- **Database:** daily PostgreSQL backup, 30-day retention.
- **Media:** S3 versioning or scheduled backup of uploads directory.
- **Restore:** `docker compose down -v` to reset locally, then restore from backup.

## CI/CD recommendation

### Frontend

- GitHub/GitLab repository
- Pull request review
- Automatic build preview
- Deployment to staging on merge to `develop`
- Deployment to production on tagged release or merge to `main`

### Strapi

- Repository-managed Strapi source code
- Environment-based configuration
- Migration/content type changes committed
- Production deployment by CI/CD or documented manual command

## Backup recommendation

- Daily PostgreSQL backup
- Object storage versioning or scheduled backup
- Backup retention: minimum 14–30 days
- Restore test before go-live if possible

## Monitoring recommendation

- Uptime monitoring for frontend and CMS
- Error tracking for frontend and backend
- Analytics dashboard
- Server/storage usage monitoring
- Form submission monitoring

## Handover deliverables

Vendor/developer must hand over:

- [x] Source code repository (single repo with gateway, motorsport, horse sport, CMS)
- [x] Repository access (Git remote, branch protection rules)
- [x] Production deployment credentials or owner transfer
- [x] Strapi admin credentials (first admin account)
- [x] Environment variable inventory (this document + `.env.example`)
- [x] Deployment guide (this document + `docs/13_local_docker_deployment.md`)
- [x] Admin/user guide for content updates (CMS maintenance notes above)
- [x] Architecture documentation (`docs/06_technical_architecture.md`)
- [x] Content model documentation (`docs/05_content_model_strapi.md`, `strapi/content-types.json`)
- [x] Backup/restore guide (this document - backup section)
- [x] Maintenance and support SLA (this document - hypercare + maintenance)
- [x] Known issues list (Phase 9 UAT notes in `docs/PHASE_PROGRESS.md`)
- [x] Future enhancement backlog (deferred items noted across phase logs)
- [x] UAT checklists (`checklists/motorsport/motorsport_uat_checklist.md`, `checklists/horsesport/horsesport_uat_checklist.md`)
- [x] Horse Sport deployment/handover guide (`docs/horsesport/08_horsesport_deployment_handover.md`)
- [x] Go-live checklist (`checklists/go_live_checklist.md`)

## Hypercare

### Duration

3 months after go-live.

### Coverage

- Production error handling
- Slow page loading investigation
- Form submission failure
- Broken CTA/link
- CMS publishing issue
- Critical layout bug
- Minor content rendering issue

### Suggested SLA

| Severity | Example                              |        Response |    Resolution target |
| -------- | ------------------------------------ | --------------: | -------------------: |
| Critical | Website down, major page unavailable |         2 hours |       1 business day |
| High     | Contact/ticket CTA broken            |         4 hours |    1–2 business days |
| Medium   | Layout/content issue                 |  1 business day |      3 business days |
| Low      | Minor visual issue                   | 2 business days | Next planned release |

## Maintenance

### Duration

1 year after hypercare.

### Included scope

- Bug fixing
- Minor security updates
- Dependency updates
- CMS support
- Minor content rendering fixes
- Monitoring review
- Backup check

### Excluded unless separately agreed

- New major feature
- Internal ticketing engine
- Payment gateway
- User account system
- Major design redesign
- Complex third-party integration
- Large content migration
- CRM implementation

## Repository rules during maintenance

- Every fix/update must be committed to the handed-over repository.
- No production hotfix should remain outside repository history.
- Changes must include clear commit messages.
- Environment changes must be documented.

## Local deployment handover

The vendor/developer must hand over a working local development setup. See the **Local development setup** section above for the full step-by-step guide.

Minimum handover requirement:

- [x] `docker-compose.yml` runs PostgreSQL and optional containerized apps.
- [x] PostgreSQL is reachable from the host on port `5435`.
- [x] `.env.example` documents all required local environment variables.
- [x] `README.md` includes local startup instructions.
- [x] Strapi uses PostgreSQL locally, not SQLite.
- [x] All three frontends can reach Strapi from browser and server-side runtime.
- [x] Seed script (`SEED_DEMO_CONTENT=true`) populates demo content automatically.
