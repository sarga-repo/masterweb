# Sarga Motorsport Implementation Plan

## Current revamp track

The current major UI, sitemap, and CMS admin UX revamp is planned in `docs/motorsport/revamp/06_implementation_phases.md` and prompted from `prompts/motorsport/revamp/`.

Use that track for new Motorsport revamp work. The phase list below remains historical context for the earlier dedicated Motorsport build.

## Phase 1 — Repository restructure

- Rename `frontend/` to `frontend-gateway/`.
- Update Docker Compose and docs.
- Confirm gateway still runs.

## Phase 2 — Shared CMS multisite model

- Add site-aware fields.
- Add/extend content types for motorsport.
- Create sample CMS seed content where appropriate.

## Phase 3 — Motorsport frontend bootstrap

- Create `frontend-motorsport/` using Next.js, TypeScript, Tailwind CSS.
- Configure app metadata and environment variables.
- Run locally on the host at port `3001` (Postgres-only Docker workflow); the
  containerized service under the `apps` Compose profile also maps to `3001`.

## Phase 4 — Motorsport design system

- Implement motorsport tokens, typography, layout primitives, and UI components.
- Use premium-frontend-ui skill guidance.
- Add logo assets to public directory.
- Include representative car and motorcycle racing media in the component showcase.

## Phase 5 — Motorsport homepage

- Build cinematic homepage with CMS-ready placeholders.
- Implement event/ticket feature module.
- Add news and gallery sections.
- Balance featured car and motorcycle racing content so the homepage does not imply a car-only ecosystem.

## Phase 6 — Motorsport pages

- Events list/detail.
- Tickets.
- Experience.
- News list/detail.
- Gallery.
- Partners.
- About.
- Contact.
- Add CMS-driven discipline filters for car, motorcycle, and mixed events/news.

## Phase 7 — Gateway integration

- Update Sarga.co gateway links to point to the motorsport frontend.
- Update gateway ecosystem card logic.
- Add motorsport teaser/news/event link behavior.

## Phase 8 — Forms, ticketing, SEO

- Add contact/inquiry forms.
- Add ticket CTA redirect/deep link logic.
- Add SEO metadata, sitemap, robots, Open Graph.

## Phase 9 — QA and UAT

- Responsive testing.
- CMS content testing.
- Cross-site navigation testing.
- Accessibility and performance checks.

## Phase 10 — Deployment and handover

- Document environment variables.
- Document deployment strategy.
- Confirm Docker Compose and production build.
- Update handover checklist.
