# Repository Restructure Plan

## Current relevant structure

```text
sarga-website/
├── frontend/
├── cms/
├── docker/
├── docker-compose.yml
├── docs/
├── prompts/
├── reference/
├── assets/
└── checklists/
```

## Target structure

```text
sarga-website/
├── frontend-gateway/
├── frontend-motorsport/
├── cms/
├── docker/
│   ├── frontend-gateway.Dockerfile
│   ├── frontend-motorsport.Dockerfile
│   └── strapi.Dockerfile
├── docker-compose.yml
├── docs/
│   ├── multisite/
│   └── motorsport/
├── prompts/
│   └── motorsport/
├── assets/
│   └── brand/
│       ├── logos/
│       └── motorsport/
├── reference/
└── checklists/
```

## Phase 1 migration steps

1. Confirm current `frontend/` is the Sarga.co gateway app.
2. Rename `frontend/` to `frontend-gateway/`.
3. Update root README references from `frontend` to `frontend-gateway`.
4. Update Docker Compose service names.
5. Replace `docker/frontend.Dockerfile` with `docker/frontend-gateway.Dockerfile`, or keep a parameterized Dockerfile if the team prefers.
6. Add `frontend-motorsport/` as a new Next.js app using the same stack.
7. Copy shared environment variable examples.
8. Ensure both frontends can consume Strapi through separate public env names if needed.
9. Ensure local ports are:
   - Gateway: `3000`
   - Motorsport: `3001`
   - Strapi: `1337`
   - PostgreSQL host: `5435`
10. Run both apps locally and verify no route, port, or package lock conflict.

## Git safety guidance

Before restructuring:

```bash
git status
git checkout -b feat/multisite-motorsport
```

Then perform the rename with Git-aware move:

```bash
git mv frontend frontend-gateway
```

After completing Phase 1:

```bash
git status
docker compose config
docker compose up -d postgres   # default local model: DB in Docker, apps on host
```

## Acceptance criteria

- `frontend-gateway/` runs exactly like the old gateway frontend.
- `frontend-motorsport/` exists and starts independently on port `3001`.
- CMS remains under `cms/` and starts normally.
- Docker Compose starts all local services.
- No references to old `frontend/` remain except in migration notes.
