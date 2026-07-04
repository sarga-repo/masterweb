# Strapi services

All public CMS reads and protected CMS writes are centralized in this folder.
React components must consume the typed service modules rather than calling
Strapi directly.

- `client.ts` is server-only and owns authentication, error handling, media URL
  normalization, and safe `null` results when Strapi is unavailable.
- `homepage.ts`, `ecosystem.ts`, `news.ts`, and `events.ts` map Strapi v5 API
  responses into stable frontend view models.
- `forms.ts` provides the server-only transport used by the validated form
  handlers implemented in Phase 6.
- `types.ts` contains both reusable view models and raw Strapi response shapes.

When no CMS URL is configured, or a request fails, content services return the
typed fallback data from `src/lib/mock-data.ts`. `STRAPI_API_TOKEN` is read only
inside the server-only client and must never use a `NEXT_PUBLIC_` prefix.
