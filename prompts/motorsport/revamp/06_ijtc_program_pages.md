# MSR-6 - IJTC Program Pages

Execute this phase only.

## Task

Create the Indonesia Junior Talent Cup program experience.

Required routes:

- IJTC hub.
- Race Schedule.
- Rider Profiles.
- Standing Points & Results.
- About IJTC.
- Regulation.
- Become Riders.

Use the route pattern approved in `docs/motorsport/revamp/03_sitemap_page_specs.md`.

## Rules

- Use CMS data when available and fallback content only for local resilience.
- Regulation must support a downloadable PDF.
- Become Riders must be an inquiry path, not a public account system.
- Standings/results must be accessible on mobile.

## Verification

- `cd frontend-motorsport && pnpm lint`
- `cd frontend-motorsport && pnpm tsc --noEmit`
- `cd frontend-motorsport && pnpm build`
- Browser QA all IJTC routes.
- Update progress and checklist docs.

Stop after this phase.

