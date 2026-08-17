# MSR-CMS-CLEAN-7 — Tickets and Merchandise Single Types

Status: completed 2026-08-15.

Implementation: added localized Tickets and Merchandise Single Types, keeping
Ticket CTA and Merchandise Item collections as the transactional/content
sources and preserving partner redirects.

## Goal

Migrate two related but independently gated presentation pages. Do not change the ticket-provider boundary or merchandise data collection.

## Tickets

Create `api::motorsport-tickets-page.motorsport-tickets-page` with Hero, Information Band, `ticketControlSection`, `featuredTicketSection`, `ticketedEventsSection`, `ticketInfoSection`, availability, and SEO. Ticket destinations remain in `Ticket CTA`.

## Merchandise

Create `api::motorsport-merchandise-page.motorsport-merchandise-page` with Hero, Information Band, `merchControlSection`, `catalogueSection`, `finalCtaSection`, availability, and SEO. Products remain in `Merchandise Item`.

## Implementation order

1. Migrate and fully test Tickets.
2. Stop if any Ticket test fails.
3. Migrate and fully test Merchandise.

Both pages receive exact Preview/revalidation/RBAC and new-first/legacy-second reads.

## Tests and gate

- Independent Hero, band, metric group, and named-section toggles.
- Ticket URLs allow approved internal event links and safe external provider redirects; no checkout is introduced.
- Ticket images/copy/links remain editable in their owning collection.
- Merchandise 4-column maximum, pagination after 16 items, media and CTA behavior remain unchanged.
- EN/ID Draft/Published, immediate invalidation, desktop/mobile, accessibility, and empty collections.

Proceed only when Tickets and Merchandise each have separate passing reports.

## Rollback

Route-local adapter rollback; collections are unchanged.
