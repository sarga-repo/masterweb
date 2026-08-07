# 08 — Horse Sport Deployment and Handover

Deployment, environment, editorial, rollback, and monitoring guide for the
dedicated **Sarga Horse Sport** frontend (`frontend-horsesport/`,
`horsesport.sarga.co`, local port 3002).

This document is Horse Sport-specific. For shared infrastructure (Postgres,
Strapi, Docker Compose, the group-wide env inventory) see
[`docs/10_deployment_handover_maintenance.md`](../10_deployment_handover_maintenance.md)
and [`docs/13_local_docker_deployment.md`](../13_local_docker_deployment.md).

---

## 1. Production environment variables

Horse Sport is a Next.js 16 app. `NEXT_PUBLIC_*` values are inlined into the
browser bundle at **build time** — never put a secret in one. Server-only values
(no `NEXT_PUBLIC_` prefix) are read at runtime on the server.

### Required

| Variable | Scope | Example (prod) | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | public | `https://horsesport.sarga.co` | This site's canonical origin (canonical URLs, OG, sitemap). |
| `NEXT_PUBLIC_SITE_KEY` | public | `sarga-horse-sport` | Identifies this frontend to the shared CMS. |
| `NEXT_PUBLIC_GATEWAY_SITE_URL` | public | `https://sarga.co` | Back-link to the group gateway. |
| `NEXT_PUBLIC_MOTORSPORT_SITE_URL` | public | `https://motorsport.sarga.co` | Cross-ecosystem link. |
| `NEXT_PUBLIC_STRAPI_API_URL` | public | `https://cms.sarga.co` | Browser-reachable Strapi (absolute media/image URLs). |
| `STRAPI_API_URL` | **server** | `https://cms.sarga.co` (or internal host) | Server-side content fetch. |
| `STRAPI_API_TOKEN` | **server / secret** | `<read+write token>` | Read for content; **write** required to persist contact inquiries. Never expose. |

### Optional (feature toggles — safe defaults if unset)

| Variable | Scope | Default behavior when unset | Purpose |
|---|---|---|---|
| `FORM_SUBMISSION_MODE` | server | placeholder in non-prod; live write in prod | Set to `placeholder` to validate/accept without writing to Strapi. Any other value in production persists inquiries. |
| `RECAPTCHA_SECRET_KEY` | server / secret | reCAPTCHA verification skipped | Enables server-side reCAPTCHA v3 verification. |
| `RECAPTCHA_SITE_KEY` | public | reCAPTCHA widget off | Client site key (only if reCAPTCHA is enabled). |
| `TICKETING_DEEP_LINK_SCHEMES` | server | custom schemes rejected | Comma-separated allowed deep-link schemes (e.g. `myapp`). HTTPS always allowed. |
| `TICKETING_EMBED_ALLOWLIST` | server | **iframe embeds disabled** | Comma-separated host allowlist for ticket iframe embeds. Empty = no embeds (redirect only). |
| `VERCEL_PROJECT_PRODUCTION_URL` / `VERCEL_URL` | public | falls back after `NEXT_PUBLIC_SITE_URL` | Auto-set by Vercel; used to derive `siteUrl` if `NEXT_PUBLIC_SITE_URL` is unset. |

> Production `STRAPI_API_TOKEN` must be least-privilege: read on the content
> collections Horse Sport renders, plus **create** on `inquiry-submissions`.
> No other write scopes.

---

## 2. Deployment

### Option A — Vercel (recommended)

1. **New Project** → import the repo → set **Root Directory** to
   `frontend-horsesport`. Vercel auto-detects Next.js.
2. **Build & Output**: defaults (`pnpm build`, output `.next`). pnpm is detected
   from `packageManager` in `package.json`.
3. **Environment Variables**: add every variable from §1 for the
   **Production** (and Preview) environments. Set `NEXT_PUBLIC_SITE_URL` to the
   final domain, `FORM_SUBMISSION_MODE` to a non-placeholder value, and a
   write-scoped `STRAPI_API_TOKEN`.
4. **Domain**: assign `horsesport.sarga.co`. After DNS verifies, confirm
   `NEXT_PUBLIC_SITE_URL` matches (canonical/OG/sitemap depend on it).
5. **Deploy**. Then run the post-deploy smoke checks in §6.

Each dedicated site is its own Vercel project (gateway, motorsport, horsesport)
pointing at the same Strapi. ISR revalidation is 60s for content lists/detail.

### Option B — Docker (self-hosted / parity with local)

The service is already wired in `docker-compose.yml`
(`frontend-horsesport`, port 3002, `apps` profile) using
`docker/frontend-horsesport.Dockerfile`.

```bash
# From repo root, with root .env populated (see .env.example):
docker compose --profile apps up --build frontend-horsesport
```

The compose file overrides site URLs per service and reads shared values
(including `FORM_SUBMISSION_MODE`, `RECAPTCHA_*`, `TICKETING_*`,
`STRAPI_API_TOKEN`) from the root `.env` via `env_file`.

> The bundled Dockerfile runs `pnpm dev` for local parity. For a hardened
> production image, switch the final stage to `pnpm build` + `pnpm start` and set
> `NODE_ENV=production`.

---

## 3. CMS editorial guide (Horse Sport)

All Horse Sport content lives in the **shared Strapi** and is surfaced by
`siteScope` + business relation. The frontend fetches
`siteScope ∈ {horsesport, shared}` **and** the Horse Sport business relation, so
tagging is what makes content appear.

### Golden rules

- Set **`siteScope = horsesport`** for Horse Sport-only content, or `shared` for
  cross-ecosystem items that should also appear on the gateway.
- Set the **business relation to `sarga-horse-sport`**:
  - Events → `business`
  - News articles → `relatedBusinesses`
- `siteScope = hidden` (or leaving it off the horsesport/shared set) removes an
  item from the site.
- Content is **Draft+Published** — only **Published** entries render. Use draft
  to stage.
- Lists revalidate within ~60s; a hard refresh may lag briefly.

### Per collection

| Collection | Make it appear on Horse Sport | Key fields |
|---|---|---|
| **Event** | `siteScope=horsesport\|shared`, `business=sarga-horse-sport` | title, slug, eventDate/endDate, venue, eventStatus, eventDiscipline (derby/turf/exhibition/…), coverImage, schedule[], ticketCtas |
| **News article** | `siteScope=horsesport\|shared`, `relatedBusinesses=sarga-horse-sport` | title, slug, publishedDate, category, excerpt, body, author, coverImage |
| **Ticket CTA** | `siteScope=horsesport\|shared`, `isActive=true` | title, label, provider, `ctaType` (redirect/deepLink/embed), `url`, `embedUrl` |
| **Media gallery** | `siteScope=horsesport\|shared` | title, category, coverImage, mediaItems[] |
| **Partner** | `siteScope=horsesport\|shared` | name, logo, websiteUrl, sortOrder |
| **Inquiry submission** | (auto-created by the contact form) | read-only inbox; filter by `sourceSite=horsesport` |

### Ticketing (important — no internal checkout)

- Default `ctaType = redirect` with an **HTTPS** partner `url`. The button opens
  the partner in a new tab.
- `ctaType = deepLink` requires the scheme to be listed in
  `TICKETING_DEEP_LINK_SCHEMES`, else it degrades to a redirect.
- `ctaType = embed` renders an iframe **only** when the `embedUrl` host is in
  `TICKETING_EMBED_ALLOWLIST`; otherwise it falls back to a redirect. Sarga never
  processes payments.
- Unsafe URLs (non-HTTPS, `javascript:`, unlisted schemes/hosts) are dropped by
  the safe-url gate — the CTA simply won't render.

### Inquiries

Contact submissions are stored in `inquiry-submissions` tagged
`sourceSite=horsesport` with an `inquiryType`
(ticketing/partnership/sponsorship/media/event/venue/stable/general). Route them
to the relevant desk. Requires `FORM_SUBMISSION_MODE` ≠ `placeholder` and a
write-scoped token in production.

---

## 4. Media asset upload guidelines

| Use | Recommended size | Format | Notes |
|---|---|---|---|
| Event/news cover | 1600×1067 (3:2) | WebP/JPG | Cinematic equestrian art direction (docs/horsesport/07). |
| Hero / page background | ≥ 2000px wide | WebP/JPG | Legible with the dark scrim; avoid busy centers behind headlines. |
| Gallery item | 1600px long edge | WebP/JPG | Consistent aspect within a gallery reads best. |
| Partner logo | ~400px wide, transparent | PNG/SVG | Light/monochrome variant preferred on dark surfaces. |
| Social/OG image | 1200×630 | JPG/PNG | Falls back to the site default hero when unset. |

- **Always set `alternativeText`** in Strapi — it becomes the `alt` attribute
  (accessibility + SEO). The frontend falls back to `"<title> — Sarga Horse Sport"`
  only when alt is missing.
- Keep files compressed (aim < ~400 KB for covers). `next/image` serves
  responsive sizes and lazy-loads below-the-fold images automatically.
- Do not bake text into images (breaks localization + scaling).

---

## 5. Rollback

Content and code roll back independently.

- **Vercel (code)**: Deployments → select the previous good deployment →
  **Promote to Production** (instant, no rebuild). Or `git revert` the offending
  commit and let CI redeploy.
- **Docker (code)**: redeploy the prior image tag / commit:
  `git checkout <good-sha> && docker compose --profile apps up --build frontend-horsesport`.
- **Content (Strapi)**: unpublish or revert the entry (Draft+Published). No
  frontend deploy needed — the change propagates on the next revalidate (~60s).
- **Env var change**: revert the value in Vercel/host and redeploy. `NEXT_PUBLIC_*`
  changes require a **rebuild** (they're inlined at build time).
- **Bad ticket link**: unpublish/fix the Ticket CTA in Strapi (no deploy).

Always confirm `NEXT_PUBLIC_SITE_URL` after any rollback — a mismatch produces
wrong canonical/OG/sitemap URLs.

---

## 6. Post-launch monitoring checklist

### Immediately after deploy (smoke)

- [ ] `https://horsesport.sarga.co/` loads; hero + logo render.
- [ ] `/events`, `/news`, `/gallery`, `/tickets`, `/venues`, `/about`, `/contact`
      all 200.
- [ ] An event and a news detail page render live CMS content.
- [ ] `robots.txt` and `sitemap.xml` resolve; sitemap lists detail URLs.
- [ ] A page's canonical URL uses the production domain (not localhost/preview).
- [ ] Contact form: valid submit → success; an `inquiry-submissions` record is
      created with `sourceSite=horsesport`.
- [ ] A ticket CTA opens the correct partner URL in a new tab.
- [ ] Gateway ecosystem card + footer link open the Horse Sport site.

### Ongoing

- [ ] Uptime monitor on `/` (and ideally `/api/contact` health).
- [ ] Error tracking (e.g. Sentry) on the frontend.
- [ ] Core Web Vitals / Lighthouse tracked (run in CI or hosted — the CLI was
      unavailable in the build environment; capture before/after each release).
- [ ] Strapi inquiry inbox reviewed regularly; spam rate watched (rate limit is
      in-memory per instance — consider a shared store like Redis at scale).
- [ ] `STRAPI_API_TOKEN` rotation schedule; confirm least-privilege after each
      Strapi permissions change.
- [ ] Watch for soft-404s: unknown detail slugs render the not-found UI but
      currently return HTTP 200 (Next 16 on-demand ISR behavior, shared across
      all three frontends — see the UAT checklist "Known gaps").

---

## 7. Handover references

- UAT results: [`checklists/horsesport/horsesport_uat_checklist.md`](../../checklists/horsesport/horsesport_uat_checklist.md)
- Progress log: [`docs/PHASE_PROGRESS.md`](../PHASE_PROGRESS.md)
- Content model: [`05_horsesport_content_model_extensions.md`](05_horsesport_content_model_extensions.md)
- Cross-site routing: [`docs/multisite/04_three_site_integration_strategy.md`](../multisite/04_three_site_integration_strategy.md)
- Assets: [`07_horsesport_asset_usage_guideline.md`](07_horsesport_asset_usage_guideline.md)
