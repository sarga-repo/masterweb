# Sarga.co Gateway Revamp

This package is the implementation source of truth for the reference-aligned
Sarga.co Gateway redesign. It is intentionally separate from the Motorsport
and Horse Sport design tracks: the Gateway remains the corporate and ecosystem
entry point, while the dedicated sport sites keep their own visual systems.

## Objective

Retain the existing Sarga.co theme and working multisite architecture, then
recalibrate the Gateway to the approved visual references so it feels premium,
international, clean, editorial, and recognisably Sarga.

## Source precedence

When sources disagree, use this order:

1. The current approved user brief.
2. `reference/source-pdfs/sarga.co_sitemap.pdf` for information architecture.
3. The **Website Sarga.co Preview** and **Brand Visual Preview** sections in
   `reference/source-pdfs/look_and_feel_website_sarga_co.pdf` for layout,
   typography, colour, and photography direction.
4. This revamp specification package.
5. Existing Gateway documentation and implementation where it does not
   conflict with the sources above.

The PDF is a visual direction, not a source of production images or copy.

## Documents

- `01_reference_and_current_state_audit.md` — reference findings and current
  implementation gaps.
- `02_information_architecture_and_page_specs.md` — target routes, navigation,
  templates, and content ownership.
- `03_visual_typography_layout_spec.md` — visual system, typography, layout,
  imagery, and responsive rules.
- `04_cms_page_activation_contract.md` — CMS ownership and live/coming-soon
  behaviour.
- `05_implementation_phases.md` — approval-gated implementation sequence.
- `06_testing_uat.md` — acceptance and regression criteria.
- `../../strapi-admin-menu/` — approval-gated per-site CMS workspace
  segregation plus planned English/Indonesian content and CMS-managed top
  navigation architecture, phase specifications, and audit.

## Scope boundary

This specification does not authorise a second CMS, a stack change, payment
processing, public accounts, or an internal ticketing system. Motorsport and
Horse Sport remain separate frontends and are linked from the Gateway.
