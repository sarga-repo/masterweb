# Codex Prompt 08 — Deployment and Handover

Task: prepare deployment and handover documentation.

Requirements:
- Add `DEPLOYMENT.md`.
- Add `.env.example`.
- Add production deployment instructions for:
  - Frontend
  - Strapi
  - PostgreSQL
  - Media storage
- Add backup/restore notes.
- Add handover checklist.
- Add maintenance notes.
- Add source code ownership note.
- Add troubleshooting section.

Acceptance criteria:
- A new developer can deploy staging from docs.
- Environment variables are documented.
- Handover checklist covers repo, admin, credentials, deployment, CMS guide, and maintenance.


Local Docker handover requirement:

- Verify local Docker Compose can run the full stack: frontend, Strapi, and PostgreSQL.
- Document startup, shutdown, database reset, and service URLs.
- PostgreSQL must remain exposed on host port `5435`.
- Include any limitations for local Docker development in the handover notes.
