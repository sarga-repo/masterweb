export type InquirySourceSite = "gateway" | "motorsport" | "horsesport";
export type InquiryLocale = "en" | "id";
export type NotificationStatus =
  | "disabled"
  | "pending"
  | "processing"
  | "sent"
  | "failed";

export type NotificationEnvironment = Record<string, string | undefined>;

export type InquiryNotificationRecord = {
  id: number;
  documentId?: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  inquiryType: string;
  message: string;
  sourcePage?: string | null;
  sourceSite: InquirySourceSite;
  sourceLocale: InquiryLocale;
  submittedAt?: string | null;
  notificationStatus: NotificationStatus;
  notificationAttempts: number;
  notificationNextAttemptAt?: string | null;
  notificationLastAttemptAt?: string | null;
};

export type NotificationMail = {
  to: string[];
  replyTo: string;
  subject: string;
  text: string;
  html: string;
  messageId: string;
};

export type NotificationRepository = {
  findDue(now: Date, limit: number): Promise<InquiryNotificationRecord[]>;
  markProcessing(id: number, attempt: number, at: Date): Promise<void>;
  markSent(id: number, at: Date): Promise<void>;
  markFailed(
    id: number,
    code: string,
    nextAttemptAt: Date | null,
  ): Promise<void>;
};

export type NotificationMailer = {
  send(mail: NotificationMail): Promise<void>;
};

export type NotificationBatchResult = {
  selected: number;
  sent: number;
  failed: number;
  deferred: number;
};

const SITE_LABELS: Record<InquirySourceSite, string> = {
  gateway: "Sarga.co",
  motorsport: "Sarga Motorsport",
  horsesport: "Sarga Horse Sport",
};

const RECIPIENT_KEYS: Record<InquirySourceSite, string> = {
  gateway: "MAIL_RECIPIENT_GATEWAY",
  motorsport: "MAIL_RECIPIENT_MOTORSPORT",
  horsesport: "MAIL_RECIPIENT_HORSESPORT",
};

const UAT_CONFIRMATION = "I_APPROVE_STAGING_TEST_SEND";
const DEFAULT_RETRY_DELAYS_MS = [60_000, 5 * 60_000, 30 * 60_000, 2 * 60 * 60_000];
const HEADER_EMAIL = /^[^\s@\r\n]+@[^\s@\r\n]+\.[^\s@\r\n]+$/;

function enabled(value?: string) {
  return ["1", "true", "yes", "on"].includes(value?.trim().toLowerCase() ?? "");
}

function boundedInteger(value: string | undefined, fallback: number, min: number, max: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= min && parsed <= max
    ? parsed
    : fallback;
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\r\n|\r|\n/g, "<br />");
}

function textValue(value: unknown, fallback = "—") {
  const normalized = String(value ?? "").replace(/\r\n|\r/g, "\n").trim();
  return normalized || fallback;
}

function assertHeaderEmail(value: string, label: string) {
  if (!HEADER_EMAIL.test(value)) {
    throw new Error(`[Sarga Mail] ${label} contains an invalid mailbox address.`);
  }
}

export function shouldQueueInquiryNotification(
  env: NotificationEnvironment = process.env,
) {
  return enabled(env.MAIL_ENABLED) && enabled(env.MAIL_NOTIFICATIONS_ENABLED);
}

export function recipientsForSite(
  site: InquirySourceSite,
  env: NotificationEnvironment = process.env,
) {
  const recipients = (env[RECIPIENT_KEYS[site]] ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  const unique = [...new Set(recipients)];
  for (const recipient of unique) assertHeaderEmail(recipient, RECIPIENT_KEYS[site]);
  return unique;
}

export function validateMailUatEnvironment(
  env: NotificationEnvironment = process.env,
) {
  if (env.MAIL_UAT_ENVIRONMENT?.trim().toLowerCase() !== "staging") {
    throw new Error(
      "[Sarga Mail] MAIL_UAT_ENVIRONMENT must be staging; this command refuses production.",
    );
  }
  if (env.MAIL_UAT_ALLOW_SEND !== UAT_CONFIRMATION) {
    throw new Error(
      `[Sarga Mail] Set MAIL_UAT_ALLOW_SEND=${UAT_CONFIRMATION} for a controlled staging test.`,
    );
  }
  const recipient = env.MAIL_UAT_RECIPIENT?.trim().toLowerCase() ?? "";
  assertHeaderEmail(recipient, "MAIL_UAT_RECIPIENT");
  const approved = ([
    "gateway",
    "motorsport",
    "horsesport",
  ] as InquirySourceSite[]).flatMap((site) => recipientsForSite(site, env));
  if (!approved.includes(recipient)) {
    throw new Error(
      "[Sarga Mail] MAIL_UAT_RECIPIENT must already exist in a site recipient allowlist.",
    );
  }
  return { recipient };
}

export function maskMailbox(mailbox: string) {
  const [local, domain] = mailbox.split("@");
  return `${local.slice(0, 2)}***@${domain}`;
}

export function assertInquiryNotificationEnvironment(
  env: NotificationEnvironment = process.env,
) {
  if (!enabled(env.MAIL_NOTIFICATIONS_ENABLED)) return;
  if (!enabled(env.MAIL_ENABLED)) {
    throw new Error(
      "[Sarga Mail] MAIL_ENABLED must be true when MAIL_NOTIFICATIONS_ENABLED=true.",
    );
  }
  for (const site of Object.keys(RECIPIENT_KEYS) as InquirySourceSite[]) {
    if (recipientsForSite(site, env).length === 0) {
      throw new Error(
        `[Sarga Mail] ${RECIPIENT_KEYS[site]} requires at least one approved recipient.`,
      );
    }
  }
}

export function notificationRuntimeConfig(
  env: NotificationEnvironment = process.env,
) {
  return {
    enabled: shouldQueueInquiryNotification(env),
    maxAttempts: boundedInteger(env.MAIL_MAX_ATTEMPTS, 5, 1, 10),
    batchSize: boundedInteger(env.MAIL_WORKER_BATCH_SIZE, 10, 1, 50),
    recipients: {
      gateway: recipientsForSite("gateway", env),
      motorsport: recipientsForSite("motorsport", env),
      horsesport: recipientsForSite("horsesport", env),
    },
    smtpUser: (env.MAIL_SMTP_USER ?? "").trim().toLowerCase(),
  };
}

export function buildInquiryNotification(
  inquiry: InquiryNotificationRecord,
  recipients: string[],
  smtpUser: string,
): NotificationMail {
  if (!recipients.length) {
    throw new Error("[Sarga Mail] No approved notification recipient is configured.");
  }
  assertHeaderEmail(inquiry.email, "Inquiry email");
  assertHeaderEmail(smtpUser, "MAIL_SMTP_USER");
  const siteLabel = SITE_LABELS[inquiry.sourceSite];
  if (!siteLabel) throw new Error("[Sarga Mail] Inquiry source site is invalid.");

  const isIndonesian = inquiry.sourceLocale === "id";
  const subject = isIndonesian
    ? `[${siteLabel}] Pertanyaan ${inquiry.inquiryType} baru`
    : `[${siteLabel}] New ${inquiry.inquiryType} inquiry`;
  const labels = isIndonesian
    ? {
        intro: "Pertanyaan baru telah diterima dan tersimpan di CMS.",
        name: "Nama",
        email: "Email",
        phone: "Telepon",
        company: "Perusahaan",
        type: "Jenis",
        page: "Halaman sumber",
        submitted: "Waktu diterima",
        message: "Pesan",
      }
    : {
        intro: "A new inquiry has been received and stored in the CMS.",
        name: "Name",
        email: "Email",
        phone: "Phone",
        company: "Company",
        type: "Type",
        page: "Source page",
        submitted: "Submitted at",
        message: "Message",
      };
  const rows = [
    [labels.name, textValue(inquiry.name)],
    [labels.email, inquiry.email],
    [labels.phone, textValue(inquiry.phone)],
    [labels.company, textValue(inquiry.company)],
    [labels.type, textValue(inquiry.inquiryType)],
    [labels.page, textValue(inquiry.sourcePage)],
    [labels.submitted, textValue(inquiry.submittedAt)],
  ];
  const text = [
    labels.intro,
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    `${labels.message}:`,
    textValue(inquiry.message),
  ].join("\n");
  const htmlRows = rows
    .map(
      ([label, value]) =>
        `<tr><th align="left" style="padding:6px 12px 6px 0">${escapeHtml(label)}</th><td style="padding:6px 0">${escapeHtml(value)}</td></tr>`,
    )
    .join("");
  const domain = smtpUser.split("@")[1];
  const stableId = String(inquiry.documentId || inquiry.id).replace(/[^a-zA-Z0-9_.-]/g, "-");

  return {
    to: recipients,
    replyTo: inquiry.email,
    subject,
    text,
    html: `<p>${escapeHtml(labels.intro)}</p><table>${htmlRows}</table><h2>${escapeHtml(labels.message)}</h2><p>${escapeHtml(inquiry.message)}</p>`,
    messageId: `<sarga-inquiry-${stableId}@${domain}>`,
  };
}

export function classifyNotificationError(error: unknown) {
  const candidate = error as { code?: unknown; responseCode?: unknown; message?: unknown };
  const code = String(candidate?.code ?? "").toUpperCase();
  const responseCode = Number(candidate?.responseCode ?? 0);
  const message = String(candidate?.message ?? "").toLowerCase();
  if (code.includes("AUTH") || responseCode === 535) return "smtp_auth";
  if (code.includes("TLS") || message.includes("certificate")) return "smtp_tls";
  if (responseCode === 429 || responseCode === 421 || responseCode === 451) {
    return "smtp_rate_limited";
  }
  if (responseCode >= 500 && responseCode < 600) return "smtp_rejected";
  if (code.includes("TIMEOUT") || message.includes("timed out")) return "smtp_timeout";
  if (message.includes("recipient") || message.includes("mailbox address")) {
    return "configuration_invalid";
  }
  return "smtp_unknown";
}

export async function runInquiryNotificationBatch({
  repository,
  mailer,
  env = process.env,
  now = new Date(),
}: {
  repository: NotificationRepository;
  mailer: NotificationMailer;
  env?: NotificationEnvironment;
  now?: Date;
}): Promise<NotificationBatchResult> {
  const config = notificationRuntimeConfig(env);
  const result: NotificationBatchResult = { selected: 0, sent: 0, failed: 0, deferred: 0 };
  if (!config.enabled) return result;

  const inquiries = (await repository.findDue(now, config.batchSize)).filter(
    (inquiry) => (inquiry.notificationAttempts || 0) < config.maxAttempts,
  );
  result.selected = inquiries.length;

  for (const inquiry of inquiries) {
    const attempt = (inquiry.notificationAttempts || 0) + 1;
    await repository.markProcessing(inquiry.id, attempt, now);
    try {
      const mail = buildInquiryNotification(
        inquiry,
        config.recipients[inquiry.sourceSite],
        config.smtpUser,
      );
      await mailer.send(mail);
      await repository.markSent(inquiry.id, now);
      result.sent += 1;
    } catch (error) {
      const canRetry = attempt < config.maxAttempts;
      const delay = DEFAULT_RETRY_DELAYS_MS[
        Math.min(attempt - 1, DEFAULT_RETRY_DELAYS_MS.length - 1)
      ];
      await repository.markFailed(
        inquiry.id,
        classifyNotificationError(error),
        canRetry ? new Date(now.getTime() + delay) : null,
      );
      result.failed += 1;
      if (canRetry) result.deferred += 1;
    }
  }

  return result;
}
