"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  previewRevisionFingerprint,
  type PreviewRevision,
} from "@/lib/preview/live-preview";

const POLL_INTERVAL_MS = 2_000;

type HeartbeatResponse =
  | { ok: true; revision: PreviewRevision }
  | { ok: false; error?: string };

export default function PreviewLiveRefresh() {
  const router = useRouter();
  const fingerprint = useRef<string | null>(null);
  const refreshing = useRef(false);
  const [state, setState] = useState<"watching" | "refreshing" | "paused">(
    "watching",
  );

  useEffect(() => {
    let stopped = false;

    async function checkRevision() {
      if (stopped || document.visibilityState === "hidden") return;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5_000);
      try {
        const response = await fetch("/api/preview/heartbeat", {
          cache: "no-store",
          credentials: "same-origin",
          signal: controller.signal,
        });
        const payload = (await response.json()) as HeartbeatResponse;
        if (!response.ok || !payload.ok) {
          setState("paused");
          return;
        }

        const nextFingerprint = previewRevisionFingerprint(payload.revision);
        if (fingerprint.current === null) {
          fingerprint.current = nextFingerprint;
          setState("watching");
          return;
        }
        if (fingerprint.current === nextFingerprint || refreshing.current) {
          setState("watching");
          return;
        }

        fingerprint.current = nextFingerprint;
        refreshing.current = true;
        setState("refreshing");
        router.refresh();
        window.setTimeout(() => {
          refreshing.current = false;
        }, 750);
      } catch {
        setState("paused");
      } finally {
        clearTimeout(timeout);
      }
    }

    void checkRevision();
    const interval = window.setInterval(() => void checkRevision(), POLL_INTERVAL_MS);
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") void checkRevision();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      stopped = true;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [router]);

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 left-4 z-[100] border border-[#00c4cc]/45 bg-[#07142f]/95 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#fff9ee] shadow-lg backdrop-blur"
    >
      <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[#00c4cc]" />
      {state === "refreshing"
        ? "Preview updating"
        : state === "paused"
          ? "Preview paused"
          : "Live preview on save"}
    </div>
  );
}
