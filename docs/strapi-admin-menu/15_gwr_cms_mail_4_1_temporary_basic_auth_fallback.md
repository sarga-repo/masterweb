# 15 — GWR-CMS-MAIL-4.1 Temporary Basic SMTP Fallback

Status: completed 2026-08-11 for the urgent 2026-08-14 Motorsport launch.
OAuth remains the target architecture.

## Decision

Support Exchange Online password authentication as an explicit, expiring
compatibility mode for an existing Microsoft 365 tenant. It is not the default,
does not weaken TLS, and cannot silently remain enabled indefinitely.

Microsoft's Exchange team revised the timeline in January 2026: existing tenant
behavior remains unchanged until the end of December 2026, when Basic SMTP AUTH
becomes disabled by default. Tenant, mailbox, Security Defaults, MFA, and
authentication-policy settings can still block password authentication today.
Sarga IT must confirm the mailbox is eligible before launch.

## Safety contract

- Default `MAIL_AUTH_MODE` is `oauth`.
- Basic mode requires an exact explicit acknowledgement.
- A password and ISO-8601 expiry are mandatory.
- The configured expiry must be in the future and cannot exceed
  `2026-12-15T23:59:59.999Z`, leaving migration time before Microsoft's
  end-of-December default change.
- Expiry is checked at Strapi configuration time and immediately before every
  notification batch/send. A process left running past expiry stops delivering.
- SMTP remains fixed to `smtp.office365.com:587` with STARTTLS required, TLS 1.2
  minimum, and certificate verification.
- From remains equal to the authenticated mailbox; recipients remain the three
  fixed server-side allowlists.
- Passwords are redacted from operator errors and must never be committed,
  printed, pasted into chat, or placed in frontend variables.

## Temporary runtime configuration

Use `/etc/sarga/cms.env`, owned `root:sarga` with mode 640:

```dotenv
MAIL_ENABLED=true
MAIL_AUTH_MODE=basic
MAIL_SMTP_HOST=smtp.office365.com
MAIL_SMTP_PORT=587
MAIL_SMTP_REQUIRE_TLS=true
MAIL_SMTP_USER=noreply@sargamotorsport.co
MAIL_SMTP_PASSWORD=<RUNTIME_SECRET_ONLY>
MAIL_FROM_ADDRESS=noreply@sargamotorsport.co
MAIL_FROM_NAME="Sarga Motorsport"
MAIL_DEFAULT_REPLY_TO=noreply@sargamotorsport.co
MAIL_BASIC_AUTH_ACKNOWLEDGED=I_ACCEPT_TEMPORARY_BASIC_AUTH_RISK
MAIL_BASIC_AUTH_EXPIRES_AT=2026-09-30T23:59:59Z

# Keep false until verify and controlled staging send pass.
MAIL_NOTIFICATIONS_ENABLED=false
```

Choose the earliest practical expiry. September 30 is an example, not a reason
to delay OAuth. Do not set the three Microsoft OAuth values in Basic mode; they
are not used.

## Microsoft 365 checks

Sarga IT should run:

```powershell
Get-TransportConfig |
  Format-List SmtpClientAuthenticationDisabled

Get-CASMailbox -Identity noreply@sargamotorsport.co |
  Format-List SmtpClientAuthenticationDisabled

Get-User -Identity noreply@sargamotorsport.co |
  Format-List AuthenticationPolicy
```

If an authentication policy is assigned, confirm it permits Basic SMTP AUTH.
Also confirm Security Defaults or Conditional Access does not block this legacy
flow. Do not disable broader tenant security controls merely to make the test
pass; prefer launching with CMS persistence and mail notifications disabled.

## Launch sequence

1. Deploy the reviewed code while both mail toggles remain false.
2. Install the password only in `/etc/sarga/cms.env` and set mode 640.
3. Set `MAIL_ENABLED=true`, `MAIL_AUTH_MODE=basic`, acknowledgement, and expiry;
   leave notification delivery false.
4. Restart CMS. A missing/invalid/expired configuration must prevent startup.
5. Run the no-send verifier through a transient systemd unit so the protected
   environment file is not sourced or echoed:

   ```bash
   sudo systemd-run --wait --pipe --collect --uid=sarga \
     --property=WorkingDirectory=/srv/sarga-website \
     --property=EnvironmentFile=/etc/sarga/cms.env \
     /usr/bin/pnpm --dir cms mail:verify
   ```

   Confirm the executable with `command -v pnpm` and substitute that absolute
   path if the VM does not install pnpm at `/usr/bin/pnpm`.

6. Run the MAIL-4 controlled staging send to one already allowlisted internal
   recipient. Confirm Outlook receipt and headers.
7. Configure all three recipient allowlists, set
   `MAIL_NOTIFICATIONS_ENABLED=true`, restart CMS, and execute one inquiry per
   site and locale.
8. If any gate fails, turn notifications off. The websites can still launch;
   inquiries remain stored in Strapi for manual handling.

## Migration to OAuth

Before the temporary expiry:

1. Provision the Entra application, `SMTP.SendAsApp`, Exchange service
   principal, and mailbox-scoped authorization from MAIL-2.
2. On staging, replace the Basic variables with:

   ```dotenv
   MAIL_AUTH_MODE=oauth
   MICROSOFT_TENANT_ID=<tenant-guid>
   MICROSOFT_CLIENT_ID=<application-guid>
   MICROSOFT_CLIENT_SECRET=<secret-store-value>
   MICROSOFT_SMTP_SCOPE=https://outlook.office365.com/.default
   ```

3. Remove `MAIL_SMTP_PASSWORD`, `MAIL_BASIC_AUTH_ACKNOWLEDGED`, and
   `MAIL_BASIC_AUTH_EXPIRES_AT` from the runtime environment.
4. Restart, run `mail:verify`, run controlled staging delivery, then deploy the
   OAuth configuration to production.
5. Rotate the mailbox password after removal if it was exposed to additional
   operators during the emergency rollout.

## Verification coverage

- Basic mode works without Tenant ID, Client ID, or client secret.
- TLS, sender, endpoint, and allowlist restrictions remain unchanged.
- Missing acknowledgement/password/expiry fail closed.
- Invalid, expired, and beyond-cutoff expiry values fail closed.
- Runtime expiry guard is invoked before each worker batch and send.
- Password redaction is tested.
- OAuth remains the default and its previous tests remain active.

## References

- [Microsoft updated SMTP AUTH Basic authentication timeline](https://techcommunity.microsoft.com/blog/exchange/updated-exchange-online-smtp-auth-basic-authentication-deprecation-timeline/4489835)
- [Microsoft SMTP AUTH tenant and mailbox configuration](https://learn.microsoft.com/en-us/Exchange/clients-and-mobile-in-exchange-online/authenticated-client-smtp-submission)
