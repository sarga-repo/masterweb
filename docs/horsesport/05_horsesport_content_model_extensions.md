# 05 — Horse Sport Content Model Extensions

## Recommendation

Use the existing shared Strapi CMS and extend it for three-site publishing.

Do not create a separate CMS.

## Site scope enum

Update all relevant content types to support:

```text
gateway
motorsport
horsesport
shared
hidden
```

## Site collection optional upgrade

For future scalability, create a `Site` collection later:

```text
name
key: gateway | motorsport | horsesport
baseUrl
logo
favicon
seoDefaults
isActive
```

For the current implementation, enum-based `siteScope` is sufficient.

## Shared fields to add across News/Event/Ticket/Gallery/Campaign

| Field                   | Type        | Notes                                           |
| ----------------------- | ----------- | ----------------------------------------------- |
| `siteScope`             | Enumeration | gateway, motorsport, horsesport, shared, hidden |
| `primaryBusiness`       | Relation    | Ecosystem Business                              |
| `showOnGateway`         | Boolean     | Whether gateway can show teaser                 |
| `showOnMotorsport`      | Boolean     | Whether Motorsport can show teaser              |
| `showOnHorseSport`      | Boolean     | Whether Horse Sport can show teaser             |
| `targetSiteUrlOverride` | Text        | Optional canonical external path override       |
| `canonicalSite`         | Enumeration | gateway, motorsport, horsesport                 |

## Ecosystem Business extension

Update `Ecosystem Business` with:

| Field              | Type        | Notes                              |
| ------------------ | ----------- | ---------------------------------- |
| `dedicatedSiteKey` | Enumeration | none, motorsport, horsesport       |
| `dedicatedSiteUrl` | Text        | e.g. `https://horsesport.sarga.co` |
| `openBehavior`     | Enumeration | internal, external, newTab         |
| `brandLogoLight`   | Media       | White logo                         |
| `brandLogoDark`    | Media       | Black/dark text logo               |
| `brandIcon`        | Media       | Horse-jockey symbol/favicon        |

## Horse Sport Event extension

For Event content where `primaryBusiness.slug = sarga-horse-sport`, support:

| Field              | Type                 | Notes                                                               |
| ------------------ | -------------------- | ------------------------------------------------------------------- |
| `eventDiscipline`  | Enumeration          | derby, turf, exhibition, championship, hospitality, training, other |
| `raceClass`        | Text                 | Optional race classification                                        |
| `venueName`        | Text                 | Race venue/track name                                               |
| `trackType`        | Enumeration          | turf, dirt, mixed, indoor, other                                    |
| `raceSchedule`     | Component repeatable | time, title, description                                            |
| `hospitalityInfo`  | Rich Text            | VIP, lounge, family zone, etc.                                      |
| `stableAccessInfo` | Rich Text            | Optional                                                            |
| `ticketCta`        | Relation             | Ticket CTA                                                          |
| `gallery`          | Relation             | Media Gallery                                                       |

## Horse Sport News extension

Recommended Horse Sport news categories:

```text
race-results
event-announcement
turf-venue
stable-life
jockey-story
equine-performance
partnership
publication
```

Fields:

- `horseSportCategory`
- `relatedEvent`
- `relatedVenue`
- `relatedGallery`
- `featuredOnHorseSportHome`

## Ticket CTA extension

Centralize ticketing:

```text
title
label
provider
ctaType: redirect | deep_link | embed
url
embedUrl
embedConfig
relatedEvent
primaryBusiness
siteScope
showOnGateway
showOnMotorsport
showOnHorseSport
startsAt
endsAt
isActive
trackingParams
```

Rules:

- Gateway can display broad Ticket Hub items.
- Horse Sport displays only Horse Sport-specific or shared eligible ticket CTAs.
- Use partner redirect/deep link as default.
- Embed only if allowlisted and CMS-configured.

## Media Gallery collection

Recommended fields:

```text
title
slug
description
siteScope
primaryBusiness
category: race-day | stable-life | venue | jockey | hospitality | press | other
coverImage
mediaItems[]: media, caption, altText, credit
relatedEvent
publishedDate
seo
```

## Contact / inquiry forms

Use shared inquiry submission model and add:

```text
sourceSite: gateway | motorsport | horsesport
inquiryType: ticketing | partnership | sponsorship | media | event | venue | stable | general
relatedEvent
```

## Horse Sport home hero video

The scoped `horsesport-home` Site Page is the CMS entry point for optional hero
video. Its non-repeatable `shared.hero-video` component contains an enabled
switch, required primary video, optional alternate codec, and optional desktop
and mobile posters. The frontend uses the managed hero image/poster as the
fallback, never renders audio, provides pause/play, and does not mount video for
reduced-motion visitors. With no CMS component, the existing local Horse Sport
loop remains a development/runtime fallback; setting the component to disabled
explicitly forces the static poster.

Promote the database and uploads archive together so video media relations do
not point at missing files. The component remains inside the existing
Horse Sport role/scope boundary; it does not introduce a separate CMS.

## Query examples

Horse Sport homepage featured events:

```text
where primaryBusiness.slug == 'sarga-horse-sport'
and siteScope in ['horsesport', 'shared']
and eventStatus in ['upcoming', 'live']
order by eventDate asc
```

Gateway Horse Sport teasers:

```text
where primaryBusiness.slug == 'sarga-horse-sport'
and showOnGateway == true
and siteScope in ['horsesport', 'shared']
```

Horse Sport news listing:

```text
where siteScope in ['horsesport', 'shared']
and primaryBusiness.slug == 'sarga-horse-sport'
order by publishedDate desc
```
