/**
 * Auth Redux slice — STATE ONLY.
 *
 * Manages:
 *  - Current user
 *  - Auth token (marker for cookie-based auth)
 *  - Authentication status
 *
 * Business logic (validation) lives in domain/auth/auth.logic.ts.
 * Use cases (loginUser, logoutUser) live in domain/auth/auth.usecase.ts.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User, AuthState } from '@/types';
import { currentUser } from '@/data/mockData';

// For development, start authenticated with mock user
const initialState: AuthState = {
  user: currentUser,
  token: 'mock-token-dev',
  isAuthenticated: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
