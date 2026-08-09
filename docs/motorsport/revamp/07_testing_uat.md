# 07 - Testing And UAT

> MSR-RD6/MSR-8 technical execution is complete. Measured results, redirect
> decisions, Lighthouse scores, CMS/Docker evidence, and conditional production
> sign-offs are recorded in
> [`12_final_validation_launch_readiness.md`](12_final_validation_launch_readiness.md).

## Build gates

Run for touched workspaces:

```bash
pnpm lint
pnpm tsc --noEmit
pnpm build
```

For CMS changes:

```bash
cd cms
pnpm tsc --noEmit
```

## Browser QA

Test viewports:

- 375px mobile.
- 390px mobile.
- 768px tablet.
- 1024px small laptop/tablet landscape.
- 1280px laptop.
- 1366px laptop.
- 1440px desktop.

Checks:

- No horizontal overflow.
- Header/nav works on mobile and desktop.
- Ticket CTA remains visible and accessible.
- Hero text does not overlap key image subjects.
- Image mosaics preserve layout while loading.
- Standings/results remain readable on mobile.
- Regulation PDF download is accessible and labeled.
- Campaign page CTA and event metadata appear above the fold.
- Owners Wide headings are not clipped, overlapped, or cut off at any supported
  viewport or 200% browser zoom.
- Light and dark component variants preserve readable contrast, focus states,
  and hierarchy.
- Homepage carousel supports keyboard controls, touch/swipe where implemented,
  visible pagination, paused/non-autoplay reduced-motion behavior, and a static
  fallback when JavaScript or media is unavailable.
- Navigation is centered on desktop, uses the approved order, and ends with
  Ticket.
- Warm/light photography retains an intentional crop and does not hide key
  people, vehicles, merchandise, or event information.

## MSR-RD2 design-system QA contract

- Brand hex values exist only in the primitive token layer; components consume
  semantic or component aliases.
- Every shared content component supports its approved
  `light|subtle|dark|blue|image` tones without inherited contrast failures.
- Light-surface body and small text use only the documented AA-safe ink,
  Draftline Blue, Crimson 700, or Orange 800 values.
- Exact Apex Crimson and Ignition Orange are not used as small text on Warm
  White.
- Owners Wide resolves to the real 900 cut; Noto Sans resolves the requested
  400/500/700/800 body and UI weights without synthetic mapping from the Light
  file.
- Route screenshots are compared to the surface choreography for their assigned
  template in `11_redesign_foundations_page_templates.md`.

## CMS QA

Checks:

- Gateway editors can find Gateway workspace.
- Motorsport editors can find Motorsport workspace.
- Horse Sport editors can find Horse Sport workspace.
- Shared Library is clearly separated.
- Motorsport quick links filter Motorsport content.
- New records require or default to correct `siteScope`.
- Shared records do not leak publicly unless intended.
- Ticket CTAs validate safe redirect/deep-link/embed behavior.
- Motorsport hero slides are scoped correctly, ordered predictably, include
  useful alt text, and fall back to the existing single-hero fields during
  migration.

## Content QA

Checks:

- Homepage has Headline, Description, Upcoming Events, News, Gallery.
- About has Profile, Vision, What We Do, Meet The Team, Contact Us, Part of Sarga.co.
- Event hub exposes IJTC and FIA Rallycross.
- IJTC pages include schedule, riders, standings/results, about, regulation, and become-riders flow.
- FIA Rallycross campaign page includes date, venue, ticket CTA, banner slider, rundown, and do/donts.
- Merchandise does not imply checkout if checkout is not implemented.

## Accessibility

Checks:

- One H1 per page.
- Proper heading order.
- Visible focus states.
- Keyboard navigation works.
- Images have useful alt text.
- Decorative media is marked appropriately.
- Color contrast passes for meaningful text.
- Reduced-motion mode disables nonessential motion.

## SEO

Checks:

- Metadata per page.
- Open Graph/Twitter metadata for campaign/event pages.
- Canonical URLs.
- Sitemap includes new routes.
- Robots remains correct.
- Legacy route redirects are documented if added.

## UAT sign-off

UAT requires approval from:

- Brand/design owner.
- Motorsport content owner.
- CMS editor representative.
- Engineering owner.

No launch until all critical findings are resolved or explicitly accepted.
