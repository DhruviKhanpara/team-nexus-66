/**
 * Reusable form field components — wrappers around shadcn/ui primitives.
 *
 * Native-input wrappers (TextField, PasswordField, TextareaField, NumberField,
 * SearchInput) forward refs and work directly with `{...register(name)}`.
 *
 * Radix-based wrappers (CheckboxField, SwitchField, RadioGroupField,
 * SelectField, DatePickerField, OTPField) are controlled — use <Controller>
 * for react-hook-form integration.
 */

export { FieldWrapper, type FieldWrapperProps } from "./FieldWrapper";
export { TextField, type TextFieldProps } from "./TextField";
export { PasswordField, type PasswordFieldProps } from "./PasswordField";
export { TextareaField, type TextareaFieldProps } from "./TextareaField";
export { NumberField, type NumberFieldProps } from "./NumberField";
export { SearchInput, type SearchInputProps } from "./SearchInput";
export { CheckboxField, type CheckboxFieldProps } from "./CheckboxField";
export { SwitchField, type SwitchFieldProps } from "./SwitchField";
export {
  RadioGroupField,
  type RadioGroupFieldProps,
  type RadioOption,
} from "./RadioGroupField";
export {
  SelectField,
  type SelectFieldProps,
  type SelectOption,
} from "./SelectField";
export { DatePickerField, type DatePickerFieldProps } from "./DatePickerField";
export { OTPField, type OTPFieldProps } from "./OTPField";
