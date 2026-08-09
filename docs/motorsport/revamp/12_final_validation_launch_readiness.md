# MSR-RD6 / MSR-8 Final Validation and Launch Readiness

Validation date: 2026-08-10

This report records the completed technical acceptance work for MSR-RD6 and
MSR-8. “Technically ready” means the repository, local CMS, clean production
build, and deployment artifacts passed their automated checks. It does not
replace stakeholder approval of production content, domains, or credentials.

## Route and migration decisions

| Existing route/content                            | Decision                                                                        | Verification                                  |
| ------------------------------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------- |
| `/events/fia-rallycross-world-cup-indonesia-2026` | Permanent redirect to `/campaign/fia-rallycross-world-cup-indonesia-2026`       | HTTP 308 with the exact canonical destination |
| `/experience`                                     | Retain as an unlisted compatibility page                                        | HTTP 200; no invented redirect target         |
| `/partners`                                       | Retain as an unlisted compatibility page                                        | HTTP 200; no invented redirect target         |
| CMS `sample-event`                                | Keep for local editor/demo use, exclude from sitemap                            | Not present in generated sitemap              |
| Rallycross event alias                            | Keep CMS record for editorial compatibility, exclude duplicate URL from sitemap | Only the campaign canonical is advertised     |

No other redirect was introduced without an approved one-to-one destination.

## Automated quality results

### Application gates

- Shared Strapi: TypeScript passed; Strapi production admin build passed.
- Gateway: Prettier passed; ESLint passed; 21/21 Vitest tests passed; Next
  production build passed. A corrupt `.next/dev/types` file produced by the
  concurrently running dev server was moved out of generated cache; the
  standalone TypeScript check then passed, and Next's build-time typecheck had
  already passed.
- Motorsport: Prettier, ESLint, standalone TypeScript, and a 47-page Next
  production build passed after final accessibility fixes.
- Horse Sport: Prettier, ESLint, TypeScript, 10/10 Vitest tests, and a 26-page
  Next production build passed.
- Docker Compose base and `apps` profile configs passed. Strapi and all three
  frontend images build. Frontend Dockerfiles now require strict
  `pnpm install --frozen-lockfile`; all three clean-room installs passed.
- The included Nginx four-host configuration passed `nginx -t` in a clean
  `nginx:alpine` container.

### Browser and route matrix

- 20 Motorsport routes were checked at 375, 768, 1280, and 1440 CSS pixels:
  80 route/viewport combinations.
- The same 20 routes passed a 720px reflow matrix, equivalent to a 1440px
  viewport at 200% zoom for responsive-layout acceptance.
- Every checked route had exactly one H1, a main landmark, zero failed loaded
  images, no unnamed visible buttons, and no page-level horizontal overflow.
- Intentional horizontal controls (the IJTC sub-navigation, discipline rail,
  gallery filters, and standings table) remain keyboard/touch-scrollable and
  were excluded only from page-level overflow findings.
- All 20 primary/compatibility routes, `robots.txt`, and `sitemap.xml` returned
  HTTP 200. The legacy Rallycross URL returned HTTP 308.
- 51 rendered same-origin links were crawled; none returned HTTP 4xx/5xx.
- Browser console check returned zero errors.

### Interaction checks

- Mobile menu opens as a modal, reports `aria-expanded=true`, traps the
  intended navigation surface, and keeps Ticket as the eighth/final primary
  item after Contact.
- Homepage carousel Pause/Play works; direct slide selection updates the active
  title and `aria-current` indicator.
- Gallery opens an in-page dialog with Close, Previous, and Next controls; Next
  updates the frame counter and Close removes the dialog.
- IJTC rider catalog renders 12 cards on page 1 and 8 on page 2, with four
  columns at 1440px and a current-page indicator.
- Merchandise renders six real merchandise items in four columns at 1440px.
  Pagination correctly remains hidden below the 16-item (4x4) page size. No
  checkout form, cart, payment handler, or public account flow exists.
- The regulation route renders the controlled “not yet published” state when
  no approved PDF exists, avoiding a broken download.

### Lighthouse (clean production container)

| Route/profile                                           | Performance | Accessibility | Best practices | SEO |
| ------------------------------------------------------- | ----------: | ------------: | -------------: | --: |
| Homepage, mobile default                                |          80 |           100 |            100 | 100 |
| Events, desktop                                         |          99 |           100 |            100 | 100 |
| FIA campaign, desktop with CMS deliberately unavailable |          99 |           100 |            100 | 100 |

The campaign fallback run used an unreachable internal Strapi URL. The build
completed, local fallback content/media rendered, image requests succeeded,
and Lighthouse logged no console errors. This validates the public CMS-failure
contract without disabling Next.js private-IP image protection.

## Media and CMS acceptance

- Static source audit found 27 literal Motorsport `/media/` and `/brand/`
  references and zero missing files.
- Live CMS contains 20 distinct IJTC rider documents and 20 distinct standings
  documents, four Motorsport programmes, and ten Motorsport site pages.
- One shared Strapi instance is retained. No second CMS or database was added.
- Managed role permission synchronization was inspected in the live database:
  Gateway Admin 46 permissions, Motorsport Admin 61, Horse Sport Admin 36,
  Shared Library Admin 56, and Super Admin 158. Managed content-manager
  permissions are constrained by the role's `siteScope`; uploads remain a
  documented shared library.
- Strapi now supports environment-controlled `PUBLIC_URL` and `PROXY_KOA` so
  secure admin cookies and generated URLs work behind trusted HTTPS Nginx.
- A Super Admin exists locally. No dedicated managed-role test accounts are
  currently provisioned because the optional one-time email/password
  environment pairs are blank. Real account login acceptance therefore remains
  a staging sign-off item; permissions and workspace code passed technical
  inspection but were not represented as a human login test.

## Production handover

The full single-VM guide is
[`docs/14_ubuntu_single_vm_production_deployment.md`](../../14_ubuntu_single_vm_production_deployment.md).
It covers Ubuntu 22.04.5 LTS, Node 22, pnpm, PostgreSQL 16, secrets, content
migration, four systemd services, four Nginx server blocks, Let's Encrypt
Certbot issuance and renewal dry-runs, backups, restore drills, releases,
rollback, monitoring, and ownership.

The exact CMS data and asset promotion procedure is
[`docs/15_strapi_content_media_promotion.md`](../../15_strapi_content_media_promotion.md).
It defines encrypted local-to-staging and staging-to-production Strapi
snapshots, checksums, schema/commit gates, destructive-import safeguards,
paired rollback backups, credential recreation, and parity verification.
An encrypted disposable export smoke test packaged the current local CMS
successfully: 44 schemas, 340 entities, 393 asset files (158.4 MB), 856 links,
and 54 configuration records. The test archive was deleted after verification;
no import or database mutation was performed.

Copy-ready examples are under:

- `deploy/production/systemd/`
- `deploy/production/nginx/sarga-stack.conf`

## Conditional launch prerequisites

The implementation phases are complete, but production launch must remain
conditional until all of the following are signed off:

- Replace every `https://example.com/tickets/...` demo CTA with the approved
  partner URL and perform a real redirect/checkout handoff test.
- Upload and publish the approved IJTC regulation PDF, or obtain written launch
  approval for the controlled pending state.
- Confirm final event dates, venues, programme facts, sponsor logos, contact
  recipients, privacy/legal copy, and alt text with content owners.
- Set `FORM_SUBMISSION_MODE=strapi`, provision least-privilege server-only form
  tokens, and test delivery/routing in staging. Local placeholder mode is not a
  production delivery mechanism.
- Provision one non-production account for each managed CMS role; complete and
  sign the role-by-role visibility/create/edit/publish/upload matrix plus Super
  Admin all-workspace verification.
- Create production DNS records, open ports 80/443, issue the four Let's
  Encrypt certificates, run `certbot renew --dry-run`, and record certificate
  ownership. Certificates cannot be issued from the local workstation without
  the real DNS names and public VM.
- Execute staging stakeholder UAT at real production-like origins, then take a
  paired PostgreSQL/uploads backup before the release window.
- Export the frozen, approved staging CMS snapshot, record its checksum and Git
  SHA, and complete content/media parity verification after production import.
  Admin accounts and API tokens must be recreated or verified separately.

These are external content/infrastructure approvals, not hidden application
failures. No production credentials, DNS, certificates, or irreversible
infrastructure changes were created during this repository phase.
