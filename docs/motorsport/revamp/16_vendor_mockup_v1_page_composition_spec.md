# MSR-MOCKUP-2 — Approved Page Composition

## Status

Implemented incrementally in the shared Motorsport shell and route templates:
2026-08-14.

## Composition rules

- Home keeps the CMS hero, the blue information band, and the ticket CTA while
  allowing each section to be hidden independently from the Site Page record,
  including the Connected records/Sarga network panel.
  The approved default hides Upcoming events/Also on the calendar, keeps the
  ticket panel as its own section, removes the hero shadow copy/scrim, and
  keeps mobile image fallback behavior. The complete ticket card is managed by
  the `motorsportTicketSection` field on `Site Pages → motorsport-home`; its
  optional `backgroundImage` supplies the middle content-panel artwork (with a
  readability overlay), while the narrow left rail retains the decorative
  heat-field treatment, and its active
  state, copy, footer metadata, and partner CTA are independently editable.
  The legacy Ticket CTA media field remains a safe fallback and continues to
  support the Tickets page. Race-control metadata and inactive Sarga.co
  utility links remain optional CMS-controlled content.
- About keeps the blue profile composition and managed team section while
  removing bars marked hidden in the vendor mockup.
- FIA keeps the campaign data model and high-energy banner/rundown/rules/ticket
  content while presenting it under the Event route.
- IJTC uses the existing seven-route programme experience when enabled and a
  branded Coming Soon state when hidden.
- News and Tickets keep their CMS data and partner contracts while rendering
  only the approved editorial/ticket sections.
- The shared footer uses Discover links for Home, About, Event, and News, plus
  CMS-managed Instagram, TikTok, YouTube, LinkedIn, and Threads links. Visit
  Sarga.co is omitted until the gateway is approved for public linking.

The layout composition and section order are code-owned. CMS fields remain the
source for content, media, availability, localized labels, destinations, and
section visibility (`enabled`). This keeps the vendor-approved composition
stable while allowing editors to show/hide each independently managed block.
