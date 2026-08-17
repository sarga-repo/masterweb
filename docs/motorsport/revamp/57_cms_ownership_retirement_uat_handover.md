# MSR-CMS-OWNERSHIP-6/7 — Legacy retirement and UAT handover

## Phase 6: legacy retirement contract

The following legacy shared collection records are now retired only when their
`siteScope` is `motorsport`: Site Page, Event, Leadership Person, Merchandise
Item, News Article, Partner, Ticket CTA, and Top Navigation Item. Shared media,
ecosystem businesses, sites, and Gateway/Horse Sport records are not touched.

Retirement means **unpublished**, not deleted and not re-scoped. This keeps the
source data available to Super Admin for the agreed release-cycle rollback while
preventing it from being returned by published APIs. The frontend no longer
falls back to these legacy Motorsport records.

The archive manifest is stored in Strapi's database store under
`plugin:sarga-motorsport/legacy-content-retirement`. It records the original
published state per document and locale so only documents published before the
retirement are republished during a rollback.

### One-shot migration procedure

Run each command from the repository root. Do not leave `apply` or `restore` in
a persistent environment configuration.

```sh
# Report candidates; no records change.
MOTORSPORT_LEGACY_RETIREMENT_MODE=dry-run docker compose --profile apps up -d --force-recreate strapi

# Unpublish Motorsport-only legacy records and persist the rollback manifest.
MOTORSPORT_LEGACY_RETIREMENT_MODE=apply docker compose --profile apps up -d --force-recreate strapi

# Confirm the manifest exists and no Motorsport legacy record remains published.
MOTORSPORT_LEGACY_RETIREMENT_MODE=verify docker compose --profile apps up -d --force-recreate strapi

# Return to normal runtime mode.
docker compose --profile apps up -d --force-recreate strapi
```

To undo the archive within the release-cycle retention window:

```sh
MOTORSPORT_LEGACY_RETIREMENT_MODE=restore docker compose --profile apps up -d --force-recreate strapi
docker compose --profile apps up -d --force-recreate strapi
```

The migration gate and its permitted values are documented in `cms/.env.example`
and supplied to the local Strapi service through `docker-compose.yml`.

## Phase 7: editor and launch UAT

### Ownership checks

1. A Motorsport Admin can see and manage `Motorsport ...` collection entries,
   Motorsport Program/Regulation/Rider/Standing, the ten dedicated Motorsport
   page single types, scoped Site, and shared Media Gallery.
2. A Motorsport Admin cannot access legacy shared Motorsport editor subjects,
   Gateway/Horse Sport workspaces, or their dedicated records.
3. A Super Admin can inspect the unpublished legacy archive and all workspaces.

### Content and runtime checks

1. Edit and publish EN and Indonesian variants of a dedicated record; confirm
   the correct public route and language show the edited published variant.
2. Verify every dedicated page single type controls its hero, information band,
   enabled components, ticket CTAs, media, and route path as documented by its
   schema.
3. Verify each `routePath` accepts only an approved path and that duplicate
   claims are rejected by the lifecycle validator.
4. Verify Preview uses the edited dedicated document and never shows a legacy
   Site Page fallback.
5. Verify Ticket CTA destinations continue to use partner redirects or approved
   internal event paths; no checkout behavior is introduced.

### Operational checks

```sh
cd cms && pnpm exec tsc --noEmit
cd ../frontend-motorsport && pnpm exec tsc --noEmit
docker compose --profile apps ps
```

For a stale local Next.js development cache after an app/schema change:

```sh
docker compose --profile apps up -d --force-recreate --renew-anon-volumes frontend-motorsport
```

This only renews the frontend anonymous cache volume; it does not alter the
PostgreSQL database or Strapi uploads.
