# Phase 07 — Testing and UAT Readiness

## Automated coverage

The frontend quality gate is:

```bash
cd frontend
pnpm quality
```

It runs formatting, ESLint, TypeScript, Vitest, and the production build.
Vitest covers class/date utilities, contact and newsletter Zod schemas,
field-level form errors, honeypot rejection, ticket URL protocols, configured
deep-link schemes, and embed-host lookalike attacks.

Strapi is validated separately:

```bash
cd cms
pnpm exec tsc --noEmit
pnpm build
```

## Manual and browser QA

Use [the UAT checklist](../checklists/uat_checklist.md) for the full functional,
responsive, accessibility, creative-quality, CMS stress, performance, SEO, and
security matrix. Automated Chromium checks are evidence, not a substitute for
physical Safari, Firefox, Edge, iOS, Android, keyboard, screen-reader, and
stakeholder review.

## Phase 07 execution record

| Check                                | Result                    | Notes                                                                                                                         |
| ------------------------------------ | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Frontend format/lint/typecheck/build | Pass                      | `pnpm quality`; production fallback build also verified separately                                                            |
| Unit and validation tests            | Pass                      | 13 tests across 3 test files                                                                                                  |
| Strapi TypeScript/build              | Pass                      | TypeScript and Strapi admin production build                                                                                  |
| Production dependency audit          | Pass                      | `pnpm audit --prod`: no known vulnerabilities after patched PostCSS override                                                  |
| Responsive Chromium matrix           | Pass                      | 360, 390, 430, 768, 1024, 1280, 1440, and 1920 px; no overflow or broken images                                               |
| Forms/tabs/menu/404 journeys         | Pass                      | Mobile menu, About/Ecosystem tabs, news filter, contact errors, and three dynamic 404 routes                                  |
| Metadata/sitemap/robots/JSON-LD      | Pass                      | Canonical/description route matrix plus generated endpoints and Article/Event data                                            |
| Accessibility static/manual checks   | Pass with human follow-up | One H1/landmark checks and Lighthouse Accessibility 100; physical keyboard/screen-reader review remains                       |
| Lighthouse                           | Pass                      | Mobile production fallback build: Performance 89, Accessibility 100, Best Practices 100, SEO 100; LCP 3.7 s, CLS 0, TBT 60 ms |
| Physical cross-browser/device review | Pending                   | Requires UAT team devices                                                                                                     |
| Production submission retention      | Pending                   | Local mode intentionally does not retain PII                                                                                  |

## Known UAT boundaries

- Local form mode validates and demonstrates success/error UI but deliberately
  does not retain personal data. Production Strapi delivery must be confirmed
  with the deployment token and permissions.
- The sample event has no approved partner ticket URL, so redirect verification
  requires a CMS event with an approved test destination.
- HTTPS, production CORS, MFA, backups, and production performance can only be
  signed off in the deployed environment.

## Evidence artifacts

- `docs/uat-artifacts/lighthouse-home.report.html`
- `docs/uat-artifacts/lighthouse-home.report.json`
