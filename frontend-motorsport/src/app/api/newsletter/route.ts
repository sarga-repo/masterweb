import { NextResponse } from "next/server";

import { newsletterSubscriptionSchema } from "@/lib/validation";

const attempts = new Map<string, number[]>();

function fingerprint(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "local"
  );
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const active = (attempts.get(key) ?? []).filter(
    (timestamp) => now - timestamp < 10 * 60 * 1000,
  );
  active.push(now);
  attempts.set(key, active);
  return active.length > 5;
}

function isPlaceholderMode(): boolean {
  const mode = process.env.FORM_SUBMISSION_MODE;
  return (
    mode === "placeholder" || (!mode && process.env.NODE_ENV !== "production")
  );
}

export async function POST(request: Request) {
  if (isRateLimited(`ms-newsletter:${fingerprint(request)}`)) {
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

  const parsed = newsletterSubscriptionSchema.safeParse(body);
  if (!parsed.success || parsed.data.website) {
    return NextResponse.json(
      { ok: false, message: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  if (isPlaceholderMode()) {
    return NextResponse.json({
      ok: true,
      message: "You're on the grid. (Local placeholder mode.)",
    });
  }

  const strapiUrl =
    process.env.STRAPI_API_URL ?? process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const token = process.env.STRAPI_API_TOKEN;

  if (!strapiUrl || !token) {
    return NextResponse.json(
      { ok: false, message: "Newsletter delivery is not configured." },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(
      `${strapiUrl.replace(/\/$/, "")}/api/newsletter-subscriptions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            email: parsed.data.email,
            sourcePage: parsed.data.sourcePage,
            consent: true,
            subscribedAt: new Date().toISOString(),
            status: "active",
          },
        }),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          ok: false,
          message: "We could not subscribe this address right now.",
        },
        { status: response.status === 400 ? 409 : 502 },
      );
    }
  } catch {
    return NextResponse.json(
      { ok: false, message: "We could not subscribe this address right now." },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: "You're on the grid. Watch your inbox.",
  });
}
