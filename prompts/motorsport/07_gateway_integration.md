# 07 — Gateway Integration

Execute this phase only.

Tasks:

1. Update `frontend-gateway/` so Sarga Motorsport ecosystem links point to the dedicated motorsport frontend URL.
2. Add env variable support for `NEXT_PUBLIC_MOTORSPORT_SITE_URL`.
3. Ensure gateway motorsport news/event cards link to motorsport detail pages where content belongs to Sarga Motorsport.
4. Keep gateway content and design intact.
5. Update CMS queries so gateway can show motorsport teaser content only when allowed by CMS fields.

Rules:

- Do not merge motorsport pages into gateway.
- Gateway is an entry point; motorsport frontend is the destination.

Acceptance criteria:

- Gateway ecosystem card redirects to motorsport site.
- Motorsport-related ticket CTAs can appear in gateway Ticket Hub but route to the correct external or motorsport URL.
- No broken local links.

Do not continue to the next phase.
