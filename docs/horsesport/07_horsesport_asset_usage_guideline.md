# 07 — Horse Sport Asset Usage Guideline

## Approved asset folders

```text
assets/brand/horsesport/logos/
assets/brand/horsesport/images/
```

## Logo files

Use:

```text
sarga_horse_sport_logo_black_text_smooth.png
sarga_horse_sport_logo_white_text_smooth.png
```

Rules:

- Use black text logo on warm cream/light sections.
- Use white text logo on dark header/footer/hero overlays.
- Keep the red/orange horse-jockey symbol unchanged.
- Do not stretch, recolor, add outlines, or rasterize into backgrounds.
- Preserve clear space around the logo.

## Image files

Existing Horse Sport reference images include:

```text
horse-sport-hero.png
horse-sport-card.png
sarga-horse-race-event.png
sarga-horse-sport-concept.png
sarga-horse-sport-turf-aerial.jpg
news-merdeka.png
news-merdeka-jockeys.jpg
news-turf-track.png
news-turf-track-aerial.jpg
news-stable.png
news-stable-interior.jpg
```

## Recommended usage

| Asset | Recommended use |
|---|---|
| `horse-sport-hero.png` | Homepage hero |
| `sarga-horse-race-event.png` | Event hero / race-day promotion |
| `horse-sport-card.png` | Gateway teaser / ecosystem card |
| `sarga-horse-sport-turf-aerial.jpg` | Venues page / track section |
| `news-stable-interior.jpg` | Stable Life page |
| `news-merdeka-jockeys.jpg` | News / jockey story |
| `news-turf-track-aerial.jpg` | Turf/venue article |

## Image treatment

- Use `next/image` for optimization.
- Add alt text from CMS.
- Avoid cropping horse heads/jockey faces awkwardly.
- Use dark gradient overlays when text appears on images.
- Prefer cinematic wide crops for hero sections.
- Prefer editorial 4:3 or 3:2 crops for cards.

## Favicon and icon recommendation

Create separate favicon assets based on the horse-jockey symbol.

Suggested files:

```text
frontend-horsesport/public/icon.png
frontend-horsesport/public/favicon.ico
frontend-horsesport/public/apple-icon.png
```

Use the icon-only mark for favicon and app icon because full wordmark is too wide at small sizes.

## CMS media guidance

Every uploaded media item should include:

- Alt text
- Caption when editorially useful
- Credit if required
- Site scope or folder organization
- Image focal point if the CMS supports it
