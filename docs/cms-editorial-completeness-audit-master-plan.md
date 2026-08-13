# Sarga CMS Editorial Completeness Audit and Migration Plan

## Status

Assessment and specification only. No implementation for this audit has started.
Existing prior-phase changes remain untouched.

## Objective

Ensure every meaningful public editorial element across Gateway, Motorsport, and
Horse Sport is configurable in Strapi:

- page and section headings
- eyebrow/kicker labels with editorial meaning
- body and supporting copy
- CTA labels and destinations
- editorial metadata
- hero and section media
- media alt text/captions where editorially relevant
- SEO metadata

Technical controls, accessibility labels, system errors, route semantics, live
counts, filters, and data-derived status labels remain code-owned unless an
editorial requirement proves otherwise.

## Current Architecture Evidence

- Shared Strapi instance under `cms/`.
- Canonical ownership field: `siteScope`.
- Existing scoped page model: `api::site-page.site-page`.
- Existing reusable section component: `shared.page-section`.
- Existing SEO component: `shared.seo`.
- Existing media fields on page and collection models.
- Existing scoped workspace/RBAC implementation.
- Existing seed is development-only and must not be treated as production
  migration.
- Existing frontends use curated fallback content when CMS is unavailable or
  records are absent.

## Content Policy

### MOVE_TO_CMS

- Meaningful page titles, subtitles, descriptions, section copy, campaign copy,
  CTA copy, editorial hero media, and section media.
- Repeated page composition that editors are expected to change.
- Page-specific SEO and social metadata.
- Editorial alt text and image captions.

### KEEP_CODE_OWNED

- Route paths and route matching.
- Technical navigation fallback and language controls.
- Pagination, filter, sorting, and accessibility labels.
- Live counts derived from CMS records.
- Event/news category values and status formatting.
- Error/loading/not-found system copy unless business requires CMS control.
- Security, ticket safety, form validation, and partner-domain messages.

### FALLBACK_ONLY

- Approved temporary copy used when CMS is unavailable or page record is absent.
- Must be visibly documented, tested, and removable after production CMS content
  is verified.

### REQUIRES_REVIEW

- Whether shared shell labels such as `Home`, `Next`, `Previous`, `View all`, and
  `Read more` should be localized dictionaries or CMS-managed navigation.
- Whether campaign/detail-page structured content should remain collection-owned
  or gain page-section composition.
- Whether error, loading, and empty states require editorial configuration.

## Global Findings

1. CMS page coverage is not comprehensive. `site-page` records exist for selected
   Gateway, Motorsport, News, Event Hub, and custom pages only.
2. Existing CMS-backed pages still contain static section copy and local media
   fallbacks that can become the rendered result when fields are absent.
3. Horse Sport has largest page-level gap. Its `about`, `events`, `gallery`,
   `venues`, `partners`, `contact`, `tickets`, `stable-life`, and homepage
   sections mix collection data with static editorial copy.
4. Motorsport has remaining static copy on About, event detail, campaign,
   contact-support, IJTC subpages, homepage ticket/newsletter surfaces, and
   collection-driven root pages.
5. Gateway has remaining static copy on About, Board, Company Structure,
   Ecosystem, Careers child pages, Contact form surface, Ticket Hub detail, and
   fallback/empty states.
6. Media audit finds hardcoded local paths in page components and fallback view
   models. Existing CMS media fields are not consistently consumed by every
   route.
7. Current fallback policy can hide incomplete CMS records if a complete static
   fallback replaces missing required editorial fields. Later phases must split
   unavailable-record fallback from field-level optional fallback.

## Proposed Architecture

### Page Configuration

Reuse `site-page` for root and campaign presentation where content is primarily
page composition:

```text
siteScope
site
routePath
pageKind
navigationLabel
heroTitle
heroDescription
heroMedia
sections -> shared.page-section dynamic zone
seo -> shared.seo
```

Use stable section keys per route. Do not create one content type per page.

### Structured Collections

Keep collection-owned data where shape matters:

- `news-article`: article title, excerpt, body, date, category, cover media.
- `event`: event facts, schedule, ticket destinations, galleries.
- `motorsport-program`: campaign/program data, riders, standings, rules.
- `ecosystem-business`: business proposition and relationships.
- `partner`: partner records and logos.
- `media-gallery`: gallery data and media items.
- `job-vacancy`: role data.
- `leadership-person`: scoped leadership records.

Page sections may control presentation copy around these collections, but must
not duplicate item facts.

### Media

Move editorial media selection into CMS page/media fields. Keep local assets only
as documented outage fallback. Add required/validated alt text before publishing.
Media Library remains shared; site-named folders remain required.

## Route Coverage Matrix

Status meanings: `Covered` = meaningful copy/media has a CMS consumer;
`Partial` = some page content is CMS-managed; `Gap` = important editorial content
remains static or fallback-only; `Deferred` = requires dedicated later contract.

| Site | Route group | Current status | Main static/fallback content | Target model |
| --- | --- | --- | --- | --- |
| Gateway | `/` | Partial | shell and some section labels/media fallbacks | Homepage + page sections |
| Gateway | `/about` | Partial | philosophy, corporate record, section media/copy | Gateway `site-page` about sections |
| Gateway | `/about/board-of-directors` | Gap | hero and governance section copy | Gateway custom page + scoped leadership |
| Gateway | `/about/company-structure` | Gap | hero and structure sections | Gateway custom page |
| Gateway | `/about/history` | Covered | page record and timeline collection | Existing page + timeline |
| Gateway | reports | Covered/Partial | empty-state copy and supporting labels | Existing page records + report collection |
| Gateway | `/ecosystem` | Partial | intro and ecosystem section copy/media | Gateway custom page + businesses |
| Gateway | `/ecosystem/[slug]` | Partial | capability/media/related-content framing copy | Business record + page sections |
| Gateway | `/news` | Covered | fallback remains until production publish | `newsHub` page + articles |
| Gateway | `/news/[slug]` | Partial | related-story labels and empty states | Article-owned detail + page presentation |
| Gateway | `/careers` | Covered/Partial | roster CTA/footer copy | Custom page + vacancies |
| Gateway | `/careers/jobs` | Gap | search intro and controls framing | Custom page + vacancies |
| Gateway | `/contact` | Covered/Partial | form explanation and closing CTA | Custom page + form controls |
| Gateway | `/ticket-hub` | Covered/Partial | ticket listing labels and partner explanation | Custom page + events/CTAs |
| Motorsport | `/` | Partial | ticket/newsletter/supporting CTA copy | Home page sections and structured components |
| Motorsport | `/about` | Partial | operating idea, capabilities, team intro, CTA copy/media | About page sections + leadership |
| Motorsport | `/events` | Covered | fallback remains until production publish | Event Hub sections + programs/events |
| Motorsport | `/events/[slug]` | Gap | event briefing, ticket section, sponsor labels | Event detail presentation contract |
| Motorsport | IJTC routes | Partial | subpage headings, explanatory copy, CTA copy | Program sections/components |
| Motorsport | `/campaign/[slug]` | Partial | campaign narrative, spectator guide, ticket copy | Program/campaign sections |
| Motorsport | `/news` | Covered | fallback remains until production publish | News Hub + articles |
| Motorsport | `/news/[slug]` | Partial | article framing and related content copy | Article detail presentation |
| Motorsport | `/gallery` | Covered/Partial | intro copy/media fallback remains | Custom page + gallery |
| Motorsport | `/partners` | Covered/Partial | intro and partner section framing | Custom page + partners |
| Motorsport | `/tickets` | Covered/Partial | ticket explanation and section copy | Custom page + CTAs/events |
| Motorsport | `/contact` | Covered/Partial | inquiry/support framing | Custom page + form |
| Horse Sport | `/` | Gap | multiple section headings, copy, media, CTAs | Home page sections + collections |
| Horse Sport | `/about` | Gap | hero/story/capability/CTA copy and media | About page + business/sections |
| Horse Sport | `/events` | Gap | hero and empty-state copy/media | Events page + collection |
| Horse Sport | `/events/[slug]` | Partial | event detail section labels and empty states | Event detail presentation |
| Horse Sport | `/news` | Covered/Partial | fallback remains until production publish | News Hub + articles |
| Horse Sport | `/news/[slug]` | Partial | article empty/related framing | Article detail presentation |
| Horse Sport | `/gallery` | Gap | hero, intro, empty-state copy/media | Gallery page + galleries |
| Horse Sport | `/venues` | Gap | all meaningful venue page copy/media | Venue page model or page sections |
| Horse Sport | `/stable-life` | Gap | hero/editorial hub copy/media | Page sections + news feed |
| Horse Sport | `/partners` | Gap | hero/proposition/CTA copy | Custom page + partners |
| Horse Sport | `/contact` | Gap | hero/form explanation/footer copy | Custom page + form |
| Horse Sport | `/tickets` | Gap | hero/ticket explanation/empty state | Custom page + ticket CTAs |

## Phased Plan

1. **Audit Baseline and Content Contract**
   - freeze route/section/media inventory
   - define static-content policy
   - add contract tests for page completeness
2. **Gateway Editorial Completeness**
   - About, Board, Company Structure, Ecosystem, Careers child, Contact, Ticket
   - consume CMS sections/media consistently
3. **Motorsport Editorial Completeness**
   - About, homepage support surfaces, event detail, IJTC, campaign, gallery,
     partners, tickets, contact, news detail
4. **Horse Sport Editorial Completeness**
   - homepage, About, Events, event detail, Gallery, Venues, Stable Life,
     Partners, Contact, Tickets, News detail
5. **Media, SEO, fallback, and localization hardening**
   - media completeness, alt text, SEO, locale parity, fallback observability
6. **Migration, UAT, cleanup, and handover**
   - staging backup/restore, content migration, API/admin UAT, visual regression,
     remove verified duplicate fallbacks

## Approval Gate

Approve Phase 1 of this new audit before implementation. No source code or CMS
schema changes from this audit have been made.
