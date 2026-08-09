# MSR-5 - Core Pages

Execute this phase only.

## Task

Revamp or add the core Motorsport pages:

- `/about`
- `/events`
- `/news`
- `/news/[slug]`
- `/gallery`
- `/merchandise`
- `/tickets`
- `/contact`

## Required content

About:

- Profile
- Vision
- What We Do
- Meet The Team
- Contact Us
- Part of Sarga.co

Event hub:

- IJTC card/path.
- FIA Rallycross World Cup Indonesia 2026 card/path.
- Upcoming events.
- Ticket status.

Merchandise:

- Showcase, coming-soon, partner redirect, or inquiry mode.
- No cart and no checkout.

## Verification

- `cd frontend-motorsport && pnpm lint`
- `cd frontend-motorsport && pnpm tsc --noEmit`
- `cd frontend-motorsport && pnpm build`
- Browser QA for every route.
- Update progress and checklist docs.

Stop after this phase.

