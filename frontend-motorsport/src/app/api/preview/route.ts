import { createHash, timingSafeEqual } from "node:crypto";
import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";

import {
  isAllowedPreviewRequestOrigin,
  parsePreviewAdminOrigins,
} from "@/lib/preview/preview-origin";
import {
  isSafePreviewPath,
  normalizePreviewStatus,
} from "@/lib/preview/preview-path";
import {
  isMotorsportPreviewUid,
  isSafePreviewDocumentId,
  MOTORSPORT_PREVIEW_COOKIE,
  signPreviewContext,
} from "@/lib/preview/preview-context";

function secretsMatch(provided: string | null, expected: string | undefined) {
  if (!provided || !expected) return false;
  const providedDigest = createHash("sha256").update(provided).digest();
  const expectedDigest = createHash("sha256").update(expected).digest();
  return timingSafeEqual(providedDigest, expectedDigest);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("url");
  const status = normalizePreviewStatus(searchParams.get("status"));
  const uid = searchParams.get("uid");
  const documentId = searchParams.get("documentId");
  const locale = searchParams.get("locale");
  const allowedOrigins = parsePreviewAdminOrigins(
    process.env.PREVIEW_ADMIN_ORIGINS ?? process.env.CMS_ADMIN_ORIGIN,
  );

  if (
    !secretsMatch(searchParams.get("secret"), process.env.PREVIEW_SECRET) ||
    !isSafePreviewPath(path) ||
    !status ||
    !isMotorsportPreviewUid(uid) ||
    !isSafePreviewDocumentId(documentId) ||
    (locale !== "en" && locale !== "id") ||
    !isAllowedPreviewRequestOrigin(request, allowedOrigins)
  ) {
    return new Response("Invalid preview request", {
      status: 401,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const mode = await draftMode();
  mode.enable();

  const secret = process.env.PREVIEW_SECRET!;
  const store = await cookies();
  store.set(
    MOTORSPORT_PREVIEW_COOKIE,
    signPreviewContext(
      {
        uid,
        documentId,
        locale,
        status,
        pathname: path,
        expiresAt: Date.now() + 30 * 60 * 1_000,
      },
      secret,
    ),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 60,
      path: "/",
    },
  );

  redirect(path);
}
