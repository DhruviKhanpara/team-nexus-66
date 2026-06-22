/**
 * Team Redux slice — STATE ONLY.
 *
 * Stores teams keyed by orgId (as VOs) and the currently selected team id.
 * Resets on logout (via authSlice.clearAuth) and clears the selected team
 * whenever the selected org changes.
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearAuth } from "@/features/authSlice";
import { setSelectedOrgId } from "@/features/organizationSlice";
import type { TeamSummaryVO } from "@/types/team";

interface TeamState {
  teamsByOrgId: Record<string, TeamSummaryVO[]>;
  selectedTeamId: string | null;
}

const initialState: TeamState = {
  teamsByOrgId: {},
  selectedTeamId: null,
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
    },
    clearTeams: (state) => {
      state.teamsByOrgId = {};
      state.selectedTeamId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(clearAuth, (state) => {
        state.teamsByOrgId = {};
        state.selectedTeamId = null;
      })
      .addCase(setSelectedOrgId, (state) => {
        state.selectedTeamId = null;
      });
  },
});

export const { setTeamsForOrg, setSelectedTeamId, clearTeams } =
  teamSlice.actions;

export default teamSlice.reducer;
