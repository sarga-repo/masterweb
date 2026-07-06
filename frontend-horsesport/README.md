# frontend-horsesport

Dedicated **Sarga Horse Sport** website (Next.js + TypeScript + Tailwind CSS v4),
consuming the shared Strapi CMS under `cms/`.

> **Status: scaffolded (Phase 1).** The app builds and runs independently on
> port 3002 with the Horse Sport brand tokens and a labelled placeholder
> homepage. The app shell (Phase 3), full design system (Phase 4), homepage
> (Phase 5), and pages (Phase 6) come next. See
> `docs/horsesport/06_horsesport_implementation_plan.md`.

## Local development

The shared Postgres runs in Docker; Strapi and this app run on the host.

```bash
# from the repo root: start the database + shared CMS first
docker compose up -d postgres
cd cms && pnpm develop            # Strapi → http://localhost:1337

# this app
cd frontend-horsesport
pnpm install
pnpm dev                          # → http://localhost:3002
```

Environment (`.env.local`, gitignored):

- `STRAPI_API_URL` / `NEXT_PUBLIC_STRAPI_API_URL` - shared CMS base URLs
- `STRAPI_API_TOKEN` - server-only read token (blank locally; seed grants public read)
- `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GATEWAY_SITE_URL`,
  `NEXT_PUBLIC_MOTORSPORT_SITE_URL`, `NEXT_PUBLIC_SITE_KEY`

For production sharing previews (WhatsApp, LinkedIn, X, etc.), set
`NEXT_PUBLIC_SITE_URL` to the live public domain so Open Graph images and
canonical URLs resolve correctly.

## Ports

- Horse Sport frontend: `http://localhost:3002` (host and container)
- Strapi CMS: `http://localhost:1337`
- PostgreSQL (host): `localhost:5435`

## Brand

Follows the Sarga Horse Sport brand - a premium, cinematic, equestrian visual
system distinct from both the Sarga.co gateway and the Motorsport site. Primary
reference is page 7 of `reference/source-pdfs/sarga_website_preview.pdf`. See
`docs/horsesport/` and `.agents/skills/`. Logos live in `public/brand/`.
