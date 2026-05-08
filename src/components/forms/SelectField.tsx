import { useId } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { FieldWrapper, type FieldWrapperProps } from "./FieldWrapper";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectFieldProps
  extends Omit<FieldWrapperProps, "children" | "htmlFor"> {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
  inputClassName?: string;
}

export const SelectField = ({
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
  placeholder,
  disabled,
  name,
}: SelectFieldProps) => {
  const triggerId = useId();

  return (
    <FieldWrapper
      label={label}
      error={error}
      required={required}
      hint={hint}
      htmlFor={triggerId}
      containerClassName={containerClassName}
      labelClassName={labelClassName}
      errorClassName={errorClassName}
      hintClassName={hintClassName}
    >
      <Select
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
        name={name}
      >
        <SelectTrigger
          id={triggerId}
          aria-invalid={!!error}
          className={cn(error && "border-destructive focus:ring-destructive/30", inputClassName)}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldWrapper>
  );
};
