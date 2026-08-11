# Styles

Global Tailwind and Gateway design-system tokens live in `src/app/globals.css`.

The token flow is:

1. Primitive Sarga.co brand colours and font files.
2. Semantic surface, line, shadow, spacing, and responsive type tokens.
3. Shared component roles: `gateway-display-hero`, `gateway-display-page`,
   `gateway-section-title`, `gateway-card-title`, `gateway-body-lead`, and
   `gateway-body-copy`.

Shared heading components should consume these roles instead of introducing
route-specific viewport formulas. Display roles use the locally bundled
Zalando Sans Expanded variable file at weight 800; interface and copy roles use
Plus Jakarta Sans.
