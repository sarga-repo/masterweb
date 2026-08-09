# Motorsport Content Model Extensions for Shared Strapi CMS

## Existing CMS principle

Keep one Strapi CMS and extend content models to support multisite and motorsport-specific data.

For the major Motorsport revamp, also follow `docs/motorsport/revamp/04_cms_architecture_admin_ux.md`. Gateway, Motorsport, and Horse Sport need dedicated CMS workspace/menu entry points for editors, but they should continue sharing the same Strapi instance, database, and shared content models where appropriate.

## New collection: Site

Fields:

```text
name
slug
baseUrl
description
logo
favicon
themeKey
isActive
```

Initial records:

```text
sarga-gateway
sarga-motorsport
```

## Update shared content types

Add these common fields to Page, News Article, Event, Ticket CTA, Navigation Menu, Footer Menu, Campaign Landing Page:

```text
siteScope: enum gateway | motorsport | shared | hidden
sites: relation many-to-many Site
business: relation to Ecosystem Business
showOnGateway: boolean
showOnMotorsport: boolean
seo: component
```

## Event extensions

Fields:

```text
racingDiscipline: car | motorcycle | mixed
racingCategory (examples: touring_car, formula, rally, superbike, supersport, moto, mixed_showcase)
seriesName
venueName
venueAddress
circuitName
eventStart
 eventEnd
schedule: repeatable component
status: draft | announced | ticket_open | sold_out | completed | cancelled
heroMedia
gallery
broadcastUrl
ticketCta: relation Ticket CTA
sponsors: relation Partner
```

`racingDiscipline` is the stable top-level filter. `racingCategory` remains the
more specific CMS label so future car and motorcycle series can be added without
changing frontend code. Existing records without a discipline should be treated
as `car` only when their category explicitly identifies a car series; otherwise
render them as uncategorized until an editor confirms the value.

## Ticket CTA extensions

Fields:

```text
provider
ctaType: redirect | deep_link | embed
url
embedCode
embedConfigJson
activeFrom
activeUntil
isActive
trackingParams
relatedEvent
siteScope
```

## News extensions

Fields:

```text
category: race_report | announcement | press_release | lifestyle | community | media
relatedEvent
relatedBusiness
featuredOnGateway
featuredOnMotorsport
```

## New collection: Partner

Fields:

```text
name
slug
logo
websiteUrl
partnerType
siteScope
sortOrder
isActive
```

## New collection: Media Gallery

Fields:

```text
title
slug
description
mediaItems
relatedEvent
siteScope
publishedAt
```

## API behavior

Frontend-gateway should fetch:

- shared content;
- gateway content;
- motorsport teaser content where `showOnGateway = true`.

Frontend-motorsport should fetch:

- motorsport content;
- shared content relevant to business `sarga-motorsport`.

## Migration caution

Do not delete existing CMS content types. Extend them carefully and create migrations/schema changes through Strapi's normal content-type builder or code-based schema files.

Do not duplicate `event`, `news-article`, `partner`, `ticket-cta`, or `media-gallery` just to create separate CMS menus. Prefer a Strapi admin workspace/plugin layer with filtered links, then add site-scoped page/program models only where the data shape requires them.

## Implementation status (Phase 2)

Implemented via code-based schema files under `cms/src` (mirrored in
`strapi/content-types.json`). Verified against a running Strapi (auto-migrated
columns/tables) with public read permissions granted in `cms/src/seed.ts`.

Delivered:

- **New collection types**: `site`, `partner`, `ticket-cta`, `media-gallery`.
- **New component**: `shared.event-session` (repeatable event schedule).
- **Site-aware fields** on `event`, `news-article`, `ticket-cta`, `partner`,
  `media-gallery`, and `ecosystem-business`: `siteScope`
  (`gateway|motorsport|shared|hidden`) + optional many-to-many `sites` relation.
- **Cross-site teaser flags**: `showOnGateway` / `showOnMotorsport` on events
  and news (plus `featuredOnGateway` / `featuredOnMotorsport` on news).
- **Event motorsport fields**: `racingCategory`, `seriesName`, `circuitName`,
  `venueAddress`, `schedule`, `heroMedia`, `gallery`, `broadcastUrl`,
  `ticketCtas`, `sponsors`.
- Seed demo: `sarga-gateway` + `sarga-motorsport` Site records and a motorsport
  demo set (event + ticket CTA + partner + news) for query verification.

Deliberate deviations / deferrals:

- The Event spec's singular `ticketCta` is implemented as a bidirectional
  one-to-many `event.ticketCtas` ↔ `ticket-cta.relatedEvent` (one event, many
  CTAs) to avoid a duplicate relation.
- `eventStatus` and `news-article.category` enums were **extended, not
  replaced**, keeping the original gateway values for backward compatibility.
- `Page`, `Navigation Menu`, `Footer Menu`, and `Campaign Landing Page` are
  **not** created in this phase — they do not exist yet as content types, so
  building them is deferred to the phase that needs them.

Migration caveat for existing databases: records created before the `siteScope`
field existed will have a `null` scope (Strapi applies enum defaults on create,
not retroactively). Frontends should treat a missing `siteScope` as
gateway/shared. A fresh seed (empty DB) assigns explicit scopes.

## Major revamp implementation status (MSR-2)

MSR-2 adds the site workspace and program-shaped content that did not belong in
the original shared Event/News schema phase:

- Admin menu/dashboard workspaces for Gateway, Motorsport, Horse Sport, and
  Shared Library, using permission-gated links and grouped dashboard
  sub-navigation into the same shared collections.
- Managed Gateway, Motorsport, Horse Sport, and Shared admin roles with
  conditional `siteScope` record access and a forced-scope admin write guard.
- Optional environment-based dedicated admin account provisioning without
  repository-stored credentials.
- `site-page` for site-scoped static/campaign page ownership.
- `motorsport-program`, `motorsport-rider`, `motorsport-standing`, and
  `motorsport-regulation` for IJTC and FIA campaign/program data.
- `merchandise-item` for external/inquiry/coming-soon teasers only.
- Shared page-section plus Motorsport campaign-slide, rundown-item, and rule-item
  components.
- Idempotent demo records for IJTC, FIA Rallycross World Cup Indonesia 2026,
  and Merchandise.

### MSR-6 rider and schedule refinement

- IJTC demo content now includes 20 fictional `motorsport-rider` records, 20
  related `motorsport-standing` rows, eight programme rundown entries, and 20
  individually sliced rider portraits supplied as one 5×4 grid. Stable rider
  slugs make restarts
  idempotent and drive the public shared profile template.
- `motorsport.rundown-item` adds optional `dateLabel`, `venue`, and controlled
  `status` fields so schedule cards no longer rely on programme-level dates.
- Portrait relations remain optional; the frontend derives accessible rider
  labels and renders a numbered silhouette when media is absent or unavailable.

### MSR-7 FIA Rallycross campaign refinement

- The existing `motorsport-program` record is the campaign source of truth; its
  hero media, `bannerSlides`, `rundown`, `eventRules`, related Ticket CTA, and SEO
  component supply the dedicated campaign template without a new collection.
- The demo completion seed adds three locally approved campaign slide images,
  five ordered session entries, six ordered spectator rules, and share metadata
  only while that stable FIA record is incomplete.
- Ticket destinations are normalized by the frontend safety adapter. HTTPS
  redirects are permitted, deep links require an allowed scheme, and embeds
  require an allowed host; unsupported destinations fall back to `/tickets`.

The real schemas remain under `cms/src/api/**/schema.json` and
`cms/src/components/**`; `strapi/content-types.json` is updated as their
documentation mirror. Public access is read-only (`find`/`findOne`) for the six
new collections. Existing Event, News, Partner, Ticket CTA, and Gallery
collections were reused rather than duplicated.

## MSR-RD3 additive extension

MSR-RD3 adds the `motorsport.hero-slide` repeatable component to the Motorsport
`site-page` Home record. It carries responsive image media, alt
text, a controlled subject anchor, concise copy, one optional CTA, active state,
and deterministic order. Existing single-hero fields remain required as a
migration/failure fallback until the new carousel has passed UAT.

The live Strapi schema, generated types, `strapi/content-types.json` mirror,
and idempotent seed are updated. The seed supplies three ordered warm scenes
with desktop and mobile media and does not overwrite an existing editor-managed
carousel. The one-CMS architecture, `siteScope` enforcement, Motorsport
workspace visibility, and Super Admin access rules remain unchanged.
