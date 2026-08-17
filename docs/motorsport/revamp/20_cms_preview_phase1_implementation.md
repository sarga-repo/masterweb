# Motorsport CMS Preview Phase 1 Implementation

## Document status

- Phase: 1 - secure centralized route resolution
- Status: Implemented
- Date: 2026-08-15
- Scope: Motorsport CMS Preview foundation and approved UID route resolution
- CMS: Strapi 5.49.0
- Frontend: Next.js App Router

## What changed

### Centralized CMS resolver

`cms/src/preview/preview-path.ts` now owns the approved Motorsport Preview UID
list, locale/status normalization, site-scope checks, slug validation, canonical
route mapping, and parent-program route resolution.

Approved UIDs now include:

- News Article
- Site Page
- Event
- Site
- Partner
- Media Gallery
- Merchandise Item
- Ticket CTA
- Top Navigation Item
- Motorsport Program
- Motorsport Rider
- Motorsport Standing
- Motorsport Regulation
- Leadership Person

IJTC relation-owned records populate their parent program before route resolution:

- Rider -> `/events/{program}/riders/{riderSlug}`
- Standing -> `/events/indonesia-junior-talent-cup/standings`
- Regulation -> `/events/indonesia-junior-talent-cup/regulation`

Rallycross and IJTC Site Page routes use canonical `/events/...` paths. Campaign
aliases remain rejected as Preview destinations.

### Strapi Preview handler

`cms/config/admin.ts` now:

- Uses the centralized approved UID resolver.
- Rejects unsupported UID, invalid locale, invalid status, missing secret,
  missing document ID, invalid origin, unavailable Strapi instance, failed
  document lookup, and unsafe/unmapped documents.
- Populates `program` for relation-owned IJTC records.
- Passes normalized locale and draft/published status into document reads.
- Generates Preview URLs only under the configured Preview origin.
- Keeps Preview secrets server-side.

### Origin policy

CMS accepts comma-separated `PREVIEW_ALLOWED_ORIGINS` values. Values must be
explicit HTTP(S) origins without credentials, paths, query strings, or hashes.

Frontend framing and request-origin checks use:

- `PREVIEW_ADMIN_ORIGINS`, preferred for multiple CMS admin origins.
- `CMS_ADMIN_ORIGIN`, retained as fallback.

Invalid origin values are ignored by parsing and cannot become allowlist entries.

### Frontend Preview route

`frontend-motorsport/src/app/api/preview/route.ts` now:

- Compares secrets using SHA-256 digests and `timingSafeEqual`.
- Accepts only `draft` or `published` status.
- Accepts only allowlisted Motorsport paths.
- Accepts configured CMS origin headers/referers when present.
- Enables Draft Mode only for draft status.
- Disables Draft Mode for published status.
- Returns `401` with `Cache-Control: no-store` for invalid requests.
- Never logs the secret or full query string.

### Draft-aware Strapi reads

Draft reads now require `STRAPI_API_TOKEN`. Preview requests use
`status=draft`, `cache: "no-store"`, and server-only authorization. A `401`
draft response never retries without credentials. Published, non-preview reads
retain existing public-permission retry behavior.

### CSP

`next.config.ts` emits `frame-ancestors` for the configured CMS admin origins.
Wildcard framing is not used.

## Environment contract

CMS runtime:

```text
PREVIEW_ENABLED=false
CLIENT_URL=http://localhost:3001
PREVIEW_URL=http://localhost:3001
PREVIEW_SECRET=<same server-side secret as frontend>
PREVIEW_ALLOWED_ORIGINS=http://localhost:3001
```

Motorsport frontend runtime:

```text
PREVIEW_SECRET=<same server-side secret as CMS>
CMS_ADMIN_ORIGIN=http://localhost:1337
PREVIEW_ADMIN_ORIGINS=http://localhost:1337
STRAPI_API_TOKEN=<server-only read token with draft read permission>
```

Never expose `PREVIEW_SECRET` or `STRAPI_API_TOKEN` through `NEXT_PUBLIC_*`
variables or client components.

## Tests added

CMS:

- Eight resolver/origin tests in `cms/src/preview/preview-path.test.ts` and
  `cms/src/preview/preview-origin.test.ts`.
- Coverage includes approved UID families, canonical routes, IJTC relation
  resolution, locale, status, site scope, unsafe slugs, unsupported UIDs, and
  exact origin matching.

Frontend:

- Five preview path/origin tests in
  `frontend-motorsport/src/lib/preview/preview-path.test.ts` and
  `frontend-motorsport/src/lib/preview/preview-origin.test.ts`.
- Coverage includes localized destinations, IJTC child paths, unsafe paths,
  invalid status, absent origin headers, allowed CMS referers, and foreign
  origins.

## Verification

- CMS Preview tests: 8/8 passed.
- Motorsport Preview tests: 5/5 passed.
- CMS TypeScript check passed.
- CMS production build passed.
- Motorsport TypeScript check passed.
- Motorsport ESLint passed.
- Motorsport production build passed.
- Frontend Preview formatting check passed.
- `git diff --check` passed.

## Known limitations

- Browser-level Strapi Content Manager Preview-button UAT remains Phase 6 work.
- Relation propagation across all aggregate consumers remains Phase 2/3 work.
- Draft Mode now intentionally requires a server-only Strapi token; local
  Preview without `STRAPI_API_TOKEN` returns fallback/null data instead of
  attempting an unauthenticated draft read.
- CMS test execution emits Node experimental type-stripping and module-type
  warnings; tests still pass.
- Gateway and Horse Sport Preview remain out of scope.
