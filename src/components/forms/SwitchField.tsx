import { useId } from "react";
import { Switch } from "@/components/ui/switch";
import { FieldWrapper, type FieldWrapperProps } from "./FieldWrapper";

/**
 * Radix Switch — controlled. For RHF use <Controller>.
 */
export interface SwitchFieldProps
  extends Omit<FieldWrapperProps, "children" | "htmlFor" | "label"> {
  label?: string;
  fieldLabel?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
  id?: string;
  inputClassName?: string;
}

export const SwitchField = ({
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
}: SwitchFieldProps) => {
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
        <Switch
          id={inputId}
          name={name}
          checked={checked}
          defaultChecked={defaultChecked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          className={inputClassName}
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
