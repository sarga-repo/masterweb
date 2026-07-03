import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type FieldTone = "light" | "dark";

/** Shared control styling for Input / Textarea / Select. */
export function controlClasses(tone: FieldTone, hasError: boolean): string {
  return cn(
    "w-full rounded-sarga-sm border px-4 py-3 text-sm outline-none transition-colors placeholder:text-current/45 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-sarga-orange",
    tone === "dark"
      ? "border-white/20 bg-white/5 text-white"
      : "border-sarga-border bg-white text-sarga-text",
    hasError && "border-sarga-red",
  );
}

type FieldShellProps = {
  fieldId: string;
  label: string;
  hint?: string;
  error?: string;
  tone: FieldTone;
  hideLabel?: boolean;
  required?: boolean;
  children: ReactNode;
};

/** Renders an accessible label, the control, and hint/error text. */
export function FieldShell({
  fieldId,
  label,
  hint,
  error,
  tone,
  hideLabel,
  required,
  children,
}: FieldShellProps) {
  const labelColor = tone === "dark" ? "text-white" : "text-sarga-text";
  const hintColor = tone === "dark" ? "text-white/60" : "text-sarga-text-muted";

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={fieldId}
        className={cn(
          "text-xs font-bold uppercase tracking-[0.1em]",
          labelColor,
          hideLabel && "sr-only",
        )}
      >
        {label}
        {required ? (
          <span className="text-sarga-red" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p
          id={`${fieldId}-error`}
          className="text-xs font-medium text-sarga-red"
        >
          {error}
        </p>
      ) : hint ? (
        <p id={`${fieldId}-hint`} className={cn("text-xs", hintColor)}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
