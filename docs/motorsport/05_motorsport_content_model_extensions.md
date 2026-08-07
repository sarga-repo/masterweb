# Motorsport Content Model Extensions for Shared Strapi CMS

## Existing CMS principle

Keep one Strapi CMS and extend content models to support multisite and motorsport-specific data.

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
