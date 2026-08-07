# 02 — Horse Sport Brand Translation

## Source reference

Use `reference/source-pdfs/sarga_website_preview.pdf`, especially **page 7**, as the primary Horse Sport brand foundation reference.

Page 7 presents the side-by-side brand comparison for Sarga.co, Sarga Horse Sport, and Sarga Motorsport. For Horse Sport it shows:

- Sarga Horse Sport logo using the Sarga wordmark and horse-jockey mark
- Brand colors led by red, orange, black, cream, and muted equestrian tones
- Graphic language with a bold diagonal mark, dotted jockey/sport texture, and zig-zag orange rhythm
- Display typography direction represented by **Stadmitte**
- Body typography direction represented by **Masifa**
- Hero photo/image style focused on jockeys, race horses, equestrian venues, turf tracks, and derby scenes

## Brand personality

Sarga Horse Sport should feel like:

- **Elite** — premium championship-level equestrian sport
- **Composed** — less aggressive than Motorsport, more disciplined and refined
- **Cinematic** — dramatic race-day lighting, motion, turf, dust, stable atmosphere
- **Heritage-forward** — elegant, prestigious, and event-oriented
- **Athletic** — close to the physicality of horse and jockey
- **Social/lifestyle** — hospitality, venue, stable culture, fashion, and derby day experiences

## Difference from other Sarga sites

### Compared with Sarga.co gateway

Gateway is corporate, broad, and ecosystem-oriented. Horse Sport must be deeper and more immersive.

Do not simply reuse gateway sections. Translate the brand into a dedicated equestrian experience.

### Compared with Sarga Motorsport

Motorsport is dark, kinetic, mechanical, and intense.

Horse Sport should be premium, warm, organic, and refined while still showing speed and competition.

## Color direction

Use the Sarga Horse Sport palette implied in page 7:

| Token | Use | Suggested value |
|---|---|---|
| `horse-red` | Primary CTA, active states, race-day energy | `#ED1B2F` |
| `sarga-orange` | Gradient with red, highlights, hover accents | `#FF6B00` |
| `heritage-black` | Text, dark sections, premium contrast | `#050505` |
| `warm-cream` | Light backgrounds, editorial sections | `#FFF8E8` |
| `stable-brown` | Heritage/accent tone | `#7A3B2E` |
| `turf-green` | Turf, track, venue highlight | `#8CA89A` |
| `sand-gold` | Hospitality, warm detail, muted luxury | `#E8D9A8` |

## Typography direction

The PDF references Stadmitte for display and Masifa for body. If exact licensed fonts are unavailable, use approved or open alternatives while preserving the character:

- Display: wide, condensed, bold, championship/event poster style
- Body: clean humanist sans, premium editorial readability

Implementation recommendation:

- Use CSS tokens so fonts can be swapped later.
- Default display fallback: `var(--font-display), 'Arial Black', 'Impact', sans-serif`
- Default body fallback: `var(--font-body), 'Noto Sans', 'Plus Jakarta Sans', system-ui, sans-serif`

Do not bundle unlicensed font files.

## Graphic language

Use these motifs carefully:

- Diagonal slash inspired by the Sarga Horse Sport logo
- Dotted jockey/equestrian texture for background or hover details
- Orange zig-zag/rhythm lines as small accents
- Large cropped horse-jockey silhouettes in hero/section backgrounds
- Clean editorial grid with premium negative space
- Rounded but not childish card geometry

## Photography / image style

Recommended subjects:

- Jockey close-up before race
- Horses running on turf or dirt track
- Derby event crowd / grandstand
- Stable interior with premium lighting
- Aerial turf track
- Horse and jockey in motion blur
- Warm sunset race-day scenes
- Veterinary/stable care, equipment, saddle, reins, horse details

Style:

- Cinematic, high-contrast, realistic
- Warm golden-hour and red/orange energy
- Premium editorial framing
- Motion blur used intentionally
- No cartoon or generic stock feeling

## Voice and copy direction

Tone:

- Confident
- Prestigious
- Elegant
- Sport-forward
- Not overly corporate
- Not overly loud

Example headline style:

```text
WHERE ELITE HORSE SPORT MEETS MODERN SPECTACLE
```

Example body style:

```text
Sarga Horse Sport brings championship racing, disciplined equestrian standards, and race-day hospitality into one premium sports ecosystem.
```
