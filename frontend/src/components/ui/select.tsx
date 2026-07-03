import { forwardRef, useId, type SelectHTMLAttributes } from "react";
import { ChevronDownIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import {
  FieldShell,
  controlClasses,
  type FieldTone,
} from "@/components/ui/field";

export type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  hint?: string;
  error?: string;
  tone?: FieldTone;
  hideLabel?: boolean;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    {
      label,
      options,
      placeholder,
      hint,
      error,
      tone = "light",
      hideLabel,
      id,
      className,
      defaultValue,
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
        <div className="relative">
          <select
            ref={ref}
            id={fieldId}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            defaultValue={defaultValue ?? (placeholder ? "" : undefined)}
            className={cn(
              controlClasses(tone, Boolean(error)),
              "appearance-none pr-11",
              className,
            )}
            {...rest}
          >
            {placeholder ? (
              <option value="" disabled>
                {placeholder}
              </option>
            ) : null}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon
            className={cn(
              "pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2",
              tone === "dark" ? "text-white/70" : "text-sarga-text-muted",
            )}
          />
        </div>
      </FieldShell>
    );
  },
);
