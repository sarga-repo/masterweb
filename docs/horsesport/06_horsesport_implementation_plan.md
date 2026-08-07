# 06 — Horse Sport Implementation Plan

## Phase 1 — Repository restructure

Goal: Add a new `frontend-horsesport/` app without breaking gateway or Motorsport.

Tasks:

- Create `frontend-horsesport/` using the same Next.js/TypeScript/Tailwind baseline as `frontend-motorsport/`.
- Add `docker/frontend-horsesport.Dockerfile`.
- Update `docker-compose.yml` to expose Horse Sport on `localhost:3002`.
- Update `.env.example`, root README, and local deployment docs.
- Copy approved Horse Sport logos/assets into `frontend-horsesport/public/brand/`.
- Update `docs/PHASE_PROGRESS.md`.

## Phase 2 — Shared CMS three-site model

Goal: Extend CMS content scoping to include Horse Sport.

Tasks:

- Add `horsesport` to `siteScope` enums.
- Add `showOnHorseSport` where visibility flags exist.
- Add/extend content model fields for Horse Sport events, news, galleries, and ticket CTAs.
- Update seed/demo content.
- Add typed frontend fetch helpers for `siteKey = horsesport`.

## Phase 3 — Horse Sport frontend bootstrap

Goal: Establish app shell and infrastructure.

Tasks:

- Create route structure.
- Set metadata defaults.
- Configure Strapi API client.
- Add responsive header/footer.
- Add error/404/loading states.
- Add basic sitemap/robots foundations.

## Phase 4 — Horse Sport design system

Goal: Build a premium equestrian UI system.

Tasks:

- Add tokens for Horse Sport palette, typography, spacing, gradients.
- Build components from `04_horsesport_design_system.md`.
- Add motion/interaction guidelines.
- Add responsive image primitives and CMS media mapping.

## Phase 5 — Homepage

Goal: Build the dedicated Horse Sport landing page.

Tasks:

- Hero section with cinematic media.
- Featured event / ticket CTA.
- About section.
- Championship ecosystem section.
- Event/news/gallery previews.
- Newsletter/contact CTA.
- SEO metadata.

## Phase 6 — Core pages

Goal: Build the main content routes.

Tasks:

- `/about`
- `/events`
- `/events/[slug]`
- `/tickets`
- `/news`
- `/news/[slug]`
- `/gallery`
- `/venues`
- `/stable-life`
- `/partners`
- `/contact`

## Phase 7 — Cross-site integration

Goal: Connect gateway and Motorsport routing to Horse Sport.

Tasks:

- Gateway ecosystem card routes to Horse Sport dedicated site.
- Gateway news/events/ticket teasers deep-link to Horse Sport when scoped.
- Motorsport footer/ecosystem links can point to Horse Sport where appropriate.
- Add URL builder utilities that use site scope and canonical site.

## Phase 8 — Forms, ticketing, SEO

Goal: Finish conversion and discoverability features.

Tasks:

- Server-validated contact form.
- Ticket CTA handling with redirect/deep-link/embed rules.
- SEO metadata, Open Graph, sitemap, robots.
- Structured data for Events and NewsArticle.

## Phase 9 — Quality and UAT

Goal: Verify design, responsiveness, CMS filtering, and performance.

Tasks:

- Run build/type checks.
- Test Docker Compose.
- Test CMS content visibility rules.
- Check mobile/tablet/desktop.
- Run Lighthouse.
- Complete Horse Sport UAT checklist.

## Phase 10 — Deployment and handover

Goal: Prepare production launch.

Tasks:

- Add deployment docs for `frontend-horsesport/`.
- Add production env vars.
- Add CMS editorial guide for Horse Sport.
- Add asset upload guide.
- Add fallback/rollback notes.
