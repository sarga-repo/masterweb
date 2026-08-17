import { timingSafeEqual } from "node:crypto";

import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import {
  revalidationTargets,
  type MotorsportRevalidationPayload,
} from "@/lib/cms-revalidation";

export const runtime = "nodejs";

function authorized(request: Request) {
  const configured = process.env.MOTORSPORT_REVALIDATION_SECRET;
  const supplied = request.headers.get("x-sarga-revalidation-secret");
  if (!configured || !supplied) return false;
  const expected = Buffer.from(configured);
  const received = Buffer.from(supplied);
  return (
    expected.length === received.length && timingSafeEqual(expected, received)
  );
}

function isPayload(value: unknown): value is MotorsportRevalidationPayload {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.contentType === "string" &&
    candidate.contentType.length > 0 &&
    (candidate.locale === undefined ||
      candidate.locale === "en" ||
      candidate.locale === "id")
  );
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid-json" },
      { status: 400 },
    );
  }
  if (!isPayload(payload)) {
    return NextResponse.json(
      { ok: false, error: "invalid-payload" },
      { status: 400 },
    );
  }

  const targets = revalidationTargets(payload);
  // A CMS publish webhook is an explicit invalidation boundary. Expire the
  // matching data immediately instead of serving one stale-while-revalidate
  // response, which is especially important after unpublish/delete.
  for (const tag of targets.tags) revalidateTag(tag, { expire: 0 });
  for (const path of targets.paths) revalidatePath(path, "page");

  if (
    targets.collection === "sites" ||
    targets.collection === "top-navigation-items"
  ) {
    revalidatePath("/", "layout");
  }

  return NextResponse.json({
    ok: true,
    collection: targets.collection,
    paths: targets.paths,
    tags: targets.tags,
    revalidatedAt: new Date().toISOString(),
  });
}
