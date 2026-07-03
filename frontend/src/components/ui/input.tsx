import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import {
  FieldShell,
  controlClasses,
  type FieldTone,
} from "@/components/ui/field";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
  tone?: FieldTone;
  /** Visually hide the label but keep it for assistive tech. */
  hideLabel?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, tone = "light", hideLabel, id, className, ...rest },
  ref,
) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const describedBy = error
    ? `${fieldId}-error`
    : hint
      ? `${fieldId}-hint`
      : undefined;

  return (
    <FieldShell
      fieldId={fieldId}
      label={label}
      hint={hint}
      error={error}
      tone={tone}
      hideLabel={hideLabel}
      required={rest.required}
    >
      <input
        ref={ref}
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(controlClasses(tone, Boolean(error)), className)}
        {...rest}
      />
    </FieldShell>
  );
});
