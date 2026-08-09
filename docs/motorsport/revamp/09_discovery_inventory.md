# 09 - Discovery And Inventory

## Purpose and scope

This is the MSR-1 baseline for the Sarga Motorsport major revamp. It records the
current public frontend, shared CMS, seed content, and available assets against
the target in `03_sitemap_page_specs.md`.

The audit was read-only apart from this documentation and the required phase
trackers. No frontend behavior, CMS schema, seed data, deployment configuration,
or public asset was changed in MSR-1.

Audit snapshot:

- Date: 2026-08-08.
- Branch: `feature/sarga-motorsport-major-revamp-specs`.
- Frontend: Next.js App Router, TypeScript, Tailwind CSS.
- CMS: one shared Strapi instance and one shared PostgreSQL database.
- Local ports remain Gateway `3000`, Motorsport `3001`, Horse Sport `3002`,
  Strapi `1337`, and PostgreSQL host port `5435`.
- Primary references: the revamp document set, the Look & Feel PDF, the
  Motorsport sitemap PDF, the Motorsport brand playbook, and the current repo.

## Current frontend route inventory

| Route | Source file | Current content/data source | Revamp disposition |
|---|---|---|---|
| `/` | `frontend-motorsport/src/app/page.tsx` | CMS-first event, news, partner, gallery, and ticket data with hardcoded fallbacks; also contains brand story, experience, partners, and newsletter modules. | Exists, but MSR-4 must refocus it on Hero, Upcoming Events, News, Gallery, Ticket CTA, and Footer. |
| `/about` | `frontend-motorsport/src/app/about/page.tsx` | Static profile/story, six ecosystem pillars, mission, brand personality, and Sarga.co relationship. | Exists, but needs explicit Profile, Vision, What We Do, Meet The Team, Contact Us, and Part of Sarga.co sections. |
| `/events` | `frontend-motorsport/src/app/events/page.tsx` | CMS-first event list with four fallback events, grouped into upcoming and past. | Exists, but currently behaves as a calendar/archive rather than the required FIA Rallycross + IJTC program gateway. |
| `/events/[slug]` | `frontend-motorsport/src/app/events/[slug]/page.tsx` | Generic CMS event detail with four hardcoded fallbacks, ticket panel, and sponsors. | Retain for event-shaped content; extend data mapping and visual hierarchy. |
| `/experience` | `frontend-motorsport/src/app/experience/page.tsx` | Static six-pillar 360-degree ecosystem page. | Valuable legacy route; remove from primary nav or reposition after redirect/content decision in MSR-8. |
| `/news` | `frontend-motorsport/src/app/news/page.tsx` | CMS-first listing with four fallback stories. | Retain and visually recalibrate in MSR-5. |
| `/news/[slug]` | `frontend-motorsport/src/app/news/[slug]/page.tsx` | CMS-first article detail with four fallback bodies and metadata. | Retain; correct editorial-date mapping and visually recalibrate. |
| `/gallery` | `frontend-motorsport/src/app/gallery/page.tsx` | CMS-first media items; falls back to six repeated local-image entries when fewer than three CMS images exist. | Retain; rebuild around the source PDF mosaic direction and real CMS media. |
| `/partners` | `frontend-motorsport/src/app/partners/page.tsx` | CMS-first partner grid with three logo-based fallbacks. | Useful legacy route, but not a target primary-nav node; preserve or fold into About/Footer after MSR-8 decision. |
| `/tickets` | `frontend-motorsport/src/app/tickets/page.tsx` | CMS-first partner CTAs and ticketed events with a placeholder CTA; optional iframe path. | Retain as `Ticket` in visible navigation; keep redirect/deep-link/allowlisted embed only. |
| `/contact` | `frontend-motorsport/src/app/contact/page.tsx` | Client form with validation, inquiry categories, support addresses, and local placeholder mode. | Retain and align to Motorsport inquiries/Become Riders routing. |
| `/api/contact` | `frontend-motorsport/src/app/api/contact/route.ts` | Rate-limited form handler; production forwarding is configured for `/api/inquiries`. | Retain, but verify the Strapi collection endpoint and payload before production use. |
| `/campaign/[slug]` | `frontend-motorsport/src/app/campaign/[slug]/page.tsx` | Dynamic-looking route backed only by a hardcoded `season-opener-2026` record; no campaign CMS fetch exists. | Reuse or specialize for FIA Rallycross after the canonical-route decision. |
| error/not-found | `frontend-motorsport/src/app/error.tsx`, `global-error.tsx`, `not-found.tsx` | Branded error states. | Retain and regression-test. |
| metadata routes | `frontend-motorsport/src/app/sitemap.ts`, `robots.ts` | Sitemap contains Home, About, Events, News, Tickets, Contact plus CMS event/news details. | Sitemap must add Gallery, Merchandise, IJTC pages, and the selected FIA route. |

Routes required by the revamp but absent today:

- `/merchandise`.
- `/events/indonesia-junior-talent-cup`.
- `/events/indonesia-junior-talent-cup/race-schedule`.
- `/events/indonesia-junior-talent-cup/riders`.
- `/events/indonesia-junior-talent-cup/standings`.
- `/events/indonesia-junior-talent-cup/about`.
- `/events/indonesia-junior-talent-cup/regulation`.
- `/events/indonesia-junior-talent-cup/become-riders`.
- FIA Rallycross content at either
  `/events/fia-rallycross-world-cup-indonesia-2026` or
  `/campaign/fia-rallycross-world-cup-indonesia-2026`.

## Current component, navigation, and footer inventory

### Component groups

- Layout: `motorsport-header.tsx`, `motorsport-footer.tsx`, and
  `page-shell.tsx`.
- Cards: event feature, event list, experience pillar, and news cards.
- Sections: brand story, gallery carousel/rail, Motorsport hero, newsletter,
  page hero, partner strip, and ticket CTA panel.
- UI: brand logo, countdown, gradient rule, hero video, icons, section header,
  and status chip.
- Shared frontend data/types: `cms-data.ts`, `homepage-data.ts`, Strapi client
  and config, `site-config.ts`, validation, and `types/design-system.ts`.

The current library is a useful base, but it does not yet include the required
event-program subnavigation, program cards, schedule views, rider cards,
standings tables, regulation downloads, campaign banner/rundown/rules modules,
merchandise teasers, or the new gallery mosaic primitive.

### Current navigation

`page-shell.tsx` and the homepage independently define the same order:

```text
Events / Experience / News / Gallery / About
```

`Tickets` is a separate CTA. The header also links to Sarga.co and displays the
label `Race control`.

Target order:

```text
Home / About / Event / News / Gallery / Merchandise / Ticket / Contact
```

The duplication between the homepage and `PageShell` creates drift risk. Later
work should establish one navigation configuration and keep `Ticket` as the
strongest CTA.

### Current footer

The footer is grouped into:

- Race: Events, Tickets, Experience.
- Stories: News, Gallery, Partners.
- Sarga: About, Contact.
- Gateway and Horse Sport cross-site links.
- Privacy and Terms links.

`/privacy` and `/terms` are linked but do not currently have Motorsport route
files. Legal ownership or cross-site destinations must be resolved before
launch. The footer structure otherwise remains reusable.

## Current route content summary

- Home is heavily event-oriented but still contains eleven modules. The target
  source calls for a shorter six-part narrative, so supporting Experience,
  Brand Story, Partners, and Newsletter content must be reduced or repositioned.
- About covers brand story and ecosystem positioning, but has no team roster and
  no dedicated contact section. Leadership data exists in the CMS but is not
  site-scoped and is not consumed by this page.
- Events has status chips but no working taxonomy controls, no FIA featured
  campaign, no IJTC program entry, and no program-level subnavigation.
- News list/detail, Gallery, Tickets, Partners, and Contact are functional page
  shells with placeholder fallbacks. Their CMS adapters and media depth need
  correction before relying on live content.
- The campaign route is not CMS-driven and only knows
  `season-opener-2026`; the FIA headline, date, venue, slider, rundown, and
  do/don't content are absent.

## Shared Strapi CMS inventory

### Current content types

| Type | Kind | Current relevance to Motorsport |
|---|---|---|
| Homepage | single type | Gateway-style shared homepage model; not site-scoped, so it cannot safely represent three independent homepages as-is. |
| Site | collection | Registry for site name, slug, URLs, theme, and brand media. |
| Ecosystem Business | collection | Supports Motorsport business routing, relations, `siteScope`, and dedicated-site fields. |
| Event | collection | Supports dates, status, venue, Motorsport category/series/circuit, schedule component, media, ticket CTAs, sponsors, SEO, and site routing. Also contains Horse Sport-specific fields. |
| News Article | collection | Supports editorial content, categories, related event/business/gallery, SEO, `siteScope`, and per-site teaser/feature flags. |
| Media Gallery | collection | Supports cover/media items, category, related event, `siteScope`, and sites. |
| Partner | collection | Supports logo, partner type, external URL, ordering, active state, `siteScope`, and sites. |
| Ticket CTA | collection | Supports redirect/deep-link/embed type, URL, private embed code/config, tracking, availability dates, event relation, `siteScope`, and sites. |
| Leadership Person | collection | Supports name, role, group, order, and portrait, but has no site scope or Motorsport team/program relation. |
| Inquiry Submission | collection | Supports inquiry metadata and workflow status. |
| Newsletter Subscription | collection | Supports consent and subscription status. |
| Timeline Item | collection | Generic timeline content; not site-scoped. |

Reusable components currently include SEO, event session, and key highlight.
There is no `site-page`, Motorsport program, rider, standing, regulation,
campaign-section, or merchandise-item model.

### Admin experience

`cms/src/admin/app.tsx` provides Sarga logos, color themes, translations, title
rewriting, and visual CSS. It does not create the required Gateway, Motorsport,
Horse Sport, Shared Library, and System Settings workspaces or filtered
quick-create paths. Content Manager remains organized primarily by shared
collection name.

### Motorsport seed content

`cms/src/seed.ts` currently defines and idempotently creates:

- Three partners: Apex Fuels, Velocity Tyres, and Gridline Broadcasting.
- Four events: Sarga Grand Prix - Night Race, Superbike Night Sessions,
  GT Endurance Challenge, and Moto Festival Weekend.
- Two partner ticket CTAs using `example.com` destinations.
- Four news articles, including one Gateway teaser and one Motorsport feature.
- One gallery record with the title typo `Galerry`; it has no seeded media.
- A Sarga Motorsport ecosystem-business relation and site registry/routing data.

There are no seeded IJTC program/round/rider/standing/regulation records, no FIA
Rallycross World Cup Indonesia 2026 campaign record, and no merchandise record.
The placeholder providers, URLs, names, and dates are demonstration data and are
not launch-approved content.

### Frontend-to-CMS contract findings

These mismatches explain why placeholder data can mask live-CMS problems and
must be corrected in MSR-2/MSR-5 rather than in this discovery phase:

| Frontend expectation | Current Strapi field/value | Effect |
|---|---|---|
| Event `date` | `eventDate` | CMS events map to `TBA` even when an event date exists. |
| Status `tickets_open` / `tickets-open` | `ticketsOpen` | Ticket-open CMS events map to `announced`. Similar camel-case handling is missing for `soldOut`. |
| Article `publishedAt` as editorial date | `publishedDate` is the intended editorial field; `publishedAt` is Strapi publication metadata | Display/order can reflect CMS publication time instead of article date. |
| Ticket CTA `redirectUrl` | `url` | CMS CTA links fall back to `/tickets`, and event ticket relations do not yield the partner URL. |
| Partner `website` | `websiteUrl` | External partner links are dropped. |
| Event fetch populates only cover/hero | ticket relation is not populated in event list fetches | `ticketHref` is usually unavailable when filtering ticketed events. |
| Ticket embed field is treated as iframe `src` | schema separates private `embedCode`, `embedConfigJson`, and event `embedUrl` | Embed behavior and allowlisting are not yet contract-safe. |
| Contact production target `/api/inquiries` | The collection plural name is `inquiry-submissions`, so the core endpoint is `/api/inquiry-submissions` | Production forwarding currently targets the wrong endpoint and must be corrected before submissions are enabled. |

`strapi/content-types.json` remains a documentation mirror and must be updated
with any real schema change. Generated Strapi types must also be regenerated in
MSR-2.

## Motorsport asset inventory

### Approved/central brand assets

`assets/brand/motorsport/logos/` contains three 777x195 PNG variants:

- `logo-sarga-motorsport-full.png`.
- `logo-sarga-motorsport-part-of-sarga.png`.
- `logo-sarga-motorsport-symbol-sport.png`.

`assets/brand/motorsport/reference-images/` contains two logo crops for source
review. The approved brand-playbook PDF is available in
`reference/source-pdfs/`.

### Frontend brand assets

`frontend-motorsport/public/brand/` contains six PNG files, including full,
symbol, Part of Sarga, color, white, and endorsement variants. Naming and
dimensions are inconsistent: for example the public
`logo-sarga-motorsport-full.png` is 205x204 while the central file with the same
name is 777x195. Later asset normalization must compare visual content rather
than assuming identical names mean identical marks.

### Frontend imagery/video

`frontend-motorsport/public/media/` currently contains:

- Hero poster plus MP4 and WebM hero video.
- Motorsport hero and portrait-card artwork.
- Motorcycle racing at dusk.
- Bike/rally composite.
- Motorcycle race image.
- Two NASCAR images.
- One duplicated motorcycle image with the typo prefix `sarge-`.
- One Horse Sport race image that is not appropriate for Motorsport use.

The folder is approximately 27 MB. Raster sizes range from 1280x720 to
2560x1440, with one 1400x2100 portrait. There is enough material for current
fallbacks, but not enough distinct approved photography for the full IJTC rider,
schedule, FIA campaign slider, merchandise, team, and gallery-mosaic needs.
Content owners must supply or approve additional imagery and the IJTC regulation
PDF before those pages can be launch-complete.

## Gap matrix against the target sitemap

| Target | Current coverage | Gap / later phase |
|---|---|---|
| Target primary navigation | Partial | Reorder, add Home/Merchandise/Contact, relabel Event/Ticket, remove Experience from primary nav, centralize config (MSR-3). |
| Focused homepage | Partial | Reduce supporting modules and rebuild required sequence (MSR-4). |
| About sections | Partial | Add Profile/Vision/What We Do/Team/Contact and CMS ownership (MSR-2/MSR-5). |
| Event program gateway | Missing | Add FIA feature, IJTC program card, useful filters, ticket status (MSR-5). |
| IJTC overview and subnav | Missing | Add all seven IJTC destinations and persistent subnav (MSR-2/MSR-3/MSR-6). |
| IJTC schedule | Missing | Model rounds/sessions and build schedule view (MSR-2/MSR-6). |
| IJTC riders | Missing | Add rider model/cards and detail-ready data (MSR-2/MSR-6). |
| IJTC standings/results | Missing | Add standing/result data and accessible table (MSR-2/MSR-6). |
| IJTC regulation | Missing | Add versioned PDF model/download panel; source PDF not supplied yet (MSR-2/MSR-6). |
| Become Riders | Missing | Reuse inquiry workflow with CMS-managed program CTA; no account flow (MSR-2/MSR-6). |
| FIA Rallycross campaign | Missing | Add exact approved headline, 5-6 Dec 2026 date, Jakarta International E-Prix Circuit venue, banner slider, rundown, rules, metadata, and ticket CTA (MSR-2/MSR-7). |
| News list/detail | Exists | Correct date mapping, confirm CMS ownership, recalibrate visual system (MSR-2/MSR-5). |
| Gallery | Partial | Seed real media and rebuild mosaic/editorial treatment (MSR-2/MSR-5). |
| Merchandise showcase | Missing | Add model and page with external/inquiry CTA only; no cart/checkout/payment (MSR-2/MSR-5). |
| Ticket hub | Partial | Correct CTA contract, availability, event relation, and allowlisted embed behavior (MSR-2/MSR-5). |
| Contact | Partial | Confirm Strapi endpoint and add Become Riders inquiry routing (MSR-2/MSR-5/MSR-6). |
| CMS workspaces | Missing | Add editor-facing site workspaces while preserving one CMS/database (MSR-2). |
| Sitemap/SEO | Partial | Include all new indexable routes and select one canonical FIA URL (MSR-7/MSR-8). |

## Exact later implementation file map

This map separates confirmed existing files that need edits from planned new
files. New-file names are the implementation baseline; MSR-2 may adjust only
the CMS admin extension layout if Strapi's installed version requires a local
plugin rather than an admin extension.

### Existing frontend files to modify

- `frontend-motorsport/src/app/globals.css`
- `frontend-motorsport/src/app/layout.tsx`
- `frontend-motorsport/src/app/page.tsx`
- `frontend-motorsport/src/app/about/page.tsx`
- `frontend-motorsport/src/app/events/page.tsx`
- `frontend-motorsport/src/app/events/[slug]/page.tsx`
- `frontend-motorsport/src/app/news/page.tsx`
- `frontend-motorsport/src/app/news/[slug]/page.tsx`
- `frontend-motorsport/src/app/gallery/page.tsx`
- `frontend-motorsport/src/app/tickets/page.tsx`
- `frontend-motorsport/src/app/contact/page.tsx`
- `frontend-motorsport/src/app/api/contact/route.ts`
- `frontend-motorsport/src/app/campaign/[slug]/page.tsx`
- `frontend-motorsport/src/app/sitemap.ts`
- `frontend-motorsport/src/components/index.ts`
- `frontend-motorsport/src/components/layout/motorsport-header.tsx`
- `frontend-motorsport/src/components/layout/motorsport-footer.tsx`
- `frontend-motorsport/src/components/layout/page-shell.tsx`
- `frontend-motorsport/src/components/cards/event-feature-card.tsx`
- `frontend-motorsport/src/components/cards/event-list-card.tsx`
- `frontend-motorsport/src/components/cards/news-card.tsx`
- `frontend-motorsport/src/components/sections/gallery-carousel.tsx`
- `frontend-motorsport/src/components/sections/gallery-rail.tsx`
- `frontend-motorsport/src/components/sections/motorsport-hero.tsx`
- `frontend-motorsport/src/components/sections/page-hero.tsx`
- `frontend-motorsport/src/components/sections/ticket-cta-panel.tsx`
- `frontend-motorsport/src/lib/cms-data.ts`
- `frontend-motorsport/src/lib/homepage-data.ts`
- `frontend-motorsport/src/lib/validation.ts`
- `frontend-motorsport/src/types/design-system.ts`

Legacy `/experience` and `/partners` files should not be deleted before the
MSR-8 redirect/retention decision.

### Planned new frontend route files

- `frontend-motorsport/src/app/merchandise/page.tsx`
- `frontend-motorsport/src/app/events/indonesia-junior-talent-cup/layout.tsx`
- `frontend-motorsport/src/app/events/indonesia-junior-talent-cup/page.tsx`
- `frontend-motorsport/src/app/events/indonesia-junior-talent-cup/race-schedule/page.tsx`
- `frontend-motorsport/src/app/events/indonesia-junior-talent-cup/riders/page.tsx`
- `frontend-motorsport/src/app/events/indonesia-junior-talent-cup/standings/page.tsx`
- `frontend-motorsport/src/app/events/indonesia-junior-talent-cup/about/page.tsx`
- `frontend-motorsport/src/app/events/indonesia-junior-talent-cup/regulation/page.tsx`
- `frontend-motorsport/src/app/events/indonesia-junior-talent-cup/become-riders/page.tsx`

### Planned new frontend support files

- `frontend-motorsport/src/lib/navigation.ts`
- `frontend-motorsport/src/lib/motorsport-program-data.ts`
- `frontend-motorsport/src/lib/motorsport-campaign-data.ts`
- `frontend-motorsport/src/lib/merchandise-data.ts`
- `frontend-motorsport/src/components/layout/event-program-subnav.tsx`
- `frontend-motorsport/src/components/cards/program-card.tsx`
- `frontend-motorsport/src/components/cards/schedule-card.tsx`
- `frontend-motorsport/src/components/cards/rider-card.tsx`
- `frontend-motorsport/src/components/cards/merchandise-card.tsx`
- `frontend-motorsport/src/components/sections/standings-table.tsx`
- `frontend-motorsport/src/components/sections/regulation-download-panel.tsx`
- `frontend-motorsport/src/components/sections/campaign-banner-slider.tsx`
- `frontend-motorsport/src/components/sections/campaign-rundown.tsx`
- `frontend-motorsport/src/components/sections/campaign-rules.tsx`
- `frontend-motorsport/src/components/sections/gallery-mosaic.tsx`

### Existing CMS files to modify/regenerate

- `cms/src/admin/app.tsx`
- `cms/src/seed.ts`
- `cms/src/api/event/content-types/event/schema.json`
- `cms/src/api/news-article/content-types/news-article/schema.json`
- `cms/src/api/media-gallery/content-types/media-gallery/schema.json`
- `cms/src/api/partner/content-types/partner/schema.json`
- `cms/src/api/ticket-cta/content-types/ticket-cta/schema.json`
- `cms/src/api/leadership-person/content-types/leadership-person/schema.json`
- `cms/src/api/inquiry-submission/content-types/inquiry-submission/schema.json`
- `cms/src/api/site/content-types/site/schema.json`
- `strapi/content-types.json`
- `cms/types/generated/components.d.ts`
- `cms/types/generated/contentTypes.d.ts`

### Planned new CMS API files

For each collection below, add `content-types/<name>/schema.json`,
`controllers/<name>.ts`, `routes/<name>.ts`, and `services/<name>.ts` under the
matching `cms/src/api/<name>/` directory:

- `site-page`.
- `motorsport-program`.
- `motorsport-rider`.
- `motorsport-standing`.
- `motorsport-regulation`.
- `merchandise-item`.

The CMS workspace implementation should add its UI under
`cms/src/admin/extensions/sarga-workspaces/` and register it through
`cms/src/admin/app.tsx`, unless MSR-2 confirms that the installed Strapi version
requires the equivalent local-plugin structure.

### Documentation and release files to update as phases land

- `README.md`.
- `docs/motorsport/revamp/03_sitemap_page_specs.md` if the canonical FIA URL is decided.
- `docs/motorsport/revamp/04_cms_architecture_admin_ux.md`.
- `docs/motorsport/revamp/05_migration_plan.md`.
- `docs/motorsport/revamp/07_testing_uat.md`.
- `docs/motorsport/revamp/08_deployment_handover.md`.
- `docs/13_local_docker_deployment.md` if runtime/config instructions change.
- `docs/PHASE_PROGRESS.md` and
  `checklists/motorsport/motorsport_revamp_phase_checklist.md` at every phase.

## Decisions still required in later phases

- Select the canonical FIA Rallycross URL and approve any redirect; do not
  remove an existing valuable route without evidence and approval.
- Confirm approved production ticket providers, redirect URLs, and any embed
  allowlist. No internal payment or ticket engine is permitted.
- Confirm whether legal pages are Motorsport-owned or link to shared Gateway
  documents.
- Supply/approve IJTC riders, standings, regulation PDF, FIA campaign media and
  rundown/rules, team portraits, and merchandise imagery/content.
- Validate the CMS workspace approach against the installed Strapi admin APIs
  in MSR-2 while keeping one shared Strapi instance and database.
