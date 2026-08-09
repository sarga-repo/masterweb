# 11 — Asset Inventory and Logo Usage

## Included brand assets

This package includes the official Sarga logo files provided for the initial planning and Codex implementation workflow.

| Asset              | Package path                                | Recommended usage                                                                   |
| ------------------ | ------------------------------------------- | ----------------------------------------------------------------------------------- |
| Sarga logo         | `assets/brand/logos/logo-sarga.png`         | Use on light or neutral backgrounds when the original logo is required.             |
| Sarga reverse logo | `assets/brand/logos/logo-sarga-reverse.png` | Use on dark backgrounds, including the main header, dark hero sections, and footer. |

## Leadership assets

The leadership pages use six portraits already published by Sarga.co. Local copies live in `frontend/public/assets/media/leadership/` so the Next.js image pipeline can optimize them without relying on a third-party runtime host.

| Asset group                    | Frontend path                                                              | Source and usage                                                                                                                                                                               |
| ------------------------------ | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Published leadership portraits | `frontend/public/assets/media/leadership/*.jpg`                            | Sourced from the public Sarga.co About page for the Board of Directors and Company Structure pages. Replace through the Strapi `Leadership Person` media field when CMS publication is active. |
| Governance editorial concept   | `frontend/public/assets/media/leadership/governance-editorial-concept.png` | AI-generated, non-identifying hero artwork for the governance page. It does not represent named directors.                                                                                     |

## Generated sports and editorial media

The production-ready placeholder set from `docs/14_image_generation_brief.md`
lives in `frontend/public/assets/media/generated/`. Every file is PNG at the
brief's required dimensions and is wired into the typed mock fallback. CMS
editors can upload the same files to the corresponding Strapi media fields.

| File                        | Dimensions | Usage                            |
| --------------------------- | ---------: | -------------------------------- |
| `sarga-hero-360.png`        |  2880×1620 | Homepage desktop hero            |
| `sarga-hero-360-mobile.png` |  1080×1920 | Homepage mobile hero             |
| `horse-sport-card.png`      |  1400×2100 | Sarga Horse Sport card           |
| `horse-sport-hero.png`      |  2560×1440 | Sarga Horse Sport detail hero    |
| `motorsport-card.png`       |  1400×2100 | Sarga Motorsport card            |
| `motorsport-hero.png`       |  2560×1440 | Sarga Motorsport detail hero     |
| `news-merdeka.png`          |  1920×1280 | Merdeka Series article cover     |
| `news-turf-track.png`       |  1920×1280 | Turf-track MoU article cover     |
| `news-stable.png`           |  1920×1280 | Inside the Stable article cover  |
| `event-championship.png`    |  1920×1280 | Championship Weekend event cover |

## Dedicated Motorsport media

| File                                                          | Dimensions | Usage                                                                                                |
| ------------------------------------------------------------- | ---------: | ---------------------------------------------------------------------------------------------------- |
| `frontend-motorsport/public/media/motorcycle-racing-dusk.png` |   1774×887 | Motorcycle event, editorial, and gallery showcase fallback; generated without logos or sponsor marks |

### MSR-RD3 warm homepage hero set

Generated on 2026-08-09 for the Motorsport homepage carousel. Frontend copies
live in `frontend-motorsport/public/media/hero/`; matching seed copies live in
`cms/data/seed-media/`. These are approved original launch assets rather than
placeholders, but editors may replace either crop through the Motorsport Home
`heroSlides` media fields.

| Scene                        | Desktop / mobile files                                                                                   |           Dimensions | Prompt summary                                                                                                                                                                                                                      | Alt text                                                                                   | Status                                    |
| ---------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------- |
| Golden-hour circuit          | `sarga-motorsport-hero-circuit-golden-hour.jpg` / `sarga-motorsport-hero-circuit-golden-hour-mobile.jpg` | 1672×941 / 1122×1402 | Unbranded red-orange touring car on a tropical Indonesian circuit at golden hour; warm editorial daylight, open copy-safe sky and track, no marks or text. The portrait version was recomposed from the approved desktop scene.     | Red and orange touring race car accelerating through a tropical circuit at golden hour     | Approved for `/` slide 1; CMS-replaceable |
| Tropical highland rally      | `sarga-motorsport-hero-rally-highlands.jpg` / `sarga-motorsport-hero-rally-highlands-mobile.jpg`         | 1672×941 / 1122×1402 | Unbranded red rally car on a sunlit tropical highland gravel stage; detailed landscape, dust, open copy-safe sky, no marks or text. The portrait version was recomposed from the approved desktop scene.                            | Red rally car racing across a sunlit gravel road in tropical highlands                     | Approved for `/` slide 2; CMS-replaceable |
| Daylight paddock preparation | `sarga-motorsport-hero-paddock-ready.jpg` / `sarga-motorsport-hero-paddock-ready-mobile.jpg`             | 1672×941 / 1122×1402 | Helmeted driver and two crew preparing an unbranded red-charcoal touring car in a warm Indonesian paddock; human scale, bright architecture, no marks or text. The portrait version was recomposed from the approved desktop scene. | Helmeted racing driver and pit crew preparing a red touring car in a warm daylight paddock | Approved for `/` slide 3; CMS-replaceable |

### MSR-RD4 daylight discipline set

Generated with the built-in image generation tool on 2026-08-09 for the
homepage World of Motorsport rail. Final JPEGs live in
`frontend-motorsport/public/media/`; all are original, unbranded launch assets.

| Discipline | File                                                  | Dimensions | Prompt summary                                                                                                                                                                      | Alt text                                                                          | Status                                                      |
| ---------- | ----------------------------------------------------- | ---------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Endurance  | `sarga-motorsport-discipline-endurance-daylight.jpg`  |  1536×1024 | Red and warm-white unbranded endurance prototype on a modern tropical Indonesian circuit in warm late-afternoon light; open sky, realistic track context, no text or sponsor marks. | Red endurance prototype racing through a tropical circuit in warm daylight        | Approved for `/` discipline rail; frontend-owned            |
| Rallycross | `sarga-motorsport-discipline-rallycross-daylight.jpg` |  1536×1024 | Crimson and warm-white unbranded rallycross cars racing side by side on a bright mixed-surface tropical circuit with crowd and landscape context.                                   | Red and warm-white rallycross cars racing side by side on a tropical dirt circuit | Approved for `/` discipline rail; frontend-owned            |
| Touring    | `sarga-motorsport-discipline-touring-daylight.jpg`    |  1536×1024 | Three unbranded crimson, warm-white, and blue touring cars through a sunlit Indonesian circuit corner; premium editorial automotive treatment.                                      | Three touring cars sweeping through a tropical circuit in warm daylight           | Approved for `/` discipline rail; frontend-owned            |
| Motorcycle | `sarga-motorsport-discipline-motorcycle-daylight.jpg` |  1536×1024 | Two unbranded professional superbike racers in crimson and Draftline Blue leaning through a tropical circuit corner in warm daylight.                                               | Two superbike racers leaning through a tropical circuit corner in warm daylight   | Approved for `/` Motorcycle discipline rail; frontend-owned |

The dedicated Motorsport media mix must cover both four-wheel and two-wheel
racing. Future additions should be audited as a set so repeated car imagery does
not make the brand appear car-exclusive.

### MSR-7 FIA Rallycross campaign media

No new images were generated for MSR-7. The campaign reuses approved Motorsport
photography and copies four files into `cms/data/seed-media/` so editors can
replace each relation independently from the shared Strapi media library.

| Campaign role              | CMS seed file                                  | Reused source / treatment            | Status                   |
| -------------------------- | ---------------------------------------------- | ------------------------------------ | ------------------------ |
| Hero / OG image            | `fia-rallycross-campaign-hero.jpg`             | Daylight rallycross discipline image | CMS-managed, replaceable |
| Slide 1 — First Time       | `fia-rallycross-campaign-first-time.jpg`       | Warm highland rally hero             | CMS-managed, replaceable |
| Slide 2 — Wild Action      | `fia-rallycross-campaign-wild-action.jpg`      | Daylight rallycross discipline image | CMS-managed, replaceable |
| Slide 3 — Closer Than Ever | `fia-rallycross-campaign-closer-than-ever.png` | Existing grandstand race scene       | CMS-managed, replaceable |

The frontend fallback references the original public files and is used only when
the CMS or a campaign media relation is unavailable.

## Frontend implementation recommendation

When Codex creates the frontend project, copy these files into the frontend public directory, for example:

```text
apps/web/public/assets/logos/logo-sarga.png
apps/web/public/assets/logos/logo-sarga-reverse.png
```

If the frontend is created as a single Next.js app without a monorepo structure, use:

```text
public/assets/logos/logo-sarga.png
public/assets/logos/logo-sarga-reverse.png
```

## Usage rules

- Use `logo-sarga-reverse.png` for the dark header and footer because the wordmark is white.
- Use `logo-sarga.png` for light backgrounds or CMS/admin references.
- Keep the logo aspect ratio unchanged.
- Do not crop, stretch, recolor, or add effects to the logo.
- Add meaningful alt text, for example: `Sarga.co`.
- Use CSS sizing constraints instead of editing the source image directly.

## Suggested component behavior

The `Logo` component should support a `variant` property:

```ts
variant: "default" | "reverse";
```

- `default` maps to `/assets/logos/logo-sarga.png`
- `reverse` maps to `/assets/logos/logo-sarga-reverse.png`

## Included source/reference documents

| Asset               | Package path                                      | Recommended usage                                                                                                                               |
| ------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Website preview PDF | `reference/source-pdfs/sarga_website_preview.pdf` | Page 7 is the primary brand reference for colors, graphics, typefaces, and hero-image style. Pages 1-5 are non-binding implementation examples. |
| Requirements PDF    | `reference/source-pdfs/requirements.pdf`          | Original vendor briefing and requirement source for scope, technical expectation, timeline, support, and handover.                              |

Codex should read the preview PDF before implementing visual components. It should translate the page-7 brand foundation into an original responsive design, not reproduce or embed the sample website pages.

## IJTC rider portrait grid crops

- Source: user-supplied 5632×3072 PNG arranged as five columns by four rows.
- Runtime files: `frontend-motorsport/public/media/riders/ijtc-grid-rider-portrait-01.png`
  through `ijtc-grid-rider-portrait-20.png`.
- CMS seed files: matching names under `cms/data/seed-media/`.
- Assignment order: row-major, top-left to bottom-right, mapped to IJTC demo
  rider sort order 01–20.
- Each crop is 1126×768. A thin source-grid seam was removed from the final row
  before the crops were normalized to the same dimensions.
