const attempts = new Map<string, number[]>();

export function isRateLimited(
  key: string,
  limit: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const active = (attempts.get(key) ?? []).filter(
    (timestamp) => now - timestamp < windowMs,
  );
  active.push(now);
  attempts.set(key, active);
  return active.length > limit;
}

export function requestFingerprint(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "local"
  );
}

export function passedTimingCheck(formStartedAt: number): boolean {
  const elapsed = Date.now() - formStartedAt;
  return elapsed >= 800 && elapsed <= 24 * 60 * 60 * 1000;
}

export async function verifyRecaptcha(
  token: string | undefined,
  remoteIp: string,
): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  try {
    const body = new URLSearchParams({
      secret,
      response: token,
      remoteip: remoteIp,
    });
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      { method: "POST", body, cache: "no-store" },
    );
    const result = (await response.json()) as { success?: boolean };
    return response.ok && result.success === true;
  } catch {
    return false;
  }
}
