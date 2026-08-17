# Motorsport CMS Preview Phase 5 Implementation

## Document status

- Phase: 5 - secondary collections and shared-record consumers
- Status: Implemented
- Date: 2026-08-15
- Scope: Partners, Ticket CTAs, Leadership, Galleries, and every current
  Motorsport route consuming those records

## Affected-route contract

### Partners

- Homepage: `/`
- Partner hub: `/partners`
- Event sponsor strip: `/events/{eventSlug}`
- English and Indonesian variants

### Ticket CTAs

- Homepage: `/`
- Ticket hub: `/tickets`
- Event detail: `/events/{eventSlug}`
- Program/campaign detail: `/events/{programSlug}`
- English and Indonesian variants

### Leadership

- Homepage Connected Records: `/`
- About team section: `/about`
- English and Indonesian variants

### Galleries

- Homepage gallery mosaic: `/`
- Gallery hub: `/gallery`
- English and Indonesian variants

Affected-route logic lives in
`frontend-motorsport/src/lib/preview/affected-routes.ts` and is covered by unit
tests. Dynamic event/program context is validated as a safe slug before being
added to the affected route set.

## What changed

- Added locale-aware `fetchSitePage`, `fetchGalleryItems`, and
  `fetchTicketCtas` adapters.
- Partners hub now passes explicit locale and preserves empty draft partner
  results without placeholder partners.
- Gallery hub now passes explicit locale and preserves empty/partial draft media
  without fallback gallery content.
- Tickets hub now passes explicit locale to events and ticket CTAs and preserves
  empty draft ticket results without placeholder CTAs.
- About now passes explicit locale to Site Page and Leadership reads and does not
  substitute fallback leadership in Preview.
- Existing Homepage, PageShell, Event, and Campaign consumers remain covered by
  Phase 2-4 Preview-safe behavior.
- Shared-record route matrix tests cover partners, ticket CTAs, leadership,
  galleries, locales, event routes, program routes, and unsafe context.

## Verification

- Shared affected-route tests: 3/3.
- Full Motorsport Preview tests: 10/10.
- Motorsport typecheck passed.
- Motorsport ESLint passed.
- Motorsport production build passed.
- Preview formatting passed.
- `git diff --check` passed.
- Local draft Partner API smoke check: HTTP 200.
- Local draft Ticket CTA API smoke check: HTTP 200.
- Local draft Leadership API smoke check: HTTP 200.
- Local draft Gallery API smoke check: HTTP 200.

## Known limitations

- Browser Content Manager mutation UAT remains pending.
- Partner-to-event inverse relations are not available on the Partner schema;
  event sponsor consumer validation relies on the Event `sponsors` relation.
- Event gallery and News related-gallery relations are populated only where
  current UI adapters consume them; no new gallery presentation was introduced.
- Gateway and Horse Sport Preview remain out of scope.
