# MSR-CMS-BAND-1 — Information-band consistency and metric visibility

Status: implemented 2026-08-16

## Purpose

Every public Motorsport page must have one post-hero information band. The band
is a blue, high-contrast signal panel and is the canonical place for the small
right-hand metric group (normally three label/value pairs). The CMS controls the
band copy, activation, metric values, and whether the metric group is rendered.

## Contract

Dedicated Motorsport Single Types expose the `informationBand` component:

- `isActive` controls the complete band.
- `eyebrow`, `title`, and `description` control the band copy.
- `showMetricGroup` controls the complete right-hand metric group, including
  its separators. When false, no metric markup is rendered.
- `metrics` contains up to three active label/value records.

The frontend maps the component through `mapMotorsportInformationBand` and
populates `informationBand.metrics` explicitly. If a legacy page section is
still present during migration, it supplies copy and metric fallbacks only;
the dedicated `informationBand` takes precedence when available.

## Route coverage

The canonical band is now rendered or consumed on:

- Homepage, About, Events, News, Gallery, Merchandise, Tickets, Contact,
  Partners, and Experience.
- Motorsport event detail and news article detail templates.
- FIA Rallycross campaign template.
- IJTC overview, About, schedule, riders, rider profile, standings,
  regulation, and become-riders templates. These inherit the IJTC programme
  `motorsportPresentation.informationBand` when configured and keep their
  existing copy as a safe fallback.

News retains `newsControlSection` as its legacy named section, but its visible
blue control band now uses the same canonical information-band adapter. This
prevents the CMS `showMetricGroup` flag from being bypassed by hard-coded
Stories/Lead/Feed metrics.

## Editor workflow

1. Open the dedicated Motorsport Single Type or Motorsport Program record.
2. Expand `informationBand` (or `motorsportPresentation → informationBand` for
   a detail/programme record).
3. Set `isActive` to show or hide the complete band.
4. Edit the localized copy and up to three metric records.
5. Set `showMetricGroup` to false when the right-side metrics and separators
   should be omitted.
6. Save, publish the locale, and verify the matching public route and Preview.

## Validation requirements

- Test English and Indonesian records independently.
- Test `isActive=false` and confirm the entire band is absent.
- Test `showMetricGroup=false` and confirm the band copy remains while the
  metrics and separators are absent.
- Test an empty/unavailable CMS response and confirm the route remains usable
  through its existing safe fallback.
- Confirm no page renders a second competing blue band for the same section.
