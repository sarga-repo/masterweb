import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import pg from "pg";

const { Client } = pg;
const cmsRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
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

function schemaFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const candidate = path.join(directory, entry.name);
    if (entry.isDirectory()) return schemaFiles(candidate);
    return entry.name === "schema.json" ? [candidate] : [];
  });
}

function uploadInventory(directory) {
  if (!fs.existsSync(directory)) return { files: 0, bytes: 0 };
  let files = 0;
  let bytes = 0;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const candidate = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      const nested = uploadInventory(candidate);
      files += nested.files;
      bytes += nested.bytes;
    } else if (entry.isFile()) {
      files += 1;
      bytes += fs.statSync(candidate).size;
    }
  }
  return { files, bytes };
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

async function contentTableInventory(schema) {
  const tableName = schema.collectionName;
  if (!(await tableExists(tableName))) {
    return { tableName, exists: false };
  }

  const columns = await columnNames(tableName);
  const hasDocumentId = columns.has("document_id");
  const hasLocale = columns.has("locale");
  const hasPublishedAt = columns.has("published_at");
  const queries = [
    "count(*)::int as rows",
    hasDocumentId
      ? "count(distinct document_id)::int as documents"
      : "count(*)::int as documents",
    hasLocale
      ? "count(*) filter (where locale is null)::int as null_locale_rows"
      : "0::int as null_locale_rows",
    hasPublishedAt
      ? "count(*) filter (where published_at is null)::int as draft_rows"
      : "0::int as draft_rows",
    hasPublishedAt
      ? "count(*) filter (where published_at is not null)::int as published_rows"
      : "0::int as published_rows",
  ];
  const aggregate = await client.query(
    `select ${queries.join(", ")} from ${client.escapeIdentifier(tableName)}`,
  );

  let locales = {};
  if (hasLocale) {
    const localeRows = await client.query(
      `select coalesce(locale, '<null>') as locale, count(*)::int as rows
         from ${client.escapeIdentifier(tableName)}
        group by locale
        order by locale`,
    );
    locales = Object.fromEntries(
      localeRows.rows.map((row) => [row.locale, row.rows]),
    );
  }

  return {
    tableName,
    exists: true,
    ...aggregate.rows[0],
    locales,
  };
}

await client.connect();
try {
  const schemas = schemaFiles(apiRoot)
    .map((file) => ({
      file,
      schema: JSON.parse(fs.readFileSync(file, "utf8")),
    }))
    .sort((left, right) =>
      left.schema.collectionName.localeCompare(right.schema.collectionName),
    );
  const tables = [];
  for (const { file, schema } of schemas) {
    tables.push({
      uid: `api::${schema.info.singularName}.${schema.info.singularName}`,
      localized: schema.pluginOptions?.i18n?.localized === true,
      schema: path.relative(cmsRoot, file),
      ...(await contentTableInventory(schema)),
    });
  }

  const localeRows = await client.query(
    "select code, name from i18n_locale order by code",
  );
  const uploadRows = (await tableExists("files"))
    ? await client.query(
        "select count(*)::int as files, coalesce(sum(size), 0)::numeric as kilobytes from files",
      )
    : { rows: [{ files: 0, kilobytes: 0 }] };
  const inventory = {
    generatedAt: new Date().toISOString(),
    database: process.env.DATABASE_NAME ?? "sarga_strapi",
    locales: localeRows.rows,
    contentTypes: tables,
    mediaDatabase: uploadRows.rows[0],
    uploads: uploadInventory(path.join(cmsRoot, "public", "uploads")),
  };
  const json = `${JSON.stringify(inventory, null, 2)}\n`;
  if (outputPath) {
    fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
    fs.writeFileSync(outputPath, json);
  } else {
    process.stdout.write(json);
  }
} finally {
  await client.end();
}
