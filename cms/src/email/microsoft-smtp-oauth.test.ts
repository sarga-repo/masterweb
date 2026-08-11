import assert from "node:assert/strict";
import test from "node:test";

import {
  assertMailAuthenticationWindow,
  createMicrosoftEmailPluginConfig,
  createMicrosoftSmtpTokenProvider,
  redactMailError,
} from "./microsoft-smtp-config.ts";

const baseOptions = {
  tenantId: "11111111-1111-1111-1111-111111111111",
  clientId: "22222222-2222-2222-2222-222222222222",
  clientSecret: "do-not-log-this-secret",
  scope: "https://outlook.office365.com/.default",
  smtpUser: "noreply@sargamotorsport.co",
};

function tokenResponse(token: string, expiresIn = 3_600) {
  return new Response(
    JSON.stringify({ access_token: token, expires_in: expiresIn }),
    { status: 200, headers: { "content-type": "application/json" } },
  );
}

test("Microsoft OAuth tokens are cached until Nodemailer requests renewal", async () => {
  let calls = 0;
  let now = 1_000_000;
  const bodies: URLSearchParams[] = [];
  const provider = createMicrosoftSmtpTokenProvider({
    ...baseOptions,
    now: () => now,
    fetchImpl: async (_url, init) => {
      calls += 1;
      bodies.push(init?.body as URLSearchParams);
      return tokenResponse(`token-${calls}`);
    },
  });

  const first = await provider.getAccessToken();
  const cached = await provider.getAccessToken();
  assert.equal(first.accessToken, "token-1");
  assert.equal(cached.accessToken, "token-1");
  assert.equal(calls, 1);
  assert.equal(bodies[0].get("grant_type"), "client_credentials");
  assert.equal(bodies[0].get("scope"), baseOptions.scope);
  assert.equal(bodies[0].get("client_secret"), baseOptions.clientSecret);

  now += 10_000;
  const renewed = await provider.getAccessToken(true);
  assert.equal(renewed.accessToken, "token-2");
  assert.equal(calls, 2);
});

test("Nodemailer provision callback rejects an unapproved sender", async () => {
  const provider = createMicrosoftSmtpTokenProvider({
    ...baseOptions,
    fetchImpl: async () => tokenResponse("unused"),
  });

  const error = await new Promise<Error | null>((resolve) => {
    provider.provisionCallback("other@sarga.co", false, (callbackError) =>
      resolve(callbackError),
    );
  });

  assert.match(error?.message ?? "", /unauthorized SMTP user/);
});

test("OAuth failures expose a safe code but never Microsoft response details", async () => {
  const provider = createMicrosoftSmtpTokenProvider({
    ...baseOptions,
    fetchImpl: async () =>
      new Response(
        JSON.stringify({
          error: "invalid_client",
          error_description: `credential ${baseOptions.clientSecret} rejected`,
        }),
        { status: 401, headers: { "content-type": "application/json" } },
      ),
  });

  await assert.rejects(provider.getAccessToken(), (error: Error) => {
    assert.match(error.message, /HTTP 401, invalid_client/);
    assert.doesNotMatch(error.message, /do-not-log-this-secret/);
    assert.doesNotMatch(error.message, /error_description/);
    return true;
  });
});

test("mail configuration is disabled by default", () => {
  assert.deepEqual(createMicrosoftEmailPluginConfig({}), {});
});

test("enabled mail configuration enforces Exchange OAuth and TLS", () => {
  const result = createMicrosoftEmailPluginConfig({
    MAIL_ENABLED: "true",
    MAIL_SMTP_USER: baseOptions.smtpUser,
    MAIL_FROM_ADDRESS: baseOptions.smtpUser,
    MAIL_DEFAULT_REPLY_TO: baseOptions.smtpUser,
    MICROSOFT_TENANT_ID: baseOptions.tenantId,
    MICROSOFT_CLIENT_ID: baseOptions.clientId,
    MICROSOFT_CLIENT_SECRET: baseOptions.clientSecret,
  }) as any;
  const options = result.email.config.providerOptions;

  assert.equal(result.email.config.provider, "nodemailer");
  assert.equal(options.host, "smtp.office365.com");
  assert.equal(options.port, 587);
  assert.equal(options.secure, false);
  assert.equal(options.requireTLS, true);
  assert.equal(options.authMethod, "XOAUTH2");
  assert.equal(options.auth.type, "OAuth2");
  assert.equal(options.auth.user, baseOptions.smtpUser);
  assert.equal(typeof options.auth.provisionCallback, "function");
  assert.equal("pass" in options.auth, false);
  assert.equal(options.tls.minVersion, "TLSv1.2");
  assert.equal(options.tls.rejectUnauthorized, true);
});

test("enabled mail configuration fails closed on insecure overrides", () => {
  const environment = {
    MAIL_ENABLED: "true",
    MAIL_SMTP_USER: baseOptions.smtpUser,
    MICROSOFT_TENANT_ID: baseOptions.tenantId,
    MICROSOFT_CLIENT_ID: baseOptions.clientId,
    MICROSOFT_CLIENT_SECRET: baseOptions.clientSecret,
  };

  assert.throws(
    () =>
      createMicrosoftEmailPluginConfig({
        ...environment,
        MAIL_SMTP_REQUIRE_TLS: "false",
      }),
    /cannot be disabled/,
  );
  assert.throws(
    () =>
      createMicrosoftEmailPluginConfig({
        ...environment,
        MAIL_SMTP_HOST: "smtp.example.com",
      }),
    /must use smtp.office365.com:587/,
  );
});

const basicEnvironment = {
  MAIL_ENABLED: "true",
  MAIL_AUTH_MODE: "basic",
  MAIL_SMTP_USER: baseOptions.smtpUser,
  MAIL_FROM_ADDRESS: baseOptions.smtpUser,
  MAIL_DEFAULT_REPLY_TO: baseOptions.smtpUser,
  MAIL_SMTP_PASSWORD: "temporary-password-do-not-log",
  MAIL_BASIC_AUTH_ACKNOWLEDGED: "I_ACCEPT_TEMPORARY_BASIC_AUTH_RISK",
  MAIL_BASIC_AUTH_EXPIRES_AT: "2026-09-30T23:59:59.000Z",
};

test("temporary Basic mode works without OAuth credentials and keeps TLS mandatory", () => {
  const result = createMicrosoftEmailPluginConfig(
    basicEnvironment,
    new Date("2026-08-11T00:00:00.000Z"),
  ) as any;
  const options = result.email.config.providerOptions;

  assert.equal(options.authMethod, "LOGIN");
  assert.equal(options.auth.user, baseOptions.smtpUser);
  assert.equal(options.auth.pass, basicEnvironment.MAIL_SMTP_PASSWORD);
  assert.equal(options.requireTLS, true);
  assert.equal(options.tls.minVersion, "TLSv1.2");
  assert.equal("type" in options.auth, false);
});

test("temporary Basic mode requires explicit acknowledgement, password, and expiry", () => {
  const now = new Date("2026-08-11T00:00:00.000Z");
  assert.throws(
    () =>
      createMicrosoftEmailPluginConfig(
        { ...basicEnvironment, MAIL_BASIC_AUTH_ACKNOWLEDGED: "true" },
        now,
      ),
    /I_ACCEPT_TEMPORARY_BASIC_AUTH_RISK/,
  );
  assert.throws(
    () =>
      createMicrosoftEmailPluginConfig(
        { ...basicEnvironment, MAIL_SMTP_PASSWORD: "" },
        now,
      ),
    /MAIL_SMTP_PASSWORD/,
  );
  assert.throws(
    () =>
      createMicrosoftEmailPluginConfig(
        { ...basicEnvironment, MAIL_BASIC_AUTH_EXPIRES_AT: "" },
        now,
      ),
    /MAIL_BASIC_AUTH_EXPIRES_AT/,
  );
  assert.throws(
    () =>
      createMicrosoftEmailPluginConfig(
        { ...basicEnvironment, MAIL_BASIC_AUTH_EXPIRES_AT: "not-a-date" },
        now,
      ),
    /ISO-8601/,
  );
});

test("temporary Basic mode expires at runtime and cannot cross the hard cutoff", () => {
  assert.throws(
    () =>
      assertMailAuthenticationWindow(
        basicEnvironment,
        new Date("2026-10-01T00:00:00.000Z"),
      ),
    /has expired/,
  );
  assert.throws(
    () =>
      assertMailAuthenticationWindow(
        {
          ...basicEnvironment,
          MAIL_BASIC_AUTH_EXPIRES_AT: "2026-12-31T23:59:59.000Z",
        },
        new Date("2026-08-11T00:00:00.000Z"),
      ),
    /cannot exceed 2026-12-15/,
  );
});

test("temporary password is redacted from operator errors", () => {
  const redacted = redactMailError(
    new Error(`SMTP rejected ${basicEnvironment.MAIL_SMTP_PASSWORD}`),
    basicEnvironment,
  );
  assert.doesNotMatch(redacted, /temporary-password-do-not-log/);
  assert.match(redacted, /\[REDACTED\]/);
});
