# 01 — Sarga Horse Sport Project Brief

## Objective

Create a dedicated **Sarga Horse Sport** website under the same Sarga single-repository multisite architecture.

The existing sites remain:

- `frontend-gateway/` — Sarga.co group gateway
- `frontend-motorsport/` — Sarga Motorsport dedicated frontend

Add:

- `frontend-horsesport/` — Sarga Horse Sport dedicated frontend

The Horse Sport site should become the premium digital home for Sarga’s equestrian sports ecosystem: horse racing, national derbies, jockey stories, turf/track development, stable lifestyle, championship announcements, ticketing, and editorial/news content.

## Strategic role

Sarga.co remains the parent gateway. The gateway introduces the ecosystem and sends visitors to dedicated sub-business websites when deeper engagement is required.

Sarga Horse Sport should handle:

- Detailed horse sport positioning
- Horse racing / derby event pages
- Ticketing CTA for equestrian events
- News and publications related to Horse Sport
- Media gallery and visual storytelling
- Venue/turf/stable/horse lifestyle narratives
- Partnership, sponsorship, and community inquiries

## Relationship with gateway and Motorsport

### From gateway to Horse Sport

When a user clicks Sarga Horse Sport in the gateway ecosystem section, they should be redirected to the dedicated Horse Sport site.

Gateway should still show Horse Sport teasers:

- Featured Horse Sport business card
- Selected news/events where `showOnGateway = true`
- Ticket Hub items related to Horse Sport

### From Motorsport to Horse Sport

Motorsport may include cross-ecosystem links to Horse Sport where relevant, especially for Sarga-wide events, festivals, cross-sport campaigns, and Sarga Circle membership.

### From Horse Sport to gateway/Motorsport

Horse Sport should link back to the Sarga.co gateway and may cross-link to Motorsport through footer, ecosystem nav, or shared campaign pages.

## Design expectation

The Horse Sport site must be a premium frontend UI with international-standard quality.

It should not copy the gateway layout directly and should not reuse the Motorsport look. It should be a dedicated equestrian brand experience inspired by the Horse Sport section of page 7 in `sarga_website_preview.pdf`.

Expected feeling:

- Elite
- Cinematic
- Elegant
- Athletic
- Heritage but modern
- Hospitality/lifestyle-forward
- High-performance
- Premium sport entertainment

## Scope exclusions

- No internal payment processing
- No public user accounts/login
- No internal ticketing engine
- No second CMS
- No duplication of content between CMS collections unless approved

## Success criteria

- `frontend-horsesport/` exists as a separate Next.js app.
- It runs locally on port `3002`.
- It consumes the same Strapi CMS as gateway and Motorsport.
- News/events/tickets can be scoped to `horsesport`, `gateway`, `motorsport`, `shared`, or `hidden`.
- Gateway routes Horse Sport ecosystem items/news/events/tickets to the Horse Sport site.
- Horse Sport has its own visual system, sitemap, metadata, forms, and UAT checklist.
