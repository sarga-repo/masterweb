# 20 — GWR-CMS-11 Motorsport Media Selection and News Refinement

Status: repository implementation completed 2026-08-11.

## Goal

Remove ambiguity from the Motorsport Admin existing-asset workflow and refine
the Motorsport News surfaces without weakening the shared Media Library
guardrails.

## Media Library decision

The managed Motorsport role already owns `plugin::upload.read` and
`plugin::upload.assets.create`. Those permissions are sufficient for Strapi's
Content Manager media field to list and select an existing compatible asset.

Strapi's stock card interaction is easy to misread:

- clicking an asset preview opens **Details**;
- the checkbox at the upper-left of the card selects the existing asset;
- the outer media-picker **Finish** action applies the selection.

The admin now shows this instruction inside every Content Manager media picker
and on the Motorsport workspace. The authenticated RBAC harness also verifies
both permission actions and a successful existing-asset list request.

`plugin::upload.assets.update` was deliberately not granted. In Strapi 5.49 it
combines crop/details/replace with delete, move, and bulk-delete capabilities
for the shared upload pool. Granting it solely to make the details form editable
would let a site editor remove another site's files and would contradict the
current shared-library security contract.

## Motorsport visual refinement

- News article introduction, story canvas, story metadata, and related-story
  surfaces now use deep blue, crimson, ignition-orange, and teal reflected-light
  gradients instead of cream-dominated backgrounds.
- Warm White remains the primary copy color with Electric Yellow and
  Slipstream Teal for editorial metadata and navigation.
- Dotted texture and spectrum separators preserve the Motorsport design-system
  rhythm and accessible contrast.
- The Homepage Latest News section now includes a low-opacity, two-row slanted
  race-flag field in the previously empty lower-left area. It is decorative,
  non-interactive, masked into the existing reflected-light background, and
  removed on small screens to protect content density.

## Verification contract

- CMS production admin build must pass and the built bundle must contain the
  media-picker guidance.
- The persisted Motorsport role must retain Media Library read/create actions
  without Media Library update/delete authority.
- The authenticated workspace harness must prove `/upload/files` returns 200
  for every managed role when staging UAT credentials are supplied.
- Motorsport production build must pass.
- Desktop browser review must show readable article copy, warm brand gradients,
  the visible but subordinate race-flag decoration, and no console errors.

## Editorial workflow

Open **Sarga Motorsport → Motorsport Site pages → Motorsport Homepage**. In a
discipline image field, choose the Media Library, remain on **Browse**, tick the
asset-card checkbox, then select **Finish**. Clicking the image itself is only a
details preview. Published frontend content may take up to 60 seconds to
revalidate.
