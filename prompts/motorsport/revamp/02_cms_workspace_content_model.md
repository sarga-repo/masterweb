# MSR-2 - CMS Workspace And Content Model

Execute this phase only.

## Task

Prepare Strapi for the new editor workflow and Motorsport program content.

Implement only the CMS changes approved by the current docs:

- Dedicated admin workspaces/menu entries for Gateway, Motorsport, Horse Sport, Shared Library.
- Site-scoped page model if required.
- Motorsport program/rider/standing/regulation models if required.
- Merchandise teaser model if required.
- Seed/demo records for IJTC, FIA Rallycross, and Merchandise.

## Rules

- Keep one Strapi instance and one database.
- Do not duplicate News/Event content types just to create separate menus.
- Preserve existing `siteScope` behavior.
- Do not break Gateway or Horse Sport queries.

## Verification

- `cd cms && pnpm tsc --noEmit`
- Start Strapi locally if practical and verify admin loads.
- Verify public read permissions only where public frontend data needs them.
- Update `strapi/content-types.json` if schemas change.
- Update progress and checklist docs.

Stop after this phase.

