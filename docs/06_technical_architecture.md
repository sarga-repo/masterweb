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

SMTP_HOST=replace_me
SMTP_PORT=587
SMTP_USER=replace_me
SMTP_PASS=replace_me
FORM_RECIPIENT_EMAIL=replace_me

RECAPTCHA_SITE_KEY=replace_me
RECAPTCHA_SECRET_KEY=replace_me
```

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
- Use next/image
- Lazy-load below-the-fold images
- Avoid unnecessary client-side JavaScript
- Use static generation and caching
- Use CDN for media
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
