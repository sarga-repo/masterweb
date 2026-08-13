# Sarga CMS Content Coverage and Site Isolation Master Plan

## Status

Specification only. No CMS, frontend, seed, migration, or production behavior
has been changed by this audit.

## 1. Objective

Give Gateway, Sarga Motorsport, and Sarga Horse Sport complete, explicit, and
maintainable editorial ownership in one Strapi instance without duplicating
shared News or Event collections, leaking records across sites, or invalidating
existing production content.

## 2. Evidence Base

Primary implementation sources inspected:

- `cms/src/api/**/content-types/**/schema.json`
- `cms/src/components/**/*.json`
- `cms/src/index.ts`
- `cms/src/seed.ts`
- `cms/src/access-control/sarga-workspaces.ts`
- `frontend-gateway/src/app/**`, `frontend-gateway/src/lib/strapi/**`
- `frontend-motorsport/src/app/**`, `frontend-motorsport/src/lib/cms-data.ts`
- `frontend-horsesport/src/app/**`, `frontend-horsesport/src/lib/cms-content.ts`, `frontend-horsesport/src/lib/homepage-data.ts`
- `strapi/content-types.json` as schema mirror only
- `docs/strapi-admin-menu/**`, `docs/gateway/revamp/**`, `docs/motorsport/revamp/**`, `docs/horsesport/**`, `docs/multisite/**`

Source-of-truth finding: `cms/src` is authoritative. `strapi/content-types.json`
states that it mirrors source schemas and is documentation, not source of truth.

## 3. Existing Architecture

### Ownership

Scoped records use canonical `siteScope` values:

```text
gateway | motorsport | horsesport | shared | hidden
```

`site` relations exist on selected shared collections. Dedicated frontends
filter their own scope plus `shared` where appropriate. Gateway uses dedicated
site URLs for Motorsport and Horse Sport teasers rather than duplicating their
full pages.

### Editorial page model

`api::site-page.site-page` is an additive, site-scoped collection with:

- `routePath`
- `siteScope`
- `site` relation
- `pageKind`
- hero title/description/media
- dynamic `shared.page-section` sections
- `shared.seo`
- Motorsport homepage-specific components and relations

Gateway also has route-specific fallbacks in
`frontend-gateway/src/lib/strapi/site-pages.ts` for report/history pages.

### Admin UX and enforcement

Custom workspaces exist for Gateway, Motorsport, Horse Sport, and Shared
Library. Strapi's stock sidebar is flat, so grouped links render inside
`cms/src/admin/extensions/sarga-workspaces/WorkspacePage.tsx`.

Workspace filters are not the security boundary. RBAC conditions and the server
write guard force managed roles to their assigned `siteScope`. `Site`,
`Leadership Person`, and `Timeline Item` are currently unscoped and Shared
Library-owned.

## 4. Current-State Audit Matrix

Legend: `Yes` means data exists in CMS and is consumed; `Partial` means some
content is managed while meaningful copy remains frontend-owned; `No` means no
page-level CMS contract; `Scoped` means query enforces the site's scope.

| Site | Route/Page | CMS model/consumer | Hero | Subtitle/description | Sections | Scoped | Significant hardcoded content | Gap |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Gateway | `/` | `homepage`; `frontend-gateway/src/app/page.tsx` | Yes | Yes | Partial | Homepage is single type; related records scoped by their own queries | Shell labels and some section presentation copy | No major homepage model gap for this phase |
| Gateway | `/about` | Homepage + timeline + global `leadership-person` + site pages | Partial | Partial | Partial | Leadership not scoped | Intro/vision/structure headings and descriptions in `src/app/about/page.tsx` | Leadership ownership; about root page contract incomplete |
| Gateway | `/news` | `news-article`; `NewsArchive` | No | No | No | Articles query uses Gateway contract | `frontend-gateway/src/app/news/page.tsx` metadata; `news-archive.tsx` hero, lead-story, archive headings, CTA copy, local hero media | Add dedicated Gateway `/news` page record; keep articles separate |
| Gateway | `/ecosystem` | `ecosystem-business` | Partial | Partial | Partial | Business query uses Gateway/shared rules | Intro and section copy in `frontend-gateway/src/app/ecosystem/page.tsx` | Consider later root-page coverage; not prerequisite to News/Leadership |
| Gateway | `/careers` | `job-vacancy` | No | No | No | Gateway/shared | Hero and section copy in `frontend-gateway/src/app/careers/page.tsx` | Later root-page coverage |
| Gateway | `/contact` | Form infrastructure | No | No | No | Submission records capture source site | Hero and section copy in `frontend-gateway/src/app/contact/page.tsx` | Later root-page coverage |
| Gateway | `/ticket-hub` | `event`, `ticket-cta` | No | No | No | Gateway/shared/event routing | Hero and section copy in `frontend-gateway/src/app/ticket-hub/page.tsx` | Later root-page coverage |
| Motorsport | `/` | Motorsport `site-page` `pageKind=home`; homepage aggregate | Yes | Yes | Partial/Yes | `siteScope=motorsport`; child data Motorsport/shared | Some CTA/newsletter copy remains intentional fallback/presentation copy | Existing model adequate; audit fallback policy in later phase |
| Motorsport | `/about` | Motorsport `site-page` `pageKind=about` + global `leadership-person` | Yes | Partial | Partial | Page scoped; Leadership global | Capabilities, operating idea, labels, CTA and fallback copy in `src/app/about/page.tsx` | Leadership isolation; page section field coverage |
| Motorsport | `/events` | Motorsport `site-page` `pageKind=eventHub` + `event` + programs | Partial | Partial | Partial | Page `motorsport`; events `motorsport/shared` | Blue `InformationBand`, Programme and Calendar copy in `src/app/events/page.tsx` | Add event-hub section fields; keep Event entries separate |
| Motorsport | `/news` | `news-article`; page route has no page record fetch | No | No | No | Articles `motorsport/shared` | `src/app/news/page.tsx` and news components own hero/section copy | Add Motorsport News landing page configuration |
| Motorsport | `/gallery` | `media-gallery` | No | No | Partial | Motorsport/shared | Page hero copy in `src/app/gallery/page.tsx` | Later root-page coverage |
| Motorsport | `/partners` | `partner` | No | No | Partial | Motorsport/shared | Hero/intro copy in `src/app/partners/page.tsx` | Later root-page coverage |
| Motorsport | `/contact` | Form infrastructure | No | No | No | Submission source site | Hero/section copy in `src/app/contact/page.tsx` | Later root-page coverage |
| Motorsport | `/tickets` | `ticket-cta` | No | No | Partial | Motorsport/shared | Ticket page explanatory copy | Later root-page coverage |
| Horse Sport | `/` | Horse Sport `site-page` `pageKind=home` + business/events/news | Partial | Partial | Partial | Home page `horsesport`; children horsesport/shared + business filter | Multiple homepage section headings/descriptions in `src/app/page.tsx` | Expand page fields only where editorial value justifies it |
| Horse Sport | `/about` | `ecosystem-business` only | No | Partial | No | Business slug filter | Most page copy in `src/app/about/page.tsx` | Add/use Horse Sport site page; no leadership consumer |
| Horse Sport | `/news` | `news-article`; `fetchNewsPage` | No | No | No | `horsesport/shared` + business relation in homepage; verify list adapter scope | Hero, description, media, empty-state CTA in `src/app/news/page.tsx` | Add dedicated Horse Sport News page configuration |
| Horse Sport | `/events` | `event`; `fetchEventsPage` | No | No | Partial | Horse Sport/shared + business relation | Page hero/intro copy | Later root-page coverage |
| Horse Sport | `/gallery` | `media-gallery` | No | No | Partial | Horse Sport/shared | Page hero copy | Later root-page coverage |
| Horse Sport | `/venues` | Primarily frontend content | No | No | No | No page model identified | Meaningful venue copy | Later root-page coverage |
| Horse Sport | `/stable-life` | News article reuse | No | No | Partial | News scope | Hero and editorial hub copy | Later root-page coverage |
| Horse Sport | `/partners` | `partner` | No | No | Partial | Horse Sport/shared | Hero, proposition, CTA copy | Later root-page coverage |
| Horse Sport | `/contact` | Form infrastructure | No | No | No | Submission source site | Meaningful form-page copy | Later root-page coverage |
| Horse Sport | `/tickets` | `ticket-cta` | No | No | Partial | Horse Sport/shared | Hero and explanatory copy | Later root-page coverage |

## 5. Hardcoded Editorial Classification

### MOVE_TO_CMS

- Gateway `/news` hero eyebrow/title/description/media, lead-story heading and
  archive heading/description.
- Motorsport `/news` hero and section-level landing copy.
- Horse Sport `/news` hero eyebrow/title/description/media and empty-state CTA
  where editorial wording is intended to vary.
- Motorsport `/events` blue information-band eyebrow/title/description and
  Programme/Calendar section headings/descriptions.
- Leadership records and ownership metadata for all three sites.

### ALREADY_CMS_MANAGED

- News article records and article detail content.
- Event records and event detail content.
- Motorsport/Horse Sport/Gateway `site-page` records where frontend adapters
  already fetch them.
- Homepage hero/page sections in existing site-page/homepage contracts.
- SEO components on supported models.

### KEEP_HARDCODED

- Technical filter labels, status chips, pagination labels, accessibility
  labels, navigation fallback labels, and layout-only index markers.
- Safe fallback copy required to keep approved pages usable during CMS outage,
  provided it cannot mask a successful but incomplete CMS response.
- Brand identity labels that are not editorial data, such as site names and
  fixed route semantics.

### REQUIRES_DISCUSSION

- Whether every non-News root page should move all section copy into `site-page`
  dynamic zones or only hero/intro/CTA fields.
- Whether Horse Sport leadership should appear on `/about`, homepage content hub,
  or both.
- Whether existing global `Timeline Item` should remain Shared Library-only.

## 6. Recommended Architecture

### 6.1 Leadership

Extend existing `leadership-person` additively with `siteScope` and optional
`site` relation. Do not create three duplicate collection types.

Recommended ownership rules:

```text
siteScope = gateway     Gateway leadership
siteScope = motorsport  Motorsport leadership
siteScope = horsesport  Horse Sport leadership
siteScope = shared      approved shared leadership only
siteScope = hidden      retained but never public
```

Existing records migrate to `shared` first unless production evidence proves
they are Gateway-only. Frontends then explicitly query their site plus approved
shared records. Managed roles receive the same immutable-scope enforcement as
other scoped collections. This is additive and preserves collection UID,
relations, API route, localization, and existing record IDs.

Trade-off: one collection keeps API and editorial shape stable, while an
explicit scope prevents current global leakage. Three collections would make
admin labels clearer but duplicate schemas, adapters, localization behavior,
and migration paths without improving the single-CMS ownership boundary.

### 6.2 News landing pages

Reuse `site-page`, not a new `news-page` collection. Add `pageKind=newsHub`
and use the existing `routePath` plus `siteScope` uniqueness convention.

Each site gets one record:

```text
siteScope  routePath  pageKind
gateway    /news      newsHub
motorsport /news      newsHub
horsesport /news      newsHub
```

Use existing fields/components first:

- `navigationLabel`
- `heroTitle`
- `heroDescription`
- `heroMedia`
- `sections` using `shared.page-section`
- `seo` using `shared.seo`

Do not add featured-news relations until audit confirms editorial selection
cannot be represented by existing article flags/order. Existing article
collections remain separate and continue providing cards/details.

### 6.3 Motorsport Event hub

Reuse the Motorsport `site-page` `eventHub` record. Store blue-band and other
landing-page copy in ordered `shared.page-section` records with stable keys,
for example `event-control`, `programmes`, and `calendar`. If the existing
component needs stat labels not representable by `page-section`, add one
Motorsport-specific non-repeatable component only after implementation confirms
the fields are editorially required. Individual `event` and
`motorsport-program` records remain separate.

### 6.4 Admin UX

Extend existing workspace cards and role permissions. Do not patch native
Strapi sidebar nesting or create duplicate content types. Add labels such as
`Gateway News Page`, `Motorsport News Page`, and `Horse Sport News Page` inside
workspace dashboards while native Content Manager collection names remain
global.

## 7. API and Frontend Contract

Every adapter must enforce site ownership server-side in its Strapi query:

```text
Gateway page:    routePath + siteScope=gateway
Motorsport page: routePath + siteScope=motorsport
Horse page:      routePath + siteScope=horsesport
Articles:        siteScope in [site, shared] plus existing business rules
Leadership:      siteScope in [site, shared]
```

Consumer chain for each new field:

```text
Strapi schema → typed adapter → normalizer → route/component → metadata
```

Successful CMS responses must not silently merge hardcoded page copy over
missing fields. Fallbacks are allowed only for unavailable records or explicitly
optional fields and must be covered by tests.

## 8. Compatibility and Migration Principles

- Preserve collection UIDs and existing `documentId`/database IDs.
- Add `siteScope` nullable/defaulted during migration; backfill before making it
  required in production.
- Keep existing `site-page` records and `pageKind` values unchanged except for
  additive `newsHub` enum support.
- Create new News Hub records; do not convert News Article records.
- Backfill Leadership records to `shared` before assigning site ownership.
- Preserve existing frontend fallback behavior during rollout, then remove only
  fallback copy proven redundant by production content verification.
- Update generated types and `strapi/content-types.json` after source schemas.
- Rehearse PostgreSQL/uploads backup restore before production migration.

## 9. Proposed Phases

1. Discovery, audit, schema guardrails, and test fixtures.
2. Site-scoped Leadership with migration and all-site consumers.
3. Site-scoped News Hub page records and consumers.
4. Motorsport Event Hub editorial coverage.
5. Remaining root-page coverage based on this audit and stakeholder priority.
6. Migration, regression, admin UAT, cleanup, and handover.

## 10. Main Risks

- Existing Leadership records may represent mixed ownership; automatic
  assignment without editorial confirmation risks changing public meaning.
- `siteScope` plus `sites` plus show-on flags create overlapping semantics on
  shared collections. New page/leadership contracts should use `siteScope` as
  canonical ownership and retain flags only for cross-site teaser behavior.
- Frontends currently use curated fallback content. Removing it too early can
  create empty pages during CMS outage; retaining it too broadly can hide
  incomplete CMS records.
- Strapi i18n makes localized page records and route parity migration-sensitive.
- Media Library files remain shared; page record isolation does not isolate
  uploaded files.

## 11. Approval Gate

Approve Phase 1 before any implementation. No production implementation has
started in this planning run.
