import assert from "node:assert/strict";
import test from "node:test";

import {
  getMotorsportMailSettings,
  resolveMotorsportMailEnvironment,
  updateMotorsportMailSettings,
} from "./motorsport-mail-settings.ts";

function fakeStrapi() {
  let value: unknown;
  const store = {
    async get() {
      return value;
    },
    async set({ value: nextValue }: { value: unknown }) {
      value = nextValue;
    },
  };
  return {
    strapi: { store: () => store } as any,
    getStored: () => value as Record<string, unknown> | undefined,
  };
}

test("Motorsport CMS mail settings override environment fallback", async () => {
  const previousKey = process.env.ENCRYPTION_KEY;
  process.env.ENCRYPTION_KEY = "test-encryption-key";
  try {
    const fixture = fakeStrapi();
    const environment = {
      MAIL_ENABLED: "false",
      MAIL_NOTIFICATIONS_ENABLED: "false",
      MAIL_SMTP_USER: "env@sargamotorsport.co",
      MICROSOFT_CLIENT_SECRET: "env-secret",
    };

    await updateMotorsportMailSettings(fixture.strapi, {
      enabled: true,
      notificationsEnabled: true,
      smtpUser: "cms@sargamotorsport.co",
      fromAddress: "cms@sargamotorsport.co",
      recipient: "contact@sargamotorsport.co",
      tenantId: "cms-tenant",
      clientId: "cms-client",
      clientSecret: "cms-secret",
    });

    const resolved = await resolveMotorsportMailEnvironment(
      fixture.strapi,
      environment,
    );
    assert.equal(resolved.MAIL_ENABLED, "true");
    assert.equal(resolved.MAIL_SMTP_USER, "cms@sargamotorsport.co");
    assert.equal(resolved.MICROSOFT_CLIENT_SECRET, "cms-secret");
    assert.equal(resolved.MAIL_RECIPIENT_MOTORSPORT, "contact@sargamotorsport.co");

    const stored = fixture.getStored();
    assert.ok(stored?.clientSecret);
    assert.equal(String(stored?.clientSecret).includes("cms-secret"), false);

    const snapshot = await getMotorsportMailSettings(fixture.strapi, environment);
    assert.equal(snapshot.clientSecretConfigured, true);
    assert.equal(snapshot.clientId, "cms-client");

    await updateMotorsportMailSettings(fixture.strapi, { clearClientSecret: true });
    const fallbackResolved = await resolveMotorsportMailEnvironment(
      fixture.strapi,
      environment,
    );
    assert.equal(fallbackResolved.MICROSOFT_CLIENT_SECRET, "env-secret");
    assert.equal(fixture.getStored()?.clientSecret, undefined);
  } finally {
    if (previousKey === undefined) delete process.env.ENCRYPTION_KEY;
    else process.env.ENCRYPTION_KEY = previousKey;
  }
});

test("Motorsport CMS mail settings use environment values when unset", async () => {
  const fixture = fakeStrapi();
  const snapshot = await getMotorsportMailSettings(fixture.strapi, {
    MAIL_ENABLED: "true",
    MAIL_NOTIFICATIONS_ENABLED: "false",
    MAIL_SMTP_USER: "env@sargamotorsport.co",
    MAIL_FROM_ADDRESS: "env@sargamotorsport.co",
    MAIL_FROM_NAME: "Environment",
    MAIL_DEFAULT_REPLY_TO: "env@sargamotorsport.co",
    MAIL_RECIPIENT_MOTORSPORT: "contact@sargamotorsport.co",
    MICROSOFT_TENANT_ID: "env-tenant",
    MICROSOFT_CLIENT_ID: "env-client",
    MICROSOFT_CLIENT_SECRET: "env-secret",
  });

  assert.equal(snapshot.enabled, true);
  assert.equal(snapshot.smtpUser, "env@sargamotorsport.co");
  assert.equal(snapshot.fromName, "Environment");
  assert.equal(snapshot.clientSecretConfigured, true);
});
