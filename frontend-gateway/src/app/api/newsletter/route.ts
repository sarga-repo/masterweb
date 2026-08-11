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

function message(locale: "en" | "id", english: string, indonesian: string) {
  return locale === "id" ? indonesian : english;
}

export async function POST(request: Request) {
  const headerLocale =
    request.headers.get("x-sarga-locale") === "id" ? "id" : "en";
  const fingerprint = requestFingerprint(request);
  if (isRateLimited(`newsletter:${fingerprint}`, 10, 10 * 60 * 1000)) {
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

  const parsed = newsletterFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: message(
          requestedLocale,
          "Please enter a valid email address.",
          "Masukkan alamat email yang valid.",
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
          "Spam protection rejected this subscription.",
          "Perlindungan spam menolak pendaftaran ini.",
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

  const result = await deliverNewsletter(payload);
  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        message: message(
          requestedLocale,
          "Subscription is temporarily unavailable.",
          "Layanan berlangganan sementara tidak tersedia.",
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
          "Subscription validated in local placeholder mode.",
          "Pendaftaran tervalidasi dalam mode lokal.",
        )
      : message(
          requestedLocale,
          "You are now subscribed to Sarga updates.",
          "Anda kini berlangganan informasi terbaru Sarga.",
        ),
  });
}
