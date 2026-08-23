import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

import { strapiConfig } from "@/lib/strapi/config";
import {
  isPreviewSingleTypeCollection,
  previewCollectionForUid,
} from "@/lib/preview/preview-context";
import { getMotorsportPreviewContext } from "@/lib/preview/preview-request-context";

export const runtime = "nodejs";

type RevisionDocument = {
  documentId?: unknown;
  updatedAt?: unknown;
  publishedAt?: unknown;
};

function response(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

function isRevisionDocument(value: unknown): value is RevisionDocument {
  return Boolean(value && typeof value === "object");
}

/**
 * Returns only the selected preview document's revision marker. The browser
 * never receives the CMS token or the draft payload; it only uses this marker
 * to know when a saved CMS edit requires a Next router refresh.
 */
export async function GET() {
  const mode = await draftMode();
  const context = await getMotorsportPreviewContext();
  if (!mode.isEnabled || !context) {
    return response({ ok: false, error: "preview-required" }, 401);
  }

  const collection = previewCollectionForUid(context.uid);
  const params = new URLSearchParams({
    locale: context.locale,
    status: context.status,
    "fields[0]": "updatedAt",
    "fields[1]": "publishedAt",
  });
  if (isPreviewSingleTypeCollection(collection)) {
    params.set("fields[2]", "documentId");
  } else {
    params.set("filters[documentId][$eq]", context.documentId);
    params.set("pagination[pageSize]", "1");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4_000);
  try {
    const cmsResponse = await fetch(
      `${strapiConfig.apiUrl}/api/${collection}?${params.toString()}`,
      {
        cache: "no-store",
        signal: controller.signal,
        headers: strapiConfig.apiToken
          ? { Authorization: `Bearer ${strapiConfig.apiToken}` }
          : undefined,
      },
    );
    if (!cmsResponse.ok) {
      return response({ ok: false, error: "cms-unavailable" }, 503);
    }

    const payload = (await cmsResponse.json()) as {
      data?: unknown;
    };
    const document = isPreviewSingleTypeCollection(collection)
      ? payload.data
      : Array.isArray(payload.data)
        ? payload.data[0]
        : null;
    if (!isRevisionDocument(document)) {
      return response({ ok: false, error: "document-not-found" }, 404);
    }

    const documentId =
      typeof document.documentId === "string"
        ? document.documentId
        : context.documentId;
    return response({
      ok: true,
      revision: {
        documentId,
        updatedAt:
          typeof document.updatedAt === "string" ? document.updatedAt : null,
        publishedAt:
          typeof document.publishedAt === "string"
            ? document.publishedAt
            : null,
        status: context.status,
      },
    });
  } catch {
    return response({ ok: false, error: "cms-unavailable" }, 503);
  } finally {
    clearTimeout(timeout);
  }
}
