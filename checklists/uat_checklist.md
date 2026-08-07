# Sarga.co UAT Checklist

Use this checklist against a production build with realistic Strapi content.
Record `Pass`, `Fail`, `Blocked`, or `N/A`, plus a URL/screenshot or issue link.

## Automated quality gate

Run from `frontend/`:

```bash
pnpm quality
```

- [ ] Formatting passes.
- [ ] ESLint passes.
- [ ] TypeScript passes through `pnpm typecheck`.
- [ ] Vitest unit and form-validation tests pass.
- [ ] Next.js production build succeeds.
- [ ] Strapi `pnpm exec tsc --noEmit` and `pnpm build` succeed.

## Device and browser matrix

Test the latest stable versions available to the UAT team.

| Platform        | Width/device        | Status  | Evidence/notes |
| --------------- | ------------------- | ------- | -------------- |
| Chrome desktop  | 1280, 1440, 1920 px | Pending |                |
| Safari desktop  | 1280 or wider       | Pending |                |
| Firefox desktop | 1280 or wider       | Pending |                |
| Edge desktop    | 1280 or wider       | Pending |                |
| Mobile Safari   | 360, 390, 430 px    | Pending |                |
| Chrome Android  | 360, 390, 430 px    | Pending |                |
| Tablet          | 768 and 1024 px     | Pending |                |

At every width:

- [ ] No horizontal page scrolling, clipped copy, overlapping controls, or
      illegible hero text.
- [ ] Navigation, menus, tabs, forms, cards, and CTAs remain usable.
- [ ] Images retain intentional crops and important subjects remain visible.

## Functional journeys

### Global navigation

- [ ] Logo returns to the homepage.
- [ ] Desktop navigation, mobile menu, Ticket Hub CTA, and footer links work.
- [ ] Keyboard focus is visible and follows a logical order.

### Homepage and About

- [ ] Hero, About preview, Ecosystem, News, Ticket Hub, newsletter, and footer render.
- [ ] Board of Directors and Company Structure gateways open correctly.
- [ ] History, leadership, and report states render without layout breakage.

### Ecosystem and News

- [ ] Ecosystem pillar tabs update the visible portfolio and expose selected state.
- [ ] Business cards and dynamic detail routes work; missing slugs show 404.
- [ ] News category filtering and pagination preserve useful URLs.
- [ ] Article body, related content, sharing links, and missing-slug 404 work.

### Forms

- [ ] Required fields and invalid email/message values show field errors.
- [ ] Contact and newsletter success states are announced to assistive technology.
- [ ] Failure and rate-limit states remain actionable.
- [ ] Production submissions are retained in Strapi or the approved delivery service.
- [ ] Honeypot/timing protection works; approved reCAPTCHA integration is verified if enabled.

### Ticketing

- [ ] Published event cards and detail routes render correct CMS content.
- [ ] Redirect/deep-link CTA uses only the configured partner URL.
- [ ] External links use safe target/rel attributes.
- [ ] Embeds render only for allowlisted HTTPS hosts; unapproved URLs show no iframe.
- [ ] No internal checkout, payment fields, or public account flow exists.

## Accessibility checks

- [ ] One descriptive `h1` per page and logical heading hierarchy.
- [ ] Header, main, navigation, footer, forms, tabs, and articles use semantic landmarks.
- [ ] Images have useful alt text; decorative graphics are ignored by assistive technology.
- [ ] Every form control has a label, error association, and keyboard access.
- [ ] Tab/tabpanel controls expose roles and selected state.
- [ ] Text and interactive states meet WCAG 2.2 AA contrast targets.
- [ ] Page remains usable at 200% zoom and with enlarged text.
- [ ] `prefers-reduced-motion: reduce` removes non-essential transitions/animation.
- [ ] Skip link and visible focus rings work without trapping focus.
- [ ] Success/error meaning is not communicated by color alone.

## Performance checklist

- [ ] Test a production build, not `next dev`.
- [ ] Capture Lighthouse mobile and desktop reports for `/`, `/news`, and one detail route.
- [ ] Review LCP, CLS, INP/TBT, image delivery, unused JavaScript, and font loading.
- [ ] Confirm above-the-fold media uses responsive `next/image` sizes.
- [ ] Confirm below-the-fold images and partner iframe use lazy loading.
- [ ] Confirm no unnecessary third-party scripts or oversized client bundles were introduced.
- [ ] Spot-check throttled mobile navigation and back/forward behavior.

Recommended pre-launch targets: Performance ≥ 80, Accessibility ≥ 90, Best
Practices ≥ 90, SEO ≥ 90. Any exception requires an owner and documented reason.

## CMS content stress tests

- [ ] Titles at 20, 80, and 160 characters wrap without collision.
- [ ] Descriptions at 0, 300, and 1,500 characters remain readable.
- [ ] Missing optional images, author, venue, date, CTA, gallery, and relations show intentional states.
- [ ] Empty and 12+ item collections remain usable.
- [ ] Portrait/landscape images with imperfect focal points remain legible.
- [ ] Indonesian names, punctuation, degree symbols, ampersands, and long unbroken URLs do not break layouts.
- [ ] Draft, hidden, past, coming-soon, and unpublished content behaves as specified.

## Brand and creative quality

- [ ] Page 7 brand colors, Zalando Sans Expanded headings, Plus Jakarta Sans body/interface type, graphic language, and cinematic image direction are preserved.
- [ ] Pages are original compositions rather than mechanical copies of preview pages 1–5.
- [ ] Every major page has a clear focal point and editorial reading order.
- [ ] Racing graphics are purposeful accents, not repetitive wallpaper.
- [ ] Mobile, tablet, and desktop compositions feel intentionally art-directed.
- [ ] Motion clarifies hierarchy or energy and never blocks interaction.
- [ ] Hover, focus, loading, empty, success, and error states share one visual language.

## SEO and security

- [ ] Unique title, description, canonical, Open Graph, and Twitter metadata exist.
- [ ] Article/Event JSON-LD validates; sitemap and robots contain production URLs.
- [ ] No secrets or admin tokens appear in client bundles or repository files.
- [ ] HTTPS, production CORS, least-privilege Strapi permissions, backups, and admin MFA are verified in the deployment environment.

## Sign-off

| Area                         | Status  | Owner        | Evidence/issue |
| ---------------------------- | ------- | ------------ | -------------- |
| Homepage                     | Pending | Sarga        |                |
| About and governance         | Pending | Sarga        |                |
| Ecosystem                    | Pending | Sarga        |                |
| News                         | Pending | Sarga        |                |
| Ticket Hub                   | Pending | Sarga        |                |
| Forms and submission storage | Pending | Sarga/Vendor |                |
| Accessibility                | Pending | Vendor/Sarga |                |
| Mobile and cross-browser     | Pending | Vendor/Sarga |                |
| Performance                  | Pending | Vendor       |                |
| SEO                          | Pending | Vendor/Sarga |                |
| Production deployment        | Pending | Sarga        |                |
