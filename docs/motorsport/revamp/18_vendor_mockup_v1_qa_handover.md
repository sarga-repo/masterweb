# MSR-MOCKUP-4 — Vendor Mockup QA and Handover

## Status

Repository validation and authenticated local CMS UAT completed: 2026-08-14.
Vendor visual comparison and credentialed staging UAT remain external launch
gates.

## Repository verification

- `frontend-motorsport`: lint, TypeScript, and production build passed.
- Build output includes the canonical `/events/[slug]` route, preserved IJTC
  route family, legacy campaign route, preview route, sitemap, and all existing
  dedicated pages.
- Existing preview-related working-tree changes were preserved.

## Required checks

- Compare Home, About, Event, FIA, News, Tickets, and footer composition against
  the corresponding vendor PDF pages at desktop and mobile widths.
- Open and close the Event dropdown by mouse, touch, Enter/Space, Escape, and
  outside click; verify focus restoration and mobile nested links.
- Verify FIA canonical route and permanent redirect from `/campaign/...`.
- Set IJTC hidden and verify menu removal plus Coming Soon routes; re-enable it
  and verify the full programme returns.
- Verify English and Indonesian navigation/programme labels.
- Verify Motorsport Admin cannot access another site scope and Super Admin can.
- Verify preview/draft requests remain site-scoped and public requests remain
  published-only.
- Verify Ticket CTA allowlisting, external redirect behavior, image fallback,
  reduced-motion behavior, focus visibility, and contrast.
- Run CMS tests/build, frontend lint/typecheck/build, route smoke tests, and
  Docker Compose checks.

## Authenticated Strapi UAT — 2026-08-14

- Local Strapi was started with the existing PostgreSQL and upload volumes. The
  stale dependency-only `strapi_node_modules` volume was recreated; database
  content and uploaded assets were not removed.
- Motorsport Admin resolves to the Sarga Motorsport workspace and exposes the
  Motorsport collection set, including Motorsport Program, Rider, Standing,
  Regulation, Site Page, Event, News, Ticket CTA, and Top Navigation Item.
- Gateway Admin resolves to the Sarga Gateway workspace and exposes the Gateway
  collection/single-type set; Motorsport-only collections are absent.
- Horse Sport Admin resolves to the Sarga Horse Sport workspace and exposes the
  Horse Sport collection set; Motorsport-only collections are absent.
- Shared Library Admin resolves to Shared Library and exposes shared content
  types; site-specific Motorsport collections are absent.
- Each role login displayed the expected identity and workspace. No role was
  granted another site workspace during this check. Super Admin was not
  exercised in this local pass.

## Conditional Event visibility decision

- The published Indonesia Junior Talent Cup programme was changed from
  `registrationOpen` to `hidden` in the authenticated Motorsport Admin UI.
- Strapi persisted and published the hidden state, proving the conditional
  visibility control is editable by the site admin.
- The original `registrationOpen` value was restored and republished immediately
  after the check; no lasting content change was left by UAT.
- The public dropdown/Coming Soon rendering still requires a running frontend
  server for final browser evidence. The code contract and repository build
  already cover hidden IJTC handling.

## Remaining launch-gate execution — 2026-08-14

- Super Admin login passed. The navigation exposed Gateway, Motorsport, Horse
  Sport, Shared Library, Content Manager, Media Library, Content-Type Builder,
  Marketplace, and Settings.
- Public Motorsport homepage passed on `http://localhost:3001`: the accessible
  primary navigation, three-slide hero, six discipline links, events/news,
  gallery, sponsor, subscription, and shared footer regions rendered.
- Responsive navigation passed at the browser's compact viewport state: the
  navigation disclosure opened and the Event disclosure exposed its child menu.
- The local CMS returned the two published Motorsport programmes to the public
  data path. The attempted hidden-state public route check exposed a local
  development cache/fallback limitation: the IJTC route continued to render
  the curated published fallback while Strapi reported `programStatus=hidden`.
  The record was restored to `registrationOpen` and republished immediately.
- Canonical FIA route now returns `200`; the legacy campaign route returns a
  permanent `308` to the canonical Event route. This found and fixed a reversed
  redirect that previously caused an infinite loop.
- Motorsport lint, TypeScript, and production build passed after the redirect
  fix. Docker Compose services PostgreSQL and Strapi were healthy during the
  checks. Gateway responded on port 3002; Horse Sport responded on port 3002's
  configured local service check. No staging VM or production host was accessed.

## Handover caveats

Final vendor logo and photography are still content-only replacements. Staging
credentialed role/browser evidence and external ticket URL confirmation remain
deployment gates.
