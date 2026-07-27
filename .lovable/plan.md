## Phase 3 — Channel Domain & Complete Workspace Hierarchy

Backend verified from `server-6.zip`: channels are mounted at `/orgs/:orgId/teams/:teamId/channels`.

### Backend endpoints to integrate

| Method | Path | Body / Query | Result |
|---|---|---|---|
| GET | `/channels` | `search`, `isArchived`, `includePrivate`, `pageNumber`, `pageSize` | paginated channel summaries |
| GET | `/channels/:channelId` | — | channel detail |
| POST | `/channels` | `name`, `description?`, `type?` (`text`\|`announcement`), `isPrivate?` | `result: null` |
| PUT | `/channels/:channelId` | `name`, `description?` | `result: null` |
| POST | `/channels/:channelId/archive` | — | `result: null` |
| POST | `/channels/:channelId/unarchive` | — | `result: null` |

Members endpoints exist but are out of scope for this phase (no UI, not wired).

Channel summary DTO (from `channel.service.js`): `id, orgId, teamId, name, description, type, isPrivate, isArchived, archivedAt, createdAt, memberCount, role, isMuted, joinedAt, unreadCount, mentionCount`. Detail DTO omits the caller-specific fields.

### Files to add (mirroring the Team module exactly)

- `src/types/channel.ts` — `ChannelSummaryDTO/VO`, `ChannelDetailDTO/VO`, `ChannelsListDTO/VO` (reusing `PaginatedDTO/VO`), `GetChannelsQueryDTO/VO`, `CreateChannelDTO`, `UpdateChannelDTO`, `ChannelType`
- `src/api/channelApi.ts` — the six endpoints above with `TAGS.CHANNELS` providing/invalidating by teamId and channelId
- `src/domain/channel/channel.mapper.ts`, `channel.usecase.ts`, `index.ts` — `useHydrateChannels`, `useHydrateChannel`, `useSelectChannel`, `usePersistCreateChannel`, `usePersistUpdateChannel`, `usePersistArchiveChannel`, `usePersistUnarchiveChannel`
- `src/features/channelSlice.ts` — `channelsByTeamId: Record<string, ChannelSummaryVO[]>`, `selectedChannelId`; resets on `clearAuth`, clears selection on `setSelectedOrgId` / `setSelectedTeamId`
- `src/schemas/channel.schema.ts` — Zod create/update/query schemas mirroring `channel.validators.js` (name 1–100, description ≤500, type enum, isPrivate boolean)
- `src/components/channel/CreateChannelDialog.tsx`, `EditChannelDialog.tsx` — same structure as the team dialogs (react-hook-form + form fields)
- `src/components/sidebar/channel/CreateChannelButton.tsx`, `ChannelActions.tsx` — mirroring the team equivalents

### Files to change

- `src/features/teamSlice.ts` — persist `selectedTeamId` to localStorage using the same read/write helper pattern as `organizationSlice`
- `src/features/selectors.ts` — add channel selectors plus `selectCurrentOrganization`, `selectCurrentTeam`, `selectCurrentChannel`, and derived `selectCurrentWorkspace` returning `{ organization, team, channel }`
- `src/api/tags.ts` — already has `CHANNELS`; no change expected
- `src/app/store.ts` — register `channel` reducer
- `src/components/layout/AppLayout.tsx` — add `useHydrateChannels(selectedOrgId, selectedTeamId)` next to the existing org/team hydration
- `src/components/sidebar/channel/ChannelSection.tsx` — drop `mockChannels`; read channels from Redux via selectors, dispatch `setSelectedChannelId` (plus the existing `setActiveChatContext`) on click; empty state via `SidebarEmptyState`
- `src/components/sidebar/channel/ChannelItem.tsx` / `ChannelList.tsx` — switch to `ChannelSummaryVO` (`id`, unread from `unreadCount`), keep identical markup and icon logic
- `src/components/sidebar/team/TeamSection.tsx` / `TeamItem.tsx` — expanding a team also selects it (`setSelectedTeamId`); channels render only for the selected team, other teams show nothing nested. Visual structure unchanged.
- `src/schemas/team.schema.ts`, `src/schemas/organization.schema.ts` — align with backend `common.validators.js`: introduce a shared `src/schemas/common.schema.ts` with `pageNumber`, `pageSize`, `search`, `booleanQuery` helpers and reuse them in team/channel query schemas. Fix team description max to match backend (500 vs current 1024) after re-checking `team.validators.js`.

### Selection, persistence, restoration

- Persist only `selectedOrgId`, `selectedTeamId`, `selectedChannelId` (localStorage, one key each), written from the slice reducers.
- Each hydrate hook reconciles the persisted id after data arrives: if the id is not in the loaded list, clear it (which also removes the localStorage entry) and auto-select the first item; if nothing is selected and a list exists, select the first.
- Cascade: changing org clears team + channel; changing team clears channel.

### Mock data cleanup

`ChannelSection` is the only channel consumer of `@/data/mockData`. After this phase the remaining mock imports are conversations/notifications/messages/users only (`chatSlice`, `ChatHeader`, `MessageBubble`, `ConversationList`, `ActivityFeed`, `NotificationList`, `NavRail`) — left for later phases. `ChatHeader` currently reads mock `channels`; it will be switched to read the current channel VO from selectors so no channel mock remains.

### Technical notes

- Redux stores VOs only; every API response passes through the mapper.
- Query string building follows the existing `buildTeamsQueryString` helper style.
- Archive/unarchive are implemented in API + use-case layers; no UI beyond create/edit per your answer.
- Strict TypeScript, no `any`; verified with a typecheck at the end.
