"use client";

import { useEffect } from "react";

export default function MotorsportError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07142f] px-6 text-[#fff9ee]">
      <section className="max-w-xl border border-white/20 bg-black/35 p-8 sm:p-12">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-[#00c4cc]">
          Motorsport CMS preview
        </p>
        <h1 className="font-display text-3xl uppercase leading-[0.95] sm:text-5xl">
          This page could not be rendered.
        </h1>
        <p className="mt-5 max-w-lg text-sm leading-7 text-white/70">
          The saved CMS draft could not be read. Ask an administrator to verify
          the Motorsport Preview API token and content permissions, then retry.
          Curated fallback content is intentionally disabled in Preview.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 border border-[#ff6b00] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[#fff9ee]"
        >
          Retry preview
        </button>
        <a
          href="/api/preview/exit"
          className="ml-3 inline-block border border-white/25 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white/75 hover:border-white hover:text-white"
        >
          Exit preview
        </a>
      </section>
    </main>
  );
}
