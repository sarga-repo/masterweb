import assert from "node:assert/strict";
import test from "node:test";

import { isCmsPageVisible, isCmsSectionVisible } from "./cms-visibility.ts";

test("explicit section false hides only that section", () => {
  assert.equal(isCmsSectionVisible({ enabled: false }), false);
  assert.equal(isCmsSectionVisible({ enabled: true }), true);
  assert.equal(isCmsSectionVisible(null), true);
});

test("page availability defaults active when component is absent", () => {
  assert.equal(isCmsPageVisible(null), true);
  assert.equal(isCmsPageVisible({ pageEnabled: true }), true);
  assert.equal(isCmsPageVisible({ pageEnabled: false }), false);
});
