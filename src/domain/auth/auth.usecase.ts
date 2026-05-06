/**
 * Auth use case hooks — service layer.
 *
 * Pattern:
 *  - useHydrateX → fetch + store data
 *  - usePersistX → create/update/delete operations
 *
 * Uses RTK Query hooks for API calls, mappers for transformation,
 * and dispatches results to Redux.
 */

import { useCallback } from "react";
import { useAppDispatch } from "@/app/store";
import { setUser, clearAuth } from "@/features/authSlice";
import {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
} from "@/api/authApi";
import { mapUserDtoToUser } from "./auth.mapper";
import type { LoginRequest, RegisterRequest } from "@/types/auth";
import { baseApi } from "@/api/baseApi";

/**
 * Hydrate current user profile into Redux.
 */
// const useHydrateUser = () => {
//   console.log("useHydrateUser called");
//   const [fetchProfile, { isLoading }] = useLazyGetMyProfileQuery();
//   const dispatch = useAppDispatch();

//   const hydrateUser = useCallback(async () => {
//     const profile = await fetchProfile().unwrap();
//     const user = mapUserDtoToUser({
//       _id: profile._id,
//       name: profile.name,
//       username: profile.username ?? "",
//       email: profile.email ?? "",
//     });
//     dispatch(setUser(user));
//     return user;
//   }, [fetchProfile, dispatch]);

//   return { hydrateUser, isLoading };
// };

/**
 * Login use case — authenticate and store user in Redux.
 */
const usePersistLogin = () => {
  const [loginMutation, { isLoading }] = useLoginMutation();

  const login = useCallback(
    async (credentials: LoginRequest) => {
      await loginMutation(credentials).unwrap();
    },
    [loginMutation],
  );

  return { login, isLoading };
};

/**
 * Register use case — create account and store user in Redux.
 */
const usePersistRegister = () => {
  const [registerMutation, { isLoading }] = useRegisterMutation();
  const dispatch = useAppDispatch();

  const register = useCallback(
    async (data: RegisterRequest) => {
      const response = await registerMutation(data).unwrap();
      const user = mapUserDtoToUser(response.user);
      dispatch(setUser(user));
      return user;
    },
    [registerMutation, dispatch],
  );

  return { register, isLoading };
};

/**
 * Logout use case — clear auth state.
 */
const usePersistLogout = () => {
  const [logoutMutation] = useLogoutMutation();
  const dispatch = useAppDispatch();

  const logout = useCallback(async () => {
    try {
      await logoutMutation().unwrap();
      // reset the whole api state(cached data, tags etc) so that in <PublicRoute/> - useGetMeQuery doesn't return cached data and is refetched
      dispatch(baseApi.util.resetApiState());
      dispatch(clearAuth());
    } catch {}
  }, [logoutMutation, dispatch]);

  return { logout };
};

export {
  //   useHydrateUser,
  usePersistLogin,
  usePersistRegister,
  usePersistLogout,
};
