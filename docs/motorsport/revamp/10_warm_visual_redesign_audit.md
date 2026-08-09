# 10 - Warm Visual Redesign Audit

Status: MSR-RD1 complete on 2026-08-09. This document records the redesign
direction only; it does not authorize or include frontend implementation.

## Why this redesign track exists

The implemented Motorsport site uses the approved brand colors and typefaces,
but its semantic design layer treats black and graphite as the default surface
for nearly every page, panel, card, form, and hero. The result is darker,
denser, and more technical than the Motorsport visualization in the Look &
Feel source.

The redesign must retain motorsport intensity while becoming warmer, brighter,
cleaner, and more editorial. It is a controlled sub-phase of the existing
revamp, not a separate frontend or CMS.

## Source-of-truth pages

The following physical pages in
`reference/source-pdfs/look_and_feel_website_sarga_co.pdf` were rendered and
reviewed at high resolution:

| PDF page | Reference section                | Direction extracted                                                                                                                                                          |
| -------: | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|        8 | Website Sarga Motorsport Preview | Thin dark header, centered navigation, Ticket Hub last, warm daylight carousel hero, restrained hero controls, strong blue information band, alternating editorial surfaces. |
|        9 | How We Look / Typography         | Owners Wide for display headings and Noto Sans for body and UI copy.                                                                                                         |
|       10 | Brand Color                      | The seven-color Motorsport palette and the balance between warm accents, Draftline Blue, Warm White, and Charcoal.                                                           |
|       11 | Photography                      | Bright natural light, warm sun, people, crowds, environments, track detail, scenic context, and motion captured without crushed shadows.                                     |
|       12 | Page Visual Layouting Example    | Warm-white editorial pages, blue headings, dark immersive modules, gradient accent panels, disciplined grids, and generous whitespace.                                       |

The typography download links in the PDF point to Adobe Fonts for Owners and
Google Fonts for Noto Sans. The repository already contains local
`owners-wide-black.ttf` and `noto-sans-display-light.ttf` files and loads both
through `next/font/local`; no runtime font download is required for this track.

## Reference interpretation

The reference is not a request to remove dark surfaces. Its visual rhythm uses
darkness selectively: navigation, gallery, timeline, footer, and immersive
media can remain dark. Warm White, Draftline Blue, daylight photography, and
open spacing must carry more of the page so black stops being the default.

This interpretation also avoids copying third-party competition trademarks,
vehicle liveries, event logos, or reference photography. New assets must be
original, appropriately licensed, or generated for Sarga Motorsport.

## Current implementation findings

### Surface and color

- `--ms-surface-page` is black and `color-scheme` is globally dark.
- Panels, cards, forms, detail pages, and reusable page heroes repeatedly use
  `bg-ms-black` or graphite variants.
- Draftline Blue is mainly an information band instead of a structural page
  surface, while Warm White is almost entirely text rather than background.
- The palette is accurate, but its distribution does not match the reference.

### Homepage hero

The current hero combines a night-racing image/video, two technical overlays,
four feed labels, two CTAs, a four-row Session Data panel, an endorsement mark,
dot texture, and an outlined two-line title. This communicates energy but not
the clean campaign composition shown in the source preview.

The redesigned hero should use a CMS-manageable carousel with three or four
warm daylight/golden-hour images, one short headline, one primary action,
compact pagination, and optional short context. Session Data and synthetic
feed labels should be removed from the public hero. Event facts can live in the
information band immediately below it.

### Navigation

- Desktop navigation is pushed to the right and uses approximately 0.58rem
  labels, making it less prominent than the reference.
- The public order currently places Contact after Ticket.
- The redesign target is a centered nav group with slightly larger labels,
  compact spacing, and Ticket as the final item and strongest action.
- Mobile navigation must retain the same information architecture and clear
  tap targets.

### Typography and clipping

- Owners Wide and Noto Sans are loaded correctly.
- Owners Wide Black is declared as a variable `400 900` range even though the
  local file is a single Black cut. This should be normalized during the token
  phase.
- Heading line-heights range from `0.84` to `0.94`, which is too tight for the
  local display face and is the primary clipping/collision risk.
- Hero and page scales are too dominant on common 1366-1440px laptop
  viewports. The redesign must reduce maximum sizes, use safer `0.92-1.0`
  line-height values, and add width-aware long-title handling.
- Body text uses the intended family, but the available local file is a Light
  cut while styles request multiple heavier weights. The next phase must
  validate whether the installed Fontsource Noto Sans variable package should
  provide the complete body-weight range.

### Photography

The current library is dominated by night circuits, hard black gradients,
dark AI-generated vehicles, and heavily shadowed crops. The reference instead
uses daylight and golden-hour track scenes, warm skin tones, crowds, paddocks,
drivers, environmental context, and legible vehicle detail.

New/generated photography must follow this baseline:

- warm daylight or golden-hour key light;
- lifted, detailed shadows without gray haze;
- natural asphalt, grass, sky, and skin tones;
- a mix of wide environment, race action, people, fan culture, and detail;
- Sarga-owned or neutral liveries with no unapproved third-party marks;
- page-specific art direction instead of reusing one car image everywhere;
- desktop and mobile crops reviewed separately.

### Runtime baseline

A read-only Playwright pass was captured at 1440x900 for Home and About and at
390x844 for Home. It confirmed:

- no immediate horizontal overflow in the tested mobile viewport;
- a dense desktop homepage hero with excessive competing UI;
- an About hero that is predominantly empty black surface;
- oversized/very tight display composition on both desktop and mobile;
- console errors from unavailable local CMS/media requests in the current
  standalone frontend session, which are separate from this visual audit.

Baseline artifacts are stored under `output/playwright/` and are not production
assets.

## Target visual system for the next phase

The following distribution is an implementation target inferred from the
reference, not a literal measurement of the PDF:

- Warm White and light neutral surfaces: approximately 45-55% of long-page
  surface area.
- Charcoal/black immersive surfaces: approximately 15-25%, reserved for the
  header, footer, gallery, timeline, selected campaign moments, and media.
- Draftline Blue structural bands: approximately 10-20%.
- Remaining area: image-led sections and controlled crimson/orange/yellow/teal
  accents.

Light and dark surfaces need paired semantic tokens for text, borders, inputs,
cards, and focus states. Components must not assume that Warm White always
means foreground text.

## Route-by-route layout targets

| Route              | Target composition                                                                                                                                                                                                           |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                | Thin dark header; warm image carousel; blue introduction band; light editorial event and news sections; image-led Motorsport disciplines; dark functional Sarga timeline; bright-image gallery on a controlled dark surface. |
| `/about`           | Warm editorial introduction; asymmetrical daylight racing image and story; blue vision band; light capabilities grid; neutral leadership portrait section; bold ecosystem/contact close.                                     |
| `/events`          | Daylight campaign hero; warm-white programme index; blue calendar/status band; large horizontal event posters with clean metadata.                                                                                           |
| `/news`            | Warm-white publication layout with dark ink, one strong lead story, modular archive grid, and minimal metadata.                                                                                                              |
| `/news/[slug]`     | Readable warm editorial article, restrained display title, broad hero image, and clearly separated related stories.                                                                                                          |
| `/gallery`         | Dark immersive gallery is appropriate, but controls must be quiet and imagery must be bright, warm, varied, and given more breathing room.                                                                                   |
| `/merchandise`     | Warm-white catalog surface, real merchandise imagery, consistent product ratios, and responsive two-to-four-column grid; partner routing only.                                                                               |
| `/tickets`         | Warm-white event selection and trust information, blue operational band, explicit approved-partner handoff, and no internal checkout.                                                                                        |
| `/contact`         | Light form surface with dark readable fields, concise contact routes, and a single strong branded closing panel.                                                                                                             |
| `/events/[slug]`   | Image-led event identity, light briefing/content field, blue schedule/data band, and visible external ticket action.                                                                                                         |
| `/campaign/[slug]` | Campaign-specific warm hero and original graphics with alternating light, blue, and selected dark modules.                                                                                                                   |

`/experience` and `/partners` remain compatibility routes until the existing
migration decision is completed. If retained, they must use the same new
surface and heading system.

## CMS impact to validate before implementation

The current homepage model supports one hero image and one mobile image. A
carousel requires an additive, site-scoped repeatable hero-slide component
with image, mobile image, alt text, eyebrow, headline, optional body, CTA,
display order, and publish/visibility controls. The existing single-hero fields
must remain as fallback during migration.

No second CMS is needed. Any schema addition must remain in the shared Strapi
instance, honor `siteScope`, appear only in the Motorsport workspace for the
appropriate editor role, and preserve Super Admin access.

## Redesign sub-phases

### MSR-RD1 - Reference and implementation audit

Status: complete on 2026-08-09.

- Render and inspect the relevant PDF pages.
- Confirm the intended fonts and current local assets.
- Audit the current semantic surface, hero, nav, heading, media, route, and CMS
  gaps.
- Record route-specific target layouts and acceptance constraints.
- No public UI changes.

### MSR-RD2 - Foundations and page-template specification

Status: complete on 2026-08-09. The approved contract is documented in
`11_redesign_foundations_page_templates.md` and
`11_redesign_foundations.tokens.json`.

- Define paired light/dark semantic tokens and safe heading scales.
- Define the centered desktop and mobile navigation behavior.
- Specify carousel behavior, content schema, controls, accessibility, fallback,
  and motion rules.
- Produce section-level design references before implementation where visual
  judgment is material.
- Update CMS schema only after the content contract is approved.

### MSR-RD3 - Global shell and homepage hero

- Implement the header/navigation, surface primitives, typography fixes, and
  clean responsive hero carousel.
- Remove Session Data and decorative feed labels from the hero.
- Generate or prepare the first approved warm/light hero image set.
- Verify desktop, laptop, tablet, mobile, keyboard, and reduced-motion states.

### MSR-RD4 - Homepage editorial rebuild

- Recompose homepage sections using the approved light/dark/blue rhythm.
- Preserve the functional timeline, CMS-backed data, event links, ticket
  redirects, ecosystem links, and gallery behavior.
- Replace or regrade dark photography section by section.

Implementation completed 2026-08-09. The final sequence keeps the approved
dark navy/heat-gradient discipline world as a signature section, then uses
desaturated copper and clay/plum gradients with restrained dot fields for the
event and news modules before returning to the functional dark timeline and
gallery. Four original daylight discipline assets were added, including a
dedicated superbike scene, and the rail now covers six clickable
four-wheel/two-wheel formats.

### MSR-RD5 - Dedicated pages in controlled groups

1. About, News, News Detail, and Gallery.
2. Events, Event Detail, Tickets, and Merchandise.
3. Contact, Campaign Detail, and retained compatibility routes.

Each group requires visual QA and user approval before continuing to the next.

Implementation status, 2026-08-09: Groups 1, 2, and 3 are complete. Every
current dedicated route now uses its approved template family, preserves its
CMS/fallback and conversion boundaries, and passes desktop/mobile visual and
overflow checks. Contact retains validated inquiry routing; Campaign Detail
retains its local fallback and 404 behavior; Experience and Partners remain
available as compatibility routes pending the MSR-8 retention decision.

### MSR-RD6 - Media, CMS, QA, and handover

- Complete page-specific photography and responsive crops.
- Validate Motorsport editor and Super Admin workflows.
- Run accessibility, responsive, performance, link, CMS fallback, and Docker
  Compose checks.
- Update migration, deployment, and handover documentation.

## Acceptance criteria for the completed redesign

- The site clearly uses the full seven-color brand system without black acting
  as the universal background.
- Owners Wide is used for display headings and Noto Sans for body/UI text.
- No heading glyph is clipped at supported breakpoints or 200% zoom.
- Desktop navigation is centered, more legible, and ends with Ticket.
- The homepage hero is cleaner than the current implementation and supports
  accessible, CMS-manageable slides with a static fallback.
- Photography is warm, bright, original/licensed, and varied across pages.
- Every route has an intentional layout derived from the reference grammar,
  not a repeated generic page template.
- Existing CMS functionality, role segregation, partner ticket routing,
  merchandise partner routing, and one-CMS architecture remain intact.
- Docker Compose remains the supported local deployment path.
