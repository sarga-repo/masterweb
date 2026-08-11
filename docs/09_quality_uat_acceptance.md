# 09 — Quality, UAT, and Acceptance Criteria

## Global acceptance criteria

- Website is responsive on mobile, tablet, and desktop.
- Main navigation works.
- Footer links work.
- CMS-managed content renders correctly.
- Contact and newsletter forms work.
- Ticketing CTA links work.
- No internal payment/account/ticketing engine is implemented.
- SEO metadata exists for all public pages.
- Images are optimized and alt text is available.
- Website passes agreed UAT checklist.
- Deployment and handover documentation are complete.
- The UI is an original Sarga expression rather than a reconstruction of preview pages 1-5.
- Brand colors, Zalando Sans Expanded headings, Plus Jakarta Sans interface/body typography, graphic language, and cinematic image direction align with page 7.
- Typography, spacing, composition, imagery, interaction states, and responsive behavior meet the approved premium-quality bar.

## Browser support

- Latest Chrome
- Latest Safari
- Latest Firefox
- Latest Edge
- Mobile Safari
- Chrome Android

## Device coverage

- Mobile: 360px, 390px, 430px
- Tablet: 768px, 1024px
- Desktop: 1280px, 1440px, 1920px

## Functional QA

### Header/navigation

- Logo links to homepage.
- Desktop nav links correct pages/anchors.
- Mobile menu opens and closes.
- Ticket Hub CTA is visible.
- Active/hover/focus states work.

### Homepage

- Hero image/poster loads.
- An enabled CMS hero MP4/WebM autoplays only while muted and inline, exposes a
  keyboard-operable pause/play control, and returns to the poster on failure.
- `prefers-reduced-motion: reduce` does not mount or download the hero video.
- A Motorsport carousel renders no more than three slides and mounts video only
  for the active slide.
- Motorsport Race Control copy/labels and its selected Event relation render
  from the scoped Home Site Page; an invalid relation cannot surface another
  site's event.
- World of Motorsport renders at most six enabled cards in CMS order, uses
  managed image/link/alt/accent values, and preserves the approved responsive
  horizontal rail on mobile.
- Hero CTA works.
- About preview appears.
- Ecosystem cards appear.
- News cards appear.
- Newsletter form works.
- Footer appears.

### About

- Timeline items render.
- Tabs/sections work.
- Board/Company Structure cards render.
- Report links work if available.

### Ecosystem

- Pillar tabs/filter work.
- Business cards render from CMS.
- Card CTA opens correct detail page.
- Future business entries can be added from CMS.

### News

- News listing displays articles.
- Hot topic badge works.
- Sort/latest works.
- Detail page opens by slug.
- Missing slug returns 404.

### Ticket Hub

- Events display.
- Ticket CTA redirects to partner URL.
- External links use safe attributes.
- Past/hidden events are handled properly.

### Forms

- Required fields validate.
- Invalid email rejected.
- Success message appears.
- Error message appears on failure.
- Submission is stored/sent.
- Spam protection active.
- Stored inquiry has the correct fixed `sourceSite` and source locale.
- Public success is independent of SMTP availability.
- Internal notification routes only to its site's server allowlist.
- Indonesian and English templates match the submitted locale and escape HTML.
- Temporary SMTP failure records a safe code and retries; exhausted failures
  stop at the configured maximum.
- Newsletter subscriptions do not trigger transactional or campaign email.

## SEO QA

- `title` and `meta description` exist.
- Open Graph tags exist.
- Canonical URL exists.
- sitemap.xml generated.
- robots.txt generated.
- Article structured data if implemented.
- Event structured data if implemented.

## Performance QA

- Images are compressed.
- No oversized hero image on mobile.
- Hero videos use a poster, `preload="metadata"`, short compressed sources, and
  do not load inactive carousel slides.
- Lazy loading below the fold.
- No unnecessary third-party scripts.
- Lighthouse report captured.
- Core Web Vitals reviewed.

## Creative quality QA

- Every major page has a clear focal point and intentional editorial hierarchy.
- Layouts and components are not copied mechanically from preview pages 1-5.
- Brand graphics are purposeful and do not become repetitive wallpaper.
- Hero media uses cinematic sports/entertainment art direction and retains legible content across breakpoints.
- Desktop, tablet, and mobile compositions each feel intentionally designed.
- Hover, focus, loading, empty, and error states use the same visual language.
- Motion supports orientation or storytelling, honors `prefers-reduced-motion`, and does not block interaction.
- Creative treatments pass contrast, keyboard, readability, image-performance, and content-scaling checks.

## Security QA

- HTTPS active.
- No secrets in repo.
- Strapi admin not indexed.
- API permissions least privilege.
- Forms validate server-side.
- CORS configured.
- Rate limit/anti-spam active.
- From/To/template headers cannot be supplied by visitor input.
- Exchange OAuth2/STARTTLS is the default and target configuration.
- If the approved MAIL-4.1 compatibility mode is used, STARTTLS is still
  mandatory; the exact risk acknowledgement, protected runtime password,
  future expiry, and 2026-12-15 hard cutoff are verified fail-closed.
- No password, OAuth client secret, access token, or full visitor payload is
  written to application logs or committed files.

## UAT sign-off format

| Item                           | Status  | Notes | Owner        |
| ------------------------------ | ------- | ----- | ------------ |
| Homepage approved              | Pending |       | Sarga        |
| About approved                 | Pending |       | Sarga        |
| Ecosystem approved             | Pending |       | Sarga        |
| News approved                  | Pending |       | Sarga        |
| Ticket Hub approved            | Pending |       | Sarga        |
| Contact forms approved         | Pending |       | Sarga        |
| Mobile layout approved         | Pending |       | Sarga        |
| SEO reviewed                   | Pending |       | Vendor/Sarga |
| Production deployment approved | Pending |       | Vendor/Sarga |

## Bilingual and dynamic-navigation acceptance

- Every route matrix runs in English and Indonesian across all three domains.
- Existing English URLs and visual output remain regression baselines.
- Indonesian URLs set `lang=id`, `id_ID`, canonical, hreflang, structured data,
  sitemap alternates, and translated application controls correctly.
- Missing translations use whole-record English fallback and remain `noindex`.
- CMS navigation toggles, ordering, CTA emphasis, desktop/mobile parity,
  active-state normalization, unsafe-link rejection, cache invalidation, empty
  configured menus, and CMS-outage fallback are tested.
- Five CMS roles are tested across both locales, including direct URLs,
  submitted foreign scope, localization cloning, relations, and publish state.
- For every managed role, required `siteScope` is readable by Strapi's form
  validator but absent from create/update fields. Motorsport Admin can replace
  a Site Page `heroSlides.image`, save, and publish without changing ownership.
- No header overflows at target viewports with the maximum eight enabled items.

### GWR-CMS-5 completed checks

- Restored the pre-change database into an isolated rehearsal database and
  reconciled all original documents, media rows, and uploaded files.
- Verified both locale APIs, stable structural parity, unsafe URL rejection,
  the eight-enabled-item limit, and locale-administration denial for managed
  roles.
- Passed the authenticated five-role workspace matrix plus dynamic-zone,
  single/repeatable component, relation, clone, draft/publish, and cleanup
  scenarios in both locales.
- Passed focused unit tests, TypeScript, generated types, production CMS build,
  and Docker configuration/image smoke.

### GWR-CMS-6 completed checks

- Passed Gateway typecheck, 36 unit tests, lint, and production build.
- Passed Strapi production admin build with the localized navigation API live.
- Verified `/id` remains visible, sets `<html lang="id">`, localizes desktop and
  mobile navigation, preserves active state, and switches back to the exact
  English path with a full document navigation.
- Verified CMS label/order/CTA consumption, unsafe-link/disabled-item unit
  coverage, localized form responses, canonical/hreflang output, `id-ID`
  structured data, and `noindex` on English fallback records.

### GWR-CMS-7 completed checks

- Passed Gateway, Motorsport, and Horse Sport TypeScript/lint; passed all three
  production builds plus 36 Gateway and 10 Horse Sport unit tests.
- Browser UAT at 1280px and 390px confirmed clear language dropdowns, CMS menu
  sources, localized desktop/mobile links, `/id` persistence, no horizontal
  overflow, localized canonicals/hreflang, and safe English fallback `noindex`.
- Confirmed dedicated-site cross-links retain `/id`, contact/newsletter payloads
  capture `sourceLocale`, and operational programme routes still build.
- Focused CMS RBAC tests passed for both locales. Authenticated runtime scripts
  require the non-committed `CMS_UAT_*` credentials and are repeated in
  GWR-CMS-8 staging UAT.

Complete staging migration and launch UAT remain in GWR-CMS-8.

### GWR-CMS-8 local completion and remaining staging gates

- Restored the current CMS into an isolated PostgreSQL rehearsal database and
  reconciled 21 content types, 304 API rows, 84 media records, 546 upload
  files, and 222,600,452 upload bytes with zero drift.
- Passed the authenticated five-role workspace, localized navigation, and
  localized content/component UAT harnesses against the restored CMS.
- Playwright at 1280 × 720 and 390 × 844 passed all three sites for `/id`,
  language controls, dynamic navigation, canonical/hreflang, fallback
  `noindex`, cross-site locale retention, sitemap/robots, and overflow.
- Fixed cross-site links that dropped `/id` and corrected the Indonesian home
  alternate in all three sitemaps.
- CMS mail/access tests, TypeScript, and production admin build passed;
  Gateway and Horse Sport lint/type/tests/build passed; Motorsport lint and
  typecheck passed while its user-owned development server remained running.
- Docker Compose configuration and `git diff --check` passed.

The current completeness report has 96 English-published documents, 21
Indonesian-published navigation documents, and 75 documents awaiting
Indonesian editorial translation/review. Staging archive import, HTTPS-domain
five-role/browser UAT, media URL verification, rollback drill, translation
owner sign-off, and final launch approval remain mandatory external gates.
