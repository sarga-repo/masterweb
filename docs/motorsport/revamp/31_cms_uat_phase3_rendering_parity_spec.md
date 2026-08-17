# MSR-CMS-UAT-3 — Motorsport Route Rendering and Visibility Parity

Status: completed 2026-08-15.

## Goal

Apply one independent, observable CMS rendering contract across every
Motorsport route.

## Implementation

- Introduce a shared route state that separates `loaded`, `empty`, and `error`;
  never pass a fetch error into optional-control helpers.
- Give every hero independent controls for enabled state, media, title, and
  description. Add a positioned content layer above hero media and overlays.
- Give each major visual block one section key and one independent toggle.
- Add stable `data-cms-section-key` and source/status markers for UAT.
- Close current route gaps:
  - About hero stacking and false profile/team state;
  - News page availability, independent hero/lead/archive blocks, markers;
  - Gallery independent hero/intro/archive controls;
  - Merchandise independent catalogue control;
  - Tickets independent ticketed-events control;
  - Event, programme, news-detail, and campaign visibility/status behavior.
- Preserve collection-item status filtering and safe ticket redirects.
- Remove or explicitly document any CMS field that a route does not consume.

## Route families

- Home and About.
- Experience, Contact, Partners, Tickets, Gallery, Merchandise.
- Events hub, event detail, FIA campaign, IJTC and supporting pages.
- News hub and detail.
- Header, Event dropdown, footer, and localized chrome.

## Tests

For each route, assert hero image/title/description, page availability, every
section false/true transition, empty collection behavior, and no fallback leak.
Run at 1440px and 390px for English and Indonesian routes.

## Exit gate

Do not start MSR-CMS-UAT-4 until every implemented section has an independent
toggle assertion and all reported About defects pass browser validation.

## Implementation result

- About, News, Gallery, Merchandise, and Tickets now apply page, hero, and
  section visibility independently instead of coupling unrelated blocks.
- Stable CMS section markers make Preview/live assertions observable without
  depending on copy or CSS selectors.
- The About hero content layer now sits above its media and overlay; saved hero
  title, description, and image remain readable when enabled.
- Gallery now has one hero/intro composition and one separately controlled
  archive block; the temporary duplicated editorial band was removed.
- Missing local Draft section records were added for the route controls already
  implemented in code. They remain unpublished editor data.
- Reversible exact-Preview checks covered every newly wired section toggle and
  restored all original values after validation.
