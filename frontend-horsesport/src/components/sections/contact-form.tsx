"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

import { ArrowRightIcon } from "@/components/ui/icons";
import type { FormFieldErrors } from "@/lib/validation/forms";

const INQUIRY_OPTIONS: { value: string; label: string }[] = [
  { value: "general", label: "General" },
  { value: "ticketing", label: "Ticketing" },
  { value: "partnership", label: "Partnership" },
  { value: "sponsorship", label: "Sponsorship" },
  { value: "media", label: "Media" },
  { value: "event", label: "Event" },
  { value: "venue", label: "Venue" },
  { value: "stable", label: "Stable" },
];

const fieldClass =
  "w-full rounded-[var(--radius-hs-md)] border border-hs-cream/20 bg-hs-black/40 px-5 py-3.5 text-sm text-hs-cream placeholder:text-hs-cream/35 focus:border-hs-orange focus:outline-none";

type SubmissionState = {
  status: "idle" | "submitting" | "success" | "error";
  message?: string;
  errors?: FormFieldErrors;
};

/**
 * Horse Sport contact form. Posts to the server-validated `/api/contact`
 * endpoint (zod schema + honeypot + timing check + rate limit) which persists
 * inquiries to the shared CMS tagged sourceSite="horsesport".
 */
export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const startedAt = useRef<number | null>(null);
  const [state, setState] = useState<SubmissionState>({ status: "idle" });

  // Arm the timing check on mount so the form works even without a focus event;
  // focus also arms it (below) for the earliest possible baseline.
  useEffect(() => {
    startedAt.current ??= Date.now();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: "submitting" });
    const form = new FormData(event.currentTarget);
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
          inquiryType: form.get("inquiryType"),
          message: form.get("message"),
          website: form.get("website") ?? "",
          sourcePage: window.location.pathname,
          sourceLocale,
          formStartedAt: startedAt.current ?? Date.now(),
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
          message: result.message ?? "Please try again.",
          errors: result.errors,
        });
        return;
      }

      formRef.current?.reset();
      startedAt.current = null;
      setState({ status: "success", message: result.message });
    } catch {
      setState({
        status: "error",
        message: "The inquiry desk is temporarily unavailable.",
      });
    }
  }

  if (state.status === "success") {
    return (
      <div className="hs-card-glass p-10 text-center">
        <p className="hs-display text-2xl text-hs-cream">Thank you.</p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-hs-cream/60">
          {state.message ??
            "Your message has been received. Our team will be in touch shortly."}
        </p>
        <button
          type="button"
          onClick={() => setState({ status: "idle" })}
          className="hs-pill mt-6 inline-flex border border-hs-cream/20 px-6 py-3 text-[0.66rem] font-extrabold uppercase tracking-[0.14em] text-hs-cream/75 hover:border-hs-orange hover:text-hs-orange"
        >
          Send another
        </button>
      </div>
    );
  }

  const errors = state.errors ?? {};

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onFocusCapture={() => {
        startedAt.current ??= Date.now();
      }}
      noValidate
      className="hs-card-glass p-7 sm:p-9"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="hs-kicker text-hs-cream/55">Name</span>
          <input
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder="Your full name"
            className={`mt-2 ${fieldClass}`}
          />
          {errors.name ? (
            <span className="mt-1.5 block text-xs text-hs-red">
              {errors.name}
            </span>
          ) : null}
        </label>
        <label className="block">
          <span className="hs-kicker text-hs-cream/55">Email</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            className={`mt-2 ${fieldClass}`}
          />
          {errors.email ? (
            <span className="mt-1.5 block text-xs text-hs-red">
              {errors.email}
            </span>
          ) : null}
        </label>
      </div>

      <label className="mt-5 block">
        <span className="hs-kicker text-hs-cream/55">Inquiry type</span>
        <select
          name="inquiryType"
          required
          defaultValue="general"
          className={`mt-2 ${fieldClass}`}
        >
          {INQUIRY_OPTIONS.map((t) => (
            <option
              key={t.value}
              value={t.value}
              className="bg-hs-night text-hs-cream"
            >
              {t.label}
            </option>
          ))}
        </select>
        {errors.inquiryType ? (
          <span className="mt-1.5 block text-xs text-hs-red">
            {errors.inquiryType}
          </span>
        ) : null}
      </label>

      <label className="mt-5 block">
        <span className="hs-kicker text-hs-cream/55">Message</span>
        <textarea
          name="message"
          required
          rows={5}
          minLength={20}
          maxLength={5000}
          placeholder="How can we help?"
          className={`mt-2 resize-y ${fieldClass}`}
        />
        {errors.message ? (
          <span className="mt-1.5 block text-xs text-hs-red">
            {errors.message}
          </span>
        ) : null}
      </label>

      {/* Honeypot - must stay empty; hidden from users and assistive tech. */}
      <input
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        hidden
      />

      <button
        type="submit"
        disabled={state.status === "submitting"}
        className="hs-pill hs-interactive group mt-7 inline-flex items-center gap-3 bg-hs-red px-8 py-4 text-[0.7rem] font-extrabold uppercase tracking-[0.14em] text-hs-white hover:bg-hs-orange disabled:cursor-wait disabled:opacity-60"
      >
        {state.status === "submitting" ? "Sending…" : "Send message"}
        <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
      </button>

      {state.status === "error" && state.message ? (
        <p
          aria-live="polite"
          className="mt-4 text-sm font-semibold text-hs-red"
        >
          {state.message}
        </p>
      ) : (
        <p className="mt-4 text-xs leading-5 text-hs-cream/35">
          Protected by a honeypot, a timing check, and rate limiting. By
          submitting, you agree to be contacted about your inquiry.
        </p>
      )}
    </form>
  );
}
