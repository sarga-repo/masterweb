export type MicrosoftSmtpOAuthOptions = {
  tenantId: string;
  clientId: string;
  clientSecret: string;
  scope: string;
  smtpUser: string;
  refreshSkewMs?: number;
  requestTimeoutMs?: number;
  fetchImpl?: typeof fetch;
  now?: () => number;
};

export type MicrosoftAccessToken = {
  accessToken: string;
  expiresAt: number;
};

type OAuthTokenResponse = {
  access_token?: unknown;
  expires_in?: unknown;
  error?: unknown;
};

const DEFAULT_REFRESH_SKEW_MS = 5 * 60 * 1_000;
const DEFAULT_REQUEST_TIMEOUT_MS = 10_000;

function assertNonEmpty(name: string, value: string) {
  if (!value.trim()) {
    throw new Error(`[Sarga Mail] ${name} is required.`);
  }
}

function safeOAuthError(status: number, payload: OAuthTokenResponse) {
  const code =
    typeof payload.error === "string" && /^[a-zA-Z0-9_.-]+$/.test(payload.error)
      ? `, ${payload.error}`
      : "";
  return new Error(
    `[Sarga Mail] Microsoft OAuth token request failed (HTTP ${status}${code}).`,
  );
}

export function createMicrosoftSmtpTokenProvider(
  options: MicrosoftSmtpOAuthOptions,
) {
  assertNonEmpty("MICROSOFT_TENANT_ID", options.tenantId);
  assertNonEmpty("MICROSOFT_CLIENT_ID", options.clientId);
  assertNonEmpty("MICROSOFT_CLIENT_SECRET", options.clientSecret);
  assertNonEmpty("MICROSOFT_SMTP_SCOPE", options.scope);
  assertNonEmpty("MAIL_SMTP_USER", options.smtpUser);

  const fetchImpl = options.fetchImpl ?? fetch;
  const now = options.now ?? Date.now;
  const refreshSkewMs = options.refreshSkewMs ?? DEFAULT_REFRESH_SKEW_MS;
  const requestTimeoutMs =
    options.requestTimeoutMs ?? DEFAULT_REQUEST_TIMEOUT_MS;
  const tokenUrl = `https://login.microsoftonline.com/${encodeURIComponent(
    options.tenantId,
  )}/oauth2/v2.0/token`;

  let cachedToken: MicrosoftAccessToken | null = null;
  let pendingRequest: Promise<MicrosoftAccessToken> | null = null;

  const fetchToken = async (): Promise<MicrosoftAccessToken> => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);
    const body = new URLSearchParams({
      client_id: options.clientId,
      client_secret: options.clientSecret,
      grant_type: "client_credentials",
      scope: options.scope,
    });

    try {
      const response = await fetchImpl(tokenUrl, {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body,
        signal: controller.signal,
      });
      const payload = (await response.json().catch(() => ({}))) as OAuthTokenResponse;

      if (!response.ok) {
        throw safeOAuthError(response.status, payload);
      }

      if (
        typeof payload.access_token !== "string" ||
        !payload.access_token ||
        typeof payload.expires_in !== "number" ||
        !Number.isFinite(payload.expires_in) ||
        payload.expires_in <= 0
      ) {
        throw new Error(
          "[Sarga Mail] Microsoft OAuth response did not contain a valid access token and expiry.",
        );
      }

      return {
        accessToken: payload.access_token,
        expiresAt: now() + payload.expires_in * 1_000,
      };
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("[Sarga Mail] Microsoft OAuth token request timed out.");
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  };

  const getAccessToken = async (forceRefresh = false) => {
    if (
      !forceRefresh &&
      cachedToken &&
      cachedToken.expiresAt - refreshSkewMs > now()
    ) {
      return cachedToken;
    }

    if (!forceRefresh && pendingRequest) {
      return pendingRequest;
    }

    pendingRequest = fetchToken()
      .then((token) => {
        cachedToken = token;
        return token;
      })
      .finally(() => {
        pendingRequest = null;
      });

    return pendingRequest;
  };

  const provisionCallback = (
    user: string,
    renew: boolean,
    callback: (error: Error | null, accessToken?: string, expires?: number) => void,
  ) => {
    if (user.toLowerCase() !== options.smtpUser.toLowerCase()) {
      callback(
        new Error(
          "[Sarga Mail] OAuth token requested for an unauthorized SMTP user.",
        ),
      );
      return;
    }

    getAccessToken(renew)
      .then((token) => callback(null, token.accessToken, token.expiresAt))
      .catch((error) =>
        callback(
          error instanceof Error
            ? error
            : new Error("[Sarga Mail] Microsoft OAuth token request failed."),
        ),
      );
  };

  return { getAccessToken, provisionCallback };
}

export type MailEnvironment = Record<string, string | undefined>;

const MICROSOFT_SMTP_HOST = "smtp.office365.com";
const MICROSOFT_SMTP_PORT = 587;
const MICROSOFT_SMTP_SCOPE = "https://outlook.office365.com/.default";
const BASIC_AUTH_ACKNOWLEDGEMENT = "I_ACCEPT_TEMPORARY_BASIC_AUTH_RISK";
const BASIC_AUTH_HARD_CUTOFF = new Date("2026-12-15T23:59:59.999Z");

export type MailAuthMode = "oauth" | "basic";

function enabled(value?: string) {
  return ["1", "true", "yes", "on"].includes(value?.trim().toLowerCase() ?? "");
}

function required(env: MailEnvironment, name: string) {
  const value = env[name]?.trim();
  if (!value) throw new Error(`[Sarga Mail] ${name} is required when MAIL_ENABLED=true.`);
  return value;
}

function requiredSecret(env: MailEnvironment, name: string) {
  const value = env[name];
  if (!value?.trim()) {
    throw new Error(`[Sarga Mail] ${name} is required when MAIL_AUTH_MODE=basic.`);
  }
  return value;
}

export function mailAuthMode(env: MailEnvironment = process.env): MailAuthMode {
  const mode = (env.MAIL_AUTH_MODE?.trim().toLowerCase() || "oauth") as MailAuthMode;
  if (mode !== "oauth" && mode !== "basic") {
    throw new Error("[Sarga Mail] MAIL_AUTH_MODE must be oauth or basic.");
  }
  return mode;
}

export function assertMailAuthenticationWindow(
  env: MailEnvironment = process.env,
  now = new Date(),
) {
  if (!enabled(env.MAIL_ENABLED) || mailAuthMode(env) !== "basic") return;
  if (env.MAIL_BASIC_AUTH_ACKNOWLEDGED !== BASIC_AUTH_ACKNOWLEDGEMENT) {
    throw new Error(
      `[Sarga Mail] Set MAIL_BASIC_AUTH_ACKNOWLEDGED=${BASIC_AUTH_ACKNOWLEDGEMENT} to enable the temporary fallback.`,
    );
  }
  requiredSecret(env, "MAIL_SMTP_PASSWORD");
  const expiresAtValue = required(env, "MAIL_BASIC_AUTH_EXPIRES_AT");
  const expiresAtMs = Date.parse(expiresAtValue);
  if (!Number.isFinite(expiresAtMs)) {
    throw new Error("[Sarga Mail] MAIL_BASIC_AUTH_EXPIRES_AT must be an ISO-8601 timestamp.");
  }
  if (expiresAtMs <= now.getTime()) {
    throw new Error("[Sarga Mail] Temporary Basic SMTP authentication has expired.");
  }
  if (expiresAtMs > BASIC_AUTH_HARD_CUTOFF.getTime()) {
    throw new Error(
      `[Sarga Mail] MAIL_BASIC_AUTH_EXPIRES_AT cannot exceed ${BASIC_AUTH_HARD_CUTOFF.toISOString()}.`,
    );
  }
}

function assertMailbox(value: string, name: string) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    throw new Error(`[Sarga Mail] ${name} must be a single valid mailbox address.`);
  }
}

function safeDisplayName(value: string) {
  if (/\r|\n/.test(value)) {
    throw new Error("[Sarga Mail] MAIL_FROM_NAME cannot contain line breaks.");
  }
  return value.replace(/["\\]/g, "").trim();
}

export function createMicrosoftEmailPluginConfig(
  env: MailEnvironment = process.env,
  now = new Date(),
) {
  if (!enabled(env.MAIL_ENABLED)) return {};

  const authMode = mailAuthMode(env);
  const smtpUser = required(env, "MAIL_SMTP_USER").toLowerCase();
  const fromAddress = (env.MAIL_FROM_ADDRESS?.trim() || smtpUser).toLowerCase();
  const replyTo = (env.MAIL_DEFAULT_REPLY_TO?.trim() || smtpUser).toLowerCase();
  const host = env.MAIL_SMTP_HOST?.trim() || MICROSOFT_SMTP_HOST;
  const port = Number(env.MAIL_SMTP_PORT || MICROSOFT_SMTP_PORT);

  assertMailbox(smtpUser, "MAIL_SMTP_USER");
  assertMailbox(fromAddress, "MAIL_FROM_ADDRESS");
  assertMailbox(replyTo, "MAIL_DEFAULT_REPLY_TO");

  if (host !== MICROSOFT_SMTP_HOST || port !== MICROSOFT_SMTP_PORT) {
    throw new Error(
      `[Sarga Mail] Exchange Online SMTP must use ${MICROSOFT_SMTP_HOST}:${MICROSOFT_SMTP_PORT}.`,
    );
  }
  if (fromAddress !== smtpUser) {
    throw new Error(
      "[Sarga Mail] MAIL_FROM_ADDRESS must match MAIL_SMTP_USER unless a separately reviewed SendAs scope is implemented.",
    );
  }
  if (env.MAIL_SMTP_REQUIRE_TLS && !enabled(env.MAIL_SMTP_REQUIRE_TLS)) {
    throw new Error("[Sarga Mail] MAIL_SMTP_REQUIRE_TLS cannot be disabled.");
  }

  let authMethod: "XOAUTH2" | "LOGIN";
  let auth: Record<string, unknown>;
  if (authMode === "basic") {
    assertMailAuthenticationWindow(env, now);
    authMethod = "LOGIN";
    auth = {
      user: smtpUser,
      pass: requiredSecret(env, "MAIL_SMTP_PASSWORD"),
    };
  } else {
    const tenantId = required(env, "MICROSOFT_TENANT_ID");
    const clientId = required(env, "MICROSOFT_CLIENT_ID");
    const clientSecret = required(env, "MICROSOFT_CLIENT_SECRET");
    const scope = env.MICROSOFT_SMTP_SCOPE?.trim() || MICROSOFT_SMTP_SCOPE;
    if (scope !== MICROSOFT_SMTP_SCOPE) {
      throw new Error(
        `[Sarga Mail] MICROSOFT_SMTP_SCOPE must be ${MICROSOFT_SMTP_SCOPE}.`,
      );
    }
    const tokenProvider = createMicrosoftSmtpTokenProvider({
      tenantId,
      clientId,
      clientSecret,
      scope,
      smtpUser,
    });
    authMethod = "XOAUTH2";
    auth = {
      type: "OAuth2",
      user: smtpUser,
      provisionCallback: tokenProvider.provisionCallback,
    };
  }
  const fromName = safeDisplayName(env.MAIL_FROM_NAME || "Sarga");

  return {
    email: {
      config: {
        provider: "nodemailer",
        providerOptions: {
          host,
          port,
          secure: false,
          requireTLS: true,
          authMethod,
          auth,
          tls: {
            minVersion: "TLSv1.2",
            rejectUnauthorized: true,
            servername: host,
          },
          connectionTimeout: 10_000,
          greetingTimeout: 10_000,
          socketTimeout: 20_000,
          logger: false,
          debug: false,
          disableFileAccess: true,
          disableUrlAccess: true,
        },
        settings: {
          defaultFrom: fromName ? `${fromName} <${fromAddress}>` : fromAddress,
          defaultReplyTo: replyTo,
          testAddress: replyTo,
        },
      },
    },
  };
}

export function redactMailError(error: unknown, env: MailEnvironment = process.env) {
  let message = error instanceof Error ? error.message : String(error);
  for (const secret of [
    env.MICROSOFT_CLIENT_SECRET,
    env.MICROSOFT_CLIENT_ID,
    env.MAIL_SMTP_PASSWORD,
  ]) {
    if (secret) message = message.split(secret).join("[REDACTED]");
  }
  return message;
}
