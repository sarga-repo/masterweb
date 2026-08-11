# 12 — GWR-CMS-MAIL-2 OAuth Transport Foundation

Status: completed 2026-08-11. The transport is implemented and disabled by
default. Credentialed staging connectivity remains an operator gate.

## Goal

Provide the shared Strapi CMS with a secure Microsoft Exchange Online SMTP
transport using app-only OAuth 2.0, STARTTLS, and a single approved sender. This
phase establishes transport only; it does not send form notifications or
newsletter campaigns.

## Implemented architecture

- Strapi 5.49 uses `@strapi/provider-email-nodemailer@5.49.0`.
- Nodemailer connects only to `smtp.office365.com:587` with STARTTLS required,
  TLS 1.2 or newer, and certificate validation enabled.
- Authentication in this phase is XOAUTH2. OAuth remains the default and
  production target. A later, explicitly selected and expiring compatibility
  mode is documented separately in MAIL-4.1; it does not alter this phase's
  OAuth contract.
- A repository-owned token provisioner requests app-only access tokens from the
  tenant-specific Microsoft identity endpoint with the
  `https://outlook.office365.com/.default` scope.
- Tokens are cached in process memory and refreshed five minutes before expiry.
  Concurrent requests share the same in-flight token request.
- The configured From address must match the authenticated SMTP mailbox.
  Additional `SendAs` identities require a separately reviewed change.
- Mail logging and debugging are disabled. OAuth errors expose only a safe HTTP
  status/error code, not Microsoft response details or credentials.
- `MAIL_ENABLED` defaults to `false`. Enabling mail without every required
  credential fails Strapi configuration closed.

## Runtime environment contract

```dotenv
MAIL_ENABLED=false
MAIL_AUTH_MODE=oauth
MAIL_SMTP_HOST=smtp.office365.com
MAIL_SMTP_PORT=587
MAIL_SMTP_REQUIRE_TLS=true
MAIL_SMTP_USER=noreply@sargamotorsport.co
MAIL_FROM_ADDRESS=noreply@sargamotorsport.co
MAIL_FROM_NAME=Sarga Motorsport
MAIL_DEFAULT_REPLY_TO=noreply@sargamotorsport.co
MICROSOFT_TENANT_ID=<tenant-guid>
MICROSOFT_CLIENT_ID=<application-guid>
MICROSOFT_CLIENT_SECRET=<secret-store-value>
MICROSOFT_SMTP_SCOPE=https://outlook.office365.com/.default
```

The client secret belongs in `/etc/sarga/cms.env` or an approved secret store,
never a committed `.env` file. Staging and production should use independently
rotatable credentials. The supplied mailbox password is not required in OAuth
mode. Any temporary password-mode launch contingency must follow
`15_gwr_cms_mail_4_1_temporary_basic_auth_fallback.md` and expire before OAuth
migration.

## Microsoft 365 prerequisite

Before setting `MAIL_ENABLED=true`, Sarga IT must:

1. Create a dedicated Entra application and credential.
2. Register the Exchange Online service principal.
3. Grant `Application SMTP.SendAsApp` only over a resource scope containing the
   approved sender mailbox.
4. Enable Authenticated SMTP for that mailbox if it is disabled at mailbox
   level, while keeping Basic authentication disabled.
5. Provide Tenant ID, Client ID, and the client credential through the approved
   secret handover channel.
6. Confirm the server can reach `login.microsoftonline.com:443` and
   `smtp.office365.com:587`.

## Verification

Unit and compile verification:

```bash
cd /srv/sarga-website/cms
pnpm test:mail
pnpm exec tsc --noEmit
```

Credentialed no-send staging verification:

```bash
cd /srv/sarga-website
set -a
source /etc/sarga/cms.env
set +a
sudo -u sarga --preserve-env pnpm --dir cms mail:verify
```

`mail:verify` obtains an OAuth token, completes Nodemailer's SMTP `verify()`
flow, and closes the connection. It does not submit a message. Run it only on
staging after the Microsoft tenant permission is active. Never print or inspect
the environment file in CI logs.

Expected success output:

```text
Microsoft Exchange Online OAuth SMTP connection verified; no email was sent.
```

With mail disabled or incomplete credentials, verification must fail without
attempting a delivery. Transport verification is not proof of inbox delivery,
SPF/DKIM/DMARC alignment, or sender reputation; those are GWR-CMS-MAIL-4 gates.

## Rotation and rollback

### Client-secret rotation

1. Create the replacement credential in Entra before revoking the old one.
2. Replace `MICROSOFT_CLIENT_SECRET` in the protected runtime environment.
3. Restart Strapi and run `pnpm --dir cms mail:verify` on staging.
4. Revoke the old credential only after verification passes.
5. Repeat under an approved production maintenance window.

### Immediate rollback

1. Set `MAIL_ENABLED=false` in `/etc/sarga/cms.env`.
2. Restart `sarga-cms.service`.
3. Confirm CMS health and that no transport credential error appears.

Disabling mail does not remove stored inquiry or newsletter records. No form
notification workflow is connected in this phase.

## Acceptance evidence

- OAuth token caching, forced renewal, sender restriction, safe errors,
  disabled-default behavior, TLS/XOAUTH2 configuration, and insecure override
  rejection are covered by automated tests.
- TypeScript compilation and the Strapi production build pass.
- Docker Compose carries the complete variable contract and defaults to mail
  disabled.
- The no-send verifier fails closed without approved runtime credentials.
- No OAuth token, mailbox password, tenant credential, or production recipient
  is stored in the repository.

## Deferred scope

- Contact/rider inquiry notifications, visitor receipts, retry/outbox state,
  recipient allowlists, and bilingual templates belong to GWR-CMS-MAIL-3.
- Credentialed SMTP verification, a controlled test delivery, token
  revocation/rotation UAT, SPF/DKIM/DMARC checks, monitoring, and operational
  sign-off belong to GWR-CMS-MAIL-4.
- Inbound POP/IMAP processing and bulk newsletter delivery remain out of scope.
