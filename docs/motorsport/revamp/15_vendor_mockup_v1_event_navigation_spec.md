# MSR-MOCKUP-1 — Event Navigation and Route Contract

## Status

Implemented in the Motorsport frontend: 2026-08-14.

## Event dropdown

The desktop and mobile Event item is a keyboard-accessible disclosure menu.
Children are sourced from published, Motorsport-scoped `Motorsport Program`
records, sorted by the existing program order/type contract. Only records with
`eventMenuEnabled = true` are listed. Each record supplies the short localized
`eventMenuLabel` shown in the dropdown; the full programme title remains on the
destination page. If a label is empty, the frontend uses a safe shortened title
fallback. If the CMS is unavailable, the repository fallback exposes FIA
Rallycross and IJTC. There is no generic `All events` child in this dropdown;
the `/events` index remains available through the Events page and other links.

The interaction supports click/tap toggle, Enter/Space activation, Escape to
close and restore focus, outside-click close, visible focus, and mobile nested
links. The Event link remains available as the `All events` child.

## Canonical routes

- FIA: `/events/fia-rallycross-world-cup-indonesia-2026`
- Legacy FIA: `/campaign/fia-rallycross-world-cup-indonesia-2026` (permanent
  redirect to the canonical Event route)
- IJTC: `/events/indonesia-junior-talent-cup`

The canonical FIA route renders the existing campaign template and keeps its
CMS-managed slides, rundown, rules, SEO, and ticket CTA. The legacy route is
retained only for inbound-link compatibility.

## Hidden IJTC behavior

When the IJTC `programStatus` is `hidden`, it is removed from the Event menu and
the programme routes render a branded Coming Soon page. Published IJTC content
continues to render unchanged when the programme is enabled.

## CMS contract

No new collection is required. Editors manage programme title, localized copy,
slug, status, site scope, hero media, CTA, `eventMenuLabel` (localized short
label), and `eventMenuEnabled` through `Motorsport Program`. The existing
programme records are the canonical event destinations for this navigation;
generic `Event` records are not used for this menu. 
Super Admin can manage all site records; Motorsport Admin remains scoped to
Motorsport records.
