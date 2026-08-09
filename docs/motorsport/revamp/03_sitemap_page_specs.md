# 03 - Sitemap And Page Specifications

## Target primary navigation

Use this order unless stakeholders approve a different one:

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

`Ticket` is the final item and strongest CTA in the desktop header, matching the
reference navigation rhythm. `Contact` remains immediately before it; on small
viewports both items must remain easy to find in the mobile menu.

## Route map

| Sitemap node                            | Target route                                                                                             | Existing route status                       | Notes                                                                                                                                      |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Homepage                                | `/`                                                                                                      | Revamped in MSR-4                           | Focused source-sitemap sequence with CMS-managed copy and media-safe fallbacks.                                                            |
| About                                   | `/about`                                                                                                 | Revamped in MSR-5                           | Profile, Vision, What We Do, Meet The Team, Contact Us, and Part of Sarga.co delivered.                                                    |
| Event                                   | `/events`                                                                                                | Revamped in MSR-5                           | Programme-led hub with FIA Rallycross, IJTC, upcoming events, and ticket status.                                                           |
| Event detail                            | `/events/[slug]`                                                                                         | Exists                                      | Use for event pages when the content is event-shaped.                                                                                      |
| Indonesia Junior Talent Cup             | `/events/indonesia-junior-talent-cup`                                                                    | Delivered in MSR-6                          | CMS-first dedicated programme hub and canonical route.                                                                                     |
| IJTC race schedule                      | `/events/indonesia-junior-talent-cup/race-schedule`                                                      | Delivered in MSR-6                          | CMS-managed schedule list with explicit TBA/demo states.                                                                                   |
| IJTC rider profiles                     | `/events/indonesia-junior-talent-cup/riders`                                                             | Delivered in MSR-6                          | Rider cards and detail-ready CMS data.                                                                                                     |
| IJTC standings/results                  | `/events/indonesia-junior-talent-cup/standings`                                                          | Delivered in MSR-6                          | Mobile-accessible points and result classification.                                                                                        |
| About IJTC                              | `/events/indonesia-junior-talent-cup/about`                                                              | Delivered in MSR-6                          | Programme purpose and development model.                                                                                                   |
| IJTC regulation                         | `/events/indonesia-junior-talent-cup/regulation`                                                         | Delivered in MSR-6                          | Controlled PDF publication; pending until an approved active CMS file exists.                                                              |
| Become Riders                           | `/events/indonesia-junior-talent-cup/become-riders`                                                      | Delivered in MSR-6                          | Validated inquiry flow with no public account or implied selection.                                                                        |
| FIA Rallycross World Cup Indonesia 2026 | `/events/fia-rallycross-world-cup-indonesia-2026` or `/campaign/fia-rallycross-world-cup-indonesia-2026` | Existing dynamic campaign route can support | Campaign landing page with ticket CTA.                                                                                                     |
| News                                    | `/news`                                                                                                  | Revamped in MSR-5                           | CMS listing with recalibrated editorial hierarchy and media fallback.                                                                      |
| News detail                             | `/news/[slug]`                                                                                           | Revamped in MSR-5                           | CMS detail retained with resilient hero media and article hierarchy.                                                                       |
| Contact                                 | `/contact`                                                                                               | Revamped in MSR-5                           | Motorsport inquiry routing, including talent and merchandise categories.                                                                   |
| Gallery                                 | `/gallery`                                                                                               | Revamped in MSR-5                           | CMS-backed responsive mosaic with approved local media fallback.                                                                           |
| Merchandise                             | `/merchandise`                                                                                           | Added in MSR-5                              | Six-item CMS catalog with purpose-made product imagery, responsive 2–4 column desktop/tablet grid, explicit availability, and no checkout. |
| Ticket                                  | `/tickets`                                                                                               | Revamped in MSR-5                           | Approved redirect/deep-link hub with optional allowlisted embed.                                                                           |

## Homepage sections

The homepage should follow the new sitemap source:

1. Header/nav with centered desktop links and Ticket last.
2. Warm daylight/golden-hour carousel hero with a concise headline, one primary
   CTA, and compact pagination.
3. Draftline Blue calendar information band.
4. World of Motorsport discipline strip.
5. Upcoming Events and approved ticket path.
6. News.
7. Interactive Sarga content hub: dated publications, leadership, and ecosystem sites.
8. Editorial gallery wall.
9. Footer.

The existing homepage can retain richer supporting content only if it does not obscure the event-program focus. The previous Experience, Partners, and Newsletter modules can be moved lower, reduced, or folded into About/Footer.

MSR-4 implements this sequence as Header, cinematic Hero, a compact Draftline
Blue calendar transition, Upcoming Events with the approved ticketing path,
News, Gallery mosaic, and Footer. The previous homepage-only Brand Story,
Experience, Partners, and Newsletter modules were removed from `/`; their
existing dedicated routes and reusable components remain available pending the
MSR-5/MSR-8 content and retention decisions. Homepage hero and section copy are
read from the Motorsport `site-page` home record, while events, news, gallery,
and ticket data stay in their shared site-scoped collections.

A stakeholder-directed visual-reference alignment on 2026-08-09 adds the
five-column World of Motorsport strip, a CMS-backed Sarga content hub, and a
taller four-column gallery wall. The content hub keeps the reference's left
navigation and vertical rail while making all three panels functional:
published News records ordered by date, shared Leadership records, and active
Site directory records. These translate the supplied Look & Feel layouts into
the Motorsport system without copying third-party series logos or changing the
approved CMS/event/ticket contracts.

The subsequent MSR-RD1 audit corrects the surface and hero balance: the
homepage must no longer treat black as the universal canvas, and the hero must
remove Session Data and synthetic feed labels. See
`10_warm_visual_redesign_audit.md`. The MSR-RD2 foundation is approved;
implementation remains MSR-RD3 work.

## About page

Required sections:

- Profile.
- Vision.
- What We Do.
- Meet The Team.
- Contact Us.
- Part of Sarga.co.

The About page should explain Sarga Motorsport as part of the Sarga ecosystem while staying visually distinct from the Gateway.

The homepage content hub links leadership entries to `/about#team` and active
ecosystem entries to their configured public websites. Its History Timeline
panel is an editorial chronology sourced from published News records ordered by
`publishedDate`; each row links to `/news/[slug]`. The legacy shared Timeline
collection remains available for Gateway corporate-history uses and is not
duplicated into a Motorsport-only collection.

## Event hub

The event hub should lead with:

- Featured campaign: FIA Rallycross World Cup Indonesia 2026.
- Program card: Indonesia Junior Talent Cup.
- Upcoming event list.
- Ticket status and CTA.
- Discipline/taxonomy filter where useful.

The event hub should not feel like a generic event archive. It is a program gateway.

## Indonesia Junior Talent Cup pages

Use a persistent IJTC subnav:

```text
Overview
Race Schedule
Riders
Standings
About IJTC
Regulation
Become Riders
```

Required data:

- Program title and overview.
- Season/year.
- Schedule sessions/race rounds.
- Rider name, number, team, nationality/region, profile image, bio.
- Standings points and results.
- Regulation PDF file with version/date.
- Become Riders CTA linked to a CMS-managed form/inquiry.

Rider directory and profile behavior:

- `/riders` uses a responsive catalogue with no more than four columns and
  twelve entries (4×3) per client-side page.
- `/riders/[riderSlug]` is one reusable profile template populated by the
  selected published `motorsport-rider` record; cards and standings link to it.
- Rider portraits are optional at runtime. Missing or failed media uses an
  accessible numbered silhouette rather than a broken-image state.
- Standings reuse the rider relation for name, number, team, region, profile
  URL, and portrait so editors do not duplicate participant metadata.
- Schedule round labels, dates, venues, status, timing, description, and order
  are managed through the programme rundown component.

## FIA Rallycross campaign page

Required content:

- Campaign banner.
- Main headline: `First Time, Wild Action, Closer Than Ever`.
- Event title: `FIA Rallycross World Cup Indonesia 2026`.
- Date: `5-6 December 2026`.
- Venue: `Jakarta International E-Prix Circuit`.
- Primary CTA: `Get Your Ticket Now`.
- Banner slider.
- Rundown.
- Do and donts.
- Ticket CTA.

The page should feel like a high-energy campaign landing page, not a standard event detail page.

Implementation status (MSR-7, 2026-08-09):

- Delivered at `/campaign/fia-rallycross-world-cup-indonesia-2026` and added to
  the public sitemap.
- CMS fields drive the hero media, three campaign slides, five-session rundown,
  six spectator rules, ticket partner destination, and SEO/share metadata.
- The ticket surface accepts only the existing safe redirect/deep-link contract;
  an embed URL must pass the configured host allowlist and no internal checkout
  or payment flow is present.
- Frontend fallback content preserves the approved event facts during a CMS
  outage without changing the public route or page template.

## Merchandise page

Scope:

- Merchandise showcase only.
- CMS-managed products or product teasers.
- Partner redirect or inquiry CTA.

Out of scope:

- Internal cart.
- Checkout.
- Payment processing.
- Public user accounts.

MSR-5 delivers the public showcase with CMS-managed state and destination
handling. The page explicitly communicates that it is not an internal store.

## Ticket page

Scope:

- Event ticket cards.
- Approved partner redirects/deep links.
- Optional allowlisted embed.
- Ticket status and availability messaging.

Out of scope:

- Internal ticketing engine.
- Payment processing.
- Seat map logic unless provided by an approved partner embed.

MSR-5 keeps checkout external, validates redirect/deep-link destinations, and
renders an iframe only when its host is explicitly allowlisted.
