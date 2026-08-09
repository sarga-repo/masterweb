# 02 - Brand And Layout Direction

## Positioning

Sarga Motorsport should feel like a premium international motorsport media and
event platform. The Look & Feel PDF is the visual source of truth: use a warm,
clean editorial balance with daylight photography, Warm White layouts,
Draftline Blue bands, and selected dark immersive moments.

Design target:

- Warm editorial racing platform with controlled dark moments.
- International FIA-style event credibility.
- Image-led layout with large racing moments.
- Clear event-program structure.
- Premium, intense, fast, and disciplined.

## Color system

Use the Motorsport palette from the Look & Feel and brand playbook:

| Token | Hex | Usage |
|---|---:|---|
| Apex Crimson | `#E8192C` | Primary action, active nav, event urgency, hero accent. |
| Ignition Orange | `#FF6B00` | Secondary action, gradients, heat marks, motion lines. |
| Electric Yellow | `#F5C800` | Status highlights, rankings, schedule markers, limited use. |
| Slipstream Teal | `#00C4CC` | Discipline tags, data accents, hover highlights, limited use. |
| Draftline Blue | `#0033A0` | Information bands, taxonomy tiles, structured sections. |
| Charcoal Black | `#1B1B1B` | Header, footer, gallery, timeline, and selected immersive panels. |
| Warm White | `#FFF9EE` | Primary editorial surface and text on dark surfaces. |

Do not let the page become a single red/orange theme. Draftline Blue and Warm White are important for the Look & Feel deck's international sports federation tone.

Do not let black become the universal surface. Every component must support
light and dark semantic foreground, border, control, and focus states.

## Typography

- Display: Owners Wide, using approved local/licensed font file when available.
- Body: Noto Sans.
- UI labels: Noto Sans with uppercase, small caps, and strong weight.

Usage:

- Hero H1 should be editorial but restrained enough for common laptop and
  mobile viewports.
- Page titles should use Owners Wide or the approved wide fallback.
- Standard interior page titles and section headings must use the shared
  `ms-heading-page` and `ms-heading-section` tiers; avoid route-specific size
  overrides that make the display face dominate the composition.
- Body copy should stay readable and not exceed comfortable line length.
- Racing data, dates, standings, schedule, and point tables should use tabular numerals.
- Owners Wide headings require safe line-height and padding; no glyph may be
  visually clipped, including at 200% zoom.

## Layout grammar from the PDF

Use these patterns:

- Full-width warm daylight/golden-hour carousel hero with a compact dark top nav.
- Logo left, navigation center/right, ticket CTA as a clear pill or compact action.
- Strong horizontal information bands, especially Draftline Blue.
- Image mosaic/gallery layouts with uneven but deliberate rhythm.
- Discipline tiles for Circuit Racing, Endurance, Rally, Rallycross, Touring, and future categories.
- Large event campaign cards that feel like editorial posters.
- Small metadata labels and technical details below the hero where useful, but
  not dense dashboard UI inside the hero.

Avoid:

- Generic three-card marketing rows as the main visual rhythm.
- Overly rounded or soft SaaS-style cards.
- Purple/blue AI gradients unrelated to Motorsport.
- Copying the Gateway layout.
- Making the brand feel like only Formula racing.
- Treating black or graphite as the default for every page, card, and form.
- Filling the homepage hero with session panels, synthetic feed labels, or
  multiple competing actions.

## Photography direction

Required image mix:

- Rally and off-road racing.
- Circuit racing and formula-style racing.
- Motorcycle racing.
- Driver, rider, helmet, cockpit, and paddock closeups.
- Grandstand/crowd energy.
- Podium, press, and media moments.
- Scenic road or track environments.
- Event campaign graphics and official FIA Rallycross-style assets when approved.

Every page should have intentional image ownership. Prioritize warm daylight,
golden-hour highlights, lifted shadow detail, natural color, people, crowds,
paddocks, and environmental context. If an image is decorative, it should still
support the page's story.

Use only Sarga-owned, appropriately licensed, or original generated imagery.
Do not reproduce third-party competition marks, liveries, or reference photos.

## Motion and interaction

Use premium motion only where it improves comprehension or memorability:

- Hero image/video reveal.
- Scroll-driven gallery or campaign reveal.
- Hover states on discipline tiles and event cards.
- Sticky event subnavigation for IJTC and FIA Rallycross.
- Reduced-motion fallback for all continuous animation.

Do not add heavy 3D or frame-sequence work as part of this revamp unless explicitly approved for a later phase. The existing 3D/F1 concept remains separate from this documentation phase.

## Responsive rules

- Mobile nav must be simple and reliable.
- Hero copy must not overlap the logo, nav, or CTAs.
- Event subpages must prioritize schedule, ticket CTA, and key event metadata on mobile.
- Tables for standings/results should have responsive layouts, sticky headers where appropriate, and accessible labels.
- Gallery and campaign pages should use real imagery but avoid layout shifts while assets load.

## MSR-3 implementation mapping

The design-system recalibration implements this direction as reusable frontend
building blocks rather than rebuilding pages early. The target IA is now
centralized, the desktop header uses the compact navigation and ticket action,
and the mobile menu preserves the same order without horizontal overflow.
Draftline Blue bands, poster-like discipline tiles, uneven gallery mosaics,
campaign banners, program subnavigation, schedules, standings, and regulation
downloads are available for the subsequent page phases. Owners Wide and Noto
Sans remain the licensed/local targets with the existing production-safe
fallback stack.

## MSR-RD1 correction after visual audit

The original MSR-3 direction over-weighted the phrase "dark premium" and
under-weighted the source preview's Warm White layouts, daylight imagery, and
clean editorial spacing. The corrective source audit and staged implementation
plan are documented in `10_warm_visual_redesign_audit.md`. MSR-RD2 defines the
paired light/dark token and page-template contract; MSR-RD3 must implement it
before later public pages are redesigned.
