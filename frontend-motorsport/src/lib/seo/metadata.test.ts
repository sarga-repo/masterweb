import assert from "node:assert/strict";
import test from "node:test";
import { createMetadata } from "./metadata";

test("CMS SEO overrides title, social metadata, and noindex", () => {
  const metadata = createMetadata({
    title: "Fallback title",
    description: "Fallback description",
    path: "/about",
    seo: {
      metaTitle: "CMS title",
      metaDescription: "CMS description",
      ogTitle: "CMS social title",
      ogDescription: "CMS social description",
      canonicalUrl: "https://motorsport.example/about",
      noIndex: true,
    },
  });
  assert.equal(metadata.title, "CMS title");
  assert.equal(metadata.description, "CMS description");
  assert.equal(metadata.alternates?.canonical, "https://motorsport.example/about");
  assert.equal(metadata.openGraph?.title, "CMS social title");
  assert.equal(metadata.openGraph?.description, "CMS social description");
  assert.deepEqual(metadata.robots, { index: false, follow: false });
});
