# MSR-CMS-UAT Restoration Manifest

Date: 2026-08-15. Scope: local Sarga Motorsport CMS UAT.

## Restored mutations

| Probe | Mutation | Restoration evidence |
| --- | --- | --- |
| About availability/hero | Temporarily enabled the page to validate saved hero media/copy and disabled sections | Draft and published `pageEnabled=false` restored; browser returned to Coming Soon |
| News page/hero/sections | Temporarily toggled page, hero, `news-control`, `lead-story`, `archive-intro`, and `news-gallery-cta` | Original values restored after each exact Preview assertion |
| Gallery sections | Temporarily toggled `gallery-intro` and `gallery-archive` | Original values restored; one hero and one archive visible |
| Merchandise catalogue | Temporarily toggled `merchandise-catalog` | Original value restored |
| Tickets event list | Temporarily toggled `ticketed-events` | Original value restored |
| News publish parity | Replaced Draft/published hero title with a timestamped probe | Original Draft and published titles restored and republished; live HTML confirmed |
| Article unpublish parity | Created temporary timestamped Motorsport news records | Published content disappeared immediately after delete; Draft and published remnants deleted |

## Intentional retained content changes

The following are implementation data, not UAT probes, and remain as
unpublished local Draft controls so editors can review and publish them:

- News: `news-control`, `news-gallery-cta`.
- Gallery: `gallery-archive`.
- Merchandise: `merch-control`, `merchandise-catalog`, `merch-final-cta`.
- Tickets: `ticketed-events`, `ticket-info`.

No API token, Preview secret, revalidation secret, password, or mailbox
credential is recorded in this manifest.

## Known retained editorial state

- About is intentionally disabled in both Draft and published English content.
- Two legacy FIA campaign Site Page documents remain; exact Preview binds by
  document ID and the public campaign URL redirects to the canonical Event URL.
- Final vendor content consolidation is an editorial migration, not part of
  this UAT restoration.
