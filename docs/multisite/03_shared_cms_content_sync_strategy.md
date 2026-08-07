# Shared CMS Content Sync Strategy

## Recommendation

Use one Strapi CMS with site-aware content models.

## Core concept

Every content item that may appear on more than one frontend should include a visibility/scope field.

Recommended enum:

```text
gateway
motorsport
shared
hidden
```

For future scalability, this can later become a relation to a `Site` collection.

## Content visibility behavior

### `gateway`

Visible only on the Sarga.co gateway.

### `motorsport`

Visible only on the dedicated Sarga Motorsport frontend.

### `shared`

Eligible for both frontends. Each frontend decides how to render it based on its design system.

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

## When to split CMS later

Consider separate CMS only if:

- Sarga Motorsport has a separate editorial team requiring independent permissions.
- Deployment ownership becomes separate.
- There are data isolation requirements.
- Publishing approval flows become incompatible.
- CMS performance or content scale becomes a bottleneck.
