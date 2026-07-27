/**
 * Cross-slice selectors — the read seam between Redux and the UI.
 *
 * Components should consume these instead of reaching into slice internals.
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import type { OrgSummaryVO } from '@/types/organization';
import type { TeamSummaryVO } from '@/types/team';
import type { ChannelSummaryVO } from '@/types/channel';

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

//#region Channel
const EMPTY_CHANNELS: ChannelSummaryVO[] = [];

const selectChannelsByTeamId = (state: RootState) =>
  state.channel.channelsByTeamId;

export const selectSelectedChannelId = (state: RootState): string | null =>
  state.channel.selectedChannelId;

export const selectChannelsForSelectedTeam = createSelector(
  [selectChannelsByTeamId, selectSelectedTeamId],
  (channelsByTeamId, selectedTeamId): ChannelSummaryVO[] =>
    selectedTeamId
      ? (channelsByTeamId[selectedTeamId] ?? EMPTY_CHANNELS)
      : EMPTY_CHANNELS,
);

export const selectSelectedChannel = createSelector(
  [selectChannelsForSelectedTeam, selectSelectedChannelId],
  (channels, selectedChannelId): ChannelSummaryVO | null =>
    channels.find((c) => c.id === selectedChannelId) ?? null,
);

/** Look up a channel by id across every loaded team. */
export const selectChannelById = createSelector(
  [selectChannelsByTeamId, (_state: RootState, channelId: string | null) => channelId],
  (channelsByTeamId, channelId): ChannelSummaryVO | null => {
    if (!channelId) return null;
    for (const channels of Object.values(channelsByTeamId)) {
      const match = channels.find((c) => c.id === channelId);
      if (match) return match;
    }
    return null;
  },
);
//#endregion

//#region Workspace
export const selectCurrentOrganization = selectSelectedOrganization;
export const selectCurrentTeam = selectSelectedTeam;
export const selectCurrentChannel = selectSelectedChannel;

export interface WorkspaceVO {
  organization: OrgSummaryVO | null;
  team: TeamSummaryVO | null;
  channel: ChannelSummaryVO | null;
}

/** The full Organization → Team → Channel context the user is working in. */
export const selectCurrentWorkspace = createSelector(
  [selectCurrentOrganization, selectCurrentTeam, selectCurrentChannel],
  (organization, team, channel): WorkspaceVO => ({
    organization,
    team,
    channel,
  }),
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
