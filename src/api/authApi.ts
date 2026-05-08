/**
 * Auth API endpoints — RTK Query.
 */

import { baseApi } from "./baseApi";
import type {
  LoginDTO,
  RegisterDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
  VerifyEmailDTO,
} from "@/types/auth";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<void, LoginDTO>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),

    register: build.mutation<void, RegisterDTO>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
    }),

    refresh: build.mutation<void, void>({
      query: () => ({ url: "/auth/refresh", method: "POST" }),
    }),

    logout: build.mutation<void, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
    }),

    forgotPassword: build.mutation<void, ForgotPasswordDTO>({
      query: (body) => ({ url: "/auth/forgot-password", method: "POST", body }),
    }),

    resetPassword: build.mutation<void, ResetPasswordDTO>({
      query: (body) => ({ url: "/auth/reset-password", method: "POST", body }),
    }),

    verifyEmail: build.mutation<void, VerifyEmailDTO>({
      query: (body) => ({ url: "/auth/verify-email", method: "POST", body }),
    }),

    resendVerification: build.mutation<void, void>({
      query: () => ({ url: "/auth/resend-verification", method: "POST" }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
} = authApi;
