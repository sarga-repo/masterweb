import { NextResponse } from "next/server";
import {
  isRateLimited,
  passedTimingCheck,
  requestFingerprint,
  verifyRecaptcha,
} from "@/lib/forms/security";
import { deliverNewsletter } from "@/lib/forms/submit";
import {
  flattenFormErrors,
  newsletterFormSchema,
} from "@/lib/validation/forms";

export async function POST(request: Request) {
  const fingerprint = requestFingerprint(request);
  if (isRateLimited(`newsletter:${fingerprint}`, 10, 10 * 60 * 1000)) {
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

  const parsed = newsletterFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Please enter a valid email address.",
        errors: flattenFormErrors(parsed.error),
      },
      { status: 400 },
    );
  }

  const { website, formStartedAt, recaptchaToken, ...payload } = parsed.data;
  if (website || !passedTimingCheck(formStartedAt)) {
    return NextResponse.json(
      { ok: false, message: "Spam protection rejected this subscription." },
      { status: 400 },
    );
  }
  if (!(await verifyRecaptcha(recaptchaToken, fingerprint))) {
    return NextResponse.json(
      { ok: false, message: "Spam verification failed. Please try again." },
      { status: 400 },
    );
  }

  const result = await deliverNewsletter(payload);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, message: "Subscription is temporarily unavailable." },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: result.placeholder
      ? "Subscription validated in local placeholder mode."
      : "You are now subscribed to Sarga updates.",
  });
}
