/**
 * Team Redux slice — STATE ONLY.
 *
 * Stores teams keyed by orgId (as VOs) and the currently selected team id.
 * Only `selectedTeamId` is persisted to localStorage. Resets on logout
 * (via authSlice.clearAuth) and clears the selected team whenever the
 * selected org changes.
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearAuth } from "@/features/authSlice";
import { setSelectedOrgId } from "@/features/organizationSlice";
import type { TeamSummaryVO } from "@/types/team";

const STORAGE_KEY = "selectedTeamId";

const readPersistedSelectedTeamId = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

const writePersistedSelectedTeamId = (teamId: string | null) => {
  if (typeof window === "undefined") return;
  try {
    if (teamId) {
      window.localStorage.setItem(STORAGE_KEY, teamId);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    /* ignore quota/security errors */
  }
};

interface TeamState {
  teamsByOrgId: Record<string, TeamSummaryVO[]>;
  selectedTeamId: string | null;
}

const initialState: TeamState = {
  teamsByOrgId: {},
  selectedTeamId: readPersistedSelectedTeamId(),
};

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    setTeamsForOrg: (
      state,
      action: PayloadAction<{ orgId: string; teams: TeamSummaryVO[] }>,
    ) => {
      state.teamsByOrgId[action.payload.orgId] = action.payload.teams;
    },
    setSelectedTeamId: (state, action: PayloadAction<string | null>) => {
      state.selectedTeamId = action.payload;
      writePersistedSelectedTeamId(action.payload);
    },
    clearTeams: (state) => {
      state.teamsByOrgId = {};
      state.selectedTeamId = null;
      writePersistedSelectedTeamId(null);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(clearAuth, (state) => {
        state.teamsByOrgId = {};
        state.selectedTeamId = null;
        writePersistedSelectedTeamId(null);
      })
      .addCase(setSelectedOrgId, (state) => {
        state.selectedTeamId = null;
        writePersistedSelectedTeamId(null);
      });
  },
});

export const { setTeamsForOrg, setSelectedTeamId, clearTeams } =
  teamSlice.actions;

export default teamSlice.reducer;
