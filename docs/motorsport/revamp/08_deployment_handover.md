# 08 - Deployment And Handover

## Deployment scope

The revamp affects:

- `frontend-motorsport/`
- `cms/` admin UX and schemas if later phases implement CMS changes
- `docs/`
- `prompts/`
- `checklists/`
- copied source PDFs in `reference/source-pdfs/`

It should not require a second CMS or a new database.

The approved initial staging/production topology is the Ubuntu 22.04.5 LTS
single-VM runbook in
[`docs/14_ubuntu_single_vm_production_deployment.md`](../../14_ubuntu_single_vm_production_deployment.md).
It includes native PostgreSQL, four systemd services, four Nginx server blocks,
and Let's Encrypt/Certbot certificate issuance and renewal validation. The
copy-ready service/proxy examples live in `deploy/production/`.

Exact CMS content and Media Library parity is handled by
[`docs/15_strapi_content_media_promotion.md`](../../15_strapi_content_media_promotion.md).
Use the encrypted Strapi export/import workflow for initial staging and promote
only the frozen, approved staging snapshot to production. The import replaces
the target dataset and uploads, so it requires a content freeze plus a paired
PostgreSQL/uploads backup. Admin users and API tokens are environment-specific
and must be recreated or verified after import.

## Pre-launch checks

- Build passes for Motorsport.
- CMS typecheck passes if CMS changed.
- New route list verified.
- Sitemap/robots verified.
- CMS workspaces verified.
- Each managed site-admin account sees only its assigned workspace and scoped
  records; Super Admin sees all four.
- Ticket links verified.
- Regulation PDF download verified.
- Campaign page metadata verified.
- Mobile and desktop screenshots reviewed.
- Warm/dark surface variants, Owners Wide clipping, and Ticket-last navigation
  verified at the MSR-RD2 viewport matrix and 200% zoom.
- Carousel first-slide fallback, Pause/Play, keyboard, reduced motion,
  responsive crops, and lazy loading verified if MSR-RD3 is included.

## Launch sequence

1. Freeze Motorsport content edits.
2. Back up Strapi database.
3. Deploy CMS schema/admin changes first if applicable.
4. Start Strapi once so managed roles/permissions synchronize.
5. If dedicated users do not exist, provide one site's
   `CMS_<SITE>_ADMIN_EMAIL/PASSWORD` pair through the deployment secret store,
   start Strapi, confirm account creation, then remove the pair. Never commit it.
6. Verify each site role with a non-production account: one workspace menu,
   own-scope list results, forced own scope on create, and denial of cross-site
   records. Verify Super Admin sees all four workspaces.
7. Import the reviewed encrypted CMS snapshot and verify its checksum, source
   Git SHA, collection counts, media files, relations, and published states.
   Keep `SEED_DEMO_CONTENT=false`; do not run the local demo seed.
8. Verify CMS admin workspace nested navigation.
9. Deploy Motorsport frontend.
10. Configure identical `PREVIEW_SECRET` and an independent identical
    `MOTORSPORT_REVALIDATION_SECRET` on Strapi and Motorsport. Configure
    Strapi's `MOTORSPORT_FRONTEND_REVALIDATE_URL` using the server-to-server
    frontend address.
11. Run `pnpm cms:preview:preflight` and `pnpm uat:routes` from the Motorsport
    release before accepting traffic.
12. Smoke test public pages.
13. Enable redirects only after public pages are confirmed.
14. Hand CMS back to editors.

## Rollback sequence

1. Roll back Motorsport frontend deployment.
2. Disable new campaign/program pages if content causes issues.
3. Revert CMS admin plugin changes if they block editorial work.
4. Keep added content models unless a reversible migration has been prepared and approved.

## Editorial handover

Provide editors with:

- Motorsport workspace guide.
- Page ownership map.
- Image size and alt-text rules.
- Ticket CTA rules.
- Regulation PDF upload/versioning rules.
- Campaign page publishing checklist.
- Merchandise no-checkout rule.
- Homepage hero-slide field, title-length, one-CTA, image-crop, alt-text,
  active/order, and three-slide recommendation guidance.
- Their dedicated site role/account and a reminder that managed accounts must
  not receive a second Sarga site role.
- Shared Media Library folder convention; media files themselves are not
  site-scoped in this Community Edition implementation.

## Post-launch monitoring

Monitor:

- 404s and redirect misses.
- Broken image/media requests.
- Hero slide image failures, layout shift, and unusually low interaction or
  immediate-skip patterns.
- Ticket outbound clicks.
- Contact form errors.
- CMS publish errors.
- `[motorsport-revalidation]` failures and unexpected Preview diagnostics.
- Core Web Vitals.
- Search indexing of new event/campaign pages.

Final technical evidence and the remaining stakeholder/content prerequisites
are recorded in
[`12_final_validation_launch_readiness.md`](12_final_validation_launch_readiness.md).
Preview, token rotation, editor controls, and cache invalidation operations are
documented in
[`34_cms_preview_live_operations_handover.md`](34_cms_preview_live_operations_handover.md).
