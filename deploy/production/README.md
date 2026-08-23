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

For the first staging rollout of the dedicated Motorsport Single Types, the
protected `/etc/sarga/cms.env` file can remain unchanged. Run the CMS build
helper with its one-time migration override and restart the service:

```bash
sudo deploy/production/build_applications.sh \
  --cms \
  --motorsport-page-single-types-migrate \
  --restart
```

The override is applied only after the protected CMS environment file is
loaded, so it is available during the CMS restart without editing that file.
After the restart, confirm the logs contain the Motorsport Single Type
migration messages and then use the normal CMS build command for subsequent
deployments.

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

## GitHub Actions and Tencent runners

Three workflows separate validation, staging, and production:

- `.github/workflows/ci.yml` runs all four application quality gates on
  GitHub-hosted Ubuntu runners for pull requests and pushes to `main`. Never run
  pull request code on an application VM.
- `.github/workflows/deploy-staging.yml` is a manual deployment from `main`.
  It uses the protected GitHub `staging` environment and the self-hosted runner
  labelled `sarga-staging`.
- `.github/workflows/deploy-production.yml` automatically deploys all active
  services when a semantic `v*` tag such as `v1.2.3` is pushed. It uses the
  GitHub `production` environment and a separate runner labelled
  `sarga-production`.

The current Tencent CVM at `43.128.72.138` remains staging. The production
workflow is repository-ready but must stay offline until a separate production
CVM, production domains, `/etc/sarga/*.env` files, database, uploads, backups,
and runner are provisioned.

Each application VM has one repository-scoped runner service. The non-login
`github-runner` account cannot read `/etc/sarga`. Its only passwordless root
command is the environment-specific `/usr/local/sbin/sarga-deploy-*` wrapper,
and that command also requires a 256-bit authorization held only by the matching
GitHub environment.

### Configure GitHub environments and release protection

Create these environments under **Settings → Environments**:

#### `staging`

1. Add at least one required reviewer who is not the workflow author.
2. Restrict deployment branches to `main`.
3. After staging runner installation, add its generated authorization as the
   environment secret `SARGA_STAGING_DEPLOY_AUTHORIZATION`.

#### `production`

1. Do not add a required reviewer; production is intentionally automatic after
   an authorized tag push.
2. Restrict deployment tags to `v*`.
3. Add environment variables `SARGA_GATEWAY_URL`, `SARGA_MOTORSPORT_URL`, and
   `SARGA_CMS_URL`. Each value must be an HTTPS origin without a path.
4. After production runner installation, add its generated authorization as the
   environment secret `SARGA_PRODUCTION_DEPLOY_AUTHORIZATION`.

Create a GitHub tag ruleset for `v*`. Only release maintainers may create or
delete matching tags. Require changes to reach `main` through the repository's
review and CI rules before a release tag is created. Do not create a production
tag while the production runner is offline because the workflow will remain
queued.

Application secrets remain only in the root-owned `/etc/sarga/*.env` files on
each CVM. The two GitHub environment secrets authorize deployment but do not
contain CMS, database, mail, or frontend credentials.

### Bootstrap an environment runner

Merge the runner files into `main`, then manually place the target VM checkout
on that reviewed commit using the existing deployment procedure. In GitHub,
open **Settings → Actions → Runners → New self-hosted runner** and generate a
repository registration token. It is short-lived and single-purpose; do not
commit it, paste it into chat, or save it in shell history.

Install staging on the current Tencent CVM:

```bash
ssh ubuntu@43.128.72.138
cd /srv/sarga-website
sudo deploy/production/install_github_runner.sh \
  --environment staging \
  --release-branch main
```

Enter the registration token only at the hidden prompt, then put this value in
the GitHub `staging` environment secret
`SARGA_STAGING_DEPLOY_AUTHORIZATION`:

```bash
sudo cat /etc/sarga/github-runner-staging-deploy-token
```

On the future, separately provisioned production CVM:

```bash
cd /srv/sarga-website
sudo deploy/production/install_github_runner.sh \
  --environment production \
  --release-branch main
```

Put this value in the GitHub `production` environment secret
`SARGA_PRODUCTION_DEPLOY_AUTHORIZATION`:

```bash
sudo cat /etc/sarga/github-runner-production-deploy-token
```

The installer:

- creates the non-login `github-runner` service account;
- downloads GitHub Actions Runner `2.336.0` and verifies its published SHA-256;
- registers `sarga-staging` or `sarga-production` plus `tencent-cvm`;
- installs and starts the runner as a systemd service;
- installs an environment-specific root-owned deployment wrapper, sudo rule,
  release-branch policy, and deployment authorization;
- refuses to configure both environments on one VM.

Verify the environment runner is **Idle** in GitHub and on its host:

```bash
cd /opt/actions-runner
sudo ./svc.sh status
sudo -u github-runner sudo -n \
  /usr/local/sbin/sarga-deploy-staging --help
```

Use `sarga-deploy-production` in the final command on the production VM.
Re-running the installer for the same environment refreshes the root-owned
deployment policy and command without requiring another registration token.

### Run staging manually

Open **Actions → Deploy staging → Run workflow**, select `main`, choose one
target, type `DEPLOY-STAGING`, and submit. The workflow refuses every ref except
`main` and deploys its exact commit SHA.

| Target | Build and restart |
| --- | --- |
| `cms` | `sarga-cms` |
| `gateway` | `sarga-gateway` |
| `motorsport` | `sarga-motorsport` |
| `all-active` | CMS, Gateway, then Motorsport |

### Release production automatically

After the reviewed release commit is on `main`, create and push an annotated
semantic tag:

```bash
git switch main
git pull --ff-only
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

The production workflow validates the semantic tag, deploys the tagged commit
to the `sarga-production` runner, builds and restarts CMS, Gateway, and
Motorsport sequentially, then verifies the three configured public HTTPS
origins. The host-side branch policy additionally rejects a tagged commit that
is not contained by `origin/main`.

### Deployment guarantees and recovery

The privileged deployment command serializes releases per environment, rejects
commits outside `origin/main`, refuses source changes outside
`cms/public/uploads`, installs from frozen lockfiles, and restarts only after
every selected build succeeds. A CMS deployment first writes paired PostgreSQL
and uploads backups under
`/var/backups/sarga/deployments/<environment>/`. It preserves ignored runtime
uploads and never imports or replaces CMS content.

If a build fails before restart, the command restores the previous Git revision
and attempts to rebuild its artifacts without restarting services. A service or
smoke-test failure after restart requires operator review; use the printed
backup path and the rollback procedure in
`docs/14_ubuntu_single_vm_production_deployment.md` rather than automatically
restoring data.

Successful deployment state is recorded under
`/var/lib/sarga-deploy/<environment>/`. Every attempt appends a non-secret
environment-tagged result line to `/var/log/sarga-deployments.log`.
