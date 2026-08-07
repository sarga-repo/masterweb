# 06 — Motorsport Pages

Execute this phase only.

Build these routes in `frontend-motorsport/`:

- `/events`
- `/events/[slug]`
- `/tickets`
- `/experience`
- `/news`
- `/news/[slug]`
- `/gallery`
- `/partners`
- `/about`
- `/contact`
- `/campaign/[slug]`

Use CMS-aware fetching patterns and typed data models.

Rules:

- Do not implement payment checkout.
- Ticket buttons should redirect/deep link to configured partner URL.
- Missing slug should show proper 404 behavior.
- Pages must follow Motorsport brand system.
- Event and news discovery must support CMS-driven car, motorcycle, and mixed discipline filtering.

Acceptance criteria:

- Each route exists.
- Each route has SEO metadata support.
- Events/news can be filtered by motorsport scope.

Do not continue to the next phase.
