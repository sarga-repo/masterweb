# 16 — GWR-CMS-8 Migration, UAT, and Handover Evidence

Status: repository implementation and isolated local rehearsal completed
2026-08-11. Staging promotion, stakeholder translation approval, and production
launch decision remain external gates.

## Scope completed

- Captured the current shared CMS inventory and bilingual completeness report.
- Created a fresh PostgreSQL custom-format dump, uploads archive, and SHA-256
  manifest, then restored the database into the isolated
  `sarga_strapi_i18n_rehearsal` database.
- Booted Strapi only against the restored database and provisioned five
  disposable UAT accounts.
- Ran workspace RBAC, i18n navigation, and localized content/component UAT.
- Captured a post-UAT target inventory and compared it with the source using an
  exact, fail-on-drift reconciliation command.
- Repeated three-site English/Indonesian browser, responsive, metadata,
  navigation, cross-site link, sitemap, and robots checks.
- Fixed two launch-readiness defects found by the browser pass: Gateway and
  Horse Sport cross-site homepage links now retain `/id`, and all three sitemap
  home entries emit the correct Indonesian `/id` alternate.

## Local reconciliation evidence

| Measure | Source | Restored target | Result |
| --- | ---: | ---: | --- |
| Registered locales | `en`, `id` | `en`, `id` | Exact |
| CMS content types | 21 | 21 | Exact |
| Total API content rows | 304 | 304 | Exact |
| Media Library records | 84 | 84 | Exact |
| Upload files | 546 | 546 | Exact |
| Upload bytes | 222,600,452 | 222,600,452 | Exact |
| Content/localization/media drift | — | 0 | Pass |

Artifacts were generated under `/tmp/sarga-gwr-cms-5/` and are disposable
local evidence, not production backups. Staging must generate its own encrypted,
access-controlled artifacts and checksums.

## Authenticated UAT evidence

The restored CMS passed with Gateway Admin, Motorsport Admin, Horse Sport
Admin, Shared Library Admin, and Super Admin accounts:

- one correct workspace per managed role and four for Super Admin;
- list/create/update/clone/delete/publish/unpublish scope enforcement;
- tampered filters and direct foreign-record access denied;
- managed locale read allowed while locale administration remained denied;
- both-locale Top Navigation ownership, structural parity, and unsafe URL
  rejection;
- Shared Library navigation access denied;
- localized dynamic zones, single and repeatable components, clone,
  draft/publish, public locale queries, and cleanup.

All disposable records were removed by the harness. The rehearsal database is
not a content source for staging or production.

## Bilingual completeness result

The generated report is
`17_gwr_cms_8_bilingual_content_completeness.md`:

- 96 localized CMS documents exist;
- 96 have published English records;
- 21 have published Indonesian records, all approved Top Navigation documents;
- 75 still require Indonesian editorial translation/review/publish;
- no machine-generated editorial translation was added.

Until those 75 records are approved, the frontends intentionally render the
whole English record at the Indonesian URL and apply `noindex, follow`. Owners
are assigned by site scope in the report; unscoped records require Super Admin
to confirm the responsible editorial team.

## Browser and SEO evidence

Playwright checked the three home routes at 1280×720 and 390×844:

- `lang=id`, localized navigation/language controls, internal `/id` links, and
  no horizontal overflow passed;
- Indonesian fallback pages emitted `noindex, follow`;
- canonical and `en`/`id`/`x-default` alternates were correct;
- Gateway, Motorsport, and Horse Sport cross-site links retained `/id`;
- all three `sitemap.xml` home entries emitted English `/` and Indonesian `/id`;
- all three `robots.txt` endpoints returned successfully.

Development-only console errors were limited to Next.js HMR WebSocket retries
inside the Playwright CLI session; production builds are the release gate.

## Final repository validation

- CMS: 22 mail tests, 9 workspace access-control tests, TypeScript, and Strapi
  production admin build passed.
- Gateway: lint, TypeScript, 37 tests, and Next.js production build passed.
- Horse Sport: lint, TypeScript, 10 tests, and Next.js production build passed.
- Motorsport: lint and TypeScript passed. Its production build passed in
  GWR-CMS-7; this final pass intentionally did not overwrite `.next` while the
  user's existing local development server was running.
- Docker Compose with the `apps` profile rendered successfully and retained
  PostgreSQL host port `5435`.
- `git diff --check` passed.

## Repeatable commands

```bash
pnpm --dir cms i18n:inventory --output /secure/artifacts/source.json
pnpm --dir cms i18n:completeness \
  --output /secure/artifacts/bilingual-completeness.md

# After restoring/importing and booting the target CMS:
DATABASE_NAME=<rehearsal_or_target_database> \
  pnpm --dir cms i18n:inventory --output /secure/artifacts/target.json
pnpm --dir cms i18n:compare \
  --source /secure/artifacts/source.json \
  --target /secure/artifacts/target.json \
  --output /secure/artifacts/reconciliation.md
```

`i18n:compare` exits non-zero for locale, content type, row/document,
draft/published, per-locale, media-record, or upload-file/byte drift.

## Remaining staging and launch gates

The following cannot be truthfully completed without the staging VM, its
protected CMS credentials, and Sarga stakeholders:

1. Import the approved encrypted source archive into staging during a content
   freeze and record the real archive checksum/Git SHA/operator timestamps.
2. Run the same source/target reconciliation against staging paths and media
   URLs.
3. Run the five-role authenticated harness and browser matrix on staging HTTPS
   domains with disposable staging users.
4. Have Gateway, Motorsport, Horse Sport, and Shared Library owners translate,
   review, and sign the completeness report.
5. Re-run the report until every page intended for indexing has a reviewed,
   published Indonesian localization.
6. Capture stakeholder UAT, backup/rollback drill, and production launch
   approval.

Do not resume Gateway GWR-6 as an implied deployment approval. The user may
approve that engineering phase separately, while production i18n launch remains
subject to the gates above.
