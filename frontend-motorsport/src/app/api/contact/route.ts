import { NextResponse } from "next/server";

import {
  contactFormSchema,
  flattenFormErrors,
} from "@/lib/validation";

/* ── Rate limiting (in-memory, per-process) ──────────────────────────────── */
const attempts = new Map<string, number[]>();

function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const active = (attempts.get(key) ?? []).filter(
    (ts) => now - ts < windowMs,
  );
  active.push(now);
  attempts.set(key, active);
  return active.length > limit;
}

function fingerprint(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "local"
  );
}

function passedTimingCheck(formStartedAt: number): boolean {
  const elapsed = Date.now() - formStartedAt;
  return elapsed >= 800 && elapsed <= 24 * 60 * 60 * 1000;
}

/* ── Delivery (placeholder mode for local dev) ───────────────────────────── */
function isPlaceholderMode(): boolean {
  const mode = process.env.FORM_SUBMISSION_MODE;
  return mode === "placeholder" || (!mode && process.env.NODE_ENV !== "production");
}

/* ── POST /api/contact ───────────────────────────────────────────────────── */
export async function POST(request: Request) {
  const fp = fingerprint(request);

  if (isRateLimited(`ms-contact:${fp}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json(
      { ok: false, message: "Too many attempts. Please try again later." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "The submitted data could not be read." },
      { status: 400 },
    );
  }

  const parsed = contactFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Please review the highlighted fields.",
        errors: flattenFormErrors(parsed.error),
      },
      { status: 400 },
    );
  }

  const { website, formStartedAt, ...payload } = parsed.data;

  if (website || !passedTimingCheck(formStartedAt)) {
    return NextResponse.json(
      { ok: false, message: "Spam protection rejected this submission." },
      { status: 400 },
    );
  }

  /* In placeholder mode we validate but don't persist. */
  if (isPlaceholderMode()) {
    return NextResponse.json({
      ok: true,
      message: "Message received. (Local placeholder mode.)",
    });
  }

  /* Production: forward to Strapi or email service. */
  const strapiUrl =
    process.env.STRAPI_API_URL ?? process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const token = process.env.STRAPI_API_TOKEN;

  if (strapiUrl && token) {
    try {
      const res = await fetch(`${strapiUrl}/api/inquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: payload }),
        cache: "no-store",
      });
      if (!res.ok) {
        return NextResponse.json(
          { ok: false, message: "We could not route your inquiry right now." },
          { status: 502 },
        );
      }
    } catch {
      return NextResponse.json(
        { ok: false, message: "We could not route your inquiry right now." },
        { status: 502 },
      );
    }
  }

  return NextResponse.json({
    ok: true,
    message: "Thank you. Your inquiry has been received.",
  });
}
