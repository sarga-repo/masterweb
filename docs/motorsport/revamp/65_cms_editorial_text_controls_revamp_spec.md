# CMS Editorial Text Controls Revamp

Status: In progress

## Goal

Make Motorsport editorial copy and its visibility editor-controlled across all CMS-backed Motorsport routes, without moving layout, typography, responsive behavior, or safety-critical business logic into Strapi.

The same reusable contract must support Home, About, Events, News, Gallery, Merchandise, Tickets, Contact, Partners, Experience, campaign pages, event detail pages, and programme/detail routes where the page model already owns presentation content.

## Audit findings

- Motorsport Single Types already own `hero`, `informationBand`, and named `motorsport.page-section` components for the ten primary routes.
- Those components already expose most copy (`eyebrow`, `title`, `description/body`, CTA) and section visibility (`isActive`/`enabled`).
- Frontend still hardcodes presentation labels and copy around those components. Examples include About `01 / Who we are`, `Profile / Indonesia`, `CAPABILITY`, `TEAM`, homepage/events section indexes, and several standalone support labels.
- Hero and information-band components do not independently expose visibility for eyebrow, title, description, or media.
- `SectionHeader` always renders its supplied eyebrow/title/overview labels and currently receives many frontend-owned index values.
- Programme, event, rider, and news detail models already have optional `motorsport.detail-presentation`; child programme pages still contain route-local fallback copy and are a later migration surface.

## Reusable contract

### Page hero

Add localized controls:

- `showEyebrow`, `showTitle`, `showDescription`, `showMedia`, `showMetricGroup`
- Existing copy/media fields remain the source of truth.

### Information band

Add localized controls:

- `showEyebrow`, `showTitle`, `showDescription`, `showMetricGroup`
- Existing metric `isActive` remains item-level visibility.

### Named page section

Add localized controls and labels:

- `showIndex`, `indexLabel`
- `showEyebrow`, `showTitle`, `showBody`, `showMedia`, `showCta`
- `supportLabel`, `supportBody` for a secondary editorial label/body where the layout has one.
- Existing `isActive` remains whole-section visibility.

All controls default to the current rendered behavior, preserving existing content after schema rollout.

## Phases

### Phase A — Foundation

Extend reusable CMS components, generated frontend types, mappers, `SectionHeader`, hero, information-band, and named-section renderers. Add admin descriptions for editor behavior. No route migration beyond compatibility defaults.

### Phase B — Primary route migration

Migrate Home, About, Events, News, Gallery, Merchandise, Tickets, Contact, Partners, and Experience. Replace frontend-owned section indexes, labels, and copy with CMS values where the corresponding Single Type section exists. Keep curated fallback copy only for CMS outage/legacy records.

### Phase C — Detail route migration

Extend `motorsport.detail-presentation` and the existing programme/event/rider/news presentation consumers for detail routes and campaign surfaces. Migrate IJTC child-page labels only where a CMS-owned program/detail presentation exists; retain route safety and fallback states.

### Phase D — UAT and handover

Run schema/type checks, focused behavior tests, CMS migration rehearsal, preview tests, browser checks for show/hide and copy changes, production builds, and update phase progress/handover notes.

## Invariants

- One Strapi CMS and existing site-scope/RBAC boundaries remain unchanged.
- Editors can hide copy without deleting the component or breaking layout.
- Empty optional copy renders no empty labels or spacing-only blocks.
- Existing published records render as before when new flags are absent.
- Preview reads draft controls and does not fall back to published copy for an exact draft.
- Frontend retains fallback copy only when CMS content is unavailable or legacy data has not yet migrated.
- No payment, account, ticketing, or external-service behavior changes.
