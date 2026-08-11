# Strapi Content and Media Promotion

This runbook copies the shared Sarga CMS content and Media Library from one
environment to another without re-entering records or re-uploading files. It
applies to all three websites because Gateway, Motorsport, and Horse Sport use
one Strapi instance.

Use the native Strapi transfer archive for an exact point-in-time copy. The
archive contains content entities, relations, configuration, schemas, Media
Library records, and the uploaded asset binaries. It does **not** migrate
Strapi admin users or API tokens.

## 1. Choose the correct workflow

| Workflow                          | Use for                                                                               | Result                                                                                      |
| --------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `SEED_DEMO_CONTENT=true`          | Disposable local development only                                                     | Idempotently creates the repository demo baseline and seed media when collections are empty |
| `strapi export` / `strapi import` | Initial staging bootstrap, approved staging refresh, and initial production promotion | Replaces the target CMS content and uploads with the exact source snapshot                  |
| PostgreSQL plus uploads backup    | Rollback and disaster recovery                                                        | Restores a target environment to its own pre-import state                                   |

Do not use the demo seed in staging or production. Do not use a transfer import
as a routine merge: Strapi clears the target data and uploads before importing.
After production starts receiving editor changes or form submissions,
production is authoritative and must not be overwritten from a developer
laptop.

## 2. Preconditions

Before creating or importing a snapshot:

1. Freeze editorial writes in the source environment.
2. Deploy the same reviewed CMS commit to source and target. Content-type
   schemas must match exactly, and both environments must use Strapi 5.49.0.
3. Keep `SEED_DEMO_CONTENT=false` on staging and production.
4. Confirm the target uses its own PostgreSQL database and uploads directory.
   Never share a media volume or object-storage bucket between environments.
5. Review and remove test inquiry/newsletter submissions or other personal
   data that must not leave the source environment. Strapi 5.49 exports the
   complete dataset; this project does not rely on a partial collection export.
6. Record the source Git SHA, content freeze time, operator, destination, and
   approved change ticket.

## 3. Create the exact snapshot

Run this from the repository root on the source machine. Stop the source CMS
or otherwise prevent writes for the duration so the database and assets are a
consistent point-in-time set. PostgreSQL may remain running.

```bash
cd /path/to/sarga-website
mkdir -p output/cms-transfers
chmod 700 output/cms-transfers

git rev-parse HEAD
git status --short cms/src cms/config cms/package.json cms/pnpm-lock.yaml

SNAPSHOT="sarga-cms-$(date -u +%Y%m%dT%H%M%SZ)"
openssl rand -base64 48
# Store that one-time passphrase in the approved secret manager, then enter it
# at Strapi's prompt. Do not paste it into shell history.

cd cms
pnpm data:export --file "../output/cms-transfers/${SNAPSHOT}"
cd ..

ARCHIVE="$(find output/cms-transfers -maxdepth 1 -type f \
  -name "${SNAPSHOT}.tar.gz.enc" -print -quit)"
test -n "$ARCHIVE"
openssl dgst -sha256 "$ARCHIVE" | awk '{print $NF}' > "${ARCHIVE}.sha256"
git rev-parse HEAD > "${ARCHIVE}.git-sha"
stat "$ARCHIVE"
```

The default encrypted, compressed `.tar.gz.enc` format is required for Sarga
promotion artifacts. Use a newly generated strong passphrase for every
snapshot, store it in the approved secret manager, and send it separately from
the archive. Never commit an export, checksum sidecar, or passphrase.

The `.git-sha` sidecar is not a separate credential. It is the 40-character Git
commit identifier produced by `git rev-parse HEAD` on the source checkout. It
proves which exact CMS schemas and code created the archive. Before import, the
target must check out that same commit and rebuild CMS; the guarded importer
rejects a different target SHA rather than importing data into mismatched
schemas.

For local Docker development, keep the PostgreSQL service running while the
host Strapi CLI exports through port 5435. If Strapi itself is containerized,
run the same `pnpm data:export` command inside a one-off CMS container with the
database and uploads volumes mounted.

### Export from the staging VM

When staging is the approved source for production, load its systemd
environment explicitly because `/etc/sarga/cms.env` is intentionally outside
the repository:

```bash
SNAPSHOT="sarga-cms-staging-$(date -u +%Y%m%dT%H%M%SZ)"
sudo install -d -o sarga -g sarga -m 700 /var/backups/sarga/outgoing
openssl rand -base64 48
# Store the value separately and enter it at Strapi's prompt.

sudo systemctl stop sarga-cms
trap 'sudo systemctl start sarga-cms' EXIT
cd /srv/sarga-website
set -a; source /etc/sarga/cms.env; set +a
sudo -u sarga --preserve-env pnpm --dir /srv/sarga-website/cms \
  data:export --file "/var/backups/sarga/outgoing/${SNAPSHOT}"
sudo systemctl start sarga-cms
trap - EXIT

ARCHIVE="/var/backups/sarga/outgoing/${SNAPSHOT}.tar.gz.enc"
test -s "$ARCHIVE"
openssl dgst -sha256 "$ARCHIVE" | awk '{print $NF}' | sudo tee \
  "${ARCHIVE}.sha256" >/dev/null
git rev-parse HEAD | sudo tee "${ARCHIVE}.git-sha" >/dev/null
sudo chown sarga:sarga "$ARCHIVE" "${ARCHIVE}.sha256" \
  "${ARCHIVE}.git-sha"
sudo chmod 600 "$ARCHIVE" "${ARCHIVE}.sha256" "${ARCHIVE}.git-sha"
```

If export fails, restart `sarga-cms`, keep the content freeze in place, and
investigate before producing another release artifact.

## 4. Transfer the artifact

Copy the archive, checksum, and Git SHA over SSH or the approved encrypted
artifact channel. Example from the source workstation:

```bash
scp "$ARCHIVE" "${ARCHIVE}.sha256" "${ARCHIVE}.git-sha" \
  deploy@staging.example.com:/tmp/
```

On the target VM, move the exact three files into a restricted directory:

```bash
export SNAPSHOT_FILE=sarga-cms-YYYYMMDDTHHMMSSZ.tar.gz.enc
sudo install -d -o sarga -g sarga -m 700 /var/backups/sarga/incoming
sudo install -o sarga -g sarga -m 600 \
  "/tmp/${SNAPSHOT_FILE}" "/tmp/${SNAPSHOT_FILE}.sha256" \
  "/tmp/${SNAPSHOT_FILE}.git-sha" \
  /var/backups/sarga/incoming/
```

Do not send the passphrase through the same channel as the archive.

## 5. Import into staging

The import is destructive. Take a paired target backup even when staging is
expected to be disposable.

The repository provides a guarded wrapper for the target-side commands below.
It verifies the archive checksum, exact Git SHA, Strapi version, PostgreSQL and
CMS service state, creates paired rollback backups, and then runs the same
interactive Strapi import without `--force`:

```bash
sudo deploy/production/import_cms_snapshot.sh \
  --archive /var/backups/sarga/incoming/sarga-cms-YYYYMMDDTHHMMSSZ.tar.gz.enc
```

The archive, `.sha256`, and `.git-sha` files must share the same base path. The
operator must still type the target database name and enter the separately
stored archive passphrase. The explicit commands remain documented below for
audit, troubleshooting, and manual operation.

```bash
export ARCHIVE=/var/backups/sarga/incoming/sarga-cms-YYYYMMDDTHHMMSSZ.tar.gz.enc

cd /srv/sarga-website
test "$(git rev-parse HEAD)" = "$(cat "${ARCHIVE}.git-sha")"
cd cms
pnpm exec strapi version
cd ..

test "$(openssl dgst -sha256 "$ARCHIVE" | awk '{print $NF}')" = \
  "$(cat "${ARCHIVE}.sha256")"

sudo systemctl stop sarga-cms
BACKUP_ID="$(date -u +%Y%m%dT%H%M%SZ)"
sudo -u postgres pg_dump --format=custom sarga_strapi | sudo tee \
  "/var/backups/sarga/pre_import_staging_${BACKUP_ID}.dump" >/dev/null
sudo tar -C /srv/sarga-website/cms/public -czf \
  "/var/backups/sarga/pre_import_staging_${BACKUP_ID}_uploads.tar.gz" \
  uploads
sudo chmod 600 "/var/backups/sarga/pre_import_staging_${BACKUP_ID}.dump" \
  "/var/backups/sarga/pre_import_staging_${BACKUP_ID}_uploads.tar.gz"

set -a; source /etc/sarga/cms.env; set +a
sudo -u sarga --preserve-env pnpm --dir /srv/sarga-website/cms \
  data:import --file "$ARCHIVE"
# Enter the separately stored one-time passphrase at Strapi's prompt.

sudo systemctl start sarga-cms
sudo systemctl status sarga-cms --no-pager
sudo journalctl -u sarga-cms --since "10 minutes ago" --no-pager
```

Read the interactive warning and approve only after confirming the target name
and backup paths. Do not add `--force` to a human-operated staging or production
promotion.

On startup, Sarga's bootstrap synchronizes the managed Gateway, Motorsport,
Horse Sport, and Shared Library roles. Because admin users and API tokens are
not in the archive:

1. Verify or recreate the Super Admin and each site-specific admin account.
2. Recreate least-privilege read/form API tokens in the target CMS.
3. Put the new tokens in the target frontend environment files.
4. Restart the three frontends after token changes.

## 6. Promote approved staging content to production

Production promotion uses the same export/checksum/import procedure, but the
source must be the frozen, stakeholder-approved **staging CMS**, not a laptop.
Complete production promotion only during an approved maintenance window:

1. Freeze staging and production editorial writes.
2. Export staging and record its reviewed Git SHA and UAT approval.
3. Take and verify a fresh production PostgreSQL/uploads backup.
4. Stop production Strapi, verify archive checksum and schema commit, and
   import the staging archive.
5. Restart Strapi, recreate/verify environment-specific users and tokens, then
   restart the frontends if token values changed.
6. Run the verification matrix below before reopening editorial access.

This full replacement is suitable for the initial launch. After go-live, use
an editorial release process or a separately designed incremental migration;
do not erase production form submissions or newer production content with an
older snapshot.

## 7. Verification and acceptance

Record source and target totals for every collection in Content Manager, then
verify at minimum:

- Gateway, Motorsport, Horse Sport, shared, and hidden scopes have the expected
  record counts and published/draft states.
- All 20 IJTC riders and standings, programme records, pages, news, events,
  tickets, merchandise, gallery items, sponsors, and campaign content match the
  approved source snapshot.
- Media Library folders, image/PDF counts, alt text, relations, and thumbnails
  are present.
- Representative original media URLs return HTTP 200 through the public CMS
  hostname; no frontend page has broken images.
- Each site-admin account sees only its assigned workspace; Super Admin sees
  all workspaces.
- Read-only frontend and create-only form tokens work with least privilege.
- All three frontends pass their route, media, form, ticket, sitemap, and robots
  smoke tests.

Useful checks:

```bash
curl -fsS https://cms.sarga.example.com/admin >/dev/null
find /srv/sarga-website/cms/public/uploads -type f | wc -l
curl -fsS https://sarga.example.com/ >/dev/null
curl -fsS https://motorsport.sarga.example.com/ >/dev/null
curl -fsS https://horsesport.sarga.example.com/ >/dev/null
```

Attach the archive checksum, source/target Git SHA, backup paths, collection
counts, media count, operator, timestamps, and UAT result to the release record.

## 8. Rollback

If verification fails, keep editorial access closed and restore the paired
pre-import PostgreSQL dump and uploads archive. Never restore only one half.

```bash
sudo systemctl stop sarga-cms
sudo -u postgres dropdb --if-exists sarga_strapi
sudo -u postgres createdb --owner=sarga_cms sarga_strapi
sudo -u postgres pg_restore --no-owner --role=sarga_cms \
  --dbname=sarga_strapi /var/backups/sarga/pre_import_TARGET_TIMESTAMP.dump

sudo rm -rf /srv/sarga-website/cms/public/uploads
sudo mkdir -p /srv/sarga-website/cms/public/uploads
sudo tar -C /srv/sarga-website/cms/public -xzf \
  /var/backups/sarga/pre_import_TARGET_TIMESTAMP_uploads.tar.gz
sudo chown -R sarga:sarga /srv/sarga-website/cms/public/uploads

sudo systemctl start sarga-cms
sudo journalctl -u sarga-cms --since "10 minutes ago" --no-pager
```

Re-run the verification matrix before reopening the CMS.
