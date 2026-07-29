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
import type { MessagePaginationVO, MessageVO } from '@/types/message';
import type { ConversationVO } from '@/types/conversation';
import { channelScopeKey, conversationScopeKey } from '@/types/chatTarget';


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

//#region Conversations
const EMPTY_CONVERSATIONS: ConversationVO[] = [];

export const selectConversations = (state: RootState): ConversationVO[] =>
  state.conversation.conversations ?? EMPTY_CONVERSATIONS;

export const selectSelectedConversationId = (
  state: RootState,
): string | null => state.conversation.selectedConversationId;

export const selectConversationsLoading = (state: RootState): boolean =>
  state.conversation.isLoading;

export const selectSelectedConversation = createSelector(
  [selectConversations, selectSelectedConversationId],
  (conversations, selectedId): ConversationVO | null =>
    conversations.find((c) => c.id === selectedId) ?? null,
);

export const selectConversationById = createSelector(
  [
    selectConversations,
    (_state: RootState, conversationId: string | null) => conversationId,
  ],
  (conversations, conversationId): ConversationVO | null =>
    conversationId
      ? (conversations.find((c) => c.id === conversationId) ?? null)
      : null,
);

export const selectDirectConversations = createSelector(
  [selectConversations],
  (conversations) => conversations.filter((c) => c.isDirect),
);

export const selectGroupConversations = createSelector(
  [selectConversations],
  (conversations) => conversations.filter((c) => c.isGroup),
);
//#endregion

//#region Messages (scope-keyed: channel:<id> | conversation:<id>)
const EMPTY_MESSAGES: MessageVO[] = [];

const EMPTY_PAGINATION: MessagePaginationVO = {
  hasMore: false,
  nextCursor: null,
};

const selectMessagesByScopeKey = (state: RootState) => state.message.byScopeKey;

const selectScopeKeyArg = (
  _state: RootState,
  scopeKey: string | null,
): string | null => scopeKey;

/** The scope key of the currently open chat surface, if any. */
export const selectActiveScopeKey = (state: RootState): string | null => {
  const context = state.ui.activeChatContext;
  if (!context) return null;
  return context.type === 'channel'
    ? channelScopeKey(context.id)
    : conversationScopeKey(context.id);
};

/** Messages for an explicit scope, ordered oldest → newest. */
export const selectMessagesForScope = createSelector(
  [selectMessagesByScopeKey, selectScopeKeyArg],
  (byScopeKey, scopeKey): MessageVO[] => {
    const bucket = scopeKey ? byScopeKey[scopeKey] : undefined;
    if (!bucket) return EMPTY_MESSAGES;
    return bucket.ids.map((id: string) => bucket.entities[id]).filter(Boolean);
  },
);

/** Messages for the currently open chat surface, ordered oldest → newest. */
export const selectMessagesForActiveScope = createSelector(
  [selectMessagesByScopeKey, selectActiveScopeKey],
  (byScopeKey, scopeKey): MessageVO[] => {
    const bucket = scopeKey ? byScopeKey[scopeKey] : undefined;
    if (!bucket) return EMPTY_MESSAGES;
    return bucket.ids.map((id: string) => bucket.entities[id]).filter(Boolean);
  },
);

const activeBucket = (state: RootState) => {
  const scopeKey = selectActiveScopeKey(state);
  return scopeKey ? state.message.byScopeKey[scopeKey] : undefined;
};

export const selectMessagesLoading = (state: RootState): boolean =>
  activeBucket(state)?.isInitialLoading ?? false;

export const selectMessagesLoadingMore = (state: RootState): boolean =>
  activeBucket(state)?.isLoadingMore ?? false;

export const selectMessagesInitialized = (state: RootState): boolean =>
  activeBucket(state)?.initialized ?? false;

export const selectMessagePagination = createSelector(
  [selectMessagesByScopeKey, selectScopeKeyArg],
  (byScopeKey, scopeKey): MessagePaginationVO => {
    const bucket = scopeKey ? byScopeKey[scopeKey] : undefined;
    if (!bucket) return EMPTY_PAGINATION;
    return { hasMore: bucket.hasMore, nextCursor: bucket.nextCursor };
  },
);
//#endregion
