# 03 — Visual, Typography, and Layout Specification

## Visual direction

The Gateway should feel like the premium group-level expression of the entire
Sarga ecosystem: warm, confident, editorial, energetic, and clean. Retain the
existing black shell and brand colours, but use darkness as framing rather than
the default surface for every section.

## Palette

Primary reference tokens:

```css
--gateway-racing-red: #e4301c;
--gateway-midnight: #12141b;
--gateway-slate: #4b525b;
--gateway-silver: #c5c7ca;
--gateway-warm-white: #f7f3ed;
```

Existing compatible red/orange tokens may remain. New work should avoid small
colour variations that fragment the palette. Surfaces may use:

- Midnight or slate for navigation, footer, and focused cinematic moments.
- Warm neutral for editorial reading sections.
- Racing red/orange gradients for ecosystem emphasis and transition moments.
- Silver/soft grey for dividers, secondary metadata, and calm utility regions.

## Typography

### Typeface contract

- Display and headings: approved **Zalando Expanded ExtraBold**.
- Body, labels, navigation, forms, and metadata: **Plus Jakarta Sans**.
- Do not synthesize ExtraBold as the final production solution.
- GWR-2 bundles the official OFL-licensed Google Fonts variable file locally
  and renders display roles at the real `800` ExtraBold weight. No synthesized
  or network-fetched production font is used.

### Responsive scale

The PDF provides visual proportions rather than numeric CSS values. Use this
implementation scale and validate it visually against the reference:

| Role | Desktop | Tablet | Mobile | Line-height |
| --- | --- | --- | --- | --- |
| Hero display | 72–96 px | 56–72 px | 40–52 px | 0.90–0.96 |
| Page display | 56–76 px | 46–60 px | 36–46 px | 0.94–1.00 |
| Section title | 42–60 px | 36–48 px | 30–40 px | 0.98–1.06 |
| Card title | 22–32 px | 22–28 px | 20–26 px | 1.00–1.12 |
| Lead body | 18–21 px | 17–20 px | 16–18 px | 1.50–1.65 |
| Body | 16–18 px | 16–18 px | 15–17 px | 1.55–1.75 |

Rules:

- Use `clamp()` between tested endpoints, not viewport width alone.
- Cap hero lines at approximately 12–15 display characters where practical.
- Apply balanced wrapping to editorial headings and prevent orphaned one-word
  lines when the content permits.
- Never clip display type. Section containers must allow font ascenders,
  descenders, focus rings, and translated animation states.
- Avoid fixed heights around headings and copy.
- Validate headings at 320, 375, 768, 1024, 1280, 1440, and 1920 pixels.

## Layout system

- Maximum editorial container: 1440–1536 px depending on page context.
- Standard desktop gutters: 64–72 px; tablet: 32–40 px; mobile: 20 px.
- Major sections use generous vertical rhythm and visible changes of pace.
- Prefer one strong composition per section over nested card grids.
- Use asymmetry, diagonal crops, and controlled overlaps where they reinforce
  the Sarga brand. Do not tile racing geometry as wallpaper.
- Header text should be slightly larger than the current `0.68rem` treatment,
  remain centred as a group, and preserve Ticket Hub as the final action.

## Hero contract

- Warm daylight or golden-hour ecosystem imagery, with horse sport and
  motorsport represented as one group story where suitable.
- Text remains readable through directional overlays, not a uniformly heavy
  black veil.
- One eyebrow, one display statement, one concise paragraph, and one or two
  actions.
- Remove nonessential session/system data from the primary hero composition.
- Desktop and mobile use separately art-directed focal positions or assets.
- Motion must preserve a useful poster image and honour reduced-motion settings.

## Photography

- Warm, light, kinetic, and human; prioritise daylight, spectators, athletes,
  venues, motion blur, and real operational context.
- Avoid a library dominated by black backgrounds, isolated vehicles, or
  synthetic-looking night scenes.
- CMS assets require meaningful alt text and intended focal point/crop metadata
  where supported.
- PDF screenshots must never become production assets.

## Motion

- Motion supports hierarchy and speed; it never delays navigation or content.
- Use transform and opacity for reveals and directional light/diagonal accents.
- All essential content is visible without animation.
- `prefers-reduced-motion` receives stable static states.

## Page individuality

Shared tokens and shell do not mean identical pages. Each route should select a
purpose-built composition from a controlled template family: cinematic hero,
editorial split, timeline, report library, ecosystem capability page,
publication index, form page, or ticket discovery page.

## GWR-2 implementation status

Implemented on 2026-08-10. `globals.css` now defines primitive brand tokens,
semantic surface/type tokens, and display/body component classes. The shared
Hero, Interior Hero, Editorial Heading, and Section Container consume the
responsive scale. The desktop header uses a three-track grid so the complete
navigation group is geometrically centred; mobile keeps the same order and
Ticket Hub last. The footer uses the reference Slate Grey frame, compact
editorial hierarchy, managed publication paths, newsletter, and legal links.
