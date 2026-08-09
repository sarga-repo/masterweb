# 11 - Redesign Foundations And Page Templates

Status: MSR-RD2 complete on 2026-08-09. This is the implementation contract for
MSR-RD3 through MSR-RD6. It does not change the public frontend or CMS schema.

## Design thesis

Sarga Motorsport is a warm international racing editorial platform: precise
enough for official competition information, cinematic enough for campaign
moments, and open enough for people, merchandise, culture, and stories to
breathe.

The reference does not support a universal black canvas. The approved rhythm is
Warm White editorial space, Draftline Blue structure, bright photography, and
selective Charcoal immersion. Crimson, orange, yellow, and teal communicate
heat, action, status, and data; they do not become decorative gradients on
every surface.

### Audience and primary job

- Audience: Indonesian and international racing fans, participants, partners,
  media, and prospective event visitors.
- Primary job: move a visitor from emotional recognition to a clear next
  action—explore a programme, read a story, view an event, obtain a partner
  ticket, or contact Sarga.

### Signature element - the Apex Horizon

The one expressive device is a restrained crimson-to-orange horizontal plane
behind the hero vehicle or subject. It evokes heat, track motion, and the red
field in the source preview. It appears in the homepage/campaign hero and may
return once as a page transition; it is not repeated on cards or every heading.

This keeps the system recognizably Motorsport without falling into the generic
"cream editorial website" pattern. Draftline Blue bands, Owners Wide titles,
sharp image crops, race-specific content, and the Apex Horizon provide the
specificity.

## Three-layer token architecture

The machine-readable handoff is
`11_redesign_foundations.tokens.json`. MSR-RD3 must implement the same three
layers in `frontend-motorsport/src/app/globals.css`:

```text
Brand and neutral primitives
          ↓
Semantic roles for light, dark, blue, text, borders, and actions
          ↓
Header, hero, button, card, input, table, and section component tokens
```

Route components must consume semantic or component tokens. Direct brand hex
values are allowed only in the primitive layer, generated media, metadata, and
rare one-off data visualizations approved during implementation.

## Color and surface contract

### Brand primitives

The source palette remains unchanged:

| Primitive       |     Value | Role                                                           |
| --------------- | --------: | -------------------------------------------------------------- |
| Apex Crimson    | `#E8192C` | Large brand accent, heat plane, key graphic moments.           |
| Ignition Orange | `#FF6B00` | Energy accent and secondary action background with dark text.  |
| Electric Yellow | `#F5C800` | Focus, live state, pagination, selected status.                |
| Slipstream Teal | `#00C4CC` | Data, category, secondary status.                              |
| Draftline Blue  | `#0033A0` | Structural information bands and link color on light surfaces. |
| Charcoal        | `#1B1B1B` | Dark immersive surface and primary ink on light surfaces.      |
| Warm White      | `#FFF9EE` | Primary editorial canvas and inverse text.                     |

### Derived accessibility primitives

Brand colors remain visually exact, but small text and controls need darker
derived values where the source colors do not meet WCAG AA:

| Derived token |     Value | Use                                                  |
| ------------- | --------: | ---------------------------------------------------- |
| Crimson 700   | `#C41427` | Primary button and small crimson text on Warm White. |
| Crimson 800   | `#A81022` | Primary-button hover/pressed state.                  |
| Orange 800    | `#B94700` | Small orange text on Warm White.                     |
| Ink 700       | `#47433D` | Secondary body text on light surfaces.               |
| Ink 600       | `#625E56` | Muted text on light surfaces.                        |
| Ink 500       | `#716C64` | Quiet text; minimum supported light-surface tone.    |
| Cream 100     | `#F6EFE3` | Subtle section alternation.                          |
| Cream 200     | `#E8DECF` | Light borders and separators.                        |

Measured contrast ratios against the intended surfaces:

| Pair                        |   Ratio |
| --------------------------- | ------: |
| Charcoal / Warm White       | 16.43:1 |
| Ink 700 / Warm White        |  9.37:1 |
| Ink 600 / Warm White        |  6.16:1 |
| Ink 500 / Warm White        |  4.97:1 |
| Draftline Blue / Warm White | 10.11:1 |
| Crimson 700 / Warm White    |  5.76:1 |
| Orange 800 / Warm White     |  5.05:1 |
| Charcoal / Ignition Orange  |  6.03:1 |
| Charcoal / Electric Yellow  | 10.78:1 |
| Charcoal / Slipstream Teal  |  8.01:1 |

The exact Apex Crimson and Ignition Orange values are not approved for small
text on Warm White. Use them for large type, graphics, borders, or backgrounds
with the paired accessible foreground defined above.

### Semantic surfaces

| Role                      | Value           | Typical use                                        |
| ------------------------- | --------------- | -------------------------------------------------- |
| `surface.canvas`          | Warm White      | Body and primary editorial sections.               |
| `surface.subtle`          | Cream 100       | Alternating editorial section or filter rail.      |
| `surface.raised`          | White           | Forms, merchandise details, controlled overlays.   |
| `surface.inverse`         | Charcoal        | Timeline, gallery, dark campaign module.           |
| `surface.inverseStrong`   | Black           | Header, footer, media scrim only.                  |
| `surface.blue`            | Draftline Blue  | Calendar, programme facts, trust/information band. |
| `surface.action`          | Crimson 700     | Accessible primary button.                         |
| `surface.secondaryAction` | Ignition Orange | Secondary action with Charcoal text.               |

The document surface target remains approximately 45-55% light editorial,
15-25% dark immersive, 10-20% Draftline Blue, with the remainder image-led or
controlled action color. Individual short pages may vary, but no long route
should render as an uninterrupted black stack.

### Surface-scoped components

Shared components use a `tone` contract rather than embedded foreground values:

```ts
type SurfaceTone = "light" | "subtle" | "dark" | "blue" | "image";
```

`SectionHeader`, buttons, cards, tables, chips, forms, link rails, pagination,
and empty/error states must define both light and inverse states. Do not rely on
ancestor opacity utilities for primary body copy.

## Typography contract

### Families and real weights

- Display: local Owners Wide Black, declared as weight `900` only.
- Body/UI: Noto Sans variable with `400`, `500`, `700`, and `800` weights.
- Do not map the current Noto Sans Display Light file across unavailable
  weights. MSR-RD3 should use the installed `@fontsource-variable/noto-sans`
  package or an approved local variable file for the complete range.
- Do not use monospace merely to make interface labels look technical.

### Approved responsive scale

| Tier    | Size                               | Line height | Use                                |
| ------- | ---------------------------------- | ----------: | ---------------------------------- |
| Hero    | `clamp(3rem, 5.8vw, 5.75rem)`      |        0.95 | Homepage and campaign thesis only. |
| Page    | `clamp(2.5rem, 3.8vw, 4rem)`       |        0.98 | Standard route H1.                 |
| Article | `clamp(2.5rem, 4.4vw, 4.75rem)`    |        1.00 | News/event long-form H1.           |
| Section | `clamp(2rem, 2.9vw, 3rem)`         |        1.00 | Primary H2.                        |
| Feature | `clamp(1.75rem, 2.5vw, 2.75rem)`   |        1.02 | Feature/module heading.            |
| Card    | `clamp(1.25rem, 1.8vw, 2rem)`      |        1.04 | Card/item title.                   |
| Lead    | `clamp(1.125rem, 1.5vw, 1.375rem)` |        1.55 | Editorial introduction.            |
| Body    | `1rem`                             |        1.70 | Main copy.                         |
| Small   | `0.875rem`                         |        1.55 | Supporting copy.                   |
| Label   | `0.6875rem`                        |        1.30 | Navigation, metadata, status.      |

### Owners Wide safety rules

- Apply `font-weight: 900`; do not simulate variable weights.
- Use normal glyph fill by default. Outline type is limited to one short hero
  word and must not reduce legibility.
- Keep display titles to 14 words and no more than two lines on desktop or
  three lines on mobile. CMS guidance should recommend 42 characters for hero
  headlines.
- Use `overflow: visible`, no fixed title height, and at least `0.08em` block
  breathing room inside any ancestor that otherwise clips media.
- Do not combine line-height below 0.95 with negative letter spacing.
- Prefer `max-inline-size` and intentional line breaks over shrinking below the
  approved minimum.
- Test at 320, 375, 390, 768, 1024, 1280, 1366, and 1440px plus 200% zoom.

## Spacing, grid, and shape

- Content max: 1440px.
- Reading measure: 720px.
- Page gutter: `clamp(1.25rem, 4vw, 4.5rem)`.
- Section spacing: `clamp(4.5rem, 7vw, 7rem)`.
- Grid gap: `clamp(1rem, 1.8vw, 2rem)`.
- Base desktop grid: 12 columns; tablet 8; mobile 4.
- Use sharp rectangular modules. A small 2-4px radius is allowed for form
  controls and image anti-aliasing, not rounded SaaS cards.
- Use hairline rules to organize real metadata or reading sequence, not as
  decorative pseudo-data.

## Navigation contract

### Desktop at 1280px and wider

```text
┌─────────────────────────────────────────────────────────────────────┐
│ SARGA MOTORSPORT HOME ABOUT EVENT NEWS GALLERY MERCH CONTACT TICKET  │
│                    ← centered primary group →             SARGA.CO  │
└─────────────────────────────────────────────────────────────────────┘
```

- Use a three-cell grid: `minmax(12rem,1fr) auto minmax(12rem,1fr)`.
- Logo aligns left; primary navigation is geometrically centered; Sarga.co
  utility aligns right.
- Order: Home, About, Event, News, Gallery, Merchandise, Contact, Ticket.
- `Home` may be represented by the logo at 1280-1365px if space is constrained;
  the accessible label and mobile menu still include Home.
- Labels use Noto Sans 800 at 11px/0.6875rem with 0.12em tracking—larger than
  the current approximately 9px labels.
- Ticket is final and uses a compact high-contrast action treatment. It does
  not appear before Contact.
- Active state uses text plus a 2px Electric Yellow underline; color is not the
  only signal.
- The Sarga.co link is a utility, not part of the centered primary sequence.

### Mobile and compact desktop below 1280px

- Preserve logo, menu button, and the thin brand-color top rail.
- Use a full-height dialog/drawer with body scroll lock, focus trap, Escape
  close, focus return, and current-page state.
- Use the same public order and keep Contact directly before Ticket.
- Ticket becomes a full-width final action, not merely a differently colored
  list label.
- Do not use ornamental sequence numbers unless they convey real order; the
  menu does not need `01`, `02`, and similar decoration.

## Homepage carousel contract

### Content and CMS model

Add a new repeatable `motorsport.hero-slide` component to the Motorsport
`site-page` Home record in MSR-RD3. Do not reuse `motorsport.campaign-slide`:
campaign slides lack responsive media, alt text, visibility, and homepage
editorial controls, and changing that shared component could regress campaign
content.

Proposed fields:

| Field           | Type                     | Requirement                                                            |
| --------------- | ------------------------ | ---------------------------------------------------------------------- |
| `internalName`  | string                   | Required; CMS-only label.                                              |
| `eyebrow`       | string                   | Optional; maximum 40 characters.                                       |
| `title`         | string                   | Required; recommended maximum 42 characters.                           |
| `description`   | text                     | Optional; maximum 160 characters.                                      |
| `image`         | image media              | Required for published slide; target 2400×1350 or larger.              |
| `mobileImage`   | image media              | Optional; target 1080×1350; desktop image is fallback.                 |
| `imageAlt`      | string                   | Required unless image is explicitly decorative.                        |
| `subjectAnchor` | enum `left/center/right` | Required; guides safe responsive crop.                                 |
| `ctaLabel`      | string                   | Optional; one action only; maximum 28 characters.                      |
| `ctaUrl`        | string                   | Required when CTA label exists; validated by existing safe-link rules. |
| `isActive`      | boolean                  | Default true.                                                          |
| `sortOrder`     | integer                  | Required; deterministic order.                                         |

The parent `site-page` retains `siteScope`, site relation, draft/publish, and
role segregation. Existing `heroTitle`, `heroDescription`, and `heroMedia`
fields remain the migration and no-slide fallback.

Recommended editorial range: three slides; supported range: one to five. More
than five must be rejected in editorial guidance because it dilutes the hero
and increases media cost.

### Visual hierarchy

```text
┌──────────────────────── warm daylight racing image ─────────────────┐
│                                                                     │
│                    OPTIONAL SHORT EYEBROW                           │
│                   RACE OF THE CHAMPION                              │
│                                                                     │
│  ● ○ ○  Pause                                      EXPLORE EVENT → │
└──────────────────────── Apex Horizon ───────────────────────────────┘
```

- Center the short headline in the image safe area.
- Use one primary action. Secondary destinations move to the blue band below.
- Remove Session Data, Feed, Signal, location/time labels, and technical panel
  chrome from the hero.
- Keep the Sarga endorsement only if it remains visually subordinate and does
  not compete with controls; otherwise move it to the next band/footer.
- Use a localized scrim behind text, not a full-image black wash.
- Use the Apex Horizon once behind the subject or as the lower transition.

### Behavior and accessibility

- Server-render the first active slide and reserve the hero aspect/height to
  prevent layout shift.
- Auto-advance every 8 seconds only when at least two slides exist.
- Provide visible previous/next or pagination controls and an explicit
  Pause/Play control because movement lasts longer than five seconds.
- Pause on pointer hover, focus within, document hidden, manual navigation, and
  screen-reader interaction.
- Disable autoplay and crossfade animation under `prefers-reduced-motion`.
- Crossfade duration: 600ms; no parallax, zoom loop, or simultaneous text and
  image motion.
- Announce manual slide changes politely, but do not announce every automatic
  transition.
- Support touch swipe without preventing vertical page scroll.
- First slide image is priority; later slides lazy-load without blank flashes.
- If JavaScript fails, the first slide remains complete and actionable.

## Page-template system

These are composition families, not one universal page component. They share
tokens, header, footer, typography, and accessibility behavior while preserving
route-specific visual identity.

### Template A - Campaign home

Routes: `/`, selected `/campaign/[slug]`.

```text
[dark header]
[warm image carousel + Apex Horizon]
[Draftline Blue facts / next action]
[light editorial feature]
[image-led disciplines or campaign chapters]
[light event/news modules]
[dark functional timeline or campaign moment]
[dark gallery with bright imagery]
[dark footer]
```

Rules:

- Hero supplies emotion; the next blue band supplies facts.
- No generic card row directly beneath the hero.
- Alternate surface and image scale so no two adjacent sections feel like the
  same module.

### Template B - Editorial story

Routes: `/about`, `/news/[slug]`, editorial portions of event/campaign detail.

```text
[dark header]
[blue, warm-copper, or reflected-light title field]
[wide warm photograph crossing the grid]
[reading column + contextual rail]
[Draftline Blue quote/facts break]
[related stories or people]
[dark footer]
```

Rules:

- Reading measure remains 720px even when imagery is full-width.
- About may use asymmetrical story/image composition; article detail prioritizes
  uninterrupted reading.
- About alternates deep blue, muted copper, reflected race-light, and blue-slate
  surfaces; large white or cream section backgrounds are intentionally avoided.
- Metadata describes publication/event facts only—no synthetic system labels.

### Template C - Programme or publication index

Routes: `/events`, `/news`, IJTC schedule/riders/standings.

```text
[dark header]
[compact blue/heat or warm-image intro with optional light-line motion]
[blue status/filter band]
[one large lead item on a deep-blue panel]
[ordered editorial rows / asymmetric grid on blue or reflected light]
[contextual action band]
[dark footer]
```

Rules:

- Prefer full-width rows, image/text pairings, and one strong lead over repeated
  equal cards.
- Filters must change content; decorative filter icons are not allowed.
- News and Event index sections avoid universal white or black canvases; use
  deep blue and controlled red/amber/teal reflection fields with Warm White
  foregrounds.
- Tables use light canvas by default with accessible sticky headers on small
  screens.

### Template D - Catalog and conversion

Routes: `/merchandise`, `/tickets`, `/contact`.

```text
[dark header]
[compact blue/heat intro or warm photograph]
[reflected-light catalog / event / form content]
[blue trust, routing, or service band]
[single branded action close]
[dark footer]
```

Rules:

- Merchandise uses warm-neutral product photography and the established 2-4
  column grid, without internal cart or checkout.
- Merchandise catalogue pagination activates above sixteen published items so a
  wide page never exceeds four columns by four rows.
- Tickets state the partner handoff before the external action.
- Contact uses deep-blue fields with explicit labels and high-contrast
  validation on a reflected-light inquiry surface.
- Conversion pages remain calm; they do not reuse the cinematic homepage hero
  at full height.

### Template E - Immersive media

Routes: `/gallery`, selected campaign media sections.

```text
[dark header]
[compact Draftline Blue gradient title/control field]
[deep-blue/plum image wall with bright warm imagery]
[deep-blue caption/detail drawer]
[keyboard-accessible modal image viewer with previous/next controls]
[next story/event action]
[dark footer]
```

Rules:

- The gallery may use deep blue and plum because imagery is the content, but
  pure black section canvases and image-darkening overlays at rest are avoided.
- Masonry/uneven rhythm is allowed only with reserved dimensions and stable
  reading order.
- Controls are functional, labeled, keyboard accessible, and visually quiet.
- Gallery frames open in an in-page modal rather than a new browser page. The
  viewer traps focus, restores focus on close, supports Escape and arrow keys,
  locks body scroll, and wraps previous/next navigation.
- Redesigned About, Events, News, Gallery, Merchandise, Contact, and Tickets use
  the shared opt-in
  PageShell spectrum rule so every section boundary carries one full-width
  crimson-to-blue separator without duplicated decorative elements.

## Route assignment and first implementation order

| Route                      | Template           | First redesign group |
| -------------------------- | ------------------ | -------------------- |
| `/`                        | A                  | MSR-RD3/RD4          |
| `/about`                   | B                  | MSR-RD5.1            |
| `/news`                    | C                  | MSR-RD5.1            |
| `/news/[slug]`             | B                  | MSR-RD5.1            |
| `/gallery`                 | E                  | MSR-RD5.1            |
| `/events`                  | C                  | MSR-RD5.2            |
| `/events/[slug]`           | B/C hybrid         | MSR-RD5.2            |
| `/tickets`                 | D                  | MSR-RD5.2            |
| `/merchandise`             | D                  | MSR-RD5.2            |
| `/contact`                 | D                  | MSR-RD5.3            |
| `/campaign/[slug]`         | A/B hybrid         | MSR-RD5.3            |
| `/experience`, `/partners` | B or C if retained | MSR-RD5.3            |

MSR-RD5.2 implementation record, 2026-08-09: Events uses Template C with
programme and calendar hierarchy; Event Detail uses the approved B/C hybrid
with a conditional partner-ticket panel; Tickets and Merchandise use Template
D. The merchandise grid is capped at four columns/four rows per page before
client pagination, and all conversion actions preserve the external partner or
inquiry-only boundary. Desktop and 390px visual QA passed without page-level
overflow or clipped headings.

MSR-RD5.3 implementation record, 2026-08-09: Contact uses Template D with its
existing validated inquiry workflow; Campaign Detail uses the A/B hybrid with
an internal handoff to the approved ticket hub; Experience and Partners use
retained B/C compositions without returning to universal black surfaces. All
four routes use spectrum separators and passed desktop plus 390px visual QA.
Compatibility-route retention remains an MSR-8 decision, and CMS-backed FIA
campaign delivery remains outside this visual-only group.

## Photography brief for MSR-RD3 onward

- Homepage hero set: three original scenes—golden-hour circuit approach,
  daylight rally/off-road action, and warm paddock/driver atmosphere.
- Keep recognizable Sarga color accents without unapproved sponsor marks.
- Use natural highlights, clean whites, open sky, and detailed shadows.
- Do not make every vehicle black or every scene nocturnal.
- Include human scale: driver/rider, crew, fan, podium, or preparation where
  appropriate.
- Generate desktop and mobile crops intentionally; do not rely on one central
  crop for every viewport.
- Store source prompt, generation date, usage route, alt text, and replacement
  status in the asset inventory when final assets are produced.

## MSR-RD3 implementation boundaries

MSR-RD3 is authorized to implement only:

- the token architecture and corrected font loading;
- shared light/dark component foundations needed by the shell;
- the centered navigation and mobile drawer behavior;
- the additive `motorsport.hero-slide` schema and CMS/frontend mapping;
- the homepage hero carousel and initial warm hero media;
- focused tests and documentation for those changes.

Homepage body recomposition remains MSR-RD4. Dedicated route redesign remains
MSR-RD5. This boundary keeps visual review small enough to correct before it is
copied across the site.

## MSR-RD2 acceptance record

- Exact source palette retained.
- Accessible light-surface derivatives and contrast ratios documented.
- Three-layer token handoff created.
- Owners Wide and Noto Sans real-weight behavior specified.
- Smaller, safer shared heading scale specified.
- Centered desktop navigation and Ticket-last order specified.
- Responsive accessible carousel content and behavior contract specified.
- Five composition families mapped to every current route.
- CMS remains one shared Strapi instance; no schema was changed in MSR-RD2.
