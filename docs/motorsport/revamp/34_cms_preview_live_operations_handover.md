# Sarga Motorsport CMS Preview, Publish, and Revalidation Handover

Status: validated 2026-08-15. Scope: `frontend-motorsport` and the shared
Strapi collections consumed by it.

## Runtime contract

Preview and live are intentionally separate:

- Draft Preview is authenticated, exact-document, exact-locale, `no-store`,
  and fail-closed for the one record being edited.
- Requests for supporting content during Preview (navigation, shared chrome,
  cards, and other page records) remain published, `no-store`, and
  non-blocking. They are never compared with the edited record's document ID.
- Published rendering never reads Draft content. A rejected optional frontend
  token retries only the public published API.
- Strapi create/update/delete lifecycle events call the protected Motorsport
  revalidation endpoint. It expires matching data immediately and revalidates
  only affected Motorsport paths.

Configure these server-only values. Generate independent random values for
production and never use `NEXT_PUBLIC_*` names:

| Service | Variable | Purpose |
| --- | --- | --- |
| Motorsport frontend | `STRAPI_API_TOKEN` | Read-only token with approved Motorsport `find`/`findOne` permissions |
| Motorsport frontend + Strapi | `PREVIEW_SECRET` | Signs the exact Preview handoff |
| Motorsport frontend + Strapi | `MOTORSPORT_REVALIDATION_SECRET` | Authenticates CMS cache invalidation; must differ from `PREVIEW_SECRET` |
| Strapi | `MOTORSPORT_FRONTEND_REVALIDATE_URL` | Server-to-server URL ending in `/api/revalidate` |

For local Docker, Strapi loads `cms/.env` so the API token salt, JWT secrets,
app keys, and encryption key stay identical to host mode while using the same
database. The Motorsport container always uses `http://strapi:1337` for
server-side CMS reads; the browser media URL remains `http://localhost:1337`.

## Token provisioning and rotation

1. In Strapi, create or rotate a custom read-only API token.
2. Grant `find` and `findOne` for Site Page, Site, Top Navigation Item, Event,
   Motorsport Program/Rider/Standing/Regulation, News Article, Media Gallery,
   Merchandise Item, Ticket CTA, Partner, Leadership Person, Corporate Report,
   Ecosystem Business, Job Vacancy, and every Motorsport page Single Type
   (Home, About, Events, News, Gallery, Merchandise, Tickets, Contact,
   Partners, and Experience).
3. Store the value as `STRAPI_API_TOKEN` only in the Motorsport server secret
   store. Restart the Motorsport process or container.
4. Run `pnpm cms:preview:preflight` in `frontend-motorsport`.
5. Revoke the old token only after both published and authenticated Draft probes
   pass. Never paste token values into documentation or client code.

## Editor map

All rows below are under **Content Manager → Site Page** unless another
collection is named.

| Route | Hero/page controls | Section controls |
| --- | --- | --- |
| `/` | `heroEnabled`, `heroSlides`, `pageAvailability` | `motorsportInformationBand`, `motorsportWorldSection`, `upcoming-events`, `motorsportTicketSection`, `latest-news`, `connected-records`, `gallery` |
| `/about` | `heroEnabled`, `heroMedia`, `heroTitle`, `heroDescription`, `pageAvailability` | `profile`, `about-capabilities`, `team-intro`, `contact-cta`, `ecosystem-cta` |
| `/events` | Standard hero/page controls | `event-control`, `programmes`, `calendar` |
| `/news` | Standard hero/page controls | `news-control`, `lead-story`, `archive-intro`, `news-gallery-cta`; stories come from **News Article** |
| `/gallery` | Standard hero/page controls | `gallery-intro`, `gallery-archive`; frames come from **Media Gallery** |
| `/merchandise` | Standard hero/page controls | `merch-control`, `merchandise-catalog`, `merch-final-cta`; products come from **Merchandise Item** |
| `/tickets` | Standard hero/page controls | `ticket-control`, `featured-ticket`, `ticketed-events`, `ticket-info`; destinations come from **Ticket CTA** |
| `/contact` | Standard hero/page controls | `inquiry-control`, `inquiry-form`, `contact-final-cta` |
| `/partners` | Standard hero/page controls | `partner-control`, `partner-network`, `partners-final-cta`; logos/content come from **Partner** |
| `/experience` | Standard hero/page controls | `experience-control`, `experience-pillars`, `experience-track`, `experience-final-cta` |

Event detail and IJTC routes use **Event**, **Motorsport Program**, **Motorsport
Rider**, **Motorsport Standing**, and **Motorsport Regulation**. News detail
uses **News Article**. The Event dropdown uses published Motorsport Program
status, short navigation label, order, locale, and canonical URL.

Each `shared.page-section` uses `sectionKey`, `isActive`, `eyebrow`, `title`,
`body`, optional image, CTA label, and CTA URL. Do not reuse one key for two
unrelated visual blocks.

## Preview troubleshooting

1. Run `pnpm cms:preview:preflight`.
2. If a normal page still shows the Preview diagnostic, open
   `/api/preview/exit` on the Motorsport frontend, then reload the live route.
   This disables Draft Mode and clears the signed Preview cookie.
3. HTTP 401/403 on Draft: rotate or repair the read token permissions; never
   fall back to anonymous Draft reads.
4. Correct record but wrong language: confirm the Strapi locale selector and
   localization exists. Exact Preview deliberately does not fall back from
   Indonesian to English.
5. Preview error page: confirm UID, document ID, path, status, and
   `PREVIEW_SECRET` match on both services.
6. Host Preview works but Docker fails: confirm Docker Strapi loads the same
   `cms/.env` cryptographic values and the frontend uses `http://strapi:1337`.
7. Saved Draft differs from live: this is expected until publish. If published
   output remains stale, use the revalidation checks below.

During the Single Type rollout, a Preview URL generated from a legacy `Site
Page` record keeps its original `api::site-page.site-page` context. The frontend
reads that request through `site-pages` instead of attempting the new Single
Type endpoint; new Single Type Preview URLs continue to use their exact
dedicated endpoint. This preserves existing editor links during migration.

Preview is scoped to the edited record, not the entire page tree. For example,
Previewing a **Top Navigation Item** reads that one item's Draft document while
the homepage, its page data, and all other navigation entries remain published.
This prevents a navigation-item Preview from failing with an unrelated
`site-pages` or page Single Type diagnostic.

## Revalidation operations

- Endpoint: `POST /api/revalidate` on the Motorsport frontend.
- Header: `x-sarga-revalidation-secret`.
- Body carries only content type, action, document ID, locale, slug, and route.
- Missing/incorrect secret returns HTTP 401; invalid payload returns HTTP 400.
- Strapi retries a failed notification three times with a two-second timeout
  and logs only content type/action/status, never content or secrets.

After a publish/unpublish incident:

1. Confirm both services have the same revalidation secret.
2. Confirm Strapi can reach `MOTORSPORT_FRONTEND_REVALIDATE_URL` from its own
   network namespace.
3. Check for `[motorsport-revalidation] frontend notification failed` in Strapi
   logs.
4. Correct connectivity/secret and safely retry by saving/publishing the entry
   again or issuing an authorized revalidation request.
5. Do not clear Gateway or Horse Sport caches; this hook is Motorsport-only.

## Repeatable validation

```bash
cd frontend-motorsport
pnpm cms:preview:preflight
pnpm uat:routes
pnpm typecheck
pnpm lint
pnpm build
```

For Docker:

```bash
docker compose --profile apps config --quiet
docker compose --profile apps build strapi frontend-motorsport
docker compose --profile apps up -d postgres strapi frontend-motorsport
cd frontend-motorsport && pnpm cms:preview:preflight && pnpm uat:routes
```
