import fs from "node:fs";
import path from "node:path";

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && process.env[match[1]] == null)
      process.env[match[1]] = match[2];
  }
}

loadEnv(path.resolve(process.cwd(), ".env.local"));
loadEnv(path.resolve(process.cwd(), "../.env"));

const apiUrl = process.env.STRAPI_API_URL || "http://localhost:1337";
const token = process.env.STRAPI_API_TOKEN || "";

if (!token) {
  console.error("FAIL draft probe: STRAPI_API_TOKEN is not configured.");
  process.exit(1);
}

async function probe(label, status, authenticated) {
  const params = new URLSearchParams({
    status,
    locale: "en",
    "filters[siteScope][$eq]": "motorsport",
    "filters[pageKind][$eq]": "about",
    "pagination[pageSize]": "1",
  });
  const response = await fetch(`${apiUrl}/api/site-pages?${params}`, {
    headers: authenticated ? { Authorization: `Bearer ${token}` } : undefined,
  });
  let count = 0;
  if (response.ok) {
    const body = await response.json();
    count = Array.isArray(body.data) ? body.data.length : 0;
  }
  const passed = response.ok && count === 1;
  console.log(
    `${passed ? "PASS" : "FAIL"} ${label}: HTTP ${response.status}, records ${count}`,
  );
  if (!passed) process.exitCode = 1;
}

await probe("published Site Page read", "published", false);
await probe("authenticated draft Site Page read", "draft", true);
