import { forwardRef, useId } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FieldWrapper, type FieldWrapperProps } from "./FieldWrapper";

export interface TextFieldProps
  extends React.ComponentPropsWithoutRef<"input">,
    Omit<FieldWrapperProps, "children" | "htmlFor"> {
  inputClassName?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
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
      ...inputProps
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

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
          aria-invalid={!!error}
          className={cn(error && "border-destructive focus-visible:ring-destructive/30", inputClassName, className)}
          {...inputProps}
        />
      </FieldWrapper>
    );
  },
);
TextField.displayName = "TextField";
