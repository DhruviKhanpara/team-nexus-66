import { useId } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { FieldWrapper, type FieldWrapperProps } from "./FieldWrapper";

/**
 * Radix Checkbox doesn't expose a native input ref, so RHF integration
 * must use <Controller>. For simple controlled use, pass `checked` + `onCheckedChange`.
 */
export interface CheckboxFieldProps
  extends Omit<FieldWrapperProps, "children" | "htmlFor" | "label"> {
  /** Inline label rendered next to the checkbox. */
  label?: string;
  /** Field-level (top) label, used when you want both. */
  fieldLabel?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
  id?: string;
  inputClassName?: string;
}

export const CheckboxField = ({
  label,
  fieldLabel,
  error,
  required,
  hint,
  containerClassName,
  labelClassName,
  errorClassName,
  hintClassName,
  inputClassName,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  name,
  id,
}: CheckboxFieldProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <FieldWrapper
      label={fieldLabel}
      error={error}
      required={required}
      hint={hint}
      htmlFor={inputId}
      containerClassName={containerClassName}
      labelClassName={labelClassName}
      errorClassName={errorClassName}
      hintClassName={hintClassName}
    >
      <div className="flex items-center gap-2">
        <Checkbox
          id={inputId}
          name={name}
          checked={checked}
          defaultChecked={defaultChecked}
          onCheckedChange={(v) => onCheckedChange?.(v === true)}
          disabled={disabled}
          aria-invalid={!!error}
          className={cn(error && "border-destructive", inputClassName)}
        />
        {label && (
          <label htmlFor={inputId} className="text-sm text-foreground cursor-pointer select-none">
            {label}
          </label>
        )}
      </div>
    </FieldWrapper>
  );
};
