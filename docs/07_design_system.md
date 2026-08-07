# 07 — Design System

## Design direction

Page 7 of the preview PDF defines the Sarga brand foundation. The production website should use this foundation to create its own premium digital design rather than reconstruct the page examples elsewhere in the PDF.

Core brand signals:

- Dark/black premium header and footer
- Strong red/orange accent
- Large uppercase typography
- High-impact motion/energy imagery
- Racing diagonal/checkered motif
- Zalando Sans Expanded for display typography
- Plus Jakarta Sans for body and interface typography
- Cinematic imagery that connects horse sport, motorsport, live events, venues, media, and technology

The sample pages demonstrate one valid visual treatment, but their card shapes, section order, split layouts, hero composition, navigation treatment, and footer arrangement are not design requirements.

## Creative north star

The Sarga experience should feel like a confident international sports and entertainment platform: cinematic, editorial, fast, tactile, and precise. Use asymmetric grids, layered media, controlled scale shifts, strong negative space, purposeful transitions, and selective moments of spectacle. Avoid generic corporate templates, excessive dashboard-like cards, arbitrary glass effects, decoration without meaning, and visual density that weakens navigation.

Every major creative decision should improve at least one of these outcomes:

1. Clarify Sarga's group-gateway role.
2. Make ecosystem discovery more intuitive.
3. Increase the emotional impact of sport and entertainment content.
4. Strengthen a primary CTA or content journey.
5. Improve responsive storytelling or accessibility.

## Design principles

1. Original rather than derivative
2. Premium sports holding company
3. Energetic but not cluttered
4. Strong gateway navigation
5. Mobile-first and breakpoint-specific composition
6. Easy CMS content scaling
7. High contrast and accessible UI
8. Purposeful, performant motion

## Color tokens

These tokens follow the Sarga.co column in page 7 of the visual reference PDF.

```css
--color-black: #000b1d;
--color-dark: #07111f;
--color-dark-soft: #434343;
--color-white: #ffffff;
--color-light: #f3f3f3;
--color-muted: #cccccc;
--color-text: #000b1d;
--color-text-muted: #434343;
--color-red: #e2321e;
--color-orange: #ff5032;
--color-pink: #f4c3bd;
--color-gold: #d9a441;
--color-border: #d9d9d9;
```

## Typography

Brand typefaces from visual reference page 7:

- Display and heading: Zalando Sans Expanded
- Body and interface: Plus Jakarta Sans
- Use uppercase headings for hero and major section titles
- Use generous letter spacing for labels/eyebrows

Suggested CSS tokens:

```css
--font-heading:
  "Zalando Sans Expanded", "Plus Jakarta Sans", system-ui, sans-serif;
--font-body: "Plus Jakarta Sans", system-ui, sans-serif;
```

## Layout tokens

```css
--container-max: 1440px;
--container-padding-desktop: 72px;
--container-padding-tablet: 40px;
--container-padding-mobile: 20px;

--radius-sm: 8px;
--radius-md: 16px;
--radius-lg: 28px;
--radius-pill: 999px;
```

## Component inventory

The inventory describes reusable capabilities, not a requirement that every section appear as a conventional boxed component. Components may support editorial, full-bleed, layered, sticky, horizontal, or immersive variants as long as their content contract remains maintainable.

### Layout

- Header
- Mobile drawer navigation
- Footer
- Section container
- Split layout
- Grid layout

### UI

- Button
- Icon button
- Pill tab
- Badge
- Card
- Input
- Textarea
- Select
- Form message
- Breadcrumb
- Pagination/load more

### Sections

- HeroSection
- AboutPreview
- TimelineSection
- EcosystemSection
- EcosystemCard
- NewsGrid
- TicketHubSection
- NewsletterSection
- ContactSection
- CTASection

## Button styles

### Primary

- Red/orange fill
- White text
- Shape may be pill, soft-rectangular, or contextually integrated, provided the system remains consistent
- Arrow icon

### Secondary

- Transparent/dark or transparent/light
- Border
- Rounded pill

## Image treatment

- Use large cinematic imagery with a sense of speed, atmosphere, human scale, competition, or event energy
- Favor decisive crops, layered sequences, diptychs, or editorial framing over generic stock-photo cards
- Apply overlay gradients for text readability
- Use motion blur/energy imagery where possible
- Art-direct focal points independently for desktop and mobile
- Do not extract or reuse screenshots from the preview PDF as production imagery
- Ensure alt text is CMS-managed
- Avoid loading oversized images

## Graphic language

- Treat the Sarga racing motif as a flexible brand device, not a fixed page template.
- It may be enlarged, cropped, masked, layered with photography, used as a transition, or animated subtly.
- Preserve its recognizable diagonal rhythm and progressive energy.
- Avoid applying it to every section or tiling it as wallpaper.
- Build supporting graphics from the same geometry and color logic so the system can expand without becoming repetitive.

## Motion and interaction

- Use motion to reveal hierarchy, connect sections, communicate direction, or reinforce speed and energy.
- Keep navigation and primary actions immediate; animation must never delay essential interaction.
- Prefer transform and opacity animation and test on mid-range mobile hardware.
- Honor `prefers-reduced-motion` with equivalent static states.
- Use hover effects as enhancement only; all meaning and functionality must remain available on touch and keyboard input.

## Responsive behavior

### Desktop

- Full navigation visible
- Large hero title
- May use layered, editorial, sticky, or horizontal compositions where suitable

### Tablet

- Recompose layout intentionally rather than simply shrinking desktop
- Navigation may remain or become drawer depending width

### Mobile

- Hamburger menu
- Hero imagery and typography receive mobile-specific crops and scale
- Content may stack, swipe, or progressively disclose according to the interaction model
- Tabs horizontally scrollable
- CTA buttons stack if needed

## Accessibility notes

- Red/orange text on dark background is acceptable only if contrast passes
- Do not rely on color only for selected tabs
- Provide focus states
- Maintain readable font sizes on mobile

## Logo assets

The package includes the official Sarga logo files in `assets/brand/logos/`:

- `logo-sarga.png` for light or neutral backgrounds.
- `logo-sarga-reverse.png` for dark backgrounds, including header, hero overlays, and footer.

Implementation guidance:

- Keep original aspect ratio.
- Use CSS sizing instead of editing image dimensions.
- Create a reusable `Logo` component with `variant="default" | "reverse"`.
- Use `logo-sarga-reverse.png` for the main dark navigation shown in the preview direction.
- Add alt text: `Sarga.co`.
