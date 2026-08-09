# MSR-4 - Homepage Revamp

Execute this phase only.

## Task

Revamp `frontend-motorsport/` homepage to follow the new source sitemap.

Required sections:

1. Header/nav.
2. Hero headline and description.
3. Upcoming Events.
4. News.
5. Gallery.
6. Footer.

Optional lower-priority modules:

- Sponsor/partner strip.
- Newsletter/contact CTA.
- Ecosystem/brand story, only if it does not dilute event-program focus.

## Rules

- Keep CMS-ready data and graceful fallback.
- Use Look & Feel Motorsport visual direction.
- Keep ticket CTA prominent.
- Do not implement unrelated pages in this phase.

## Verification

- `cd frontend-motorsport && pnpm lint`
- `cd frontend-motorsport && pnpm tsc --noEmit`
- `cd frontend-motorsport && pnpm build`
- Browser QA at mobile and desktop widths.
- Update progress and checklist docs.

Stop after this phase.

