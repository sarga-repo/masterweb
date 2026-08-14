# Ubuntu 22.04 Single-VM Production Deployment

This runbook deploys the Sarga gateway, Sarga Motorsport, Sarga Horse Sport,
the shared Strapi CMS, PostgreSQL, Nginx, and Let's Encrypt on one Ubuntu
22.04.5 LTS virtual machine. It is the approved baseline for staging and the
initial production topology.

## 1. Topology and assumptions

Replace the example hostnames throughout this guide:

| Public service    | Example hostname               | Private listener |
| ----------------- | ------------------------------ | ---------------- |
| Sarga.co gateway  | `sarga.example.com`            | `127.0.0.1:3000` |
| Sarga Motorsport  | `motorsport.sarga.example.com` | `127.0.0.1:3001` |
| Sarga Horse Sport | `horsesport.sarga.example.com` | `127.0.0.1:3002` |
| Shared Strapi CMS | `cms.sarga.example.com`        | `127.0.0.1:1337` |
| PostgreSQL        | no public hostname             | `127.0.0.1:5432` |

Nginx is the only public application entry point. Ports 3000-3002, 1337, and
5432 must not be exposed by the cloud firewall or UFW. Local Docker Compose
remains the developer topology and keeps PostgreSQL on host port 5435; this
production runbook intentionally uses native systemd services and PostgreSQL's
standard private port 5432.

Before starting, provision at least 4 vCPU, 8 GB RAM, 80 GB SSD, a static IP,
and DNS A/AAAA records for all hostnames. Remove an AAAA record if the VM does
not have working public IPv6. Confirm TCP 22, 80, and 443 are allowed. Port 80
must remain reachable for Let's Encrypt HTTP-01 validation and renewal.

## 2. Base operating system

On a fresh Ubuntu host, the repository helper can install the base packages,
Node.js 22, pnpm 10.22.0, PostgreSQL 16, and Nginx used by the sections below:

```bash
sudo deploy/production/install_dependencies.sh
```

The helper does not perform a full OS upgrade, create users/databases/secrets,
change the firewall, add swap, import CMS data, or manage certificates. Keep
those reviewed, environment-specific steps explicit. If using the helper, skip
the duplicate package/runtime installation commands below after verifying its
reported versions.

After dependency installation, the repository provides separate, reviewable
helpers for the predictable host initialization, optional swap, and UFW steps:

```bash
sudo deploy/production/initialize_server.sh
sudo deploy/production/configure_swap.sh
sudo deploy/production/configure_firewall.sh
```

The initializer prompts securely when creating a new PostgreSQL role. The UFW
helper detects the current SSH port when possible and requires typing `ENABLE`
before it changes the firewall. Provider firewall/security-group rules remain
separate and must allow the SSH port before UFW is enabled.

```bash
sudo apt update
sudo apt full-upgrade -y
sudo apt install -y ca-certificates curl git gnupg build-essential python3 make g++ libvips-dev nginx snapd ufw
sudo timedatectl set-timezone Asia/Jakarta

sudo adduser --disabled-password --gecos "" sarga
sudo mkdir -p /srv/sarga-website /etc/sarga /var/backups/sarga
sudo chown -R sarga:sarga /srv/sarga-website
sudo chown root:sarga /etc/sarga
sudo chmod 750 /etc/sarga

sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

Use SSH keys for the operator account. Disable password SSH authentication only
after a second tested session confirms key access. Configure unattended security
updates and VM snapshots according to the infrastructure policy.

## 3. Install Node.js 22 and pnpm 10.22.0

Node must be system-wide so systemd does not depend on an interactive shell or
an NVM profile.

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x -o /tmp/nodesource_setup.sh
sudo -E bash /tmp/nodesource_setup.sh
rm /tmp/nodesource_setup.sh
sudo apt install -y nodejs

sudo corepack enable --install-directory /usr/local/bin
sudo corepack prepare pnpm@10.22.0 --activate
node --version
pnpm --version
```

Review downloaded installer scripts under the organization's supply-chain
policy before executing them. The expected major Node version is 22.

## 4. Install and secure PostgreSQL 16

Ubuntu 22.04's default PostgreSQL version is older than this deployment target,
so use the PostgreSQL Global Development Group repository:

```bash
sudo apt install -y postgresql-common
sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh
sudo apt update
sudo apt install -y postgresql-16 postgresql-client-16
sudo systemctl enable --now postgresql
```

Create the application role without putting its password in shell history:

```bash
sudo -u postgres psql
```

Then run these commands inside `psql`, replacing only the role/database names if
required. `\password` prompts securely.

```sql
CREATE ROLE sarga_cms LOGIN;
\password sarga_cms
CREATE DATABASE sarga_strapi OWNER sarga_cms ENCODING 'UTF8';
\q
```

Keep PostgreSQL private. In `/etc/postgresql/16/main/postgresql.conf`, retain:

```text
listen_addresses = 'localhost'
password_encryption = 'scram-sha-256'
```

In `/etc/postgresql/16/main/pg_hba.conf`, permit the local CMS using SCRAM and
do not add public CIDR ranges:

```text
host    sarga_strapi    sarga_cms    127.0.0.1/32    scram-sha-256
host    sarga_strapi    sarga_cms    ::1/128         scram-sha-256
```

```bash
sudo systemctl restart postgresql
sudo -u postgres pg_isready
```

## 5. Install the repository

```bash
sudo -u sarga git clone <REPOSITORY_SSH_URL> /srv/sarga-website
cd /srv/sarga-website
sudo -u sarga git switch <RELEASE_BRANCH_OR_TAG>

sudo -u sarga pnpm --dir cms install --frozen-lockfile
sudo -u sarga pnpm --dir frontend-gateway install --frozen-lockfile
sudo -u sarga pnpm --dir frontend-motorsport install --frozen-lockfile
sudo -u sarga pnpm --dir frontend-horsesport install --frozen-lockfile
```

Deploy a reviewed tag or commit SHA, not an unreviewed moving branch. Do not
delete `cms/public/uploads`; it is production data and must be included in
backups. A remote object-storage provider may replace local uploads later after
separate approval and migration planning.

Short hero MP4/WebM files are served from the same uploads directory. The
Nginx/Strapi ceiling is 100 MB per upload, not an editorial target: encode each
source to roughly 5-8 MB where practical and always provide a poster. Watch VM
disk usage and egress before enabling video on several slides.

## 6. Configure secrets and runtime environment

Create four files owned by `root:sarga`, mode 640. Values below are examples;
never commit real secrets.

`/etc/sarga/cms.env`:

```dotenv
NODE_ENV=production
HOST=127.0.0.1
PORT=1337
PUBLIC_URL=https://cms.sarga.example.com
PROXY_KOA=true
DATABASE_CLIENT=postgres
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
DATABASE_NAME=sarga_strapi
DATABASE_USERNAME=sarga_cms
DATABASE_PASSWORD=<LONG_RANDOM_DATABASE_PASSWORD>
DATABASE_SSL=false
APP_KEYS=<KEY1>,<KEY2>,<KEY3>,<KEY4>
API_TOKEN_SALT=<LONG_RANDOM_VALUE>
ADMIN_JWT_SECRET=<LONG_RANDOM_VALUE>
TRANSFER_TOKEN_SALT=<LONG_RANDOM_VALUE>
JWT_SECRET=<LONG_RANDOM_VALUE>
ENCRYPTION_KEY=<LONG_RANDOM_VALUE>
SEED_DEMO_CONTENT=false
MAIL_ENABLED=false
MAIL_AUTH_MODE=oauth
MAIL_SMTP_HOST=smtp.office365.com
MAIL_SMTP_PORT=587
MAIL_SMTP_REQUIRE_TLS=true
MAIL_SMTP_USER=noreply@sargamotorsport.co
MAIL_FROM_ADDRESS=noreply@sargamotorsport.co
MAIL_FROM_NAME="Sarga Motorsport"
MAIL_DEFAULT_REPLY_TO=noreply@sargamotorsport.co
MICROSOFT_TENANT_ID=<MICROSOFT_TENANT_GUID>
MICROSOFT_CLIENT_ID=<ENTRA_APPLICATION_GUID>
MICROSOFT_CLIENT_SECRET=<SECRET_STORE_VALUE>
MICROSOFT_SMTP_SCOPE=https://outlook.office365.com/.default
# Emergency existing-tenant fallback only; leave blank for OAuth.
MAIL_SMTP_PASSWORD=
MAIL_BASIC_AUTH_ACKNOWLEDGED=
MAIL_BASIC_AUTH_EXPIRES_AT=
MAIL_NOTIFICATIONS_ENABLED=false
MAIL_RECIPIENT_GATEWAY=<APPROVED_INTERNAL_RECIPIENTS>
MAIL_RECIPIENT_MOTORSPORT=<APPROVED_INTERNAL_RECIPIENTS>
MAIL_RECIPIENT_HORSESPORT=<APPROVED_INTERNAL_RECIPIENTS>
MAIL_MAX_ATTEMPTS=5
MAIL_WORKER_BATCH_SIZE=10
MAIL_WORKER_CRON="*/1 * * * *"
```

The GWR-CMS-MAIL-2 Exchange Online OAuth transport is implemented but remains
disabled until its Microsoft 365 prerequisites and credentialed staging check
pass. OAuth is the target; follow
`docs/strapi-admin-menu/12_gwr_cms_mail_2_oauth_transport_spec.md`. For the
approved 2026-08-14 launch contingency, an eligible existing tenant may instead
use the explicitly selected, expiring configuration in
`docs/strapi-admin-menu/15_gwr_cms_mail_4_1_temporary_basic_auth_fallback.md`.
Keep this file `root:sarga` mode 640. Never commit or echo either the client
secret or mailbox password. Both modes require STARTTLS on port 587 and an
approved sender; OAuth additionally uses mailbox-scoped Exchange RBAC.

Generate independent secrets, for example with `openssl rand -base64 48`. Do
not reuse keys between staging and production.

`/etc/sarga/gateway.env`:

```dotenv
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://sarga.example.com
NEXT_PUBLIC_GATEWAY_SITE_URL=https://sarga.example.com
NEXT_PUBLIC_MOTORSPORT_SITE_URL=https://motorsport.sarga.example.com
NEXT_PUBLIC_HORSESPORT_SITE_URL=https://horsesport.sarga.example.com
NEXT_PUBLIC_STRAPI_API_URL=https://cms.sarga.example.com
STRAPI_API_URL=http://127.0.0.1:1337
STRAPI_API_TOKEN=<READ_ONLY_FRONTEND_TOKEN>
```

`/etc/sarga/motorsport.env`:

```dotenv
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://motorsport.sarga.example.com
NEXT_PUBLIC_SITE_KEY=sarga-motorsport
NEXT_PUBLIC_GATEWAY_SITE_URL=https://sarga.example.com
NEXT_PUBLIC_MOTORSPORT_SITE_URL=https://motorsport.sarga.example.com
NEXT_PUBLIC_HORSESPORT_SITE_URL=https://horsesport.sarga.example.com
NEXT_PUBLIC_STRAPI_API_URL=https://cms.sarga.example.com
STRAPI_API_URL=http://127.0.0.1:1337
STRAPI_API_TOKEN=<READ_ONLY_FRONTEND_TOKEN>
FORM_SUBMISSION_MODE=strapi
FORM_SUBMISSION_API_TOKEN=<CREATE_ONLY_FORM_TOKEN>
TICKETING_DEEP_LINK_SCHEMES=
TICKETING_EMBED_ALLOWLIST=
```

`/etc/sarga/horsesport.env`:

```dotenv
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://horsesport.sarga.example.com
NEXT_PUBLIC_GATEWAY_SITE_URL=https://sarga.example.com
NEXT_PUBLIC_MOTORSPORT_SITE_URL=https://motorsport.sarga.example.com
NEXT_PUBLIC_HORSESPORT_SITE_URL=https://horsesport.sarga.example.com
NEXT_PUBLIC_STRAPI_API_URL=https://cms.sarga.example.com
STRAPI_API_URL=http://127.0.0.1:1337
STRAPI_API_TOKEN=<READ_ONLY_FRONTEND_TOKEN>
```

Confirm exact variables against each frontend's `.env.example` before every
release. `NEXT_PUBLIC_*` values are embedded during build; rebuilding is
required when they change. CMS tokens remain server-only. If form collections
use different create tokens, add the variables documented by that frontend.

```bash
sudo chown root:sarga /etc/sarga/*.env
sudo chmod 640 /etc/sarga/*.env
```

### Exchange Online preflight and no-send verification

The VM must have outbound TCP access to Microsoft identity on 443 and Exchange
Online SMTP on 587. UFW's default outbound policy normally permits this; confirm
the cloud firewall/security group does as well. Test TLS negotiation without
credentials:

```bash
openssl s_client -starttls smtp -connect smtp.office365.com:587 \
  -servername smtp.office365.com -tls1_2 </dev/null
```

After Sarga IT has installed the dedicated Entra application credential and
mailbox-scoped `Application SMTP.SendAsApp` authorization, enable OAuth mail on
**staging first**, restart Strapi, and run the no-send verifier. Run it through
a transient systemd unit so `/etc/sarga/cms.env` is not sourced by the operator
shell:

```bash
sudo systemd-run --wait --pipe --collect --uid=sarga \
  --property=WorkingDirectory=/srv/sarga-website \
  --property=EnvironmentFile=/etc/sarga/cms.env \
  /usr/bin/pnpm --dir cms mail:verify
```

Confirm the pnpm executable with `command -v pnpm` and substitute its absolute
path if it is not `/usr/bin/pnpm`. The verifier authenticates using the selected
mode, negotiates SMTP, then closes the connection without submitting a message.
Do not echo `/etc/sarga/cms.env` or enable shell tracing. If verification fails,
set `MAIL_ENABLED=false`, restart `sarga-cms`, and keep public notification
wiring disabled. Credentialed delivery and domain-alignment UAT are deferred to
GWR-CMS-MAIL-4.

### Urgent existing-tenant Basic SMTP contingency

Use this only if Sarga IT confirms that Authenticated SMTP and Basic SMTP are
still permitted for `noreply@sargamotorsport.co`. In `/etc/sarga/cms.env`, keep
the endpoint/TLS/sender values above and replace the authentication block with:

```dotenv
MAIL_AUTH_MODE=basic
MAIL_SMTP_PASSWORD=<RUNTIME_SECRET_ONLY>
MAIL_BASIC_AUTH_ACKNOWLEDGED=I_ACCEPT_TEMPORARY_BASIC_AUTH_RISK
MAIL_BASIC_AUTH_EXPIRES_AT=<EARLIEST_PRACTICAL_ISO_8601_EXPIRY>

# Not used in Basic mode; remove values if previously present.
MICROSOFT_TENANT_ID=
MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
```

The expiry must be future-dated and no later than
`2026-12-15T23:59:59.999Z`. The CMS fails closed when the acknowledgement,
password, or expiry is missing/invalid and the inquiry worker refuses delivery
after expiry. Leave `MAIL_NOTIFICATIONS_ENABLED=false`, restart CMS, and run the
same no-send verifier before the controlled staging send. If Microsoft rejects
the login, do not weaken tenant-wide Security Defaults or Conditional Access;
launch with stored inquiries and manual handling while OAuth is completed.

After `mail:verify` passes, follow the controlled-send and six site/locale
workflow matrix in
`docs/strapi-admin-menu/14_gwr_cms_mail_4_staging_uat_handover.md`. Do not set
`MAIL_NOTIFICATIONS_ENABLED=true` in production until every launch gate there
is signed. When enabled, the CMS cron worker records pending/processing/sent/
failed state on each inquiry and retries temporary failures without holding the
public form request open.

## 7. Migrate the exact CMS content and assets

Use
[`docs/15_strapi_content_media_promotion.md`](15_strapi_content_media_promotion.md)
for the authoritative local-to-staging and staging-to-production workflow. The
native encrypted Strapi archive carries content, relations, configuration,
schemas, Media Library records, and uploaded binaries together, so editors do
not need to recreate records or upload assets one by one.

For the initial staging bootstrap:

1. Freeze local CMS writes and export an encrypted snapshot from the reviewed
   CMS commit with `pnpm data:export`.
2. Record the archive SHA-256 and source Git SHA, then transfer the artifact and
   its passphrase through separate secure channels.
3. Verify the target is on the exact same CMS commit and Strapi version.
4. Stop target Strapi and take a paired PostgreSQL/uploads backup.
5. Import with `pnpm data:import`; this replaces existing target content and
   uploads.
6. Restart Strapi, verify collection/media parity, and recreate target-specific
   admin accounts and API tokens because Strapi does not export them.
7. Generate the target `i18n:inventory`, run `i18n:compare` against the frozen
   source inventory, and block promotion on any drift. Generate
   `i18n:completeness`, assign missing/draft Indonesian records to their site
   owners, and preserve fallback `noindex` until each is reviewed/published.

The exact commands and local GWR-CMS-8 rehearsal evidence are in
`docs/strapi-admin-menu/16_gwr_cms_8_migration_uat_handover.md`. Store inventory,
reconciliation, and completeness files in the restricted release-artifact
directory with the archive checksum and Git SHA.

For initial production launch, export the frozen, stakeholder-approved staging
CMS and repeat the same controlled import. Do not promote production directly
from an unapproved developer database. After go-live, production must not be
overwritten by a full laptop/staging snapshot because the import would erase
newer production content and form submissions.

`SEED_DEMO_CONTENT` must remain `false` in staging and production. The startup
seed is for disposable local development only; exact environment parity comes
from the reviewed transfer archive.

### Database restore test

Restore an approved database dump before starting Strapi. Copy the matching
uploads archive at the same time; database records and media files form one
release unit.

```bash
sudo -u postgres createdb --owner=sarga_cms sarga_strapi_restore_test
sudo -u postgres pg_restore --clean --if-exists --no-owner --role=sarga_cms \
  --dbname=sarga_strapi_restore_test /path/to/sarga_strapi.dump
sudo -u postgres dropdb sarga_strapi_restore_test
```

The restore test above is mandatory before using a backup for production.
Restore the real database only inside an approved maintenance window.

Load each environment file while building:

The repository helper can perform the locked installs and selected builds
sequentially while loading each protected environment in isolation:

```bash
sudo deploy/production/build_applications.sh --cms
sudo deploy/production/build_applications.sh --motorsport
```

Use `--all` only when all four environment files and applications are intended
for this host. The explicit equivalent commands remain below for audit and
manual troubleshooting.

```bash
cd /srv/sarga-website
set -a; source /etc/sarga/cms.env; set +a
sudo -u sarga --preserve-env pnpm --dir cms build

set -a; source /etc/sarga/gateway.env; set +a
sudo -u sarga --preserve-env pnpm --dir frontend-gateway build

set -a; source /etc/sarga/motorsport.env; set +a
sudo -u sarga --preserve-env pnpm --dir frontend-motorsport build

set -a; source /etc/sarga/horsesport.env; set +a
sudo -u sarga --preserve-env pnpm --dir frontend-horsesport build
```

## 8. Install and start systemd services

Copy the reviewed examples from `deploy/production/systemd/`:

```bash
sudo cp deploy/production/systemd/*.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now sarga-cms sarga-gateway sarga-motorsport sarga-horsesport
sudo systemctl status sarga-cms sarga-gateway sarga-motorsport sarga-horsesport --no-pager
```

Verify private listeners before configuring Nginx:

```bash
curl -I http://127.0.0.1:3000/
curl -I http://127.0.0.1:3001/
curl -I http://127.0.0.1:3002/
curl -I http://127.0.0.1:1337/admin
sudo ss -lntp
```

Only Nginx, SSH, and the local loopback listeners should be reachable.

## 9. Configure four Nginx server blocks

Use the parameterized installer documented in
`deploy/production/nginx/README.md` when the host initially runs only Sarga
Motorsport and the CMS. Gateway and Horse Sport hostname flags can be added
later without changing installers. It supports an HTTP-only pre-DNS setup and
can be re-run with client-supplied or Cloudflare origin certificate paths. It
does not manage the certificate lifecycle or perform the destructive CMS
content import.

Copy and edit the included HTTP configuration:

```bash
sudo cp deploy/production/nginx/sarga-stack.conf /etc/nginx/sites-available/sarga-stack.conf
sudo editor /etc/nginx/sites-available/sarga-stack.conf
sudo ln -s /etc/nginx/sites-available/sarga-stack.conf /etc/nginx/sites-enabled/sarga-stack.conf
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

The config preserves `Host` and `X-Forwarded-*` headers. Next.js response
buffering is disabled for streaming; the CMS block permits 100 MB media uploads
and a longer upstream timeout. Keep Strapi `PUBLIC_URL` equal to its final HTTPS
origin and `PROXY_KOA=true` so secure admin cookies work behind Nginx.

After enabling hero video, confirm the CMS media response supports byte ranges
and the correct MIME type through the public HTTPS origin:

```bash
curl -I https://cms.example.com/uploads/<hero-file>.webm
curl -sS -H 'Range: bytes=0-1023' -o /dev/null -w '%{http_code}\n' \
  https://cms.example.com/uploads/<hero-file>.webm
```

Expect a valid video `Content-Type`; a range request should return `206` when
supported by the deployed media path. Do not expose ports 1337 or 3000-3002 to
serve media directly.

Before issuing certificates, confirm every hostname returns the expected site
over plain HTTP and no DNS proxy blocks the ACME challenge.

## 10. Issue Let's Encrypt certificates with Certbot

Install Certbot using its maintained snap package:

```bash
sudo apt remove -y certbot python3-certbot-nginx || true
sudo snap install core
sudo snap refresh core
sudo snap install --classic certbot
sudo ln -sf /snap/bin/certbot /usr/local/bin/certbot
certbot --version
```

Issue separate certificates so each service can be renewed or replaced without
coupling all hostnames. Add `www` only when its DNS record exists.

```bash
sudo certbot --nginx --redirect --agree-tos --no-eff-email \
  --email ops@example.com -d sarga.example.com -d www.sarga.example.com
sudo certbot --nginx --redirect --agree-tos --no-eff-email \
  --email ops@example.com -d motorsport.sarga.example.com
sudo certbot --nginx --redirect --agree-tos --no-eff-email \
  --email ops@example.com -d horsesport.sarga.example.com
sudo certbot --nginx --redirect --agree-tos --no-eff-email \
  --email ops@example.com -d cms.sarga.example.com
```

Certbot edits the matching Nginx blocks and enables HTTP-to-HTTPS redirects.
Validate the generated configuration and automated renewal immediately:

```bash
sudo nginx -t
sudo systemctl reload nginx
sudo certbot certificates
sudo certbot renew --dry-run
systemctl list-timers | grep certbot
```

The snap installs an automatic renewal timer. Add a deploy hook only if the
platform does not reload Nginx after renewal:

```bash
sudo mkdir -p /etc/letsencrypt/renewal-hooks/deploy
sudo editor /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh
```

Use this file content and make it executable:

```sh
#!/bin/sh
systemctl reload nginx
```

```bash
sudo chmod 750 /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh
sudo certbot renew --dry-run
```

Consider HSTS only after every hostname and redirect has operated correctly over
HTTPS for a full release cycle. Do not enable `includeSubDomains` until all
current and future subdomains are HTTPS-ready.

## 11. CMS first-run and access segregation

1. Open `https://cms.sarga.example.com/admin` and create the initial Super Admin.
2. Confirm the Gateway, Motorsport, Horse Sport, and Shared Library roles exist.
3. Provision site admins using the documented one-time environment variables or
   create them manually. Remove provisioning credentials after creation.
4. Sign in as every managed role and verify it sees only its workspace/menu and
   can create, edit, publish, and upload only within the assigned `siteScope`.
5. Sign in as Super Admin and verify all workspaces remain visible.
6. Create separate least-privilege API tokens for frontend reads and form writes.
7. Replace demo partner URLs, draft dates, placeholder regulations, contact
   recipients, sponsor logos, and legal copy before launch.

## 12. Backups and restore drills

Back up the database, original uploads, environment files, Nginx, systemd units,
and Let's Encrypt state. Encrypt backup media and store at least one copy outside
the VM.

```bash
BACKUP_DATE="$(date -u +%F)"
sudo -u postgres pg_dump --format=custom sarga_strapi | sudo tee \
  "/var/backups/sarga/sarga_strapi_${BACKUP_DATE}.dump" >/dev/null
sudo tar -C /srv/sarga-website/cms/public -czf \
  "/var/backups/sarga/uploads_${BACKUP_DATE}.tar.gz" uploads
sudo tar -czf "/var/backups/sarga/config_${BACKUP_DATE}.tar.gz" \
  /etc/sarga /etc/nginx/sites-available/sarga-stack.conf \
  /etc/systemd/system/sarga-*.service
sudo chmod 600 "/var/backups/sarga/sarga_strapi_${BACKUP_DATE}.dump" \
  "/var/backups/sarga/uploads_${BACKUP_DATE}.tar.gz" \
  "/var/backups/sarga/config_${BACKUP_DATE}.tar.gz"
```

Keep daily backups for 14 days, weekly backups for 8 weeks, and monthly backups
according to business policy. Test a database and uploads restore quarterly on
an isolated host. A backup is not accepted until the restore test passes.

## 13. Release, rollback, and verification

For each release:

1. Take and verify a pre-deploy database/uploads backup.
2. If the release contains a CMS snapshot promotion, follow
   `docs/15_strapi_content_media_promotion.md`; verify archive checksum, exact
   schema commit, source approval, and the paired rollback backup before import.
3. Fetch the reviewed tag, install with `--frozen-lockfile`, and run all quality
   gates documented in `docs/motorsport/revamp/07_testing_uat.md`.
4. Build CMS and all three frontends with production environments.
5. Restart CMS first, then the frontends, and reload Nginx.
6. Execute the route, redirect, form, ticket, media, role, sitemap, robots, and
   responsive UAT matrices before approving the release.

```bash
sudo systemctl restart sarga-cms
sudo systemctl restart sarga-gateway sarga-motorsport sarga-horsesport
sudo nginx -t && sudo systemctl reload nginx
sudo journalctl -u sarga-cms -u sarga-gateway -u sarga-motorsport -u sarga-horsesport --since '10 minutes ago' --no-pager

curl -fsS https://sarga.example.com/ >/dev/null
curl -fsS https://motorsport.sarga.example.com/ >/dev/null
curl -fsS https://horsesport.sarga.example.com/ >/dev/null
curl -fsS https://cms.sarga.example.com/admin >/dev/null
curl -fsS https://motorsport.sarga.example.com/robots.txt
curl -fsS https://motorsport.sarga.example.com/sitemap.xml >/dev/null
```

To roll back application code, switch to the prior reviewed tag, reinstall with
frozen lockfiles, rebuild all changed services, and restart them. Restore the
database/uploads only when the release included a non-backward-compatible data
migration, using the paired pre-deploy backup. Record the commit, migration,
operator, start/end time, verification result, and rollback decision.

To roll back only the Exchange Online transport, first set
`MAIL_NOTIFICATIONS_ENABLED=false`, then `MAIL_ENABLED=false` in
`/etc/sarga/cms.env`, and restart `sarga-cms`. Rotate a client secret by creating
and installing the replacement first, running staging `mail:verify`, and only
then revoking the old credential. If Basic contingency mode was used, remove
its password/acknowledgement/expiry after OAuth cutover and rotate the mailbox
password. Never log a secret, password, or access token.

### GitHub Actions environment automation

The repository's CI remains on GitHub-hosted runners. Pull request code must
never execute on an application VM. Staging uses a manually approved deployment
from `main` to the current Tencent CVM and the `sarga-staging` runner.
Production uses a separate CVM and `sarga-production` runner; pushing a protected
semantic `v*` tag automatically deploys CMS, Gateway, and Motorsport.

Runner installation, environment protection, tag rules, deployment targets,
branch pinning, backup behavior, and operator commands are documented in
`deploy/production/README.md`. Each VM has one environment-specific root-owned
copy of `deploy_github_revision.sh`. The matching GitHub environment holds a
256-bit authorization required by that wrapper, and the runner has no other
passwordless root command.

The deployment wrapper accepts a full commit SHA only, verifies that it is
contained by `origin/main`, and uses the existing sequential frozen-lockfile
build helper. CMS deployments take a paired PostgreSQL/uploads backup before
checkout. This automation does not perform CMS snapshot promotion, database
restoration, secret changes, firewall changes, or certificate management.

The production workflow must remain offline until the separate production CVM,
domains, runtime environments, data, backup policy, and runner are provisioned.

## 14. Monitoring and operational ownership

At minimum monitor HTTPS uptime, certificate expiry, disk usage, memory, load,
PostgreSQL health, backup freshness, HTTP 5xx rates, and systemd restart counts.

```bash
systemctl --failed
systemctl status nginx postgresql sarga-cms sarga-gateway sarga-motorsport sarga-horsesport
journalctl -u nginx -u postgresql -u sarga-cms -u sarga-gateway -u sarga-motorsport -u sarga-horsesport
df -h
free -h
sudo certbot certificates
```

Assign named owners for infrastructure, CMS publishing, frontend releases,
ticket partners, DNS, certificates, backups, and incident escalation before
production launch. The single VM is an intentional first topology but remains a
single point of failure; moving the database, media storage, or frontends to
managed/high-availability services requires a separately approved migration.
