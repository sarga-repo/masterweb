import assert from "node:assert/strict";
import test from "node:test";

import {
  previewCollectionForUid,
  signPreviewContext,
  verifyPreviewContext,
  type MotorsportPreviewContext,
} from "./preview-context.ts";

const secret = "preview-test-secret";
const context: MotorsportPreviewContext = {
  uid: "api::site-page.site-page",
  documentId: "qfi9fxcl0ayqvqc1k6q0tcry",
  locale: "en",
  status: "draft",
  pathname: "/about",
  expiresAt: Date.now() + 60_000,
};

test("round-trips a signed exact-document preview context", () => {
  assert.deepEqual(
    verifyPreviewContext(signPreviewContext(context, secret), secret),
    context,
  );
  assert.equal(previewCollectionForUid(context.uid), "site-pages");
});

test("rejects tampered, expired, and wrongly signed contexts", () => {
  const signed = signPreviewContext(context, secret);
  assert.equal(verifyPreviewContext(`${signed}x`, secret), null);
  assert.equal(verifyPreviewContext(signed, "another-secret"), null);
  assert.equal(
    verifyPreviewContext(
      signPreviewContext({ ...context, expiresAt: Date.now() - 1 }, secret),
      secret,
    ),
    null,
  );
});
