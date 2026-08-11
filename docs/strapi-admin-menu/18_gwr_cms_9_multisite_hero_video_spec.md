# 18 — GWR-CMS-9 Multisite Hero Video

Status: repository implementation completed 2026-08-11. Approved production
video assets and staging/public-domain media verification remain release gates.

## Goal

Allow authorized editors to use short MP4 and/or WebM hero videos from the
shared Strapi Media Library on Gateway, Motorsport, and Horse Sport while
retaining image posters, reduced-motion behavior, and safe failure fallback.

## CMS contract

The optional `shared.hero-video` component contains:

- `enabled` — explicit editorial on/off control;
- `primaryVideo` — required MP4 or WebM Media Library asset;
- `alternateVideo` — optional second codec source;
- `posterImage` — optional desktop poster override;
- `mobilePosterImage` — optional mobile poster override.

Gateway uses the component on `Homepage`. Horse Sport and generic scoped pages
use it on `Site Page`. Each Motorsport `Hero Slide` can include the same
component; the homepage remains capped at three ordered slides. The existing
slide image remains required and is the guaranteed poster/failure fallback.

Managed workspace fields are derived recursively from registered schemas, so
Gateway, Motorsport, and Horse Sport roles receive the new nested fields only
inside records already protected by their existing role/scope conditions.
Media Library storage remains shared and non-confidential.

## Frontend contract

- Render the poster first and progressively enhance to video.
- Accept either MP4 or WebM and order `<source>` elements by detected MIME or
  extension; unsupported video formats do not replace the poster.
- Videos are muted, inline, looping, and decorative.
- Do not render video when `prefers-reduced-motion: reduce` is active.
- Use `preload="metadata"`; Motorsport mounts video only for the active slide.
- Pause Motorsport playback when the user explicitly pauses its carousel.
- Preserve existing overlay, typography, CTA, swipe, and navigation behavior.
- A missing CMS, disabled component, missing source, playback failure, or
  unsupported codec must leave the existing image hero intact.

## Editorial media policy

- Preferred duration: 6–12 seconds.
- Preferred delivery: H.264 MP4 plus optional WebM alternative, without audio.
- Target maximum: 5–8 MB per desktop clip even though Nginx permits 100 MB CMS
  uploads.
- Keep a meaningful poster image, ideally below 500 KB.
- Do not preload all three Motorsport videos.
- Editors must preview desktop, mobile, reduced-motion, and both locales before
  publishing.

## Verification

- Schema/type generation and managed-field RBAC tests.
- CMS TypeScript and production admin build.
- Three frontend lint/type/test/build checks.
- Browser checks for image-only, MP4-only, WebM-only, dual-source, disabled,
  missing/error fallback, reduced motion, active-slide loading, and responsive
  behavior.
- Docker Compose and whitespace validation.

Local implementation evidence:

- CMS schema/type generation and 10 managed-field/RBAC tests passed.
- All three frontend lint and TypeScript checks passed; applicable unit suites
  and production builds passed.
- Real-browser Horse Sport checks proved dual WebM/MP4 playback, metadata
  preload, pause/play, 390 px responsive behavior, and zero video elements when
  reduced motion is enabled.
- Real-browser Gateway and Motorsport checks proved image fallback, no overflow,
  and exactly three Motorsport carousel controls with no clip configured.
- The public Strapi REST API accepted nested hero-video population and the
  Horse Sport home seed was created idempotently without replacing content.

## Phase boundary

This phase does not create or fabricate three Motorsport video assets. Editors
can upload the approved clips and attach them to the three existing slides.
GWR-CMS-8 staging gates remain separate, and Gateway GWR-6 does not start as a
side effect of this phase.
