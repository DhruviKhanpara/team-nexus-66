import { useId, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FieldWrapper, type FieldWrapperProps } from "./FieldWrapper";

export interface DatePickerFieldProps
  extends Omit<FieldWrapperProps, "children" | "htmlFor"> {
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Date format string for display (date-fns). */
  displayFormat?: string;
  /** Disable specific dates. */
  disabledDates?: (date: Date) => boolean;
  inputClassName?: string;
}

/**
 * DatePicker form field. Controlled via `value`/`onChange`.
 * For RHF integration, use <Controller>.
 */
export const DatePickerField = ({
  label,
  error,
  required,
  hint,
  containerClassName,
  labelClassName,
  errorClassName,
  hintClassName,
  inputClassName,
  value,
  defaultValue,
  onChange,
  placeholder = "Pick a date",
  disabled,
  displayFormat = "PPP",
  disabledDates,
}: DatePickerFieldProps) => {
  const triggerId = useId();
  const [internal, setInternal] = useState<Date | undefined>(defaultValue);
  const isControlled = value !== undefined || onChange !== undefined;
  const selected = isControlled ? value : internal;

  const handleSelect = (date: Date | undefined) => {
    if (!isControlled) setInternal(date);
    onChange?.(date);
  };

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
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={triggerId}
            type="button"
            variant="outline"
            disabled={disabled}
            aria-invalid={!!error}
            className={cn(
              "w-full justify-start text-left font-normal",
              !selected && "text-muted-foreground",
              error && "border-destructive focus-visible:ring-destructive/30",
              inputClassName,
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selected ? format(selected, displayFormat) : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            disabled={disabledDates}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>
    </FieldWrapper>
  );
};
