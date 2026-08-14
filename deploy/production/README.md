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

## GitHub Actions and the Tencent staging runner

Two workflows separate untrusted validation from privileged deployment:

- `.github/workflows/ci.yml` runs all four application quality gates on
  GitHub-hosted Ubuntu runners for pull requests and pushes. Never move pull
  request jobs onto the application VM.
- `.github/workflows/deploy-staging.yml` is manual, uses the protected GitHub
  `staging` environment, and targets only the repository-scoped self-hosted
  runner labelled `sarga-staging`.

The current Tencent CVM is the application host as well as the selected runner
host. This avoids another VM, but repository workflow code executes beside the
live services. Keep the repository private, require designated reviewers on the
`staging` environment, restrict that environment to the release branch, and
retain branch protection. The runner has no direct access to `/etc/sarga`; its
only passwordless root command is the fixed
`/usr/local/sbin/sarga-deploy-staging` wrapper, which also requires a
256-bit authorization held only by the protected `staging` environment.

### Configure the GitHub environment

In GitHub, open **Settings → Environments → New environment** and create
`staging`:

1. Add at least one required reviewer who is not the workflow author.
2. Restrict deployment branches to `feature/sarga-major-revamp` while that is
   the staging release branch. Change both GitHub and the runner configuration
   to `main` after the reviewed merge/cutover.
3. Do not add application secrets. Production builds read the existing
   root-owned `/etc/sarga/*.env` files on the CVM. After runner installation,
   add only the generated deployment authorization as the environment secret
   `SARGA_DEPLOY_AUTHORIZATION`.

### Bootstrap the runner

Merge these runner files into the release branch, then manually place the
application checkout on that reviewed commit using the existing deployment
procedure. In GitHub, open **Settings → Actions → Runners → New self-hosted
runner** and generate a repository registration token. The token is short-lived
and single-purpose; do not commit it, paste it into chat, or save it in shell
history.

On the Tencent CVM:

```bash
ssh ubuntu@43.128.72.138
cd /srv/sarga-website
sudo deploy/production/install_github_runner.sh \
  --release-branch feature/sarga-major-revamp
```

Enter the registration token only at the hidden prompt. The installer:

- creates the non-login `github-runner` service account;
- downloads GitHub Actions Runner `2.336.0` and verifies its published SHA-256;
- registers labels `sarga-staging` and `tencent-cvm`;
- installs and starts the runner as a systemd service;
- installs a root-owned deployment wrapper, a narrowly scoped sudo rule, and a
  root-only 256-bit deployment authorization;
- pins deployment eligibility to commits contained by the configured origin
  release branch.

Copy the generated authorization directly into the GitHub `staging`
environment secret named `SARGA_DEPLOY_AUTHORIZATION`:

```bash
sudo cat /etc/sarga/github-runner-deploy-token
```

Treat this as infrastructure authorization: do not commit it or configure it as
a repository-wide secret. A workflow without access to the protected
environment cannot invoke the privileged deployment command successfully.

Verify the runner is **Idle** in GitHub and on the host:

```bash
cd /opt/actions-runner
sudo ./svc.sh status
sudo -u github-runner sudo -n \
  /usr/local/sbin/sarga-deploy-staging --help
```

Re-running the installer after registration refreshes the root-owned deployment
wrapper and release-branch policy without requiring another token. For example,
after the release branch moves to `main`:

```bash
sudo deploy/production/install_github_runner.sh --release-branch main
```

### Run a staging deployment

Open **Actions → Deploy staging → Run workflow**, choose the reviewed release
branch and one target, type `DEPLOY-STAGING`, then submit. The workflow deploys
the exact workflow commit SHA; it does not deploy an unreviewed moving branch.

Supported targets:

| Target | Build and restart |
| --- | --- |
| `cms` | `sarga-cms` |
| `gateway` | `sarga-gateway` |
| `motorsport` | `sarga-motorsport` |
| `all-active` | CMS, Gateway, then Motorsport |

The privileged deployment command serializes releases with a host lock,
rejects commits outside the configured release branch, refuses source changes
outside `cms/public/uploads`, installs from frozen lockfiles, and restarts only
after every selected build succeeds. A CMS deployment first writes paired
PostgreSQL and uploads backups under `/var/backups/sarga/deployments/`. It
preserves ignored runtime uploads and never imports or replaces CMS content.

If a build fails before restart, the command restores the previous Git revision
and attempts to rebuild its artifacts without restarting services. A service or
smoke-test failure after restart requires operator review; use the printed
backup path and the rollback procedure in
`docs/14_ubuntu_single_vm_production_deployment.md` rather than automatically
restoring data.

Successful deployment state is recorded under `/var/lib/sarga-deploy/`, and
every attempt appends a non-secret result line to
`/var/log/sarga-deployments.log`. The workflow verifies the selected loopback
services and their public HTTPS staging routes before succeeding.
