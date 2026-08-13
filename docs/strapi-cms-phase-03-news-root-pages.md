# Strapi CMS Content Coverage — Phase 03 News Root Pages

## Status

Complete on 2026-08-12. News landing pages now use scoped `site-page` records
with `pageKind=newsHub`; article collections and detail routes remain separate.

## Objective

Make `/news` landing-page presentation configurable per site while keeping News
Article records and detail pages separate.

## Current State

- Gateway `/news` renders `NewsArchive` with hardcoded hero and section copy.
- Motorsport `/news` fetches scoped articles but has no page configuration query.
- Horse Sport `/news` fetches scoped articles but hardcodes hero, media, and
  empty-state wording.
- `site-page` already supports scoped route paths, hero fields, sections, and SEO.

## Problems

Editors can manage articles but cannot change landing-page editorial hierarchy,
hero media, introductory copy, or SEO per site.

## Target State

Three draft/published `site-page` records:

```text
gateway    /news  newsHub
motorsport /news  newsHub
horsesport /news  newsHub
```

Use existing hero fields, `shared.page-section`, and `shared.seo`. Articles
remain `news-article` records, selected by site filters and existing featured
flags/order rules.

## Scope

- Add `newsHub` page kind.
- Seed only development records if seed convention requires them.
- Add typed adapters/query filters for all three frontends.
- Consume page data in metadata and rendering.
- Preserve article filtering, category filters, pagination, and detail routes.

## Out of Scope

- New News Article fields.
- Duplicate article collections.
- Automatic featured-news relation unless separately approved.
- Visual redesign.

## Files Expected to Change

- `cms/src/api/site-page/content-types/site-page/schema.json`
- `cms/src/seed.ts` if approved local records are needed
- `cms/types/generated/**`, `strapi/content-types.json`
- `frontend-gateway/src/lib/strapi/site-pages.ts`, `src/app/news/page.tsx`, `src/components/sections/news-archive.tsx`
- `frontend-motorsport/src/lib/cms-data.ts`, `src/app/news/page.tsx`, news components/types
- `frontend-horsesport/src/lib/cms-content.ts`, `src/app/news/page.tsx`, types
- focused adapter/render tests

## Content Model Changes

Add only `newsHub` to existing `pageKind` enum. Use `routePath` and `siteScope`
as ownership keys. Use stable section keys such as `lead-story` and
`archive-intro` only where current UI has meaningful editorial blocks.

## Frontend Changes

Fetch `routePath=/news` plus exact frontend scope. If record exists, use CMS
hero/sections/SEO. Article query remains independent. If no record/API outage,
retain current approved fallback until content migration is verified.

## Migration Strategy

Create records additively. Copy current visible copy/media into drafts, compare
rendered output, publish after editor review, then remove only duplicate fallback
values proven unnecessary. Existing article records are untouched.

## Backward Compatibility

No route or article API changes. Missing page record keeps current page behavior.
Localized fallback remains whole-record English fallback, never mixed fields.

## Validation

- Each site returns its own `/news` page record only.
- Articles remain site-scoped and detail links remain valid.
- Metadata uses page SEO/hero where published.
- Category filters and empty states remain functional.
- English/Indonesian behavior follows current i18n contract.

## Acceptance Criteria

- [x] Gateway `/news` page content is CMS-managed.
- [x] Motorsport `/news` page content is CMS-managed.
- [x] Horse Sport `/news` page content is CMS-managed.
- [x] News articles remain separate from landing-page configuration.
- [x] Each page adapter applies exact site scope before rendering.
- [x] Existing article URLs and filters remain functional.

## Implementation Evidence

- Added `newsHub` to `site-page.pageKind`; existing collection UID and records
  remain unchanged.
- Added idempotent local seed records for Gateway, Motorsport, and Horse Sport
  `/news` pages. Existing page records are not overwritten.
- Gateway consumes `/news` page hero, section, and metadata fields through
  `getGatewaySitePageByPath`.
- Motorsport consumes `siteScope=motorsport`, `pageKind=newsHub` through existing
  `fetchSitePage`.
- Horse Sport consumes `siteScope=horsesport`, `routePath=/news`,
  `pageKind=newsHub` through `fetchNewsPageConfig`.
- Article queries remain independent and retain current scope/business filters.
- Missing page records preserve current hardcoded fallback copy.

## Validation Evidence

- CMS TypeScript check passed.
- CMS production build passed.
- CMS RBAC tests passed: 11 tests.
- Gateway typecheck passed.
- Gateway tests passed: 8 files, 37 tests.
- Motorsport typecheck passed.
- Horse Sport typecheck passed.
- `git diff --check` required as final repository check.

## Migration Caveat

Seed records are local/development content only. Production rollout still
requires additive page record creation, editor review, localized content review,
and API/render comparison before removing duplicate fallback copy.
