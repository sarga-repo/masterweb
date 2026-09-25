# Motorsport-only production migration — proposed specification

Status: implementation complete; production-VM validation and cutover remain
operator-controlled (2026-09-25). This document does not authorize a DNS/TLS
change.

## Confirmed scope

Deploy only `frontend-motorsport` to the new production VM. The VM runs:

- Nginx as the public reverse proxy;
- the Motorsport Next.js application on `127.0.0.1:3001` under systemd;
- Node.js 22 and pnpm 10.22.0 for server-side builds and runtime.

The existing Strapi CMS remains on another host and is consumed through its
public HTTPS origin. This VM does **not** run or migrate Strapi, PostgreSQL,
Gateway, Horse Sport, or a CMS snapshot. GitHub deployment workflows are not
used in this phase. Deployment is manual.

Operators may invoke setup and release helpers using `sudo`, but the checkout,
package operations, build, and Next.js runtime use the unprivileged `sarga`
account. Running the application as root is outside the approved scope.

## What is no longer required

The CMS snapshot identity contract from the earlier draft is not required for
this migration. There is no snapshot export/import, schema-SHA check, local
PostgreSQL role/database, uploads backup, or CMS service on the Motorsport VM.
Those controls remain valid for a future CMS migration but are deferred.

The relevant identity contract is narrower: every pnpm install/build/runtime
operation must resolve the same pinned version and use writable `sarga` home
and cache paths. This directly addresses the staging failures involving pnpm
11.21.0 and `/root/.cache/node/corepack`.

## Required changes and acceptance criteria

### P0 — Reliable pnpm and unprivileged runtime

1. Update `deploy/production/install_dependencies.sh` so the system-wide pnpm
   command deterministically invokes 10.22.0 without an interactive Corepack
   download prompt. Support a Motorsport-only host without installing
   PostgreSQL by documenting and testing `--skip-postgres`. Add the equivalent
   `--skip-postgres` mode to `initialize_server.sh` so it creates the `sarga`
   account/directories without requiring a database service.
2. Update `deploy/production/build_applications.sh` so `--motorsport` performs
   both the frozen install and production build with `HOME`, `COREPACK_HOME`,
   XDG cache/config/data paths, and the required application environment owned
   by `sarga`. It must not inherit or access `/root` and must not print secrets.
3. Ensure `sarga-motorsport.service` invokes the same pinned pnpm runtime and
   does not depend on a local `sarga-cms.service`. It should depend only on
   network readiness, remain `User=sarga`/`Group=sarga`, and bind to
   `127.0.0.1:3001`.

Acceptance:

- Node reports version 22.x and pnpm reports exactly 10.22.0.
- A fresh `sarga` cache can install and build Motorsport without a prompt,
  permission error, or reference to `/root`.
- After reboot, `sarga-motorsport` starts without a local CMS unit and its main
  process runs as `sarga`.

### P0 — Explicit external-CMS configuration

4. Change the production Motorsport environment template and runbook to use
   the real public CMS HTTPS origin for server-side and browser-reachable
   access:

   ```dotenv
   STRAPI_API_URL=https://<production-cms-host>
   STRAPI_API_URL_INTERNAL=https://<production-cms-host>
   NEXT_PUBLIC_STRAPI_API_URL=https://<production-cms-host>
   ```

   `STRAPI_API_TOKEN` stays server-only and environment-specific.
   `NEXT_PUBLIC_STRAPI_API_URL` is embedded at build time, so any change to it
   requires a rebuild and restart.
5. Document external CMS prerequisites: publicly valid TLS, DNS resolvable from
   the VM, no Cloudflare/WAF rule blocking server-side requests, Motorsport's
   public origin allowed by CMS CORS/form policy, correct read/form token
   permissions, and media URLs reachable by visitors. The production VM should
   call the CMS over port 443; do not expose CMS port 1337 for this integration.

Acceptance:

- From the production VM, the public CMS origin and `/admin` respond over
  HTTPS with certificate validation enabled.
- A token-authenticated representative content request succeeds without
  logging the token.
- The built site renders CMS text and media, and an approved form smoke test
  reaches the remote CMS when `FORM_SUBMISSION_MODE=strapi`.

### P0 — Motorsport-only Nginx provisioning

6. The installer now has an explicit `--motorsport-only` mode for the selected
   scripted/repeatable approach. It:

   - require only `--motorsport-host` and `/etc/sarga/motorsport.env`;
   - install/start only `sarga-motorsport.service`;
   - generate only the Motorsport Nginx virtual host;
   - require only the Motorsport certificate/key when `--tls` is selected;
   - avoid creating, enabling, or checking a local CMS service or host;
   - retain Nginx validation and rollback of its generated configuration.

   The existing multisite behavior must remain available and unchanged unless
   `--motorsport-only` is explicitly passed.

Acceptance: this path configures a clean host using only Motorsport
inputs, `nginx -t` passes, `https://<motorsport-host>` reaches port 3001, and no
local CMS/PostgreSQL listener or unit is introduced.

### P0 — Manual reviewed-commit deployment

7. Deploy an exact reviewed commit SHA rather than running a build immediately
   after an unrestricted `git pull`. “Reviewed commit” means the full
   40-character SHA selected after review/testing and present on the approved
   remote branch. This is primarily an operational/runbook change, plus a
   preflight check in the manual helper if useful; it does not change the
   Motorsport application itself.

The intended release flow is:

```bash
sudo -u sarga git -C /srv/sarga-website fetch --prune origin
sudo -u sarga git -C /srv/sarga-website status --short
sudo -u sarga git -C /srv/sarga-website checkout --detach <APPROVED_FULL_SHA>
sudo deploy/production/build_applications.sh --motorsport
sudo systemctl restart sarga-motorsport
```

Before checkout, the working tree must be clean. Record the previous SHA for
rollback. Build must complete before restart; afterward verify systemd,
`127.0.0.1:3001`, Nginx host routing, and the public HTTPS URL. A code-only
Motorsport release does not require a PostgreSQL/uploads backup because this
host owns no CMS data.

Why this matters: a branch name or `git pull` can point to different code at
different times. An exact SHA makes the deployment reproducible, auditable,
and easy to roll back by checking out the recorded previous SHA and rebuilding.

## Documentation changes

8. Add one copy-ready Motorsport-only path to `deploy/production/README.md` and
   align the relevant parts of:

   - `deploy/production/nginx/README.md`;
   - `docs/14_ubuntu_single_vm_production_deployment.md`;
   - `docs/17_ubuntu_staging_production_deployment_playbook.md`.

The path must clearly use `install_dependencies.sh --skip-postgres`, skip all
CMS/database/snapshot steps, create only `/etc/sarga/motorsport.env`, and use
the public CMS HTTPS origin. The existing full-stack documentation remains for
other environments but must not be mixed into this procedure.

## Verification and remaining cutover checks

- `bash -n`, the Motorsport lint/typecheck/build, and isolated Linux installer
  tests have been run. ShellCheck was unavailable locally. The installer tests
  covered original full-stack behavior, invalid mixed arguments, and
  Motorsport-only HTTP/TLS service generation.
- On staging or a clean Ubuntu test VM, use an empty `sarga` Corepack cache and
  run the exact production install/build/service sequence.
- Verify the Next.js process UID, loopback-only port 3001, Nginx host routing,
  public HTTPS, remote CMS content/media, form submission, and representative
  English/Indonesian routes.
- Rehearse rollback to the recorded previous SHA and confirm the previous build
  serves successfully.
- Record release SHA, build duration, peak memory, disk headroom, public CMS
  origin, domain/TLS ownership, test evidence, and rollback operator.

## Decisions required before cutover

1. Confirm the exact Motorsport production hostname.
2. Confirm the exact public CMS HTTPS origin and that it is intended to serve
   production Motorsport traffic (not an accidental staging dependency).
3. Confirm who owns the CMS API token, CMS CORS/WAF changes, Cloudflare mode,
   origin certificate, renewal, and Nginx configuration.
4. Confirm the approved full Git SHA and previous rollback SHA.
5. Confirm who executes the release, approves go/no-go, and owns rollback.

## Implementation order

1. Confirm the hostname and CMS origin.
2. Fix the pnpm/`sarga` environment contract and decouple the Motorsport unit
   from the local CMS service.
3. Implement and test the selected Nginx path: explicit
   `--motorsport-only` installer support or a reviewed manual server block.
4. Update the production environment template and manual runbooks.
5. Rehearse build, remote-CMS integration, cutover checks, and rollback on
   staging or a clean test VM.
6. Deploy the approved SHA manually during the agreed production window.
