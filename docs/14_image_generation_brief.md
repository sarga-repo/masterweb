# 14 — Image Generation Brief (Placeholder → Official Media)

Source of truth for visual style: `reference/source-pdfs/sarga_website_preview.pdf`
page 7, **Sarga.co** column, "Hero Photo/Image Style".

## Style DNA (append to every prompt)

> photorealistic professional sports photography, extreme panning motion blur
> conveying speed, cinematic color grade with deep charcoal blacks and warm
> dusk highlights, signal-red (#FF2A16) and orange (#FF6A1A) accents on the
> subject, dramatic low or aerial camera angle, atmospheric dust and light
> haze, shallow depth of field, editorial magazine quality, high dynamic
> range — no text, no watermark, no logo, no borders

Negative prompt (where supported): `text, watermark, logo, caption, frame,
cartoon, illustration, oversaturated, static pose`

Format: **PNG**, generate at the largest size available and upscale to at
least the listed resolution. Keep the subject off-center so dark gradient
overlays and headlines stay readable (hero/card components overlay text on
the left/bottom).

## Image → content mapping

| # | Save as (suggested) | Destination (Strapi) | Fallback file (frontend) | Size / ratio |
|---|---|---|---|---|
| 1 | `sarga-hero-360.png` | Homepage → `heroImage` | `frontend/public/assets/media/sarga-cinematic-hero-concept.png` | 2880×1620 (16:9) |
| 2 | `sarga-hero-360-mobile.png` | Homepage → `heroImageMobile` | — (optional) | 1080×1920 (9:16) |
| 3 | `horse-sport-card.png` | Ecosystem Business *Sarga Horse Sport* → `cardImage` | `frontend/public/assets/media/sarga-horse-sport-concept.png` | 1400×2100 (2:3) |
| 4 | `horse-sport-hero.png` | Ecosystem Business *Sarga Horse Sport* → `heroImage` | — | 2560×1440 (16:9) |
| 5 | `motorsport-card.png` | Ecosystem Business *Sarga Motorsport* → `cardImage` | `frontend/public/assets/media/sarga-motorsport-concept.png` | 1400×2100 (2:3) |
| 6 | `motorsport-hero.png` | Ecosystem Business *Sarga Motorsport* → `heroImage` | — | 2560×1440 (16:9) |
| 7 | `news-merdeka.png` | News Article *Sarga Cup Merdeka Series…* → `coverImage` | `frontend/public/assets/media/news-merdeka-jockeys.jpg` | 1920×1280 (3:2) |
| 8 | `news-turf-track.png` | News Article *Sarga Group Signs MoU…* → `coverImage` | `frontend/public/assets/media/news-turf-track-aerial.jpg` | 1920×1280 (3:2) |
| 9 | `news-stable.png` | News Article *Inside the Stable…* → `coverImage` | `frontend/public/assets/media/news-stable-interior.jpg` | 1920×1280 (3:2) |
| 10 | `event-championship.png` | Event *Sarga Championship Weekend* → `coverImage` | — | 1920×1280 (3:2) |

Coming-soon businesses (Venues, Media, Tech) intentionally use the gradient
treatment — no imagery needed. Leadership portraits already exist under
`frontend/public/assets/media/leadership/`.

## Prompts

### 1 — Homepage hero (`heroImage`)
> A herd of powerful horses galloping at full speed alongside a signal-red
> rally race car on a dusty desert highway at golden dusk, side profile
> tracking shot, horses' manes and car body streaked with panning motion
> blur, warm rim light, vast sky with drifting clouds, subject on the right
> two-thirds leaving the left third calmer for headline overlay — [Style DNA]

### 2 — Homepage hero, mobile crop (`heroImageMobile`)
> Same scene as the homepage hero recomposed vertically: one lead horse and
> the red race car nose-to-nose charging toward camera, low angle, dust
> kicked up, motion-blurred ground, upper third open sky for headline — [Style DNA]

### 3 — Horse Sport card (`cardImage`)
> Top-down aerial of a lone jockey in dark silks galloping across a
> manicured emerald turf track, long dramatic afternoon shadow of horse and
> rider cast on the grass, grass streaked with speed blur, vertical
> composition — [Style DNA]

### 4 — Horse Sport detail hero (`heroImage`)
> Two jockeys neck-and-neck at full gallop past a packed grandstand,
> telephoto panning shot, crowd dissolved into streaks of color, turf
> spraying, late-afternoon stadium light, red accents on the lead jockey's
> silks — [Style DNA]

### 5 — Motorsport card (`cardImage`)
> A signal-red touring race car in aggressive low three-quarter view
> powering out of a circuit corner, background grandstand melted into
> horizontal motion blur, heat shimmer over asphalt, vertical composition —
> [Style DNA]

### 6 — Motorsport detail hero (`heroImage`)
> Ultra-close low shot of a formula race car's rear tire and diffuser at
> speed, red brake-light streaks and sparks trailing, track surface rushing
> past in heavy blur, dusk pit-straight floodlights — [Style DNA]

### 7 — News: Merdeka Series spectator benchmarks (`coverImage`)
> Two thoroughbreds and jockeys sprinting side by side on a dirt track,
> panning shot freezing the horses while the grandstand crowd streaks into
> blur, championship-day atmosphere, warm daylight — [Style DNA]

### 8 — News: MoU for turf track (`coverImage`)
> Sweeping aerial of curved turf and dirt racing track lanes under
> construction-perfect grooming, bold green and earth-tone curves crossing
> the frame diagonally, tiny lone rider with long shadow for scale — [Style DNA]

### 9 — News: Inside the Stable (`coverImage`)
> Architectural editorial photo of horses walking through a modern luxury
> stable atrium, circular skylight pouring soft daylight onto sand floor,
> warm wood walls, olive trees, calm premium mood (this slot is editorial —
> minimal motion blur, keep the cinematic grade) — [Style DNA]

### 10 — Event: Sarga Championship Weekend (`coverImage`)
> Night-time championship venue wide shot: floodlit racing circuit in the
> foreground with a red car light-trail, festival crowd and ferris wheel
> glowing in the background, drone-light constellation in the sky,
> celebratory energy — [Style DNA]

## After generating

Upload via Strapi admin (`http://localhost:1337/admin` → Content Manager →
record → image field). Set **alternative text** on every upload (the
frontend renders it). The seed never overwrites media you upload. If you
also want the offline mock fallback updated, drop the PNGs over the listed
fallback paths and update `frontend/src/lib/mock-data.ts` URLs to match.
