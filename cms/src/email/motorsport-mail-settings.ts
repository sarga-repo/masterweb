import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";
import type { Core } from "@strapi/strapi";

const STORE = { type: "plugin" as const, name: "sarga-mail" };
const STORE_KEY = "motorsport";
const SMTP_SCOPE = "https://outlook.office365.com/.default";
const MAILBOX = /^[^\s@\r\n]+@[^\s@\r\n]+\.[^\s@\r\n]+$/;

type StoredSettings = {
  enabled?: boolean;
  notificationsEnabled?: boolean;
  smtpUser?: string;
  fromAddress?: string;
  fromName?: string;
  defaultReplyTo?: string;
  recipient?: string;
  tenantId?: string;
  clientId?: string;
  clientSecret?: string;
};

export type MotorsportMailSettings = {
  enabled: boolean;
  notificationsEnabled: boolean;
  smtpUser: string;
  fromAddress: string;
  fromName: string;
  defaultReplyTo: string;
  recipient: string;
  tenantId: string;
  clientId: string;
  clientSecretConfigured: boolean;
  host: "smtp.office365.com";
  port: 587;
  requireTls: true;
  scope: typeof SMTP_SCOPE;
};

type MailSettingsStore = {
  get: (params: { key: string }) => Promise<unknown>;
  set: (params: { key: string; value: unknown }) => Promise<void>;
};

export type MailEnvironment = Record<string, string | undefined>;

function storeFor(strapi: Core.Strapi) {
  return strapi.store(STORE) as unknown as MailSettingsStore;
}

async function readStoredSettings(strapi: Core.Strapi): Promise<StoredSettings> {
  const value = await storeFor(strapi).get({ key: STORE_KEY });
  return value && typeof value === "object" ? (value as StoredSettings) : {};
}

function encryptionKey() {
  const value = process.env.ENCRYPTION_KEY?.trim();
  if (!value) {
    throw new Error("[Sarga Mail] ENCRYPTION_KEY is required to store the OAuth secret.");
  }
  return createHash("sha256").update(value).digest();
}

function encryptSecret(secret: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(secret, "utf8"), cipher.final()]);
  return [
    "v1",
    iv.toString("base64url"),
    cipher.getAuthTag().toString("base64url"),
    encrypted.toString("base64url"),
  ].join(":");
}

function decryptSecret(value: string) {
  const [version, ivValue, tagValue, encryptedValue] = value.split(":");
  if (version !== "v1" || !ivValue || !tagValue || !encryptedValue) {
    throw new Error("[Sarga Mail] Stored OAuth secret has an invalid format.");
  }
  const decipher = createDecipheriv(
    "aes-256-gcm",
    encryptionKey(),
    Buffer.from(ivValue, "base64url"),
  );
  decipher.setAuthTag(Buffer.from(tagValue, "base64url"));
  return Buffer.concat([
    decipher.update(Buffer.from(encryptedValue, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function envBoolean(value: string | undefined, fallback = false) {
  if (!value) return fallback;
  return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
}

function settingBoolean(value: boolean | undefined, fallback: string | undefined) {
  return value === undefined ? envBoolean(fallback) : value;
}

function settingString(value: string | undefined, fallback: string | undefined) {
  return value?.trim() || fallback?.trim() || "";
}

function assertOptionalMailbox(value: string, label: string) {
  if (value && !MAILBOX.test(value)) {
    throw new Error(`[Sarga Mail] ${label} contains an invalid mailbox address.`);
  }
}

export async function resolveMotorsportMailEnvironment(
  strapi: Core.Strapi,
  env: MailEnvironment = process.env,
): Promise<MailEnvironment> {
  const stored = await readStoredSettings(strapi);
  const clientSecret = stored.clientSecret
    ? decryptSecret(stored.clientSecret)
    : env.MICROSOFT_CLIENT_SECRET;

  return {
    ...env,
    MAIL_ENABLED: String(settingBoolean(stored.enabled, env.MAIL_ENABLED)),
    MAIL_NOTIFICATIONS_ENABLED: String(
      settingBoolean(stored.notificationsEnabled, env.MAIL_NOTIFICATIONS_ENABLED),
    ),
    MAIL_AUTH_MODE: "oauth",
    MAIL_SMTP_USER: settingString(stored.smtpUser, env.MAIL_SMTP_USER),
    MAIL_FROM_ADDRESS: settingString(stored.fromAddress, env.MAIL_FROM_ADDRESS),
    MAIL_FROM_NAME: settingString(stored.fromName, env.MAIL_FROM_NAME),
    MAIL_DEFAULT_REPLY_TO: settingString(
      stored.defaultReplyTo,
      env.MAIL_DEFAULT_REPLY_TO,
    ),
    MAIL_RECIPIENT_MOTORSPORT: settingString(
      stored.recipient,
      env.MAIL_RECIPIENT_MOTORSPORT,
    ),
    MICROSOFT_TENANT_ID: settingString(stored.tenantId, env.MICROSOFT_TENANT_ID),
    MICROSOFT_CLIENT_ID: settingString(stored.clientId, env.MICROSOFT_CLIENT_ID),
    MICROSOFT_CLIENT_SECRET: clientSecret,
    MICROSOFT_SMTP_SCOPE: SMTP_SCOPE,
    MAIL_SMTP_HOST: "smtp.office365.com",
    MAIL_SMTP_PORT: "587",
    MAIL_SMTP_REQUIRE_TLS: "true",
  };
}

export async function getMotorsportMailSettings(
  strapi: Core.Strapi,
  env: MailEnvironment = process.env,
): Promise<MotorsportMailSettings> {
  const stored = await readStoredSettings(strapi);
  const effective = await resolveMotorsportMailEnvironment(strapi, env);
  return {
    enabled: envBoolean(effective.MAIL_ENABLED),
    notificationsEnabled: envBoolean(effective.MAIL_NOTIFICATIONS_ENABLED),
    smtpUser: effective.MAIL_SMTP_USER ?? "",
    fromAddress: effective.MAIL_FROM_ADDRESS ?? "",
    fromName: effective.MAIL_FROM_NAME ?? "Sarga",
    defaultReplyTo: effective.MAIL_DEFAULT_REPLY_TO ?? "",
    recipient: effective.MAIL_RECIPIENT_MOTORSPORT ?? "",
    tenantId: effective.MICROSOFT_TENANT_ID ?? "",
    clientId: effective.MICROSOFT_CLIENT_ID ?? "",
    clientSecretConfigured: Boolean(
      stored.clientSecret || effective.MICROSOFT_CLIENT_SECRET,
    ),
    host: "smtp.office365.com",
    port: 587,
    requireTls: true,
    scope: SMTP_SCOPE,
  };
}

export async function updateMotorsportMailSettings(
  strapi: Core.Strapi,
  input: Record<string, unknown>,
) {
  const current = await readStoredSettings(strapi);
  const next: StoredSettings = { ...current };

  for (const [inputKey, storedKey] of [
    ["smtpUser", "smtpUser"],
    ["fromAddress", "fromAddress"],
    ["fromName", "fromName"],
    ["defaultReplyTo", "defaultReplyTo"],
    ["recipient", "recipient"],
    ["tenantId", "tenantId"],
    ["clientId", "clientId"],
  ] as const) {
    const value = stringValue(input[inputKey]);
    if (value) next[storedKey] = value;
    else delete next[storedKey];
  }

  if (typeof input.enabled === "boolean") next.enabled = input.enabled;
  if (typeof input.notificationsEnabled === "boolean") {
    next.notificationsEnabled = input.notificationsEnabled;
  }

  const clientSecret = stringValue(input.clientSecret);
  if (clientSecret) next.clientSecret = encryptSecret(clientSecret);
  if (input.clearClientSecret === true) delete next.clientSecret;

  assertOptionalMailbox(next.smtpUser ?? "", "smtpUser");
  assertOptionalMailbox(next.fromAddress ?? "", "fromAddress");
  assertOptionalMailbox(next.defaultReplyTo ?? "", "defaultReplyTo");
  assertOptionalMailbox(next.recipient ?? "", "recipient");

  await storeFor(strapi).set({ key: STORE_KEY, value: next });
  return getMotorsportMailSettings(strapi);
}
