import assert from "node:assert/strict";
import test from "node:test";

import {
  isHomepageArticleVisible,
  isHomepageEventVisible,
  isHomepagePartnerVisible,
  orderHomepageArticles,
} from "./homepage-visibility.ts";

test("homepage excludes hidden events and explicitly excluded records", () => {
  assert.equal(
    isHomepageEventVisible({
      eventStatus: "hidden",
      showOnMotorsport: true,
    }),
    false,
  );
  assert.equal(
    isHomepageEventVisible({
      eventStatus: "announced",
      showOnMotorsport: false,
    }),
    false,
  );
  assert.equal(
    isHomepageEventVisible({ eventStatus: "announced" }),
    true,
  );
});

test("homepage honors article, partner, and featured-news controls", () => {
  assert.equal(isHomepageArticleVisible({ showOnMotorsport: false }), false);
  assert.equal(isHomepageArticleVisible({}), true);
  assert.equal(isHomepagePartnerVisible({ isActive: false }), false);
  assert.equal(isHomepagePartnerVisible({}), true);

  const ordered = orderHomepageArticles([
    { id: "regular", featuredOnMotorsport: false },
    { id: "featured", featuredOnMotorsport: true },
  ]);
  assert.deepEqual(
    ordered.map((article) => article.id),
    ["featured", "regular"],
  );
});
