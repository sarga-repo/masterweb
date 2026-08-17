# Motorsport CMS Preview Route and Content Inventory

## Document status

- Phase: 0 - route, content, locale, relation, and fallback inventory
- Status: Complete
- Date: 2026-08-15
- Scope: `frontend-motorsport/` public routes and CMS content consumed by those routes
- Implementation: No application code changed during this phase
- CMS: Strapi 5.49.0
- Frontend: Next.js App Router

## 1. Executive result

Motorsport has 21 `page.tsx` route files, one IJTC route layout, two supported
locales (`en` and `id`), and several aggregate pages whose visible output comes
from multiple CMS records. Preview cannot be considered complete by adding a
single UID-to-slug mapping. Several records resolve to a parent program or
global consumer route.

Current Preview handler supports these UIDs:

- `api::news-article.news-article`
- `api::site-page.site-page`
- `api::event.event`
- `api::site.site`
- `api::partner.partner`
- `api::media-gallery.media-gallery`
- `api::merchandise-item.merchandise-item`
- `api::ticket-cta.ticket-cta`

The current handler does not support these Motorsport-consumed or globally
visible records:

- `api::top-navigation-item.top-navigation-item`
- `api::motorsport-program.motorsport-program`
- `api::motorsport-rider.motorsport-rider`
- `api::motorsport-standing.motorsport-standing`
- `api::motorsport-regulation.motorsport-regulation`
- `api::leadership-person.leadership-person`

`api::ecosystem-business.ecosystem-business` is related by CMS schemas but is
not directly rendered by the current Motorsport frontend adapters. It remains
out of the Motorsport Preview scope unless a route starts consuming it.

## 2. Route matrix

All localized routes use the same route family with `/id` prefixed for the
Indonesian locale. `/` and `/id` are equivalent home routes.

| Route family | Public route | Direct CMS sources | Nested or related sources | Current fallback behavior | Preview state |
| --- | --- | --- | --- | --- | --- |
| Home | `/`, `/id` | `site-page` with `pageKind=home`, `routePath=/` | `top-navigation-item`, `site`, `event`, `news-article`, `partner`, `media-gallery`, `ticket-cta`, `leadership-person`, `motorsport-program` | Homepage aggregate fallbacks, repository navigation fallback, site chrome fallback, fallback leadership/programs/media | Partial. Site Page is mapped; aggregate dependencies are not fully mapped |
| About | `/about`, `/id/about` | `site-page` with `pageKind=about` | `leadership-person` | Static page copy, fallback team, fallback capability cards | Partial. Site Page mapped; leadership unsupported |
| Experience | `/experience`, `/id/experience` | `site-page` with `routePath=/experience` | Shared page sections and media | Static experience pillar fallback when CMS section absent | Partial. Site Page route is mapped |
| Contact | `/contact`, `/id/contact` | `site-page` with `routePath=/contact` | Shared page sections | Static form copy and defaults | Partial. Site Page route is mapped |
| Partners | `/partners`, `/id/partners` | `site-page` with `routePath=/partners`, `partner` | Partner logos/media | Empty or static presentation fallback | Partial. Site Page and Partner are mapped |
| Tickets | `/tickets`, `/id/tickets` | `site-page` with `routePath=/tickets`, `ticket-cta`, `event` | `ticket-cta.relatedEvent` | Static CTA/fallback link behavior | Partial. Site Page and Ticket CTA are mapped |
| Gallery | `/gallery`, `/id/gallery` | `site-page` with `routePath=/gallery`, `media-gallery` | Gallery media items | Empty CMS result; no complete gallery fixture | Partial. Site Page and Gallery are mapped |
| Merchandise | `/merchandise`, `/id/merchandise` | `site-page` with `pageKind=merchandise`, `merchandise-item` | Merchandise media | Per-slug image fallback and static item presentation | Partial. Site Page and Merchandise are mapped |
| Events hub | `/events`, `/id/events` | `site-page` with `pageKind=eventHub`, `event`, `motorsport-program` | Event ticket relations, site scope | Placeholder event/program data | Partial. Event is mapped; Program unsupported |
| Event detail | `/events/{slug}`, `/id/events/{slug}` | `event` | `ticket-cta`, `partner`, event sessions/media | `PLACEHOLDER_MAP` for known slugs | Partial. Event is mapped; relation propagation unverified |
| Rallycross canonical detail | `/events/fia-rallycross-world-cup-indonesia-2026`, localized | `motorsport-program`, `site-page` by canonical route | `campaign-slide`, `rundown-item`, `rule-item`, `ticket-cta`, SEO/media | Full fallback campaign object | Unsupported as Program Preview; Site Page route allowlist currently excludes canonical campaign route |
| Campaign alias | `/campaign/{slug}`, localized | None after redirect | Canonical detail route | Permanent redirect to `/events/{slug}` | Preview must target canonical route, not alias |
| IJTC overview | `/events/indonesia-junior-talent-cup`, localized | `motorsport-program` | `rundown-item`, program media/CTA | Full fallback program object | Unsupported as Program Preview |
| IJTC race schedule | `.../race-schedule`, localized | `motorsport-program` | `rundown-item` | Fallback schedule | Unsupported as Program Preview |
| IJTC riders index | `.../riders`, localized | `motorsport-program`, `motorsport-rider` | Rider portraits and program relation | Fallback rider grid | Unsupported as Program/Rider Preview |
| IJTC rider detail | `.../riders/{riderSlug}`, localized | `motorsport-rider`, parent `motorsport-program` | Rider portrait/SEO | Fallback rider by slug | Unsupported; parent relation required |
| IJTC standings | `.../standings`, localized | `motorsport-program`, `motorsport-standing` | Standing rider relation and portrait | Fallback standings | Unsupported; parent relation required |
| IJTC regulation | `.../regulation`, localized | `motorsport-program`, `motorsport-regulation` | Regulation PDF media | Fallback regulation metadata | Unsupported; parent relation required |
| IJTC About | `.../about`, localized | `motorsport-program` | Program season/title/media | Static page copy plus fallback program | Unsupported as Program Preview |
| IJTC Become Riders | `.../become-riders`, localized | `motorsport-program` | Program CTA fields | Static application guidance plus fallback program | Unsupported as Program Preview |
| News hub | `/news`, `/id/news` | `site-page` with `pageKind=newsHub`, `news-article` | Article cover media and site scope | Empty result behavior | Partial. Site Page and Article are mapped |
| News detail | `/news/{slug}`, `/id/news/{slug}` | `news-article` | Related event/business/gallery fields exist in schema but are not currently populated by detail adapter | Not found when no article; no article content fallback | Mapped, but relation coverage incomplete |

### Route count

- 1 home route file with 2 locale paths
- 9 non-home root page route files with 18 locale paths: About, Experience, Contact,
  Partners, Tickets, Gallery, Merchandise, Events, and News are represented by
  the route inventory above; the count includes the actual files rather than
  treating localized paths as separate files
- 2 dynamic detail route files: Events and News
- 1 campaign alias route file
- 8 IJTC child/parent route files plus 1 layout
- 21 `page.tsx` files total under `frontend-motorsport/src/app`

## 3. Content-type field inventory

Fields below are CMS-editable inputs that can affect a public Motorsport route.
Fields not consumed by current frontend adapters are marked explicitly instead
of being assumed previewable.

### 3.1 Site Page

Consumer routes: home, About, Events hub, News hub, Experience, Contact,
Partners, Tickets, Gallery, Merchandise, and canonical Rallycross page lookup.

| Field group | Fields | Consumer behavior |
| --- | --- | --- |
| Identity and routing | `title`, `slug`, `routePath`, `siteScope`, `site`, `pageKind`, `navigationLabel` | Route selection, page labels, scope filtering |
| Hero | `heroTitle`, `heroDescription`, `heroEnabled`, `heroMedia`, `heroVideo` | Hero visibility, copy, image/video, poster behavior |
| Homepage carousel | `heroSlides` | Homepage slide order, copy, image, mobile image, video, alt text, anchor, CTA, active state |
| Homepage featured event | `motorsportFeaturedEvent` | Featured event card and related date/status/ticket values |
| Homepage information band | `motorsportInformationBand` | Race Control copy, labels, region values, visibility |
| Homepage world section | `motorsportWorldSection` | Discipline heading, CTA, card list |
| Homepage ticket section | `motorsportTicketSection` | Ticket copy, artwork, event/provider text, footer, approved CTA |
| Availability | `pageAvailability` | Enabled/Coming Soon state, notification CTA, no-index state |
| Editorial sections | `sections` dynamic zone | Page-specific sections and media/CTA/theme values |
| SEO | `seo` | Metadata, Open Graph, canonical, no-index |

Current adapter limitation: `fetchSitePage()` does not populate all nested
homepage fields used by `fetchHomepageData()`. Preview inventory must test the
aggregate homepage fetch separately.

### 3.2 Homepage and global chrome dependencies

| UID | Fields | Routes affected | Current state |
| --- | --- | --- | --- |
| `api::site.site` | `name`, `slug`, `baseUrl`, `description`, `logo`, `headerLogo`, `footerLogo`, `footerStatement`, `footerCopyright`, `footerColumns`, `footerSocialLinks`, `footerUtilityLinks`, `favicon`, `themeKey`, `order`, `isActive` | Every Motorsport route through header/footer; homepage ecosystem links | UID mapped to home only; global chrome effect requires cross-route tests |
| `api::top-navigation-item.top-navigation-item` | `internalName`, `siteScope`, `label`, `ariaLabel`, `href`, `linkType`, `enabled`, `displayOrder`, `emphasis`, `openInNewTab` | Every route with header; English and Indonesian labels | Unsupported UID; repository fallback used when CMS list unavailable |
| `api::leadership-person.leadership-person` | `name`, `role`, `summary`, `group`, `siteScope`, `site`, `order`, `portrait` | About and homepage leadership surfaces | Unsupported UID; fallback team used when empty |

### 3.3 Events

UID: `api::event.event`

Fields:

- Identity: `title`, `slug`, `siteScope`, `sites`, `showOnGateway`,
  `showOnMotorsport`, `showOnHorseSport`
- Editorial: `description`, `racingCategory`, `seriesName`, `venue`,
  `venueAddress`, `circuitName`, `eventDiscipline`, `raceClass`, `trackType`,
  `hospitalityInfo`, `stableAccessInfo`
- Timing/status: `eventDate`, `endDate`, `eventStatus`
- Media: `coverImage`, `heroMedia`, `gallery`
- Schedule: repeatable `schedule` with `label`, `day`, `startTime`, `endTime`,
  `description`
- Ticketing: `ticketCtaLabel`, `ticketUrl`, `ticketIntegrationType`, private
  `embedCode`, `embedUrl`, repeatable/related `ticketCtas`
- Related content: `business`, `sponsors`
- Broadcast: `broadcastUrl`
- SEO: `seo`

Current event adapter populates cover image, hero media, gallery, and ticket
CTAs for detail reads. It maps only the fields required by current cards and
detail layout. Every remaining field requires explicit consumption evidence
before it is included in Preview acceptance.

### 3.4 News

UID: `api::news-article.news-article`

Fields:

- Identity: `title`, `slug`, `siteScope`, `sites`, visibility flags, featured
  flags
- Editorial: `excerpt`, `body`, `category`, `author`, `publishedDate`,
  `isHotTopic`
- Media: `coverImage`
- Relations: `relatedBusinesses`, `relatedEvent`, `relatedGallery`
- SEO: `seo`

Current adapter consumes title, slug, excerpt, body, category, published date,
author, hot-topic state, cover image, and Motorsport scope. Detail reads do not
currently populate related businesses, event, or gallery.

### 3.5 Motorsport Program

UID: `api::motorsport-program.motorsport-program`

Fields:

- Identity and navigation: `title`, `slug`, `eventMenuLabel`, `eventMenuEnabled`,
  `programType`, `programStatus`, `seasonLabel`
- Editorial: `summary`, `mainHeadline`
- Timing/location: `eventStartDate`, `eventEndDate`, `venue`
- Media: `heroMedia`
- Campaign content: repeatable `bannerSlides`, `rundown`, `eventRules`
- CTAs: `primaryCtaLabel`, `primaryCtaUrl`, `becomeRidersLabel`,
  `becomeRidersUrl`
- Relations: `relatedEvents`, `relatedTicketCtas`, `riders`, `standings`,
  `regulations`, `sites`
- Scope/SEO: `siteScope`, `seo`

This is the main unsupported content family. Program records drive Events hub,
Rallycross, and all IJTC routes. Program Preview must resolve to the canonical
program route and test relation-driven child pages.

### 3.6 IJTC child records

| UID | Fields | Route effect | Resolver requirement |
| --- | --- | --- | --- |
| `motorsport-rider` | `name`, `slug`, `program`, `number`, `team`, `region`, `nationality`, `portrait`, `bio`, `isActive`, `sortOrder`, `siteScope`, `sites`, `seo` | Riders index and rider detail | Fetch parent program slug; rider detail needs both slugs |
| `motorsport-standing` | `program`, `seasonLabel`, `roundLabel`, `rider`, `position`, `points`, `resultSummary`, `resultDate`, `siteScope`, `sites` | Standings table | Fetch parent program slug; rider relation affects displayed row |
| `motorsport-regulation` | `program`, `title`, `version`, `effectiveDate`, `pdfFile`, `summary`, `isActive`, `siteScope`, `sites` | Regulation metadata and PDF link | Fetch parent program slug; active/latest sorting affects output |

### 3.7 Secondary collections

| UID | Fields | Route effect | Current Preview |
| --- | --- | --- | --- |
| `partner` | `name`, `slug`, `logo`, `websiteUrl`, `partnerType`, `siteScope`, `sites`, `sortOrder`, `isActive` | Partners hub, event sponsor strip, homepage partner strip | Mapped to Partners hub only; consumer routes need validation |
| `media-gallery` | `title`, `slug`, `description`, `category`, `coverImage`, `mediaItems`, `relatedEvent`, `siteScope`, `sites` | Gallery hub and possible article/event relationships | Mapped to Gallery hub; related consumers not currently populated |
| `merchandise-item` | `title`, `slug`, `description`, `image`, `priceLabel`, `availabilityStatus`, `externalUrl`, `siteScope`, `sites`, `sortOrder`, `seo` | Merchandise hub | Mapped to Merchandise hub |
| `ticket-cta` | `title`, `label`, `provider`, `ctaType`, `url`, private `embedCode`, `embedConfigJson`, `trackingParams`, `activeFrom`, `activeUntil`, `isActive`, `image`, `siteScope`, `sites`, `relatedEvent` | Tickets hub, homepage ticket card, event/campaign CTA | Mapped to Tickets hub; parent/consumer route impact unresolved |

## 4. Component field inventory

### Shared components

| Component | Fields |
| --- | --- |
| `shared.page-section` | `sectionKey`, `enabled`, `eyebrow`, `title`, `body`, `media`, `ctaLabel`, `ctaUrl`, `ctaTarget`, `theme` |
| `shared.hero-video` | `enabled`, `primaryVideo`, `alternateVideo`, `posterImage`, `mobilePosterImage` |
| `shared.page-availability` | `pageEnabled`, `comingSoonEyebrow`, `comingSoonTitle`, `comingSoonDescription`, `comingSoonMedia`, `launchTargetLabel`, `showNotifyCta`, `noIndexWhileDisabled` |
| `shared.seo` | `metaTitle`, `metaDescription`, `ogTitle`, `ogDescription`, `ogImage`, `canonicalUrl`, `noIndex` |
| `shared.event-session` | `label`, `day`, `startTime`, `endTime`, `description` |
| `shared.footer-column` | `title`, `displayOrder`, repeatable `links` |
| `shared.footer-link` | `label`, `href`, `linkType`, `openInNewTab`, `enabled`, `displayOrder` |

### Motorsport components

| Component | Fields |
| --- | --- |
| `motorsport.hero-slide` | `internalName`, `eyebrow`, `title`, `description`, `image`, `mobileImage`, nested `video`, `imageAlt`, `subjectAnchor`, `ctaLabel`, `ctaUrl`, `isActive`, `sortOrder` |
| `motorsport.home-information-band` | `enabled`, `eyebrow`, `title`, `description`, `nextEventLabel`, `ticketStatusLabel`, `regionLabel`, `regionValue` |
| `motorsport.world-of-motorsport` | `enabled`, `eyebrow`, `titlePrefix`, `titleAccent`, `description`, `ctaLabel`, `ctaUrl`, repeatable `disciplines` |
| `motorsport.discipline-card` | `internalName`, `enabled`, `title`, `shortLabel`, `image`, `imageAlt`, `href`, `accent`, `sortOrder` |
| `motorsport.home-ticket-section` | `isActive`, `eyebrow`, `title`, `description`, `backgroundImage`, `eventLabel`, `eventText`, `providerLabel`, `providerText`, `partnerLabel`, `footerText`, `ctaLabel`, `ctaUrl` |
| `motorsport.about-capabilities` | `enabled`, `eyebrow`, `title`, `description`, repeatable `cards` |
| `motorsport.about-capability-card` | `internalName`, `enabled`, `title`, `description`, `sortOrder`, `accent` |
| `motorsport.campaign-slide` | `title`, `description`, `image`, `ctaLabel`, `ctaUrl`, `sortOrder` |
| `motorsport.rundown-item` | `dayLabel`, `dateLabel`, `venue`, `status`, `startTime`, `endTime`, `title`, `description`, `sortOrder` |
| `motorsport.rule-item` | `ruleType`, `title`, `description`, `sortOrder` |

## 5. Locale matrix

| Content family | English | Indonesian | Locale behavior |
| --- | --- | --- | --- |
| Site Page | Supported | Supported | Localized records and localized route path |
| Event | Supported | Supported | Localized editorial fields and localized route path |
| News Article | Supported | Supported | Localized editorial fields and localized route path |
| Media Gallery | Supported | Supported | Localized title/description and localized route path |
| Merchandise | Supported | Supported | Localized copy and localized route path |
| Motorsport Program | Supported by frontend fetchers | Supported by frontend fetchers | Localized title/summary/headline/CTA fields; route resolver not complete |
| Motorsport Rider | Supported by frontend fetchers | Supported by frontend fetchers | Localized region/bio fields; name and core identity are not localized |
| Motorsport Regulation | Supported by frontend fetchers | Supported by frontend fetchers | Localized title/summary; version/date/file are shared |
| Motorsport Standing | Supported by frontend fetchers | Supported by frontend fetchers | Shared record; route is localized |
| Site chrome | Shared | Shared | Same Site record; route UI locale comes from navigation/dictionary |
| Top navigation | Supported | Supported | English records plus localized record lookup by `documentId` |
| Partner | Shared | Shared | Shared record; localized route only |
| Ticket CTA | Shared | Shared | Shared record; localized route only |
| Leadership | Partial | Partial | Role/summary localized; identity and grouping shared |

Preview acceptance must test both locale paths even when the underlying record is
shared or only partially localized. Missing localized content must be recorded as
fallback behavior, not treated as successful translation.

## 6. Fallback-only and fallback-prone content

The following content is currently hardcoded or supplied by fallback objects when
CMS data is missing, filtered, invalid, or unavailable:

- Homepage aggregate data: selected event, article, gallery, ticket, timeline,
  and section presentation fallbacks in `homepage-data.ts`.
- Homepage navigation: repository navigation fallback in `navigation-cms.ts`.
- Site chrome: default logos, footer statement, copyright, and Discover links in
  `fetchMotorsportChrome()`.
- Homepage leadership: fallback team data when no scoped leadership records exist.
- Homepage programs: fallback FIA Rallycross and IJTC menu entries when no CMS
  programs are returned.
- Events: `PLACEHOLDER_MAP` entries for known event slugs.
- Rallycross: complete `fallbackCampaign` including slides, schedule, rules,
  ticket CTA, media, and SEO.
- IJTC: complete fallback program, schedule, rider list, standings, and
  regulation metadata.
- About: static story copy, capability fallback cards, and fallback leadership
  portraits/team data.
- Experience: static pillar list when CMS `experience-pillars` section is absent.
- Merchandise: per-slug and alternating image fallbacks.
- Partner and gallery surfaces: empty-result behavior and static presentation
  labels where applicable.
- Contact, Tickets, Events, News, and other root pages: static explanatory copy
  remains in route components when corresponding CMS sections are absent.

Phase 0 does not remove or alter fallbacks. Later Preview phases must test both
draft-present and CMS-empty behavior so a draft is not silently hidden behind a
fallback.

## 7. Unsupported and out-of-scope UIDs

### Motorsport records requiring Preview support

- `top-navigation-item`: affects global header on every public route.
- `motorsport-program`: affects Events hub, Rallycross, and IJTC routes.
- `motorsport-rider`: affects IJTC riders index and rider detail.
- `motorsport-standing`: affects IJTC standings.
- `motorsport-regulation`: affects IJTC regulation.
- `leadership-person`: affects About and homepage leadership surfaces.

### Related schemas not currently consumed by Motorsport frontend

- `ecosystem-business`: relation target for Event and News, but no current direct
  Motorsport rendering adapter.
- `homepage`: single type exists in CMS, but Motorsport homepage currently reads
  `site-page` with `pageKind=home` instead.

### No public Preview route

These content types are not public Motorsport page sources in current code and
must not receive a Motorsport Preview button solely because they are draftable:

- `job-vacancy`
- `corporate-report`
- `newsletter-subscription`
- `inquiry-submission`
- `timeline-item`

## 8. Relation and affected-route matrix

| Source record | Relation or shared dependency | Affected routes | Required Preview behavior |
| --- | --- | --- | --- |
| Site | Header/footer fields | Every Motorsport route | Preview button may target home, but UAT must verify all routes |
| Top navigation item | Global navigation collection | Every Motorsport route | Preview button must target a safe global route; validate all locales/routes |
| Homepage Site Page | Featured event, hero slides, sections, ticket section | Home | Draft nested components must render without published relation leakage |
| Event | Ticket CTAs, sponsors, gallery, business | Events hub, event detail, tickets, homepage aggregates | Validate detail route and every currently rendered consumer |
| News Article | Related event/business/gallery | News hub, news detail, homepage aggregates | Current adapter does not populate all relations; mark gaps explicitly |
| Motorsport Program | Riders, standings, regulations, events, tickets | Events hub, Rallycross, all IJTC routes | Parent program slug is canonical route key |
| Rider | Program, portrait | IJTC riders index, rider detail, standings | Resolve parent program before building path |
| Standing | Program, rider | IJTC standings | Resolve parent program; verify rider relation draft state |
| Regulation | Program, PDF | IJTC regulation | Resolve parent program; verify active/latest selection and media |
| Leadership Person | Site ownership | About and homepage | Preview button should target About; verify homepage consumer too |
| Partner | Event sponsors and global strips | Partners, event detail, homepage | Hub mapping alone does not validate all consumers |
| Media Gallery | Event/article relations | Gallery, event/article consumers if rendered | Current adapters only consume gallery hub media items |
| Ticket CTA | Related Event and aggregate ticket panels | Tickets, event detail, campaign, homepage | Must document primary target plus affected-route validation |

## 9. Phase 0 acceptance matrix

Phase 0 is complete when these inventory conditions are met:

- Every `frontend-motorsport/src/app/**/page.tsx` route is listed.
- Every route has direct CMS sources, nested components, and relation consumers
  recorded.
- English and Indonesian route behavior is recorded for each route family.
- Every current fallback object or hardcoded fallback surface is identified.
- Every CMS UID is classified as supported, unsupported-but-required,
  relation-only, or out of public scope.
- Parent-dependent route resolution requirements are recorded for IJTC content.
- Cross-route effects of global chrome, navigation, partners, events, articles,
  and ticket CTAs are recorded.
- No code, schema, seed, environment, or runtime behavior was modified.

## 10. Phase 1 input

Phase 1 should implement the Preview contract from this inventory, starting with:

1. A single allowlisted route resolver covering direct and parent-dependent UIDs.
2. Explicit canonical mappings for Rallycross and IJTC program routes.
3. Safe global target behavior for Site, Top Navigation, and Leadership records.
4. Tests for every route family in both locales.
5. Tests that distinguish draft data from fallback data.
6. Tests that preserve published-only behavior outside Draft Mode.
