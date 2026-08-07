# 01 — Repository Restructure

Execute this phase only.

Tasks:

1. Read `docs/multisite/02_repository_restructure_plan.md`.
2. Rename existing `frontend/` to `frontend-gateway/` using Git-aware move if possible.
3. Update references in README, Docker Compose, Dockerfiles, and scripts.
4. Prepare placeholder folder `frontend-motorsport/` but do not fully implement pages yet.
5. Ensure `cms/` remains unchanged except for documentation references.
6. Update Docker Compose service names:
   - `frontend-gateway`
   - `frontend-motorsport`
   - `strapi`
   - `postgres`
7. Gateway must still run on `localhost:3000`.
8. Motorsport placeholder must run on `localhost:3001` once bootstrapped.
9. PostgreSQL host port must remain `5435`.

Acceptance criteria:

- No stale runtime references to old `frontend/` path.
- Gateway app still builds/runs.
- Docker Compose config is valid.
- Summary includes exact files changed and how to test.

Do not continue to the next phase.
