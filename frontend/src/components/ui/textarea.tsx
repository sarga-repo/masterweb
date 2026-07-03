import { forwardRef, useId, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import {
  FieldShell,
  controlClasses,
  type FieldTone,
} from "@/components/ui/field";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hint?: string;
  error?: string;
  tone?: FieldTone;
  hideLabel?: boolean;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      label,
      hint,
      error,
      tone = "light",
      hideLabel,
      id,
      className,
      rows = 5,
      ...rest
    },
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
        <textarea
          ref={ref}
          id={fieldId}
          rows={rows}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            controlClasses(tone, Boolean(error)),
            "resize-y",
            className,
          )}
          {...rest}
        />
      </FieldShell>
    );
  },
);
