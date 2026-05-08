import { useId } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import { FieldWrapper, type FieldWrapperProps } from "./FieldWrapper";

export interface OTPFieldProps
  extends Omit<FieldWrapperProps, "children" | "htmlFor"> {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  /** Show a separator between two halves of the code (only when length is even). */
  withSeparator?: boolean;
  inputClassName?: string;
  slotClassName?: string;
}

/**
 * One-time-password input. Controlled via `value`/`onChange`.
 * For RHF integration, use <Controller>.
 */
export const OTPField = ({
  label,
  error,
  required,
  hint,
  containerClassName,
  labelClassName,
  errorClassName,
  hintClassName,
  inputClassName,
  slotClassName,
  length = 6,
  value,
  onChange,
  onComplete,
  disabled,
  withSeparator = false,
}: OTPFieldProps) => {
  const groupId = useId();
  const half = Math.floor(length / 2);
  const splitGroups = withSeparator && length % 2 === 0;

  return (
    <FieldWrapper
      label={label}
      error={error}
      required={required}
      hint={hint}
      htmlFor={groupId}
      containerClassName={containerClassName}
      labelClassName={labelClassName}
      errorClassName={errorClassName}
      hintClassName={hintClassName}
    >
      <InputOTP
        id={groupId}
        maxLength={length}
        value={value}
        onChange={onChange}
        onComplete={onComplete}
        disabled={disabled}
        containerClassName={inputClassName}
      >
        {splitGroups ? (
          <>
            <InputOTPGroup>
              {Array.from({ length: half }).map((_, i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className={cn(error && "border-destructive", slotClassName)}
                />
              ))}
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              {Array.from({ length: length - half }).map((_, i) => (
                <InputOTPSlot
                  key={half + i}
                  index={half + i}
                  className={cn(error && "border-destructive", slotClassName)}
                />
              ))}
            </InputOTPGroup>
          </>
        ) : (
          <InputOTPGroup>
            {Array.from({ length }).map((_, i) => (
              <InputOTPSlot
                key={i}
                index={i}
                className={cn(error && "border-destructive", slotClassName)}
              />
            ))}
          </InputOTPGroup>
        )}
      </InputOTP>
    </FieldWrapper>
  );
};
