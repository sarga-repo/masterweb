import { NextResponse } from "next/server";
import {
  isRateLimited,
  passedTimingCheck,
  requestFingerprint,
  verifyRecaptcha,
} from "@/lib/forms/security";
import { deliverInquiry } from "@/lib/forms/submit";
import { contactFormSchema, flattenFormErrors } from "@/lib/validation/forms";

function message(locale: "en" | "id", english: string, indonesian: string) {
  return locale === "id" ? indonesian : english;
}

export async function POST(request: Request) {
  const headerLocale =
    request.headers.get("x-sarga-locale") === "id" ? "id" : "en";
  const fingerprint = requestFingerprint(request);
  if (isRateLimited(`contact:${fingerprint}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json(
      {
        ok: false,
        message: message(
          headerLocale,
          "Too many attempts. Please try again later.",
          "Terlalu banyak percobaan. Silakan coba lagi nanti.",
        ),
      },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: message(
          headerLocale,
          "The submitted data could not be read.",
          "Data yang dikirim tidak dapat dibaca.",
        ),
      },
      { status: 400 },
    );
  }

  const requestedLocale =
    typeof body === "object" &&
    body &&
    "sourceLocale" in body &&
    body.sourceLocale === "id"
      ? "id"
      : headerLocale;

  const parsed = contactFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: message(
          requestedLocale,
          "Please review the highlighted fields.",
          "Periksa kembali kolom yang ditandai.",
        ),
        errors:
          requestedLocale === "id"
            ? Object.fromEntries(
                Object.keys(flattenFormErrors(parsed.error)).map((field) => [
                  field,
                  field === "email"
                    ? "Masukkan alamat email yang valid."
                    : "Kolom ini perlu diperiksa.",
                ]),
              )
            : flattenFormErrors(parsed.error),
      },
      { status: 400 },
    );
  }

  const { website, formStartedAt, recaptchaToken, ...payload } = parsed.data;
  if (website || !passedTimingCheck(formStartedAt)) {
    return NextResponse.json(
      {
        ok: false,
        message: message(
          requestedLocale,
          "Spam protection rejected this submission.",
          "Perlindungan spam menolak pengiriman ini.",
        ),
      },
      { status: 400 },
    );
  }
  if (!(await verifyRecaptcha(recaptchaToken, fingerprint))) {
    return NextResponse.json(
      {
        ok: false,
        message: message(
          requestedLocale,
          "Spam verification failed. Please try again.",
          "Verifikasi spam gagal. Silakan coba lagi.",
        ),
      },
      { status: 400 },
    );
  }

  const result = await deliverInquiry(payload);
  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        message: message(
          requestedLocale,
          "We could not route your inquiry right now.",
          "Pertanyaan Anda belum dapat kami kirim saat ini.",
        ),
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: result.placeholder
      ? message(
          requestedLocale,
          "Inquiry validated in local placeholder mode.",
          "Pertanyaan tervalidasi dalam mode lokal.",
        )
      : message(
          requestedLocale,
          "Thank you. Your inquiry has been received.",
          "Terima kasih. Pertanyaan Anda telah kami terima.",
        ),
  });
}
