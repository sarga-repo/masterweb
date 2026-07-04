# frontend-motorsport

Dedicated **Sarga Motorsport** website (Next.js + TypeScript + Tailwind CSS v4),
consuming the shared Strapi CMS under `cms/`.

> **Status: bootstrapped (Phase 3).** Base app shell, motorsport design tokens,
> environment wiring, and an on-brand placeholder homepage are in place. The full
> design-system components (Phase 4) and pages (Phase 6) come next.

## Local development

The shared Postgres runs in Docker; Strapi and this app run on the host.

```bash
# from the repo root: start the database + shared CMS first
docker compose up -d postgres
cd cms && pnpm develop            # Strapi → http://localhost:1337

# this app
cd frontend-motorsport
pnpm install
pnpm dev                          # → http://localhost:3001
```

Environment (`.env.local`, gitignored):

- `STRAPI_API_URL` / `NEXT_PUBLIC_STRAPI_API_URL` — shared CMS base URLs
- `STRAPI_API_TOKEN` — server-only read token (blank locally; seed grants public read)
- `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GATEWAY_SITE_URL`, `NEXT_PUBLIC_SITE_KEY`

## Ports

- Motorsport frontend: `http://localhost:3001` (host and container)
- Strapi CMS: `http://localhost:1337`
- PostgreSQL (host): `localhost:5435`

## Brand

Follows the Sarga Motorsport brand playbook — a distinct premium, dark, kinetic
visual system, **not** the Sarga.co gateway design. See `docs/motorsport/` and
`.agents/skills/`. Logos live in `public/brand/`.
