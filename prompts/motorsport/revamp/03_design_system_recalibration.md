# MSR-3 - Design System Recalibration

Execute this phase only.

## Task

Recalibrate the Motorsport design system to match the Look & Feel PDF while preserving the existing approved theme.

Focus areas:

- Header/nav and ticket CTA.
- Typography scale and Owners Wide/Noto Sans usage.
- Draftline Blue information bands.
- Discipline tiles.
- Campaign banner components.
- Gallery mosaic components.
- Schedule/standings/table components.
- Regulation download panel.
- Event-program subnav.

## Rules

- Do not rebuild all pages yet.
- Keep components reusable for later phases.
- Use existing Tailwind v4 and project patterns.
- Avoid heavy 3D or new paid libraries.
- Respect reduced-motion and mobile performance.

## Verification

- `cd frontend-motorsport && pnpm lint`
- `cd frontend-motorsport && pnpm tsc --noEmit`
- `cd frontend-motorsport && pnpm build`
- Visual smoke test if a dev server is started.
- Update progress and checklist docs.

Stop after this phase.

