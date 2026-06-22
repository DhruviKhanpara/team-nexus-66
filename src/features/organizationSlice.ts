/**
 * Organization Redux slice — STATE ONLY.
 *
 * Holds the list of organizations the user belongs to (as VOs) and the
 * currently selected organization id. Only `selectedOrgId` is persisted
 * to localStorage so that the user's workspace selection survives reloads.
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearAuth } from "@/features/authSlice";
import type { OrgSummaryVO } from "@/types/organization";

const STORAGE_KEY = "selectedOrgId";

const readPersistedSelectedOrgId = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

const writePersistedSelectedOrgId = (orgId: string | null) => {
  if (typeof window === "undefined") return;
  try {
    if (orgId) {
      window.localStorage.setItem(STORAGE_KEY, orgId);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    /* ignore quota/security errors */
  }
};

interface OrganizationState {
  organizations: OrgSummaryVO[];
  selectedOrgId: string | null;
}

const initialState: OrganizationState = {
  organizations: [],
  selectedOrgId: readPersistedSelectedOrgId(),
};

const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    setOrganizations: (state, action: PayloadAction<OrgSummaryVO[]>) => {
      state.organizations = action.payload;
    },
    setSelectedOrgId: (state, action: PayloadAction<string | null>) => {
      state.selectedOrgId = action.payload;
      writePersistedSelectedOrgId(action.payload);
    },
    clearOrganizations: (state) => {
      state.organizations = [];
      state.selectedOrgId = null;
      writePersistedSelectedOrgId(null);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(clearAuth, (state) => {
      state.organizations = [];
      state.selectedOrgId = null;
      writePersistedSelectedOrgId(null);
    });
  },
});

export const { setOrganizations, setSelectedOrgId, clearOrganizations } =
  organizationSlice.actions;

export default organizationSlice.reducer;
