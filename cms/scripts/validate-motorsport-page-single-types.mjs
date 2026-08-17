#!/usr/bin/env node

const baseUrl = (process.env.CMS_URL || "http://localhost:1337").replace(/\/$/, "");
const endpoints = [
  "motorsport-home-page",
  "motorsport-about-page",
  "motorsport-events-page",
  "motorsport-news-page",
  "motorsport-gallery-page",
  "motorsport-merchandise-page",
  "motorsport-tickets-page",
  "motorsport-contact-page",
  "motorsport-partners-page",
  "motorsport-experience-page",
];

const checks = [];
for (const endpoint of endpoints) {
  try {
    const response = await fetch(`${baseUrl}/api/${endpoint}?locale=en&populate=*`);
    const payload = await response.json();
    const ok = response.ok && Boolean(payload?.data?.documentId);
    checks.push({ endpoint, status: ok ? "pass" : "blocked", httpStatus: response.status });
  } catch (error) {
    checks.push({ endpoint, status: "blocked", detail: error instanceof Error ? error.message : "request failed" });
  }
}

const blocked = checks.filter((check) => check.status === "blocked");
console.log(JSON.stringify({ mode: "read-only", checks, result: blocked.length ? "blocked" : "ready" }, null, 2));
process.exitCode = blocked.length ? 1 : 0;
