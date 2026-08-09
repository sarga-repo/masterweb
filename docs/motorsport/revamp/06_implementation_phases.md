# 06 - Implementation Phases

## Phase MSR-0 - Documentation and source alignment

Status: complete when this package is reviewed.

Deliverables:

- Source PDFs copied into `reference/source-pdfs/`.
- Revamp docs under `docs/motorsport/revamp/`.
- Codex prompts under `prompts/motorsport/revamp/`.
- UAT/checklist updates.
- README/AGENTS references.

## Phase MSR-1 - Discovery and inventory

Deliverables:

- Current route/content inventory.
- CMS content inventory by `siteScope`.
- Gap list against `Sarga Motorsport 2.pdf`.
- No public UI changes.

## Phase MSR-2 - CMS workspace and content model preparation

Deliverables:

- Dedicated role-gated editor workspace/menu for Gateway, Motorsport, Horse
  Sport, and Shared Library, with grouped dashboard sub-navigation and enforced
  `siteScope` access.
- Required content models or schema extensions.
- Seed/demo Motorsport records for IJTC, FIA Rallycross, and Merchandise.
- Updated Strapi docs and generated type checks.

## Phase MSR-3 - Motorsport design system recalibration

Status: complete on 2026-08-08.

Deliverables:

- Tailwind/CSS tokens checked against Look & Feel PDF.
- Header/nav revised to match the new IA.
- Shared page primitives for campaign banners, discipline tiles, image mosaics, event-program subnav, standings tables, schedule cards, and regulation download panels.
- Accessibility and reduced-motion guards.

## Phase MSR-4 - Homepage revamp

Status: complete on 2026-08-08.

Deliverables:

- Homepage rebuilt around the new source sitemap sections.
- Hero with headline and description.
- Upcoming Events.
- News.
- Gallery.
- Ticket CTA.
- Footer.

## Phase MSR-5 - About, Event hub, Ticket, Gallery, News, Contact, Merchandise

Status: complete on 2026-08-09.

Deliverables:

- About page sections from the sitemap PDF.
- Event hub with IJTC and FIA Rallycross entries.
- News listing/detail retained and visually recalibrated.
- Gallery redesigned to match the PDF mosaic direction.
- Merchandise page added without checkout.
- Ticket page retained as partner redirect/deep-link hub.
- Contact page retained and scoped to Motorsport inquiries.

## Phase MSR-6 - IJTC program pages

Status: complete on 2026-08-09.

Deliverables:

- IJTC hub.
- Race Schedule.
- Rider Profiles.
- Standing Points & Results.
- About IJTC.
- Regulation with PDF download.
- Become Riders inquiry path.

Implementation notes:

- All seven routes share a persistent responsive IJTC subnav and CMS-first
  programme data adapter with explicit local/demo fallbacks.
- The rider directory is paginated at 12 entries (maximum 4×3), while a single
  dynamic `/riders/[riderSlug]` template serves every CMS rider profile.
- The demonstration seed contains 20 fictional riders and matching standings,
  eight schedule rounds, 20 supplied grid portrait crops, and an image-failure
  silhouette fallback. Rider media can replace each relation independently in
  Strapi.
- Regulation files are public only when an active CMS record has an approved
  PDF; the seed intentionally remains pending.
- Become Riders is a contact inquiry through the existing validated endpoint,
  not an account, application portal, selection decision, or payment flow.

## Phase MSR-7 - FIA Rallycross campaign page

Status: **Complete — 2026-08-09**

Deliverables:

- Campaign page for FIA Rallycross World Cup Indonesia 2026.
- Banner, headline, date, venue, ticket CTA.
- Banner slider.
- Rundown.
- Do and donts.
- SEO and campaign share metadata.

Implementation notes:

- Shipped one CMS-first, statically discoverable campaign template at
  `/campaign/fia-rallycross-world-cup-indonesia-2026`.
- Reused the existing Motorsport programme, campaign-slide, rundown, rule,
  ticket CTA, media, and SEO models; no duplicate event or checkout model was
  introduced.
- Seed completion is idempotent and adds the approved local campaign media only
  when the existing FIA record is incomplete.
- Validated the three-slide control, exact campaign facts, five rundown cards,
  six race-day rules, safe external ticket link, metadata, and responsive layout.

## Phase MSR-8 - Migration, QA, UAT, and launch readiness

Deliverables:

- Redirect/legacy route decision.
- Full QA and UAT checklist.
- Lighthouse/performance pass.
- CMS editor acceptance.
- Deployment/handover update.

## Warm visual redesign sub-phases - post MSR-5

The existing MSR-3 through MSR-5 implementation is being recalibrated through
a controlled redesign track based on the page-accurate Look & Feel audit in
`10_warm_visual_redesign_audit.md`.

| Sub-phase | Scope                                                                                  | Status              |
| --------- | -------------------------------------------------------------------------------------- | ------------------- |
| MSR-RD1   | Reference, runtime, typography, route, and CMS audit; no UI changes                    | Complete 2026-08-09 |
| MSR-RD2   | Light/dark tokens, heading scale, navigation, carousel and page-template specification | Complete 2026-08-09 |
| MSR-RD3   | Global shell, centered navigation, and clean warm hero carousel                        | Complete 2026-08-09 |
| MSR-RD4   | Homepage editorial and photography rebuild                                             | Complete 2026-08-09 |
| MSR-RD5   | Dedicated pages delivered and approved in three controlled groups                      | Complete 2026-08-09 |
| MSR-RD6   | Media completion, CMS validation, cross-route QA, Docker Compose, and handover         | Complete 2026-08-10 |

Do not continue directly into MSR-6 or MSR-7 using the current black-default
semantic layer. Those phases must inherit the approved MSR-RD2 foundations.

## Phase rule

Each phase must update `docs/PHASE_PROGRESS.md` and `checklists/motorsport/motorsport_revamp_phase_checklist.md` before finishing.
