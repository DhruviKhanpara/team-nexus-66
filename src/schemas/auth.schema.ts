import {
  isEmailValid,
  isPasswordValid,
  isUsernameValid,
} from "@/utils/regexUtils";
import { z } from "zod";

const loginSchema = z.object({
  identifier: z
    .string({ required_error: "Username or Email is required." })
    .min(1, "Username or Email cannot be empty.")
    .refine(
      (value) => {
        const isEmail = isEmailValid(value);

        const isUsername = isUsernameValid(value);

        return isEmail || isUsername;
      },
      { message: "Must be a valid email or username." },
    ),

  password: z
    .string({ required_error: "Password is required." })
    .min(1, "Password cannot be empty."),
});

type LoginFormData = z.infer<typeof loginSchema>;

const registerSchema = z.object({
  name: z
    .string({ required_error: "Name is required." })
    .min(1, "Name cannot be empty.")
    .max(64, "Name cannot exceed 64 characters.")
    .trim(),

  username: z
    .string({ required_error: "Username is required." })
    .min(1, "Username cannot be empty.")
    .refine(isUsernameValid, { message: "Username is not valid." }),

  email: z
    .string({ required_error: "Email is required." })
    .min(1, "Email cannot be empty.")
    .refine(isEmailValid, { message: "Invalid email." }),

  password: z
    .string({ required_error: "Password is required." })
    .refine(isPasswordValid, { message: "Password is not valid." }),

  inviteToken: z
    .string()
    .min(1, { message: "Invite token cannot be empty." })
    .optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: "Email is required." })
    .min(1, "Email cannot be empty.")
    .refine(isEmailValid, { message: "Invalid email." }),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const resetPasswordSchema = z.object({
  email: z
    .string({ required_error: "Email is required." })
    .min(1, "Email cannot be empty.")
    .refine(isEmailValid, { message: "Invalid email." }),

  otp: z
    .string({ required_error: "OTP is required." })
    .min(1, "OTP is required.")
    .length(6, "OTP must be exactly 6 digits.")
    .regex(/^\d+$/, "OTP must contain digits only."),

  newPassword: z
    .string({ required_error: "Password is required." })
    .refine(isPasswordValid, { message: "Password is not valid." }),
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const changePasswordSchema = z.object({
  newPassword: z
    .string({ required_error: "Password is required." })
    .refine(isPasswordValid, { message: "Password is not valid." }),

  currentPassword: z
    .string({ required_error: "Password is required." })
    .refine(isPasswordValid, { message: "Password is not valid." }),
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

const verifyUserEmailSchema = z.object({
  otp: z
    .string({ required_error: "OTP is required." })
    .min(1, "OTP is required.")
    .length(6, "OTP must be exactly 6 digits.")
    .regex(/^\d+$/, "OTP must contain digits only."),
});

type VerifyUserEmailFormData = z.infer<typeof verifyUserEmailSchema>;

export {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  changePasswordSchema,
  verifyUserEmailSchema,
};

export type {
  ForgotPasswordFormData,
  LoginFormData,
  RegisterFormData,
  ResetPasswordFormData,
  ChangePasswordFormData,
  VerifyUserEmailFormData,
};
