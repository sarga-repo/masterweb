#!/usr/bin/env node

/**
 * Static guard for editorial visibility toggles.
 *
 * `showOnGateway`, `showOnMotorsport`, and `showOnHorseSport` are distribution
 * controls and intentionally retain site-specific defaults. Every other
 * boolean schema field beginning with `show` is an editorial presentation
 * toggle and must default to true.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../..");
const schemaRoots = ["cms/src/components", "cms/src/api"];
const distributionFields = new Set([
  "showOnGateway",
  "showOnMotorsport",
  "showOnHorseSport",
]);

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });
}

const findings = [];
let editorialCount = 0;
let distributionCount = 0;

for (const root of schemaRoots) {
  const absoluteRoot = path.join(repoRoot, root);
  for (const file of walk(absoluteRoot).filter((item) => item.endsWith("schema.json") || item.endsWith(".json"))) {
    const schema = JSON.parse(fs.readFileSync(file, "utf8"));
    for (const [name, attribute] of Object.entries(schema.attributes ?? {})) {
      if (!/^show[A-Z]/.test(name) || attribute.type !== "boolean") continue;
      const relative = path.relative(repoRoot, file);
      if (distributionFields.has(name)) {
        distributionCount += 1;
        continue;
      }
      editorialCount += 1;
      if (attribute.default !== true) {
        findings.push(`${relative}:${name} default=${JSON.stringify(attribute.default)}`);
      }
    }
  }
}

console.log(`Editorial show toggles checked: ${editorialCount}`);
console.log(`Distribution showOn controls preserved: ${distributionCount}`);
if (findings.length) {
  console.error("Editorial show toggles without default=true:");
  for (const finding of findings) console.error(`- ${finding}`);
  process.exitCode = 1;
} else {
  console.log("All editorial show toggles default to true.");
}
