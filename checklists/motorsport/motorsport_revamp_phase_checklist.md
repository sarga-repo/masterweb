# Sarga Motorsport Revamp Phase Checklist

Use this checklist for the major revamp track in `docs/motorsport/revamp/`.

| Phase   | Scope                                                | Status | Date       | Notes                                                                                                                                                                                                                                                                                                    |
| ------- | ---------------------------------------------------- | ------ | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MSR-0   | Documentation and source alignment                   | Done   | 2026-08-08 | Source PDFs copied and revamp docs/prompts created.                                                                                                                                                                                                                                                      |
| MSR-1   | Discovery and inventory                              | Done   | 2026-08-08 | Current routes, CMS/seed content, assets, sitemap gaps, and future file map documented.                                                                                                                                                                                                                  |
| MSR-2   | CMS workspace and content model                      | Done   | 2026-08-08 | Four role-gated editor workspaces with scoped RBAC/nested dashboard navigation, six additive content types, generated types, and IJTC/FIA/merchandise demo seed delivered.                                                                                                                               |
| MSR-3   | Design system recalibration                          | Done   | 2026-08-08 | Recalibrated tokens and responsive IA navigation; normalized semantic hero/page/section/article/feature/card heading tiers; added reusable information band, discipline, campaign, gallery, schedule, standings, regulation, and event-program primitives.                                               |
| MSR-4   | Homepage revamp                                      | Done   | 2026-08-08 | CMS-ready Hero, discipline strip, Events/Ticket, News, interactive publications/leadership/ecosystem hub, reference-aligned Gallery wall, and Footer delivered with responsive QA and resilient media fallbacks.                                                                                         |
| MSR-5   | Core pages                                           | Done   | 2026-08-09 | About, Event, News, Gallery, Merchandise, Ticket, and Contact delivered with CMS/fallback data; Merchandise now includes a six-item generated product catalog and responsive 2–4 column grid; safe partner routing and no internal checkout retained.                                                    |
| MSR-6   | IJTC program pages                                   | Done   | 2026-08-09 | CMS-first IJTC hub, schedule, rider field, standings, About, controlled regulation download, and no-account rider inquiry delivered with desktop/mobile QA.                                                                                                                                              |
| MSR-7   | FIA Rallycross campaign page                         | Done   | 2026-08-09 | CMS-first FIA World Cup campaign with exact approved facts, three-slide banner, five-session rundown, six-item race-day guide, safe partner redirect, SEO/share metadata, and desktop/mobile QA.                                                                                                         |
| MSR-8   | Migration, QA, and launch readiness                  | Done   | 2026-08-10 | Canonical Rallycross redirect, clean sitemap, 80-case responsive route matrix, 51-link crawl, Lighthouse, conditional launch checklist, and Ubuntu/Nginx/Let's Encrypt handover completed.                                                                                                               |
| MSR-RD1 | Warm visual redesign source and implementation audit | Done   | 2026-08-09 | Relevant Look & Feel pages rendered and inspected; current surface, hero, typography, photography, route, and CMS gaps documented; no UI code changed.                                                                                                                                                   |
| MSR-RD2 | Redesign foundations and page-template specification | Done   | 2026-08-09 | Three-layer tokens, measured contrast rules, safer Owners/Noto type contract, centered Ticket-last navigation, accessible site-page carousel contract, and five route-template families approved. No public UI/schema change.                                                                            |
| MSR-RD3 | Global shell and homepage hero                       | Done   | 2026-08-09 | Light/dark foundations, corrected Owners/Noto loading, centered Ticket-last navigation, responsive CMS hero slides, accessible carousel, and warm desktop/mobile media delivered.                                                                                                                        |
| MSR-RD4 | Homepage editorial rebuild                           | Done   | 2026-08-09 | Homepage now alternates blue facts, restored dark gradient disciplines, warm copper events, muted clay/plum news, and dark functional media; four daylight assets plus a sixth Motorcycle chapter delivered with desktop/mobile QA.                                                                      |
| MSR-RD5 | Dedicated page redesign groups                       | Done   | 2026-08-09 | RD5.1–RD5.3 complete with desktop/mobile QA. All dedicated and retained compatibility routes now use the approved editorial, blue/heat, and reflected-light templates; form validation, secure partner routing, conditional ticket paths, Gallery modal, and catalog pagination contracts are preserved. |
| MSR-RD6 | Media, CMS, QA, and handover                         | Done   | 2026-08-10 | Media references, CMS roles/content, CMS-unavailable fallback, all application gates, strict Docker builds, browser interactions, Nginx syntax, and production handover validated.                                                                                                                       |

## Phase completion requirements

- Phase prompt executed only for that phase.
- Relevant docs updated.
- Quality gates run or explicitly documented as not applicable.
- Visual QA captured for frontend phases.
- CMS admin verified for CMS phases.
- `docs/PHASE_PROGRESS.md` updated.

## Global acceptance checks

- One shared Strapi instance remains in use.
- Gateway, Motorsport, and Horse Sport have distinct CMS workspace/menu entry points.
- Each managed site admin sees one workspace and only its `siteScope`; Super
  Admin sees all workspaces. Media remains a documented shared asset pool.
- Motorsport public sitemap follows `Sarga Motorsport 2.pdf`.
- Motorsport visual design follows the Motorsport section of the Look & Feel PDF.
- Dark premium Motorsport moments are preserved, while Warm White, Draftline
  Blue, and daylight photography prevent black from dominating the site.
- Ticketing remains redirect/deep-link/embed only.
- Merchandise does not include checkout or payment.
- Mobile and desktop navigation are clear.
- Desktop navigation is geometrically centered and Ticket is the final primary
  item; Contact sits immediately before it.
- Shared components support approved light, subtle, dark, blue, and image
  surface tones without hard-coded inverse text assumptions.
- SEO metadata and sitemap include new routes.
