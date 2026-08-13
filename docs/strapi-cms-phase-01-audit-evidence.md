# CMS-COV-0 Audit Evidence and Validation Contract

## Status

Phase 1 complete. This document records repository evidence and contracts for
later implementation. It does not change CMS schemas, content, or frontend
behavior.

## 1. Authority Rules

| Concern | Authority | Evidence |
| --- | --- | --- |
| Strapi content model | `cms/src/api/**/content-types/**/schema.json` | `strapi/content-types.json` explicitly identifies itself as a mirror |
| Reusable Strapi components | `cms/src/components/**/*.json` | `site-page` references `shared.page-section`, `shared.seo`, and Motorsport components |
| Bootstrap and seed behavior | `cms/src/index.ts`, `cms/src/seed.ts` | Bootstrap registers locale/access control and conditionally seeds demo data |
| Site editor enforcement | `cms/src/access-control/sarga-workspaces.ts` | RBAC conditions and write guard enforce assigned `siteScope` |
| Public CMS API contract | Each frontend `src/lib/**` adapter | Queries apply site filters before mapping data |
| Route rendering | Each frontend `src/app/**/page.tsx` | Route files consume adapters and render page components |

## 2. Canonical Site Contract

`siteScope` remains sole canonical editorial ownership field for this track.

```ts
type SiteScope =
  | "gateway"
  | "motorsport"
  | "horsesport"
  | "shared"
  | "hidden";
```

Public query contract:

| Frontend | Owned page query | Shared collection query |
| --- | --- | --- |
| Gateway | `siteScope=gateway` | `siteScope in [gateway, shared]`, plus existing Gateway teaser rules |
| Motorsport | `siteScope=motorsport` | `siteScope in [motorsport, shared]`, plus existing Motorsport/business rules |
| Horse Sport | `siteScope=horsesport` | `siteScope in [horsesport, shared]`, plus `sarga-horse-sport` business rules where already required |

`hidden` is never public. `shared` is intentional reusable content, not a
fallback for missing site ownership.

## 3. Route-to-Consumer Evidence

| Site | Route | CMS source | Adapter/query | Renderer |
| --- | --- | --- | --- | --- |
| Gateway | `/` | `homepage` plus scoped collections | `frontend-gateway/src/lib/strapi/homepage.ts`, `ecosystem.ts`, `news.ts`, `about.ts` | `frontend-gateway/src/app/page.tsx` |
| Gateway | `/about` | `homepage`, `timeline-item`, `leadership-person`, `site-page` | `frontend-gateway/src/lib/strapi/about.ts`, `site-pages.ts` | `frontend-gateway/src/app/about/page.tsx` |
| Gateway | `/news` | `news-article` only | `frontend-gateway/src/lib/strapi/news.ts` | `frontend-gateway/src/components/sections/news-archive.tsx` through `src/app/news/page.tsx` |
| Motorsport | `/` | Motorsport `site-page` home, events, news, galleries, partners, tickets | `frontend-motorsport/src/lib/homepage-data.ts` | `frontend-motorsport/src/app/page.tsx` |
| Motorsport | `/about` | Motorsport `site-page` about, global `leadership-person` | `frontend-motorsport/src/lib/cms-data.ts` | `frontend-motorsport/src/app/about/page.tsx` |
| Motorsport | `/events` | Motorsport `site-page` eventHub, events, programs | `frontend-motorsport/src/lib/cms-data.ts` | `frontend-motorsport/src/app/events/page.tsx` |
| Motorsport | `/news` | `news-article` only | `frontend-motorsport/src/lib/cms-data.ts` | `frontend-motorsport/src/app/news/page.tsx` |
| Horse Sport | `/` | Horse Sport `site-page` home, business, events, news, galleries, partners, tickets | `frontend-horsesport/src/lib/homepage-data.ts` | `frontend-horsesport/src/app/page.tsx` |
| Horse Sport | `/about` | `ecosystem-business` | `frontend-horsesport/src/lib/strapi/content.ts` | `frontend-horsesport/src/app/about/page.tsx` |
| Horse Sport | `/news` | `news-article` only | `frontend-horsesport/src/lib/cms-content.ts` | `frontend-horsesport/src/app/news/page.tsx` |

## 4. Page Configuration Contract for Later Phases

No schema change occurs in Phase 1. These are reserved contracts for approved
later phases.

### News Hub

Reuse `api::site-page.site-page`:

```text
pageKind  = newsHub
routePath = /news
siteScope = exact frontend site
```

Allowed existing fields:

```text
navigationLabel
heroTitle
heroDescription
heroMedia
sections -> shared.page-section
seo -> shared.seo
```

### Motorsport Event Hub

Reuse existing `pageKind=eventHub` record. Stable section keys:

```text
event-control
programmes
calendar
```

`event` and `motorsport-program` records remain item-level content.

### Leadership

Later Phase 2 may add `siteScope` and optional `site` relation to existing
`leadership-person`. Existing record IDs, UID, localization, and collection
route must remain stable.

## 5. Fallback Contract

| Situation | Required behavior |
| --- | --- |
| CMS request unavailable | Existing approved fallback may render; log/observable error must remain visible to operators |
| CMS record absent | Existing fallback may render until migration is verified |
| CMS record present with optional field empty | Use field-level default only when field is explicitly optional |
| CMS record present with required editorial field empty | Do not silently replace complete CMS record with unrelated hardcoded copy; surface validation/content issue |
| CMS record has `siteScope=hidden` | Do not render publicly |
| CMS record belongs to another site | Query must exclude it; no frontend post-filter is accepted as sole isolation control |

## 6. Migration Rehearsal Checklist

Required before Phase 2 or later data migration:

- [ ] Export PostgreSQL database and Strapi uploads.
- [ ] Restore backup into isolated environment.
- [ ] Record pre-migration counts for affected content types.
- [ ] Record localized document counts and relation counts.
- [ ] Record media IDs/URLs used by affected records.
- [ ] Apply migration to isolated restore.
- [ ] Compare IDs, locales, relations, publication state, and media.
- [ ] Run site-specific API queries.
- [ ] Run frontend route checks.
- [ ] Capture rollback decision and approver.

## 7. Isolation Fixture Matrix

Later tests must include at least these records:

| Fixture | Scope | Expected Gateway | Expected Motorsport | Expected Horse Sport |
| --- | --- | --- | --- | --- |
| Gateway-only article/page/person | `gateway` | visible | absent | absent |
| Motorsport-only article/page/person | `motorsport` | absent except deliberate Gateway teaser path | visible | absent |
| Horse Sport-only article/page/person | `horsesport` | absent except deliberate Gateway teaser path | absent | visible |
| Shared article/page/person | `shared` | visible where query contract permits | visible where query contract permits | visible where query contract permits |
| Hidden article/page/person | `hidden` | absent | absent | absent |

Admin UAT must additionally submit a tampered `siteScope` value and verify the
managed role write guard overwrites/rejects it according to the existing access
control contract.

## 8. Phase 1 Completion Boundary

Completed:

- [x] Root route and consumer inventory.
- [x] CMS-managed/shared/scoped/hardcoded/missing classification.
- [x] Canonical `siteScope` contract confirmed.
- [x] Additive Leadership, News Hub, and Event Hub contracts documented.
- [x] Migration rehearsal and isolation fixture contracts documented.

Deferred to approved later phases:

- Leadership schema and data migration.
- `newsHub` schema enum and page records.
- Motorsport Event Hub section data migration.
- Frontend adapter/render changes.
- Database/API/frontend/admin execution tests requiring new records.
