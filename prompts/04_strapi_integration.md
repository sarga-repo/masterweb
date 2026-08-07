# Codex Prompt 04 — Strapi Integration

Task: add Strapi CMS integration.

Requirements:
- Read `docs/05_content_model_strapi.md` and `strapi/content-types.json`.
- Create Strapi client in `src/lib/strapi/client.ts`.
- Add typed service modules:
  - homepage.ts
  - ecosystem.ts
  - news.ts
  - events.ts
  - forms.ts
- Use environment variables:
  - STRAPI_API_URL
  - STRAPI_API_TOKEN
- Implement safe fetch wrappers with error handling.
- Add TypeScript types for:
  - Homepage
  - EcosystemBusiness
  - NewsArticle
  - Event
  - SEO
- Add fallback behavior if CMS is unavailable in local development.
- Do not expose private tokens in client-side code.

Acceptance criteria:
- Frontend can fetch from Strapi server-side.
- Mock fallback still works.
- Types are clear and reusable.
- No token is exposed to browser bundle.


Local CMS/database requirement:

- Configure Strapi for PostgreSQL when running through Docker Compose.
- Use environment variables from `.env.example`.
- Do not hardcode database credentials.
- Confirm `postgres` service uses host port `5435` and container port `5432`.
