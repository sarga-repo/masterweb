# 01 — Reference and Current-State Audit

## Reference findings

The Website Sarga.co Preview presents a clear page rhythm:

1. A compact black navigation bar.
2. A warm, cinematic ecosystem hero combining horse sport and motorsport with
   controlled diagonal brand geometry.
3. A light editorial About block with a concise introduction and an interactive
   history/leadership/report panel.
4. A red-to-orange 360° Ecosystem feature area with category switching.
5. A restrained publication grid on a calm neutral surface.
6. A dark slate footer with clear group and contact pathways.

The Brand Visual Preview defines the core palette as Racing Red `#E4301C`,
Midnight Black `#12141B`, Slate Grey `#4B525B`, Silver Grey `#C5C7CA`, display
type in Zalando, and body/interface type in Plus Jakarta Sans. Photography is
bright, energetic, warm, and motion-led rather than uniformly dark.

## What the current Gateway already does well

- Uses a black shell, Sarga red/orange accents, a strong hero, and a clear
  Gateway identity.
- Loads Plus Jakarta Sans and local Zalando Expanded font files.
- Follows the reference navigation order and keeps Ticket Hub as the final,
  highlighted action.
- Uses the correct homepage content sequence: Hero, About, Ecosystem, News,
  ticket CTA, newsletter, and footer.
- Provides a CMS-backed ecosystem hub and a reusable ecosystem detail template.
- Correctly deep-links Motorsport and Horse Sport to their dedicated sites.

## Gaps to resolve

### Visual and layout

- The hero is darker and denser than the reference, with additional system
  metrics and metadata competing with the primary message.
- Display headings can become too large or wrap awkwardly at laptop and tablet
  widths. The system lacks a single documented type scale and line-length rule.
- Interior pages depend heavily on one dark hero treatment, so dedicated pages
  do not yet have the varied editorial layouts suggested by the reference.
- Photography is not consistently warm, bright, kinetic, or ecosystem-led.
- The About and ecosystem presentations are structurally close to the reference
  but need stronger content hierarchy and more deliberate responsive states.

### Typography

- The repository contains Zalando Expanded Regular and SemiBold only. The
  reference calls for an ExtraBold display treatment, so the approved/licensed
  ExtraBold file must be obtained before final typography sign-off.
- Current CSS maps SemiBold into the `700` slot. This is acceptable as a
  temporary fallback but must not be presented as the final ExtraBold asset.
- Heading wrapping, maximum width, line-height, and overflow checks are not yet
  standardised across all Gateway routes.

GWR-2 resolution (2026-08-10): the official OFL-licensed Google Fonts variable
file is now bundled locally and supplies the real `800` ExtraBold weight. The
temporary SemiBold-to-bold mapping is no longer used. Shared display tokens and
cross-route overflow guards now own heading size, wrapping, and line height.

### Information architecture

Existing routes cover Home, About, Board, Company Structure, Ecosystem,
News, Careers, Contact, and Ticket Hub. The target sitemap also requires clear
destinations for:

- History
- Annual Report
- Sustainability Report
- Press Releases
- Sarga Venues
- Sarga Media
- Sarga Tech

### CMS and runtime

- `Ecosystem Business` already has `businessStatus`, but a `comingSoon` record
  currently reaches the same full detail template instead of a dedicated
  Coming Soon experience.
- Page publication readiness is currently mixed with business lifecycle state.
  Editors need an explicit, understandable page-availability control.
- Sarga Venues, Sarga Media, and Sarga Tech exist in seed/mock data as Coming
  Soon records, providing a good migration base.
- Existing local browser inspection exposed a Strapi `400` response for an
  ecosystem-business request and a Next Image `fill` positioning warning in the
  hero path. Both are implementation-phase defects, not spec blockers.

## Design conclusion

This is a recalibration, not a replacement. Preserve the existing palette,
content order, motion discipline, routing foundations, and CMS architecture.
Change the composition, type discipline, imagery, and page-specific storytelling
needed to align with the approved Sarga.co reference.
