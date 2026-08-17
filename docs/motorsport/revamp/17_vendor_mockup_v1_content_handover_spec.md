# MSR-MOCKUP-3 — CMS Content and Asset Handover

## Status

Handover contract implemented/documented: 2026-08-14.

## Editor workflow

1. Open the Motorsport workspace in Strapi.
2. Manage `Motorsport Program` records for FIA and IJTC. Set the localized
   `eventMenuLabel` to the concise name that should appear in the Event
   dropdown (for example, `FIA Rallycross` or `IJTC`) and leave
   `eventMenuEnabled` on to list the programme. Use `programStatus = hidden`
   or `eventMenuEnabled = false` to remove a programme from the Event menu;
   hidden programme routes show Coming Soon.
3. Manage localized English and Indonesian fields in the language selector,
   including the dropdown label when it differs by language.
4. Attach approved hero/banner media from the shared Media Library.
5. Manage FIA's related Ticket CTA and approved partner URL; the public site
   redirects externally and never processes payment.
6. Manage Site chrome for header/footer logos, footer columns, social links,
   utility links, and copyright. Keep Visit Sarga.co disabled until approved.
7. Manage About team entries through the scoped Leadership records.
8. In `motorsport-home`, use the `enabled` switch on each `Page Section` to
   control Upcoming events, Latest news, Gallery, and Connected records
   independently. The approved vendor state has Upcoming events and Connected
   records disabled while the ticket panel remains visible.
9. Use `motorsportInformationBand.enabled` for the blue information band. A
   Ticket CTA's optional `image` field supplies the ticket panel artwork; its
   existing `isActive` and `siteScope` fields control availability.
10. Manage the complete homepage ticket card in the `motorsportTicketSection`
    field on `Site Pages → motorsport-home`. This dedicated component controls
    `isActive`, eyebrow, title, description, optional `backgroundImage` for the
    middle content-panel artwork, event
    and provider footer labels/text, partner label, footer text, CTA label, and
    approved CTA URL. When this component exists, `isActive = false` removes
    the homepage card; the legacy `Ticket CTA` record remains available for
    the Tickets page and is used only as a URL/provider/image fallback for
    fields left blank in the homepage component.

## Permissions

Motorsport Admin can read and edit Motorsport-scoped content and select shared
media. Super Admin can manage all site scopes and shared records. The Event
dropdown does not expose `siteScope` editing or cross-site records to a scoped
editor.

## Assets

Current approved media is the implementation fallback. Replace the temporary
logo and hero/ticket media by selecting the vendor-approved files in Strapi;
no code change or redeploy is required for normal media replacement. Existing
Media Library assets can be selected through the native asset-card checkbox.
