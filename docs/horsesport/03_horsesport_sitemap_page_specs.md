# 03 — Horse Sport Sitemap and Page Specifications

## Recommended local and production URLs

- Local: `http://localhost:3002`
- Production target: `https://horsesport.sarga.co` or the domain approved by the business

## Sitemap

```text
/
/about
/events
/events/[slug]
/tickets
/news
/news/[slug]
/gallery
/venues
/stable-life
/partners
/contact
/campaigns/[slug]
```

## Global navigation

Recommended nav items:

1. Home
2. About
3. Events
4. Tickets
5. News
6. Gallery
7. Venues
8. Contact

Secondary links:

- Back to Sarga.co
- Sarga Motorsport
- Partnership inquiry

## Homepage

Purpose: Immersive Horse Sport landing page.

Sections:

1. Hero
   - Horse Sport logo
   - Cinematic hero image/video
   - Premium headline
   - Primary CTA: Explore Events / Buy Tickets
   - Secondary CTA: Discover Horse Sport
2. Race-day highlights
   - Upcoming event
   - Ticket CTA
   - Venue/turf highlight
3. About Sarga Horse Sport
   - Short positioning statement
   - Brand story excerpt
4. Championship ecosystem
   - Derby / Turf / Stable / Hospitality / Media
5. Featured events
6. News & publications
7. Gallery preview
8. Partners/sponsors strip
9. Newsletter/contact CTA
10. Footer

## About page

Purpose: Explain Horse Sport positioning and standards.

Sections:

- Hero statement
- Brand story
- Sport standards / compliance
- Race organization capability
- Venue/turf development
- Hospitality and lifestyle
- Leadership / operations teaser if CMS content exists

## Events listing

Purpose: Show Horse Sport-specific events.

Filters:

- Upcoming
- Live
- Past
- Derby
- Turf
- Exhibition
- Hospitality

Event card data:

- Title
- Date/time
- Venue
- Hero image
- Status
- Ticket availability
- CTA

## Event detail

Sections:

- Hero with event media
- Date, venue, status
- Ticket CTA
- Race schedule
- Event description
- Venue information
- Hospitality info
- Related news/gallery
- SEO metadata

## Ticket page

Purpose: Horse Sport-focused ticket hub.

Rules:

- Do not build internal checkout.
- Show CMS-managed partner links/deep links.
- Optional iframe embed only if configured and allowlisted.
- Show active, upcoming, and sold-out states.

## News listing and detail

Horse Sport news categories:

- Race Results
- Event Announcements
- Turf & Venue
- Stable Life
- Jockey Stories
- Equine Performance
- Partnerships

News detail should support:

- Large editorial hero
- Author/date/category
- Rich content blocks
- Related events/tickets
- Related gallery
- Canonical URL

## Gallery

Purpose: Visual storytelling for race day, stable life, venue, and community.

Fields:

- Gallery title
- Description
- Media grid
- Category
- Related event

## Venues page

Purpose: Highlight tracks, turf, stable, and hospitality facilities.

Sections:

- Venue hero
- Turf/track story
- Facilities grid
- Location/transport placeholder
- Related events

## Stable Life page

Purpose: Editorial lifestyle section covering horses, jockeys, training, veterinary care, and race-day preparation.

This page can later become a content hub if editorial volume grows.

## Partners page

Purpose: Sponsorship and strategic partnership landing page.

Sections:

- Partnership proposition
- Sponsor logos
- Partnership categories
- Inquiry form CTA

## Contact page

Purpose: Handle general, ticketing, partnership, media, and sponsorship inquiries.

Use shared form infrastructure but brand styling must follow Horse Sport.
