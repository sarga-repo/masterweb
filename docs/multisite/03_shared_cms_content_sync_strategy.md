# Shared CMS Content Sync Strategy

## Recommendation

Use one Strapi CMS with site-aware content models.

## Core concept

Every content item that may appear on more than one frontend should include a visibility/scope field.

Recommended enum:

```text
gateway
motorsport
horsesport
shared
hidden
```

For future scalability, this can later become a relation to a `Site` collection.

## Content visibility behavior

### `gateway`

Visible only on the Sarga.co gateway.

### `motorsport`

Visible only on the dedicated Sarga Motorsport frontend.

### `horsesport`

Visible only on the dedicated Sarga Horse Sport frontend.

### `shared`

Eligible for multiple frontends. Each frontend decides how to render it based on its design system.

### `hidden`

Saved in CMS but not shown publicly.

## Recommended shared content types

- News Article
- Event
- Ticket CTA
- Campaign Landing Page
- Media Gallery
- Sponsor/Partner
- SEO Metadata
- Global Site Settings
- Navigation Menu
- Footer Menu

## Motorsport-specific extensions

Events and news should support motorsport-specific metadata:

- racing category
- circuit/venue
- series/championship
- session schedule
- ticket provider
- official ticket URL
- event status
- hero media
- gallery media
- sponsor/partner logos
- broadcast or livestream URL

## Ticketing sync

Ticketing should be centralized in CMS.

Recommended ticket CTA model:

```text
title
label
provider
ctaType: redirect | deep_link | embed
url
embedConfig
relatedEvent
siteScope
startsAt
endsAt
isActive
trackingParams
```

Gateway can show a broad `Ticket Hub` that lists upcoming ticket CTAs across the Sarga ecosystem. Motorsport can show motorsport-only ticket CTAs with richer event context.

## Query examples

Gateway event preview:

```text
fetch events where siteScope in ['gateway', 'shared'] or business.slug == 'sarga-motorsport' and showOnGateway == true
```

Motorsport event listing:

```text
fetch events where business.slug == 'sarga-motorsport' and siteScope in ['motorsport', 'shared']
```

## Editorial workflow

1. Editor creates event/news once.
2. Editor selects business: Sarga Motorsport.
3. Editor selects site visibility.
4. Gateway displays it as teaser if eligible.
5. Motorsport displays it as full native content.

## Admin workspace and access model

Keep one CMS while separating editor access through managed Strapi admin roles:

- `sarga-gateway-admin` sees the Gateway workspace and `gateway` records.
- `sarga-motorsport-admin` sees the Motorsport workspace and `motorsport` records.
- `sarga-horsesport-admin` sees the Horse Sport workspace and `horsesport` records.
- `sarga-shared-admin` sees the Shared Library workspace and `shared` records.
- Super Admin sees all four workspaces and all records.

Custom Content Manager conditions enforce scoped reads and mutations, while a
Document Service write guard forces the managed role's scope on admin
create/update/clone operations. Assign exactly one managed role per dedicated
site account. The shared Media Library is not row-scoped; use site-named folders
and do not treat it as a confidential asset store.

## When to split CMS later

Consider a separate CMS only if the implemented role and record segregation is
no longer sufficient because:

- Deployment ownership becomes separate.
- There are regulatory or infrastructure-level data isolation requirements.
- Publishing approval flows become incompatible.
- CMS performance or content scale becomes a bottleneck.
