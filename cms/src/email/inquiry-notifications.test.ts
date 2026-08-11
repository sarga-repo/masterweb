import assert from "node:assert/strict";
import test from "node:test";

import {
  assertInquiryNotificationEnvironment,
  buildInquiryNotification,
  recipientsForSite,
  runInquiryNotificationBatch,
  type InquiryNotificationRecord,
  type NotificationRepository,
} from "./inquiry-notifications.ts";

const enabledEnvironment = {
  MAIL_ENABLED: "true",
  MAIL_NOTIFICATIONS_ENABLED: "true",
  MAIL_SMTP_USER: "noreply@sargamotorsport.co",
  MAIL_RECIPIENT_GATEWAY: "gateway-ops@sarga.co",
  MAIL_RECIPIENT_MOTORSPORT: "motorsport-ops@sarga.co",
  MAIL_RECIPIENT_HORSESPORT: "horse-ops@sarga.co",
};

function inquiry(overrides: Partial<InquiryNotificationRecord> = {}): InquiryNotificationRecord {
  return {
    id: 42,
    documentId: "abc-42",
    name: "Visitor <script>",
    email: "visitor@example.com",
    inquiryType: "partnership",
    message: "A sufficiently detailed inquiry.\nSecond line.",
    sourcePage: "/contact",
    sourceSite: "gateway",
    sourceLocale: "en",
    submittedAt: "2026-08-11T01:00:00.000Z",
    notificationStatus: "pending",
    notificationAttempts: 0,
    notificationNextAttemptAt: "2026-08-11T01:00:00.000Z",
    ...overrides,
  };
}

function repositoryFor(records: InquiryNotificationRecord[]) {
  const operations: Array<Record<string, unknown>> = [];
  const repository: NotificationRepository = {
    async findDue(_now, limit) {
      return records.slice(0, limit);
    },
    async markProcessing(id, attempt, at) {
      operations.push({ operation: "processing", id, attempt, at: at.toISOString() });
    },
    async markSent(id, at) {
      operations.push({ operation: "sent", id, at: at.toISOString() });
    },
    async markFailed(id, code, nextAttemptAt) {
      operations.push({
        operation: "failed",
        id,
        code,
        nextAttemptAt: nextAttemptAt?.toISOString() ?? null,
      });
    },
  };
  return { repository, operations };
}

test("notification environment fails closed unless all site recipients exist", () => {
  assert.throws(
    () =>
      assertInquiryNotificationEnvironment({
        ...enabledEnvironment,
        MAIL_RECIPIENT_HORSESPORT: "",
      }),
    /MAIL_RECIPIENT_HORSESPORT/,
  );
  assert.doesNotThrow(() => assertInquiryNotificationEnvironment(enabledEnvironment));
});

test("recipient configuration is normalized, deduplicated, and rejects injection", () => {
  assert.deepEqual(
    recipientsForSite("gateway", {
      MAIL_RECIPIENT_GATEWAY:
        "OPS@sarga.co, ops@sarga.co, second@sarga.co",
    }),
    ["ops@sarga.co", "second@sarga.co"],
  );
  assert.throws(
    () =>
      recipientsForSite("gateway", {
        MAIL_RECIPIENT_GATEWAY: "ops@sarga.co\r\nBcc: attacker@example.com",
      }),
    /invalid mailbox/,
  );
});

test("bilingual template escapes visitor content and uses a stable message id", () => {
  const mail = buildInquiryNotification(
    inquiry({ sourceLocale: "id" }),
    ["gateway-ops@sarga.co"],
    enabledEnvironment.MAIL_SMTP_USER,
  );
  assert.match(mail.subject, /Pertanyaan/);
  assert.match(mail.text, /Nama:/);
  assert.match(mail.html, /Visitor &lt;script&gt;/);
  assert.doesNotMatch(mail.html, /Visitor <script>/);
  assert.equal(mail.replyTo, "visitor@example.com");
  assert.equal(mail.messageId, "<sarga-inquiry-abc-42@sargamotorsport.co>");
});

test("successful batch persists processing then sent and routes by source site", async () => {
  const { repository, operations } = repositoryFor([
    inquiry({ sourceSite: "motorsport" }),
  ]);
  const deliveries: unknown[] = [];
  const result = await runInquiryNotificationBatch({
    repository,
    mailer: { async send(mail) { deliveries.push(mail); } },
    env: enabledEnvironment,
    now: new Date("2026-08-11T02:00:00.000Z"),
  });

  assert.deepEqual(result, { selected: 1, sent: 1, failed: 0, deferred: 0 });
  assert.deepEqual(
    operations.map((operation) => operation.operation),
    ["processing", "sent"],
  );
  assert.deepEqual((deliveries[0] as { to: string[] }).to, [
    "motorsport-ops@sarga.co",
  ]);
});

test("temporary failure records a safe code and schedules bounded retry", async () => {
  const { repository, operations } = repositoryFor([inquiry()]);
  const result = await runInquiryNotificationBatch({
    repository,
    mailer: {
      async send() {
        throw Object.assign(new Error("connection timed out with visitor data"), {
          code: "ETIMEDOUT",
        });
      },
    },
    env: enabledEnvironment,
    now: new Date("2026-08-11T02:00:00.000Z"),
  });

  assert.deepEqual(result, { selected: 1, sent: 0, failed: 1, deferred: 1 });
  const failure = operations.at(-1);
  assert.equal(failure?.code, "smtp_timeout");
  assert.equal(failure?.nextAttemptAt, "2026-08-11T02:01:00.000Z");
  assert.doesNotMatch(JSON.stringify(failure), /visitor data/);
});

test("final failure stops retrying at the configured attempt limit", async () => {
  const { repository, operations } = repositoryFor([
    inquiry({ notificationAttempts: 4 }),
  ]);
  const result = await runInquiryNotificationBatch({
    repository,
    mailer: {
      async send() {
        throw Object.assign(new Error("auth failed"), { responseCode: 535 });
      },
    },
    env: { ...enabledEnvironment, MAIL_MAX_ATTEMPTS: "5" },
  });

  assert.equal(result.deferred, 0);
  assert.equal(operations.at(-1)?.code, "smtp_auth");
  assert.equal(operations.at(-1)?.nextAttemptAt, null);
});

test("already exhausted records are ignored", async () => {
  const { repository, operations } = repositoryFor([
    inquiry({ notificationAttempts: 5, notificationStatus: "failed" }),
  ]);
  let sent = false;
  const result = await runInquiryNotificationBatch({
    repository,
    mailer: { async send() { sent = true; } },
    env: { ...enabledEnvironment, MAIL_MAX_ATTEMPTS: "5" },
  });
  assert.deepEqual(result, { selected: 0, sent: 0, failed: 0, deferred: 0 });
  assert.equal(sent, false);
  assert.deepEqual(operations, []);
});

test("disabled workflow does not query or send", async () => {
  let queried = false;
  let sent = false;
  const result = await runInquiryNotificationBatch({
    repository: {
      async findDue() { queried = true; return []; },
      async markProcessing() {},
      async markSent() {},
      async markFailed() {},
    },
    mailer: { async send() { sent = true; } },
    env: { MAIL_ENABLED: "false", MAIL_NOTIFICATIONS_ENABLED: "false" },
  });
  assert.deepEqual(result, { selected: 0, sent: 0, failed: 0, deferred: 0 });
  assert.equal(queried, false);
  assert.equal(sent, false);
});

test("visitor email header injection is rejected before sending", () => {
  assert.throws(
    () =>
      buildInquiryNotification(
        inquiry({ email: "visitor@example.com\r\nBcc: attacker@example.com" }),
        ["gateway-ops@sarga.co"],
        enabledEnvironment.MAIL_SMTP_USER,
      ),
    /invalid mailbox/,
  );
});
