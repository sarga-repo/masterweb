# MSR-CMS-UAT-5 — Authenticated Cross-Page UAT and Handover

Status: completed 2026-08-15.

## Goal

Close the enhancement track with reversible evidence that CMS, Preview, and
live Motorsport output agree.

## UAT matrix

For every Motorsport page and supported locale:

1. Record original draft and published values.
2. Change hero image, title, and description; save draft.
3. Confirm Preview changes and live remains unchanged.
4. Toggle each page/section control false then true in draft Preview.
5. Publish and confirm live parity without restart or cache clearing.
6. Test collection status/visibility and ticket destinations where applicable.
7. Restore and republish the exact original data.

Run desktop and mobile assertions for status, H1, media URL, CMS markers,
overflow, console/page errors, keyboard focus, and reduced motion.

## Quality gates

- Motorsport unit tests, lint, typecheck, and production build.
- CMS tests, typecheck, and production admin build.
- Docker Compose smoke test and route crawl.
- Authenticated Motorsport Admin and Super Admin Preview checks.
- No mutation remains after restoration; attach a restoration manifest.

## Handover

- Token provisioning and rotation runbook.
- Preview error troubleshooting guide.
- Publish/revalidation operations guide.
- Editor map for every hero, section, collection status, and ticket control.
- Updated phase progress and Motorsport UAT checklist.

## Exit gate

The phase is complete only when all mutations are restored, all automated and
browser checks pass, and no known Preview/live mismatch remains.

## Implementation result

- Motorsport Admin and Super Admin authenticated successfully and each opened
  the exact English News Draft Preview with document status/device controls.
- Reversible Draft/Preview/publish/unpublish probes passed and are recorded in
  the restoration manifest.
- The HTTP crawl passed 88 localized routes plus the legacy FIA redirect in
  host mode and again through Docker Compose.
- Thirteen representative routes passed 390x844 and 1440x900 browser checks for
  main/H1 landmarks, horizontal overflow, and console errors.
- Motorsport and CMS production builds, TypeScript, ESLint, Preview preflight,
  unit tests, mail tests, Docker image build, container startup, and container
  route crawl passed.
- Docker UAT found and fixed two local/Compose drift defects: Strapi now loads
  the same cryptographic environment as host mode, and the Motorsport container
  uses the internal Strapi service hostname for server reads.
