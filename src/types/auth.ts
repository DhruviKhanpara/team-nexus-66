/**
 * Auth types — DTOs (request payloads) and VOs (UI-facing shapes).
 *
 * All auth endpoints respond with `result: null` (cookies carry tokens),
 * so there are no response DTOs/VOs.
 */

//#region Data Transfer Objects
export interface LoginDTO {
  identifier: string;
  password: string;
}

export interface RegisterDTO {
  name: string;
  username: string;
  email: string;
  password: string;
  inviteToken?: string;
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface ResetPasswordDTO {
  email: string;
  otp: string;
  newPassword: string;
}

export interface VerifyEmailDTO {
  otp: string;
}
//#endregion

//#region Value Objects
export interface LoginVO {
  identifier: string;
  password: string;
}

export interface RegisterVO {
  name: string;
  username: string;
  email: string;
  password: string;
  inviteToken?: string;
}

export interface ForgotPasswordVO {
  email: string;
}

export interface ResetPasswordVO {
  email: string;
  otp: string;
  newPassword: string;
}

export interface VerifyEmailVO {
  otp: string;
}
//#endregion
