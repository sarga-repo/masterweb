# MSR-TICKET-CARD-1 — Unified ticket-card shape and CMS contract

## Scope

All Sarga Motorsport ticket cards now use one shared two-part composition:

1. A flexible main content panel (copy, metadata, and optional artwork).
2. A fixed-width clickable partner/action panel.

The former standalone left decoration column is removed. Existing Motorsport
colors, typography, CTA behavior, and safe ticket URL handling remain intact.

## Visual contract

- The main panel expands to use the space formerly occupied by the decoration.
- The main/action boundary uses a dotted rule; the action panel keeps the
  existing crimson/orange color treatment.
- Background artwork is rendered without the previous dark shadow overlay.
- `backgroundImage` is used on desktop and `backgroundImageMobile` on mobile.
  When the mobile value is empty, the desktop value is reused. When both are
  empty, the existing neutral/fallback surface remains.
- The component remains responsive: the action panel stacks below the main
  panel on small screens.

## CMS contract

The following fields are supported by the shared ticket-card adapter:

| Purpose | Fields |
| --- | --- |
| Visibility and destination | `isActive`, `ctaType`, `url`, `embedConfigJson` |
| Main copy | `eyebrow`, `title`, `description` |
| Metadata | `eventLabel`, `eventText`, `providerLabel`, `providerText`, `partnerLabel`, `footerText` |
| Action label | `ctaLabel` (legacy `label` remains supported) |
| Artwork | `backgroundImage`, `backgroundImageMobile` (legacy `image` remains supported) |

Editors can manage these fields in:

- `Motorsport Home Page → ticketSection` (legacy `Site Page → motorsportTicketSection` is still read as a fallback).
- `Motorsport Ticket CTA` records used by the Tickets page, events, and
  campaigns.
- A campaign/event's related Ticket CTA; the card uses its copy and artwork
  before route-level fallback copy.

## Route coverage

- `/`
- `/tickets`
- `/events/[slug]`
- `/events/fia-rallycross-world-cup-indonesia-2026`

Event cards use the configured safe ticket destination when available, with
the existing `/tickets` route as a safe fallback. External destinations still
pass through the HTTPS/deep-link/embed allowlists.

## Acceptance checks

- One shared component renders every Motorsport ticket card.
- No standalone left decoration column remains.
- Desktop and mobile artwork can be configured independently.
- Empty artwork does not produce a broken image or overlay.
- Existing CMS records and legacy fields continue to render.
- Typecheck, lint, production build, CMS build, and route smoke tests pass.

## Editor note

Existing records do not require destructive migration. Populate the new
`backgroundImage`/`backgroundImageMobile` and copy fields when a card needs
custom content; otherwise the adapter retains the current fallback values.
