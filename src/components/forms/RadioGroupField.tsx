import { useId } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { FieldWrapper, type FieldWrapperProps } from "./FieldWrapper";

export interface RadioOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface RadioGroupFieldProps
  extends Omit<FieldWrapperProps, "children" | "htmlFor"> {
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  orientation?: "horizontal" | "vertical";
  inputClassName?: string;
}

export const RadioGroupField = ({
  label,
  error,
  required,
  hint,
  containerClassName,
  labelClassName,
  errorClassName,
  hintClassName,
  inputClassName,
  options,
  value,
  defaultValue,
  onValueChange,
  name,
  orientation = "vertical",
}: RadioGroupFieldProps) => {
  const groupId = useId();

  return (
    <FieldWrapper
      label={label}
      error={error}
      required={required}
      hint={hint}
      containerClassName={containerClassName}
      labelClassName={labelClassName}
      errorClassName={errorClassName}
      hintClassName={hintClassName}
    >
      <RadioGroup
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        name={name}
        className={cn(orientation === "horizontal" && "flex flex-row gap-4", inputClassName)}
      >
        {options.map((opt) => {
          const itemId = `${groupId}-${opt.value}`;
          return (
            <div key={opt.value} className="flex items-center gap-2">
              <RadioGroupItem id={itemId} value={opt.value} disabled={opt.disabled} />
              <label htmlFor={itemId} className="text-sm text-foreground cursor-pointer select-none">
                {opt.label}
              </label>
            </div>
          );
        })}
      </RadioGroup>
    </FieldWrapper>
  );
};
