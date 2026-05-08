/**
 * Auth domain — VO ↔ DTO mappers.
 *
 * Pure transforms between UI Value Objects and the request payloads
 * accepted by the backend. All auth responses carry `result: null`,
 * so there are no response mappers.
 */

import type {
  LoginVO,
  LoginDTO,
  RegisterVO,
  RegisterDTO,
  ForgotPasswordVO,
  ForgotPasswordDTO,
  ResetPasswordVO,
  ResetPasswordDTO,
  VerifyEmailVO,
  VerifyEmailDTO,
} from "@/types/auth";

export const mapLoginVOToDTO = (vo: LoginVO): LoginDTO => ({
  identifier: vo.identifier,
  password: vo.password,
});

export const mapRegisterVOToDTO = (vo: RegisterVO): RegisterDTO => ({
  name: vo.name,
  username: vo.username,
  email: vo.email,
  password: vo.password,
  ...(vo.inviteToken ? { inviteToken: vo.inviteToken } : {}),
});

export const mapForgotPasswordVOToDTO = (
  vo: ForgotPasswordVO,
): ForgotPasswordDTO => ({
  email: vo.email,
});

export const mapResetPasswordVOToDTO = (
  vo: ResetPasswordVO,
): ResetPasswordDTO => ({
  email: vo.email,
  otp: vo.otp,
  newPassword: vo.newPassword,
});

export const mapVerifyEmailVOToDTO = (vo: VerifyEmailVO): VerifyEmailDTO => ({
  otp: vo.otp,
});
