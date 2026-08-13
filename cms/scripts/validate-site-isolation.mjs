#!/usr/bin/env node

const baseUrl = (process.env.CMS_UAT_BASE_URL ?? "http://localhost:1337").replace(/\/$/, "");
const cases = [
  ["gateway", "gateway"],
  ["motorsport", "motorsport"],
  ["horsesport", "horsesport"],
];
const collections = ["site-pages", "events", "news-articles", "ticket-ctas"];

async function request(collection, scope) {
  const params = new URLSearchParams({
    "filters[siteScope][$eq]": scope,
    "pagination[pageSize]": "100",
  });
  const response = await fetch(`${baseUrl}/api/${collection}?${params}`);
  if (!response.ok) throw new Error(`${collection}/${scope}: HTTP ${response.status}`);
  return response.json();
}

const results = [];
for (const [site, scope] of cases) {
  for (const collection of collections) {
    try {
      const payload = await request(collection, scope);
      const entries = Array.isArray(payload?.data) ? payload.data : [];
      const leaked = entries.filter((entry) => entry.siteScope !== scope);
      results.push({ site, collection, status: leaked.length ? "fail" : "pass", count: entries.length });
    } catch (error) {
      results.push({ site, collection, status: "blocked", detail: error.message });
    }
  }
}

console.log(JSON.stringify({ checkedAt: new Date().toISOString(), baseUrl, results }, null, 2));
process.exitCode = results.some((result) => result.status !== "pass") ? 2 : 0;
