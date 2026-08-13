#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const args = new Map();
for (let i = 2; i < process.argv.length; i += 1) {
  const value = process.argv[i];
  if (value.startsWith("--")) args.set(value.slice(2), process.argv[i + 1]);
}

const archive = args.get("archive");
const output = args.get("output") ?? "output/cms-migration-preflight.json";
const report = {
  checkedAt: new Date().toISOString(),
  mode: "non-destructive",
  archive: archive ? resolve(archive) : null,
  checks: [],
};

function check(name, status, detail) {
  report.checks.push({ name, status, detail });
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
try {
  check("git-worktree", "pass", execFileSync("git", ["status", "--porcelain"], { cwd: root, encoding: "utf8" }).trim() || "clean");
} catch (error) {
  check("git-worktree", "blocked", error.message);
}

if (archive) {
  const archivePath = resolve(archive);
  const checksumPath = `${archivePath}.sha256`;
  const shaPath = `${archivePath}.git-sha`;
  check("archive-present", existsSync(archivePath) ? "pass" : "blocked", archivePath);
  check("checksum-present", existsSync(checksumPath) ? "pass" : "blocked", checksumPath);
  check("git-sha-present", existsSync(shaPath) ? "pass" : "blocked", shaPath);
  if (existsSync(archivePath) && existsSync(checksumPath)) {
    const digest = createHash("sha256").update(readFileSync(archivePath)).digest("hex");
    const expected = readFileSync(checksumPath, "utf8").trim().split(/\s+/).at(-1);
    check("archive-checksum", digest === expected ? "pass" : "blocked", `${digest} expected ${expected}`);
  }
  if (existsSync(archivePath) && statSync(archivePath).size === 0) {
    check("archive-nonempty", "blocked", "archive is empty");
  }
} else {
  check("archive-input", "blocked", "provide --archive for target snapshot validation");
}

check("seed-disabled-target", process.env.SEED_DEMO_CONTENT === "false" ? "pass" : "blocked", "SEED_DEMO_CONTENT must be false on staging/production");
check("production-approval", process.env.MIGRATION_APPROVAL === "approved" ? "pass" : "blocked", "no destructive import is performed by this command");

const failures = report.checks.filter((item) => item.status === "blocked");
writeFileSync(resolve(root, output), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ ...report, result: failures.length ? "blocked" : "ready" }, null, 2));
process.exitCode = failures.length ? 2 : 0;
