# 02 — GWR-CMS-1 Architecture and Audit Specification

## Goal

Freeze the accepted virtual-segregation contract and identify the smallest safe
delta from the current Strapi 5.49 implementation.

## Deliverables

- Architecture, role, navigation, field, and security specification.
- UID-by-workspace inventory of current custom links.
- RBAC subject and `siteScope` coverage comparison.
- Current implementation gaps and risk-ranked changes for GWR-CMS-2.
- Updated Gateway phase plan, CMS operating documentation, and progress log.

## Files inspected

- `cms/src/admin/app.tsx`
- `cms/src/admin/extensions/sarga-workspaces/WorkspacePage.tsx`
- `cms/src/access-control/sarga-workspaces.ts`
- scoped schemas under `cms/src/api/**/schema.json`
- current multisite, CMS, Gateway, deployment, and UAT documents

## Non-goals

- No CMS source, schema, seed, permission, or account mutation.
- No admin build or runtime role mutation.
- No change to public frontend behavior.

## Acceptance

- The documents consistently state that managed editors do not choose scope.
- The documents do not claim that menu prefixes are a security boundary.
- Every planned code change maps to a verified current gap.
- GWR-CMS-2 remains blocked pending user approval.
