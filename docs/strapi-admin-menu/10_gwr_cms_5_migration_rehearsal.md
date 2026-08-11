# GWR-CMS-5 Migration Rehearsal and Validation Evidence

Date: 2026-08-11
Scope: local and isolated rehearsal only
Source database: `sarga_strapi`
Rehearsal database: `sarga_strapi_i18n_rehearsal`

## Safety sequence

1. Captured an inventory of every CMS content table, locale, draft/published
   row, media record, and file in `cms/public/uploads`.
2. Created a PostgreSQL custom-format dump and uploads archive.
3. Restored the dump into a separate database. The rehearsal script rejects an
   identical source and target database name.
4. Booted the updated Strapi application only against the rehearsal database.
5. Ran schema migration, locale bootstrap, idempotent navigation seed, API
   reconciliation, authenticated UAT, and cleanup.
6. Applied the same tested application bootstrap to the real local database.

No staging or production database was changed in this phase.

## Local artifacts and checksums

The disposable local evidence directory is `/tmp/sarga-gwr-cms-5/`. These files
are intentionally outside Git and must not be treated as durable backups.

| Artifact                   | SHA-256                                                            |
| -------------------------- | ------------------------------------------------------------------ |
| Pre-change PostgreSQL dump | `6050e9fb0b2098e57a93ff84b242b3c48e8e31d49e79ef9c03d37393baad8bc6` |
| Pre-change uploads archive | `ac6136ce9985d139cbe30a58a2fa4e4016eac99348d15cb7ddc0a00c729d2a96` |

Production/staging operators must write equivalent encrypted artifacts to an
access-controlled persistent backup location and verify their own checksums.

## Reconciliation

| Measure                                             |       Before | Rehearsal/local after | Result                                     |
| --------------------------------------------------- | -----------: | --------------------: | ------------------------------------------ |
| Existing content rows, excluding new Top Navigation |          220 |                   220 | Exact                                      |
| Top Navigation documents                            |            0 |                    21 | Expected addition                          |
| Top Navigation rows                                 |            0 |                    84 | 21 documents × 2 locales × draft/published |
| Registered locales                                  |         `en` |            `en`, `id` | Expected addition                          |
| Media database records                              |           81 |                    81 | Exact                                      |
| Media database size                                 | 35,170.68 KB |          35,170.68 KB | Exact                                      |
| Upload filesystem files                             |          531 |                   531 | Exact                                      |
| Upload filesystem bytes                             |  214,291,836 |           214,291,836 | Exact                                      |
| Navigation structural drift                         |            — |                     0 | Pass                                       |

Existing localized records were assigned to English. Indonesian editorial
translations were not fabricated. Only the approved current navigation labels
were seeded in both locales.

## Commands

Create an isolated rehearsal from a running local PostgreSQL container:

```bash
cd cms
POSTGRES_CONTAINER=sarga-postgres-local \
SOURCE_DATABASE_NAME=sarga_strapi \
REHEARSAL_DATABASE_NAME=sarga_strapi_i18n_rehearsal \
I18N_REHEARSAL_ARTIFACT_DIR=/secure/rehearsal-artifacts \
pnpm i18n:rehearsal:prepare
```

Point a separate CMS process at the rehearsal database, start it once, and
capture the post-migration inventory:

```bash
DATABASE_NAME=sarga_strapi_i18n_rehearsal pnpm develop
DATABASE_NAME=sarga_strapi_i18n_rehearsal \
  pnpm i18n:inventory --output /secure/rehearsal-artifacts/post.json
```

Run the authenticated UAT with temporary test users provisioned only in the
rehearsal environment:

```bash
pnpm uat:workspace-rbac
pnpm uat:i18n-navigation
pnpm uat:i18n-content
```

The UAT scripts require their documented role-specific credentials and remove
their temporary content after a successful run. Never reuse production editor
passwords for automated UAT.

## Passed checks

- Focused workspace and i18n unit tests.
- Strapi TypeScript compile and generated schema types.
- English and Indonesian public Top Navigation APIs: 21 documents per locale.
- Five authenticated roles: exact site scope, locale-read permission, locale
  administration denied to managed roles, Shared Library navigation denied,
  and Super Admin unrestricted.
- Unsafe URL rejection, English structural-master enforcement, stable route
  parity, duplicate key rejection, and maximum-eight-enabled-item enforcement.
- Both-locale dynamic zone, single/repeatable component, relation,
  draft/publish, clone, public query, and cleanup scenarios.
- Repeated application bootstrap preserved exactly 21 navigation documents per
  locale and did not overwrite existing editor-managed rows.

## Rollback

Stop Strapi, restore the paired pre-change PostgreSQL dump and uploads archive,
then start the previous application release. Database and uploads must always be
rolled back together. Confirm English API counts, media records/files, and
admin login before reopening traffic.

## Phase boundary

The CMS/API contract is ready, but public frontends do not consume it yet.
English URLs, static header menus, and current frontend behavior remain
unchanged until GWR-CMS-6 is approved.
