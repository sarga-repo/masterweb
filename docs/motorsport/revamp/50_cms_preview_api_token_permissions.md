# Motorsport CMS Preview API-token permissions

## Purpose

The Motorsport frontend uses `STRAPI_API_TOKEN` for both published content and
Next.js Draft Mode reads. Strapi public-role permissions and API-token
permissions are separate. A token can therefore work for live pages while
returning HTTP 403 for a newly-added page Single Type, which makes the
frontend's Preview error screen appear to be a stale Draft Mode cookie.

## Required configuration

- `frontend-motorsport/.env.local` (or the deployment secret store) must set
  `STRAPI_API_TOKEN` to the custom Strapi API token used for frontend reads.
- `CMS_PREVIEW_API_TOKEN_NAME` identifies that token in the CMS database and
  defaults to `Read Only`. Set it explicitly when a deployment uses another
  token name.
- Do not commit either token value. Only the token name belongs in
  `cms/.env.example`.

## Bootstrap synchronization

On every Strapi bootstrap, `ensureFrontendApiTokenPermissions` idempotently
ensures the configured custom token has `find` and `findOne` for the legacy
Site Page endpoint and all ten Motorsport page Single Types. Existing token
permissions are preserved; only missing permissions are added. This makes a
fresh database restore and an upgrade safe without manual admin clicks.

The synchronization does not grant create, update, delete, or publish access.
Those remain Content Manager RBAC permissions for authenticated editors.

## Verification

After restarting Strapi, verify the token without printing it:

```bash
token="$(sed -n 's/^STRAPI_API_TOKEN=//p' frontend-motorsport/.env.local)"
curl -sS -o /dev/null -w '%{http_code}\n' \
  -H "Authorization: Bearer $token" \
  'http://localhost:1337/api/motorsport-about-page?status=draft&locale=en'
```

The expected result is `200`. Repeat for the other Motorsport page Single
Types when performing a deployment smoke test. A `403` means the token name,
token value, or bootstrap synchronization is incorrect; it is not fixed by
clearing browser cookies alone.

## Local Draft Mode recovery

After the permission fix, click **Exit Preview** once (or request
`/api/preview/exit`) to clear an older local Draft Mode session, then enter
Preview again from Strapi. The signed Motorsport preview cookie is scoped to a
specific UID/document/locale and expires after 30 minutes; it is not a content
cache.
