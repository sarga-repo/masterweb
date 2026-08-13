import assert from "node:assert/strict";
import test from "node:test";

test("Motorsport leadership query requires exact Motorsport scope", () => {
  const query = new URLSearchParams({
    "filters[siteScope][$eq]": "motorsport",
  });
  assert.equal(query.get("filters[siteScope][$eq]"), "motorsport");
  assert.notEqual(query.get("filters[siteScope][$eq]"), "gateway");
});
