# CMS Side-by-Side Preview

## Status

- Phase: `MSR-CMS-LIVE-2`
- Status: Implemented locally on 2026-08-23
- Scope: Motorsport page Single Types

## Editorial experience

The Strapi admin now provides a dedicated `Motorsport Live Preview` menu
entry, and the native Content Manager `Open preview` action for supported
Motorsport page Single Types opens the same split workspace. The selected
page's Content Manager editor and secure frontend Preview are presented in
two panes:

```text
CMS Content Manager editor  |  Motorsport frontend draft Preview
```

Editors can choose one of the ten Motorsport page Single Types and switch
between English and Bahasa Indonesia. The right pane uses the existing Strapi
Preview route, Draft Mode, exact document contract, and live-on-save heartbeat.

## Safety contract

- The admin UI does not receive or construct `PREVIEW_SECRET`.
- The left pane is the normal authenticated Strapi Content Manager editor.
- The right pane is the existing Strapi Preview route, which generates the
  secure frontend Preview URL server-side.
- Save updates the private draft; Publish remains the public release boundary.
- The public frontend never receives draft content without a valid Preview
  session.
- The CMS admin CSP allows only the configured CMS admin and Motorsport
  frontend origins for these frames; wildcard framing is not enabled.

## Known operational gate

The admin build and TypeScript checks pass. A full authenticated browser check
of the two iframe panes remains a local/staging gate because the local Strapi
service became temporarily unresponsive during the restart test. No CMS
content was mutated by this phase. The integrated Content Manager entry point
and its browser flow are recorded in
`83_cms_integrated_content_manager_preview.md`.
