import { forwardRef, useId } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { FieldWrapper, type FieldWrapperProps } from "./FieldWrapper";

export interface TextareaFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    Omit<FieldWrapperProps, "children" | "htmlFor"> {
  inputClassName?: string;
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
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
      ...textareaProps
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
        <Textarea
          id={inputId}
          ref={ref}
          aria-invalid={!!error}
          className={cn(error && "border-destructive focus-visible:ring-destructive/30", inputClassName, className)}
          {...textareaProps}
        />
      </FieldWrapper>
    );
  },
);
TextareaField.displayName = "TextareaField";
