# Motorsport CMS Visibility Validation and Fix Plan

## Objective

Make every CMS visibility control deterministic: `false` hides exactly its
owned public element, `true` renders it, missing optional controls preserve
documented fallback behavior, and CMS values never hide or reveal unrelated
elements.

Each phase owns one public page family. A phase closes only after CMS mutation,
draft Preview, published render, English/Indonesian route checks, desktop/mobile
checks, and restoration pass.

## Shared contract

- `Site Page.pageAvailability.pageEnabled=false` renders page-level Coming Soon;
  absent component means active page.
- `shared.page-section.enabled=false` hides only matching `sectionKey` block.
- `motorsport.about-capabilities.enabled=false` hides capability block;
  individual `card.enabled=false` hides only that card.
- `heroEnabled=false` hides only hero.
- Collection visibility fields filter collection records before mapping:
  `isActive`, `availabilityStatus`, `eventStatus`, `programStatus`, and the
  applicable `showOn*` flag.
- CMS `theme`, `media`, and `pageAvailability` values must either render or be
  explicitly documented as unsupported and removed from editor expectations.
- Header owns its dark text color independently from page content/theme.
- Draft Mode treats empty CMS data as authoritative; published fallbacks remain
  published-mode only.
- Every rendered CMS-controlled block receives `data-cms-section-key` and
  `data-cms-enabled` markers for browser assertions.

## Page phases

| Phase | Page family | CMS visibility surface | Primary validation |
| --- | --- | --- | --- |
| VIS-01 | About | hero, profile, capabilities, cards, team-intro, CTAs, leadership | Team text/photo ownership and exact section hide |
| VIS-02 | Homepage | hero, slides, video, info band, world, disciplines, ticket, sections | Independent block/card visibility |
| VIS-03 | Experience | hero, control, pillars, track, final CTA | CMS sections do not leak fallback blocks |
| VIS-04 | Contact | hero, inquiry, form, final CTA | Form and information visibility |
| VIS-05 | Partners | hero, control, partner network, partner `isActive` | Inactive partners excluded |
| VIS-06 | Tickets | hero, control, featured ticket, ticket `isActive` | CTA visibility and partner links |
| VIS-07 | Gallery | hero, intro, gallery collection | Gallery wall ownership documented/tested |
| VIS-08 | Merchandise | hero, collection, item availability | Hidden products excluded |
| VIS-09 | Events hub | hero, control, programmes, calendar, events | Hidden events/programmes excluded |
| VIS-10 | Event detail | event status, ticket CTAs, sections/SEO | Hidden event is not reachable/rendered |
| VIS-11 | News hub | hero, lead, archive, article flags | Lead/archive independent behavior |
| VIS-12 | News detail | article visibility flags, related content | Hidden/non-Motorsport article not rendered |
| VIS-13 | IJTC overview | programme status, page availability, overview sections | Coming Soon and section ownership |
| VIS-14 | IJTC schedule | programme status, schedule content | Hidden programme and empty schedule |
| VIS-15 | IJTC riders | programme status, rider `isActive` | Rider filtering and empty state |
| VIS-16 | IJTC rider detail | parent programme, rider `isActive` | Hidden rider not found |
| VIS-17 | IJTC standings | parent programme, standings relation | Parent/empty state behavior |
| VIS-18 | IJTC regulation | programme/regulation `isActive`, PDF | Inactive regulation and download state |
| VIS-19 | IJTC About | programme status, page sections | Hidden programme Coming Soon |
| VIS-20 | Become Riders | programme status, CTA sections | Hidden programme and inquiry route |
| VIS-21 | FIA Rallycross campaign | programme status, campaign sections, ticket | Every CMS section flag controls matching block |

## Global phase

Run after page phases:

- Header/nav enabled/order/emphasis/locale values.
- Header dark text contrast after CMS updates and on all surfaces.
- Footer link enabled state.
- Site chrome `isActive`, logos, theme, and fallback behavior.
- Sitemap, metadata, canonical/hreflang, no-index, route reachability.

## Required evidence per phase

- CMS field mutation matrix with original value and restoration result.
- Draft Preview output marker and expected hidden/rendered selector.
- Published output marker and expected hidden/rendered selector.
- English and Indonesian route result.
- 1440px and 390px browser assertions.
- Console/page-error, overflow, H1, main landmark, and image checks.
- Unit/regression test for each fixed contract.
- Phase entry in `docs/PHASE_PROGRESS.md`.
