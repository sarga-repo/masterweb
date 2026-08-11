# Per-Site CMS Editor Handover

## Choose the correct account

Each editor account must have exactly one managed Sarga role:

| Team        | Role code                | Workspace         | Automatic ownership |
| ----------- | ------------------------ | ----------------- | ------------------- |
| Gateway     | `sarga-gateway-admin`    | Sarga Gateway     | `gateway`           |
| Motorsport  | `sarga-motorsport-admin` | Sarga Motorsport  | `motorsport`        |
| Horse Sport | `sarga-horsesport-admin` | Sarga Horse Sport | `horsesport`        |
| Shared      | `sarga-shared-admin`     | Shared Library    | `shared`            |

Super Admin is the only supported cross-site account. Never combine two managed
site roles on one account; the server rejects managed writes for ambiguous
accounts.

## Daily editor workflow

1. Sign in and open the prefixed Sarga workspace shown in the sidebar.
2. Choose Pages, Programs, Editorial, Commerce, or Library inside that
   workspace, then use its list or quick-create action.
3. Create or edit content normally. The CMS assigns ownership from your role;
   there is no editable `siteScope` choice for a managed editor. Strapi may
   return the current value read-only because it is required for publish
   validation.
4. Complete required copy, media alt text, relationships, SEO, preview, and slug
   review before publishing.
5. Publish only approved records. Cross-site teaser flags and business
   relationships remain explicit editorial choices where the model exposes
   them; they do not transfer record ownership.

If the wrong workspace is needed, stop and ask Super Admin. Do not request a
second site role or work around the workspace with a copied URL.

If Save works but Publish reports inaccessible required fields, restart Strapi
so repository-managed roles resynchronize, then sign out and back in. Do not
manually grant `siteScope` update access: managed roles require read-only scope
visibility, while the server owns all scope writes.

## English and Indonesian authoring

- English (`en`) is the default and structural master. Indonesian (`id`) is the
  approved second locale.
- Use Strapi's locale selector to create or edit the Indonesian localization of
  the same document. Do not create a separate unrelated record for a
  translation.
- Translate complete editorial records. Public frontend fallback is
  whole-record English; it never combines translated and untranslated fields.
- Keep stable slugs and route paths identical between locales. The CMS rejects
  a conflicting Indonesian route.
- For Top Navigation, edit URL, link type, enabled state, display order,
  emphasis, and new-tab behavior in English. Indonesian changes only the label
  and ARIA label; the CMS rejects structural drift.
- A site may publish at most eight enabled Top Navigation documents. Internal
  links start with one `/`; external/cross-site links use HTTPS.
- After saving, publish the changed Top Navigation localization. Published
  enable/disable and ordering changes are read without a frontend navigation
  cache and should appear on the next page request; clearing browser cache is
  not required.
- Managed editors may read the configured locale list but cannot create,
  rename, or delete locales. Ask Super Admin for locale administration.

Inquiry and newsletter records are not translations. Their `sourceLocale`
records the language of the page where the visitor submitted the form.

### Translation review and publish checklist

1. Super Admin generates the current backlog with `pnpm --dir cms
i18n:completeness --output <protected-path>/bilingual-completeness.md`.
2. The owner shown for the record creates the Indonesian localization from the
   English document; do not create a separate document.
3. Translate every visitor-visible field, component, media alt text, SEO field,
   and CTA while preserving the structural slug/route contract.
4. Preview desktop and mobile in Indonesian. Confirm links retain `/id`, no
   heading is clipped, and the correct site's content is shown.
5. Keep the localization draft until editorial approval. Draft/missing
   Indonesian content intentionally renders whole-record English fallback with
   `noindex`.
6. Publish the Indonesian localization, regenerate the report, and obtain the
   site's reviewer/date sign-off. A record is complete only when the report
   shows `ID published`.

Do not remove fallback `noindex` globally to compensate for an incomplete
translation backlog.

## Hero image and video workflow

Gateway, Motorsport, and Horse Sport can use short CMS-managed MP4/WebM video
as progressive enhancement over a hero image. The image/poster always remains
the fallback and accessible text remains independent from the video.

1. Upload the approved sources into the correct top-level Media Library folder.
   Use MP4 or WebM, never a long-form or audio-led clip. The editorial target is
   about 5-8 MB per source and the hard infrastructure ceiling is 100 MB.
2. Upload a compressed desktop poster and, when the crop needs it, a mobile
   poster. Complete useful alt text on the hero image/poster record.
3. Gateway: open the localized Homepage and add `Hero Video`. Horse Sport: open
   the localized `horsesport-home` Site Page and add `Hero Video`.
4. Motorsport: open the localized `motorsport-home` Site Page, expand one of
   the maximum three Hero Slides, and add `Hero Video`. Repeat per slide only
   when a distinct, approved clip exists.
5. Set `primaryVideo` and optionally `alternateVideo` to the other codec. The
   frontend detects MP4/WebM from media metadata; unsupported formats are
   ignored and the poster remains visible.
6. Preview desktop and mobile, test the visible pause/play control, then publish
   the localization. Test once more with operating-system reduced motion on.
7. To stop video without deleting editorial configuration, turn `enabled` off
   and publish. Do not remove the existing poster/image.

Only the active Motorsport slide mounts a video. A published record with no
valid video source deliberately renders the current image carousel; this is not
a cache failure. Video and poster binaries must be promoted together with the
CMS database/uploads archive.

## Motorsport homepage Race Control and disciplines

Open **Sarga Motorsport → Pages → Sarga Motorsport Homepage**:

1. Use **Motorsport Featured Event** to explicitly select the Event whose date
   and ticket status appear in Race Control. Leaving it empty enables the safe
   automatic selection of the first tickets-open or earliest Motorsport Event.
2. Expand **Motorsport Information Band** to edit its eyebrow, title,
   description, labels, and region. Turn `enabled` off to hide the whole band.
3. Expand **Motorsport World Section** to edit its heading, description, and
   calendar CTA. Its `enabled` switch hides the complete section.
4. Add, remove, enable, and order no more than six Discipline Cards. Preserve a
   unique stable `internalName`; set the public title, short label, image, image
   alt, destination, approved accent, and sort order.
5. Internal destinations start with one `/`; external destinations must use
   HTTPS. Invalid values safely use the approved fallback route.
6. Save, preview both viewport sizes, and publish the active locale. Public
   homepage revalidation can take up to 60 seconds and does not require a
   browser-cache clear.

If a new component is accidentally emptied, the approved launch content remains
as runtime fallback. Use the explicit enabled switch when the editorial intent
is to hide a section.

## Read-only references and media

Dedicated roles may see a narrow read-only Site or Ecosystem Business entry so
relationship pickers can resolve the role-owned site/business. These references
cannot be created, changed, deleted, or published by that role.

Media Library files do not carry `siteScope`. Use top-level folders named
`gateway`, `motorsport`, `horsesport`, and `shared`, include useful alt text, and
never upload confidential material. Per-site media-row isolation is not part of
this implementation.

When selecting an existing file from a Content Manager media field, stay on the
**Browse** tab, tick the checkbox at the upper-left of the asset card, and then
choose the outer **Finish** action. Clicking the preview opens the asset's
**Details** view and does not select it. The admin displays the same reminder in
the media picker and on the Motorsport workspace.

Managed site roles intentionally do not receive Media Library **Update**. In
Strapi 5.49 that one permission also grants replace, move, delete, and bulk
delete across the shared asset pool. Request metadata correction or asset
replacement from Super Admin instead of broadening the role.

## Account provisioning

Super Admin provisions one account at a time from the environment/secret store:

1. Set the matching `CMS_GATEWAY_ADMIN_*`, `CMS_MOTORSPORT_ADMIN_*`,
   `CMS_HORSESPORT_ADMIN_*`, or `CMS_SHARED_ADMIN_*` email/password/name values.
2. Start or restart Strapi. Bootstrap creates the account only when the email is
   new and assigns its one managed role.
3. Sign in as that account and run the browser smoke checklist in
   `uat-results.md`.
4. Remove the provisioning email/password from the service environment and
   restart. Keep the credential in the approved password manager only.

Bootstrap never resets an existing password or silently reassigns an existing
email. Disable/deactivate departed users in Strapi immediately.

## Super Admin responsibilities

- Own cross-site/shared/hidden scope decisions and reviewed migrations.
- Manage users and ensure exactly one managed role per dedicated editor.
- Do not broaden generated managed-role permissions manually; startup restores
  the repository-owned permission contract.
- Review external URLs, shared relationships, publish status, and media-folder
  hygiene.
- Run the authenticated staging matrix after access-control or Strapi upgrades.

## Staging and production verification

After deployment and database/media migration:

1. Confirm Strapi starts without RBAC bootstrap errors.
2. Use disposable staging accounts to run `pnpm --dir cms
uat:workspace-rbac` with credentials supplied only through environment
   variables.
3. Complete the five-role browser smoke checklist.
4. Verify frontend content from each scope and confirm shared/hidden behavior.
5. Delete disposable accounts/content and record the result/date in the release
   checklist.

On production, perform read-only login/workspace checks unless an approved
maintenance window explicitly authorizes write tests. Follow
`docs/14_ubuntu_single_vm_production_deployment.md` and
`docs/15_strapi_content_media_promotion.md` for deployment and exact content/
asset promotion.
