# Rallycross campaign visibility wiring

Status: implemented 2026-08-21

## Scope

This phase covers the FIA Rallycross campaign route:

`/events/fia-rallycross-world-cup-indonesia-2026`

It closes the gap between the nested Motorsport Program presentation fields in
Strapi and the rendered campaign page. The nested presentation values are now
the preferred source; legacy route/page values remain fallbacks for older
records.

## Visibility contract

### Campaign hero

The route reads `Motorsport Program → motorsportPresentation → hero`:

- `isActive` hides the complete hero when `false`.
- `showEyebrow`, `showTitle`, and `showDescription` control their matching
  text elements.
- `showMedia` controls the background media layer.
- `backgroundMedia` is preferred over the legacy root `heroMedia`.

### Information band

The route reads `motorsportPresentation → informationBand` when present. If a
legacy `world-cup-control` presentation section supplies the band, its
`enabled`, `showEyebrow`, `showTitle`, and `showDescription` values are used as
the fallback controls. `showMetricGroup` controls the right-side metrics.

### Supporting sections

`presentationSections` from the programme are evaluated before legacy Site
Page sections. For the named Rallycross sections, `isActive` now gates the
whole section:

- `format`
- `rundown`
- `race-day-guide`
- `campaign-ticket`

The section-level `showIndex`, `showEyebrow`, `showTitle`, and `showBody`
values are passed to the shared section header. A disabled section is not
rendered, including its cards or ticket panel.

## Root cause of the reported mismatch

The campaign route previously rendered the legacy `campaign.summary` directly
and did not pass the nested hero visibility flags to `PageHero`. Consequently,
setting `motorsportPresentation → hero → showDescription` to `false` had no
effect. The route now passes the nested hero description and its flag, so a
saved `false` value removes that text from the hero while leaving the separate
information-band description unaffected.

## Verification

- CMS API read confirmed `hero.showDescription: false` for the Rallycross
  programme.
- Docker-backed browser reload of the canonical route confirmed the hero
  description is absent while the hero title, media, and actions remain.
- Motorsport TypeScript check passed.
- Motorsport ESLint passed with only two pre-existing unused-variable warnings.

## Editor note

The campaign carousel slide schema currently has no per-slide `isActive` flag;
removing a slide from `bannerSlides` is the supported visibility control. A
per-slide toggle can be added later if editorial requirements need it.
