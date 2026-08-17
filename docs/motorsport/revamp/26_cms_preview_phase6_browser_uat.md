# Motorsport CMS Preview Phase 6 Browser UAT

## Document status

- Phase: 6 - browser-based CMS Preview UAT
- Status: Partially verified; UAT scope remains open
- Date: 2026-08-15
- Scope: Strapi Preview button, draft mutations, locales, desktop/mobile, and
  shared-route propagation

## Environment

- Strapi: `http://localhost:1337`
- Motorsport frontend: `http://localhost:3001`
- CMS and PostgreSQL containers: running and healthy
- Playwright: 1.61.0
- Browser mode: headless Chromium
- Viewports tested: 1440x900 and 390x844
- Authenticated role: Motorsport Admin; Super Admin used only for temporary
  local API-token provisioning and cleanup

## Completed browser checks

- Public route smoke matrix: 26 route paths x 2 viewports = 52 checks.
- All 52 routes returned successful responses.
- No horizontal overflow detected.
- No browser console errors or page errors detected.
- English Draft Mode activation succeeded for IJTC overview.
- Indonesian Draft Mode activation succeeded for IJTC overview.
- Draft Mode set `__prerender_bypass` cookie.
- Invalid Preview secret returned `401`.
- Invalid Preview request set no draft cookie.
- English and Indonesian Preview pages rendered without overflow.

Routes included root, localized root, About, Events, IJTC overview, Experience,
Merchandise, Contact, Partners, Gallery, Tickets, and News hub paths.

## Authenticated mutation checks

- Motorsport Admin login passed.
- Representative scalar-field draft mutation, Strapi Preview, and restoration
  passed for Site Page, Event, News Article, Motorsport Program, Rider, Standing,
  Regulation, Partner, Gallery, Merchandise, Ticket CTA, Navigation, and Site
  records.
- Homepage hero slides and four dynamic Page Sections passed draft mutation,
  Preview, and restoration: 7/7 component checks.
- Indonesian Navigation localization passed draft mutation, `/id` Preview, and
  restoration.
- Successful CMS saves and restorations returned HTTP 200.
- Indonesian Draft Mode route matrix passed 40/40 checks at desktop and mobile
  viewports.
- Existing public route smoke matrix passed 52/52 checks at desktop and mobile
  viewports.

## Remaining open checks

These were not fully completed:

- Value mutation for every relation and media-picker field across every record.
- Full mutation sweep across all 20 Rider and 20 Standing records.
- Indonesian localized mutation for Site Pages, Events, News, Programs, Riders,
  Regulation, Gallery, and Merchandise records.
- Content Manager mobile Preview-button click itself. Strapi's responsive admin
  overlay intercepted direct clicks at 390px; equivalent mobile frontend Preview
  routes passed directly.

CMS inspection showed only English localized records for Site Pages, Events,
News, Programs, Riders, Regulations, Galleries, and Merchandise. These records
cannot expose Indonesian Content Manager Preview until Indonesian localizations
are created. Global/non-localized records and Navigation have Indonesian
Preview coverage.

## Confirmed defects fixed

- Strapi sends `status=modified` after saving a published record as draft;
  Preview now normalizes it to draft mode in CMS and frontend.
- Strapi sends empty `locale=` for non-localized records; Preview now treats it
  as English instead of returning HTTP 204.
- Draft UAT initially exposed stale local frontend API token. Temporary read-only
  token was provisioned at runtime, used for UAT, and deleted afterward. Future
  local Draft Mode runs require a valid `STRAPI_API_TOKEN` in frontend runtime.

## Required continuation

- Add approved Indonesian localizations before Indonesian CMS mutation UAT.
- Complete relation/media and all-record mutation sweeps before closing Phase 6.
- Keep Preview rollout status open until those checks and restoration pass.
