# Sarga Motorsport Gallery — CMS ↔ Frontend Audit

Status: Phase A/B/C complete — 2026-08-29

Route: `/gallery` and `/{locale}/gallery`

Frontend entry: `frontend-motorsport/src/app/gallery/page.tsx`

Primary CMS source: `api::motorsport-gallery-page.motorsport-gallery-page`

Supporting CMS source: Media Gallery collection.

## Mapping

| Frontend Section | Frontend Element | CMS Section | CMS Field | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| Page metadata | Title, description, social metadata | Gallery single type + SEO | `title`, hero fields, `seo.*` | Partially wired | The route exports static metadata; dedicated SEO is not consumed. Fix in Phase B. |
| Routing/governance | Canonical path and ownership | Gallery single type | `routePath`, `routeAliases`, `siteScope` | Active/infrastructure | Alias redirects remain a documented lifecycle gap. |
| Availability | Coming Soon state | Page Availability | all fields | Active | Controls the disabled-page experience. |
| Hero | Kicker/title/description/background | Page Hero | copy/media/show flags | Active | Passed to `PageHero`. |
| Hero metrics | Frames, format, scope | Page Hero → Metric Group Item | `showMetricGroup`, `metrics[]` | Active with fallback | Count is derived from the current filtered gallery page; labels/values can be CMS-provided. |
| Information band | Editorial copy and metrics | Page Information Band | copy, show flags, `metrics[]` | Active | Shared information-band adapter renders the values. |
| Archive heading | Eyebrow/title | Archive Section | `eyebrow`, `title`, `showEyebrow`, `showTitle` | Active | Rendered above the archive. |
| Archive guidance | Support label/body | Archive Section | `supportLabel`, `supportBody`/`body`, `showBody` | Active | Support body is preferred, then body, then fallback copy. |
| Archive images | Gallery cards/viewer | Media Gallery collection | gallery title/category/mediaItems and media alt text | Active | Filter, pagination, categories, and viewer are collection-backed. |
| Generic section fields | Section media/CTA/items/theme | Archive Section | `media`, `cta*`, `items`, `theme` | Not wired | The gallery archive has its own collection-backed viewer and no section CTA. Shared fields remain until the common component matrix is complete. |
| Fallback content | Placeholder images/copy | Frontend fallback constants | no CMS field | Fallback only | Used only when local CMS content is unavailable and not in preview. |

## Changes planned for Phase B

- Wire the dedicated SEO component to `createMetadata()`.
- Remove the unused `GALLERY_PAGE_SIZE` constant.
- Add Gallery single-type help text.

No staging environment, remote CMS, or destructive migration was touched.

## Changes made

- Gallery metadata now consumes the dedicated SEO component.
- Removed the unused page-size constant.
- Added Gallery single-type help text.

## Validation result

- Motorsport typecheck passed.
- CMS TypeScript check and JSON schema validation passed.
- No staging environment or remote CMS was touched.
