# MSR-MOCKUP-0 — Vendor Mockup v1 Assessment

## Status

Implementation baseline approved and reconciled: 2026-08-14.

## Decision

The vendor-approved `Website Mockup v1.pdf` is a composition revision of the
existing Sarga Motorsport site. We will preserve the current Next.js frontends,
shared Strapi instance, PostgreSQL, i18n, RBAC, preview, ticket redirect, and
content models. The approved show/hide and ordering rules are code-owned for
stability; editorial copy, media, event availability, links, and localized
labels remain CMS-managed.

## Vendor requirements mapped to the existing implementation

| Area | Approved change | Implementation contract |
| --- | --- | --- |
| Home | Remove shadow/operational metadata and hide Sarga.co utility links until the gateway is public | Keep the existing CMS hero and ticket section; simplify the shell and hero metadata. The information band, events, news, gallery, and ticket artwork now have explicit CMS-backed visibility/media contracts |
| About | Retain the blue profile composition and team section; remove unapproved bars | Reuse existing Site Page sections and managed Leadership records |
| Event | Add a programme dropdown; keep FIA as the primary entry | Build children from published Motorsport Program records |
| FIA | Treat the page as an Event route rather than a campaign route | Canonical `/events/fia-rallycross-world-cup-indonesia-2026`; redirect legacy `/campaign/...` |
| IJTC | Hide the programme for now | Remove from navigation and render a branded Coming Soon state at preserved routes |
| News | Retain the approved editorial hero/content and hide marked sections | Keep existing CMS News data and page primitives |
| Tickets | Show one current partner destination; no checkout/payment presentation | Reuse scoped CMS Ticket CTA and external redirect contract |
| Footer | Narrow shared footer, Discover Home/About/Event/News, add five social channels, remove Visit Sarga.co | Use existing CMS Site chrome with a safe code fallback |

## Current-state reconciliation

- Existing Motorsport navigation is CMS-driven with a repository fallback and
  already supports localized labels and enabled flags.
- Existing `Motorsport Program` records already provide title, slug, status,
  site scope, localized content, hero media, and CTA data; no new collection is
  required for the Event dropdown.
- Existing IJTC routes, rider profiles, standings, schedules, FIA campaign
  content, ticket CTAs, and preview routes remain reusable.
- The preview implementation is present in the repository and tracked by the
  current phase record; the earlier preview specification's status text is
  normalized by this track.
- Current working-tree preview changes are preserved and must not be reverted
  while this mockup track is implemented.

## Asset assumption

Current approved CMS media is used first. The vendor's new WA logo and final
hero/ticket photography are a content-only replacement step after delivery;
they do not block the layout implementation.

## Exit criteria

- Route, dropdown, hidden-program, composition, and footer contracts are
  documented.
- No duplicate CMS model or second CMS is introduced.
- The implementation phases below can be validated independently.
