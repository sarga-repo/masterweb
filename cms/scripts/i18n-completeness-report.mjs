import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import pg from "pg";

const { Client } = pg;
const cmsRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const apiRoot = path.join(cmsRoot, "src", "api");
const outputIndex = process.argv.indexOf("--output");
const outputPath = outputIndex >= 0 ? process.argv[outputIndex + 1] : null;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  host: process.env.DATABASE_HOST ?? "localhost",
  port: Number(process.env.DATABASE_PORT ?? 5435),
  database: process.env.DATABASE_NAME ?? "sarga_strapi",
  user: process.env.DATABASE_USERNAME ?? "sarga",
  password: process.env.DATABASE_PASSWORD ?? "sarga_local_password",
  ssl:
    process.env.DATABASE_SSL === "true"
      ? {
          rejectUnauthorized:
            process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "false",
        }
      : false,
});

const OWNER_BY_SCOPE = {
  gateway: "Gateway editorial",
  motorsport: "Motorsport editorial",
  horsesport: "Horse Sport editorial",
  shared: "Shared Library / Super Admin",
  hidden: "Super Admin",
};

const IDENTIFIER_COLUMNS = [
  "title",
  "name",
  "internal_name",
  "slug",
  "label",
  "route_path",
  "email",
];

function schemaFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const candidate = path.join(directory, entry.name);
    if (entry.isDirectory()) return schemaFiles(candidate);
    return entry.name === "schema.json" ? [candidate] : [];
  });
}

function escapeCell(value) {
  return String(value ?? "—")
    .replaceAll("|", "\\|")
    .replaceAll("\n", " ")
    .trim();
}

function localeState(rows, locale, hasPublishedAt) {
  const localized = rows.filter((row) => row.locale === locale);
  if (localized.length === 0) return "missing";
  if (!hasPublishedAt || localized.some((row) => row.published_at)) {
    return "published";
  }
  return "draft";
}

function ownerFor(scope) {
  return OWNER_BY_SCOPE[scope] ?? "Super Admin / assign owner";
}

async function tableExists(tableName) {
  const result = await client.query("select to_regclass($1) as table_name", [
    `public.${tableName}`,
  ]);
  return Boolean(result.rows[0]?.table_name);
}

async function columnNames(tableName) {
  const result = await client.query(
    `select column_name
       from information_schema.columns
      where table_schema = 'public' and table_name = $1`,
    [tableName],
  );
  return new Set(result.rows.map((row) => row.column_name));
}

async function localizedDocuments(schema) {
  const tableName = schema.collectionName;
  if (!(await tableExists(tableName))) return [];
  const columns = await columnNames(tableName);
  if (!columns.has("document_id") || !columns.has("locale")) return [];

  const selected = ["document_id", "locale"];
  if (columns.has("published_at")) selected.push("published_at");
  if (columns.has("site_scope")) selected.push("site_scope");
  for (const column of IDENTIFIER_COLUMNS) {
    if (columns.has(column)) selected.push(column);
  }

  const result = await client.query(
    `select ${selected.map((column) => client.escapeIdentifier(column)).join(", ")}
       from ${client.escapeIdentifier(tableName)}
      order by document_id, locale`,
  );
  const groups = new Map();
  for (const row of result.rows) {
    const rows = groups.get(row.document_id) ?? [];
    rows.push(row);
    groups.set(row.document_id, rows);
  }

  return [...groups.entries()].map(([documentId, rows]) => {
    const scope =
      rows.find((row) => row.site_scope)?.site_scope ?? "unscoped/shared";
    const identifierColumn = IDENTIFIER_COLUMNS.find((column) =>
      rows.some((row) => String(row[column] ?? "").trim()),
    );
    const identifier = identifierColumn
      ? rows.find((row) => String(row[identifierColumn] ?? "").trim())?.[
          identifierColumn
        ]
      : documentId;
    return {
      documentId,
      identifier,
      scope,
      owner: ownerFor(scope),
      english: localeState(rows, "en", columns.has("published_at")),
      indonesian: localeState(rows, "id", columns.has("published_at")),
    };
  });
}

await client.connect();
try {
  const schemas = schemaFiles(apiRoot)
    .map((file) => JSON.parse(fs.readFileSync(file, "utf8")))
    .filter((schema) => schema.pluginOptions?.i18n?.localized === true)
    .sort((left, right) => left.collectionName.localeCompare(right.collectionName));
  const contentTypes = [];
  const remaining = [];

  for (const schema of schemas) {
    const documents = await localizedDocuments(schema);
    const counts = {
      documents: documents.length,
      englishPublished: documents.filter((item) => item.english === "published")
        .length,
      indonesianPublished: documents.filter(
        (item) => item.indonesian === "published",
      ).length,
      indonesianDraft: documents.filter((item) => item.indonesian === "draft")
        .length,
      indonesianMissing: documents.filter(
        (item) => item.indonesian === "missing",
      ).length,
    };
    contentTypes.push({
      type: schema.info.displayName,
      collection: schema.collectionName,
      ...counts,
    });
    for (const document of documents) {
      if (document.indonesian !== "published") {
        remaining.push({ type: schema.info.displayName, ...document });
      }
    }
  }

  const totals = contentTypes.reduce(
    (summary, item) => {
      for (const key of [
        "documents",
        "englishPublished",
        "indonesianPublished",
        "indonesianDraft",
        "indonesianMissing",
      ]) {
        summary[key] += item[key];
      }
      return summary;
    },
    {
      documents: 0,
      englishPublished: 0,
      indonesianPublished: 0,
      indonesianDraft: 0,
      indonesianMissing: 0,
    },
  );

  const lines = [
    "# Bilingual Content Completeness Report",
    "",
    `Generated: ${new Date().toISOString()}`,
    `Database: \`${process.env.DATABASE_NAME ?? "sarga_strapi"}\``,
    "",
    "English is the structural/default locale. Indonesian editorial content is",
    "never generated automatically. A missing or draft Indonesian localization",
    "must continue to use the whole English record with `noindex` on public pages.",
    "",
    "## Summary",
    "",
    "| Content type | Documents | EN published | ID published | ID draft | ID missing |",
    "| --- | ---: | ---: | ---: | ---: | ---: |",
    ...contentTypes.map(
      (item) =>
        `| ${escapeCell(item.type)} | ${item.documents} | ${item.englishPublished} | ${item.indonesianPublished} | ${item.indonesianDraft} | ${item.indonesianMissing} |`,
    ),
    `| **Total** | **${totals.documents}** | **${totals.englishPublished}** | **${totals.indonesianPublished}** | **${totals.indonesianDraft}** | **${totals.indonesianMissing}** |`,
    "",
    "## Indonesian localizations requiring editorial action",
    "",
    remaining.length
      ? "The owner must translate, review, and publish each record before it becomes indexable in Indonesian."
      : "No missing or draft Indonesian localizations were found.",
    "",
  ];

  if (remaining.length) {
    lines.push(
      "| Content type | Scope | Identifier | EN | ID | Business owner |",
      "| --- | --- | --- | --- | --- | --- |",
      ...remaining.map(
        (item) =>
          `| ${escapeCell(item.type)} | ${escapeCell(item.scope)} | ${escapeCell(item.identifier)} | ${item.english} | ${item.indonesian} | ${escapeCell(item.owner)} |`,
      ),
      "",
    );
  }

  lines.push(
    "## Sign-off",
    "",
    "| Site | Editorial owner | Translation complete | Browser review | Approved by/date |",
    "| --- | --- | --- | --- | --- |",
    "| Gateway | Gateway editorial | Pending | Pending | Pending |",
    "| Motorsport | Motorsport editorial | Pending | Pending | Pending |",
    "| Horse Sport | Horse Sport editorial | Pending | Pending | Pending |",
    "| Shared Library | Shared Library / Super Admin | Pending | Pending | Pending |",
    "",
  );

  const output = `${lines.join("\n")}\n`;
  if (outputPath) {
    fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
    fs.writeFileSync(outputPath, output);
  } else {
    process.stdout.write(output);
  }
} finally {
  await client.end();
}
