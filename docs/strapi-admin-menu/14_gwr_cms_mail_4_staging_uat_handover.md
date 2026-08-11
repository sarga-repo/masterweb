# 14 — GWR-CMS-MAIL-4 Staging UAT and Handover

Status: implementation and non-credentialed validation completed 2026-08-11.
Credentialed Microsoft 365 staging evidence is pending Sarga IT provisioning.

## Purpose

Provide a controlled staging-only validation, monitoring, rotation, rollback,
and launch-sign-off procedure for the MAIL-2 transport and MAIL-3 inquiry
notification workflow.

## Automated staging safety gate

The controlled-send command refuses to run unless all conditions are met:

- `MAIL_UAT_ENVIRONMENT=staging`;
- `MAIL_UAT_ALLOW_SEND=I_APPROVE_STAGING_TEST_SEND` exactly;
- `MAIL_UAT_RECIPIENT` is one valid mailbox;
- that recipient already exists in one of the three server recipient
  allowlists;
- the selected Exchange transport configuration is valid (`oauth` by default,
  or the separately approved and unexpired MAIL-4.1 fallback).

The command refuses `production` and does not accept an arbitrary recipient.
It verifies SMTP first and sends only a generic message containing no visitor
data.

```bash
cd /srv/sarga-website
set -a; source /etc/sarga/cms.env; set +a

pnpm --dir cms mail:verify

MAIL_UAT_ENVIRONMENT=staging \
MAIL_UAT_ALLOW_SEND=I_APPROVE_STAGING_TEST_SEND \
MAIL_UAT_RECIPIENT=<ONE_EXISTING_ALLOWLISTED_RECIPIENT> \
sudo -u sarga --preserve-env pnpm --dir cms mail:uat-send
```

Remove the three temporary `MAIL_UAT_*` values immediately after the test.

## End-to-end staging UAT

Run on a restored staging snapshot and disposable test records only.

1. Confirm Microsoft Entra application, Exchange service principal,
   mailbox-scoped `Application SMTP.SendAsApp`, mailbox SMTP AUTH, and outbound
   443/587 access for OAuth. If MAIL-4.1 is temporarily selected, record the
   tenant/mailbox Basic SMTP eligibility, acknowledgement, owner, and expiry
   instead; do not claim the OAuth-specific gate is complete.
2. Keep notifications off; run `mail:verify` and capture timestamp/operator/
   result without capturing secrets or tokens.
3. Run the controlled staging send and confirm Exchange acceptance, Outlook
   inbox receipt, From/Reply-To, and absence of visitor data.
4. Configure all three internal recipient lists and enable
   `MAIL_NOTIFICATIONS_ENABLED=true`; restart CMS.
5. Submit one English and one Indonesian inquiry from each frontend. Confirm
   every public response succeeds after storage and each record has the correct
   `sourceSite`.
6. Within the cron interval, confirm the six records reach `sent`, attempts are
   `1`, localized templates are correct, HTML is escaped, and each message goes
   only to its site's allowlist.
7. Temporarily use an approved failure simulation (revoked staging credential
   or blocked staging SMTP egress), submit a disposable inquiry, and confirm
   `failed`, a safe error code, and a future next-attempt value. Restore access
   and confirm retry reaches `sent` without editing the inquiry.
8. For OAuth, rotate the client credential by installing the replacement
   first, restart, rerun `mail:verify`, then revoke the old credential and
   verify again. For Basic contingency mode, rehearse password replacement and
   separately schedule the mandatory OAuth migration before its expiry.
9. Confirm SPF, DKIM, and DMARC alignment from received-message headers with
   Sarga IT. Confirm the message is not classified as spam.
10. Set both toggles false after UAT unless the staging environment is approved
    for continuous notifications.

## Audit queries

Use a read-only database account or an approved Strapi console session. Never
export visitor message/email fields into tickets or chat.

```sql
SELECT source_site, notification_status, COUNT(*)
FROM inquiry_submissions
GROUP BY source_site, notification_status
ORDER BY source_site, notification_status;

SELECT id, source_site, notification_status, notification_attempts,
       notification_last_error_code, notification_next_attempt_at,
       notification_sent_at
FROM inquiry_submissions
WHERE notification_status IN ('pending', 'processing', 'failed')
ORDER BY created_at ASC;
```

## Monitoring and alert thresholds

- Alert if any `processing` record is older than ten minutes.
- Alert if a `failed` record has no next attempt and attempts reached the
  configured maximum.
- Alert if pending/failed due records remain for more than two cron intervals.
- Alert on repeated `smtp_auth` or `smtp_tls` classifications immediately.
- Track batch summaries from `sarga-cms` logs; they contain counts only.
- Include mail status counts in daily form-submission operational review.

```bash
sudo journalctl -u sarga-cms --since '30 minutes ago' --no-pager \
  | grep '\[Sarga Mail\]'
```

## Incident rollback

1. Set `MAIL_NOTIFICATIONS_ENABLED=false` first to stop new queue processing.
2. Set `MAIL_ENABLED=false` if the transport or credential is compromised.
3. Restart `sarga-cms` and confirm forms still persist inquiries.
4. Do not delete pending/failed records. Decide with the business owner whether
   to resume or close them after recovery.
5. Revoke the Entra credential if compromise is suspected and issue a new one.
6. Record affected time window, status counts, safe error classifications,
   operator actions, and the business decision on retry.

## Launch gates

Production mail must remain disabled until all of the following are signed:

- credentialed `mail:verify` success on staging;
- controlled staging delivery received;
- six-site/locale workflow cases route correctly;
- retry and recovery evidence captured;
- credential rotation evidence captured, and any Basic contingency has a named
  OAuth migration owner/date before its expiry;
- SPF/DKIM/DMARC and Outlook delivery accepted by Sarga IT;
- recipient owners and on-call operator named;
- privacy/copy approval for templates;
- rollback drill completed.

These gates cannot be truthfully closed in the repository without the tenant
credential and real staging environment. Current local evidence proves code,
TLS reachability, safety gating, and disabled/fail-closed behavior only.
