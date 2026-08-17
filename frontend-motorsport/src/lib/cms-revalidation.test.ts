import assert from "node:assert/strict";
import test from "node:test";

import {
  cmsFetchTags,
  normalizeCollectionName,
  revalidationTargets,
} from "./cms-revalidation.ts";

test("normalizes Strapi UIDs to REST collection names", () => {
  assert.equal(
    normalizeCollectionName("api::site-page.site-page"),
    "site-pages",
  );
  assert.equal(
    normalizeCollectionName("api::leadership-person.leadership-person"),
    "leadership-people",
  );
});

test("builds stable locale and document cache tags", () => {
  assert.deepEqual(cmsFetchTags("site-pages", "en", "doc-1"), [
    "cms:motorsport",
    "cms:motorsport:site-pages",
    "cms:motorsport:site-pages:en",
    "cms:motorsport:document:doc-1",
  ]);
});

test("maps shared and detail content to affected Motorsport paths only", () => {
  const article = revalidationTargets({
    contentType: "api::news-article.news-article",
    locale: "id",
    documentId: "article-1",
    slug: "pit-lane",
  });
  assert.deepEqual(article.paths, ["/", "/news", "/news/pit-lane"]);
  assert.ok(article.tags.includes("cms:motorsport:news-articles:id"));
  assert.ok(!article.paths.some((path) => path.includes("gateway")));
});
