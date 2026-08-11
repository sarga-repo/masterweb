# Production deployment helpers

The production deployment uses native Ubuntu services: Nginx, Node.js
applications managed by systemd, and PostgreSQL. Local Docker Compose files are
not production definitions.

## First Motorsport + CMS deployment

The commands below assume the repository has been cloned to
`/srv/sarga-website`. Deploy a reviewed commit, not an unreviewed moving branch.

### 1. Install the host runtime

```bash
cd /srv/sarga-website
sudo deploy/production/install_dependencies.sh
sudo deploy/production/initialize_server.sh --fix-repo-ownership
sudo deploy/production/configure_swap.sh
sudo deploy/production/configure_firewall.sh
```

Omit `--fix-repo-ownership` when the checkout is already owned by `sarga`.
Confirm the provider firewall permits the actual SSH port before enabling UFW.

### 2. Create the CMS environment and build CMS

Create `/etc/sarga/cms.env` following
`docs/14_ubuntu_single_vm_production_deployment.md`, including the PostgreSQL
password prompted by `initialize_server.sh`. Keep `SEED_DEMO_CONTENT=false`.

```bash
sudo deploy/production/build_applications.sh --cms
```

### 3. Install Nginx/systemd and start the empty CMS

Install the HTTP virtual hosts and systemd units without starting Motorsport:

```bash
sudo deploy/production/nginx/install-sarga-stack.sh \
  --motorsport-host staging-motorsport.example.com \
  --cms-host staging-cms.example.com
sudo systemctl enable --now sarga-cms
sudo systemctl status sarga-cms --no-pager
```

Without `--start-services`, the installer installs the application units but
does not enable or start them. This prevents an unbuilt Motorsport service from
being activated during the CMS bootstrap.

### 4. Export, transfer, and import the CMS snapshot

Follow `docs/15_strapi_content_media_promotion.md` on the approved source. The
export produces three files sharing one base name:

```text
sarga-cms-TIMESTAMP.tar.gz.enc
sarga-cms-TIMESTAMP.tar.gz.enc.sha256
sarga-cms-TIMESTAMP.tar.gz.enc.git-sha
```

The `.git-sha` file contains the exact source Git commit whose CMS schema
created the snapshot. Before import, the target checkout must be that commit:

```bash
ARCHIVE=/var/backups/sarga/incoming/sarga-cms-TIMESTAMP.tar.gz.enc
SOURCE_SHA="$(cat "${ARCHIVE}.git-sha")"
sudo -u sarga git -C /srv/sarga-website fetch origin
sudo -u sarga git -C /srv/sarga-website checkout --detach "$SOURCE_SHA"
sudo deploy/production/build_applications.sh --cms
sudo deploy/production/import_cms_snapshot.sh --archive "$ARCHIVE"
```

The second CMS build is necessary only when checkout changed to another commit.
The importer refuses a checksum, Git SHA, Strapi version, database, or service
mismatch and takes paired database/uploads rollback backups before replacement.

Do not treat full import as a routine merge. It clears target CMS content and
uploads before importing the snapshot. Use it for initial staging bootstrap or
an explicitly approved staging refresh while editorial writes are frozen.

### 5. Create staging access and build Motorsport

Admin users and API tokens are environment-specific and are not in the export.
After import:

1. Open the staging CMS admin and create/verify the Super Admin and Motorsport
   editor.
2. Create a least-privilege staging API token.
3. Create `/etc/sarga/motorsport.env` with the final staging public URLs and
   token.
4. Build Motorsport and start all configured services:

```bash
sudo deploy/production/build_applications.sh --motorsport
sudo deploy/production/nginx/install-sarga-stack.sh \
  --motorsport-host staging-motorsport.example.com \
  --cms-host staging-cms.example.com \
  --start-services
```

For later application-only releases, build and restart a selected existing
service only after fetching/checking out the reviewed revision:

```bash
sudo deploy/production/build_applications.sh --motorsport --restart
```

### 6. Add client-managed TLS later

Re-run `install-sarga-stack.sh` with `--tls` and the supplied certificate/key
paths, following `deploy/production/nginx/README.md`.

## Responsibilities that remain manual

- selecting and checking out the approved Git commit;
- creating and storing application/database secrets;
- reviewing source CMS data, freezing edits, and transferring the encrypted
  archive/passphrase through separate approved channels;
- creating environment-specific Strapi admin users and API tokens;
- configuring provider firewall rules, DNS, and client-owned certificates;
- completing content/media/frontend smoke tests and accepting the release.

Each helper is deliberately scoped. None creates application secrets, imports
data without confirmation, changes provider firewall rules, or manages
certificates.
