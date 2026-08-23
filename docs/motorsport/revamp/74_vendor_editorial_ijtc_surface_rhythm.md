# MSR-SURFACE-IJTC — Vendor Editorial IJTC surface rhythm

## Status

Done: 2026-08-22

## Scope

Extended the completed Vendor Editorial surface sequencer to the Indonesia
Junior Talent Cup programme and its sub-navigation routes:

- `/events/indonesia-junior-talent-cup`
- `/events/indonesia-junior-talent-cup/race-schedule`
- `/events/indonesia-junior-talent-cup/riders`
- `/events/indonesia-junior-talent-cup/riders/[riderSlug]`
- `/events/indonesia-junior-talent-cup/standings`
- `/events/indonesia-junior-talent-cup/about`
- `/events/indonesia-junior-talent-cup/regulation`
- `/events/indonesia-junior-talent-cup/become-riders`

The user-provided `race-schedulue` spelling is not a route in the repository;
the canonical route is `race-schedule` and the existing IJTC subnav continues to
use that path.

## Surface contract

Each route keeps its Hero and Information Band as anchors. Visible content
sections after the band consume the shared sequence in render order:

| Route | Eligible sections | Vendor Editorial order |
| --- | --- | --- |
| IJTC overview | Overview, programme routes, next intake | Cream, charcoal, cream |
| About IJTC | Purpose, development model, programme entry | Cream, charcoal, cream |
| Become Riders | Inquiry, process | Cream, charcoal |
| Race Schedule | Schedule, field CTA | Cream, charcoal |
| Riders | Rider catalogue, field CTA | Cream, charcoal |
| Rider profile | Profile, field CTA | Cream, charcoal |
| Standings | Classification, field CTA | Cream, charcoal |
| Regulation | Rulebook, publication control, programme support | Cream, charcoal, cream |

The sequence remains visibility-first and is a no-op for `current-motorsport` and
`vendor-night`. Existing CMS/fallback data, IJTC navigation, inquiry behavior,
and document download behavior are unchanged.

## Files changed

- IJTC route pages under `frontend-motorsport/src/app/events/indonesia-junior-talent-cup/`
- `frontend-motorsport/src/app/globals.css`
- `docs/PHASE_PROGRESS.md`
- `checklists/motorsport/motorsport_revamp_phase_checklist.md`

## Verification

- Motorsport TypeScript check passed.
- Motorsport lint passed with two existing warnings in Gallery and BrandLogo.
- Prettier check passed for all touched IJTC route files and shared CSS.
- Motorsport production build passed and generated all 50 routes, including all
  IJTC routes and rider detail routes.
- No CMS schema or route migration was required.
