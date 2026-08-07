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
```

### Layout

- Max content width: 1440px.
- Section horizontal padding: responsive clamp.
- Large editorial hero spacing.
- Cards may use slanted corners, borders, and gradient overlays.

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

## Interaction design

Use tasteful interactions:

- CTA hover glow or slide arrow.
- Image scale/blur reveal on cards.
- Active nav underline with crimson/orange line.
- Section entrance animations if performance-safe.
- Avoid excessive animation that hurts accessibility.

Respect reduced motion preferences.

## Accessibility

- Keep text contrast high.
- Do not rely on color only for status.
- Use semantic headings.
- Use descriptive alt text fields from CMS.
- Ensure all interactive elements are keyboard accessible.

## Visual do/don't

Do:

- use dark premium compositions;
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
