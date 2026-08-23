# GWR-CMS-MAIL-5: Motorsport SMTP Settings UI

## Purpose

The CMS now provides a protected **Motorsport SMTP Mail** administration page for
the Microsoft 365 OAuth2 SMTP transport used by Motorsport inquiry notifications.
The page is available from the Strapi admin menu and is intended for the
Motorsport Admin and Super Admin roles only.

## Access and scope

- Scope: Motorsport only.
- Allowed roles: `sarga-motorsport-admin` and `strapi-super-admin`.
- Other admin roles do not receive the menu permission and are rejected by the
  API even if they manually open the route.
- The settings are stored in the Strapi `sarga-mail` plugin store under the
  `motorsport` key. They are not a public API or content type.

## CMS-over-environment behavior

Each editable CMS value overrides its matching environment variable when it is
non-blank. If the CMS value is blank or has never been saved, the existing
environment variable remains the fallback. The fixed transport values are not
editable: `smtp.office365.com`, port `587`, STARTTLS, and the Exchange Online
OAuth scope.

The UI can explicitly clear a CMS-stored OAuth client secret so that the runtime
uses `MICROSOFT_CLIENT_SECRET` again. Leaving the secret field blank by itself
preserves the current stored secret.

## Secret handling

- The OAuth client secret is write-only in the UI.
- It is encrypted with AES-256-GCM before storage.
- `ENCRYPTION_KEY` must be configured before saving a client secret.
- The API returns only `clientSecretConfigured`, never the secret itself.
- No credential is committed to the repository.

## Verification

The **Verify connection** action performs a Nodemailer/Exchange SMTP connection
verification using the effective CMS-over-environment settings. It does not send
an email. Exchange Online app-only authorization, service-principal mailbox
access, and authenticated SMTP must still be configured in Microsoft 365.

The runtime inquiry notification worker resolves the same effective settings for
each batch, so changes made in the CMS take effect without restarting the CMS.
The existing generic Strapi email plugin configuration remains environment-backed
for unrelated email consumers.

## Operational checklist

1. Open **Motorsport SMTP Mail** in Strapi as Motorsport Admin or Super Admin.
2. Enter the tenant ID, client ID, SMTP mailbox, sender identity, and recipient.
3. Enter the client secret, or leave it blank to use the environment fallback.
4. Save settings.
5. Select **Verify connection** and confirm the no-send success message.
6. Submit a real inquiry through the approved staging flow and inspect the
   notification status/logs.

Rotate the Microsoft client secret in Microsoft Entra and update the CMS value
or environment fallback together. Do not paste secrets into tickets, logs, or
source files.
