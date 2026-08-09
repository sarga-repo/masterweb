# Sarga Motorsport Sitemap and Page Specifications

## Current source of truth

For the major Motorsport revamp, use:

- `docs/motorsport/revamp/03_sitemap_page_specs.md`
- `reference/source-pdfs/sarga_motorsport_2.pdf`

This document is kept as the short canonical sitemap summary for agents following the older mandatory reading list.

## Primary navigation

```text
Home
About
Event
News
Gallery
Merchandise
Contact
Ticket
```

`Ticket` should be the final and prominent CTA. `Contact` sits immediately
before it on desktop; both remain easy to find in the mobile menu.

## Top-level sitemap

```text
/
/about
/events
/news
/news/[slug]
/gallery
/merchandise
/tickets
/contact
/events/[slug]
/campaign/[slug]
```

## Event program sitemap

```text
/events/indonesia-junior-talent-cup
/events/indonesia-junior-talent-cup/race-schedule
/events/indonesia-junior-talent-cup/riders
/events/indonesia-junior-talent-cup/standings
/events/indonesia-junior-talent-cup/about
/events/indonesia-junior-talent-cup/regulation
/events/indonesia-junior-talent-cup/become-riders
/events/fia-rallycross-world-cup-indonesia-2026
```

The FIA Rallycross page may alternatively use `/campaign/fia-rallycross-world-cup-indonesia-2026` if implementation decides it is campaign-shaped rather than event-detail-shaped.

## Homepage sections

1. Header/navigation.
2. Headline and description hero.
3. Upcoming Events.
4. News.
5. Gallery.
6. Footer.

Additional partner, newsletter, or brand-story modules may remain only if they support the new event-program focus.

## About page sections

1. Profile.
2. Vision.
3. What We Do.
4. Meet The Team.
5. Contact Us.
6. Part of Sarga.co.

## Event hub

The Event page should highlight:

- Indonesia Junior Talent Cup.
- FIA Rallycross World Cup Indonesia 2026.
- Upcoming event cards.
- Ticket status and CTA.
- CMS-driven event filters where useful.

## Indonesia Junior Talent Cup

Required subpages:

- Race Schedule.
- Profile Riders.
- Standing Points & Results.
- About IJTC.
- Regulation with PDF download.
- Become Riders inquiry flow.

## FIA Rallycross World Cup Indonesia 2026

Required campaign content:

- Banner.
- `First Time, Wild Action, Closer Than Ever`.
- `FIA Rallycross World Cup Indonesia 2026`.
- `5-6 December 2026`.
- `Jakarta International E-Prix Circuit`.
- `Get Your Ticket Now`.
- Banner slider.
- Rundown.
- Do and donts.

## Merchandise

Merchandise is a showcase, partner redirect, or inquiry page. Do not build cart, checkout, payment processing, or public accounts.

## Ticketing

Ticket pages and CTAs must redirect/deep-link to approved partner platforms or use an allowlisted embed. Do not build an internal ticketing engine.
