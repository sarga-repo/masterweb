# Repository Context and Deployment Notes

Last reviewed: 2026-08-10

This document preserves practical repository context for future development and
records the initial production-topology discussion. It does not replace the
authoritative deployment runbooks or phase records.

## Current architecture

Sarga is a single-repository multisite platform:

| Service | Application | Local/private port |
| --- | --- | ---: |
| Group gateway | `frontend-gateway/` (Next.js) | 3000 |
| Motorsport | `frontend-motorsport/` (Next.js) | 3001 |
| Horse Sport | `frontend-horsesport/` (Next.js) | 3002 |
| Shared CMS/API | `cms/` (Strapi) | 1337 |
| Shared database | PostgreSQL | 5435 locally; 5432 private in production |

All three public frontends are separate Next.js applications with distinct
brand systems. They consume one shared Strapi instance. Public content is
separated with `siteScope` (`gateway`, `motorsport`, `horsesport`, `shared`, or
`hidden`) and supporting business/visibility fields.

The current Motorsport revamp is substantially implemented and has a documented
technical validation record in
`docs/motorsport/revamp/12_final_validation_launch_readiness.md`. Production
launch is still conditional on final content, credentials, domains,
certificates, form delivery, ticket destinations, CMS-role acceptance, and
staging UAT.

## Development conventions to preserve

- Keep the three frontend applications separated; share only genuinely
  brand-neutral utilities.
- Keep one Strapi CMS and one PostgreSQL data source unless a separate
  architecture is explicitly approved.
- Centralize CMS access in typed data/service modules rather than fetching from
  arbitrary React components.
- Keep secrets in server-only environment variables. Never expose CMS write or
  admin tokens through `NEXT_PUBLIC_*` variables.
- Ticketing is an external partner redirect/deep link. Optional embeds must be
  explicitly configured and allowlisted. There is no internal checkout,
  payment, ticketing engine, or public account system.
- Treat polished local fallback content as a resilience/demo mechanism, not as
  evidence that production CMS integration is correct.
- Run app-specific format, lint, typecheck, test, and production-build gates for
  every touched workspace.
- Update `docs/PHASE_PROGRESS.md` when a defined implementation phase is
  completed.

## Historical audit notes to revalidate

An earlier repository audit identified documentation drift, uneven test
coverage, fallback data masking CMS issues, missing legal routes, and frontend
types that did not always match the Strapi schema. The Motorsport revamp branch
has since changed routes, CMS models, admin workspaces, deployment artifacts,
and validation evidence. Do not assume every earlier finding is still current;
revalidate the touched contract before making a related change.

Areas that always deserve explicit verification before release:

- frontend field names, enums, relations, and filters versus current Strapi
  schemas;
- `siteScope` and cross-site teaser behavior;
- real form persistence with least-privilege tokens;
- ticket URL safety and approved production destinations;
- sitemap, canonical, redirect, and true error behavior;
- CMS content plus Media Library parity between environments;
- production backup and restore evidence.

## Production topology options

### Option A - One VM, Nginx reverse proxy (recommended initial baseline)

Run Nginx, the three Next.js services, Strapi, and PostgreSQL on one VM. Bind
application/database listeners to loopback and expose only SSH, HTTP, and HTTPS.
Nginx selects the upstream by hostname:

```text
sarga.co                  -> 127.0.0.1:3000
motorsport.sarga.co       -> 127.0.0.1:3001
horsesport.sarga.co       -> 127.0.0.1:3002
cms.sarga.co              -> 127.0.0.1:1337
PostgreSQL                -> 127.0.0.1:5432 (never public)
```

This is the repository's approved initial baseline in
`docs/14_ubuntu_single_vm_production_deployment.md`. Copy-ready systemd and
Nginx examples are in `deploy/production/`.

Benefits:

- lowest infrastructure and operational cost;
- simple private service communication and TLS routing;
- one deployment host, backup schedule, firewall, and monitoring target;
- appropriate for an initial marketing/editorial platform with moderate
  traffic.

Tradeoffs:

- the VM is a single point of failure;
- frontend, CMS, database, builds, and media compete for CPU, memory, and disk;
- maintenance or disk exhaustion can affect every site;
- per-site scaling and release isolation are limited.

Use at least the documented 4 vCPU / 8 GB RAM / 80 GB SSD baseline. Prefer
8 vCPU / 16 GB RAM when builds happen on the server, editors upload substantial
media, or traffic expectations are uncertain. Build services sequentially and
keep off-VM backups regardless of VM size.

### Option B - One frontend VM plus a private CMS/data tier

Run Nginx and the three Next.js applications on one public application VM. Run
Strapi and PostgreSQL on a second private VM, or use managed PostgreSQL and
object storage.

This is the most useful first separation when availability, backup, or resource
contention becomes important. It protects the CMS/data tier better than placing
each lightweight frontend on a separate VM.

It adds private networking, another firewall and patching target, coordinated
backups, and more deployment complexity. Managed services or paid providers
require explicit approval.

### Option C - One VM per frontend

Use separate Gateway, Motorsport, and Horse Sport VMs, with additional CMS and
database infrastructure.

This offers the strongest per-site release and scaling isolation, but it is not
recommended for the initial launch. It multiplies operating-system patching,
TLS/proxy configuration, monitoring, deployment, and cost while all sites still
share the same CMS/data dependency.

Consider it only when one site has materially different traffic or uptime
requirements, teams need independent release ownership, or measured resource
usage proves that horizontal separation is necessary.

## Current recommendation

Start with **Option A: one appropriately sized VM with Nginx and four systemd
application services**, following the existing production runbook. Do not put
each frontend on a separate VM initially.

Prioritize these safeguards:

1. Expose only ports 22, 80, and 443; keep application and database listeners
   on `127.0.0.1`.
2. Use separate root-owned environment files and least-privilege frontend/form
   API tokens.
3. Keep `SEED_DEMO_CONTENT=false` outside disposable local development.
4. Back up PostgreSQL and `cms/public/uploads` together, encrypt the backups,
   store a copy off the VM, and test restoration.
5. Build from a reviewed tag/commit and restart only changed services.
6. Monitor uptime, HTTP 5xx responses, memory, CPU, disk, PostgreSQL, systemd
   restart counts, certificate expiry, and backup freshness.
7. Reassess the topology using measured utilization and business uptime needs,
   not merely the number of domains.

The authoritative operational references are:

- `docs/14_ubuntu_single_vm_production_deployment.md`
- `docs/15_strapi_content_media_promotion.md`
- `docs/motorsport/revamp/08_deployment_handover.md`
- `docs/motorsport/revamp/12_final_validation_launch_readiness.md`
- `deploy/production/systemd/`
- `deploy/production/nginx/sarga-stack.conf`

## Detailed deployment sizing and migration matrix (2026-08-11)

These figures assume all three Next.js applications are built on the server,
moderate launch traffic, one shared Strapi instance, and no managed database.
They are starting allocations, not capacity guarantees; adjust them after
collecting CPU, memory, disk, database, and response-time metrics.

### Scenario 1 - one VM for the complete stack

Recommended launch specification:

| Resource | Recommendation | Notes |
|---|---:|---|
| CPU | 8 vCPU | Provides headroom for sequential Next.js and Strapi builds. |
| Memory | 16 GB RAM | 8 GB is the functional minimum but is tight during builds. |
| Swap | 4-8 GB | Safety buffer only; persistent swap use indicates undersizing. |
| System disk | 120-160 GB NVMe SSD | Use 200 GB or expandable block storage while media remains local. |
| Network | Static IPv4 and private networking capability | Expose only TCP 22, 80, and 443. |
| OS/runtime | Ubuntu 22.04 LTS, Node.js 22, pnpm 10.22, PostgreSQL 16 | Matches the approved production runbook. |

Run Nginx, PostgreSQL, Strapi, and the three Next.js production processes on
the host. Nginx is the only public application endpoint. PostgreSQL, Strapi,
and all Next.js listeners bind to `127.0.0.1`. Build applications one at a time
and restart only the service whose build succeeded.

Approximate steady-state planning allowance (not a hard limit): 1-2 GB for the
OS, Nginx, monitoring, and filesystem cache; 2-4 GB for PostgreSQL and Strapi;
and 2-4 GB total for the three Next.js processes. The remaining capacity is
valuable for builds, image processing, traffic bursts, and cache. Measure the
real processes before applying strict memory limits.

If Strapi uploads remain on local disk, alert at 70% disk usage and keep the
database dump and `cms/public/uploads` backup from the same maintenance window.
Snapshots alone are not a backup: retain an encrypted copy outside this VM and
perform restoration tests.

### Scenario 2 - application VM plus CMS/data VM

Recommended launch specification:

| VM | CPU / RAM | Disk | Workload |
|---|---:|---:|---|
| Application VM | 8 vCPU / 16 GB, 4 GB swap | 80-120 GB NVMe SSD | Public Nginx, three Next.js apps, and on-server builds. |
| CMS/data VM | 4 vCPU / 8 GB, 4 GB swap | 150-200 GB NVMe SSD or expandable storage | Private Strapi and PostgreSQL; local uploads until object storage is approved. |

Increase the CMS/data VM to 8 vCPU / 16 GB if it also performs frequent Strapi
builds, large image transformations, imports, or serves many simultaneous
editors. If uploads move to object storage, the CMS disk can be smaller, but
database backups and free-space monitoring remain mandatory.

Keep `cms.sarga.co` terminating TLS at the application VM. Nginx proxies that
hostname to Strapi on the CMS/data VM's private address and preserves `Host`,
`X-Forwarded-For`, and `X-Forwarded-Proto`. Frontend server-side requests can
use the same private Strapi address. Browser-visible URLs must continue to use
`https://cms.sarga.co`; never expose private addresses in `NEXT_PUBLIC_*`
variables.

Firewall model:

- Application VM: public TCP 80/443; SSH restricted to administrator source
  addresses; frontend listeners remain loopback-only.
- CMS/data VM: no general public ingress; Strapi TCP 1337 accepts only the
  application VM's private IP; SSH is restricted to administrators or a
  bastion/VPN; PostgreSQL remains on loopback because Strapi and PostgreSQL are
  colocated.
- Use provider firewall/security-group rules as well as host firewall rules.

The CMS/data VM becomes the primary backup unit. Back up PostgreSQL and local
uploads together to off-VM storage. Back up application configuration and
deployment metadata separately; frontend build artifacts can be recreated
from the reviewed Git revision.

### Difficulty of moving from scenario 1 to scenario 2

Expected difficulty is **moderate-low (about 4/10)** because Strapi and
PostgreSQL move together, PostgreSQL does not need to be opened over the
network, and the public hostnames can stay unchanged. Budget approximately one
to two engineer-days for provisioning, rehearsal, validation, documentation,
and rollback preparation. A rehearsed production cutover should normally fit
within a one-to-three-hour maintenance window, depending mainly on upload and
database size.

Migration sequence:

1. Provision the CMS/data VM on the same private network and install the pinned
   runtime versions.
2. Restore a recent PostgreSQL dump and a matching copy of
   `cms/public/uploads`; copy Strapi environment configuration securely.
3. Start Strapi on the private interface and permit TCP 1337 only from the
   application VM.
4. Test the private Strapi health/API path, admin login, media delivery,
   frontend reads, and form submissions before cutover.
5. Begin a short editorial/content freeze, stop the original Strapi service,
   and take the final synchronized database and upload backup.
6. Restore the final data, update the application VM's Nginx Strapi upstream
   and server-only `STRAPI_API_URL`, then reload Nginx.
7. Keep `PUBLIC_URL` and browser-facing Strapi URLs on
   `https://cms.sarga.co`, run production smoke tests, and monitor both VMs.
8. Retain the stopped original services and final backup for the agreed
   rollback period; do not delete them during cutover.

Moving uploads to object storage before this split reduces data-copy time and
consistency risk. It is helpful but not required.

### Native processes versus Docker

Use **native Node.js processes managed by systemd, native PostgreSQL, and
native Nginx for the initial production deployment**. This is the repository's
documented production route and already has service and Nginx artifacts under
`deploy/production/`.

The existing `docker-compose.yml` and `docker/*.Dockerfile` files are for local
development, not production: they set development environments, bind-mount
source directories, and run `pnpm dev` or `pnpm develop`. Do not deploy those
definitions unchanged.

A future production-container deployment is valid if the team wants immutable
artifacts and already operates Docker confidently, but it first needs:

- multi-stage production images that build once and run `next start` or
  `strapi start` as a non-root user;
- immutable images tagged to a reviewed Git revision;
- explicit health checks, restart policy, resource limits, log rotation, and
  image vulnerability/update procedures;
- durable PostgreSQL/upload volumes with documented backup and restoration;
- private container networking and no public PostgreSQL or application ports;
- a deployment workflow that separates image building from production startup.

Docker does not remove the scenario-1-to-scenario-2 data migration. Avoid an
unplanned hybrid where some applications, PostgreSQL, and operational logs are
managed in different ways; use one documented operating model per environment.
