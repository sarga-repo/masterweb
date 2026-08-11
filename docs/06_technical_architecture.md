# 06 — Technical Architecture

## Recommended architecture

```text
User Browser
   |
   | HTTPS
   v
CDN / Edge Hosting
   |
   v
Next.js Frontend
   |
   | REST/GraphQL API
   v
Strapi CMS
   |
   v
PostgreSQL Database

Media assets:
Strapi Media Library -> S3-compatible object storage or cloud storage
```

## Frontend

### Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- ESLint + Prettier
- Zod for validation
- React Hook Form for forms
- next/image for image optimization

### Rendering approach

- Static generation for homepage, about, ecosystem, child pages, and articles where possible
- Incremental/static revalidation if Strapi content changes
- Server-side rendering only where needed
- Client components only for interactive UI such as menu, filters, forms, tabs

### Recommended frontend structure

```text
src/
├── app/
│   ├── page.tsx
│   ├── about/page.tsx
│   ├── ecosystem/page.tsx
│   ├── ecosystem/[slug]/page.tsx
│   ├── news/page.tsx
│   ├── news/[slug]/page.tsx
│   ├── careers/page.tsx
│   ├── contact/page.tsx
│   ├── ticket-hub/page.tsx
│   ├── ticket-hub/[slug]/page.tsx
│   ├── privacy-policy/page.tsx
│   └── terms/page.tsx
├── components/
│   ├── layout/
│   ├── sections/
│   ├── cards/
│   ├── forms/
│   └── ui/
├── lib/
│   ├── strapi/
│   ├── seo/
│   └── validation/
├── styles/
└── types/
```

## CMS/backend

### Stack

- Strapi
- Node.js LTS
- PostgreSQL
- Upload provider for S3-compatible storage
- SMTP/email provider or webhook integration for forms

### Admin roles

- Super Admin
- Content Manager
- Editor/Reviewer
- Read-only viewer

### API access

- Use a read-only API token for frontend content fetching
- Use server-side API calls for protected form submission
- Never expose admin tokens in browser

## Database

PostgreSQL is recommended for Strapi production because it is stable, widely supported, and easy to back up.

## Hosting options

### Option A — Simple managed setup

- Frontend: Vercel
- CMS: Render/Railway/Fly.io/DigitalOcean App Platform
- Database: Managed PostgreSQL
- Storage: S3-compatible storage

### Option B — VPS/container setup

- Frontend: Vercel or same VPS with reverse proxy
- CMS: Dockerized Strapi
- Database: Managed PostgreSQL or Docker PostgreSQL if low traffic
- Reverse proxy: Nginx or Caddy
- SSL: Cloudflare or Let's Encrypt
- Storage: S3-compatible object storage

### Option C — Enterprise/cloud setup

- Frontend: Vercel Enterprise or cloud container
- CMS: Kubernetes/container service
- Database: Managed PostgreSQL
- Object storage + CDN
- WAF/CDN through Cloudflare or cloud provider

## Recommendation for initial phase

Use **Option A** unless Sarga has a strict cloud/VPS requirement. It is fastest for a one-month timeline and reduces infrastructure complexity.

## Environment variables

```env
NEXT_PUBLIC_SITE_URL=https://sarga.co
STRAPI_API_URL=https://cms.sarga.co
STRAPI_API_TOKEN=replace_me
NEXT_REVALIDATE_SECRET=replace_me

MAIL_ENABLED=false
MAIL_AUTH_MODE=oauth
MAIL_SMTP_HOST=smtp.office365.com
MAIL_SMTP_PORT=587
MAIL_SMTP_REQUIRE_TLS=true
MAIL_SMTP_USER=replace_me
MAIL_FROM_ADDRESS=replace_me
MAIL_FROM_NAME=Sarga
MAIL_DEFAULT_REPLY_TO=replace_me
MICROSOFT_TENANT_ID=replace_me
MICROSOFT_CLIENT_ID=replace_me
MICROSOFT_CLIENT_SECRET=replace_me
MICROSOFT_SMTP_SCOPE=https://outlook.office365.com/.default
# Emergency existing-tenant compatibility mode only; leave blank for OAuth.
MAIL_SMTP_PASSWORD=
MAIL_BASIC_AUTH_ACKNOWLEDGED=
MAIL_BASIC_AUTH_EXPIRES_AT=
MAIL_RECIPIENT_GATEWAY=replace_me
MAIL_RECIPIENT_MOTORSPORT=replace_me
MAIL_RECIPIENT_HORSESPORT=replace_me
MAIL_NOTIFICATIONS_ENABLED=false
MAIL_MAX_ATTEMPTS=5
MAIL_WORKER_BATCH_SIZE=10
MAIL_WORKER_CRON="*/1 * * * *"

RECAPTCHA_SITE_KEY=replace_me
RECAPTCHA_SECRET_KEY=replace_me
```

The OAuth transport variables above are implemented by GWR-CMS-MAIL-2 and
remain inactive while `MAIL_ENABLED=false`; see
`docs/strapi-admin-menu/12_gwr_cms_mail_2_oauth_transport_spec.md`. Recipient
and notification variables are implemented by GWR-CMS-MAIL-3 but remain
inactive while `MAIL_NOTIFICATIONS_ENABLED=false`. OAuth 2.0 remains the
production target. The reviewed GWR-CMS-MAIL-4.1 launch contingency may use
`MAIL_AUTH_MODE=basic` only for an eligible existing tenant, with an exact risk
acknowledgement and a mandatory expiry no later than 2026-12-15; see
`docs/strapi-admin-menu/15_gwr_cms_mail_4_1_temporary_basic_auth_fallback.md`.
No other password SMTP path is approved. Strapi handles outbound mail only;
POP/incoming mailbox processing is outside the current architecture.

## Security design

- HTTPS everywhere
- Admin CMS behind strong password/MFA if available
- Secure CORS
- API token with least privilege
- Public forms validated server-side
- Rate limiting for form APIs
- Anti-spam on contact/newsletter forms
- Sanitize rich text rendering
- No raw arbitrary embed code unless allowlisted
- Dependencies scanned before deployment

## Performance design

- Compress and resize media assets
- Encode CMS hero video as short, muted, seamless MP4/WebM loops. Supply a
  poster, keep each final file well below the 100 MB infrastructure ceiling,
  and target roughly 5-8 MB per source for the initial single-VM deployment.
- Load only the active carousel video with `preload="metadata"`; reduced-motion
  visitors receive the poster without mounting a video element.
- Use next/image
- Lazy-load below-the-fold images
- Avoid unnecessary client-side JavaScript
- Use static generation and caching
- Use CDN for media when traffic or video-transfer volume justifies the
  separately approved object-storage/CDN migration; local Strapi uploads remain
  the initial single-VM source of truth.
- Keep third-party scripts minimal

## SEO design

- Generate metadata from Strapi SEO component
- Fallback SEO defaults from Site Settings
- Generate sitemap.xml
- Generate robots.txt
- Open Graph image per page/article
- Canonical URL support
- Structured data for articles and events where applicable

## Observability

- Frontend analytics: Google Analytics, Plausible, or equivalent
- Error tracking: Sentry or equivalent
- Uptime monitoring: UptimeRobot, Better Stack, or equivalent
- CMS logs and backup monitoring

## Local development architecture with Docker Compose

The repository must include a local Docker Compose setup for development and review.

Required local services:

- `frontend`: Next.js application, available on `http://localhost:3000`.
- `strapi`: Strapi CMS/API, available on `http://localhost:1337`.
- `postgres`: PostgreSQL database for Strapi, exposed to the host on port `5435` and mapped to container port `5432`.

The frontend and CMS should be created as separate folders:

```text
frontend/   # Next.js app
cms/        # Strapi app
```

Local compose files included in this package:

```text
docker-compose.yml
docker/frontend.Dockerfile
docker/strapi.Dockerfile
.env.example
docs/13_local_docker_deployment.md
```

The local database host port must remain `5435` to avoid conflict with common local PostgreSQL installations on `5432`.

## Locale and navigation delivery (GWR-CMS-6/7 multisite rollout)

- Strapi remains the single content source and now uses built-in `en`/`id`
  i18n with English as default.
- English remains unprefixed. All three frontends resolve Indonesian under
  `/id` through a Next.js 16 proxy rewrite while keeping the localized URL
  visible.
- Each frontend independently owns typed interface dictionaries for its
  branded shell, form, accessibility, and error controls and passes the URL
  locale to its Strapi adapters.
- A shared data contract, not shared branded UI, resolves site-scoped Top
  Navigation items. Each frontend retains its own header component and styling.
- URL locale is authoritative; an optional cookie remembers only an explicit
  user switch.
- Repository navigation arrays remain outage/unconfigured fallbacks. A
  successfully configured CMS menu is never merged with hidden fallback items.
- Metadata, structured data, sitemap, caching, and revalidation are locale
  aware on all three sites. Missing Indonesian records use a complete English response,
  receive a localized canonical plus hreflang set, and are marked `noindex`.

The CMS foundation and three-site rollout are active: localized schemas,
stable-route/navigation parity middleware, site-scoped Top Navigation RBAC,
source-locale capture, bilingual navigation seeds, public `/id` routing,
language dropdowns, and CMS-navigation consumption are in place. Staging
migration and launch UAT remain gated to GWR-CMS-8.
