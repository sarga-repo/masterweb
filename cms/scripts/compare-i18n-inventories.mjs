import fs from "node:fs";
import path from "node:path";
import process from "node:process";

function argument(name, required = true) {
  const index = process.argv.indexOf(name);
  const value = index >= 0 ? process.argv[index + 1] : null;
  if (required && !value) throw new Error(`${name} is required.`);
  return value;
}

const sourcePath = argument("--source");
const targetPath = argument("--target");
const outputPath = argument("--output", false);
const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const target = JSON.parse(fs.readFileSync(targetPath, "utf8"));
const checks = [];

function check(area, metric, sourceValue, targetValue) {
  const passed = JSON.stringify(sourceValue) === JSON.stringify(targetValue);
  checks.push({ area, metric, sourceValue, targetValue, passed });
}

check(
  "CMS",
  "locales",
  source.locales.map(({ code }) => code).sort(),
  target.locales.map(({ code }) => code).sort(),
);

const sourceTypes = new Map(source.contentTypes.map((item) => [item.uid, item]));
const targetTypes = new Map(target.contentTypes.map((item) => [item.uid, item]));
check(
  "CMS",
  "content type UIDs",
  [...sourceTypes.keys()].sort(),
  [...targetTypes.keys()].sort(),
);

for (const [uid, sourceType] of sourceTypes) {
  const targetType = targetTypes.get(uid);
  if (!targetType) continue;
  for (const metric of ["rows", "documents", "draft_rows", "published_rows"]) {
    check(uid, metric, sourceType[metric] ?? 0, targetType[metric] ?? 0);
  }
  check(uid, "locale rows", sourceType.locales ?? {}, targetType.locales ?? {});
}

check(
  "Media database",
  "files",
  Number(source.mediaDatabase.files),
  Number(target.mediaDatabase.files),
);
check(
  "Media database",
  "kilobytes",
  Number(source.mediaDatabase.kilobytes),
  Number(target.mediaDatabase.kilobytes),
);
check("Uploads", "files", source.uploads.files, target.uploads.files);
check("Uploads", "bytes", source.uploads.bytes, target.uploads.bytes);

function cell(value) {
  const serialized =
    typeof value === "object" ? JSON.stringify(value) : String(value);
  return serialized.replaceAll("|", "\\|");
}

const failed = checks.filter((item) => !item.passed);
const lines = [
  "# CMS i18n Source/Target Reconciliation",
  "",
  `Generated: ${new Date().toISOString()}`,
  `Source inventory: \`${sourcePath}\``,
  `Target inventory: \`${targetPath}\``,
  `Result: **${failed.length === 0 ? "PASS" : "FAIL"}**`,
  "",
  "| Area | Metric | Source | Target | Result |",
  "| --- | --- | --- | --- | --- |",
  ...checks.map(
    (item) =>
      `| ${cell(item.area)} | ${cell(item.metric)} | ${cell(item.sourceValue)} | ${cell(item.targetValue)} | ${item.passed ? "Pass" : "**Fail**"} |`,
  ),
  "",
];
const output = `${lines.join("\n")}\n`;
if (outputPath) {
  fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
  fs.writeFileSync(outputPath, output);
} else {
  process.stdout.write(output);
}
if (failed.length) process.exitCode = 1;
