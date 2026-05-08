import { forwardRef, useId } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FieldWrapper, type FieldWrapperProps } from "./FieldWrapper";

export interface SearchInputProps
  extends React.ComponentPropsWithoutRef<"input">,
    Omit<FieldWrapperProps, "children" | "htmlFor"> {
  inputClassName?: string;
  onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
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
      onClear,
      id,
      className,
      value,
      ...inputProps
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const showClear = !!onClear && !!value;

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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            id={inputId}
            ref={ref}
            type="search"
            value={value}
            aria-invalid={!!error}
            className={cn(
              "pl-9",
              showClear && "pr-9",
              error && "border-destructive focus-visible:ring-destructive/30",
              inputClassName,
              className,
            )}
            {...inputProps}
          />
          {showClear && (
            <button
              type="button"
              onClick={onClear}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </FieldWrapper>
    );
  },
);
SearchInput.displayName = "SearchInput";
