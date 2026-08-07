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

| File                           | Dimensions | Usage |
| ------------------------------ | ---------: | ----- |
| `frontend-motorsport/public/media/motorcycle-racing-dusk.png` | 1774×887 | Motorcycle event, editorial, and gallery showcase fallback; generated without logos or sponsor marks |

The dedicated Motorsport media mix must cover both four-wheel and two-wheel
racing. Future additions should be audited as a set so repeated car imagery does
not make the brand appear car-exclusive.

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
