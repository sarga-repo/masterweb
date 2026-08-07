# Phase 1 — Add Horse Sport Frontend and Repo Structure

Read `AGENTS.md`, `README.md`, and all documents in `docs/horsesport/` before coding.

Task:

Add the new dedicated Horse Sport frontend while keeping the existing gateway and Motorsport frontends working.

Required changes:

- Create `frontend-horsesport/` using the same Next.js + TypeScript + Tailwind setup pattern as the other frontends.
- Add `docker/frontend-horsesport.Dockerfile`.
- Update `docker-compose.yml` with `frontend-horsesport` on host port `3002`.
- Update `.env.example` with Horse Sport URLs and site key.
- Update root `README.md` and `docs/13_local_docker_deployment.md`.
- Copy Horse Sport logos from `assets/brand/horsesport/logos/` into `frontend-horsesport/public/brand/`.
- Do not modify Motorsport design or gateway design except cross-site config references.
- Update `docs/PHASE_PROGRESS.md`.

Stop after this phase and summarize how to run all three frontends locally.
