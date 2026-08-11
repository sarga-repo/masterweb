# 07 — GWR-CMS-6 Gateway i18n and Dynamic Navigation

Status: completed 2026-08-11.

## Goal

Pilot the complete public experience on Sarga.co while preserving every current
English URL.

## Deliverables

- Add the locale resolver: English unprefixed, Indonesian `/id` prefixed.
- Add typed `en`/`id` interface dictionaries and a persistent language switch
  in desktop/mobile headers.
- Pass the active locale to every Gateway Strapi query.
- Resolve the top navigation from CMS with the approved strict fallback rules.
- Normalize locale prefixes for active-link detection and equivalent-path
  switching.
- Localize `<html lang>`, metadata, structured data, canonicals, `hreflang`,
  sitemap entries, error/empty states, forms, and accessibility labels.
- Preserve current Gateway visual design, responsive behavior, and route
  activation/Coming Soon logic.

## Verification

- English parity across all existing routes.
- Indonesian routing and whole-record fallback across all Gateway routes.
- CMS menu show/hide/order/CTA changes on desktop and mobile.
- Unsafe URL and CMS outage/unconfigured-menu fallbacks.
- Responsive, keyboard, screen-reader label, cache/revalidation, metadata, and
  sitemap tests.

## Approval gate

Stop after Gateway bilingual and navigation UAT. Do not roll the shared contract
into Motorsport or Horse Sport until approved.

## Implementation result

- Added unprefixed English and `/id` Indonesian URL resolution through the
  Gateway proxy without duplicating route trees.
- Added typed shell/form/error dictionaries, locale-aware links, persistent
  desktop/mobile language controls, and localized accessibility labels.
- Converted the Gateway header to the CMS Top Navigation contract with English
  structural ownership, localized labels, strict configured-menu semantics,
  safe URL filtering, and repository fallback only for outage/unconfigured CMS.
- Added whole-record Strapi fallback metadata, localized form source capture,
  canonicals, hreflang, Open Graph locale, structured-data language, and a
  localization-aware sitemap.
- Verified CMS-backed navigation and both responsive shells in a real browser;
  focused tests and both production builds passed.
