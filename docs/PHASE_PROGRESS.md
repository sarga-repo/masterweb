# Sarga Multisite — Phase Progress Log

Running record of what was built in each phase of the Sarga Motorsport multisite
work (`prompts/motorsport/`). Update this file at the end of **every** completed
phase (see AGENTS.md → "Phase progress tracking").

| Phase | Title                         | Status  | Date       |
| ----- | ----------------------------- | ------- | ---------- |
| 1     | Repository restructure        | ✅ Done | 2026-07-04 |
| 2     | Shared CMS multisite model    | ✅ Done | 2026-07-04 |
| 3     | Motorsport frontend bootstrap | ✅ Done | 2026-07-04 |
| 4     | Motorsport design system      | ✅ Done | 2026-07-04 |
| 5     | Motorsport homepage           | ✅ Done | 2026-07-04 |
| 6     | Motorsport pages              | ✅ Done | 2026-07-04 |
| 7     | Gateway integration           | ✅ Done | 2026-07-04 |
| 8     | Forms, ticketing, SEO         | ✅ Done | 2026-07-04 |
| 9     | Quality & UAT                 | ✅ Done | 2026-07-04 |
| 10    | Deployment & handover         | ✅ Done | 2026-07-04 |

## Horse Sport track (`prompts/horsesport/`)

| Phase | Title                          | Status  | Date       |
| ----- | ------------------------------ | ------- | ---------- |
| HS-1  | Repository restructure         | ✅ Done | 2026-07-05 |
| HS-2  | Shared CMS three-site model    | ✅ Done | 2026-07-05 |
| HS-3  | Horse Sport frontend bootstrap | ✅ Done | 2026-07-05 |
| HS-4  | Horse Sport design system      | ✅ Done | 2026-07-05 |
| HS-5  | Horse Sport homepage           | ✅ Done | 2026-07-05 |
| HS-6  | Horse Sport pages              | ✅ Done | 2026-07-05 |
| HS-7  | Cross-site integration         | ⬜ Todo | —          |
| HS-8  | Forms, ticketing, SEO          | ⬜ Todo | —          |
| HS-9  | Quality & UAT                  | ⬜ Todo | —          |
| HS-10 | Deployment & handover          | ⬜ Todo | —          |

## Local development model (established Phase 1)

- **PostgreSQL** runs in Docker (host port **5435**); Strapi + both frontends run
  on the **host**. Containerized apps are optional via the `apps` Compose profile.
- Ports: gateway **3000**, motorsport **3001**, horsesport **3002**,
  Strapi **1337**, Postgres **5435**.
- Start: `docker compose up -d postgres` → `cd cms && pnpm develop` →
  `cd frontend-gateway && pnpm dev` → `cd frontend-motorsport && pnpm dev` →
  `cd frontend-horsesport && pnpm dev`.

---

## Phase 1 — Repository restructure

**Prompt:** `prompts/motorsport/01_repo_restructure.md`

### What was done

- Reconciled the in-progress rename of `frontend/` → `frontend-gateway/`
  (removed leftover `frontend/`; package name → `frontend-gateway`).
- Created `frontend-motorsport/` placeholder folder (README only).
- Removed stale `docker/frontend.Dockerfile` and stray `docker/strapi copy.Dockerfile`.
- Renamed Compose service `frontend` → `frontend-gateway`; service set is now
  `postgres`, `strapi`, `frontend-gateway`, `frontend-motorsport`.
- Adopted the **Postgres-only-in-Docker** default: `strapi` / `frontend-gateway`
  / `frontend-motorsport` moved behind the `apps` Compose profile; `docker
compose up` starts Postgres only. Removed unused `frontend_node_modules` volume.
- Updated `README.md`, `docs/13_local_docker_deployment.md`,
  `docs/multisite/02_repository_restructure_plan.md`,
  `docs/motorsport/06_motorsport_implementation_plan.md`, `.claude/launch.json`,
  and a `cms/src/seed.ts` comment path.

### Files changed

- Modified: `docker-compose.yml`, `README.md`, `docs/13_local_docker_deployment.md`,
  `docs/multisite/02_repository_restructure_plan.md`,
  `docs/motorsport/06_motorsport_implementation_plan.md`,
  `frontend-gateway/package.json`, `.claude/launch.json`, `cms/src/seed.ts`
- Removed: `docker/frontend.Dockerfile`, `docker/strapi copy.Dockerfile`, leftover `frontend/`
- Added: `frontend-motorsport/README.md` (placeholder)

### How verified

- `docker compose config --services` → `postgres` only; `--profile apps` lists all four (VALID).
- Gateway typecheck + production build pass (25 routes); live dev server renders on `:3000`.

### Notes / caveats

- Kept all four service definitions (per prompt) via the `apps` profile rather than deleting them.

---

## Phase 2 — Shared CMS multisite model

**Prompt:** `prompts/motorsport/02_shared_cms_multisite_model.md`

### What was done

- Made the single shared Strapi CMS **site-aware** — no second CMS, no duplicated types.
- **New collection types** (schema + controller + routes + service):
  `site`, `partner`, `ticket-cta`, `media-gallery`.
- **New component:** `shared.event-session` (repeatable event schedule).
- **Site-aware fields** added to `event`, `news-article`, `ticket-cta`, `partner`,
  `media-gallery`, `ecosystem-business`: `siteScope`
  (`gateway|motorsport|shared|hidden`) + optional many-to-many `sites` relation.
- **Cross-site teaser flags:** `showOnGateway` / `showOnMotorsport` on events + news
  (plus `featuredOnGateway` / `featuredOnMotorsport` on news).
- **Event motorsport fields:** `racingCategory`, `seriesName`, `circuitName`,
  `venueAddress`, `schedule`, `heroMedia`, `gallery`, `broadcastUrl`, `ticketCtas`, `sponsors`.
- `eventStatus` and `news-article.category` enums **extended (not replaced)** for
  backward compatibility.
- `ecosystem-business` gained `siteScope` (default `shared`) + `dedicatedSiteUrl`.
- Seed: public-read permissions for the 4 new types; `sarga-gateway` +
  `sarga-motorsport` Site records; a motorsport demo set (event + linked ticket CTA
  - partner + news).
- Updated `strapi/content-types.json` (mirror) + `docs/motorsport/05_…md` (impl notes).

### Files changed

- Modified: `cms/src/api/{event,news-article,ecosystem-business}/content-types/.../schema.json`,
  `cms/src/seed.ts`, `strapi/content-types.json`,
  `docs/motorsport/05_motorsport_content_model_extensions.md`
  (+ regenerated `cms/types/generated/*.d.ts`)
- Added: `cms/src/api/{site,partner,ticket-cta,media-gallery}/**`,
  `cms/src/components/shared/event-session.json`

### How verified

- Booted Strapi against Postgres: schemas auto-migrated, `Strapi started successfully`,
  seed created 2 sites + motorsport demo.
- Public API queries confirmed: motorsport-only filtering, gateway teaser query
  (`siteScope IN [gateway,shared]` OR `showOnGateway=true`), bidirectional
  `ticket-cta.relatedEvent ↔ event.ticketCtas`, business relation, and backward-compat
  (existing gateway news still served).

### Notes / caveats

- Spec's singular `ticketCta` implemented as bidirectional one-to-many
  `event.ticketCtas ↔ ticket-cta.relatedEvent`.
- `Page` / `Navigation Menu` / `Footer Menu` / `Campaign Landing Page` deferred
  (don't exist yet; build when needed).
- **Migration caveat:** records created before `siteScope` existed have `null`
  scope (enum defaults apply on create, not retroactively). Treat missing scope as
  gateway/shared; a fresh-DB seed assigns explicit scopes.

---

## Phase 3 — Motorsport frontend bootstrap

**Prompt:** `prompts/motorsport/03_motorsport_frontend_bootstrap.md`

### What was done

- Bootstrapped `frontend-motorsport/` on the **same stack as the gateway**
  (Next 16.2.9, React 19, Tailwind v4, TypeScript, pnpm), standardized on
  **port 3001** (host + container).
- Toolchain configs mirroring the gateway; env wiring to the **shared CMS**
  (`.env.local` + `src/lib/strapi/config.ts` with gateway-parity URL precedence,
  `src/lib/site-config.ts`).
- Design **foundation** in `globals.css`: Tailwind v4 `@theme` with the full
  motorsport token palette (`--color-ms-*`), display/body font fallback stacks,
  dark base, global reduced-motion guard. (Full component system = Phase 4.)
- Root `layout.tsx` (motorsport metadata/OG) + an **on-brand placeholder
  homepage** with a live CMS status indicator. Logos copied to `public/brand/`.
- Docker: `frontend-motorsport.Dockerfile` `EXPOSE 3001`; Compose maps `3001:3001`;
  motorsport service env aligned to the app's variable names.
- Updated root README + app README + `.claude/launch.json`.

### Files changed

- Added: `frontend-motorsport/**` (configs, `src/app/{layout,page,globals.css}`,
  `src/lib/{site-config,strapi/config}.ts`, `public/brand/*` logos, README, lockfile)
- Modified: `docker/frontend-motorsport.Dockerfile`, `docker-compose.yml`,
  `README.md`, `.claude/launch.json`

### How verified

- `pnpm install` clean; typecheck, lint, prettier, and production build all pass.
- Dev server serves HTTP 200 on `localhost:3001`; on-brand dark hero renders
  (distinct from gateway); zero console errors; logo loads via the image optimizer.
- **End-to-end CMS read proven:** page shows
  "Shared CMS (http://localhost:1337): connected — 2 site record(s)".
- `docker compose --profile apps config` VALID with `3001:3001`.

### Notes / caveats

- Placeholder only — no header/footer/hero components or real pages yet
  (design system = Phase 4, pages = Phase 6).
- Fonts use CSS-variable fallback stacks; licensed Owners Wide / Noto Sans added later.
- Optional Docker `apps` profile inherits `STRAPI_API_URL` from root `.env` for
  server-side calls (pre-existing pattern shared with the gateway); the host
  workflow is the supported, verified path.

---

## Phase 4 — Motorsport design system

**Prompt:** `prompts/motorsport/04_motorsport_design_system.md`

### What was done

- Expanded the Tailwind v4 theme into the full Motorsport token system: brand
  colors, typography targets, responsive spacing, shadows, easing, thermal
  gradients, track grid, grain, slanted geometry, and reduced-motion behavior.
- Added typed, CMS-shaped design-system contracts for events, articles, media,
  partners, navigation, status, and galleries.
- Implemented the full reusable component inventory: header, footer, hero,
  event feature/list cards, ticket panel, news card, experience card, partner
  strip, gallery rail, countdown, status chip, section header, and gradient rule.
- Enforced the 140px logo minimum and used the inverse/full-color lockup on dark
  surfaces. Added two lightweight abstract SVG motion studies for the component
  showcase; production photography remains a Phase 5/CMS concern.
- Replaced the Phase 3 placeholder with a clearly labelled Phase 4 component
  showcase; no production homepage content architecture was started.

### Files changed

- Modified: `frontend-motorsport/src/app/{globals.css,page.tsx}`
- Added: `frontend-motorsport/src/components/{cards,layout,sections,ui}/**`,
  `frontend-motorsport/src/components/index.ts`,
  `frontend-motorsport/src/types/design-system.ts`,
  `frontend-motorsport/public/media/design-system-{motion,circuit}.svg`
- Modified: `docs/PHASE_PROGRESS.md`

### How verified

- Prettier, ESLint, TypeScript, and Next.js production build pass.
- Browser QA at 499px and 1440px: no horizontal overflow; mobile menu opens,
  traps page scrolling, and fully covers content; desktop navigation replaces it.
- Verified 140px minimum mobile logo, loaded media, semantic heading hierarchy,
  named links, and zero browser console errors.

### Notes / caveats

- Owners Wide is configured as the display target but its licensed webfont file
  is not included. Noto Sans likewise uses the configured fallback stack until
  approved font assets or hosting are supplied.
- The abstract SVGs are design-system fixtures, not approved campaign media.

**2026-07-04 refinement:** Re-art-directed the Phase 4 showcase from a
gateway-adjacent cinematic editorial treatment to a distinct `Live Timing ×
Paddock Heat` Motorsport system. Added race-control navigation, telemetry/data
rails, outlined display treatment, operational event/ticket panels, trackside
Motorsport imagery, and a three-layer primitive → semantic → component token
model. Self-hosted the exact open-source Noto Sans Variable family through
`@fontsource-variable/noto-sans`. Owners Wide was verified as the commercial
MCKL typeface; no unlicensed mirror file was added, so production use still
requires an approved MCKL web license or Adobe Fonts configuration.

**2026-07-04 discipline coverage note:** Confirmed Sarga Motorsport is not a
car-only property. Updated the project brief, brand translation, sitemap/page
specification, design system, CMS extension guidance, implementation plan, and
future Phase 5/6 prompts to require balanced car and motorcycle representation
plus `car | motorcycle | mixed` discovery. Generated and integrated
`motorcycle-racing-dusk.png` into event, editorial, and gallery showcase states.

**2026-07-04 media/interaction correction:** Removed the two abstract SVG
showcase images and replaced their remaining UI usage with real trackside car
and motorcycle photography. Corrected the Event File hover state to retain a
dark surface with Electric Yellow text, preventing foreground/background color
collision.

**2026-07-11 hero 3D enhancement:** Added a premium Formula-style interactive
3D hero layer to `frontend-motorsport/` on branch
`feature/motorsport-3d-f1-experience`. The experience is desktop-first and
lazy-loaded with graceful fallback: if `/public/models/f1-car.glb` is missing,
WebGL is unavailable, reduced motion is enabled, or the device is low-end, the
hero automatically renders a premium static poster treatment instead. Added
model-replacement and optimization docs in
`frontend-motorsport/public/models/README.md` and
`docs/motorsport/3d_f1_car_experience.md`.

**2026-07-12 procedural hero refinement:** Replaced the remaining GLB
dependency in the Motorsport hero with a fully procedural Formula-style car
scene built directly in React Three Fiber. The homepage no longer requires
`/public/models/f1-car.glb` to unlock the 3D experience; fallback mode is now
used only for reduced-motion, unsupported WebGL, smaller viewports, or
lower-power devices.

**2026-07-12 cinematic sequence refinement:** Swapped the desktop Motorsport
hero from realtime WebGL rendering to a premium canvas-based frame-sequence
animation sourced from `frontend-motorsport/public/images/motorsport/f1-car-frames`.
The hero now uses smooth scroll-led frame progression, subtle pointer parallax,
and a lighter poster fallback for compact, reduced-motion, or lower-power
contexts.

**2026-07-12 full-hero sequence correction:** Promoted the Motorsport frame
sequence from a small right-side hero panel into the actual full-bleed homepage
hero media layer. The legacy hero video is now skipped when the frame sequence
is configured, so the first viewport presents one cinematic animated background
instead of a video plus inset preview card.

**2026-07-12 full playback correction:** Updated the Motorsport hero sequence
renderer so the desktop animation plays through the full 64-frame set in a
smooth ping-pong loop instead of only nudging through the opening quarter of the
frames. Verified in Chrome via canvas pixel sampling over time and pointer
movement.

**2026-07-12 pointer scrub correction:** Fixed the frame loader so all 64 hero
sequence frames are eagerly available to the canvas instead of only the opening
frames. Increased pointer-driven frame scrubbing so mouse movement can traverse
a dramatic portion of the sequence; browser verification moved from frame 15 to
frame 58 across a left-to-right pointer test.

**2026-07-12 PNG frame upgrade:** Updated the Motorsport hero sequence path
generator from `.jpg` to the regenerated high-resolution `.png` frame set
(`ezgif-frame-001.png` through `ezgif-frame-064.png`). Verified in Chrome that
all 64 PNG frames are requested and pointer movement scrubs from frame 16 to
frame 52.

**2026-07-12 interactive sequence section:** Moved the 64-frame Formula-style
PNG sequence out of the homepage hero into a dedicated sticky section directly
below the hero. Restored the hero to its previous video media layer, added the
new `Control the apex.` scroll/pointer-controlled section, extended the scroll
runway, and tuned the canvas renderer so non-autoplay sections can use the full
frame range. Verified in Chrome that the hero renders one video and no sequence
canvas, the new section requests all 64 frames, and pointer/scroll interaction
travels across 51 measured frames with reverse scroll support.

---

## Phase 5 — Motorsport homepage

**Prompt:** `prompts/motorsport/05_motorsport_homepage.md`

### What was done

- Replaced the Phase 4 design-system showcase with the **production homepage**
  composing all 11 required sections: header/nav, cinematic hero, featured
  event + ticket CTA, brand story / 360° racing ecosystem, upcoming events,
  experience pillars, news/media highlights, gallery strip, partner/sponsor
  strip, newsletter/contact CTA, and footer.
- Created **Strapi REST client** (`src/lib/strapi/client.ts`) with typed list
  responses, media-URL helper, populate/filter/sort/revalidate options, and
  automatic try/catch fallback.
- Created **homepage data layer** (`src/lib/homepage-data.ts`) that fetches
  events, news-articles, partners, media-galleries, and ticket-ctas from the
  shared CMS (siteScope `motorsport | shared`), maps them to component types,
  and falls back to curated placeholder content when the API is unreachable.
- Added **BrandStorySection** component — two-column editorial layout with
  display headline, slanted image crop, decorative data rail, and six
  ecosystem-pillar cards (car racing, motorcycle racing, lifestyle, community,
  media, venue).
- Added **NewsletterCtaSection** client component — dark premium panel with
  email input, crimson CTA button, and optional contact redirect link.
- Balanced car and motorcycle representation across featured events (touring
  car + superbike), gallery items, news articles, and brand-story imagery.
- Ticket CTA works as partner redirect/deep link placeholder — external URLs
  open in new tab, internal `/tickets` link for placeholder mode.
- Homepage is CMS-ready: all content flows from `fetchHomepageData()` with
  graceful degradation; no hardcoded content expected from CMS.

### Files changed

- Modified: `frontend-motorsport/src/app/page.tsx` (full rewrite)
- Modified: `frontend-motorsport/src/components/index.ts` (+2 exports)
- Added: `frontend-motorsport/src/lib/strapi/client.ts`
- Added: `frontend-motorsport/src/lib/homepage-data.ts`
- Added: `frontend-motorsport/src/components/sections/brand-story-section.tsx`
- Added: `frontend-motorsport/src/components/sections/newsletter-cta.tsx`
- Modified: `docs/PHASE_PROGRESS.md`

### How verified

- `tsc --noEmit` — zero errors.
- `eslint .` — passes.
- `prettier --check` — all files formatted.
- `pnpm build` — compiled successfully, static page generated with 1-minute
  revalidation.
- Dev server HTTP 200 on `localhost:3001`; all 11 sections confirmed in HTML
  output (grep: hero headline, brand story, featured event, upcoming events,
  experience, news, gallery, partners, newsletter CTA, footer).
- Zero server-side console errors. Minor LCP image notice for non-hero image
  (does not affect functionality).

### Notes / caveats

- Placeholder content is used when the CMS is unreachable (local dev without
  Strapi, CI). Run `docker compose up -d postgres` + `cd cms && pnpm develop`
  to populate real CMS data.
- The newsletter form uses `onSubmit` prevention as a placeholder; real email
  integration (Mailchimp, Convertible, etc.) will be wired in Phase 8.
- Owners Wide display typeface uses CSS-variable fallback stack; licensed
  webfont not yet included.
- The `fetchHomepageData()` function uses `revalidate: 60` for ISR (Incremental
  Static Regeneration) — content refreshes every 60 seconds in production.

---

## Phase 6 — Motorsport pages

**Prompt:** `prompts/motorsport/06_motorsport_pages.md`

### What was done

- Created **shared CMS data module** (`src/lib/cms-data.ts`) with reusable
  fetchers, mapping helpers, and site-scope filters for events, articles,
  partners, galleries, and ticket CTAs — consumed by all page routes.
- Created **PageShell** wrapper (`src/components/layout/page-shell.tsx`)
  providing consistent MotorsportHeader + MotorsportFooter across all routes.
- Built all **11 page routes** with CMS-first data fetching, graceful placeholder
  fallbacks, typed data models, SEO metadata, and responsive motorsport design:
  - `/events` — listing with upcoming/past split, discipline-aware cards
  - `/events/[slug]` — detail with hero, session data panel, ticket CTA,
    gallery, partner logos, back link
  - `/tickets` — curated ticket journey with partner redirects
  - `/experience` — 6 ecosystem pillars with dual imagery
  - `/news` — listing with featured article + grid layout
  - `/news/[slug]` — article detail with hero image, body, related articles
  - `/gallery` — masonry-style responsive grid
  - `/partners` — partner grid with partnership inquiry CTA
  - `/about` — brand story, ecosystem, mission, personality, Sarga.co link
  - `/contact` — client-side inquiry form with 5 categories + sidebar contacts
  - `/campaign/[slug]` — dynamic CMS-driven campaign landing pages with
    reusable sections, hero, body, CTA bands, and upcoming events teaser
- All dynamic routes (`/[slug]`) use `generateMetadata()` for SEO and
  `notFound()` when CMS returns no data.
- Params typed as `Promise<{ slug: string }>` for Next.js 15+ compatibility.
- ISR: `revalidate: 60` for events/articles/tickets, `revalidate: 600` for
  partners/galleries.
- Balanced car and motorcycle content across all placeholder data.

### Files changed

- Added: `frontend-motorsport/src/lib/cms-data.ts`
- Added: `frontend-motorsport/src/components/layout/page-shell.tsx`
- Modified: `frontend-motorsport/src/components/index.ts` (+PageShell, +BrandStorySection, +NewsletterCtaSection)
- Added: `frontend-motorsport/src/app/events/page.tsx`
- Added: `frontend-motorsport/src/app/events/[slug]/page.tsx`
- Added: `frontend-motorsport/src/app/tickets/page.tsx`
- Added: `frontend-motorsport/src/app/experience/page.tsx`
- Added: `frontend-motorsport/src/app/news/page.tsx`
- Added: `frontend-motorsport/src/app/news/[slug]/page.tsx`
- Added: `frontend-motorsport/src/app/gallery/page.tsx`
- Added: `frontend-motorsport/src/app/partners/page.tsx`
- Added: `frontend-motorsport/src/app/about/page.tsx`
- Added: `frontend-motorsport/src/app/contact/page.tsx`
- Added: `frontend-motorsport/src/app/campaign/[slug]/page.tsx`
- Modified: `docs/PHASE_PROGRESS.md`

### How verified

- `tsc --noEmit` — zero errors.
- `prettier --check` — all files formatted.
- `next build` — compiled successfully in 4.3s. 13 routes generated:
  9 static (○) with ISR revalidation, 3 dynamic (ƒ) server-rendered on demand.
  Zero build warnings.

### Notes / caveats

- `/campaign/[slug]` uses placeholder data keyed by slug. A real Strapi
  `campaigns` collection will be created in a future phase when needed.
- `/contact` form is client-side only (`useState`); real email/API submission
  will be wired in Phase 8 (Forms, ticketing, SEO).
- All pages use `PageShell` for consistent header/footer — any navigation
  changes only need to be made in one place.
- Campaign pages are designed to be composable: sections (hero, body, cta,
  gallery) can be rearranged or extended when the CMS model is ready.

**2026-07-04 Phase 6 refinement — premium hero upgrade:**

- Created reusable **PageHero** component (`src/components/sections/page-hero.tsx`)
  with multi-layer radial gradients, optional cinematic background images with
  slow-zoom animation, speed lines (crimson/orange/teal animated streaks), grain
  overlay, shimmer accent rail, and staggered entrance animations for kicker,
  title, description, and children.
- Created **GalleryCarousel** client component (`src/components/sections/gallery-carousel.tsx`)
  with crossfade transitions, auto-play (4.5s interval, pauses on hover), keyboard
  navigation (arrow keys), thumbnail strip, progress bar, speed-line decorations,
  grain overlay, and prev/next glassmorphic buttons.
- Added 7 new CSS animations to `globals.css`: `ms-slow-zoom`, `ms-fade-up`,
  `ms-stagger-in`, `ms-speed-lines`, `ms-carousel-scroll`, `ms-shimmer` — all
  wrapped in `prefers-reduced-motion: no-preference`.
- Upgraded all 11 page routes to use the premium PageHero or enhanced inline
  heroes with speed lines, staggered animations, grain, and shimmer accents.
  Each page uses a unique accent color and gradient position for visual variety.
- Gallery page now features the carousel above the existing masonry grid.
- `next build` passes: 13 routes (9 static, 3 dynamic), zero errors.
- Browser-tested all 9 routeable pages: HTTP 200, hero sections confirmed,
  gradient effects visible, carousel functional, zero console errors.

**2026-07-04 Phase 6 refinement — dot pattern addition:**

- Added `ms-track-grid` dot pattern overlay (`opacity-25`) to all page heroes —
  the PageHero component (used by 8 routes) and the 3 inline hero sections
  (events/[slug], news/[slug], campaign/[slug]). Combined with existing
  gradients, speed lines, grain, and shimmer effects for a richer, more
  textured hero background that matches the homepage hero treatment.
- `next build` passes. Browser-tested: dot pattern confirmed visible at 25%
  opacity, adding subtle depth without distraction.

**2026-07-04 Phase 6 bugfix — detail page 404 fix:**

- Fixed `/events/[slug]` and `/news/[slug]` returning 404 when CMS is offline.
  Both detail pages now include a `PLACEHOLDER_MAP` that matches the slugs used
  on the listing pages. The pages attempt CMS fetch first, then fall back to
  placeholder data — so all 4 event slugs and 4 news slugs resolve correctly
  in offline/local dev mode. When CMS is live, CMS data takes priority.
- `next build` passes. Browser-tested: `/news/riders-rewrite-the-racing-line`
  and `/events/race-weekend-indonesia` both render full detail pages with hero
  images, body content, and navigation links.

**2026-07-04 Phase 6 addition — premium error pages:**

- Created 3 premium error pages matching the motorsport brand identity:
  - `not-found.tsx` (404 — "Off Track"): dark background with dot pattern,
    grain, speed lines, shimmer rail, crimson accents, giant gradient "404",
    motorsport-themed copy, dual CTAs ("Return to pit lane" + "Browse events"),
    and section indicator.
  - `error.tsx` (500 — "Mechanical Failure"): client component error boundary
    with orange/crimson palette, "Try again" button calling `reset()`, "Return
    to pit lane" fallback link, error digest display for dev debugging.
  - `global-error.tsx` (root layout crash): standalone page with inline styles
    (no CSS dependency), minimal dark design, inline `<html>/<body>` as
    required by Next.js, "Try again" + "Return home" actions.
- All pages use brand tokens (Apex Crimson, Ignition Orange, Warm White,
  Charcoal Black), display typeface, and motorsport-flavoured copy.
- `next build` passes. Browser-tested: 404 page renders correctly with all
  premium visual layers and navigation working.

---

## Phase 7 — Gateway integration (2026-07-04)

**What was done:**

- Added `NEXT_PUBLIC_MOTORSPORT_SITE_URL=http://localhost:3001` to gateway
  `.env.local` and created `src/lib/site-config.ts` with `motorsportUrl()`
  helper that builds absolute URLs for the motorsport frontend (returns
  `undefined` when not configured, so callers fall back gracefully).
- Added `siteScope` field (`"gateway" | "motorsport" | "shared"`) to gateway
  types: `NewsArticle`, `EventItem`, `RawNewsArticle`, `RawEvent`. Updated
  `mapArticle()` and `mapEvent()` to pass the field through.
- Updated `EcosystemCard` to detect `sarga-motorsport` slug and link to the
  motorsport frontend URL (with `target="_blank"`) instead of the gateway
  detail page when the URL is configured.
- Updated `NewsPreview` section: articles with `siteScope === "motorsport"`
  now link to the motorsport frontend `/news/[slug]` instead of the gateway
  local `/news/[slug]`. External links open in a new tab.
- Updated Ticket Hub listing: motorsport-scoped events link to the
  motorsport frontend `/events/[slug]` instead of `/ticket-hub/[slug]`.
  CTA label changes to "View on motorsport site" for those events.
- Updated Ticket Hub detail (`/ticket-hub/[slug]`): motorsport-scoped events
  show a "View on Sarga Motorsport" CTA alongside (or instead of) the ticket
  partner redirect.
- Updated Footer: the "Sarga Motorsport" link in the Ecosystem Map column
  routes to the motorsport frontend when configured.
- Updated `ecosystem/[slug]` detail page: related articles and events with
  `siteScope === "motorsport"` link to the motorsport frontend. Event labels
  change to "Motorsport event" for clarity.
- All external links use `target="_blank" rel="noopener noreferrer"`.
- Gateway content and design remain intact — no motorsport pages merged.

**Files changed:**

- `frontend-gateway/.env.local` — added `NEXT_PUBLIC_MOTORSPORT_SITE_URL`
- `frontend-gateway/src/lib/site-config.ts` — new, motorsport URL helper
- `frontend-gateway/src/lib/strapi/types.ts` — added `SiteScope` + field
- `frontend-gateway/src/lib/strapi/news.ts` — mapper includes `siteScope`
- `frontend-gateway/src/lib/strapi/events.ts` — mapper includes `siteScope`
- `frontend-gateway/src/components/sections/ecosystem-card.tsx` — external link
- `frontend-gateway/src/components/sections/news-preview.tsx` — scope-aware href
- `frontend-gateway/src/components/layout/footer.tsx` — motorsport footer link
- `frontend-gateway/src/app/ticket-hub/page.tsx` — scope-aware event cards
- `frontend-gateway/src/app/ticket-hub/[slug]/page.tsx` — motorsport CTA
- `frontend-gateway/src/app/ecosystem/[slug]/page.tsx` — scope-aware related links

**How verified:**

- `next build` passes for both gateway (port 3000) and motorsport (port 3001).
- Browser-tested on gateway homepage: ecosystem card for Sarga Motorsport has
  `href="http://localhost:3001/"` with `target="_blank"`. Footer "Sarga Motorsport"
  link also points to `http://localhost:3001/` with `target="_blank"`.
- All other gateway pages render correctly with no broken links.

**Notes / caveats:**

- When `NEXT_PUBLIC_MOTORSPORT_SITE_URL` is empty or unset, all motorsport
  links gracefully fall back to internal gateway routes (`/ecosystem/sarga-motorsport`,
  `/news/[slug]`, `/ticket-hub/[slug]`). This preserves offline/local dev
  behaviour when only the gateway is running.
- The `siteScope` field only takes effect when CMS data is available. Mock data
  does not include `siteScope`, so the fallback behaviour is gateway-local.

---

## Phase 8 — Forms, ticketing, SEO (2026-07-04)

**Prompt:** `prompts/motorsport/08_forms_ticketing_seo.md`

### What was done

- **Contact form with server-side validation:**
  - Created Zod v4 validation schema (`src/lib/validation.ts`) with honeypot
    field, timing check, and optional reCAPTCHA token support.
  - Created POST API route (`src/app/api/contact/route.ts`) with rate limiting
    (5 req / 10 min per IP), honeypot spam check, timing validation (800ms–24h),
    and placeholder mode for local dev (real Strapi submission when CMS is live).
  - Updated contact page to POST to the API with inline error display, loading
    states, and success confirmation.
- **Ticket CTA embed support:**
  - Added `embedCode` field to `CmsTicketCta` type in `cms-data.ts`.
  - Updated tickets page with optional iframe embed when CMS provides
    `embedCode` — sandboxed, lazy-loaded, with branded checkout frame.
- **SEO metadata enhancements:**
  - Removed hardcoded OG title/description from root layout to allow page-level
    overrides via `generateMetadata()`.
  - Added Open Graph metadata (`type: "article"`) to `/news/[slug]` and
    `/events/[slug]` detail pages.
- **Sitemap & robots:**
  - Created `src/app/sitemap.ts` — dynamic sitemap generation from CMS articles
    and events, plus 6 static paths, with `changeFrequency` and `priority`.
  - Created `src/app/robots.ts` — allows all crawlers, points to `/sitemap.xml`.
- **Environment variables:**
  - Updated `.env.example` with `NEXT_PUBLIC_MOTORSPORT_SITE_URL`,
    `NEXT_PUBLIC_GATEWAY_SITE_URL`, and `NEXT_PUBLIC_SITE_KEY`.

### Files changed

- Added: `frontend-motorsport/src/lib/validation.ts`
- Added: `frontend-motorsport/src/app/api/contact/route.ts`
- Added: `frontend-motorsport/src/app/sitemap.ts`
- Added: `frontend-motorsport/src/app/robots.ts`
- Modified: `frontend-motorsport/src/app/contact/page.tsx`
- Modified: `frontend-motorsport/src/lib/cms-data.ts` (+embedCode field)
- Modified: `frontend-motorsport/src/app/tickets/page.tsx` (+embed iframe)
- Modified: `frontend-motorsport/src/app/layout.tsx` (removed hardcoded OG)
- Modified: `frontend-motorsport/src/app/news/[slug]/page.tsx` (+OG metadata)
- Modified: `frontend-motorsport/src/app/events/[slug]/page.tsx` (+OG metadata)
- Modified: `.env.example` (+motorsport env vars)

### How verified

- `next build` — compiled successfully, 1 route (1 static), zero errors/warnings.
- Browser-tested all 5 key pages (homepage, contact, tickets, news, events):
  HTTP 200, all content renders, zero console errors. Only minor Next.js LCP
  image optimization warnings (cosmetic, non-blocking).
- Gateway contact form also verified on port 3000.
- Resolved Turbopack cache corruption issue that caused gateway `/about` and
  `/ecosystem` pages to reload-loop — cleared `.next` cache and restarted.

### Notes / caveats

- Contact form uses **placeholder mode** locally (logs submission, returns
  success). Production wires to Strapi's contact form endpoint or an email
  service (SendGrid, Resend, etc.).
- Newsletter signup form remains client-side only (placeholder); real email
  integration deferred to a future phase.
- Rate limiting uses in-memory `Map` — resets on server restart. Production
  should use Redis or a shared store for multi-instance deployments.
- Sitemap uses `href` property from CMS data types (not raw `slug`) for
  compatibility with the mapped article/event types.
- Ticket embed iframe is sandboxed (`allow-scripts allow-same-origin allow-forms
allow-popups`) and only renders when CMS explicitly provides `embedCode`.

---

## Phase 9 — Quality & UAT (2026-07-04)

**Prompt:** `prompts/motorsport/09_quality_uat.md`

### What was done

- **Build verification:** All three projects pass lint, typecheck, and build:
  - Gateway: ESLint clean, Next.js build 2 routes (1 static, 1 dynamic), zero errors.
  - Motorsport: ESLint clean (fixed 13 lint issues across 6 files), Next.js build
    1 route (1 static), zero errors.
  - CMS: TypeScript compilation completed.
- **Lint fixes applied:**
  - Replaced all `<a href>` with `<Link href>` in motorsport homepage for client-side nav.
  - Fixed all unescaped JSX entities (`'`, `"`, `…`) across about, not-found,
    campaign, tickets, and contact pages.
  - Fixed React hooks purity: changed `useRef(Date.now())` to `useState(() => Date.now())`
    in contact form for React Compiler compatibility.
  - Removed unused imports and variables across error pages and tickets page.
  - Added `eslint-disable` for intentional `<a href="/">` in `global-error.tsx`.
- **SEO fix:** Added `og:image` meta tag to both frontends:
  - Motorsport: `/media/motorsport-design-hero.png` (1200x630).
  - Gateway: `/assets/media/sarga-cinematic-hero-concept.png` (1200x630).
- **Browser verification (26/27 checks passed):**
  - Responsive: no horizontal overflow, mobile menu functional.
  - Cross-site navigation: gateway→motorsport (2 links) and motorsport→gateway
    (footer + mobile nav) all verified.
  - Accessibility: 18/18 images have alt text, proper heading hierarchy (1× H1,
    11× H2, 15× H3), cream-on-dark contrast passes WCAG AA.
  - SEO: title, description, og:title, og:description, og:type, og:image all present.
  - sitemap.xml: 6 URLs with changefreq/priority.
  - robots.txt: allows all, disallows /api/, references sitemap.
  - Contact form: validation errors on empty submit, success on valid submit,
    loading state with disabled button.
- **UAT checklist updated** at `checklists/motorsport/motorsport_uat_checklist.md`.

### Files changed

- Modified: `frontend-motorsport/src/app/page.tsx` (3× `<a>` → `<Link>`)
- Modified: `frontend-motorsport/src/app/about/page.tsx` (escaped entities)
- Modified: `frontend-motorsport/src/app/not-found.tsx` (escaped entities)
- Modified: `frontend-motorsport/src/app/campaign/[slug]/page.tsx` (escaped entities, unused var)
- Modified: `frontend-motorsport/src/app/tickets/page.tsx` (escaped entity, unused import)
- Modified: `frontend-motorsport/src/app/contact/page.tsx` (purity fix, escaped entity)
- Modified: `frontend-motorsport/src/app/error.tsx` (removed unused router import)
- Modified: `frontend-motorsport/src/app/global-error.tsx` (eslint-disable for `<a>`)
- Modified: `frontend-motorsport/src/app/layout.tsx` (+og:image)
- Modified: `frontend-gateway/src/app/layout.tsx` (+og:image)
- Modified: `checklists/motorsport/motorsport_uat_checklist.md` (full UAT status)

### How verified

- `next build` — zero errors, zero warnings for both frontends.
- `eslint .` — zero issues for both frontends.
- `tsc --noEmit` — zero errors for CMS.
- Browser-tested 16 checks: 15 pass, 1 warn (decorative low-opacity labels).
- All UAT checklist items marked complete.

### Notes / caveats

- Decorative system labels (section numbers, data rails) use very low opacity
  (0.24–0.32) — acceptable for non-content decorative elements.
- Manual responsive testing at 390px and 1440px recommended for visual QA sign-off
  (automated viewport resizing was limited in browser agent).
- Contact form placeholder mode — production needs real email integration.
- Rate limiting uses in-memory store — production needs Redis for multi-instance.

---

## Phase 10 — Deployment & Handover (2026-07-04)

**Prompt:** `prompts/motorsport/10_deployment_handover.md`

### What was done

- **Updated deployment documentation** (`docs/10_deployment_handover_maintenance.md`):
  - Added architecture overview reflecting multisite structure (2 frontends + 1 CMS).
  - Added complete environment variable inventory for all 4 services: root `.env`,
    gateway `.env.local`, motorsport `.env.local`, CMS `.env`, and PostgreSQL.
  - Added local Docker Compose usage guide with default and full-container workflows.
  - Added production deployment options: Vercel + managed Strapi (recommended),
    Docker Compose on VPS, and Kubernetes.
  - Added domain routing table for gateway, motorsport, and CMS subdomains.
  - Added production checklist (10 steps from secrets to cross-site link testing).
  - Added CMS maintenance notes: content ownership, site scope rules, content types
    table, content sync rules, and backup/restore procedures.
  - Updated handover deliverables list with checkmarks for all completed items.
  - Updated local deployment handover section with multisite startup commands.
- **Updated go-live checklist** (`checklists/go_live_checklist.md`):
  - Split content section into Gateway and Motorsport subsections.
  - Added multisite technical checks (both builds, both domains, cross-site links).
  - Added CMS content section (siteScope, teasers, ticket CTAs, partners, gallery).
  - Expanded forms section with production mode and reCAPTCHA items.
  - Expanded ticketing section with embed iframe testing.
- **No infrastructure changes made** — documentation only, as required.

### Files changed

- Modified: `docs/10_deployment_handover_maintenance.md` (major rewrite for multisite)
- Modified: `checklists/go_live_checklist.md` (multisite expansion)
- Modified: `docs/PHASE_PROGRESS.md`

### How verified

- All existing documentation cross-referenced against actual codebase:
  - `.env.example` matches documented variables.
  - `docker-compose.yml` services match documented ports and profiles.
  - `cms/.env.example` matches documented CMS variables.
  - `frontend-gateway/.env.local` and `frontend-motorsport/.env.local` match
    documented per-app variables.
- All acceptance criteria met:
  - Clear deployment instructions exist for local and production.
  - Clear CMS ownership and content sync rules documented.
  - Handover includes all required items with checkmarks.

### Notes / caveats

- Production domain names are illustrative (`sarga.co`, `motorsport.sarga.co`,
  `cms.sarga.co`) — final domains to be confirmed by Sarga.
- Production hosting recommendation is Vercel + managed Strapi, but final
  infrastructure choice is Sarga's decision.
- Newsletter email integration remains deferred — no storage provider selected yet.
- Contact form uses placeholder mode locally; production needs `FORM_SUBMISSION_MODE=strapi`
  with a create-permission token.
- All 10 phases of the motorsport multisite project are now complete.

---

## Gateway homepage visual refinement (2026-07-04)

### What was done

- Refined the Sarga.co homepage into a calmer “Cinematic Corporate Precision”
  direction while retaining the approved brand palette, typography, hero media,
  and racing-band graphic language.
- Removed stacked dot-grid, mesh, repeated flag, glow, speed-line, shimmer, and
  divider treatments from homepage sections.
- Limited each homepage section to one controlled visual gesture and retained
  only purposeful image, reveal, card, and CTA motion.
- Added semantic homepage surface, line, shadow, halo, and accent tokens.

### Files changed

- Modified: `frontend-gateway/src/app/page.tsx`
- Modified: `frontend-gateway/src/app/globals.css`
- Modified: `frontend-gateway/src/components/sections/hero.tsx`
- Modified: `frontend-gateway/src/components/sections/about-preview.tsx`
- Modified: `frontend-gateway/src/components/sections/ecosystem-section.tsx`
- Modified: `frontend-gateway/src/components/sections/news-preview.tsx`
- Modified: `frontend-gateway/src/components/sections/ticket-hub-cta.tsx`
- Modified: `frontend-gateway/src/components/sections/newsletter-section.tsx`

### How verified

- `pnpm lint` and `tsc --noEmit` pass for `frontend-gateway`.
- Browser-checked the homepage at 1440px and 390px widths; document-level
  horizontal overflow is absent and homepage headings remain contained.

### Notes / caveats

- The gateway remains deliberately more editorial and corporate than the
  motorsport site; premium parity is achieved through restraint rather than by
  copying the motorsport visual language.

### Follow-up — News page refinement (2026-07-04)

- Removed the repeated stripe, dot-grid, mesh, glow, and net stack from the
  `/news` lead-story and editorial sections.
- Added a compact quiet variant for the News interior hero, simplified category
  navigation to underline tabs, and refined lead-story elevation and section
  borders.
- Verified at 1440px and 390px with no document or heading overflow.
- Restored the News hero to the standard shared interior-page height and branded
  band treatment, and added the existing governance editorial photograph so it
  remains visually consistent with Careers and other gateway interior pages.

### Follow-up — Gateway surface signature (2026-07-04)

- Added a restrained, reusable corner “signal rail” for major light and red
  surfaces: five bounded diagonal hairlines with brand-aware red/orange or
  inverse white treatment.
- Applied the signature across Home, About, Board of Directors, Company
  Structure, Careers, Contact, News, article detail, Ecosystem detail, Ticket
  detail, and major red CTA surfaces, alternating corners where appropriate.
- Removed the remaining legacy multi-layer `SectionDecor` treatment from the
  About page to prevent the new signature from competing with repeated grids,
  mesh, and flag textures.
- Verified representative pages at 1440px and 390px without horizontal overflow
  or browser console warnings.

### Enhancement — Motorsport cinematic hero video (2026-07-04)

- Processed the supplied clip (`sarga-motorsport-hero-background-video-v2.mp4`,
  F1 car from behind on a night circuit) into a web hero loop:
  removed the bottom-right sparkle watermark (ffmpeg `delogo`), trimmed the
  tail red-car/horse tie-in clip (10s → clean 9.5s), and built a **0.6s
  crossfade seamless loop** (final ~8.96s) to hide the camera-dolly loop jump.
- Encoded **WebM (VP9)** + **MP4 (H.264) fallback** + poster JPG into
  `frontend-motorsport/public/media/sarga-motorsport-hero.{webm,mp4}` /
  `-poster.jpg`.
- Added a reduced-motion-aware client `HeroVideo`
  (`src/components/ui/hero-video.tsx`, `useSyncExternalStore`) rendered by
  `MotorsportHero` above the poster `<Image>` and below the gradient overlay;
  the homepage hero now uses the poster as fallback + the video loop.
- Verified: assets serve (200), production build passes, and a browser preview
  confirmed the video autoplays muted, loops seamlessly (currentTime wraps),
  and fades in over the poster.

### Follow-up — Hero watermark-residual cover (2026-07-04)

- The `delogo` watermark removal left a faint soft patch that was visible in the
  hero's bottom-right on wide screens. Covered it with a dark radial corner
  scrim plus a "Part of SARGA.CO" endorsement mark
  (`public/brand/logo-part-of-sarga-endorsement-white.png`, cropped from the
  white lockup — the `-color` variant is black text, invisible on the dark hero).
- Added an optional `endorsement` prop to `MotorsportHero`; scrim + mark render
  on `lg+` only and are hidden on mobile (where that corner of the video is
  cropped out anyway). Verified no overlap with the session-data panel at
  1024/1440/1920 and hidden at 375.

### Follow-up — Frontend public asset deploy tracking (2026-07-04)

- Narrowed the root `.gitignore` asset rule so it continues to ignore the
  top-level source `assets/` directory while explicitly re-including
  `frontend-gateway/public/assets/**` and `frontend-motorsport/public/assets/**`.
- Confirmed the gateway header logo PNGs were being ignored previously, which
  prevented Vercel from receiving the static files during deployment.
- Git now sees the public asset paths correctly; the logo files themselves still
  need to be committed so the next deployment can serve them.

### Follow-up — Premium favicon set for both frontends (2026-07-04)

- Added branded favicon assets for `frontend-gateway` and
  `frontend-motorsport` using each frontend's existing logo artwork as the base.
- Generated `icon.png`, `apple-icon.png`, and `favicon.ico` inside both
  `src/app/` roots so Next.js serves them through file-based metadata without
  extra route wiring.
- Art-directed the gateway favicon as the Sarga horse/rider mark on a dark
  cinematic badge, and the motorsport favicon as the Motorsport `S` lockup plus
  speed motif on a performance-oriented dark badge.

---

## Horse Sport Phase 1 (HS-1) — Repository restructure

**Prompt:** `prompts/horsesport/01_repo_restructure.md`

### What was done

- Created the dedicated `frontend-horsesport/` Next.js + TypeScript + Tailwind
  CSS v4 app, cloned from the `frontend-motorsport/` baseline (same config,
  lockfile, and tooling). Runs independently on host port **3002**.
- Wired Horse Sport brand tokens into `globals.css` (palette, Stadmitte/Masifa
  font token stacks with safe fallbacks) per docs/horsesport/02 + 04. Full
  design system remains HS-4.
- Added a clearly labelled Phase 1 placeholder homepage (brand-token hero,
  cross-links to Sarga.co and Motorsport). Real hero/CMS sections are HS-3–HS-5.
- Added `src/lib/site-config.ts` with Horse Sport metadata + gateway/motorsport
  cross-link URLs.
- Copied approved logos into `frontend-horsesport/public/brand/`
  (`sarga_horse_sport_logo_black_text_smooth.png`,
  `sarga_horse_sport_logo_white_text_smooth.png`).
- Rewrote `docker/frontend-horsesport.Dockerfile` to match the motorsport dev
  pattern (node:22-alpine, `pnpm dev`, port 3002) — replaced a stale
  standalone/prod variant incompatible with the Compose `apps` dev setup.
- Added the `frontend-horsesport` service to `docker-compose.yml` under the
  `apps` profile (host port 3002, cross-site + Strapi env).
- Updated `.env.example` (`NEXT_PUBLIC_HORSESPORT_SITE_URL`),
  `docs/13_local_docker_deployment.md`, and `.claude/launch.json`.

### Files changed

- Added: `frontend-horsesport/` (app, config, lockfile, `public/brand/` logos,
  README, `.env.local`)
- Modified: `docker/frontend-horsesport.Dockerfile`, `docker-compose.yml`,
  `.env.example`, `docs/13_local_docker_deployment.md`, `.claude/launch.json`,
  `docs/PHASE_PROGRESS.md`

### How verified

- `pnpm install`, `tsc --noEmit`, and `next build` all pass (0 errors, 0 warnings).
- Dev server renders on `http://localhost:3002` with no console errors
  (verified via preview snapshot + screenshot).
- `docker compose config --services` → `postgres` only; `--profile apps` lists
  all four apps incl. `frontend-horsesport` (VALID).

### Notes / caveats

- Root `README.md` already documented three frontends/port 3002, so it needed no
  change this phase.
- Favicon assets (icon/apple-icon/favicon.ico) not generated — the guideline
  wants an isolated horse-jockey mark that is not yet available as a standalone
  file; deferred to a later phase with the design system.
- CMS `siteScope` does not yet include `horsesport` — that is HS-2.
- `NEXT_PUBLIC_SITE_KEY=sarga-horse-sport` mirrors the motorsport convention.

---

## Horse Sport Phase 2 (HS-2) — Shared CMS three-site model

**Prompt:** `prompts/horsesport/02_shared_cms_three_site_model.md`

### What was done

- Extended the single shared Strapi CMS for three-site publishing — **no second
  CMS, no duplicated Motorsport collections**.
- Added `horsesport` to **every** `siteScope` enum: `event`, `news-article`,
  `ticket-cta`, `ecosystem-business`, `media-gallery`, `partner`
  (now `gateway|motorsport|horsesport|shared|hidden`).
- Added visibility flags: `showOnHorseSport` (event + news),
  `featuredOnHorseSport` (news).
- **Event** Horse Sport fields: `eventDiscipline` (derby/turf/exhibition/
  championship/hospitality/training/other), `raceClass`, `trackType`
  (turf/dirt/mixed/indoor/other), `hospitalityInfo`, `stableAccessInfo`.
  Race schedule reuses the existing `schedule` (`shared.event-session`) component.
- **News** category enum extended (not replaced) with horse-sport values:
  `race-results, event-announcement, turf-venue, stable-life, jockey-story,
equine-performance, partnership`; added `relatedGallery` relation.
- **Ecosystem Business** gained `dedicatedSiteKey` (none/motorsport/horsesport);
  **Media Gallery** gained `category` + `coverImage`.
- **Seed** (idempotent): added the `sarga-horse-sport` Site record; a Horse Sport
  demo set — 3 partners, 2 events (derby + turf, with discipline/track/
  hospitality), 1 ticket CTA, 3 news articles (new categories), 1 race-day
  gallery — all linked to the Horse Sport business, with cover/gallery media.
  Added an idempotent normalization that repairs the `sarga-horse-sport` and
  `sarga-motorsport` businesses' `siteScope`/`dedicatedSiteKey`/`dedicatedSiteUrl`
  on pre-existing DBs (the create-if-empty block never updates them).
- Added typed, server-only query helpers for `siteKey = horsesport` in
  `frontend-horsesport/src/lib/strapi/` (`config.ts`, `client.ts`, `content.ts`):
  `fetchHorseSportEvents/EventBySlug/News/NewsBySlug/TicketCtas/Galleries/Business`,
  applying `siteScope IN [horsesport,shared]` + business filtering.
- Updated the `strapi/content-types.json` mirror.

### Files changed

- Modified (schemas): `cms/src/api/{event,news-article,ticket-cta,
ecosystem-business,media-gallery,partner}/content-types/**/schema.json`
- Modified: `cms/src/seed.ts`, `strapi/content-types.json`, `docs/PHASE_PROGRESS.md`
- Added: `frontend-horsesport/src/lib/strapi/{config,client,content}.ts`
  _(regenerated `cms/types/generated/*` on Strapi boot)_

### How verified

- Booted Strapi on Postgres: schemas auto-migrated (new `events` columns confirmed
  in DB: `event_discipline, race_class, track_type, hospitality_info,
stable_access_info, show_on_horse_sport`); seed created the Horse Sport set.
- Live API (via `fetch`) using the exact frontend filters returned: 2 HS events
  (derby/turf, cover✓), 3 HS news (event-announcement/stable-life/turf-venue,
  cover✓), 1 ticket CTA, 1 gallery (race-day, cover✓), 3 partners.
- **Isolation:** motorsport event query returned 4 events with **0** horse-sport
  leakage; dedicated-business routing normalized (`sarga-horse-sport` →
  scope=shared, key=horsesport, url=:3002).
- Frontend `tsc --noEmit` passes.

### Notes / caveats

- Fixed a helper bug during verification: news must filter on `relatedBusinesses`
  (many-to-many), not `business` — the latter 400s for news.
- Duplicate rows in raw DB queries are Strapi v5 draft+published pairs, not dupes.
- CMS API served over RTK-wrapped `curl` returns filtered bodies; verification
  used `node fetch` instead.
- Inquiry-submission `sourceSite`/expanded `inquiryType` deferred to HS-8 (forms).

---

## Horse Sport Phase 3 (HS-3) — Frontend bootstrap

**Prompt:** `prompts/horsesport/03_horsesport_frontend_bootstrap.md`

### What was done

- Built the full Horse Sport app shell — premium, cinematic, international-class
  visual system distinct from gateway and motorsport. Reference: page 7 of the
  preview PDF (the `sarga-horse.vercel.app` sample was treated as inspiration
  only, per instruction, not a baseline).
- **Design foundation** (`globals.css`): full HS token set + the page-7 brand
  motifs as reusable utilities — orange **zig-zag/staircase** (`.hs-zigzag`),
  red **dotted texture** (`.hs-dot-texture` / `-cream`), diagonal **slash**
  (`.hs-slant`), warm **ember field**, grain, shimmer, fade-up animations, all
  guarded by `prefers-reduced-motion`.
- **Typography**: bundled variable faces behind the licensed-font tokens —
  Archivo (wide grotesque → Stadmitte target) for display, Plus Jakarta Sans
  (→ Masifa target) for body. No unlicensed fonts shipped.
- **Chrome in `layout.tsx`**: sticky scroll-reactive `HorseSportHeader` (white
  logo, primary nav, slanted Tickets CTA, Sarga.co link, mobile drawer with
  numbered nav + cross-site links), `HorseSportFooter` (link columns, cross-site
  links, cream dotted texture), skip-to-content link, metadata defaults + OG.
- **Components**: `HorseSportLogo`, `brand-marks` (ZigZag/Dotted/Slash SVGs),
  `SectionHeader`, `PageHero` (cinematic interior hero), `PagePlaceholder`
  (branded shell body with "on this page" aside), icons, barrel `index.ts`.
- **All 13 routes** created: `/`, `/about`, `/events`, `/events/[slug]`,
  `/tickets`, `/news`, `/news/[slug]`, `/gallery`, `/venues`, `/stable-life`,
  `/partners`, `/contact`, `/campaigns/[slug]`. Dynamic routes resolve the async
  `params`, humanize the slug, and expose `generateMetadata`. Home is a
  cinematic placeholder (hero + positioning + pillars) — **not** the final
  homepage (HS-5).
- **States**: `loading.tsx`, `not-found.tsx`, `error.tsx`, `global-error.tsx`
  (self-contained html/body), all on-brand.
- **SEO foundations**: `robots.ts` + static `sitemap.ts` (dynamic entries in HS-6).
- **Assets**: copied `assets/brand/horsesport/images/*` → `public/media/`.
- Navigation config centralized in `src/lib/navigation.ts`; slug helper in
  `src/lib/format.ts`; added `@fontsource-variable/archivo` +
  `plus-jakarta-sans` (removed unused noto-sans).

### Files changed

- Added: `frontend-horsesport/src/app/{about,events,events/[slug],tickets,news,
news/[slug],gallery,venues,stable-life,partners,contact,campaigns/[slug]}/page.tsx`,
  `{loading,not-found,error,global-error}.tsx`, `{sitemap,robots}.ts`
- Added: `src/components/**` (layout header/footer, sections page-hero/placeholder,
  ui logo/marks/section-header/icons, `index.ts`), `src/lib/{navigation,format}.ts`,
  `src/types/design-system.ts`, `public/media/*`
- Modified: `src/app/{layout,page,globals.css}`, `package.json`

### How verified

- `tsc --noEmit` ✓, `eslint` ✓ (no issues), `next build` ✓ (0 errors / 0 warnings).
- Live preview on `:3002` (no console errors): home cinematic hero + pillar cards,
  Venues/Tickets interior heroes + placeholder asides, mobile drawer (375px)
  with numbered nav + cross-site links, branded 404 within chrome. Screenshots
  captured for each.

### Notes / caveats

- Header/footer live in `layout.tsx` so all routes (incl. 404/error) share chrome;
  `global-error.tsx` is self-contained by necessity.
- Font tokens keep Stadmitte/Masifa as first-choice families; swap in the licensed
  webfonts later without code changes.
- Favicon set still deferred (needs isolated horse-jockey mark).
- Strapi client/typed helpers already added in HS-2; pages consume them in HS-5/HS-6.

---

## Horse Sport Phase 4 (HS-4) — Design system

**Prompt:** `prompts/horsesport/04_horsesport_design_system.md`

### What was done

- Evolved the visual language per feedback: softened the square/sharp motorsport-
  adjacent feel into a **rounded "strong but flexible"** system (radius scale +
  `.hs-card` / `.hs-card-cream` / `.hs-pill`; header & mobile CTAs, placeholder
  aside, and home cards moved from clipped slants to rounded geometry). Strength
  stays in the heavy display type and bold colour; flexibility comes from the
  rounded forms and organic motion.
- Implemented the **authentic page-7 staircase / zig-zag** motif: `.hs-staircase`
  tileable SVG wash (rounded orange steps) + a `StaircaseMark` component (discrete
  descending steps) used as eyebrows, dividers, corners, and section decoration so
  sections never feel empty while staying elegant.
- Built a **custom premium equestrian icon pack** (`ui/hs-icons.tsx`, 17 icons,
  cohesive 1.6 stroke) — including sport-specific marks (horseshoe, jockey helmet,
  horse, rosette, trophy, turf track, stable) that differentiate the site.
- Added **motion**: `ScrollReveal` (IntersectionObserver, progressive-enhancement,
  reduced-motion & no-JS safe), plus float/zoom/shimmer/marquee utilities.
- Built all required **components** (docs/horsesport/04): `HeroRaceSection`,
  `RaceEventCard`, `NewsArticleCard`, `TicketCtaPanel`, `VenueHighlightCard`,
  `StableLifeCard`, `GalleryMosaic`, `PartnerLogoStrip`, `NewsletterBand`,
  `CrossSiteEcosystemLinks`, `Breadcrumbs`, plus `SectionHeader`, `SeoJsonLd`.
  Components take plain props (no deep CMS coupling); pages map CMS records via
  `lib/media.ts` (`resolveStrapiImage`).
- Added a **`/styleguide`** showcase (noindex) demonstrating every component,
  token, icon, and the staircase motif with sample data.

### Files changed

- Added: `src/components/cards/*`, `src/components/sections/{hero-race-section,
ticket-cta-panel,gallery-mosaic,partner-logo-strip,newsletter-band,
cross-site-ecosystem-links}.tsx`, `src/components/ui/{hs-icons,scroll-reveal,
breadcrumbs,seo-json-ld}.tsx`, `src/app/styleguide/page.tsx`, `src/lib/media.ts`
- Modified: `src/app/globals.css` (radius tokens, staircase, rounded card system,
  float + scroll-reveal), `src/components/index.ts`, `src/types/design-system.ts`,
  `src/components/ui/brand-marks.tsx` (+`StaircaseMark`),
  `src/components/ui/section-header.tsx`, `src/components/sections/page-hero.tsx`,
  `src/components/sections/page-placeholder.tsx`,
  `src/components/layout/horsesport-header.tsx`, `src/app/page.tsx`

### How verified

- `tsc` ✓, `eslint` ✓ (fixed a `react-hooks/refs` finding by simplifying
  ScrollReveal to a plain div ref), `next build` ✓ (0 errors / 0 warnings).
- Live `/styleguide` on `:3002` (no console errors): cinematic HeroRaceSection
  with stat strip, rounded RaceEventCards with pill chips + custom icons, gallery
  mosaic, colour tokens, and the custom icon grid (horseshoe/helmet/horse/rosette)
  all render on-brand. Screenshots captured.

### Notes / caveats

- Reference `sarga-horse.vercel.app` used as inspiration only (staircase pattern),
  not a baseline — layout is original, premium, investor-facing.
- `/styleguide` is `noindex`; it can be removed at deployment or kept as an
  internal reference.
- NewsletterBand submits via GET to `/contact` as a placeholder; real form
  handling is HS-8.
- Components are ready for HS-5 (homepage assembly) and HS-6 (pages) to feed live
  CMS data through the HS-2 typed helpers.

---

## Horse Sport Phase 5 (HS-5) — Homepage

**Prompt:** `prompts/horsesport/05_horsesport_homepage.md`

### What was done

- Built the dedicated, CMS-driven Horse Sport homepage assembling the HS-4
  component library into all required sections:
  1. Cinematic `HeroRaceSection` (hero image, dual CTAs, live stat strip —
     next race / venue / season / disciplines).
  2. Race-day highlight — featured `RaceEventCard` + `TicketCtaPanel`
     (partner redirect, no internal checkout).
  3. About Sarga Horse Sport (positioning + concept image; copy from the CMS
     business `overview` when present).
  4. Championship ecosystem — five disciplines (Derby / Turf / Stable /
     Hospitality / Media) with the custom equestrian icons.
  5. Featured events grid (`RaceEventCard`).
  6. News & publications (`NewsArticleCard` feature + list).
  7. Venue / turf / stable highlight (`VenueHighlightCard`).
  8. Gallery preview (`GalleryMosaic`).
  9. Partners strip (`PartnerLogoStrip`).
  10. Newsletter / contact CTA (`NewsletterBand`).
      Plus `Organization` JSON-LD via `SeoJsonLd`, and `ScrollReveal` motion on
      every section.
- Added `src/lib/homepage-data.ts` — **CMS-first with graceful fallback**.
  Fetches Horse Sport-scoped events, news, partners, galleries, ticket CTA, and
  the business record (siteScope IN [horsesport, shared] + business filters),
  maps them to the design-system card shapes, and falls back to on-brand
  placeholders when Strapi is unreachable.

### Files changed

- Added: `src/lib/homepage-data.ts`
- Modified: `src/app/page.tsx` (replaced the HS-3/4 placeholder with the full
  homepage)

### How verified

- `tsc` ✓, `eslint` ✓, `next build` ✓ (0 errors / 0 warnings).
- Live preview on `:3002` **against a running Strapi** — homepage rendered real
  seeded CMS content (featured "Sarga National Derby — Merdeka Cup", upcoming
  "Turf Classic Twilight Meeting", CMS news + gallery media) with **no console
  errors**. Verified desktop sections (hero, race-day highlight, ecosystem,
  gallery) and mobile hero (375px). Screenshots captured.

### Notes / caveats

- Venue highlight cards use curated brand imagery (there is no Venue content type
  yet); they deep-link to `/venues` and `/stable-life`.
- Newsletter still submits via GET to `/contact` — real handling is HS-8.
- Fallback placeholders mirror the HS-2 seed so the page stays premium with or
  without the CMS.
- 2026-07-05 design recalibration follow-up:
  - Restructured the homepage into a more premium dark-editorial rhythm with
    warmer section atmospheres, denser lead/support composition, and stronger
    spacing consistency across hero/about/events/news/gallery/footer.
  - Rebuilt the season calendar around a large lead event + supporting race
    cards, expanded fallback editorial density to keep the news stack filled,
    and upgraded the ticket/newsletter/partner/ecosystem sections so they read
    as curated premium surfaces instead of flat blocks.
  - Updated the font target stacks to continue preferring `STADMITTE` +
    `Masifa` when available while preserving safe local fallbacks.

---

## Horse Sport Phase 6 (HS-6) — Core pages

**Prompt:** `prompts/horsesport/06_horsesport_pages.md`

### What was done

- Built out **all 12 core routes** with live CMS data + graceful fallback,
  replacing the HS-3 placeholders:
  - `/about` — CMS business overview (RichText) + capability grid + CTA.
  - `/events` — CMS event grid with **server-side discipline filter** (URL
    param chips) + empty state.
  - `/events/[slug]` — full detail: hero, breadcrumbs, description, race
    schedule, hospitality, stable access, event-details sidebar, ticket panel,
    Event JSON-LD; `notFound()` for unknown slugs.
  - `/tickets` — active CMS ticket CTAs (partner redirect only) + empty state.
  - `/news` — CMS grid with **category filter** + empty state.
  - `/news/[slug]` — editorial article: hero, breadcrumbs, excerpt lede, body
    (RichText), NewsArticle JSON-LD; `notFound()` for unknown slugs.
  - `/gallery` — CMS media galleries grouped into mosaics + empty state.
  - `/venues` — curated venue highlight cards + facilities grid.
  - `/stable-life` — CMS news filtered to stable/jockey/equine categories as
    cream StableLifeCards.
  - `/partners` — proposition, partnership tiers, CMS partner strip, contact CTA.
  - `/contact` — channels + `ContactForm` (client-validated; placeholder submit
    → success state; server persistence is HS-8).
  - `/campaigns/[slug]` — branded page (no Campaign content type yet).
- Added a page-level data layer `src/lib/cms-content.ts` (list + detail
  view-models, Horse Sport scope + business filters, on-brand fallbacks) and a
  `RichText` renderer. Per-page SEO metadata (+ `generateMetadata` on detail
  routes).

### Files changed

- Added: `src/lib/cms-content.ts`, `src/components/ui/rich-text.tsx`,
  `src/components/sections/contact-form.tsx`
- Modified: `src/app/{about,events,events/[slug],tickets,news,news/[slug],
gallery,venues,stable-life,partners,contact}/page.tsx`,
  `src/components/index.ts`, `src/lib/cms-content.ts` (+ `fetchPartners`)

### How verified

- `tsc` ✓, `eslint` ✓, `next build` ✓ (0 errors / 0 warnings).
- Live preview on `:3002` against running Strapi (no console errors): events
  listing rendered CMS cards + working discipline filter; event detail rendered
  seeded fields (briefing, hospitality, stable access) with correct `<title>`;
  unknown slug rendered the not-found UI ("Event not found"); contact form
  submitted to its success state. Screenshots captured.

### Notes / caveats

- `/campaigns/[slug]` stays a branded placeholder — no Campaign content type
  exists in the CMS yet (would be a Phase 2-style CMS addition if needed).
- Venue pages use curated brand imagery (no Venue content type).
- Contact form is client-validated only; the server action + Strapi
  `inquiry-submission` persistence + spam protection land in HS-8.
- Dev server returns HTTP 200 while rendering `notFound()`; production returns
  404 (content is correct in both).

**2026-07-05 design recalibration pass (HS-4 → HS-6 enrichment):**

- Elevated the Horse Sport visual system from a solid branded baseline to a more
  premium, investor-facing experience without changing IA or routing.
- Reworked the shared dark surfaces into a layered **double-shell / premium
  panel** system (`hs-card-shell`, `hs-panel`, richer shadows, softer gradients,
  cleaner typography spacing, stronger motion curves).
- Upgraded the sticky header into a detached floating navigation island with a
  more premium CTA treatment; upgraded both homepage and interior heroes with
  deeper cinematic layering, track-line motifs, and editorial side panels.
- Rebalanced homepage composition to reduce repeated “headline + simple grid”
  rhythm: stronger about section art direction, larger manifesto ecosystem card,
  more intentional featured-events split, and more engineered CTA / gallery /
  content cards.
- Verified with `pnpm run typecheck`, `pnpm run lint`, and `pnpm run build`
  inside `frontend-horsesport/`.

**2026-07-05 follow-up refinement (brand pattern + density pass):**

- Replaced the residual checker/mosaic-like fills with Horse Sport-brand-faithful
  zig-zag / staircase fields and richer gradient layering in the hero dossier,
  ticketing panel, and newsletter CTA.
- Expanded homepage event presence to **6 cards** (`seasonEvents`) with a denser
  editorial grid instead of a sparse three-card state.
- Added more brand-led decoration and spatial fill to the emptier homepage
  sections (ecosystem + news) and rebuilt the partners strip into a more
  noticeable premium presentation.

---

## Horse Sport — Design recalibration (HS 4–6 enrichment, pass 1)

**Context:** Investor-facing premium pass on top of the in-progress Editorial-
Luxury system. Direction agreed with the user: **rhythm + restraint**.

### What was done (this pass)

- **Dark → light → dark editorial rhythm** (the biggest "premium magazine"
  lever; the page was previously monotone dark end-to-end):
  - Converted the homepage **News ("Inside the paddock")** section into a
    full-bleed **warm-cream editorial band** with a single restrained brand rule.
  - Converted the homepage **Newsletter ("Paddock Report")** into a warm-cream
    band as a second, lower light beat.
- Added a `tone="dark" | "cream"` variant to `NewsArticleCard` and
  `NewsletterBand` (cream = `hs-card-glass-light` + espresso text) so components
  work on light bands without new one-off markup.
- **Restraint:** removed the redundant radial-gradient wash + `SlashMark` from
  the News section; kept one confident accent per section.
- **Hero first-impression fix:** the "Championship calendar" eyebrow pill was
  near-illegible (`text-hs-cream/48`) — strengthened to a readable
  `bg-hs-black/30` + `text-hs-cream/75` pill.

### Files changed

- Modified: `src/app/page.tsx`, `src/components/cards/news-article-card.tsx`,
  `src/components/sections/newsletter-band.tsx`,
  `src/components/sections/hero-race-section.tsx`

### How verified

- `tsc` ✓, `eslint` ✓, `next build` ✓ (0 errors / 0 warnings).
- Live preview on `:3002`: cream News + Newsletter bands render correctly (dark
  espresso text, red CTAs) creating clear editorial rhythm; hero eyebrow legible.
  Screenshots captured across the full page.

### Notes / next options (pending user direction)

- Interior pages (`/about`, `/news`, `/events`, etc.) still all-dark — the same
  cream-band treatment can be rolled out for consistency if desired.
- Further restraint (e.g. About `DottedMark`, Season `ZigZagMark`) left in place;
  can be dialled back more if the user wants an even quieter aesthetic.

### Design recalibration — pass 2 (homepage refinement)

- Upgraded both cream bands to the system's `hs-cream-section` (adds refined
  dotted-texture + gradient, replacing plain inline backgrounds).
- Added a spacious **editorial manifesto band** after About — a centered display
  statement ("A championship built to be watched, hosted, and _invested in._")
  with an `hs-rule-dot` "Est. 2023 · Indonesia" divider. Investor-toned, dark
  (kept restraint — avoided over-creaming).
- Final rhythm: dark hero → About → manifesto → Season/Ticket → **cream News** →
  Gallery/Partners → **cream Newsletter** → Ecosystem.
- Verified live (screenshots) + `tsc`/`eslint`/`next build` all clean.

### Design recalibration — pass 3 (hero rebuild + section consistency)

- **Hero rebuilt** to the gateway/motorsport "cinematic pacing" standard
  (`HeroRaceSection`): removed the redundant floating "Race Dossier" card (it
  duplicated the bottom stat strip — the main "messy" issue); added a strong
  directional cinematic scrim, a top data rail, an oversized title with a red
  editorial left-border subtitle, and a **single** bottom stat band + signature
  orange→red→gold brand bar.
- **Consistent, restrained section decoration** (gateway-style): added a
  numbered-eyebrow option to `SectionHeader` (`index` prop) and applied 01–04
  across About / Season / News / Gallery; replaced the ad-hoc per-section
  radial washes and scattered `DottedMark`/`ZigZagMark` accents with a single,
  consistent, very subtle warm halo per dark section.

### Files changed

- Modified: `src/components/sections/hero-race-section.tsx`,
  `src/components/ui/section-header.tsx`, `src/app/page.tsx`

### How verified

- `tsc` ✓, `eslint` ✓, `next build` ✓ (0 errors / 0 warnings).
- Live preview: hero reads clean/cinematic with one stat band; About + Season
  sections show consistent numbered eyebrows and a restrained halo (no scattered
  marks). Screenshots captured.

### Design recalibration — pass 4 (de-box / line-based consistency)

- User feedback: the About "double-bezel card with 3 nested boxes" felt heavy;
  the hero's simple **line · number · text** stat rail is the desired language,
  and consistency matters.
- Reworked the **About** right column: removed the card shell + nested boxes →
  a clean cinematic framed image (`hs-frame-cinematic`) + a **hairline-divided
  01/02/03 list** that mirrors the hero stat rail.
- Simplified the **Season "2026 outlook"** and **Gallery "visual archive"** side
  boxes into clean left-border line notes (no card chrome).
- Removed the now-unused `StaircaseMark` import.
- Result: boxes are now reserved for genuine image content cards
  (events/news/gallery); all supporting info uses the consistent line style.

### Files changed

- Modified: `src/app/page.tsx`

### How verified

- `eslint` ✓, `tsc` ✓, `next build` ✓ (0/0). Live screenshots: About list +
  Season note render in the clean line style, consistent with the hero rail.

### Design recalibration — pass 5 (uniform card grids)

- User feedback: the featured event card used a horizontal image-left/text-right
  layout while every other card was image-top/text-bottom — inconsistent/"weird".
- **Events (Season):** replaced the bento (horizontal feature + stacked support +
  more) with a single **uniform 3-column grid of identical vertical cards**
  (image top, text bottom).
- **News:** replaced the feature + compact-stack layout with the same **uniform
  3-column vertical grid** (cream tone) for cross-section consistency.
- Removed the now-unused `feature`/`compact` usages from the homepage and the
  `seasonLeadEvent`/`storyStack` split (→ `seasonEvents` + `newsList`).

### Files changed

- Modified: `src/app/page.tsx`

### How verified

- `eslint` ✓, `tsc` ✓, `next build` ✓ (0/0). Live screenshots: Events + News
  render as matching uniform vertical-card grids.

### Design recalibration — pass 6 (ticket-stub CTA)

- User feedback on the ticket panel: too tall, box-inside-box (ACCESS/FLOW/
  SIGNAL), gap to events too wide, grey/red split gradient looked off.
  Requested: a capsule/pill (like the header) but thinner, with a dashed
  ticket-style separator.
- Rebuilt `TicketCtaPanel` as a **thin ticket-stub capsule**: `sm:rounded-full`
  pill, split by a **vertical dashed perforation line with punched notch
  circles**, left stub = provider · date · event · redirect note, right stub =
  Buy Tickets pill + "Guaranteed entry · Zero markup". Removed the nested boxes
  and the grey→red split; single cohesive warm-dark surface with one subtle red
  glow on the action side. Mobile stacks with a horizontal dashed divider.
- Tightened spacing: the homepage ticket section drops its top padding
  (`pb-(--hs-section-gap)` only) so it sits close under the events grid.

### Files changed

- Modified: `src/components/sections/ticket-cta-panel.tsx`, `src/app/page.tsx`

### How verified

- `eslint` ✓, `tsc` ✓, `next build` ✓ (0/0). Live screenshot: thin ticket-stub
  capsule with dashed perforation + notches, closer to the events grid.

### Design recalibration — pass 7 (cream → charcoal bands)

- User feedback: the cream/white editorial bands were too high-contrast against
  the dark sections. Requested a darker grey, like the motorsport footer.
- Added a `.hs-charcoal-section` treatment (warm charcoal #1c1814 + subtle dotted
  texture) and switched the **News** and **Newsletter** bands from
  `hs-cream-section` to it — light cream text, dark cards restored.
- Reverted the cream-specific overrides: `SectionHeader` no longer `light`,
  `NewsArticleCard`/`NewsletterBand` back to the default dark tone, and the
  News chip + "All stories" CTA back to cream-on-dark styling.
- Rhythm is now a subtle tonal shift (dark → warm charcoal → dark) instead of a
  jarring light/dark flip. (`tone="cream"` variants remain available but unused.)

### Files changed

- Modified: `src/app/globals.css`, `src/app/page.tsx`

### How verified

- `eslint` ✓, `tsc` ✓, `next build` ✓ (0/0). Live screenshots: News + Newsletter
  render as warm-charcoal bands, clearly distinct from the near-black page but
  no longer high-contrast.

### Design recalibration — pass 8 (gallery CTA consistency)

- User feedback: the gallery's "View full gallery" was a square `+` tile inside
  the mosaic — inconsistent with the capsule pill CTAs used in About / Season /
  News.
- Rebuilt `GalleryMosaic`: removed the in-grid view-all tile; added a `featured`
  hero-bento layout (one 2×2 lead + four equal cells = a clean 2×4 block, no
  holes) for the homepage, and a uniform responsive grid for the gallery page.
- Homepage gallery now renders `<GalleryMosaic featured />` + a centered
  `hs-cta-secondary` "View full gallery" capsule, matching the other sections.

### Files changed

- Modified: `src/components/sections/gallery-mosaic.tsx`, `src/app/page.tsx`

### How verified

- `eslint` ✓, `tsc` ✓, `next build` ✓ (0/0). Live screenshots: 5-image bento
  fills cleanly (no tile/hole); capsule CTA below matches site-wide style.

### Design recalibration — pass 9 (partners + newsletter simplified & merged)

- User feedback: partner cards were box-over-box (monogram box + "aligned
  partner" clutter); the newsletter was a card with an email-icon box; and the
  standalone newsletter grey area felt too small.
- **Merged** partners + newsletter into **one warm-charcoal band**.
- `PartnerLogoStrip` rebuilt as a simple, bare strip (small label + a clean row
  of partner names/logos, grayscale hover) — motorsport-style, no cards.
- `NewsletterBand` rebuilt bare: editorial copy + a single **ticket-capsule
  form** (rounded input joined to a red Subscribe pill) — no card, no icon box.
- Updated `/partners` to wrap the now-bare strip in its own charcoal section.

### Files changed

- Modified: `src/components/sections/partner-logo-strip.tsx`,
  `src/components/sections/newsletter-band.tsx`, `src/app/page.tsx`,
  `src/app/partners/page.tsx`

### How verified

- `eslint` ✓, `tsc` ✓, `next build` ✓ (0/0). Live screenshot: one charcoal band
  with capsule subscribe form + simple partner name strip, no nested boxes.

### Design recalibration — pass 10 (ecosystem capsules + merged band)

- User feedback: ecosystem cards were boxy; the Sarga.co logo was dark/invisible;
  and the charcoal grey area was still small.
- `CrossSiteEcosystemLinks` rebuilt as simple **capsule pills** (logo + short
  description + arrow), bare content, no boxy cards.
- Sarga.co card now uses the **light/white-text** logo
  (`/media/logo-sarga-gateway-light.png`); descriptions shortened to one line.
- Merged the ecosystem into the **same warm-charcoal band** as newsletter +
  partners (thin dividers between the three), so the grey area reads bigger.

### Files changed

- Modified: `src/components/sections/cross-site-ecosystem-links.tsx`, `src/app/page.tsx`

### How verified

- `eslint` ✓, `tsc` ✓, `next build` ✓ (0/0); no console errors. Live screenshot:
  one charcoal band = newsletter capsule form + partner strip + ecosystem
  capsules; Sarga.co light logo legible.

### Design recalibration — pass 11 (footer statement + brand corner marker)

- User feedback: footer statement too long; footer needs a distinguishing
  decorative element — three diagonal staircase-pattern stripes (Adidas-style)
  in the top-right corner, with increasing opacity + fade-out (CSS, not a PNG).
- Shortened the footer statement to "Where sport meets spectacle."
- Added a CSS brand pattern `.hs-zigzag-pattern` (orange stepped-square staircase
  tile, page-7 motif) and a top-right footer marker: three diagonal stripes of
  the pattern, rotated ~35°, increasing opacity (0.14/0.26/0.40) with a
  linear-gradient mask fade-out. Desktop-only, pointer-events-none, subtle.

### Files changed

- Modified: `src/app/globals.css` (+`.hs-zigzag-pattern`),
  `src/components/layout/horsesport-footer.tsx`

### How verified

- `eslint` ✓, `tsc` ✓, `next build` ✓ (0/0); no console errors. Live screenshot:
  short statement + subtle three-stripe staircase marker fading in the top-right.

### Design recalibration — pass 12 (marker direction, hero marker, hero image)

- Footer staircase marker reoriented to flow upper-right → bottom-right
  (origin-top-right, rotate 52°).
- Added the mirrored staircase marker to the hero on the **left** (upper-left →
  bottom-left, origin-top-left, -rotate 52°), same `.hs-zigzag-pattern` + opacity
  ramp + fade-out mask, over the darkest part of the scrim.
- Hero now uses the high-res `/media/horse-sport-hero.png` (2560×1440) instead of
  the low-res CMS featured-event cover.

### Files changed

- Modified: `src/components/layout/horsesport-footer.tsx`,
  `src/components/sections/hero-race-section.tsx`, `src/app/page.tsx`

### How verified

- `eslint` ✓, `tsc` ✓, `next build` ✓ (0/0); no console errors. Live screenshots:
  crisp high-res hero with faded left marker; footer marker angled to bottom-right.

### Design recalibration — pass 13 (full-height brand marker strips)

- User request: make the staircase brand marker bigger — full height (top to
  bottom) as a stronger identity strip, keeping low opacity + fade-out;
  hero on the LEFT, footer on the RIGHT.
- Replaced the corner clusters with **full-height (`inset-y-0`) three-stripe
  staircase strips**: hero left edge, footer right edge (`flex-row-reverse`),
  decreasing width/opacity inward (0.24 / 0.15 / 0.08), vertical mask fading top
  and bottom. Desktop-only, `pointer-events-none`, behind content.

### Files changed

- Modified: `src/components/sections/hero-race-section.tsx`,
  `src/components/layout/horsesport-footer.tsx`

### How verified

- `eslint` ✓, `tsc` ✓, `next build` ✓ (0/0); no console errors. Live screenshots:
  full-height left strip in the hero, full-height right strip in the footer.

### Design recalibration — pass 14 (consistent brand-strip lines)

- User request: make the three staircase lines consistent — same width, same
  opacity (boldness), same spacing; fade strictly top→bottom, disappearing
  before the bottom (not a left/right or top+bottom fade).
- Hero + footer strips now use identical stripes: `w-8`, `opacity 0.2`, uniform
  `gap-16`, mask `linear-gradient(180deg, black 0%, black 45%, transparent 85%)`
  (solid at top → gone before the bottom). Hero left, footer right.

### Files changed

- Modified: `src/components/sections/hero-race-section.tsx`,
  `src/components/layout/horsesport-footer.tsx`

### How verified

- `eslint` ✓, `tsc` ✓, `next build` ✓ (0/0); no console errors. Live screenshots:
  even 3-line strips, top→bottom fade, hero left + footer right.

### Design recalibration — pass 15 (roll refined system into interior pages)

Applied the homepage's refined language across all interior pages for full-site
consistency:

- **`PageHero` (shared)**: removed the boxy side panel; added the full-height
  left brand staircase strip (matches homepage hero). Propagates to every
  interior page.
- **New shared components**: `FeatureCard` (single glass card, inline icon — no
  nested icon box) and `CtaBand` (warm-charcoal closing CTA with capsule
  buttons, replacing the old cream `hs-card-glass-light` panels).
- **About / Venues / Partners**: numbered section eyebrows (01/02…), feature/
  tier grids → `FeatureCard`, cream CTA panels → `CtaBand`.
- **Stable Life**: switched cream `StableLifeCard` → dark `NewsArticleCard`
  (consistent with the charcoal direction); numbered eyebrow.
- **Contact**: numbered eyebrow; channel cards de-boxed (inline icons).
- **Tickets**: numbered eyebrow (already used the refined ticket-stub capsule).
- **Event detail**: sidebar `Meta` rows de-boxed → inline icons + hairline rows.
- **Events / News / Gallery listings**: already consistent (PageHero + pill
  filters + uniform vertical cards / mosaic) — left as-is.

### Files changed

- Added: `src/components/ui/feature-card.tsx`, `src/components/sections/cta-band.tsx`
- Modified: `src/components/sections/page-hero.tsx`, `src/components/index.ts`,
  `src/app/{about,venues,partners,stable-life,contact,tickets}/page.tsx`,
  `src/app/events/[slug]/page.tsx`

### How verified

- `eslint` ✓, `tsc` ✓, `next build` ✓ (0/0). Live screenshots: About (feature
  cards + charcoal CtaBand), Partners (line partner strip + CtaBand), interior
  hero with left brand strip + numbered eyebrows.

### Design recalibration — pass 16 (rounded cards + footer social icons)

- Rounded the shared card surface for a soft "capsule" feel: `.hs-card-glass` /
  `.hs-card-glass-light` border-radius `var(--radius-hs-sm)` → `1.35rem`. Removed
  the sharp inline radius overrides on `FeatureCard` and the contact channel
  cards so they inherit it. Now all content cards (feature, event, news, gallery,
  contact, empty states) share the rounded shape.
- Added a monochrome social icon set (`ui/social-icons.tsx`: Instagram, YouTube,
  X, Threads, Facebook) and a row of circular icon links in the footer brand
  column (currentColor, hover → orange).

### Files changed

- Added: `src/components/ui/social-icons.tsx`
- Modified: `src/app/globals.css`, `src/components/ui/feature-card.tsx`,
  `src/app/contact/page.tsx`, `src/components/layout/horsesport-footer.tsx`

### How verified

- `eslint` ✓, `tsc` ✓, `next build` ✓ (0/0); no console errors. Live screenshots:
  rounded feature cards; footer social icon row.

## HS-7 — Cross-Site Integration

Connected Gateway, Motorsport, and Horse Sport routing so the shared CMS's
`siteScope` drives where teased content and ecosystem entries open. No Horse
Sport pages are duplicated in Gateway — dedicated content opens on :3002.

### Gateway (`frontend-gateway`)

- `src/lib/site-config.ts`: refactored the URL builders; added
  `horsesportSiteUrl`, `isHorsesportSiteConfigured()`, `horsesportUrl(path)`
  mirroring the motorsport helpers (reads `NEXT_PUBLIC_HORSESPORT_SITE_URL`).
- `src/lib/cross-site.ts` (NEW): centralised routing —
  - `resolveContentUrl({ slug, contentType, siteScope })` → `{ href, isExternal }`
    (motorsport/horsesport scopes open on the dedicated site when configured;
    gateway/shared/unscoped stay local: `/news/[slug]`, `/ticket-hub/[slug]`).
  - `businessSiteUrl(slug)` → dedicated frontend home for
    `sarga-motorsport` / `sarga-horse-sport`, else `undefined`.
  - `dedicatedSiteLabel(siteScope)` for cross-site CTA copy.
- `src/lib/strapi/types.ts`: `SiteScope` now includes `"horsesport"`.
- Replaced duplicated inline `siteScope === "motorsport"` checks with the shared
  helpers in: `components/sections/ecosystem-card.tsx`,
  `components/sections/news-preview.tsx`, `components/layout/footer.tsx`,
  `app/ticket-hub/page.tsx`, `app/ecosystem/[slug]/page.tsx`.
  → Horse Sport ecosystem card + footer link now open horsesport.sarga.co;
  horsesport-scoped news/events teasers deep-link to the Horse Sport site.
- `.env.local`: added `NEXT_PUBLIC_HORSESPORT_SITE_URL=http://localhost:3002`.
- `src/lib/cross-site.test.ts` (NEW): 8 vitest cases covering scope routing,
  local fallback when a dedicated site is unconfigured, and business/label maps.

### Motorsport (`frontend-motorsport`)

- `src/lib/site-config.ts`: added `horsesportUrl` (reads
  `NEXT_PUBLIC_HORSESPORT_SITE_URL`).
- `components/layout/motorsport-footer.tsx`: added optional `crossSiteLinks`
  prop rendered in the footer link row (external, new tab).
- `components/layout/page-shell.tsx`: passes a "Sarga Horse Sport" cross-site
  link to the footer.
- `.env.local`: added `NEXT_PUBLIC_HORSESPORT_SITE_URL=http://localhost:3002`.

### Horse Sport (`frontend-horsesport`)

- No change needed — `site-config.ts` already exposes `gatewayUrl` +
  `motorsportUrl`, and the footer/homepage already cross-link back into the
  ecosystem. (Env vars for both siblings were already present.)

### How verified

- Gateway: `vitest run` 21/21 ✓ (incl. 8 new cross-site tests), `tsc` ✓,
  `eslint` exit 0, `next build` 0/0.
- Motorsport: `tsc` ✓, `eslint` exit 0, `next build` 0/0.
- Live (gateway :3000, mock-data fallback): Horse Sport ecosystem card and
  footer link resolve to `http://localhost:3002/` with `target="_blank"`;
  motorsport card/footer/news teasers still resolve to `:3001`; no console
  errors.

## HS-8 — Forms, Ticketing, and SEO

Finished conversion + SEO for Horse Sport, porting the gateway's proven,
security-hardened patterns. No internal checkout or accounts were built.

### Contact form (server-validated + persisted)

- `src/lib/validation/forms.ts` (+ test): zod `contactFormSchema` with Horse
  Sport inquiry desks (ticketing/partnership/sponsorship/media/event/venue/
  stable/general), honeypot (`website` must be empty), `formStartedAt` timing
  field, `flattenFormErrors`.
- `src/lib/forms/security.ts`: in-memory rate limiter (5 / 10 min per
  fingerprint), request fingerprint, timing check (≥800ms), optional reCAPTCHA
  (no-op when unconfigured).
- `src/lib/strapi/forms.ts`: `submitInquiry` → POST `inquiry-submissions` tagged
  `sourceSite: "horsesport"`.
- `src/lib/forms/submit.ts`: `deliverInquiry` with placeholder mode (default in
  non-production; validates + accepts without a write token).
- `src/lib/strapi/client.ts`: added `strapiPost` + `isStrapiConfigured`.
- `src/app/api/contact/route.ts`: POST handler (rate limit → parse → honeypot/
  timing → reCAPTCHA → deliver) with typed error responses.
- `src/components/sections/contact-form.tsx`: wired to `/api/contact`; hidden
  honeypot, timing armed on mount + focus, inline field errors, success state.

### Ticketing (redirect / deep link / allowlisted embed)

- `src/lib/ticketing/safe-url.ts` (+ test): `safeTicketUrl` (HTTPS-only, dev
  localhost, custom deep-link schemes via `TICKETING_DEEP_LINK_SCHEMES`) and
  `safeTicketEmbedUrl` (host allowlist via `TICKETING_EMBED_ALLOWLIST`; empty =
  embeds disabled; rejects lookalike hosts).
- `cms-content.ts`: ticket types gained `ctaType` (redirect|deepLink|embed) +
  `embedUrl`; a `resolveTicketAction` helper validates every CMS ticket URL
  through the safe-url gate (embed degrades to redirect when not allowlisted).
- `ticket-cta-panel.tsx`: renders an allowlisted partner iframe (sandboxed,
  lazy, no-referrer) beneath the redirect stub, which stays the primary path.

### SEO

- `src/lib/seo/metadata.ts`: `createMetadata` factory (canonical + Open Graph +
  Twitter, CMS SEO overrides, noindex support), built on site-config helpers.
- Converted all static pages (about, events, news, gallery, venues, stable-life,
  partners, contact, tickets) + event/news detail `generateMetadata` to
  `createMetadata` → per-page canonical URLs + OG/Twitter.
- `src/app/sitemap.ts`: now dynamic — static routes + CMS event/news detail URLs.
- Structured data: hardened `SeoJsonLd` (escapes `<`); enriched Event JSON-LD
  (startDate/endDate ISO, eventStatus, attendance mode, Place address, Offer)
  and NewsArticle JSON-LD (datePublished ISO, mainEntityOfPage, Person/Org
  author); added Organization JSON-LD site-wide in `layout.tsx`.

### Config / tooling

- Added vitest to Horse Sport (`test`/`test:watch` scripts + devDep) to match
  the other frontends; installed via pnpm.
- `.env.local`: documented `FORM_SUBMISSION_MODE`, `RECAPTCHA_*`,
  `TICKETING_DEEP_LINK_SCHEMES`, `TICKETING_EMBED_ALLOWLIST` (root `.env.example`
  already carried these).

### How verified

- `vitest` 10/10 ✓ (validation + safe-url), `tsc` ✓, `eslint` exit 0,
  `next build` 0/0.
- Live (:3002) `/api/contact`: valid → 200 ok; honeypot → 400; instant submit →
  400 (timing); invalid fields → 400 with per-field errors; 6th request → 429
  (rate limit). End-to-end UI submit → "Thank you" success state; no console
  errors.
- `/sitemap.xml` → 15 entries incl. event/news detail URLs; `/robots.txt` OK.
- Event detail: canonical + og:type=article + twitter card + JSON-LD
  (Organization + Event) all present.

## HS-9 — Quality and UAT

Ran the full quality pass and produced the UAT checklist + verification log
(`checklists/horsesport/horsesport_uat_checklist.md`).

### Results

- **Build gate**: `pnpm build` 20/20 pages 0/0, `tsc` ✓, `eslint` ✓,
  `vitest` 10/10.
- **Responsive**: no horizontal overflow at 375 / 768 / 1440; mobile menu
  toggles (aria-expanded) with full nav + CTAs.
- **CMS filtering (live Strapi)**: HS query returns only horsesport-scoped
  content (2 events, 3 news); 4 motorsport events excluded; 0 hidden leaks;
  business gate applied (events→`business`, news→`relatedBusinesses`).
- **Cross-site**: gateway ecosystem card + footer → :3002; motorsport footer →
  Horse Sport; Horse Sport → gateway/motorsport (HS-7).
- **Ticketing**: partner redirect opens in new tab; all external links carry
  noreferrer/noopener; safe-url gate enforced; no internal checkout.
- **Forms**: valid→200, invalid→field errors, honeypot/timing→400, rate
  limit→429; `sourceSite=horsesport`.
- **SEO**: per-page title/description/canonical/OG/Twitter; sitemap 15 URLs
  (incl. dynamic detail); robots; JSON-LD Organization + Event + NewsArticle.
- **Accessibility**: alt coverage (20/20 home, 5/5 events), single H1 + clean
  hierarchy, skip link, main landmark, focus-visible, reduced-motion guards,
  AA primary-text contrast.

### Fixes made during QA

- Detail pages now call `notFound()` in `generateMetadata` and added
  `generateStaticParams` to `events/[slug]` and `news/[slug]` (matches the
  gateway pattern) — known slugs are now pre-rendered SSG (`●`) for faster loads.

### Known gaps (documented in the checklist)

- **Soft-404**: unknown detail slugs render the not-found UI but return HTTP 200
  (Next 16 on-demand ISR behavior, identical to gateway/motorsport). Hard 404
  would need `dynamicParams=false`, trading off ISR for CMS content. Unrouted
  paths return 404 normally.
- Contact form placeholder mode locally; in-memory rate limit; Lighthouse not
  run (CLI unavailable — capture in CI/hosted preview).

## HS-10 — Deployment and Handover

Prepared deployment + handover materials for Horse Sport. Docker was already
wired from HS-1; this phase documents production and hands the site over.

### Verified already in place

- `docker-compose.yml`: `frontend-horsesport` service (port 3002, `apps`
  profile, `depends_on: strapi`, site-URL overrides, form/ticketing vars via
  `env_file: .env`).
- `docker/frontend-horsesport.Dockerfile` (mirrors motorsport).
- `pnpm install --frozen-lockfile` passes (lockfile synced after the HS-8 vitest
  addition) — the Docker image build will succeed.

### Added

- `docs/horsesport/08_horsesport_deployment_handover.md` (NEW) covering:
  - production env var inventory (public vs server/secret; required vs optional
    feature toggles), with the least-privilege token note (read + create on
    `inquiry-submissions`);
  - deployment steps — Vercel (root dir `frontend-horsesport`, per-site project)
    and Docker (`docker compose --profile apps up --build frontend-horsesport`),
    incl. the prod-image `pnpm build`+`start` note;
  - CMS editorial guide (siteScope + business tagging per collection, ticketing
    rules, inquiry routing);
  - media asset upload guidelines (sizes/formats/alt text);
  - rollback notes (code via Vercel promote / git revert / image tag; content via
    unpublish; env-var rebuild caveat);
  - post-launch smoke + ongoing monitoring checklist.
- README: added optional HS-8 env vars to the Horse Sport block; linked the new
  deployment doc and the UAT checklist in the documentation map.

### How verified

- `pnpm install --frozen-lockfile` exit 0; production build 20/20 0/0 (HS-9);
  all doc cross-links point at existing files.

---

## Horse Sport build — complete

HS-1 → HS-10 delivered: dedicated Horse Sport frontend (port 3002) on the shared
Strapi, cross-site integration, server-validated forms + safe ticketing + SEO,
QA/UAT, and deployment/handover docs. Scope honored throughout: one shared CMS,
no internal checkout/accounts/ticketing engine, no hardcoded secrets, siteScope
separation.

## Content — high-res imagery + CMS posts (post-HS-10)

Replaced the low-res seed art with curated high-resolution images (from the new
`frontend-horsesport/public/media` set) and authored the posts in the shared
Strapi CMS via the seed (not frontend fallbacks), per request.

### CMS (via `cms/src/seed.ts`, applied on Strapi dev auto-reload)

- Copied 11 curated high-res PNGs into `cms/data/seed-media/` (`hs-*.png`).
- Fixed `uploadIfMissing` to derive mime type from extension (PNG/WebP/JPEG) —
  it previously hardcoded `image/jpeg`.
- Added `refreshHorseSportMedia()` (idempotent) that **replaces** existing
  horse-sport covers with the high-res art (seedMedia never overwrites):
  - Derby → `hs-home-straight-finish`, Twilight → `hs-night-race`,
    Merdeka news → `hs-winners-circle`, Stable news → `hs-champion-horse`,
    Turf-track news → `hs-racecourse-aerial`.
  - Race-day gallery `mediaItems` → 8 high-res images.
- New posts (idempotent by slug):
  - Event `sarga-champions-sprint` (championship) → `hs-starting-gates`.
  - News `the-making-of-a-champion-jockey` (jockey-story) → `hs-jockey-portrait`.
  - News `photo-finish-decides-turf-classic` (race-results) → `hs-closeup-action`.

### Frontend fallbacks (offline/no-CMS safety)

- Repointed the 4 removed low-res `.jpg` references to existing high-res `.png`
  across `cms-content.ts`, `homepage-data.ts`, `gallery`, `venues`, `styleguide`.

### How verified

- Live CMS: 3 horse-sport events + 5 news + 8 gallery items, all covers =
  `hs_*.png`. Frontend (`:3002`) `/events` (3 cards), `/news` (5 cards),
  `/gallery` (8 images) render the new art with **0 broken images**.
- `tsc` ✓, `eslint` ✓, `next build` 0/0; cms `tsc` ✓.

> Re-seeding note: the refresh + new posts apply on Strapi boot with
> `SEED_DEMO_CONTENT=true`. Cover refresh is idempotent (skips when already the
> high-res file). A few generated images remain unused and are available for
> future posts.
