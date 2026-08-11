# 13 — GWR-CMS-MAIL-3 Transactional Notification Workflow

Status: completed 2026-08-11. Delivery remains disabled by default pending
credentialed staging UAT.

## Goal

Notify an approved internal desk after a Gateway, Motorsport, or Horse Sport
inquiry has been durably stored in Strapi, without making the visitor wait for
SMTP and without turning Exchange Online into a newsletter platform.

## Implemented workflow

1. Each frontend persists an inquiry with a fixed `sourceSite` value.
2. The CMS lifecycle overwrites all client-supplied delivery fields.
3. When both `MAIL_ENABLED` and `MAIL_NOTIFICATIONS_ENABLED` are true, the new
   record is atomically marked `pending`; otherwise it is marked `disabled`.
4. A Strapi cron worker selects due records in small batches, marks each
   `processing`, and sends through the configured Email provider.
5. Success records `sent` and `notificationSentAt`.
6. Failure stores a safe error code and schedules bounded exponential retry.
   After five attempts by default, the record remains `failed` with no next
   attempt.
7. A stale `processing` record is recoverable after ten minutes on the initial
   single-VM topology.

The inquiry database row is the durable outbox. The public form succeeds after
Strapi storage, not after SMTP delivery.

## Data additions

`Inquiry Submission` now includes:

- `sourceSite`: `gateway`, `motorsport`, or `horsesport`;
- private `notificationStatus`: `disabled`, `pending`, `processing`, `sent`, or
  `failed`;
- private attempt, next-attempt, last-attempt, sent-at, and safe error-code
  fields.

Horse Sport's existing `ticketing` and `stable` inquiry categories are now
accepted by the shared CMS schema.

## Routing and template controls

- Internal recipients come only from `MAIL_RECIPIENT_GATEWAY`,
  `MAIL_RECIPIENT_MOTORSPORT`, and `MAIL_RECIPIENT_HORSESPORT`.
- Every configured recipient is validated, normalized, and deduplicated at
  startup. Enabling notifications without all three lists fails Strapi closed.
- A visitor can never choose the SMTP recipient, From address, message ID, or
  template path.
- The visitor's validated address is used only as `Reply-To`.
- Template copy follows the inquiry's `en` or `id` source locale and escapes all
  HTML. Plain-text and HTML variants are generated together.
- A stable message ID is derived from the CMS inquiry identifier. Delivery is
  at-least-once: a rare SMTP-success/database-update-failure can still cause a
  duplicate, and the stable ID helps recipient systems identify it.
- Logs contain only counts, record IDs where required for incident handling,
  and safe classifications such as `smtp_auth`, `smtp_tls`, `smtp_timeout`, or
  `smtp_rejected`; raw provider responses and visitor content are excluded.

## Runtime contract

```dotenv
MAIL_NOTIFICATIONS_ENABLED=false
MAIL_RECIPIENT_GATEWAY=<approved-internal-mailbox[,second-mailbox]>
MAIL_RECIPIENT_MOTORSPORT=<approved-internal-mailbox[,second-mailbox]>
MAIL_RECIPIENT_HORSESPORT=<approved-internal-mailbox[,second-mailbox]>
MAIL_MAX_ATTEMPTS=5
MAIL_WORKER_BATCH_SIZE=10
MAIL_WORKER_CRON="*/1 * * * *"
```

Both mail toggles remain false locally. On staging, establish MAIL-2 transport
connectivity first, configure approved internal recipients, then enable both
toggles in the same maintenance window.

## Security and failure behavior

- Recipient and Reply-To CR/LF injection is rejected.
- Provider errors are classified; raw error messages are not persisted.
- Invalid/missing recipient configuration aborts startup when notifications are
  enabled.
- The worker has a bounded batch and attempt count.
- Disabled inquiries do not become a surprise backlog if mail is enabled later.
- Newsletter subscription records are not sent to Exchange Online and no
  campaign workflow was added.
- Visitor receipts are not enabled because legal/copy approval was not supplied.

## Acceptance evidence

- Automated tests cover fixed routing, recipient validation/deduplication,
  bilingual escaping, stable IDs, successful state progression, bounded retry,
  exhausted records, disabled mode, safe errors, and header injection.
- Generated Strapi types include the schema changes.
- CMS typecheck/build and the existing RBAC regression suite pass.
- Gateway, Motorsport, and Horse Sport all submit the correct fixed site value.
- MAIL-4 owns credentialed staging delivery and operational sign-off.
