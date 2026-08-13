#!/usr/bin/env node

import { existsSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const args = new Map();
for (let i = 2; i < process.argv.length; i += 1) {
  if (process.argv[i].startsWith("--")) args.set(process.argv[i].slice(2), process.argv[i + 1]);
}

const database = args.get("database");
const uploads = args.get("uploads");
const output = resolve(args.get("output") ?? "output/cms-rollback-rehearsal.json");
const checks = [
  { name: "database-backup", path: database },
  { name: "uploads-backup", path: uploads },
];
const report = {
  checkedAt: new Date().toISOString(),
  mode: "dry-run",
  destructiveRestoreExecuted: false,
  checks: checks.map(({ name, path }) => ({
    name,
    status: path && existsSync(resolve(path)) ? "pass" : "blocked",
    path: path ? resolve(path) : null,
  })),
  nextAction: "Restore paired database and uploads backups in isolated staging, then rerun UAT.",
};

writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
process.exitCode = report.checks.some((check) => check.status === "blocked") ? 2 : 0;
