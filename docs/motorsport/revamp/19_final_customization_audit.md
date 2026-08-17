# Motorsport final customization audit

Date: 2026-08-15  
Scope: `frontend-motorsport` and Motorsport-scoped Strapi content only

## Outcome

The final validation is technically green for the CMS-backed controls that are
implemented, but the requirement “every element is fully customizable” is not
yet green. The current architecture is CMS-first with curated route templates;
some supporting copy and presentation labels remain code-owned. This document
records the exact boundary so the launch decision is evidence-based.

## Verified as CMS-managed

| Area | Result | Evidence |
| --- | --- | --- |
| Homepage hero carousel | Pass | Up to three active CMS slides; image, mobile image, video, poster, title, description, CTA, order, and active state are consumed. |
| Page hero media | Pass | Motorsport `Site Page.heroMedia` is consumed by Home, About, Events, News, Gallery, Merchandise, Partners, Contact, Tickets, and Experience. `heroEnabled` is now available and seeded on all 12 Motorsport Site Pages. |
| Programme/event heroes | Pass | FIA and IJTC pages consume the published programme/event hero media with a safe fallback. |
| Homepage section visibility/copy | Pass | Information band, World of Motorsport, disciplines, Upcoming Events, Latest News, Gallery, Connected Records, and ticket card visibility/copy are CMS-driven. |
| Homepage ticket card | Pass | `motorsportTicketSection` controls active state, middle-panel artwork, eyebrow, title, description, event/provider labels and values, partner label, footer text, CTA label, and CTA URL. URLs are constrained to internal routes or approved HTTPS destinations. |
| Editorial/media collections | Pass | Published events, programmes, news, gallery items, merchandise, partners, leadership, riders, standings, regulations, and ticket CTAs are read from Strapi with Motorsport/shared scope filters. |
| Event dropdown | Pass | Published Motorsport Program records control event menu label, visibility, order, and destination. |
| Section toggles | Pass for implemented section keys | `shared.page-section.enabled` is optional/defaulted for backwards compatibility and is consumed by the route templates listed above. |

## Validation performed

- Strapi restarted successfully with demo seed enabled; seed completed without
  errors and normalized legacy section/hero toggle values.
- Public API checks returned HTTP 200 for Site Pages and Motorsport Programs.
- API inventory: 12 Motorsport Site Pages, all with `heroEnabled: true`, 32
  page sections, and no null/invalid section toggle values.
- Homepage browser check confirmed the CMS ticket artwork renders in the wide
  middle panel, the CTA resolves to `/tickets`, and the CMS hero image renders.
- Browser checks passed for `/`, `/about`, `/events`, `/news`, `/gallery`,
  `/experience`, `/tickets`, and IJTC race schedule/riders routes.
- Route crawl returned HTTP 200 for all Motorsport public routes, including
  FIA Rallycross and all IJTC supporting pages.
- `frontend-motorsport`: lint, typecheck, and production build passed.
- `cms`: TypeScript check passed before the final seed restart; Strapi's own
  startup TypeScript compilation also completed successfully after the seed
  normalization fix.

## Remaining code-owned or partially CMS-backed areas

These prevent the phrase “every element fully customizable” from being marked
complete:

1. `shared.page-section.media`, `ctaLabel`, `ctaUrl`, `ctaTarget`, and `theme`
   are available in Strapi but are not rendered by every route template.
2. Several supporting blocks still contain fixed labels/copy, including ticket
   “How it works”, contact routing addresses, partner inquiry copy, gallery
   metadata labels, and some IJTC schedule/rider presentation labels.
3. Experience pillar cards and a number of event/news/gallery presentation
   labels are still code-owned; the CMS currently controls their section intro,
   not every individual card field.
4. Collection-level visibility is represented by publication/status fields in
   several models rather than one consistent `enabled` toggle on every record.

## Recommendation

Do not call the “fully customizable” gate complete yet. The next focused task
should be a Motorsport editorial componentization phase that adds explicit
repeatable CMS components for the remaining card/metadata blocks and wires the
existing shared `media`/CTA/theme fields into each route. The current changes
are safe to ship as an incremental CMS-backed foundation; the remaining work is
content-model and template coverage, not an infrastructure change.
