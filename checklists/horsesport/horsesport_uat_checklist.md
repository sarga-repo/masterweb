# Sarga Horse Sport UAT Checklist

## Content and routing

- [x] Gateway Horse Sport ecosystem card opens Horse Sport site
- [x] Horse Sport homepage loads CMS content
- [x] Horse Sport events list only Horse Sport/shared eligible events
- [x] Horse Sport news list only Horse Sport/shared eligible news
- [x] Gateway teasers deep-link to Horse Sport when canonical
- [x] Ticket CTA opens partner redirect/deep link

## Design

- [x] Looks premium and equestrian-specific
- [x] Does not look like a copied gateway page
- [x] Does not look like Motorsport design
- [x] Logo is clean and readable on dark and light backgrounds
- [x] Hero imagery follows Horse Sport brand direction

## Technical

- [x] `frontend-horsesport` runs locally on port 3002
- [x] Docker profile can run Horse Sport app
- [x] Build succeeds
- [x] No TypeScript errors
- [x] Environment variables documented

## SEO and accessibility

- [x] Metadata present
- [x] Open Graph image present
- [x] Sitemap and robots generated
- [x] Keyboard navigation works
- [x] Image alt text supported
- [x] Reduced motion respected

## Phase 9 verification log (2026-07-06)

### Build status

| Check                       | Result | Notes                                     |
| --------------------------- | ------ | ----------------------------------------- |
| `pnpm build`                | ✅     | 20/20 static pages, 0 errors / 0 warnings |
| TypeScript (`tsc --noEmit`) | ✅     | Clean                                     |
| ESLint                      | ✅     | Exit 0                                     |
| Unit tests (`vitest run`)   | ✅     | 10/10 (validation + ticketing safe-url)   |

### Responsive QA (no horizontal overflow)

| Viewport         | Result | Notes                                  |
| ---------------- | ------ | -------------------------------------- |
| Mobile (375px)   | ✅     | scrollWidth === clientWidth            |
| Tablet (768px)   | ✅     | scrollWidth === clientWidth            |
| Desktop (1440px) | ✅     | scrollWidth === clientWidth            |
| Mobile menu      | ✅     | aria-expanded toggles; full nav + CTAs |

### CMS filtering (live Strapi)

| Check                               | Result | Notes                                             |
| ----------------------------------- | ------ | ------------------------------------------------- |
| `horsesport` scope renders          | ✅     | 2 events, 3 news on live CMS                      |
| `shared` scope included in query    | ✅     | `siteScope $in [horsesport, shared]`              |
| `motorsport` scope excluded         | ✅     | 4 motorsport events not returned to HS query      |
| `hidden` scope excluded             | ✅     | 0 leaks (structurally excluded by `$in`)          |
| Business gate (`sarga-horse-sport`) | ✅     | events by `business`, news by `relatedBusinesses` |

### Cross-site (gateway deep-links — HS-7)

| Check                                | Result | Notes                                    |
| ------------------------------------ | ------ | ---------------------------------------- |
| Gateway ecosystem card → Horse Sport | ✅     | → http://localhost:3002/ (target=_blank) |
| Gateway footer link → Horse Sport    | ✅     | → http://localhost:3002/                 |
| Motorsport footer → Horse Sport      | ✅     | cross-site link present                  |
| Horse Sport → gateway / motorsport   | ✅     | header + footer + mobile menu            |

### Ticketing

| Check                           | Result | Notes                                     |
| ------------------------------- | ------ | ----------------------------------------- |
| Ticket CTA redirects to partner | ✅     | opens partner URL, `target=_blank`        |
| External links safe attributes  | ✅     | all `rel` include noreferrer/noopener     |
| URL safety (safe-url gate)      | ✅     | HTTPS-only; deep-link + embed allowlisted |
| No internal checkout / accounts | ✅     | partner redirect only                     |
| Embed only when allowlisted     | ✅     | empty allowlist disables iframe           |

### Forms (contact — server-validated)

| Check                      | Result | Notes                           |
| -------------------------- | ------ | ------------------------------- |
| Valid submission           | ✅     | 200 → success state             |
| Required/format validation | ✅     | 400 with per-field errors       |
| Honeypot rejection         | ✅     | filled `website` → 400          |
| Timing check               | ✅     | instant submit → 400            |
| Rate limiting              | ✅     | 6th request in window → 429     |
| `sourceSite=horsesport`    | ✅     | tagged on persisted inquiry     |
| Placeholder mode (local)   | ✅     | validates without a write token |

### SEO metadata

| Check                   | Result | Notes                                        |
| ----------------------- | ------ | -------------------------------------------- |
| `<title>` + description | ✅     | per-page via `createMetadata`                |
| Canonical URL           | ✅     | per-page (`alternates.canonical`)            |
| Open Graph + Twitter    | ✅     | og:title/type/image + summary_large_image    |
| sitemap.xml             | ✅     | 15 URLs incl. dynamic event/news detail      |
| robots.txt              | ✅     | allow /, disallow /api/, sitemap ref         |
| Structured data         | ✅     | Organization (site-wide), Event, NewsArticle |

### Accessibility smoke check

| Check                     | Result | Notes                                        |
| ------------------------- | ------ | -------------------------------------------- |
| Image alt text            | ✅     | homepage 20/20, events 5/5                    |
| Heading hierarchy         | ✅     | 1× H1, no skips (H1→H2→H3)                    |
| Skip-to-content link      | ✅     | present, focusable                           |
| Main landmark             | ✅     | `<main id="main">`                           |
| Keyboard focus states     | ✅     | `:focus-visible` outline in globals          |
| Reduced motion            | ✅     | animations gated by `prefers-reduced-motion` |
| Primary text contrast     | ✅     | cream on near-black passes WCAG AA           |
| Decorative label contrast | ⚠️     | kickers/labels use low opacity by design     |

### Performance

| Check                         | Result | Notes                                        |
| ----------------------------- | ------ | -------------------------------------------- |
| Lighthouse                    | ⏭️     | CLI not installed locally — run in CI/hosted |
| Image optimization            | ✅     | `next/image`; below-fold images lazy         |
| Hero image priority           | ✅     | hero eager; no oversized mobile hero         |
| Known-slug pages pre-rendered | ✅     | event/news detail are SSG (`●`)              |

### Known gaps / caveats

- **Soft-404 on unknown detail slugs**: unknown `/events/[slug]` and
  `/news/[slug]` render the correct not-found UI but return HTTP **200**, not
  404. This is a Next.js 16 behavior for on-demand ISR routes (shared by the
  gateway/motorsport frontends, which use the identical `generateStaticParams` +
  `notFound()` pattern). A hard 404 status would require `dynamicParams = false`,
  which breaks ISR for CMS content added after build. Truly unrouted paths return
  404 normally.
- **Contact form placeholder mode** locally (no Strapi write). Production sets
  `FORM_SUBMISSION_MODE` and a write token to persist inquiries.
- **Rate limiting is in-memory** — resets on server restart. Production should
  use a shared store (e.g. Redis).
- **Lighthouse** not run (CLI unavailable in this environment) — capture in
  CI/hosted preview before go-live.
- Decorative labels use low opacity intentionally (non-content text).

## UAT sign-off format

| Item                           | Status  | Notes | Owner        |
| ------------------------------ | ------- | ----- | ------------ |
| Homepage approved              | Pending |       | Sarga        |
| About approved                 | Pending |       | Sarga        |
| Events / Event detail approved | Pending |       | Sarga        |
| News / News detail approved    | Pending |       | Sarga        |
| Tickets approved               | Pending |       | Sarga        |
| Gallery / Venues / Stable Life | Pending |       | Sarga        |
| Contact form approved          | Pending |       | Sarga        |
| Mobile layout approved         | Pending |       | Sarga        |
| SEO reviewed                   | Pending |       | Vendor/Sarga |
| Production deployment approved | Pending |       | Vendor/Sarga |
