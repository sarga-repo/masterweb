# Motorsport vendor color-theme track

Date: 2026-08-16  
Status: Completed 2026-08-16.  
Scope: Sarga Motorsport frontend and Motorsport-owned CMS settings only.

## Decision

The corrected vendor PDF is a visual direction reference. It recommends a
deliberate mix of deep blue, warm light, charcoal, image-led, and crimson/orange
surfaces. It does not provide authoritative hex values, contrast ratios, or a
formal token table.

The implementation will therefore use an allowlisted CMS theme preset, not an
arbitrary color picker. A global preset supplies semantic tokens and existing
section-level themes (`default`, `dark`, `light`, `accent`) remain available for
the page compositions shown in the reference.

The following presets are proposed:

| Preset | Purpose |
| --- | --- |
| `current-motorsport` | Backward-compatible current visual system. |
| `vendor-editorial` | Warm cream/light editorial surfaces, Draftline Blue bands, charcoal timeline/footer, and crimson/orange accents. |
| `vendor-night` | Dark premium variant with blue, warm-white, and controlled crimson/orange accents. |

## `vendor-editorial` coverage contract

The `vendor-editorial` preset must cover the complete vendor proposal as a
theme/composition profile. It is not only a background-color swap:

| Vendor requirement | Required preset behavior |
| --- | --- |
| Deep navy/blue sections | Draftline Blue/navy section surface, warm-white display text, cyan supporting labels/metrics. |
| Warm cream/light sections | Warm cream canvas, blue display/headings, red or orange eyebrow and action accents, dark readable body text. |
| Charcoal/black editorial sections | Charcoal surface, warm-white display/body hierarchy, red/orange eyebrow and action accents. |
| Full-bleed photography | Preserve the existing full-bleed media slots and provide readable image scrim/overlay tokens without changing the selected media. |
| Crimson, orange, cyan, and yellow accents | Separate semantic accent tokens for actions, eyebrows, metrics, focus, active states, and indicator rails. |
| Blue information band | Warm-white heading/description, cyan or bright metric labels/values, bright separators. |
| Light-section typography | Owners Wide display/headings in blue; Noto Sans body/supporting copy; red/orange eyebrows. |
| Dark-section typography | Owners Wide display/headings in warm white; Noto Sans body/supporting copy; red/orange eyebrows. |
| Separators | Theme-controlled thin lines and optional color-block separators with contrast-safe values. |
| About page composition | Existing About layout keeps the image hero → blue information band → warm editorial content → dark timeline/footer sequence, with each stage receiving its matching preset surface and text tokens. |

This profile does not move, remove, or redesign the “Motion, Recorded” gallery
treatment. That remains outside this color/theme track.

## CMS ownership

Add a dedicated Motorsport settings Single Type (or the equivalent existing
Motorsport site-settings record) with a non-localized `themePreset` enum. It is
editable only by `Sarga Motorsport Admin` and Super Admin. Gateway, Horse Sport,
and Shared Library editors must not see or edit it.

The shared `Site.themeKey` remains a multisite identity field and must not be
reused as the visual theme selector.

## Theme precedence

`section theme override → page theme override (optional) → global Motorsport
preset → current default`.

Content, media selection, show/hide behavior, route paths, Preview, i18n, ticket
links, and RBAC behavior remain unchanged. Existing full-bleed media slots and
the About page section order are preserved; only their theme tokens and media
overlay treatment are selected by the preset.

## Delivery phases

| Phase | Deliverable | Exit gate |
| --- | --- | --- |
| `MSR-THEME-0` | Confirm vendor palette, preset names, and token mapping | Approved palette decision; no inferred colors treated as final |
| `MSR-THEME-1` | Semantic token inventory and CSS theme foundation | Existing `current-motorsport` visual regression passes |
| `MSR-THEME-2` | Motorsport CMS theme settings and RBAC | Admin can select only approved presets; other site roles cannot access it |
| `MSR-THEME-3` | Frontend theme resolver, Preview/live loading, and cache invalidation | Draft and published theme selections render deterministically |
| `MSR-THEME-4` | Vendor Editorial and Vendor Night preset implementation | Desktop/mobile visual and contrast checks pass |
| `MSR-THEME-5` | Full UAT and editor handover | All Motorsport routes, locales, Preview, live, and rollback checks pass |

## Non-goals

- No layout relocation or removal of “Motion, Recorded”.
- No Gateway or Horse Sport theme changes.
- No arbitrary CSS entered by editors.
- No new CMS instance, payment flow, route model, or content migration.

## Source assumptions

Before `MSR-THEME-0` is executed, the vendor must confirm exact color values
and whether the PDF's warm light surface is cream, beige, or another approved
brand color. Existing Motorsport brand tokens remain the safe fallback.
