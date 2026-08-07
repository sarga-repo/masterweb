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

- Hero image loads.
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
