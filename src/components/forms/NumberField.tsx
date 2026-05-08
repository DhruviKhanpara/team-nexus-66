import { forwardRef, useId } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FieldWrapper, type FieldWrapperProps } from "./FieldWrapper";

export interface NumberFieldProps
  extends Omit<React.ComponentPropsWithoutRef<"input">, "type" | "onChange" | "value"> ,
    Omit<FieldWrapperProps, "children" | "htmlFor"> {
  inputClassName?: string;
  /** Controlled numeric value. Use number for controlled mode, leave undefined for RHF register. */
  value?: number | string;
  /** Controlled handler — emits number | null. */
  onChange?: (value: number | null) => void;
  /** Native handler — escape hatch for RHF register. */
  onChangeRaw?: React.ChangeEventHandler<HTMLInputElement>;
}

export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(
  (
    {
      label,
      error,
      required,
      hint,
      containerClassName,
      labelClassName,
      errorClassName,
      hintClassName,
      inputClassName,
      id,
      className,
      value,
      onChange,
      onChangeRaw,
      ...inputProps
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      onChangeRaw?.(e);
      if (onChange) {
        const raw = e.target.value;
        if (raw === "") onChange(null);
        else {
          const num = Number(raw);
          onChange(Number.isNaN(num) ? null : num);
        }
      }
    };

    return (
      <FieldWrapper
        label={label}
        error={error}
        required={required}
        hint={hint}
        htmlFor={inputId}
        containerClassName={containerClassName}
        labelClassName={labelClassName}
        errorClassName={errorClassName}
        hintClassName={hintClassName}
      >
        <Input
          id={inputId}
          ref={ref}
          type="number"
          inputMode="numeric"
          value={value ?? ""}
          onChange={handleChange}
          aria-invalid={!!error}
          className={cn(error && "border-destructive focus-visible:ring-destructive/30", inputClassName, className)}
          {...inputProps}
        />
      </FieldWrapper>
    );
  },
);
NumberField.displayName = "NumberField";
