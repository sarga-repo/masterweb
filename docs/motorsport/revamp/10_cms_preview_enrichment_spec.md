# CMS Preview Enrichment Specification

## Document status

- Phase: 0 — feasibility and implementation specification
- Scope priority: Sarga Motorsport first
- Implementation status: repository implementation complete; staging/UAT remains
  an external launch gate
- Approval gate: required before Phase 1 implementation
- CMS: Strapi 5.49.0
- Frontend: Next.js App Router

## 1. Executive decision

Strapi Preview is feasible for this repository without changing the agreed
stack, adding a second CMS, or introducing a paid service.

Recommended first implementation is Strapi's standard full-screen Preview using
Next.js Draft Mode. This is available on Strapi's free plan. Strapi Live Preview
(side-by-side editor, click-to-edit, and live updates) is a separate Growth or
Enterprise feature and must not be assumed available.

Preview should be implemented in phases, beginning with Motorsport editorial
pages and articles. It must remain fail-closed: an invalid or missing preview
secret cannot enable draft content, and public requests must continue to receive
published content only.

## 2. Current-state findings

### CMS

- Strapi Preview is not configured. `cms/config/admin.ts` currently contains
  authentication, token, transfer, secret, and feature flag configuration only.
- Most editorial content types use `draftAndPublish: true`.
- Inquiry and newsletter records correctly use `draftAndPublish: false` and are
  not preview candidates.
- Existing admin roles are site-scoped and must remain site-scoped in Preview.
- Existing CMS custom workspace UI does not provide a preview route or token
  exchange.

### Motorsport frontend

- Server-side Strapi reads are centralized in
  `frontend-motorsport/src/lib/strapi/client.ts`.
- Reads currently request published/default Content API results and do not
  inspect Next.js `draftMode()`.
- The client already keeps the Strapi token server-side, which is suitable for
  draft reads.
- Routes use typed CMS adapters in `src/lib/cms-data.ts` and
  `src/lib/homepage-data.ts`.
- Content fetches use Next revalidation and must bypass or isolate cache while
  preview mode is active.
- The app has no preview entry route and no preview iframe CSP policy.

### Cross-site architecture

- Gateway, Motorsport, and Horse Sport share one Strapi instance.
- Each frontend has separate runtime environment and site scope.
- Preview configuration must not expose one site's draft content through another
  site's preview URL.
- Motorsport implementation should establish reusable patterns, but Gateway and
  Horse Sport should not be enabled until their route matrices are reviewed.

## 3. Feasibility assessment

| Area | Feasibility | Complexity | Main concern |
| --- | --- | --- | --- |
| Enable Strapi Preview config | High | Low | Environment and admin restart |
| Secure Next.js Draft Mode route | High | Medium | Secret validation and safe redirect |
| Draft-aware Strapi REST reads | High | Medium | `status=draft`, token permissions, cache |
| Motorsport route mapping | High | Medium | UID-to-path and locale mapping |
| CMS iframe embedding | High | Medium | CSP `frame-ancestors`, origin allowlist |
| Site-scoped preview security | High | Medium/High | Prevent cross-site draft leakage |
| Full Live Preview | Conditional | High | Growth/Enterprise plan and source maps |
| All three frontends | High | High | Three route matrices and deployment configs |

Overall assessment: standard Preview is a contained medium-complexity feature.
The principal risk is not Strapi configuration; it is ensuring every draft read,
route, locale, relation, and cache path respects the preview context.

## 4. Goals

- Add an `Open preview` action in Strapi Content Manager for supported Motorsport
  entries.
- Open the correct Motorsport route in a secure Next.js draft session.
- Render draft content only inside an authenticated preview session.
- Render published content for normal visitors without behavior changes.
- Support English and Indonesian preview routes.
- Preserve CMS site-scope isolation.
- Provide visible preview-mode indication and a safe exit action.
- Keep unsupported content types without a preview button until mapped.

## 5. Non-goals

- No Live Preview or click-to-edit implementation in initial phases.
- No public draft API.
- No preview of inquiry, newsletter, admin, or private operational records.
- No bypass of existing Strapi role conditions.
- No publication, approval, workflow, or editorial review redesign.
- No paid third-party preview service.
- No automatic preview rollout to Gateway or Horse Sport before separate UAT.

## 6. Proposed architecture

```text
Strapi Content Manager
  | Preview handler generates safe URL with uid/documentId/locale/status
  v
Motorsport /api/preview
  | validates PREVIEW_SECRET and maps only approved paths
  | enables or disables Next.js Draft Mode cookie
  v
Motorsport page route inside iframe or full-screen browser
  | server fetch sees draftMode().isEnabled
  | sends status=draft and server-only Strapi token
  v
Strapi Content API
```

### Preview handler

`cms/config/admin.ts` should enable Preview with:

- `CLIENT_URL` or a dedicated preview origin allowlist
- `PREVIEW_SECRET` loaded only from the CMS runtime environment
- A UID/document route mapper
- `null` for unsupported or unsafe entries
- Locale and draft/published status forwarding

The handler must never construct a redirect from arbitrary editor-provided URL
text. It should derive paths from the UID and validated document fields.

### Frontend preview route

Motorsport should add a server route such as `/api/preview` that:

- validates the shared secret using constant-time-safe comparison where practical;
- accepts only an internally generated path format;
- rejects protocol-relative, external, or malformed paths;
- enables Draft Mode for `status=draft`;
- disables Draft Mode for `status=published`;
- redirects only to an allowlisted local Motorsport path;
- does not log the secret or full query string.

### Draft-aware reads

The Motorsport Strapi client should read `draftMode()` on the server and:

- append `status=draft` only while Draft Mode is enabled;
- send the server-only `STRAPI_API_TOKEN` for draft reads;
- use `cache: "no-store"` or equivalent preview-specific fetch behavior;
- preserve current revalidation behavior outside preview;
- keep existing published/mock fallback behavior outside preview.

The draft token must have only the read permissions necessary for Motorsport
preview and existing published rendering. No admin token may be exposed.

### Iframe policy

The frontend must allow framing only by configured Strapi admin origins through a
targeted `Content-Security-Policy` `frame-ancestors` directive. It must not use a
wildcard `*` policy in staging or production.

Local development should allow the known local CMS origin only. Production
origins must be explicit environment values.

## 7. Motorsport Phase Plan

### Phase 0 — Feasibility and specification

Status: this document only.

Deliverables:

- Current-state audit
- Security and route-mapping contract
- Phased implementation plan
- Approval decision

Exit gate: user approves this specification and Phase 1 scope.

### Phase 1 — Preview foundation and one content family

Recommended first content family: `news-article`.

Deliverables:

- Strapi Preview enabled in `cms/config/admin.ts`.
- Environment contract for `CLIENT_URL`, `PREVIEW_URL`, and
  `PREVIEW_SECRET`.
- Motorsport `/api/preview` Draft Mode route.
- Draft-aware Strapi client behavior.
- Safe news article UID-to-path mapper for `/news/[slug]`.
- Locale-aware English/Indonesian preview.
- Preview-only cache bypass.
- Local CSP frame-ancestor support.
- Unit tests for secret, path, locale, status, and rejection behavior.

Acceptance:

- Motorsport admin can open draft news preview without publishing.
- Public incognito request cannot see the draft.
- Published preview opens published content.
- Invalid secret returns 401.
- External redirect input is rejected.
- Indonesian preview resolves `/id/news/[slug]`.
- Site-scope filter remains `motorsport`.

### Phase 2 — Motorsport page and event coverage

Deliverables:

- `site-page` route mapping for approved `routePath` values.
- Event listing/detail mapping.
- Motorsport program/rider/regulation mappings where public routes exist.
- Relation and nested component draft-read tests.
- Preview fallback and not-found behavior.

Acceptance:

- Each mapped Content Manager entry opens its canonical Motorsport route.
- Unsupported route paths do not expose a preview button.
- Draft relations do not leak Gateway or Horse Sport records.
- Preview works in both locales across desktop/mobile viewport modes.

### Phase 3 — Motorsport chrome and secondary collections

Deliverables:

- Site chrome preview behavior for header/footer settings.
- Navigation, partner, gallery, merchandise, and ticket CTA mapping where
  editorial preview is meaningful.
- Explicit handling for entries whose effect spans multiple routes.

Acceptance:

- Site logo/footer changes are visible in preview without publication.
- Cross-site links remain allowlisted.
- Preview clearly indicates when an entry affects shared/global chrome.

### Phase 4 — Cross-site rollout

Deliverables:

- Gateway route matrix and preview origin.
- Horse Sport route matrix and preview origin.
- Shared content preview ownership rules.
- Per-site secrets/origin configuration and UAT.

Acceptance:

- Each dedicated admin sees only its own preview paths and drafts.
- Shared-role preview behavior is explicitly documented and tested.
- No cross-site draft content appears through a dedicated site's preview.

### Phase 5 — Optional Live Preview evaluation

This phase is conditional on an approved Strapi Growth/Enterprise plan and
business requirement.

Deliverables would include postMessage handling, preview-ready handshake, router
refresh, source maps, editable field annotations, and dynamic-zone limitations
assessment.

Do not start this phase as part of standard Preview implementation.

## 8. Environment contract

Per CMS runtime:

```env
CLIENT_URL=http://localhost:3001
PREVIEW_URL=http://localhost:3001
PREVIEW_SECRET=<unique-secret>
```

Per Motorsport frontend runtime:

```env
STRAPI_API_URL=http://localhost:1337
STRAPI_API_TOKEN=<server-only-read-token-with-draft-read-access>
PREVIEW_SECRET=<same-preview-secret>
CMS_ADMIN_ORIGIN=http://localhost:1337
```

For local activation, set `PREVIEW_ENABLED=true` in `cms/.env` and provide the
same non-empty `PREVIEW_SECRET` in `cms/.env` and
`frontend-motorsport/.env.local`. These files are ignored and must not be
committed. Repository examples remain disabled and secret-free.

Production must use HTTPS origins, separate secrets from local/staging, and
secret-store injection. Preview secrets must never be committed, rendered into
client HTML, or written to logs.

## 9. Security requirements

- Draft mode requires valid secret on every activation request.
- Public users receive published content only.
- Preview path is allowlisted by UID and route pattern.
- Redirect target cannot be supplied as an arbitrary external URL.
- Draft reads use server-only least-privilege token.
- Preview origins are explicit; no wildcard iframe policy.
- Site-scope filters remain mandatory for every draft query.
- Preview cookies use framework defaults appropriate for HTTPS production.
- Preview route does not return draft content directly; it only establishes a
  protected session and redirects.
- Secret, token, draft payload, and visitor data stay out of logs.
- Rate limiting or equivalent abuse protection should cover preview activation in
  production.

## 10. Complexity and effort estimate

Relative sizing, not a time commitment:

- Phase 0: small, documentation and approval.
- Phase 1: medium, touches CMS admin config, one frontend route, client fetcher,
  CSP, tests, and environment files.
- Phase 2: medium/high, route and relation matrix expansion.
- Phase 3: medium/high, global chrome and multi-route effects.
- Phase 4: high, three frontend environments and cross-site UAT.
- Phase 5: high/conditional, paid plan and source-map/live messaging behavior.

## 11. Approval checklist

Before Phase 1 implementation, confirm:

- Standard full-screen Preview is desired first; Live Preview is deferred.
- Motorsport news articles are the first content family.
- Local preview origin is `http://localhost:3001`.
- A dedicated `PREVIEW_SECRET` may be added to local ignored environment files.
- Production preview origins and secret storage will be supplied before deploy.
- Draft-read API token permissions may be updated to support Motorsport preview.
- Site chrome preview is Phase 3, not Phase 1.
