import assert from "node:assert/strict";
import test from "node:test";

import { parseMarkdown, safeMarkdownUrl } from "./markdown.ts";

test("parses the rich-text formats supported by the CMS editor", () => {
  const blocks = parseMarkdown(
    [
      "**Normal text:** A short paragraph.",
      "",
      ">A useful quote.",
      "",
      "1. First item",
      "2. Second item",
      "",
      "- Bullet one",
      "- Bullet two",
      "",
      "| Product | Price | Status |",
      "| :--- | ---: | :---: |",
      "| Mouse | $45.00 | In Stock |",
      "| Keyboard | $110.00 | Backordered |",
      "",
      "```ts",
      "const value = 1;",
      "```",
      "",
      "![Race car](/uploads/race.png)",
      "",
      "[Read more](https://example.com)",
    ].join("\n"),
  );

  assert.deepEqual(blocks, [
    { type: "paragraph", value: "**Normal text:** A short paragraph." },
    { type: "blockquote", value: "A useful quote." },
    { type: "ordered-list", items: ["First item", "Second item"] },
    { type: "unordered-list", items: ["Bullet one", "Bullet two"] },
    {
      type: "table",
      headers: ["Product", "Price", "Status"],
      alignments: ["left", "right", "center"],
      rows: [
        ["Mouse", "$45.00", "In Stock"],
        ["Keyboard", "$110.00", "Backordered"],
      ],
    },
    { type: "code", language: "ts", value: "const value = 1;" },
    { type: "image", alt: "Race car", src: "/uploads/race.png" },
    { type: "paragraph", value: "[Read more](https://example.com)" },
  ]);
});

test("allows web and local URLs while rejecting executable protocols", () => {
  assert.equal(safeMarkdownUrl("/uploads/race.png"), "/uploads/race.png");
  assert.equal(
    safeMarkdownUrl("https://example.com/story"),
    "https://example.com/story",
  );
  assert.equal(safeMarkdownUrl("javascript:alert(1)"), undefined);
  assert.equal(safeMarkdownUrl("data:text/html,<script>"), undefined);
});
