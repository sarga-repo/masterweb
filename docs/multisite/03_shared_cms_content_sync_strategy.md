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
2. A managed site editor enters the dedicated Gateway, Motorsport, or Horse
   Sport workspace; its role assigns `siteScope` automatically.
3. Super Admin selects `shared` or `hidden` only for deliberately cross-site or
   withheld content. Business relations and teaser flags remain explicit where
   the content model requires them.
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
create/update/clone operations. GWR-CMS-2 also removes
`siteScope` from managed site-editor field access and presents an immutable
workspace badge; the field remains visible and editable to Super Admin. Assign
exactly one managed role per dedicated site account. The shared Media Library is
not row-scoped; use site-named folders and do not treat it as a confidential
asset store.

Authenticated GWR-CMS-3 UAT verifies direct routes, modified filters,
submitted foreign scope, clone, publish, relation selectors, and a temporary
multi-role assignment. Relation targets use narrowly conditioned read-only Site
and Ecosystem Business permissions; nested component fields remain writable on
owned records. Repeatable evidence and editor procedures live in
`docs/strapi-admin-menu/`.

## When to split CMS later

Consider a separate CMS only if the implemented role and record segregation is
no longer sufficient because:

- Deployment ownership becomes separate.
- There are regulatory or infrastructure-level data isolation requirements.
- Publishing approval flows become incompatible.
- CMS performance or content scale becomes a bottleneck.

## Bilingual authoring and navigation (GWR-CMS-5)

The one-CMS model now provides English/Indonesian localizations only for
approved public editorial types. Locale never replaces `siteScope`: ownership is
evaluated first, then locale. A Gateway editor can manage Gateway English and
Indonesian localizations but cannot access Motorsport or Horse Sport records.

Top Navigation uses site-scoped localized records. English controls structural
URL, visibility, order, and emphasis; Indonesian supplies translated labels.
Frontend resolvers fetch the English structural master and requested locale,
then apply a strict configured-menu/outage fallback contract. See
`docs/strapi-admin-menu/05_gwr_cms_4_i18n_navigation_assessment.md`. The CMS/API
foundation is complete. Gateway now consumes this contract with English at the
existing paths and Indonesian under `/id`; Motorsport and Horse Sport remain
unchanged pending GWR-CMS-7 approval.
