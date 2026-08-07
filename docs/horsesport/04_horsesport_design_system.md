# 04 — Horse Sport Design System

## Design principle

Create a dedicated premium equestrian sports UI. The interface should feel international, editorial, cinematic, and refined. It should be recognizably part of the Sarga ecosystem but not visually identical to the gateway or Motorsport site.

## Visual keywords

- Elite equestrian championship
- Race-day spectacle
- Warm cinematic motion
- Turf, stable, saddle, track, grandstand
- Premium hospitality
- Disciplined athleticism
- Editorial sport magazine

## Color tokens

```css
:root {
  --hs-red: #ED1B2F;
  --hs-orange: #FF6B00;
  --hs-black: #050505;
  --hs-night: #0B0B0D;
  --hs-cream: #FFF8E8;
  --hs-sand: #E8D9A8;
  --hs-brown: #7A3B2E;
  --hs-turf: #8CA89A;
  --hs-white: #FFFFFF;
  --hs-muted: #8B8580;
}
```

## Typography tokens

```css
:root {
  --font-hs-display: var(--font-display), 'Arial Black', 'Impact', sans-serif;
  --font-hs-body: var(--font-body), 'Noto Sans', 'Plus Jakarta Sans', system-ui, sans-serif;
}
```

Usage:

- Display headlines: uppercase, tight tracking, high weight
- Section labels: small uppercase, red/orange accent
- Body: readable, balanced line-height, not too condensed
- Numbers/dates: sport-program style, medium weight

## Layout system

- Max content width: `1200–1320px`
- Hero can use full-bleed media
- Use alternating dark cinematic sections and warm cream editorial sections
- Use large image-led cards
- Prioritize visual hierarchy over dense text
- Keep mobile-first structure

## Component list

Required components:

- `HorseSportHeader`
- `HorseSportFooter`
- `HeroRaceSection`
- `RaceEventCard`
- `NewsArticleCard`
- `TicketCtaPanel`
- `VenueHighlightCard`
- `StableLifeCard`
- `GalleryMosaic`
- `PartnerLogoStrip`
- `NewsletterBand`
- `CrossSiteEcosystemLinks`
- `Breadcrumbs`
- `SeoJsonLd`

## Header

- Use white logo on dark hero/header.
- Sticky or translucent header is allowed if performance and accessibility remain good.
- Include a clear “Tickets” CTA.
- Include “Sarga.co” link in secondary nav or footer.

## Hero section

Recommended layout:

- Full-bleed cinematic race image/video
- Dark gradient overlay from left/bottom
- Large editorial headline
- Short body text
- Two CTAs
- Optional stat strip for upcoming events / horses / venue / spectators

Avoid:

- Flat corporate layout
- Too many cards above the fold
- Generic horse stock imagery

## Cards

Event/news cards should use:

- Strong image crop
- Red/orange category label
- Date and venue metadata
- Warm cream or dark card body
- Subtle diagonal/slash detail

## Motion and interaction

Use subtle motion only:

- Image parallax or scale on hover
- Card elevation/glow
- CTA arrow movement
- Tab/section transitions

Avoid heavy animations that harm performance or accessibility.

## Accessibility

- Maintain AA contrast.
- Provide alt text for all CMS media.
- Avoid text embedded in images.
- Respect reduced-motion preferences.
- Ensure keyboard navigation and visible focus states.

## Image treatment

Recommended overlay treatments:

- Dark-to-transparent gradient
- Warm red/orange light wash
- Subtle dotted racing/equestrian texture
- Diagonal slash graphic from logo

## Responsive behavior

- Desktop: cinematic split layouts and editorial grid
- Tablet: 2-column cards
- Mobile: single-column, large tap targets, compressed nav drawer

## Design QA checklist

- Does it feel like a dedicated premium Horse Sport brand, not only a gateway page?
- Is the logo readable on header/footer?
- Are CTAs clear and conversion-oriented?
- Do images feel cinematic and equestrian-specific?
- Are news/events/tickets scoped correctly?
- Does the site remain fast on mobile?
