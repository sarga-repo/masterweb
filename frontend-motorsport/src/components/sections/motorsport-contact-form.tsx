"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

import { ArrowRightIcon } from "@/components/ui/icons";
import type { FormFieldErrors } from "@/lib/validation";

const CATEGORIES = [
  ["general", "General inquiry"],
  ["partnership", "Partnership / sponsorship"],
  ["media", "Media inquiry"],
  ["event-ticket", "Event / ticket support"],
  ["talent-program", "IJTC / Become Riders"],
  ["merchandise", "Merchandise inquiry"],
  ["vendor", "Vendor inquiry"],
] as const;

type FormState = {
  status: "idle" | "submitting" | "success" | "error";
  message?: string;
  errors?: FormFieldErrors;
};

const fieldClass =
  "mt-2 w-full border border-ms-warm-white/22 bg-[#071a3d]/85 px-4 text-sm text-ms-warm-white placeholder:text-ms-warm-white/38 focus:border-ms-electric-yellow focus:outline-none";

export function MotorsportContactForm() {
  const [state, setState] = useState<FormState>({ status: "idle" });
  const startedAt = useRef<number | null>(null);

  useEffect(() => {
    startedAt.current ??= Date.now();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: "submitting" });
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const sourceLocale =
      window.location.pathname === "/id" ||
      window.location.pathname.startsWith("/id/")
        ? "id"
        : "en";

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Sarga-Locale": sourceLocale,
        },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          category: form.get("category"),
          message: form.get("message"),
          website: form.get("website") ?? "",
          formStartedAt: startedAt.current ?? Date.now(),
          sourcePage: window.location.pathname,
          sourceLocale,
        }),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        message?: string;
        errors?: FormFieldErrors;
      };
      if (!response.ok || !result.ok) {
        setState({
          status: "error",
          message: result.message,
          errors: result.errors,
        });
        return;
      }
      formElement.reset();
      setState({ status: "success", message: result.message });
    } catch {
      setState({
        status: "error",
        message:
          sourceLocale === "id"
            ? "Jaringan bermasalah. Silakan coba lagi."
            : "Network error. Please try again.",
      });
    }
  }

  if (state.status === "success") {
    return (
      <div role="status" className="ms-blue-panel ms-panel mt-12 p-10">
        <span className="ms-kicker text-ms-electric-yellow">
          Message received
        </span>
        <p className="mt-4 text-lg text-ms-warm-white/70">
          {state.message ?? "Thank you. Our team will respond by email."}
        </p>
      </div>
    );
  }

  const errors = state.errors ?? {};
  return (
    <form
      className="mt-12 space-y-6"
      onSubmit={handleSubmit}
      onFocusCapture={() => {
        startedAt.current ??= Date.now();
      }}
      noValidate
    >
      {state.status === "error" && state.message ? (
        <p
          role="alert"
          className="border border-ms-apex-crimson/40 bg-ms-apex-crimson/10 px-5 py-4 text-sm"
        >
          {state.message}
        </p>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Name" name="name" error={errors.name} />
        <Field label="Email" name="email" type="email" error={errors.email} />
      </div>
      <label className="block">
        <span className="ms-data-label text-ms-warm-white/42">
          Inquiry category
        </span>
        <select
          name="category"
          className={`${fieldClass} h-(--ms-control-height)`}
        >
          {CATEGORIES.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="ms-data-label text-ms-warm-white/42">Message</span>
        <textarea
          name="message"
          required
          rows={6}
          minLength={20}
          className={`${fieldClass} py-3`}
          placeholder="Tell us what you need (at least 20 characters)…"
        />
        {errors.message ? (
          <span className="mt-2 block text-xs">{errors.message}</span>
        ) : null}
      </label>
      <button
        type="submit"
        disabled={state.status === "submitting"}
        className="group flex h-(--ms-control-height) items-center gap-4 bg-ms-apex-crimson px-8 text-[0.66rem] font-black uppercase tracking-[0.16em] transition-colors hover:bg-ms-ignition-orange disabled:opacity-50"
      >
        {state.status === "submitting" ? "Sending…" : "Send message"}
        <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
      </button>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="new-password"
        className="absolute -left-[9999px] h-px w-px opacity-0"
        aria-hidden="true"
      />
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  error,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="ms-data-label text-ms-warm-white/42">{label}</span>
      <input
        name={name}
        type={type}
        required
        autoComplete={name}
        aria-invalid={Boolean(error)}
        className={`${fieldClass} h-(--ms-control-height)`}
      />
      {error ? <span className="mt-2 block text-xs">{error}</span> : null}
    </label>
  );
}
