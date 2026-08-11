# 19 — GWR-CMS-10 Motorsport Homepage Managed Sections

Status: repository implementation completed 2026-08-11.

## Goal

Move the Motorsport homepage Race Control band and World of Motorsport section
from frontend constants into the existing localized, role-scoped `motorsport-home`
Site Page without changing their approved visual composition.

## CMS contract

The Motorsport Homepage Site Page adds:

- `motorsportFeaturedEvent` — optional Event relation. It controls the date and
  ticket-status values in Race Control. If empty or outside Motorsport/shared
  scope, the frontend uses the first tickets-open event and then the earliest
  available event.
- `motorsportInformationBand` — enabled switch, eyebrow, heading, description,
  labels for Next Event/Ticket Status/Region, and the region value.
- `motorsportWorldSection` — enabled switch, eyebrow, two-part heading,
  description, CTA label/URL, and up to six ordered discipline cards.
- Each discipline card owns an internal name, enabled switch, title, short
  label, optional image and alt text, validated destination, brand accent, and
  sort order.

Both components are localized with the parent Site Page. Stable internal names,
links, ordering, and imagery should be reviewed when creating the Indonesian
localization; whole-record English fallback remains the public fallback policy.

## Runtime contract

- Missing components use the previous approved frontend content and images.
- `enabled: false` hides the complete corresponding section.
- An empty enabled discipline list falls back to the approved six-card set;
  editors should disable the section when it should not render.
- CMS images override the local approved fallback by matching each card's
  stable `internalName`.
- Only root-relative internal links and HTTPS external links are accepted;
  invalid destinations fall back to the matching approved route.
- The existing responsive horizontal rail, six-column wide layout, typography,
  brand gradients, focus behavior, and image fallback remain unchanged.

## Seed and migration

The development seed backfills the new components and the current featured
Motorsport Event only while each field is empty. It never replaces an existing
component, relation, hero carousel, or other editor-managed homepage content.
Staging and production receive these components through the approved encrypted
Strapi content/media promotion workflow, not the development seed.

## Access control

The fields remain inside `Site Page` and inherit the existing Motorsport scope
condition. Recursive managed-field generation grants Motorsport Admin access to
the nested discipline fields while continuing to exclude writable `siteScope`.
Super Admin retains unrestricted access; other dedicated-site roles cannot edit
the Motorsport record.

## Verification

- Strapi schema/type generation and CMS TypeScript compilation.
- Nested-component managed-field/RBAC regression tests.
- Local public API population of the Event relation, information band, and six
  discipline records.
- Motorsport lint, TypeScript, and isolated production build.
- Browser verification at desktop and 390 px mobile with six working cards, no
  horizontal document overflow, and clean console output.
- Docker Compose and whitespace validation.

## Editorial location

Open **Sarga Motorsport → Pages → Sarga Motorsport Homepage**. The relevant
fields are **Motorsport Featured Event**, **Motorsport Information Band**, and
**Motorsport World Section**. Save and publish the active locale after editing;
frontend content revalidation can take up to 60 seconds.
