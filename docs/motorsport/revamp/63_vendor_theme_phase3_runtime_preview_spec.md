# MSR-THEME-3 — Theme runtime, Preview, and live resolution

Status: Completed 2026-08-16  
Scope: Motorsport frontend data adapter, root theme attribute, and caching.

## Runtime contract

The frontend resolves the published Motorsport preset for live routes and
applies an allowlisted root attribute such as `data-ms-theme` before page
content renders. During an unrelated content Preview, the global theme
setting remains on its published value so an editor's page draft cannot
silently change the whole site. Missing or invalid settings fall back to
`current-motorsport`.

Theme changes must participate in the existing publish/revalidation flow. A
draft theme must never leak into the public route, and a published theme must
not remain hidden behind stale cache after revalidation.

## Exit criteria

- Live routes resolve the published preset; page Preview keeps the published
  global preset unless the theme setting is changed and published.
- Invalid/missing settings produce the current theme without a blank page.
- EN and ID routes use the same non-localized preset.

## Completion record

- Added a server-side Motorsport theme adapter with safe fallback to
  `current-motorsport`.
- Applied the resolved allowlisted value as `data-ms-theme` on the root HTML
  element, so Preview and live rendering share one deterministic contract.
- The existing Strapi Single Type client continues to use draft status and
  no-store for exact page Preview requests, while published routes remain
  cached. The non-localized global theme setting is intentionally resolved as
  published during other page previews.
- Stale or expired Draft Mode cookies without a verifiable preview context are
  treated as published reads instead of raising a 500. Theme settings also use
  a result-based adapter with a stable `current-motorsport` fallback, so a
  temporary preview permission/read failure cannot blank the public shell.
- The frontend development route cache must be rebuilt after route changes;
  clearing the generated `.next` volume restored the API routes used by
  revalidation and Preview exit (`/api/revalidate` and `/api/preview/exit`).
- Validation: CMS API returned the seeded theme setting, the Motorsport
  frontend emitted `data-ms-theme="theme-current-motorsport"`, and frontend
  TypeScript/build checks passed.
