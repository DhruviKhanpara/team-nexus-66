import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface FieldWrapperProps {
  label?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  hint?: string;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  hintClassName?: string;
  children: ReactNode;
}

/**
 * Shared layout primitive for all form fields:
 * label + control + helper/error text. Keeps spacing & a11y consistent.
 */
export const FieldWrapper = ({
  label,
  error,
  required,
  htmlFor,
  hint,
  containerClassName,
  labelClassName,
  errorClassName,
  hintClassName,
  children,
}: FieldWrapperProps) => {
  return (
    <div className={cn("space-y-1.5", containerClassName)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className={cn(
            "text-sm font-medium text-foreground block",
            labelClassName,
          )}
        >
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p
          className={cn("text-xs text-destructive", errorClassName)}
          role="alert"
        >
          {error}
        </p>
      ) : hint ? (
        <p className={cn("text-xs text-muted-foreground", hintClassName)}>
          {hint}
        </p>
      ) : null}
    </div>
  );
};
