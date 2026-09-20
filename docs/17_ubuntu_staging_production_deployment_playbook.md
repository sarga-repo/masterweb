# Ubuntu Staging and Production Deployment Playbook

This playbook is the handover for deploying the Sarga Gateway, the optional
static Gateway review frontend, Motorsport, Horse Sport, and shared Strapi CMS
applications on Ubuntu with systemd and a single VM per environment. Nginx is
intentionally out of scope: DevOps owns
DNS, TLS, virtual hosts, proxy headers, upload limits, and reloads.

Use this document together with:

- `docs/14_ubuntu_single_vm_production_deployment.md` for the full host,
  PostgreSQL, backup, and operational baseline.
- `docs/15_strapi_content_media_promotion.md` for encrypted CMS snapshot
  export/import and promotion rules.
- `deploy/production/README.md` for the repository deployment helpers.
- `docs/09_quality_uat_acceptance.md` and
  `docs/motorsport/revamp/07_testing_uat.md` for release acceptance.

## 1. Deployment topology

The supported native Ubuntu topology is:

| Service | systemd unit | Loopback listener |
| --- | --- | --- |
| Gateway | `sarga-gateway` | `127.0.0.1:3000` |
| Static Gateway review frontend | `sarga-gateway-static` | `127.0.0.1:3005` |
| Motorsport | `sarga-motorsport` | `127.0.0.1:3001` |
| Horse Sport | `sarga-horsesport` | `127.0.0.1:3002` |
| Strapi CMS | `sarga-cms` | `127.0.0.1:1337` |
| PostgreSQL | `postgresql` | `127.0.0.1:5432` |

The environment templates assume these hostnames:

| Environment | Gateway | Motorsport | Horse Sport | CMS |
| --- | --- | --- | --- | --- |
| Staging | `staging.sarga.co` | `sargamotorsport.co` | `staging-horsesport.sarga.co` | `staging-cms.sarga.co` |
| Production | `sarga.co` | `motorsport.sarga.co` | `horsesport.sarga.co` | `cms.sarga.co` |

If DNS uses different names, update every matching URL in the four environment
files before building. `NEXT_PUBLIC_*` values are embedded into the Next.js
build and changing them requires a rebuild.

This playbook assumes separate staging and production VMs. Running both
stacks on one VM requires separate ports, systemd unit names, database names,
upload directories, and environment paths; do not mix the two configurations.

## 2. Environment files and secret policy

Templates are stored here:

```text
deploy/environments/staging/cms.env.example
deploy/environments/staging/gateway.env.example
deploy/environments/staging/motorsport.env.example
deploy/environments/staging/horsesport.env.example
deploy/environments/staging/gateway-static.env.example

deploy/environments/production/cms.env.example
deploy/environments/production/gateway.env.example
deploy/environments/production/motorsport.env.example
deploy/environments/production/horsesport.env.example
deploy/environments/production/gateway-static.env.example
```

They are safe templates only. They contain no usable credentials. DevOps must:

1. Copy the four templates for the target environment to `/etc/sarga/`.
2. Replace all `REPLACE_WITH_*` values through the approved secret manager or
   secure handover channel.
3. Keep the populated files owned by `root:sarga` with mode `0640`.
4. Never paste secrets into Git, tickets, shell commands, CI logs, or chat.
5. Use different values for staging and production. Do not reuse Strapi keys,
   database passwords, API tokens, preview secrets, or revalidation secrets.

Create the directory and install templates:

```bash
sudo install -d -o root -g sarga -m 0750 /etc/sarga
sudo install -o root -g sarga -m 0640 deploy/environments/staging/cms.env.example /etc/sarga/cms.env
sudo install -o root -g sarga -m 0640 deploy/environments/staging/gateway.env.example /etc/sarga/gateway.env
sudo install -o root -g sarga -m 0640 deploy/environments/staging/motorsport.env.example /etc/sarga/motorsport.env
sudo install -o root -g sarga -m 0640 deploy/environments/staging/horsesport.env.example /etc/sarga/horsesport.env
sudoedit /etc/sarga/cms.env
sudoedit /etc/sarga/gateway.env
sudoedit /etc/sarga/motorsport.env
sudoedit /etc/sarga/horsesport.env
```

Use the production directory instead of the staging directory on the production
VM. `sudoedit` is preferred over `echo`, `printf`, or shell history because it
does not place the secret values in the operator's command history.

### Required cross-file equality

These values must match exactly within each environment:

- CMS `PREVIEW_SECRET` = Motorsport `PREVIEW_SECRET`.
- CMS `MOTORSPORT_REVALIDATION_SECRET` = Motorsport
  `MOTORSPORT_REVALIDATION_SECRET`.
- CMS `PUBLIC_URL` = the public CMS URL in all frontend
  `NEXT_PUBLIC_STRAPI_API_URL` values.
- Every frontend `STRAPI_API_URL` and `STRAPI_API_URL_INTERNAL` points to
  `http://127.0.0.1:1337` on the native single VM.
- Every frontend `FORM_SUBMISSION_MODE` is `strapi` in staging and production.
- Each frontend `STRAPI_API_TOKEN` is a target-environment token. It must have
  only the published read permissions and form-create permissions required by
  that frontend. Create separate tokens for Gateway, Motorsport, and Horse Sport
  when the CMS permission model allows it.

The templates leave preview disabled in production and mail disabled in both
environments. Enable either only after its documented UAT gate passes.

### Secret generation guidance

Generate values on the target host or in the approved secret manager. Do not
put generated output in a command that will be logged:

```bash
openssl rand -base64 48
openssl rand -hex 32
```

Use four independent values in `APP_KEYS`, separated by commas. Generate a
separate random value for every Strapi secret and every environment.

## 3. Host prerequisites

DevOps completes these steps on each VM:

- Ubuntu 22.04.5 LTS or the approved Ubuntu baseline.
- Static IP and DNS records for all four hostnames.
- Node.js 22 and pnpm 10.22.0 installed system-wide.
- PostgreSQL 16 installed, enabled, and bound only to localhost.
- `git`, `curl`, `build-essential`, `python3`, `make`, `g++`, `libvips-dev`,
  `openssl`, and `sudo` installed.
- Linux user and group `sarga` exist and own `/srv/sarga-website`.
- `/etc/sarga` exists with mode `0750`, owned by `root:sarga`.
- Nginx proxies the four public hostnames to the loopback listeners above.
- Cloud firewall/UFW exposes only the approved SSH port, 80, and 443. Ports
  3000-3002, 1337, and 5432 remain private.
- At least 4 vCPU, 8 GB RAM, and 80 GB SSD are available for the baseline.

The repository helpers can install the common runtime and host baseline:

```bash
cd /srv/sarga-website
sudo deploy/production/install_dependencies.sh
sudo deploy/production/initialize_server.sh --fix-repo-ownership
sudo deploy/production/configure_swap.sh
sudo deploy/production/configure_firewall.sh
```

Review helper output and provider firewall rules before enabling UFW. The
helpers do not create application secrets, import CMS content, configure DNS,
or configure Nginx.

## 4. PostgreSQL setup

Use a separate database and role on staging. Production uses the names below.
Create passwords interactively with `\\password`; do not put them in shell
history.

### Staging

```bash
sudo -u postgres psql
```

```sql
CREATE ROLE sarga_cms_staging LOGIN;
\\password sarga_cms_staging
CREATE DATABASE sarga_strapi_staging OWNER sarga_cms_staging ENCODING 'UTF8';
\\q
```

### Production

```bash
sudo -u postgres psql
```

```sql
CREATE ROLE sarga_cms LOGIN;
\\password sarga_cms
CREATE DATABASE sarga_strapi OWNER sarga_cms ENCODING 'UTF8';
\\q
```

Keep PostgreSQL on localhost with SCRAM authentication. The CMS environment
password must match the role password. Verify readiness:

```bash
sudo systemctl enable --now postgresql
sudo -u postgres pg_isready
sudo ss -lntp | grep ':5432'
```

The final `ss` output must show a local listener only; never add a public CIDR
to `pg_hba.conf` for this deployment.

## 5. Checkout and install the reviewed release

Deploy an immutable reviewed tag or commit SHA. Do not deploy an unreviewed
moving branch.

```bash
sudo -u sarga git clone <REPOSITORY_SSH_URL> /srv/sarga-website
sudo -u sarga git -C /srv/sarga-website fetch --tags origin
sudo -u sarga git -C /srv/sarga-website checkout --detach <RELEASE_TAG_OR_COMMIT_SHA>

sudo -u sarga pnpm --dir /srv/sarga-website/cms install --frozen-lockfile
sudo -u sarga pnpm --dir /srv/sarga-website/frontend-gateway install --frozen-lockfile
sudo -u sarga pnpm --dir /srv/sarga-website/frontend-motorsport install --frozen-lockfile
sudo -u sarga pnpm --dir /srv/sarga-website/frontend-horsesport install --frozen-lockfile
```

Do not delete `cms/public/uploads`; it is CMS production data and must be
included in the backup unit with the database.

## 6. Install systemd units

Install the repository units after the checkout is at the reviewed release:

```bash
sudo cp /srv/sarga-website/deploy/production/systemd/*.service /etc/systemd/system/
sudo systemctl daemon-reload
```

The units read `/etc/sarga/cms.env`, `gateway.env`, `motorsport.env`, and
`horsesport.env`. They run as the unprivileged `sarga` user and bind only to
loopback. Do not change `EnvironmentFile` paths without updating the build
procedure.

## 7. Initial staging deployment

Staging is the first target for CMS migration and full UAT.

### 7.1 Build and start the empty CMS

```bash
cd /srv/sarga-website
sudo deploy/production/build_applications.sh --cms
sudo systemctl enable --now sarga-cms
sudo systemctl is-active --quiet sarga-cms
curl --fail --silent --show-error http://127.0.0.1:1337/admin >/dev/null
```

### 7.2 Import the approved staging CMS snapshot

Export the snapshot from the frozen reviewed source using
`docs/15_strapi_content_media_promotion.md`. Transfer the archive, `.sha256`,
and `.git-sha` sidecars, and the passphrase through separate secure channels.

The target checkout must match the snapshot Git SHA and the target CMS must be
built from that checkout. The staging database name is explicit because the
staging template uses `sarga_strapi_staging`:

```bash
sudo install -d -o root -g root -m 0700 /var/backups/sarga/incoming
# Transfer the archive and its sidecars into /var/backups/sarga/incoming.

sudo deploy/production/import_cms_snapshot.sh \
  --archive /var/backups/sarga/incoming/sarga-cms-<TIMESTAMP>.tar.gz.enc \
  --database sarga_strapi_staging
```

The importer verifies the archive checksum, Git SHA, Strapi version, database,
and service, takes paired rollback backups, requires interactive confirmation,
and prompts for the archive passphrase. It does not import admin accounts or
API tokens.

After import:

1. Create the staging Super Admin and site-scoped editor accounts.
2. Create separate staging frontend API tokens.
3. Put the tokens into the three frontend environment files.
4. Generate an i18n inventory and completeness report.
5. Resolve or explicitly accept missing/draft Indonesian content before UAT.
6. Keep fallback Indonesian records `noindex` until editorial approval.

### 7.3 Build and start all staging applications

```bash
sudo deploy/production/build_applications.sh --all
sudo systemctl enable --now sarga-gateway sarga-motorsport sarga-horsesport
sudo systemctl restart sarga-cms
sudo systemctl is-active sarga-cms sarga-gateway sarga-motorsport sarga-horsesport
```

The build helper loads each protected environment in an isolated subshell and
requires `NODE_ENV=production`. It builds sequentially to limit memory use.

### 7.4 DevOps Nginx handoff

Give DevOps the hostname-to-listener map from section 1. They should configure
Nginx and TLS, then validate:

```bash
sudo nginx -t
sudo systemctl reload nginx
curl --fail --silent --show-error https://staging.sarga.co/ >/dev/null
curl --fail --silent --show-error https://sargamotorsport.co/ >/dev/null
curl --fail --silent --show-error https://staging-horsesport.sarga.co/ >/dev/null
curl --fail --silent --show-error https://staging-cms.sarga.co/admin >/dev/null
```

Do not expose the loopback services directly or configure frontend URLs to
`localhost`/`127.0.0.1`.

## 8. Initial production deployment

Production must be promoted from approved staging, not directly from a laptop
or developer database.

1. Freeze staging CMS writes.
2. Complete staging route, content, forms, ticket links, media, SEO, sitemap,
   locale, and role UAT.
3. Record the approved release Git SHA and CMS archive SHA-256.
4. Take a production PostgreSQL/uploads backup before any import.
5. Checkout the exact approved Git SHA on production.
6. Install the production environment files and verify all placeholders are
   removed.
7. Build and start the CMS.
8. Import the approved staging snapshot with the production database name.
9. Recreate production admin users and API tokens.
10. Build and start Gateway, Motorsport, and Horse Sport.
11. Hand the public listeners to DevOps for Nginx/TLS validation.
12. Execute production smoke tests and obtain launch approval.

Commands:

```bash
cd /srv/sarga-website
sudo -u sarga git -C /srv/sarga-website checkout --detach <APPROVED_STAGING_GIT_SHA>
sudo deploy/production/build_applications.sh --cms
sudo systemctl enable --now sarga-cms

sudo deploy/production/import_cms_snapshot.sh \
  --archive /var/backups/sarga/incoming/sarga-cms-<TIMESTAMP>.tar.gz.enc \
  --database sarga_strapi

sudo deploy/production/build_applications.sh --all
sudo systemctl enable --now sarga-gateway sarga-motorsport sarga-horsesport
sudo systemctl restart sarga-cms
sudo systemctl is-active sarga-cms sarga-gateway sarga-motorsport sarga-horsesport
```

After production import, do not routinely overwrite production with a full
staging snapshot. Future CMS content promotion requires an explicit approved
migration/export strategy because a full import replaces newer production
content and form submissions.

## 9. Release deployment after initial launch

For an application-only release:

```bash
cd /srv/sarga-website
sudo -u sarga git -C /srv/sarga-website fetch --tags origin
sudo -u sarga git -C /srv/sarga-website checkout --detach <RELEASE_TAG_OR_COMMIT_SHA>

sudo deploy/production/build_applications.sh --all
sudo systemctl restart sarga-cms
sudo systemctl restart sarga-gateway sarga-motorsport sarga-horsesport
```

If only one frontend changed, use the selected helper and restart only that
service after a verified pre-deploy backup:

```bash
sudo deploy/production/build_applications.sh --motorsport --restart
```

Build all frontends when shared CMS contracts, shared types, environment URLs,
or root dependencies changed. Rebuild whenever a `NEXT_PUBLIC_*` value changes.

For a release containing a CMS schema/data/content migration, stop and follow
the encrypted promotion and rollback procedure in
`docs/15_strapi_content_media_promotion.md` before restarting the CMS.

## 10. Verification checklist

Run these checks on the VM before asking DevOps to close the deployment:

```bash
sudo systemctl is-active postgresql sarga-cms sarga-gateway sarga-motorsport sarga-horsesport
curl --fail --silent --show-error http://127.0.0.1:1337/admin >/dev/null
curl --fail --silent --show-error http://127.0.0.1:3000/ >/dev/null
curl --fail --silent --show-error http://127.0.0.1:3001/ >/dev/null
curl --fail --silent --show-error http://127.0.0.1:3002/ >/dev/null
sudo ss -lntp
sudo journalctl -u sarga-cms -u sarga-gateway -u sarga-motorsport -u sarga-horsesport --since '10 minutes ago' --no-pager
```

The acceptance matrix must cover:

- Public HTTPS homepage for all three sites.
- CMS `/admin` and authenticated role/workspace access.
- Representative CMS-managed pages in English and Indonesian.
- Gateway-to-Motorsport and Gateway-to-Horse Sport links.
- Contact and newsletter submissions using `FORM_SUBMISSION_MODE=strapi`.
- Ticket redirects; iframe embeds remain disabled unless allowlisted.
- Motorsport preview/revalidation only when explicitly enabled.
- Hero image/video media through the public CMS origin, including byte ranges
  for video where enabled.
- `robots.txt`, `sitemap.xml`, canonical URLs, and locale alternates.
- Mobile, tablet, and desktop smoke checks.
- No direct public access to ports 3000-3002, 1337, or 5432.

## 11. Backup and rollback

Before every release, create and verify a paired database/uploads backup:

```bash
BACKUP_DATE="$(date -u +%Y%m%dT%H%M%SZ)"
sudo install -d -o root -g root -m 0700 /var/backups/sarga
sudo -u postgres pg_dump --format=custom sarga_strapi > "/var/backups/sarga/sarga_strapi_${BACKUP_DATE}.dump"
sudo tar -C /srv/sarga-website/cms/public -czf \
  "/var/backups/sarga/uploads_${BACKUP_DATE}.tar.gz" uploads
sudo chmod 600 "/var/backups/sarga/sarga_strapi_${BACKUP_DATE}.dump" \
  "/var/backups/sarga/uploads_${BACKUP_DATE}.tar.gz"
```

For an application-only rollback:

```bash
sudo -u sarga git -C /srv/sarga-website checkout --detach <PREVIOUS_REVIEWED_SHA>
sudo deploy/production/build_applications.sh --all
sudo systemctl restart sarga-cms sarga-gateway sarga-motorsport sarga-horsesport
```

Restore PostgreSQL and uploads only when the release changed data/schema or the
paired import rollback requires it. Stop the affected service, restore both
artifacts from the same backup unit, start Strapi first, then the frontends, and
repeat the verification checklist. Never restore the database without its
matching uploads archive.

For a failed CMS snapshot import, retain the importer-created `pre_import_*`
files, keep editorial access closed, and follow the restore instructions in
`docs/15_strapi_content_media_promotion.md`.

## 12. Operations and ownership handover

DevOps owns:

- Ubuntu patching, SSH, UFW/provider firewall, DNS, Nginx, TLS, and certificates.
- systemd availability, VM resources, disk alerts, and log rotation.
- PostgreSQL availability and encrypted off-host backups.

Sarga/application owners own:

- CMS admin accounts, site-scope roles, content publishing, translations, and
  media lifecycle.
- API token rotation and preview/revalidation secret rotation.
- Ticket provider URLs, forms, notification recipients, and legal copy.
- Release approval, UAT evidence, and rollback decisions.

At minimum monitor:

```bash
systemctl --failed
systemctl status nginx postgresql sarga-cms sarga-gateway sarga-motorsport sarga-horsesport
journalctl -u nginx -u postgresql -u sarga-cms -u sarga-gateway -u sarga-motorsport -u sarga-horsesport
df -h
free -h
sudo certbot certificates
```

The single-VM topology is a deliberate first deployment and remains a
single point of failure. Moving PostgreSQL, media, or frontend services to
managed/high-availability infrastructure requires a separate approved change.
