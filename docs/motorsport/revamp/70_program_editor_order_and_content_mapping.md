# Motorsport Program CMS editor order and content mapping

Status: implemented 2026-08-21

## Purpose

The Motorsport Program editor previously placed the legacy `heroMedia` field at
the top of the form, the structured `motorsportPresentation` component at the
bottom, and the carousel/supporting sections in separate locations. That made
it easy to edit a field that was not the active source for the public page.

The schema and the persisted Strapi Content Manager layout now present the
primary presentation fields at the top of the editor, in the same order as
the campaign page. The persisted layout is important: Strapi keeps editor
layouts in `strapi_core_store_settings`, so changing the JSON schema alone does
not reorder an existing installation.

1. `motorsportPresentation` — `Hero`, then `Information Band`.
2. `heroMedia` — legacy fallback, kept immediately beside the primary hero
   group so it is clear which image is the compatibility fallback.
3. `bannerSlides` — campaign carousel items.
4. `presentationSections` — named supporting sections such as Format and
   Rundown.
5. Programme identity and event-menu fields.
6. Schedule metadata, CTAs, relations, scope, and SEO.

The remaining programme identity, schedule metadata, CTA, relations, scope,
and SEO fields follow these presentation groups.

The existing fields and records are intentionally preserved for compatibility.
No destructive migration is required.

## Existing-installation layout repair

When an existing Strapi installation still shows the presentation groups at
the bottom, refresh the Content Manager layout stored under:

```text
strapi_core_store_settings
key = plugin_content_manager_configuration_content_types::api::motorsport-program.motorsport-program
```

The `layouts.edit` value must start with `motorsportPresentation`, `heroMedia`,
`bannerSlides`, and `presentationSections`. The `motorsport.page-section`
component layout was also normalized so its visibility toggles precede the
content fields. This is a local/deployment migration concern, not an editor
data migration; no programme records are changed.

The bootstrap migration
`cms/src/migrations/motorsport-program-editor-layout.ts` now repairs that
persisted layout automatically when it detects the legacy first row. It is
safe to run on every bootstrap: once the expected first row is present it does
not overwrite later editor customizations. The one-time database repair was
also applied to the current local Docker CMS and verified with an authenticated
Motorsport Admin session.

## Which field should editors use?

### Campaign hero

Use:

```text
Motorsport Presentation → Hero → backgroundMedia
```

The frontend now prefers this image. The root `heroMedia` value remains a
safe fallback for older records that do not yet have a presentation hero.

### Information band

Use:

```text
Motorsport Presentation → Information Band
```

This includes the band copy, `showMetricGroup`, and metric values.

### Campaign carousel

Use:

```text
Campaign Carousel Slides → each item
```

Each item owns its image, title, description, CTA, and `sortOrder`. These
items are not interchangeable with supporting presentation sections.

### Supporting sections

Use:

```text
Supporting Presentation Sections → each item
```

Each item owns its named section key, copy, media, CTA, visibility flags, and
theme. This is for content such as Format or Race-day Guide, not for carousel
slides.

## Compatibility note

The Rallycross route still retains safe code fallbacks when a CMS value is
missing. Existing `heroMedia`, carousel, schedule, and section records remain
valid; editors should follow the ordered groups above for new updates.
