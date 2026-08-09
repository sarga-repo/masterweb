# Sarga Motorsport Design System

## Principle

The Sarga Motorsport frontend must be visually independent from the Sarga.co gateway while staying inside the Sarga group ecosystem.

Design qualities:

- cinematic
- fast
- premium
- international
- editorial
- high contrast
- warm and clean
- motion-driven
- accessible

## Tokens

### Colors

```css
--ms-apex-crimson: #E8192C;
--ms-ignition-orange: #FF6B00;
--ms-electric-yellow: #F5C800;
--ms-slipstream-teal: #00C4CC;
--ms-draftline-blue: #0033A0;
--ms-charcoal: #1B1B1B;
--ms-warm-white: #FFF9EE;
--ms-black: #050505;
```

### Typography

```css
--font-display: "Owners Wide", "Arial Black", "Impact", sans-serif;
--font-body: "Noto Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

--ms-type-hero: clamp(3rem, 5.8vw, 5.75rem);
--ms-type-page: clamp(2.5rem, 3.8vw, 4rem);
--ms-type-section: clamp(2rem, 2.9vw, 3rem);
--ms-type-article: clamp(2.5rem, 4.4vw, 4.75rem);
--ms-type-feature: clamp(1.75rem, 2.5vw, 2.75rem);
--ms-type-card: clamp(1.25rem, 1.8vw, 2rem);
```

Heading tiers are semantic and shared across routes:

- `ms-heading-hero`: homepage and campaign-only cinematic statements.
- `ms-heading-page`: standard interior page H1.
- `ms-heading-section`: primary H2 and information-band headings.
- `ms-heading-article`: long-form article H1.
- `ms-heading-feature`: featured cards and compact supporting sections.
- `ms-heading-card`: card and item titles.

Do not add page-local heading `clamp()` values when one of these tiers applies.
This keeps the wide display face controlled on desktop and consistent across
About, Events, News, Gallery, Merchandise, Tickets, Contact, and detail pages.

The values above are the approved MSR-RD2 implementation contract; the public
CSS still uses the earlier MSR-3 values until MSR-RD3. Owners Wide Black must
be declared as weight 900 only. Hero/page/section line heights are respectively
0.95/0.98/1.00, and heading wrappers must provide visible overflow and at
least 0.08em block breathing room so no glyph is clipped.

The complete primitive → semantic → component handoff is
`docs/motorsport/revamp/11_redesign_foundations.tokens.json`. Components use
semantic surface/text roles and a `light|subtle|dark|blue|image` tone contract
instead of embedding foreground colors.

### Layout

- Max content width: 1440px.
- Section horizontal padding: responsive clamp.
- Large editorial hero spacing.
- Use Warm White editorial fields, Draftline Blue structural bands, image-led
  sections, and selected charcoal immersive modules.
- Cards may use slanted corners, borders, and gradient overlays only where they
  reinforce the composition; do not apply them as a universal motif.

## Components

Required components:

- MotorsportHeader
- MotorsportFooter
- MotorsportHero
- EventFeatureCard
- EventListCard
- TicketCtaPanel
- NewsCard
- ExperiencePillarCard
- PartnerLogoStrip
- GalleryRail
- CountdownBadge
- StatusChip
- SectionHeader
- GradientRule

### MSR-3 recalibrated primitives

The revamp implementation keeps the established component set and adds the
following reusable primitives for MSR-4 through MSR-7:

- `InformationBand` for Draftline Blue editorial/data bands.
- `DisciplineGrid` and `DisciplineTile` for image-led racing categories.
- `CampaignBannerSlider` for campaign storytelling with manual, accessible
  controls and no autoplay dependency.
- `GalleryMosaic` for deliberate uneven image rhythm without layout shift.
- `ScheduleCard` and `StandingsTable` for program dates, results, and tabular
  points data.
- `RegulationDownloadPanel` for labeled regulation-file downloads.
- `EventProgramSubnav` for sticky, horizontally scrollable program navigation.
- `SargaTimeline` for the interactive homepage content hub: vertical tabs,
  live panel scroll progress, publication rows, leadership profiles, and
  ecosystem-site destinations.

The content-hub rail is functional, not ornamental. Its active marker follows
the scroll position of the right-hand panel; the tablist supports pointer and
Arrow Up/Arrow Down keyboard navigation, and all content rows are links.

### Merchandise catalog

- Use product-specific studio photography; never substitute race-car imagery
  for apparel, drinkware, or accessories.
- Keep catalog images on a consistent portrait 4:5 crop with clean warm-neutral
  studio lighting and controlled Sarga Motorsport brand accents.
- The showcase grid uses one column on narrow phones, two columns from the
  small/tablet breakpoint, three at large, and a maximum of four on wide
  screens.
- Product availability and outbound/inquiry actions remain CMS-managed; the
  public frontend does not provide cart, account, checkout, or payment flows.

The shared navigation order now lives in `frontend-motorsport/src/lib/navigation.ts`
and follows the target IA: Home, About, Event, News, Gallery, Merchandise,
Contact, and Ticket. Ticket is presented as the compact final primary navigation
action; the Sarga.co gateway link remains a separate utility link.

Global utilities in `frontend-motorsport/src/app/globals.css` provide the
recalibrated hero/section/card type scale, readable body measure, Draftline Blue
band treatment, tabular-number tables, and accessible horizontal overflow.
These primitives were assembled in MSR-4 and MSR-5. Their surface assumptions
must be recalibrated through MSR-RD2 through MSR-RD5; see
`docs/motorsport/revamp/10_warm_visual_redesign_audit.md`.

## Interaction design

Use tasteful interactions:

- CTA hover glow or slide arrow.
- Image scale/blur reveal on cards.
- Active nav underline with crimson/orange line.
- Section entrance animations if performance-safe.
- Avoid excessive animation that hurts accessibility.

Respect reduced motion preferences.

The MSR-3 campaign control and image treatments use CSS transitions only and
are covered by the existing `prefers-reduced-motion` override. No autoplay,
heavy 3D, frame sequence, or paid UI dependency was introduced.

## Accessibility

- Keep text contrast high.
- Do not rely on color only for status.
- Use semantic headings.
- Use descriptive alt text fields from CMS.
- Ensure all interactive elements are keyboard accessible.

## Visual do/don't

Do:

- use warm editorial compositions with controlled dark premium moments;
- use speed/motion imagery;
- use bold wide headlines;
- use branded accent colors purposefully;
- use international motorsport editorial references.
- represent both four-wheel and two-wheel racing in hero, card, gallery, and
  event-media examples;
- preserve motorcycle rider posture, lean angle, protective gear, and machine
  proportions when cropping responsive images.

Do not:

- copy Sarga.co gateway section layouts directly;
- overload every section with gradients;
- use low-quality or generic car/motorcycle stock imagery;
- make the visual system read as car-only through repetitive vehicle selection;
- hardcode content expected from CMS;
- embed the brand playbook PDF as an image in the website.
