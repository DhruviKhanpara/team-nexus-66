/**
 * Auth use case hooks — service layer.
 *
 * Pattern:
 *  - useHydrateX → fetch + store data
 *  - usePersistX → create/update/delete operations
 *
 * Every use case awaits `.unwrap()` inside a `try/catch`. Errors are
 * swallowed because `baseApi` toasts them centrally; consumers read
 * `isLoading` / `isSuccess` from RTK Query for UI flow decisions.
 */

import { useCallback } from "react";
import { useAppDispatch } from "@/app/store";
import { clearAuth } from "@/features/authSlice";
import {
  useLoginMutation,
  useRegisterMutation,
  useRefreshMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
} from "@/api/authApi";
import {
  mapLoginVOToDTO,
  mapRegisterVOToDTO,
  mapForgotPasswordVOToDTO,
  mapResetPasswordVOToDTO,
  mapVerifyEmailVOToDTO,
} from "./auth.mapper";
import type {
  LoginVO,
  RegisterVO,
  ForgotPasswordVO,
  ResetPasswordVO,
  VerifyEmailVO,
} from "@/types/auth";
import { baseApi } from "@/api/baseApi";

/**
 * Login use case — authenticate. Session is established via cookies.
 * Consumers read `isSuccess` to decide when to navigate.
 */
const usePersistLogin = () => {
  const [loginMutation, { isLoading, isSuccess }] = useLoginMutation();

  const login = useCallback(
    async (vo: LoginVO) => {
      try {
        await loginMutation(mapLoginVOToDTO(vo)).unwrap();
      } catch {
        /* errors surfaced via toasts in baseApi */
      }
    },
    [loginMutation],
  );

  return { login, isLoading, isSuccess };
};

/**
 * Register use case — create account. Session cookies are set by the server;
 * the user record will be hydrated by `useGetMeQuery` after navigation.
 * Consumers read `isSuccess` to decide when to navigate.
 */
const usePersistRegister = () => {
  const [registerMutation, { isLoading, isSuccess }] = useRegisterMutation();

  const register = useCallback(
    async (vo: RegisterVO) => {
      try {
        await registerMutation(mapRegisterVOToDTO(vo)).unwrap();
      } catch {
        /* errors surfaced via toasts in baseApi */
      }
    },
    [registerMutation],
  );

  return { register, isLoading, isSuccess };
};

/**
 * Refresh use case — manually trigger a token refresh.
 * Note: baseApi already performs silent refresh on 401, so this is rarely used directly.
 */
const usePersistRefresh = () => {
  const [refreshMutation, { isLoading }] = useRefreshMutation();

  const refresh = useCallback(async () => {
    try {
      await refreshMutation().unwrap();
    } catch {
      /* errors surfaced via toasts in baseApi */
    }
  }, [refreshMutation]);

  return { refresh, isLoading };
};

/**
 * Logout use case — clear server session and local auth state.
 */
const usePersistLogout = () => {
  const [logoutMutation] = useLogoutMutation();
  const dispatch = useAppDispatch();

  const logout = useCallback(async () => {
    try {
      await logoutMutation().unwrap();
      // reset the whole api state so PublicRoute's useGetMeQuery refetches
      dispatch(baseApi.util.resetApiState());
      dispatch(clearAuth());
    } catch {
      /* errors are surfaced via toasts in baseApi */
    }
  }, [logoutMutation, dispatch]);

  return { logout };
};

/**
 * Forgot password use case — request OTP email.
 */
const usePersistForgotPassword = () => {
  const [forgotPasswordMutation, { isLoading }] = useForgotPasswordMutation();

  const forgotPassword = useCallback(
    async (vo: ForgotPasswordVO) => {
      try {
        await forgotPasswordMutation(mapForgotPasswordVOToDTO(vo)).unwrap();
      } catch {
        /* errors surfaced via toasts in baseApi */
      }
    },
    [forgotPasswordMutation],
  );

  return { forgotPassword, isLoading };
};

/**
 * Reset password use case — submit OTP + new password.
 */
const usePersistResetPassword = () => {
  const [resetPasswordMutation, { isLoading }] = useResetPasswordMutation();

  const resetPassword = useCallback(
    async (vo: ResetPasswordVO) => {
      try {
        await resetPasswordMutation(mapResetPasswordVOToDTO(vo)).unwrap();
      } catch {
        /* errors surfaced via toasts in baseApi */
      }
    },
    [resetPasswordMutation],
  );

  return { resetPassword, isLoading };
};

/**
 * Verify email use case — submit email-verification OTP.
 */
const usePersistVerifyEmail = () => {
  const [verifyEmailMutation, { isLoading }] = useVerifyEmailMutation();

  const verifyEmail = useCallback(
    async (vo: VerifyEmailVO) => {
      try {
        await verifyEmailMutation(mapVerifyEmailVOToDTO(vo)).unwrap();
      } catch {
        /* errors surfaced via toasts in baseApi */
      }
    },
    [verifyEmailMutation],
  );

  return { verifyEmail, isLoading };
};

/**
 * Resend verification OTP use case.
 */
const usePersistResendVerification = () => {
  const [resendVerificationMutation, { isLoading }] =
    useResendVerificationMutation();

  const resendVerification = useCallback(async () => {
    try {
      await resendVerificationMutation().unwrap();
    } catch {
      /* errors surfaced via toasts in baseApi */
    }
  }, [resendVerificationMutation]);

  return { resendVerification, isLoading };
};

export {
  usePersistLogin,
  usePersistRegister,
  usePersistRefresh,
  usePersistLogout,
  usePersistForgotPassword,
  usePersistResetPassword,
  usePersistVerifyEmail,
  usePersistResendVerification,
};
