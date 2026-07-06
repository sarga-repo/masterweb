import { NextResponse } from "next/server";
import {
  isRateLimited,
  passedTimingCheck,
  requestFingerprint,
  verifyRecaptcha,
} from "@/lib/forms/security";
import { deliverInquiry } from "@/lib/forms/submit";
import { contactFormSchema, flattenFormErrors } from "@/lib/validation/forms";

export async function POST(request: Request) {
  const fingerprint = requestFingerprint(request);
  if (isRateLimited(`contact:${fingerprint}`, 5, 10 * 60 * 1000)) {
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

  const { website, formStartedAt, recaptchaToken, ...payload } = parsed.data;
  if (website || !passedTimingCheck(formStartedAt)) {
    return NextResponse.json(
      { ok: false, message: "Spam protection rejected this submission." },
      { status: 400 },
    );
  }
  if (!(await verifyRecaptcha(recaptchaToken, fingerprint))) {
    return NextResponse.json(
      { ok: false, message: "Spam verification failed. Please try again." },
      { status: 400 },
    );
  }

  const result = await deliverInquiry(payload);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, message: "We could not route your inquiry right now." },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: result.placeholder
      ? "Thank you. Your inquiry has been received."
      : "Thank you. Your inquiry has been received.",
  });
}
