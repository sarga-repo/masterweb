import assert from "node:assert/strict";
import test from "node:test";

import { maskMailbox, validateMailUatEnvironment } from "./inquiry-notifications.ts";

const environment = {
  MAIL_UAT_ENVIRONMENT: "staging",
  MAIL_UAT_ALLOW_SEND: "I_APPROVE_STAGING_TEST_SEND",
  MAIL_UAT_RECIPIENT: "cms-uat@sarga.co",
  MAIL_RECIPIENT_GATEWAY: "cms-uat@sarga.co",
  MAIL_RECIPIENT_MOTORSPORT: "motorsport@sarga.co",
  MAIL_RECIPIENT_HORSESPORT: "horse@sarga.co",
};

test("controlled send is staging-only and requires an exact confirmation", () => {
  assert.throws(
    () => validateMailUatEnvironment({ ...environment, MAIL_UAT_ENVIRONMENT: "production" }),
    /refuses production/,
  );
  assert.throws(
    () => validateMailUatEnvironment({ ...environment, MAIL_UAT_ALLOW_SEND: "true" }),
    /I_APPROVE_STAGING_TEST_SEND/,
  );
});

test("controlled send recipient must already be allowlisted", () => {
  assert.throws(
    () => validateMailUatEnvironment({ ...environment, MAIL_UAT_RECIPIENT: "external@example.com" }),
    /recipient allowlist/,
  );
  assert.deepEqual(validateMailUatEnvironment(environment), {
    recipient: "cms-uat@sarga.co",
  });
});

test("mailbox masking avoids logging the full recipient", () => {
  assert.equal(maskMailbox("cms-uat@sarga.co"), "cm***@sarga.co");
});
