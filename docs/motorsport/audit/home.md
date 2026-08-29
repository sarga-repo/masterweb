# Sarga Motorsport Home — CMS ↔ Frontend Audit

Status: Phase A/B/C complete — 2026-08-29

Route: `/` and `/{locale}`

Frontend entry: `frontend-motorsport/src/app/page.tsx`

Primary CMS source: `api::motorsport-home-page.motorsport-home-page`

Fallback sources: legacy `api::site-page.site-page`, curated placeholder data in `frontend-motorsport/src/lib/homepage-data.ts`, shared `Site` chrome, and dedicated Motorsport collections.

## Trace method

The mapping below follows the actual path from Strapi response → `fetchHomepageData()` / `fetchMotorsportChrome()` → Home page/component props. A field is marked **active** only when its value reaches a rendered element or controls a rendered section. A field used to preserve a legacy response or API lifecycle is called out separately; it is not treated as visible editorial content.

## Page-level fields

| Frontend Section | Frontend Element | CMS Section | CMS Field | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| Page routing | Home route resolution and page-route registry | Motorsport Home Page | `routePath` | Active / infrastructure | Read by page-route helpers and used for route discovery; not rendered. |
| Page routing | Alias maintenance only | Motorsport Home Page | `routeAliases` | Lifecycle-only | Consumed by CMS route-registry lifecycle code, not by the frontend redirect/router. Keep until aliases are migrated; frontend alias redirects remain a technical gap. |
| Page identity | No visible Home copy | Motorsport Home Page | `title` | Not wired on Home | Stored in the dedicated response but `fetchHomepageData()` does not render it or use it for Home metadata. It is currently an editor-facing record title. |
| Header navigation | No visible Home label from this record | Motorsport Home Page | `navigationLabel` | Not wired on Home | Navigation comes from `motorsport-top-navigation-items`; do not duplicate this field for Home. |
| Site governance | API filtering only | Motorsport Home Page | `siteScope` | Infrastructure | Private governance field; not editable frontend content. |
| Availability | Full-page Coming Soon state | Motorsport Home Page → Page Availability | `pageAvailability.pageEnabled`, `comingSoonTitle`, `comingSoonDescription`, `comingSoonMedia`, `comingSoonCta*` | Active | Passed to `isCmsPageVisible()` and `PageComingSoon`. |
| SEO | Home document metadata | Motorsport Home Page → SEO | all SEO fields | Not wired on Home | `layout.tsx` currently uses static/default metadata. This is a frontend integration gap; fields should be wired in a metadata phase before being considered removable. |
| Header/footer | Logo, footer statement, footer links, social links, copyright | Shared Site (`slug=sarga-motorsport`) | `headerLogo`, `footerLogo`, `footerStatement`, `footerColumns`, `footerSocialLinks`, `footerUtilityLinks`, `footerCopyright` | Active | Consumed by `fetchMotorsportChrome()` and rendered by shared Motorsport header/footer. |
| Header/footer | Logo and footer fallbacks | Shared Site | same chrome fields | Fallback only | Repository defaults are used when CMS is unavailable or values are empty. They are resilience defaults, not editable page content. |

## Hero

| Frontend Section | Frontend Element | CMS Section | CMS Field | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| Hero visibility | Whether the Home carousel wrapper renders | Home → Page Hero | `hero.isActive` | Active | Mapped to `page.heroEnabled`. |
| Hero carousel | Active slide eyebrow | Home → Hero Slide | `eyebrow` | Active | Rendered by `MotorsportHero`. |
| Hero carousel | Active slide title | Home → Hero Slide | `title` | Active | Rendered as the H1. |
| Hero carousel | Active slide description | Home → Hero Slide | `description` | Active | Rendered below the H1. |
| Hero carousel | Desktop artwork | Home → Hero Slide | `image` | Active | Required and used as the slide poster. |
| Hero carousel | Mobile artwork | Home → Hero Slide | `mobileImage` | Active | Used for the mobile picture when present. |
| Hero carousel | Accessible image alternative | Home → Hero Slide | `imageAlt` | Active | Used for active/inactive slide image alt text. |
| Hero carousel | Subject crop | Home → Hero Slide | `subjectAnchor` | Active | Converted to object-position classes. |
| Hero carousel | Video playback | Home → Hero Slide → Hero Video | `enabled`, `primaryVideo`, `alternateVideo`, `posterImage`, `mobilePosterImage` | Active | Used by `HeroVideo`; poster media is used before/alongside playback. |
| Hero carousel | Slide action | Home → Hero Slide | `ctaLabel`, `ctaUrl` | Active | Rendered by `HeroCta` after URL validation. |
| Hero carousel | Slide visibility/order | Home → Hero Slide | `isActive`, `sortOrder` | Active | Filters and orders slides; max three are rendered. |
| Hero carousel | Stable editor identifier | Home → Hero Slide | `internalName` | Runtime identity only | Used only as a source identifier/fallback lookup input; not visible. Keep as editor-facing operational metadata. |
| Hero carousel | Primary hero copy/media fallback | Home → Page Hero | `eyebrow`, `title`, `description`, `backgroundMedia`, `mobileBackgroundMedia`, `backgroundAlt` | Fallback/compatibility | Used only when the dedicated `heroSlides` array has no corresponding copy/media. It is a migration-era single-hero fallback and duplicates slide fields. |
| Hero carousel | Hero controls and alternate actions | Home → Page Hero | `showEyebrow`, `showTitle`, `showDescription`, `showMedia`, `showPrimaryCta`, `showSecondaryCta`, `primaryCta*`, `secondaryCta*`, `showMetricGroup`, `metrics` | Redundant / not wired on Home | The Home frontend renders the carousel from `heroSlides` and does not read these controls/actions/metrics. They are shared with non-home page heroes, so remove from the Home data contract only after existing Home content is migrated to slides. |

## Race-control information band

| Frontend Section | Frontend Element | CMS Section | CMS Field | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| Information band visibility | Blue band wrapper | Home → Information Band | `isActive` | Active | Mapped to `informationBand.enabled`; Home conditionally renders the band. |
| Information band copy | Eyebrow, title, rich description | Home → Information Band | `eyebrow`, `title`, `description` | Active | Passed to `InformationBand`. |
| Information band metrics | Up to three label/value pairs | Home → Information Band → Metric Group Item | `metrics[].isActive`, `metrics[].label`, `metrics[].value` | Active | Active records are filtered and rendered. |
| Information band metric visibility | Metric group | Home → Information Band | `showMetricGroup` | Active | Passed to `InformationBand`. |
| Legacy metric fallback labels | Labels for derived event/ticket/region metrics | Legacy Home Information Band | `nextEventLabel`, `ticketStatusLabel`, `regionLabel`, `regionValue` | Fallback only | The dedicated `page-information-band` does not expose these fields. They are only read by the legacy fallback adapter. |
| Information band presentation flags | Individual eyebrow/title/description flags | Home → Information Band | `showEyebrow`, `showTitle`, `showDescription` | Not wired on Home | `page.tsx` passes copy but not these three flags. The dedicated band adapter supports them for other page templates. Home should pass them before the fields are treated as active. |

## World of Motorsport

| Frontend Section | Frontend Element | CMS Section | CMS Field | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| World section visibility | Section wrapper | Home → World of Motorsport | `enabled` | Active | Controls section rendering. |
| World section heading/copy | Eyebrow, title prefix, title accent, description | Home → World of Motorsport | `eyebrow`, `titlePrefix`, `titleAccent`, `description` | Active | Rendered by `WorldOfMotorsport`. |
| World section CTA | Explore-calendar link | Home → World of Motorsport | `ctaLabel`, `ctaUrl` | Active | Rendered and URL-sanitized. |
| Discipline tiles | Tile title, short label, image, alt text, destination, accent | Home → World → Discipline Card | `title`, `shortLabel`, `image`, `imageAlt`, `href`, `accent` | Active | Rendered by `DisciplineGrid` / `DisciplineTile`. |
| Discipline tile visibility/order | Which tiles appear and their order | Home → World → Discipline Card | `enabled`, `sortOrder` | Active | Filters, sorts, and caps at six. |
| Discipline editor key | Placeholder matching only | Home → World → Discipline Card | `internalName` | Fallback lookup only | Used to select a curated fallback when a card is incomplete; never rendered. Keep as operational/editor key while placeholder fallbacks exist. |

## Upcoming events

| Frontend Section | Frontend Element | CMS Section | CMS Field | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| Upcoming Events visibility | Section wrapper | Home → Upcoming Events Section | `isActive` | Active | Mapped to `sections.events.enabled`. |
| Section header | Index, eyebrow, title, description | Home → Upcoming Events Section | `indexLabel`, `showIndex`, `eyebrow`, `showEyebrow`, `title`, `showTitle`, `body`, `showBody` | Active | `body` maps to the header description. |
| Section media | Wide editorial image | Home → Upcoming Events Section | `media`, `showMedia` | Active | Rendered when both are present/enabled. |
| Featured event | Featured event card | Home → `featuredEvent` relation → Motorsport Event | event title, cover/hero media, category, series, date, venue, status, ticket CTA relation | Active | Dedicated relation takes priority, then automatic collection selection. |
| Event list | Additional event cards | Motorsport Event collection | event fields | Active | Fetched from `motorsport-events`, filtered by visibility/status, and mapped into `EventListCard`. |
| Event list label | “Also on the calendar” | Home → Upcoming Events Section | No field | Hardcoded / missing CMS field | Must be added to the Home section contract or intentionally classified as fixed UI copy. |
| Event count suffix | “entries” | Home → Upcoming Events Section | No field | Hardcoded / missing CMS field | Same issue; visible editorial label is not CMS-manageable. |
| Section CTA | View-all-events link | Home → Upcoming Events Section | `showCta`, `ctaLabel`, `ctaUrl`, `ctaTarget` | Partially active | `showCta`, URL, and target are read, but the label falls back to hardcoded “View all events” when empty. |
| Featured event relation | Which event is featured | Home | `featuredEvent` | Active | Relation is explicitly read and rendered. |
| Featured program relation | Which program is featured | Home | `featuredProgram` | Active | Program is mapped into the featured event card shape and takes precedence over `featuredEvent`. |

## Ticket, news, connected records, gallery, partners, newsletter

| Frontend Section | Frontend Element | CMS Section | CMS Field | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| Homepage ticket card | Whole card visibility | Home → Homepage Ticket Card | `isActive` | Active | A false value suppresses the card. |
| Homepage ticket card | Eyebrow/title/description | Home → Homepage Ticket Card | `eyebrow`, `title`, `description` | Active with fallback | Rendered; defaults are used when values are empty. |
| Homepage ticket card | Event/provider metadata | Home → Homepage Ticket Card | `eventLabel`, `eventText`, `providerLabel`, `providerText`, `partnerLabel`, `footerText` | Active | Rendered by `TicketCtaPanel`; event text can fall back to featured event title. |
| Homepage ticket card | Image and CTA | Home → Homepage Ticket Card | `backgroundImage`, `backgroundImageMobile`, `ctaLabel`, `ctaUrl` | Active | CTA is validated and partner redirect policy remains enforced. |
| Latest news | Section header | Home → Latest News Section | `isActive`, `indexLabel`, `showIndex`, `eyebrow`, `showEyebrow`, `title`, `showTitle`, `body`, `showBody` | Active | Header copy and visibility are CMS-driven. |
| Latest news | News cards | Motorsport News Article collection | title, slug, coverImage, category, publishedDate, excerpt, visibility/feature flags | Active | Collection records are filtered and rendered. |
| Latest news | View-all CTA | Home → Latest News Section | `showCta`, `ctaLabel`, `ctaUrl`, `ctaTarget` | Partially wired | The page currently hardcodes “Read all stories” and `/news`; section CTA fields are not passed. |
| Connected records | Section visibility | Home → Connected Records Section | `isActive` | Active | Controls `SargaTimeline`. |
| Connected records | Section heading/copy/tabs | Home → Connected Records Section plus Shared collections | section copy fields | Partially active | Section visibility is used, but the component’s heading, description, tab labels, and empty-state copy are hardcoded. Publications, leadership, and ecosystem records are CMS-backed. |
| Gallery | Section visibility | Home → Gallery Section | `isActive` | Active | Controls the gallery wrapper. |
| Gallery | Heading/copy | Home → Gallery Section | `indexLabel`, `showIndex`, `eyebrow`, `showEyebrow`, `title`, `showTitle`, `body`, `showBody` | Partially wired | Eyebrow/title/description are read, but index is hardcoded to “GALLERY” and show flags are not passed. |
| Gallery | Gallery images/captions | Media Gallery collection | `title`, `mediaItems[]`, media alt text | Active | Up to six images are mapped to the mosaic. |
| Gallery | Gallery CTA | Home → Gallery Section | `showCta`, `ctaLabel`, `ctaUrl`, `ctaTarget` | Not wired | Page hardcodes “Open full gallery” and `/gallery`. |
| Partners | Partner strip label | Home → Partners Section | `eyebrow` or `title` | Active with fallback | Used as the strip label. |
| Partners | Partner logos/links | Motorsport Partner collection | `name`, `logo`, `websiteUrl`, active/order fields | Active | Up to five visible partners are rendered. |
| Partners | Section visibility | Home → Partners Section + `showPartnersOnHomepage` | `isActive`, top-level `showPartnersOnHomepage` | Active | Both page-level and section-level controls participate. |
| Newsletter | Heading, description, action, legal copy | Home → Newsletter Section | `eyebrow`, `title`, `body`, `ctaLabel`, `legalText` | Active with fallback | The newsletter form posts to the local API; CMS controls editorial copy. |
| Newsletter | Secondary contact link | Home → Newsletter Section | `secondaryCtaLabel`, `secondaryCtaUrl` | Active with fallback | Values are read; fallback uses `ctaUrl` or `/contact` when empty. |
| Newsletter | Form labels/status/placeholder | Newsletter component | No CMS field | Fixed UI copy | “Your email”, placeholder, submitting/success/error messages, and anti-bot label are interaction copy, not page editorial content. Keep as frontend UI strings unless localization/CMS ownership is explicitly required. |

## Confirmed Home cleanup actions

1. Passed Home information-band display flags through to `InformationBand`.
2. Added Home section fields for the upcoming-event list label/count suffix and wired them.
3. Wired the Latest News CTA to the CMS section fields.
4. Wired Gallery index/show flags and CTA to the CMS section fields.
5. Added Strapi field help text for the Home single type and the shared presentation-section fields used by Home.
6. Made the Connected Records heading, description, and tab labels CMS-driven.
7. Preserved the primary `hero` component as a compatibility fallback until existing Home records are migrated to `heroSlides`; its unused control fields were not deleted because the component is shared by other page templates.

## Home architecture decision

The Home page should keep one dedicated single type with one logical component per visible section. The current named components already satisfy that structure. The event/news/gallery label gaps should be solved by adding narrowly named fields to the Home section component and wiring them, not by introducing another component or another CMS type. Shared collections remain the source for events, articles, galleries, partners, leadership, and ecosystem records.

No staging environment, remote CMS, or destructive migration was touched during this audit.

## Validation

- Motorsport typecheck passed.
- Motorsport ESLint passed with two pre-existing warnings outside this change.
- Motorsport production build passed and generated all 51 routes.
- Motorsport Markdown tests passed.
- CMS TypeScript check passed.
- CMS admin build completed successfully.
- JSON schema validation and `git diff --check` passed.
