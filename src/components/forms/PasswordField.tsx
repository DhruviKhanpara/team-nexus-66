import { forwardRef, useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FieldWrapper, type FieldWrapperProps } from "./FieldWrapper";

export interface PasswordFieldProps
  extends Omit<React.ComponentPropsWithoutRef<"input">, "type">,
    Omit<FieldWrapperProps, "children" | "htmlFor"> {
  inputClassName?: string;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
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
    const [show, setShow] = useState(false);
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
        <div className="relative">
          <Input
            id={inputId}
            ref={ref}
            type={show ? "text" : "password"}
            aria-invalid={!!error}
            className={cn(
              "pr-10",
              error && "border-destructive focus-visible:ring-destructive/30",
              inputClassName,
              className,
            )}
            {...inputProps}
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            tabIndex={-1}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </FieldWrapper>
    );
  },
);
PasswordField.displayName = "PasswordField";
