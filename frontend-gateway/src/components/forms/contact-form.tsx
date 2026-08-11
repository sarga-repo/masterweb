"use client";

import { useRef, useState, type FormEvent } from "react";
import { usePathname } from "next/navigation";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { FormFieldErrors } from "@/lib/validation/forms";
import { localeFromPathname } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

const inquiryOptions = [
  { value: "partnership", label: "Partnership" },
  { value: "sponsorship", label: "Sponsorship" },
  { value: "media", label: "Media" },
  { value: "event", label: "Event" },
  { value: "venue", label: "Venue" },
  { value: "career", label: "Careers" },
  { value: "general", label: "General business" },
];

const indonesianInquiryLabels: Record<string, string> = {
  partnership: "Kemitraan",
  sponsorship: "Sponsor",
  media: "Media",
  event: "Acara",
  venue: "Venue",
  career: "Karier",
  general: "Bisnis umum",
};

type SubmissionState = {
  status: "idle" | "submitting" | "success" | "error";
  message?: string;
  errors?: FormFieldErrors;
};

export function ContactForm() {
  const pathname = usePathname();
  const locale = localeFromPathname(pathname);
  const dictionary = getDictionary(locale);
  const localizedInquiryOptions = inquiryOptions.map((option) => ({
    ...option,
    label:
      locale === "id" ? indonesianInquiryLabels[option.value] : option.label,
  }));
  const formRef = useRef<HTMLFormElement>(null);
  const startedAt = useRef<number | null>(null);
  const [state, setState] = useState<SubmissionState>({ status: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: "submitting" });
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Sarga-Locale": locale,
        },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
          company: form.get("company"),
          inquiryType: form.get("inquiryType"),
          message: form.get("message"),
          website: form.get("website"),
          sourcePage: window.location.pathname,
          sourceLocale: locale,
          formStartedAt: startedAt.current ?? 0,
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
          message: result.message ?? dictionary.form.retry,
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
        message: dictionary.form.inquiryUnavailable,
      });
    }
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
      className="grid gap-6"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <Input
          name="name"
          label={dictionary.form.name}
          autoComplete="name"
          required
          error={errors.name}
        />
        <Input
          name="email"
          label={dictionary.form.email}
          type="email"
          autoComplete="email"
          required
          error={errors.email}
        />
        <Input
          name="phone"
          label={dictionary.form.phone}
          type="tel"
          autoComplete="tel"
          error={errors.phone}
        />
        <Input
          name="company"
          label={dictionary.form.company}
          autoComplete="organization"
          error={errors.company}
        />
      </div>
      <Select
        name="inquiryType"
        label={dictionary.form.inquiryType}
        options={localizedInquiryOptions}
        placeholder={dictionary.form.chooseDesk}
        required
        error={errors.inquiryType}
      />
      <Textarea
        name="message"
        label={dictionary.form.message}
        rows={7}
        required
        minLength={20}
        maxLength={5000}
        hint={dictionary.form.messageHint}
        error={errors.message}
      />
      <input
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        hidden
      />
      <div className="flex flex-col gap-5 border-t border-sarga-black/20 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-xs leading-6 text-sarga-text-muted">
          {dictionary.form.protection}
        </p>
        <button
          type="submit"
          disabled={state.status === "submitting"}
          className="group inline-flex min-h-14 items-center justify-center gap-4 bg-sarga-red px-7 text-xs font-extrabold uppercase tracking-[0.16em] text-white transition-colors hover:bg-sarga-red-dark disabled:cursor-wait disabled:opacity-60"
        >
          {state.status === "submitting"
            ? dictionary.form.routing
            : dictionary.form.send}
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
      <p
        aria-live="polite"
        className={`min-h-6 text-sm font-semibold ${
          state.status === "success" ? "text-emerald-700" : "text-sarga-red"
        }`}
      >
        {state.message}
      </p>
    </form>
  );
}
