# MSR-CMS-CLEAN — Motorsport Page Model Simplification Plan

Date: 2026-08-15  
Status: specification approved for implementation only after user confirmation  
Scope: Sarga Motorsport frontend and Motorsport-owned CMS presentation data

## 1. Objective

Replace the single broad Motorsport `Site Page` editing experience with page-specific CMS entry points while preserving the existing website, Preview, Draft/Publish, i18n, RBAC, cache revalidation, section visibility, media handling, and safe ticket behavior.

Every Motorsport route must render a consistent opening contract:

1. Hero: independently showable, with editable eyebrow, title, description, and background media.
2. Motorsport Information Band: independently showable immediately after the hero.
3. Information Band metric group: independently showable. It supports up to three editable label/value items in the same bottom-right layout; hiding the group also hides its vertical separators.

Other approved page sections remain visually and functionally unchanged until a later request.

## 2. Architecture decision

### Top-level routes

Use one localized Strapi Single Type for each top-level Motorsport page:

| Route          | New UID                                                        |
| -------------- | -------------------------------------------------------------- |
| `/`            | `api::motorsport-home-page.motorsport-home-page`               |
| `/about`       | `api::motorsport-about-page.motorsport-about-page`             |
| `/events`      | `api::motorsport-events-page.motorsport-events-page`           |
| `/news`        | `api::motorsport-news-page.motorsport-news-page`               |
| `/gallery`     | `api::motorsport-gallery-page.motorsport-gallery-page`         |
| `/merchandise` | `api::motorsport-merchandise-page.motorsport-merchandise-page` |
| `/tickets`     | `api::motorsport-tickets-page.motorsport-tickets-page`         |
| `/contact`     | `api::motorsport-contact-page.motorsport-contact-page`         |
| `/partners`    | `api::motorsport-partners-page.motorsport-partners-page`       |
| `/experience`  | `api::motorsport-experience-page.motorsport-experience-page`   |

Single Types are appropriate because each route has exactly one English and one Indonesian document. They remove `siteScope`, `pageKind`, `routePath`, `slug`, and unrelated homepage-only fields from the editor form.

### Common/detail routes

Do not create one-off page types for repeatable content:

- News detail remains `News Article`.
- Event detail remains `Event` or `Motorsport Program`.
- Rider detail remains `Motorsport Rider`.
- IJTC supporting routes remain driven by `Motorsport Program` and its related collections.

These templates receive the same Hero and Information Band presentation through their owning content record or a route-presentation component. They remain collection-driven.

### Shared presentation components

Create Motorsport-owned reusable components:

- `motorsport.page-hero`
- `motorsport.page-information-band`
- `motorsport.information-band-metric`
- `motorsport.page-section`

Do not change the visual design in this track. Components define editor contracts; route code owns layout and art direction.

## 3. Field contracts

### `motorsport.page-hero`

| Field                   | Type                | Rule                                                            |
| ----------------------- | ------------------- | --------------------------------------------------------------- |
| `isActive`              | boolean             | Required, defaults true                                         |
| `eyebrow`               | localized string    | Optional                                                        |
| `title`                 | localized string    | Required when active                                            |
| `description`           | localized rich text | Optional                                                        |
| `backgroundMedia`       | image/video media   | Optional; route fallback remains available during migration     |
| `mobileBackgroundMedia` | image/video media   | Optional                                                        |
| `backgroundAlt`         | localized string    | Required for meaningful images; empty only for decorative media |

Homepage carousel behavior remains supported through a homepage-specific hero wrapper using the existing localized `heroSlides`; it must expose the same `isActive`, `eyebrow`, title, and description semantics.

### `motorsport.page-information-band`

| Field             | Type                | Rule                                                              |
| ----------------- | ------------------- | ----------------------------------------------------------------- |
| `isActive`        | boolean             | Shows/hides the entire band                                       |
| `eyebrow`         | localized string    | Optional                                                          |
| `title`           | localized string    | Required when active                                              |
| `description`     | localized rich text | Optional                                                          |
| `showMetricGroup` | boolean             | Shows/hides the complete right-bottom metric group and separators |
| `metrics`         | repeatable metric   | Maximum three; order is editorial order                           |

### `motorsport.information-band-metric`

| Field      | Type             | Rule                                                   |
| ---------- | ---------------- | ------------------------------------------------------ |
| `isActive` | boolean          | Allows one metric to be suppressed without deleting it |
| `label`    | localized string | Required when active                                   |
| `value`    | localized string | Required when active                                   |

The frontend filters inactive metrics, renders at most three, and preserves the existing right-bottom position. If `showMetricGroup=false` or no active metrics exist, no metric container or separators render.

### `motorsport.page-section`

Use named component fields in each page Single Type rather than a dynamic zone plus manually entered `sectionKey`. Retain the existing editor capabilities: `isActive`, eyebrow, title, body, media, CTA label/URL, and theme where already consumed.

## 4. Migration safety contract

1. Create components and new Single Types without removing `Site Page`.
2. Seed and validate English and Indonesian entries.
3. Add a dual-read adapter: exact new Single Type first, legacy Motorsport `Site Page` only when the new published entry does not exist.
4. Exact Draft Preview of a new Single Type must never fall back to `Site Page`.
5. Migrate one route at a time and pass its browser/UAT gate before starting the next phase.
6. Keep legacy records untouched until all routes pass.
7. Revoke Motorsport Admin access to legacy `Site Page` only after the final cutover.
8. Archive legacy Motorsport records before any later deletion. Do not delete them in this track.

## 5. Preview, publish, and cache requirements

Every new UID must be added to:

- Strapi Preview UID allowlist and exact route mapping.
- Frontend exact-preview document fetching.
- read-only API-token permissions.
- Motorsport Admin and Super Admin RBAC matrices.
- lifecycle revalidation collection-to-route mapping.
- EN/ID validation and route-crawl coverage.

Draft Preview remains exact-document, exact-locale, `no-store`, and fail-closed. Published routes use only published documents and must update immediately after publish/unpublish.

## 6. Phase sequence

| Phase            | Scope                                         | Hard gate                                    |
| ---------------- | --------------------------------------------- | -------------------------------------------- |
| MSR-CMS-CLEAN-0  | Assessment and specifications                 | Documentation consistent; no runtime changes |
| MSR-CMS-CLEAN-1  | Reusable components and adapters              | Schema/types/tests pass; no route switched   |
| MSR-CMS-CLEAN-2  | Homepage Single Type pilot                    | Home Preview/live EN/ID parity passes        |
| MSR-CMS-CLEAN-3  | Gallery Single Type and `heroEyebrow` cleanup | Gallery hero/band/archive controls pass      |
| MSR-CMS-CLEAN-4  | About Single Type                             | About Preview/live and leadership pass       |
| MSR-CMS-CLEAN-5  | Events hub Single Type                        | Events hero/band/programme/calendar pass     |
| MSR-CMS-CLEAN-6  | News hub Single Type                          | News hero/band/editorial/archive pass        |
| MSR-CMS-CLEAN-7  | Tickets and Merchandise Single Types          | Ticket safety and catalogue behavior pass    |
| MSR-CMS-CLEAN-8  | Contact, Partners, Experience Single Types    | All three low-risk routes pass independently |
| MSR-CMS-CLEAN-9  | Common/detail template contract               | Event/news/IJTC/rider templates pass         |
| MSR-CMS-CLEAN-10 | RBAC cutover and legacy retirement            | Motorsport Admin no longer needs Site Page   |
| MSR-CMS-CLEAN-11 | Full UAT and handover                         | Complete EN/ID desktop/mobile matrix passes  |

Execute phases in order. Do not start a later phase if the current phase has a failing test, unresolved data migration, Preview mismatch, or live mismatch.

## 7. Non-goals

- No second CMS.
- No Gateway or Horse Sport schema migration.
- No redesign or section reorder.
- No payment, checkout, user account, or ticketing-engine changes.
- No deletion of legacy content.
- No unrelated collection restructuring.

## 8. Rollback

Before final cutover, rollback is route-local: disable the new adapter for the affected route and resume the legacy `Site Page` read. After final cutover, legacy Motorsport Site Page records remain archived for one release cycle and can be restored with the documented restoration manifest.
