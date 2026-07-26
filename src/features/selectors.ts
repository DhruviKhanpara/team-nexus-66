/**
 * Cross-slice selectors — the read seam between Redux and the UI.
 *
 * Components should consume these instead of reaching into slice internals.
 * A future Workspace abstraction can compose these without touching any
 * component API.
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import type { OrgSummaryVO } from '@/types/organization';
import type { TeamSummaryVO } from '@/types/team';

//#region Organization
export const selectOrganizations = (state: RootState): OrgSummaryVO[] =>
  state.organization.organizations;

export const selectSelectedOrgId = (state: RootState): string | null =>
  state.organization.selectedOrgId;

export const selectSelectedOrganization = createSelector(
  [selectOrganizations, selectSelectedOrgId],
  (organizations, selectedOrgId): OrgSummaryVO | null =>
    organizations.find((o) => o.id === selectedOrgId) ?? null,
);
//#endregion

//#region Team
const EMPTY_TEAMS: TeamSummaryVO[] = [];

const selectTeamsByOrgId = (state: RootState) => state.team.teamsByOrgId;

export const selectSelectedTeamId = (state: RootState): string | null =>
  state.team.selectedTeamId;

export const selectTeamsForSelectedOrg = createSelector(
  [selectTeamsByOrgId, selectSelectedOrgId],
  (teamsByOrgId, selectedOrgId): TeamSummaryVO[] =>
    selectedOrgId ? (teamsByOrgId[selectedOrgId] ?? EMPTY_TEAMS) : EMPTY_TEAMS,
);

export const selectSelectedTeam = createSelector(
  [selectTeamsForSelectedOrg, selectSelectedTeamId],
  (teams, selectedTeamId): TeamSummaryVO | null =>
    teams.find((t) => t.id === selectedTeamId) ?? null,
);
//#endregion

//#region UI
export const selectSearchQuery = (state: RootState): string =>
  state.ui.searchQuery;

export const selectActiveChatContext = (state: RootState) =>
  state.ui.activeChatContext;
//#endregion

//#region Chat read state
export const selectReadStates = (state: RootState) => state.chat.readStates;

export const selectChannelUnreadCount = (
  state: RootState,
  channelId: string,
): number =>
  state.chat.readStates.find((r) => r.channelId === channelId)?.unreadCount ?? 0;
//#endregion
