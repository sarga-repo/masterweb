# Local Docker Deployment Specification

Local development uses **Docker for PostgreSQL only**. Strapi and all three
frontends run directly on the host for fast iteration. The full containerized
stack remains available on demand via the Compose `apps` profile (see below).

## Local services

| Service               | Purpose                | Runs in     | Container port | Host port |
| --------------------- | ---------------------- | ----------- | -------------: | --------: |
| `postgres`            | Strapi database        | Docker      |         `5432` |    `5435` |
| `strapi`              | CMS/admin/API          | Host (pnpm) |         `1337` |    `1337` |
| `frontend-gateway`    | Sarga.co gateway       | Host (pnpm) |         `3000` |    `3000` |
| `frontend-motorsport` | Sarga Motorsport site  | Host (pnpm) |         `3001` |    `3001` |
| `frontend-horsesport` | Sarga Horse Sport site | Host (pnpm) |         `3002` |    `3002` |

PostgreSQL must be exposed on host port `5435` to avoid conflict with an existing local PostgreSQL instance on `5432`.

## Expected project layout

```text
sarga-website/
├── frontend-gateway/     # Sarga.co gateway (Next.js)
├── frontend-motorsport/  # Sarga Motorsport (Next.js)
├── frontend-horsesport/  # Sarga Horse Sport (Next.js) — scaffolded in Horse Sport Phase 1
├── cms/                  # Strapi application
├── docker/
│   ├── frontend-gateway.Dockerfile
│   ├── frontend-motorsport.Dockerfile
│   ├── frontend-horsesport.Dockerfile
│   └── strapi.Dockerfile
├── docker-compose.yml
├── .env.example
└── .env               # created locally, never committed
```

## Local startup (default: Postgres in Docker, apps on host)

```bash
cp .env.example .env

# 1. Database only (host port 5435)
docker compose up -d postgres

# 2. Strapi on the host (cms/.env targets localhost:5435; see cms/.env.example)
cd cms && pnpm install && pnpm develop

# 3. Gateway on the host (port 3000)
cd frontend-gateway && pnpm install && pnpm dev

# 4. Motorsport on the host (port 3001)
cd frontend-motorsport && pnpm install && pnpm dev

# 5. Horse Sport on the host (port 3002)
cd frontend-horsesport && pnpm install && pnpm dev
```

Then open:

- Gateway frontend: `http://localhost:3000`
- Motorsport frontend: `http://localhost:3001`
- Horse Sport frontend: `http://localhost:3002`
- Strapi admin: `http://localhost:1337/admin`
- PostgreSQL from host tools: `localhost:5435`

For local hero-video authoring, upload a short MP4/WebM plus poster through the
Strapi Media Library and attach the Hero Video component to the appropriate home
record. These files live in `cms/public/uploads`; keep them with the database
when backing up or moving the local content snapshot. Use the repository Horse
Sport loop only as frontend fallback/test evidence, not as a production CMS
asset.

## Optional: full containerized stack

To run Strapi and all three frontends in Docker as well (e.g. for a clean-room
check), use the `apps` profile:

```bash
docker compose --profile apps up --build
```

This starts `postgres`, `strapi`, `frontend-gateway` (3000),
`frontend-motorsport` (3001), and `frontend-horsesport` (3002) as containers.

The Strapi service keeps `/app/node_modules` in a named volume. After a CMS
dependency/lockfile change, an image rebuild alone does not replace an existing
dependency volume. Refresh it in place and restart Strapi:

```bash
docker compose --profile apps exec -T -e CI=true strapi pnpm install --frozen-lockfile
docker compose --profile apps restart strapi
```

Do not remove database or uploads volumes just to refresh dependencies.

## Local outbound email

The Exchange Online transport is included in Strapi but
`MAIL_ENABLED=false` by default in both host and Compose workflows. Normal
local development must leave it disabled; form submissions continue to be
stored according to their existing mode and this phase does not send
notifications.

`MAIL_NOTIFICATIONS_ENABLED` is a second, independent safety switch and also
defaults to false. Enabling it requires all three fixed site recipient
allowlists and a working MAIL-2 transport; incomplete configuration stops
Strapi rather than silently routing to a fallback recipient. Local newsletter
records never trigger Exchange email.

`MAIL_AUTH_MODE=oauth` is the local default. Do not enable the MAIL-4.1 Basic
compatibility mode locally or copy the production mailbox password, Entra
client secret, or access token into the repository or a shared developer
`.env`. If Sarga IT authorizes a temporary staging-only credential check, use
the protected staging runtime environment and run:

```bash
pnpm --dir cms mail:verify
```

The command performs SMTP authentication for the selected mode without
submitting an email. See
[`docs/strapi-admin-menu/12_gwr_cms_mail_2_oauth_transport_spec.md`](strapi-admin-menu/12_gwr_cms_mail_2_oauth_transport_spec.md)
for the target OAuth configuration, or
[`docs/strapi-admin-menu/15_gwr_cms_mail_4_1_temporary_basic_auth_fallback.md`](strapi-admin-menu/15_gwr_cms_mail_4_1_temporary_basic_auth_fallback.md)
for the time-boxed launch contingency.

## Database connection values for local tools

```text
Host: localhost
Port: 5435
Database: sarga_strapi
Username: sarga
Password: sarga_local_password
```

Inside Docker containers, Strapi must connect to PostgreSQL using:

```text
DATABASE_HOST=postgres
DATABASE_PORT=5432
```

## Codex implementation requirements

When creating the project, Codex must:

1. Keep the Next.js apps under `frontend-gateway/`, `frontend-motorsport/`, and `frontend-horsesport/`.
2. Create the Strapi project under `cms/`.
3. Keep `docker-compose.yml`, `docker/frontend-gateway.Dockerfile`, `docker/frontend-motorsport.Dockerfile`, `docker/frontend-horsesport.Dockerfile`, and `docker/strapi.Dockerfile` compatible with those folders.
4. Ensure Strapi uses PostgreSQL locally, not SQLite.
5. Ensure each frontend can call Strapi through:
   - `NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337` from the browser (media/image URLs).
   - `STRAPI_API_URL` for server-side content fetching. In Docker Compose this is
     `http://strapi:1337`; for local (non-Docker) development it is `http://localhost:1337`.
   - `STRAPI_API_URL_INTERNAL=http://strapi:1337` is retained as a fallback for existing setups.
   - `STRAPI_API_TOKEN` is a server-only read token; when blank the frontend uses bundled mock content.
6. Never commit the real `.env` file.
7. Document any new environment variables in `.env.example` and README.

## Per-app environment files (host workflow)

Each host-run frontend reads its own gitignored `.env.local`. For the gateway,
`frontend-gateway/.env.local`:

```env
STRAPI_API_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337
STRAPI_API_TOKEN=
```

The motorsport app uses the equivalent `frontend-motorsport/.env.local` once it
is bootstrapped in Phase 3 (it additionally points at the gateway via
`NEXT_PUBLIC_GATEWAY_SITE_URL=http://localhost:3000`).

Both frontends target the same host Strapi at `http://localhost:1337`. When you
instead run the containerized `apps` profile, Compose overrides the server-side
URL to `http://strapi:1337` automatically.

### Phase 6 form and ticket configuration

The host-run frontend defaults to a non-retaining form placeholder in
development. Set `FORM_SUBMISSION_MODE=strapi` and provide a server-only token
with create permission for `inquiry-submissions` and
`newsletter-subscriptions` before production use. Optional reCAPTCHA
verification uses `RECAPTCHA_SECRET_KEY`; an approved client token adapter is
required before enabling it.

Ticket redirects accept HTTPS URLs. Custom app schemes must be listed in
`TICKETING_DEEP_LINK_SCHEMES`, and optional partner iframe hosts must be listed
in `TICKETING_EMBED_ALLOWLIST`. Embed HTML is never rendered directly.

## Local demo content seeding

With `SEED_DEMO_CONTENT=true` (the local default), Strapi's bootstrap
(`cms/src/seed.ts`) performs an idempotent seed on startup:

- Publishes demo Homepage, Ecosystem Business, News Article, and Event records
  mirroring the frontend mock fallback content.
- Grants the users-permissions **public role** read access (`find`/`findOne`)
  to those content endpoints so the frontend can fetch without an API token
  during local development.
- Records are created only when the target content type is empty, so restarts
  never duplicate data. Committed files in `cms/data/seed-media/` are uploaded
  and attached idempotently where the seed manifest defines a relation.

Set `SEED_DEMO_CONTENT=false` for any shared, staging, or production
environment, and use a read-only API token for the frontend instead of public
permissions.

To copy the exact current local content and Media Library to staging, including
editorial changes made after the seed, follow
[`docs/15_strapi_content_media_promotion.md`](15_strapi_content_media_promotion.md).
Do not enable the demo seed on staging as a substitute for the transfer archive.

## Data persistence

The compose setup uses named volumes for local persistence:

- `sarga_postgres_data` for PostgreSQL data.
- `strapi_uploads` for uploaded media (used by the `apps` profile).
- `strapi_node_modules` to keep container dependencies separate from the host
  machine (used by the `apps` profile).

## Reset local database

Use this only when the local database can be safely deleted:

```bash
docker compose down -v
```

Then restart Postgres:

```bash
docker compose up -d postgres
```

## Production note

The provided Docker Compose configuration is for local development only. For staging/production, use managed PostgreSQL or a secured database service, real secrets, HTTPS, CDN, backups, and proper Strapi upload storage such as S3-compatible object storage.
