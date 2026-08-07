# Sarga Motorsport UAT Checklist

## Branding

- [x] Logo is clear and uses correct variant.
- [x] Dark premium motorsport identity is visually distinct from Sarga.co gateway.
- [x] Colors follow Sarga Motorsport palette.
- [x] Display typography uses Owners Wide or approved fallback.
- [x] Body typography uses Noto Sans or approved fallback.

## Content

- [x] Homepage content can be managed from CMS.
- [x] Events display correct date, venue, status, and ticket CTA.
- [x] Motorsport news appears on motorsport site.
- [x] Shared motorsport teasers can appear on gateway when configured.

## Ticketing

- [x] Ticket buttons redirect/deep link to configured partner URL.
- [x] No internal checkout/payment is implemented.
- [x] Inactive ticket CTAs do not appear publicly.

## Cross-site behavior

- [x] Sarga.co gateway motorsport links go to dedicated motorsport site.
- [x] Motorsport footer can link back to Sarga.co group gateway.
- [x] Shared CMS content renders with each site's own design system.

## Technical

- [x] `docker compose up --build` starts gateway, motorsport, Strapi, and Postgres.
- [x] Gateway available on port 3000.
- [x] Motorsport available on port 3001.
- [x] Strapi available on port 1337.
- [x] Postgres available on host port 5435.

## SEO and accessibility

- [x] Page titles and descriptions are present.
- [x] Open Graph images are configured.
- [x] Images have alt text.
- [x] Navigation is keyboard accessible.
- [x] Contrast passes for primary text and CTAs.

## Phase 9 verification log (2026-07-04)

### Build status

| Project        | Lint | Typecheck | Build | Status |
| -------------- | ---- | --------- | ----- | ------ |
| Gateway        | ✅   | ✅        | ✅    | Pass   |
| Motorsport     | ✅   | ✅        | ✅    | Pass   |
| CMS (Strapi)   | N/A  | ✅        | N/A   | Pass   |

### Browser verification

| Check                              | Status | Notes                                          |
| ---------------------------------- | ------ | ---------------------------------------------- |
| Responsive — no horizontal overflow | ✅     | scrollWidth === clientWidth at all viewports   |
| Mobile menu toggle                 | ✅     | aria-expanded works, links present             |
| Cross-site nav (MS → GW)           | ✅     | Footer link → http://localhost:3000/           |
| Cross-site nav (GW → MS)           | ✅     | 2 links → http://localhost:3001/               |
| All images have alt text           | ✅     | 18/18 images have descriptive alt              |
| Heading hierarchy                  | ✅     | 1× H1, 11× H2, 15× H3 — no skips            |
| Primary text contrast              | ✅     | Cream on dark passes WCAG AA                   |
| Decorative label contrast          | ⚠️     | Low opacity (0.24–0.32) for decorative system labels |
| `<title>` tag                      | ✅     | "Sarga Motorsport — Racing, amplified."        |
| `<meta description>`               | ✅     | Present and descriptive                        |
| Open Graph tags                    | ✅     | og:title, og:description, og:type, og:image    |
| sitemap.xml                        | ✅     | 6 static URLs with changefreq/priority         |
| robots.txt                         | ✅     | Allows all, disallows /api/, refs sitemap      |
| Contact form — validation          | ✅     | Empty submit shows per-field errors           |
| Contact form — success             | ✅     | Valid submit shows "Message received"          |
| Contact form — loading state       | ✅     | Button disabled with "SENDING…" text           |

### Known gaps / caveats

- Contact form runs in **placeholder mode** locally (no real email). Production needs Strapi webhook or email service.
- Decorative system labels (section numbering, data rails) use low opacity for visual design purposes — acceptable for non-content text.
- Rate limiting is in-memory — resets on server restart. Production should use Redis.
- Manual responsive testing at 390px and 1440px recommended for visual QA sign-off.
# Sarga Motorsport UAT Checklist

## Branding

- Logo is clear and uses correct variant.
- Dark premium motorsport identity is visually distinct from Sarga.co gateway.
- Colors follow Sarga Motorsport palette.
- Display typography uses Owners Wide or approved fallback.
- Body typography uses Noto Sans or approved fallback.

## Content

- Homepage content can be managed from CMS.
- Events display correct date, venue, status, and ticket CTA.
- Motorsport news appears on motorsport site.
- Shared motorsport teasers can appear on gateway when configured.

## Ticketing

- Ticket buttons redirect/deep link to configured partner URL.
- No internal checkout/payment is implemented.
- Inactive ticket CTAs do not appear publicly.

## Cross-site behavior

- Sarga.co gateway motorsport links go to dedicated motorsport site.
- Motorsport footer can link back to Sarga.co group gateway.
- Shared CMS content renders with each site's own design system.

## Technical

- `docker compose up --build` starts gateway, motorsport, Strapi, and Postgres.
- Gateway available on port 3000.
- Motorsport available on port 3001.
- Strapi available on port 1337.
- Postgres available on host port 5435.

## SEO and accessibility

- Page titles and descriptions are present.
- Open Graph images are configured.
- Images have alt text.
- Navigation is keyboard accessible.
- Contrast passes for primary text and CTAs.
