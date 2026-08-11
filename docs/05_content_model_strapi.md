# 05 — Strapi Content Model

## CMS choice

The agreed CMS is **Strapi**. Strapi is recommended because it supports headless content management, REST/GraphQL APIs, admin roles, media library, custom content types, and flexible deployment with PostgreSQL.

## Content type overview

### Single Types

1. Site Settings
2. Homepage
3. About Page
4. Ecosystem Landing Page
5. Ticket Hub Landing Page
6. Careers Page
7. Contact Page
8. SEO Defaults

### Collection Types

1. Ecosystem Business
2. News Article
3. Event
4. Timeline Item
5. Leadership Person
6. Report/Charter
7. Career Opening
8. Inquiry Submission
9. Newsletter Subscription
10. Navigation Link
11. Footer Link

## Single type: Site Settings

| Field            | Type                 | Notes                              |
| ---------------- | -------------------- | ---------------------------------- |
| siteName         | Text                 | Sarga.co                           |
| legalCompanyName | Text                 | PT Sarga Multi Ekosistem           |
| logo             | Media                | Header logo                        |
| footerLogo       | Media                | Footer logo                        |
| primaryEmail     | Email                | Contact destination                |
| phone            | Text                 | Optional                           |
| address          | Text/Rich Text       | Optional                           |
| socialLinks      | Component repeatable | Instagram, LinkedIn, YouTube, etc. |
| defaultOgImage   | Media                | Used by SEO fallback               |

## Single type: Homepage

| Field              | Type      | Notes                              |
| ------------------ | --------- | ---------------------------------- |
| heroEyebrow        | Text      | 360° SPORTS & ENTERTAINMENT LEADER |
| heroTitle          | Text      | Main headline                      |
| heroDescription    | Rich Text | Hero body                          |
| heroImage          | Media     | Desktop image                      |
| heroImageMobile    | Media     | Optional mobile image              |
| heroVideo          | Component | Optional muted MP4/WebM hero loop  |
| primaryCtaLabel    | Text      | Explore Ecosystem                  |
| primaryCtaUrl      | Text      | /ecosystem                         |
| secondaryCtaLabel  | Text      | Corporate Root                     |
| secondaryCtaUrl    | Text      | /about                             |
| aboutSummaryTitle  | Text      | About                              |
| aboutSummaryBody   | Rich Text | Corporate description              |
| featuredBusinesses | Relation  | Ecosystem Business                 |
| featuredArticles   | Relation  | News Article                       |
| featuredEvents     | Relation  | Event                              |
| seo                | Component | SEO                                |

## Collection type: Ecosystem Business

| Field            | Type        | Notes                                                                                    |
| ---------------- | ----------- | ---------------------------------------------------------------------------------------- |
| name             | Text        | Sarga Horse Sport                                                                        |
| slug             | UID         | sarga-horse-sport                                                                        |
| pillar           | Enumeration | sports, venue, media, technology, festival, other                                        |
| shortDescription | Text        | Card text                                                                                |
| overview         | Rich Text   | Detail page body                                                                         |
| heroImage        | Media       | Hero                                                                                     |
| cardImage        | Media       | Card                                                                                     |
| logo             | Media       | Optional                                                                                 |
| ctaLabel         | Text        | Find Out More                                                                            |
| ctaUrl           | Text        | Optional override                                                                        |
| businessStatus   | Enumeration | active, comingSoon, hidden (renamed from `status`: reserved attribute name in Strapi v5) |
| launchTarget     | Text/Date   | e.g., August 2026                                                                        |
| order            | Number      | Sorting                                                                                  |
| relatedArticles  | Relation    | News Article                                                                             |
| relatedEvents    | Relation    | Event                                                                                    |
| seo              | Component   | SEO                                                                                      |
| pageAvailability | Component   | Authoritative full-page/Coming Soon switch and managed launch copy                       |

For Gateway-owned internal ventures, enabling the full page requires a managed
`overview` and at least one `highlights` entry. Media, related articles, and
related events are optional and render only when supplied. Missing live-page
copy fails closed to the Coming Soon template. Motorsport and Horse Sport use
their dedicated frontends; `dedicatedSiteUrl` is a validated fallback behind
the deployment environment URL.

## Collection type: Site Page

`Site Page` owns site-scoped static and campaign composition. GWR-1 adds
`history` and `reportIndex` page kinds plus the reusable `pageAvailability`
component. Gateway records use canonical `routePath` values and retain
`siteScope: gateway`, so the existing workspace permissions remain the
security boundary. GWR-CMS-9 adds an optional `heroVideo` component for the
Gateway and Horse Sport home records. Motorsport home records can instead add
the same video component inside each of their maximum three ordered
`heroSlides`.

GWR-CMS-10 adds three Motorsport-home-only fields to the same Site Page:

| Field                     | Type             | Notes                                                           |
| ------------------------- | ---------------- | --------------------------------------------------------------- |
| motorsportFeaturedEvent   | Relation → Event | Optional explicit Race Control source; validated at render time |
| motorsportInformationBand | Component        | Enabled state, section copy, stat labels, and region            |
| motorsportWorldSection    | Component        | Enabled state, heading/CTA copy, and up to six discipline cards |

Each discipline card has a stable internal name, enabled state, title, short
label, optional managed image/alt text, safe destination, one approved brand
accent, and sort order. Missing fields retain the approved frontend fallback;
the development seed backfills only empty components and relations.

## Component: Hero Video

| Field             | Type    | Notes                                                    |
| ----------------- | ------- | -------------------------------------------------------- |
| enabled           | Boolean | Explicit editorial on/off control; defaults true         |
| primaryVideo      | Media   | Required video; use an approved MP4 or WebM source       |
| alternateVideo    | Media   | Optional second codec for broader browser support        |
| posterImage       | Media   | Recommended desktop poster and autoplay/error fallback   |
| mobilePosterImage | Media   | Optional mobile crop; falls back to desktop poster/image |

Video is presentation media, not a replacement for accessible hero copy. The
frontends autoplay only muted, looping, inline background video; provide a
visible pause/play control, keep the poster visible until playback is ready,
and do not mount the video when `prefers-reduced-motion: reduce` is active.
Unsupported video MIME types fail back to the managed image.

## Component: Page Availability

| Field                 | Type      | Notes                                                          |
| --------------------- | --------- | -------------------------------------------------------------- |
| pageEnabled           | Boolean   | Authoritative full-page vs. Coming Soon switch; defaults false |
| comingSoonEyebrow     | Text      | Optional contextual label                                      |
| comingSoonTitle       | Text      | Managed launch-state heading                                   |
| comingSoonDescription | Rich Text | Managed public explanation                                     |
| comingSoonMedia       | Media     | Optional image for the launch state                            |
| launchTargetLabel     | Text      | Optional non-binding launch label                              |
| showNotifyCta         | Boolean   | Reuses the approved newsletter/contact path                    |
| noIndexWhileDisabled  | Boolean   | Defaults true for pre-launch pages                             |

## Collection type: Corporate Report

`Corporate Report` is the managed source for the Gateway Annual Report and
Sustainability Report libraries. It is available in the Gateway and Shared CMS
workspaces and is never treated as a valid public download unless an editor
provides an approved uploaded file or an `http`/`https` external URL.

| Field             | Type        | Notes                                               |
| ----------------- | ----------- | --------------------------------------------------- |
| title             | Text        | Required public report title                        |
| slug              | UID         | Stable report identifier                            |
| reportType        | Enumeration | `annual` or `sustainability`                        |
| year              | Number      | Reporting year used for ordering and display        |
| summary           | Text        | Short index-card description                        |
| coverImage        | Media       | Optional report cover artwork                       |
| reportFile        | Media       | Optional approved downloadable file                 |
| externalUrl       | Text        | Optional approved `http`/`https` report destination |
| publicationStatus | Enumeration | `published`, `forthcoming`, or `archived`           |
| publishedDate     | Date        | Optional publication date                           |
| order             | Number      | Editorial ordering override                         |
| siteScope         | Enumeration | `gateway`, `shared`, or `hidden`                    |
| seo               | Component   | Report metadata                                     |

The frontend renders a managed empty state when no records exist, and a
forthcoming state when a record is not yet released. It does not fabricate
files, URLs, or publication dates.

## Collection type: Job Vacancy

`Job Vacancy` owns the Gateway careers roster and reusable role detail pages.
Gateway and Shared workspace editors can manage records, while draft/publish,
`siteScope`, and `vacancyStatus` determine public availability. Applications
remain external: the CMS and frontend accept only HTTPS LinkedIn destinations.

| Field            | Type        | Notes                                                                |
| ---------------- | ----------- | -------------------------------------------------------------------- |
| title            | Text        | Required public role title                                           |
| slug             | UID         | Stable `/careers/jobs/[slug]` identifier                             |
| discipline       | Enumeration | sport-operations, venue-experience, media-creative, technology-group |
| summary          | Text        | Required list-card summary                                           |
| description      | Rich Text   | Required role overview                                               |
| responsibilities | Rich Text   | Optional responsibility detail                                       |
| requirements     | Rich Text   | Optional candidate requirements                                      |
| location         | Text        | Required public location                                             |
| employmentType   | Enumeration | full-time, part-time, contract, internship                           |
| workMode         | Enumeration | onsite, hybrid, remote                                               |
| seniority        | Text        | Optional seniority label                                             |
| applicationUrl   | Text        | Optional HTTPS LinkedIn URL; validated in CMS and frontend           |
| vacancyStatus    | Enumeration | open, closed, filled                                                 |
| postedDate       | Date        | Required publication date                                            |
| closingDate      | Date        | Optional closing date                                                |
| featured         | Boolean     | Roster sort priority                                                 |
| order            | Number      | Editorial ordering override                                          |
| siteScope        | Enumeration | gateway, shared, hidden                                              |
| seo              | Component   | Vacancy metadata                                                     |

Only published, non-hidden records are fetched. The public roster counts and
lists `open` records; closed and filled detail records remain non-applicable.
An absent or rejected LinkedIn URL produces an informational state, never a
substitute contact or internal application form.

## Collection type: Site

| Field       | Type    | Notes                                               |
| ----------- | ------- | --------------------------------------------------- |
| name        | Text    | Public site name                                    |
| slug        | UID     | Stable site identifier                              |
| baseUrl     | Text    | Public/local destination                            |
| description | Text    | Ecosystem-list summary                              |
| logo        | Media   | Optional site identity                              |
| favicon     | Media   | Optional browser icon                               |
| themeKey    | Text    | gateway, motorsport, or horsesport routing key      |
| order       | Number  | Ecosystem-list display order                        |
| isActive    | Boolean | Controls whether the site is exposed in public hubs |

## Collection type: Leadership Person

| Field    | Type        | Notes                              |
| -------- | ----------- | ---------------------------------- |
| name     | Text        | Required                           |
| role     | Text        | Public role title                  |
| summary  | Text        | Short homepage/content-hub profile |
| group    | Enumeration | board, executive, advisor          |
| order    | Number      | Display order                      |
| portrait | Media       | About and content-hub portrait     |

## Collection type: News Article

| Field             | Type             | Notes                                              |
| ----------------- | ---------------- | -------------------------------------------------- |
| title             | Text             | Required                                           |
| slug              | UID              | Required                                           |
| excerpt           | Text             | Card summary                                       |
| body              | Rich Text/Blocks | Article content                                    |
| coverImage        | Media            | Card/detail hero                                   |
| category          | Enumeration      | news, publication, press-release, report, magazine |
| publishedDate     | Date             | Display date                                       |
| isHotTopic        | Boolean          | Badge                                              |
| author            | Text             | Optional                                           |
| relatedBusinesses | Relation         | Ecosystem Business                                 |
| seo               | Component        | SEO                                                |
| publishedAt       | DateTime         | Strapi publishing                                  |

## Collection type: Event

| Field                 | Type        | Notes                                                                                      |
| --------------------- | ----------- | ------------------------------------------------------------------------------------------ |
| title                 | Text        | Required                                                                                   |
| slug                  | UID         | Required                                                                                   |
| description           | Rich Text   | Event detail                                                                               |
| eventDate             | DateTime    | Required if known                                                                          |
| endDate               | DateTime    | Optional                                                                                   |
| venue                 | Text        | Optional                                                                                   |
| coverImage            | Media       | Card/detail                                                                                |
| business              | Relation    | Ecosystem Business                                                                         |
| ticketCtaLabel        | Text        | Buy Ticket / Get Ticket                                                                    |
| ticketUrl             | Text        | Partner ticketing URL                                                                      |
| ticketIntegrationType | Enumeration | redirect, deepLink, embed                                                                  |
| embedCode             | Text        | Optional, sanitize carefully                                                               |
| embedUrl              | Text        | Optional HTTPS iframe URL; rendered only for allowlisted hosts                             |
| eventStatus           | Enumeration | upcoming, live, past, hidden (renamed from `status`: reserved attribute name in Strapi v5) |
| seo                   | Component   | SEO                                                                                        |

## Collection type: Inquiry Submission

| Field                     | Type        | Notes                                                                             |
| ------------------------- | ----------- | --------------------------------------------------------------------------------- |
| name                      | Text        | Required                                                                          |
| email                     | Email       | Required; notification Reply-To only                                              |
| phone                     | Text        | Optional                                                                          |
| company                   | Text        | Optional                                                                          |
| inquiryType               | Enumeration | partnership, sponsorship, media, event, venue, career, ticketing, stable, general |
| message                   | Text        | Required                                                                          |
| sourcePage                | Text        | URL                                                                               |
| sourceSite                | Enumeration | gateway, motorsport, horsesport                                                   |
| sourceLocale              | Enumeration | en, id                                                                            |
| submittedAt               | DateTime    | Auto                                                                              |
| status                    | Enumeration | new, contacted, closed                                                            |
| notificationStatus        | Enumeration | Private durable outbox state: disabled, pending, processing, sent, failed         |
| notificationAttempts      | Integer     | Private bounded-attempt counter                                                   |
| notificationNextAttemptAt | DateTime    | Private retry schedule                                                            |
| notificationLastAttemptAt | DateTime    | Private worker audit                                                              |
| notificationSentAt        | DateTime    | Private success audit                                                             |
| notificationLastErrorCode | Text        | Private safe classification only                                                  |
| internalNotes             | Text        | Admin only                                                                        |

The MAIL-3 worker routes stored inquiries to fixed, environment-owned recipient
allowlists after persistence. These private fields are never accepted from the
visitor as authoritative values. Newsletter Subscription remains storage-only;
Exchange Online is not used as a campaign sender.

## Collection type: Newsletter Subscription

| Field        | Type        | Notes                |
| ------------ | ----------- | -------------------- |
| email        | Email       | Required             |
| sourcePage   | Text        | Optional             |
| consent      | Boolean     | Optional             |
| subscribedAt | DateTime    | Auto                 |
| status       | Enumeration | active, unsubscribed |

## Component: SEO

| Field           | Type    | Notes         |
| --------------- | ------- | ------------- |
| metaTitle       | Text    | 50–60 chars   |
| metaDescription | Text    | 140–160 chars |
| ogTitle         | Text    | Optional      |
| ogDescription   | Text    | Optional      |
| ogImage         | Media   | Optional      |
| canonicalUrl    | Text    | Optional      |
| noIndex         | Boolean | Default false |

## Motorsport homepage carousel (implemented in MSR-RD3)

The approved MSR-RD2 design contract is implemented as the repeatable
`motorsport.hero-slide` component to the Motorsport-scoped `site-page` Home
record. The parent record retains
`siteScope`, site relation, draft/publish, and role segregation; existing
single-hero fields remain the migration/runtime fallback. The component
supports one to three ordered active slides, desktop and optional mobile poster
media, an optional `shared.hero-video`, required alt text, crop anchor, concise
copy, and one optional CTA. Only the active slide mounts its video, preventing
three simultaneous hero downloads. See
`docs/motorsport/revamp/11_redesign_foundations_page_templates.md` for the
field, media, order, accessibility, and migration contract.

## API requirements

Frontend should use Strapi API through typed service functions. Do not call Strapi directly from random components.

Recommended service structure:

```text
src/lib/strapi/
├── client.ts
├── homepage.ts
├── ecosystem.ts
├── news.ts
├── events.ts
├── forms.ts
└── types.ts
```

## Content governance

- All public content should use Strapi draft/publish workflow.
- Managed Gateway, Motorsport, Horse Sport, and Shared admin roles can publish
  only records matching their assigned `siteScope`; Super Admin can publish all.
- Global Site, Leadership Person, and Timeline Item records have no `siteScope`
  and are editable only by Shared Library Admin and Super Admin.
- Assign exactly one managed Sarga site role per dedicated admin account.
- Admin creates/updates/clones are forced to the managed account's scope by the
  server write guard; UI filters alone are not the security boundary.
- Managed site editors do not choose `siteScope`: the GWR-CMS segregation
  contract excludes it from their create/update fields and shows immutable
  workspace context. Super Admin retains scope access for shared/hidden and
  reviewed cross-site operations.
- Writable-field permissions recursively include nested component and dynamic
  zone paths (for example `seo.metaTitle`) while still excluding `siteScope`.
- Dedicated roles receive only conditioned read access to the Site and/or
  Ecosystem Business row needed by their relation fields; those global
  references remain non-writable.
- Media assets must include alt text.
- Media Library assets are shared because upload files have no `siteScope`; use
  site-named folders and do not store confidential assets there.
- Slugs must be reviewed before publishing.
- Broken external ticket links must be checked before go-live.

## i18n and Top Navigation extension (GWR-CMS-5)

Strapi 5.49 now registers English (`en`) and Indonesian (`id`) with English as
the default locale. The migration was rehearsed from a PostgreSQL/uploads
backup before being applied locally. The approved type/field matrix is in
`docs/strapi-admin-menu/05_gwr_cms_4_i18n_navigation_assessment.md` and the
evidence is in `docs/strapi-admin-menu/10_gwr_cms_5_migration_rehearsal.md`.

Editorial text and SEO fields are localized; `siteScope`, stable slugs,
relations, dates, publication controls, URLs, statuses, ordering, and other
operational fields remain structural. Missing Indonesian content falls back to
the complete English document, not a field-by-field mixed record.

The localized `Top Navigation Item` collection owns one header link per record
with server-assigned `siteScope`, localized label/ARIA label, structural
URL/link type, global enabled toggle/order/emphasis, and draft/publish. English
is the structural master; Indonesian owns translated labels. Managed roles can
author only their site's records and Super Admin can manage all sites.

Inquiry and newsletter records remain non-localized and instead record the
submission's `sourceLocale`. Motorsport standings, Site directory, Partner,
and ticket destination records remain structural in the first release.

Localized editorial types are Homepage, Site Page, News Article, Event,
Ecosystem Business, Corporate Report, Job Vacancy, Leadership Person, Timeline
Item, Media Gallery, Merchandise Item, Motorsport Program, Motorsport Rider,
Motorsport Regulation, and Top Navigation Item. Stable `slug` and `routePath`
values are enforced across locales. Strapi treats UID and relation fields as
locale-specific internally; route parity is enforced by CMS middleware and
relation behavior is included in authenticated UAT.
