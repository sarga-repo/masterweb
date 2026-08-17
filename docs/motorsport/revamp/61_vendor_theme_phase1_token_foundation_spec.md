# MSR-THEME-1 — Semantic theme-token foundation

Status: Completed 2026-08-16  
Scope: Motorsport frontend styling only.

## Contract

Create semantic tokens for canvas, raised surfaces, section surfaces, primary
and muted text, borders, action colors, focus color, gradients, and navigation.
Each preset must resolve the same token names so components do not contain
preset-specific conditionals.

The minimum semantic token set must include:

- `surface.navy`, `surface.warm`, `surface.charcoal`, and image-overlay/scrim
  values for full-bleed photography.
- `text.onNavy`, `text.onWarm`, `text.onCharcoal`, and muted/supporting variants.
- `accent.crimson`, `accent.orange`, `accent.cyan`, and `accent.yellow`.
- `separator.line`, `separator.block`, and information-band metric values.
- `typography.display` mapped to Owners Wide and `typography.body` mapped to
  Noto Sans.

The `vendor-editorial` mapping must explicitly support the vendor sequence:
image hero, blue information band, warm editorial section, and dark
timeline/footer. It must also support the blue-band rule (warm-white copy with
cyan/bright metrics), light-section rule (blue headings with red/orange
eyebrows), and dark-section rule (warm-white headings with red/orange
eyebrows).

Preserve the existing `current-motorsport` values first. Add vendor presets
only after the phase-0 palette decision. Existing section theme values remain
valid and map to semantic tokens.

## Exit criteria

- No component relies on a hard-coded preset color for normal rendering.
- Current theme has no intentional visual regression.
- A token coverage review confirms deep blue, warm light, charcoal, full-bleed
  media overlays, all four accent colors, typography, separators, and the About
  page surface sequence are represented.
- Reduced-motion, focus, and contrast behavior remain intact.

## Completion record

- Added the semantic token contract and allowlisted theme selectors to the
  Motorsport global stylesheet.
- Added `current-motorsport`, `vendor-editorial`, and `vendor-night` mappings
  for navy, warm, charcoal, scrim, accents, separators, and typography aliases.
- Preserved the existing `current-motorsport` defaults and page geometry.
- Validation: Motorsport lint, TypeScript, production build, and whitespace
  checks passed.
