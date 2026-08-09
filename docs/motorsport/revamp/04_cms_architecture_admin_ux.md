# 04 - CMS Architecture And Admin UX

## Principle

Keep one shared Strapi CMS and one shared database. The revamp changes editor experience and content organization, not the platform architecture.

## Current state

The CMS already supports site-aware content:

- `siteScope`: `gateway`, `motorsport`, `horsesport`, `shared`, `hidden`.
- `sites` relation on several shared types.
- Cross-site teaser flags for Gateway, Motorsport, and Horse Sport.
- Shared collections for events, news, partners, ticket CTAs, and media galleries.
- Custom admin branding in `cms/src/admin/app.tsx`.

## Target editor UX

Editors should see clear site workspaces:

```text
Sarga Gateway
Sarga Motorsport
Sarga Horse Sport
Shared Library
System Settings
```

Each workspace should expose only the content that is relevant to that site.

### Sarga Gateway workspace

- Gateway homepage/content pages.
- Gateway ecosystem businesses.
- Gateway news and events.
- Gateway media.
- Gateway site settings.

### Sarga Motorsport workspace

- Motorsport homepage.
- Motorsport About page.
- Motorsport Event hub.
- Indonesia Junior Talent Cup program pages.
- FIA Rallycross campaign page.
- Motorsport news.
- Motorsport gallery.
- Motorsport merchandise.
- Motorsport ticket CTAs.
- Motorsport site settings.

### Sarga Horse Sport workspace

- Horse Sport homepage/content pages.
- Horse Sport events.
- Horse Sport news.
- Horse Sport galleries.
- Horse Sport ticket CTAs.
- Horse Sport site settings.

### Shared Library workspace

- Shared media.
- Shared sponsors/partners.
- Shared ecosystem businesses.
- Public site directory records and their display order.
- Leadership council profiles, summaries, portraits, and display order.
- Corporate timeline records used by Gateway experiences.
- Shared legal pages if applicable.
- Reusable SEO and brand assets.

## Recommended implementation approach

### Phase 1: Editor-facing workspace plugin

Build a small Strapi admin plugin or admin customization that adds a site workspace landing page to the sidebar. The workspace can link into Strapi Content Manager routes with pre-applied filters and clear labels.

Why:

- It avoids duplicating content models.
- It keeps existing APIs stable.
- It gives editors separate menus without creating separate CMS instances.

Minimum feature set:

- Sidebar entries for Gateway, Motorsport, Horse Sport, Shared Library.
- Workspace dashboard cards for each collection.
- Filtered links by `siteScope` and/or `sites`.
- Quick-create guidance that tells editors which `siteScope` to use.
- Clear warnings when creating shared content.

### Phase 2: Site-scoped page model

Introduce a `site-page` collection if static pages need CMS control beyond existing route fallbacks.

Suggested fields:

```text
title
slug
routePath
siteScope
site relation
pageKind: home | about | eventHub | campaign | merchandise | legal | custom
navigationLabel
heroTitle
heroDescription
heroMedia
sections dynamic zone
seo component
publishedAt
```

This avoids creating separate single types for Gateway, Motorsport, and Horse Sport while still giving each site dedicated editable pages.

### Phase 3: Motorsport program models

Use shared Event/Campaign models where possible, but add program-specific collections only when the data shape is not event-shaped.

Recommended additions:

```text
motorsport-program
motorsport-rider
motorsport-standing
motorsport-regulation
merchandise-item
```

Suggested `motorsport-program` fields:

```text
title
slug
programType: juniorTalentCup | rallycross | raceWeekend | other
seasonLabel
summary
heroMedia
relatedEvents
relatedTicketCtas
siteScope default motorsport
seo
```

Suggested `motorsport-rider` fields:

```text
name
slug
program
number
team
region
portrait
bio
isActive
sortOrder
siteScope default motorsport
```

Suggested `motorsport-standing` fields:

```text
program
seasonLabel
roundLabel
rider
position
points
resultSummary
publishedAt
siteScope default motorsport
```

Suggested `motorsport-regulation` fields:

```text
program
title
version
effectiveDate
pdfFile
summary
siteScope default motorsport
```

Suggested `merchandise-item` fields:

```text
title
slug
description
image
priceLabel
availabilityStatus: comingSoon | availableExternal | inquiryOnly | hidden
externalUrl
siteScope
sortOrder
seo
```

## Role and permission rules

Implemented managed roles:

- `sarga-gateway-admin` — Gateway workspace and `gateway` records.
- `sarga-motorsport-admin` — Motorsport workspace and `motorsport` records.
- `sarga-horsesport-admin` — Horse Sport workspace and `horsesport` records.
- `sarga-shared-admin` — Shared Library workspace and `shared` records.
- `strapi-super-admin` — all four workspaces, system settings, roles, and all
  records.

Enforcement has three layers:

1. Each sidebar workspace link declares its own custom admin permission, so a
   site role sees exactly one custom workspace and Super Admin sees all four.
2. Content Manager read/update/delete/publish permissions use custom Strapi RBAC
   conditions on `siteScope`; direct Content Manager URLs do not bypass the
   record filter.
3. A request-context Document Service middleware forces `siteScope` to the
   authenticated managed role on admin creates, updates, and clones. This closes
   the create-action gap where a conditional permission has no existing entity
   to evaluate.

Managed role permissions are synchronized at Strapi bootstrap. Do not manually
add cross-site permissions to these roles; create a separately reviewed role if
the editorial operating model changes. An account must have exactly one managed
site role. Super Admin is the only supported cross-site administrator.

`Site`, `Leadership Person`, and `Timeline Item` are global records without a
`siteScope` field. They are therefore granted as unscoped subjects only to the
Shared Library role and Super Admin. Dedicated Gateway, Motorsport, and Horse
Sport roles cannot manage these collections. This keeps the homepage content
hub editable without weakening per-site segregation.

Dedicated accounts are optionally provisioned from the
`CMS_<SITE>_ADMIN_{EMAIL,PASSWORD,FIRSTNAME,LASTNAME}` environment variables.
No default password is stored in the repository. Existing email addresses are
never silently reassigned or password-reset.

## API behavior

Frontend queries should continue filtering by:

- `siteScope IN [motorsport, shared]`
- `business.slug == sarga-motorsport` when the collection supports business relations
- explicit campaign/program slug for detail pages

Shared content may appear on multiple sites, but each frontend renders it using its own visual system.

## Non-goals

- No second Strapi instance.
- No duplicated events/news just to create editor separation.
- No internal checkout.
- No public user accounts.

## MSR-2 implementation status

Implemented on 2026-08-08 with Strapi 5.49 while preserving one CMS and one
PostgreSQL database.

### Editor workspaces

`cms/src/admin/app.tsx` now registers four permission-gated Strapi admin menu
links:

- Sarga Gateway.
- Sarga Motorsport.
- Sarga Horse Sport.
- Shared Library.

Strapi 5.49's stock main-sidebar menu-link contract is flat and does not expose
a supported nested `children` API. All four links therefore load the workspace
dashboard in
`cms/src/admin/extensions/sarga-workspaces/WorkspacePage.tsx`. Dashboard cards
are grouped under nested Pages, Programs, Editorial, Commerce, and Library
sub-navigation, then deep-link to the existing shared Content Manager
collections with a pre-applied `siteScope` filter. Each workspace includes
quick-create links and a publishing guardrail.

### Access-control follow-up

Implemented after MSR-2 on 2026-08-08:

- Server permission actions and site-scope conditions in
  `cms/src/access-control/sarga-workspaces.ts`.
- Four idempotently created/synchronized site roles, each with exactly one
  workspace permission and only its relevant content-type subjects.
- Conditional record-level read/update/delete/publish access plus a forced-scope
  write guard for create/update/clone requests from the Strapi admin.
- Environment-only optional provisioning for dedicated admin users.
- Super Admin permission refresh so all four workspaces remain available.

Media Library files do not currently carry `siteScope`. Managed site roles can
view/upload/download/copy media so CMS media fields remain usable, but they
cannot use the combined asset update/delete permission. The media library is a
shared asset pool; use site-named folders and do not place confidential assets
there. True per-site media row isolation would require a separately approved
media metadata/plugin extension.

### Added content architecture

- `site-page`: site-scoped Home, About, Event Hub, Campaign, Merchandise,
  Legal, or Custom pages with route, hero, dynamic sections, and SEO.
- `motorsport-program`: IJTC, Rallycross, race-weekend, and future program hubs
  with season, status, campaign dates/venue, CTA data, related events/tickets,
  banner slides, rundown, rules, and SEO.
- `motorsport-rider`: program-linked rider profiles with number, team, region,
  nationality, portrait, biography, ordering, and a slug consumed by the shared
  public `/riders/[riderSlug]` profile template.
- `motorsport-standing`: program/rider-linked season and round results with
  position, decimal points, result summary, and result date.
- `motorsport-regulation`: versioned, effective-dated program documents. The
  PDF is optional at schema level so draft metadata can exist before an
  approved file is supplied; frontend publication must require an active
  record with a file.
- `merchandise-item`: showcase-only merchandise with `comingSoon`,
  `availableExternal`, `inquiryOnly`, or `hidden` availability. There are no
  cart, checkout, payment, or account fields.

Reusable components added:

- `shared.page-section`.
- `motorsport.campaign-slide`.
- `motorsport.rundown-item`, including optional public date label, venue, and
  `upcoming|live|completed` status alongside session timing and order.
- `motorsport.rule-item`.

### MSR-RD3 homepage carousel implementation

MSR-RD3 adds the repeatable
`motorsport.hero-slide` component on the Motorsport-scoped `site-page` Home
record. It is intentionally separate from `motorsport.campaign-slide` so
responsive media, alt text, crop anchors, homepage visibility, and migration
fallbacks can be added without changing existing campaign banners.

Fields are `internalName`, `eyebrow`, `title`, `description`, desktop
`image`, optional `mobileImage`, required `imageAlt`, `subjectAnchor`, optional
single CTA, `isActive`, and `sortOrder`. The supported range is one to five
published slides, with three recommended.

The parent `site-page` continues to own `siteScope`, site relation,
draft/publish, and role-gated workspace access. Existing single `heroTitle`,
`heroDescription`, and `heroMedia` fields remain the migration and runtime
fallback. Schema, generated types, and three desktop/mobile seed slide pairs are
included. The seed populates an empty carousel but preserves existing
editor-managed slides. The component remains inside the role-gated Motorsport
Site Page rather than creating a second CMS collection or workspace.

Every new public collection retains the shared
`gateway|motorsport|horsesport|shared|hidden` scope contract. Only public
`find` and `findOne` permissions are seeded; create/update/delete remain
private.

### Demo content

The idempotent seed now adds:

- Five Motorsport `site-page` records for Home, About, Event Hub, FIA
  Rallycross Campaign, and Merchandise.
- IJTC program data, 20 explicitly labelled fictional demo riders linked to 20
  row-major portrait crops from the supplied 5×4 grid, 20 rider-related demo standing rows, eight
  demo schedule rounds, and inactive regulation metadata without an unapproved
  PDF. The seed refreshes these slug-keyed records idempotently and removes only
  obsolete `Demo`-prefixed standing sets for this programme.
- FIA Rallycross World Cup Indonesia 2026 program/campaign data, the exact
  approved headline/date/venue, three banner slides, three rundown items, three
  do/don't rules, a shared Event record, and a placeholder partner ticket CTA.
- Two clearly labeled merchandise preview records using `comingSoon` and
  `inquiryOnly`; neither enables commerce.

All people, standings, product details, ticket destinations, and regulation
metadata marked as demo must be replaced or approved before launch.
