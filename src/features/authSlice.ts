/**
 * Auth Redux slice — STATE ONLY.
 *
 * Manages:
 *  - Current user
 *  - Authentication status
 *
 * Tokens are managed via httpOnly cookies by the backend.
 * No token is stored in Redux state.
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types";
import { currentUser } from "@/data/mockData";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: currentUser,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, updateUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
