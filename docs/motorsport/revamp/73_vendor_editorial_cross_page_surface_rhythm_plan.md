# MSR-SURFACE — Vendor Editorial cross-page surface rhythm

## Status

Spec ready: 2026-08-21

This plan extends the completed homepage surface rhythm (`MSR-HOME-SURFACE-1`)
to the remaining Sarga Motorsport routes. It is intentionally split into small,
independently verifiable phases for execution with `gpt-5.6-luna`.

## Goal

When the active Motorsport theme is `vendor-editorial`, visible content sections
alternate between the vendor palette's light cream and charcoal surfaces. The
first eligible section after the route's opening anchor is always light cream;
the next eligible section is charcoal; and so on. A section hidden by CMS must
not consume an alternation slot. The footer remains charcoal on every route.

The homepage implementation is already complete and is the reference behavior:

```text
World section (anchor)
  -> visible section 1: light cream
  -> visible section 2: charcoal
  -> visible section 3: light cream
  -> ...
Footer: charcoal (fixed)
```

## Scope

In scope:

- `frontend-motorsport` route composition and surface classes.
- Vendor Editorial-only styling. `current` and `vendor-night` must not change.
- CMS visibility conditions already used by each route.
- Preview and live rendering parity, including English and Indonesian locales.
- Reuse of existing semantic theme tokens and surface utilities.

Out of scope:

- New CMS fields or collection types.
- Changes to content ownership, RBAC, route paths, or ticket behavior.
- Reordering sections in the approved vendor composition.
- Applying the alternation to the opening Hero, Information Band, campaign
  slider, or footer unless a route explicitly identifies that element as the
  first post-anchor content surface.

## Surface contract

1. Resolve the active theme from the existing theme settings adapter.
2. Only when the resolved theme is `theme-vendor-editorial`, initialize a
   per-page `surfaceIndex` at zero after the route anchor.
3. Evaluate eligible sections in the same order in which they are rendered.
4. If a section is visible, assign `light` when `surfaceIndex` is even and
   `dark` when it is odd, then increment the index.
5. If a section is hidden (`enabled/isActive === false`, or its existing CMS
   visibility predicate returns false), do not increment the index.
6. Nested content inside one section (cards, article rows, metrics, gallery
   tiles) does not receive independent slots; it inherits its parent surface.
7. Keep the Information Band blue and the FIA campaign slider/media treatment
   unchanged. They are anchors, not alternating editorial surfaces.
8. Keep the shared footer, partner strip, and newsletter treatment charcoal as
   currently defined unless a route explicitly marks them out of the footer.
9. Use existing semantic tokens/classes (`--ms-theme-surface-warm`,
   `--ms-theme-surface-charcoal`, `ms-editorial-surface`,
   `ms-editorial-dark-surface`, and their token-aware text/border rules). Do
   not add route-specific hard-coded cream/charcoal hex values.

## Route matrix

The names below are implementation anchors, not new CMS fields. Existing CMS
section visibility remains the source of truth.

| Route | Anchor | Eligible sections in render order | Required first surface | Explicit expectation |
| --- | --- | --- | --- | --- |
| `/about` | Information Band | `profile`, `about-capabilities`, `team`, `about-ctas` | Light cream | About content begins cream, then alternates; final CTA inherits the next slot. |
| `/news` | Information Band | `news-feed` (lead/archive wrapper), `news-gallery-cta` | Light cream | Existing news feed remains the first cream editorial surface; gallery CTA follows the sequence. |
| `/news/[slug]` | Information Band | `news-detail-story`, `news-detail-related` (`Continue reading`) | Light cream | Article story is cream; Continue reading is charcoal when both sections are visible. |
| `/gallery` | Information Band | `gallery-archive` | Light cream | Existing archive treatment remains cream and must stay readable. |
| `/contact` | Information Band | `inquiry-form`, `contact-final-cta` (`Race-day route`) | Light cream | Inquiry form is cream; Race-day route becomes charcoal when the form is visible. |
| `/ticket` | Information Band | `featured-ticket`, `ticketed-events`, `ticket-info` | Light cream | Featured ticket is cream; later sections alternate while preserving ticket-card contracts. |
| `/events/fia-rallycross-world-cup-indonesia-2026` | Campaign banner slider | `format`, `rundown`, `race-day-guide`, `campaign-ticket` | Light cream | The first post-slider presentation section is cream; later sections alternate. |

### Route-specific notes

- The FIA campaign has both a blue Information Band and a banner slider. The
  requested alternation starts after the rendered banner slider, so `format`
  is the first eligible cream section. The slider remains a media anchor.
- The news hub's lead story and archive list are one `news-feed` surface unit;
  the alternation must not flip between individual stories.
- If `Continue reading`, `Race-day route`, or any other later CMS section is
  hidden, the next visible section receives the slot that would otherwise have
  belonged to it.
- Existing route-specific blue/heat/photography treatments may remain for
  anchors, informational panels, and footer areas. The implementation should
  not flatten those approved treatments into the alternating rhythm.

## Phased execution plan

### MSR-SURFACE-0 — Contract and route audit (this document)

Deliverables:

- This contract and route matrix.
- Confirmation that homepage behavior is the baseline and no homepage code is
  changed in the cross-page track.
- Documentation map and phase-progress entry.

Exit gate: every target route has an identified anchor, ordered eligible
sections, existing visibility predicate, and expected first/second surface.

### MSR-SURFACE-1 — Shared runtime helper and token adapter

Files to inspect/change:

- `frontend-motorsport/src/app/globals.css`
- `frontend-motorsport/src/lib/` (small pure surface-sequencing helper, if the
  existing homepage helper cannot be reused safely)
- Shared route/component types only when needed for class names.

Work:

- Extract or reuse the homepage's visible-section sequencing behavior without
  changing its output.
- Define a small, server-safe API such as `createSurfaceSequencer(theme)`.
- Ensure non-vendor themes return no-op classes.
- Add token-aware heading, body, link, border, and panel contrast rules for
  both editorial surfaces.

Exit gate: homepage regression check shows the same cream/charcoal order;
TypeScript, lint, build, and diff checks pass.

### MSR-SURFACE-2 — About route

Files:

- `frontend-motorsport/src/app/about/page.tsx`
- `frontend-motorsport/src/app/globals.css` only for shared surface selectors.

Work:

- Apply the sequencer after the Information Band.
- Wrap only visible CMS-controlled sections in the sequence.
- Preserve hero, blue Information Band, image/photography treatments, team
  content, and footer behavior.

Exit gate: `/about` in both locales, with each section toggled off once, shows
the next visible section taking the released surface slot.

### MSR-SURFACE-3 — News hub and article detail

Files:

- `frontend-motorsport/src/app/news/page.tsx`
- `frontend-motorsport/src/app/news/[slug]/page.tsx`
- shared CSS only as required.

Work:

- Treat the hub feed wrapper as one section.
- Apply cream to the first article-detail story section and charcoal to
  `Continue reading` when both are visible.
- Keep editorial typography, image treatment, related-story links, and CMS
  visibility unchanged.

Exit gate: `/news` and a published `/news/[slug]` render correct order in EN/ID;
hidden related stories do not shift unrelated content incorrectly.

### MSR-SURFACE-4 — Gallery and Contact routes

Files:

- `frontend-motorsport/src/app/gallery/page.tsx`
- `frontend-motorsport/src/app/contact/page.tsx`
- shared CSS only as required.

Work:

- Apply the first cream surface after the Information Band.
- Keep Gallery archive's existing approved light treatment.
- Make Contact inquiry form cream and `Race-day route` charcoal when both are
  visible.

Exit gate: `/gallery` and `/contact` pass desktop/mobile checks, including
empty/hidden CMS sections and readable form/CTA contrast.

### MSR-SURFACE-5 — Tickets and FIA campaign route

Files:

- `frontend-motorsport/src/app/tickets/page.tsx`
- `frontend-motorsport/src/app/campaign/[slug]/page.tsx`
- `frontend-motorsport/src/app/events/[slug]/page.tsx` only if the campaign
  handoff requires a shared wrapper change.

Work:

- Start `/ticket` sequencing after its Information Band.
- Start FIA sequencing after `CampaignBannerSlider`; keep the slider and
  Information Band as anchors.
- Preserve ticket-card CMS fields, partner redirects, campaign media, and
  section visibility.

Exit gate: `/ticket` and the canonical FIA route render the requested first
cream surface, maintain ticket CTA behavior, and do not alter the existing
campaign redirect or slider output.

### MSR-SURFACE-6 — Cross-route UAT and handover

Validation:

- `vendor-editorial`, `vendor-night`, and `current` theme presets.
- `/`, `/about`, `/news`, one `/news/[slug]`, `/gallery`, `/contact`,
  `/ticket`, and the FIA canonical route.
- English and Indonesian locales.
- CMS preview/draft and published/live output.
- Hide the first, middle, and final eligible CMS sections on each route.
- Confirm hidden sections do not consume slots.
- Confirm footer remains charcoal.
- Check text, links, metric panels, forms, gallery tiles, ticket cards, and
  photography contrast on both surfaces.
- Desktop and mobile browser checks, reduced-motion behavior, and focus
  visibility.
- `pnpm typecheck`, `pnpm lint`, `pnpm build`, Docker smoke test, route crawl,
  and `git diff --check`.

Handover deliverables:

- Updated `docs/PHASE_PROGRESS.md` entries for each completed phase.
- A short editor note explaining that visibility controls sequence position;
  editors do not select a surface color manually.
- Screenshots or browser evidence for the vendor-editorial preset and one
  non-vendor preset regression.

## Rollback and safety

- The change is CSS/class and composition-only; no CMS migration is required.
- Revert a route phase independently if its UAT gate fails.
- Preserve existing fallback content and theme resolver behavior.
- Never let a missing theme record, missing section, or preview API failure
  block the route; fall back to the existing non-alternating treatment.
