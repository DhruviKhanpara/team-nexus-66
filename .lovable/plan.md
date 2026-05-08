## Goal

Standardize every auth use case in `src/domain/auth/auth.usecase.ts` to use `async/await` + `.unwrap()` inside a `try/catch`, regardless of whether the hook has post-success side effects. Errors stay swallowed (toasted by `baseApi`); RTK Query state (`isLoading`, `isSuccess`) remains the source of truth for UI flow.

## Pattern

Every `useCallback` becomes `async`, awaits `.unwrap()`, and wraps in `try/catch`:

```ts
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
```

Return type becomes `Promise<void>` for all triggers. Consumers continue to rely on `isSuccess` from RTK Query for navigation decisions (already wired this way in `LoginPage` / `RegisterPage`).

## Hooks to update in `src/domain/auth/auth.usecase.ts`

1. `usePersistLogin` — wrap `loginMutation` call
2. `usePersistRegister` — wrap `registerMutation` call
3. `usePersistRefresh` — wrap `refreshMutation` call
4. `usePersistForgotPassword` — wrap `forgotPasswordMutation` call
5. `usePersistResetPassword` — wrap `resetPasswordMutation` call
6. `usePersistVerifyEmail` — wrap `verifyEmailMutation` call
7. `usePersistResendVerification` — wrap `resendVerificationMutation` call
8. `usePersistLogout` — already uses async/await + unwrap; leave as-is

## Header comment update

Update the file's top doc block to state explicitly: "Every use case awaits `.unwrap()` inside a `try/catch`. Errors are swallowed because `baseApi` toasts them; consumers read `isLoading` / `isSuccess` from RTK Query."

## Out of scope

- No changes to `authApi.ts`, `auth.mapper.ts`, `auth.ts`, `LoginPage.tsx`, `RegisterPage.tsx`, or any other file.
- No change to the public hook signatures other than the trigger now returning `Promise<void>` instead of the RTK Query mutation result object.
