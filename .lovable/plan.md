## Phase 5 — Conversation Domain (updated for server-9)

Verified from `server-9.zip`:

**Conversations** (top-level, no org scope) — `GET /conversations` (offset paginated), `GET /conversations/direct?userId=`, `GET /conversations/:id`, `GET /conversations/:id/participants`, `POST /conversations/direct`, `POST /conversations/group`, `PUT /conversations/:id`, `PUT|DELETE /conversations/:id/logo`, `POST /conversations/:id/participants`, `PUT /conversations/:id/participants/:participantId/role`, `DELETE /conversations/:id/participants/me`, `DELETE /conversations/:id/participants/:participantId`. Types: `direct` | `group`; group create needs `name` (1–150) + ≥2 other participant ids.

**Conversation messages** — mounted at `/conversations/:conversationId/messages`: `GET /` (cursor: `pageSize`, `beforeId`, `threadRootMessageId` → `{data, hasMore, nextCursor}`), `POST /` (`clientMessageId`, `content`, `fileIds`, `mentionedUserIds`, `threadRootMessageId` → `MessageDTO`), `DELETE /:messageId`, `DELETE /:messageId/force`, `POST /:messageId/pin`, `POST /:messageId/reactions`. Identical `toMessageDTO` shape as channel messages, so the existing `MessageDTO`/`MessageVO` and mapper are reused unchanged. No edit endpoint exists; if needed it will mirror as `PUT /conversations/:id/messages/:messageId` with the `editChannelMessage` body — but edit is out of phase scope, so it will not be built.

### 1. Types — `src/types/conversation.ts`
DTOs exactly as the service returns: `ConversationSummaryDTO` / `ConversationDetailDTO` (`id`, `type`, `name`, `logo`, `participantCount`, `createdAt`, `lastMessageAt`, `unreadCount`, `mentionCount`, `role`, `joinedAt`, `peer{userId,name,username,icon}`), `ConversationsListDTO = PaginatedDTO<…>`, `ConversationParticipantDTO`, `DirectLookupDTO`, and create/update DTOs. VOs add derived display fields (`isDirect`, `isGroup`, `displayName`, `avatarUrl`, `initials`, `peerUserId`) so components never branch on raw backend fields.

### 2. API
- `src/api/conversationApi.ts` — every conversation route above; new `TAGS.CONVERSATIONS` (LIST + per-id) with `TAGS.MEMBERS` for participants; mutations invalidate correctly.
- `src/api/messageApi.ts` — add `getConversationMessages`, `sendConversationMessage`, `deleteConversationMessage`, `toggleConversationMessageReaction`, `pinConversationMessage` alongside the channel endpoints, reusing the existing query-string builder and `silentSuccess` on send.

### 3. Mapper / schema / use cases
- `src/domain/conversation/conversation.mapper.ts` — DTO → VO only.
- `src/schemas/conversation.schema.ts` — Zod mirroring backend validators.
- `src/domain/conversation/conversation.usecase.ts` — `useHydrateConversations`, `useHydrateConversation`, `useHydrateConversationParticipants`, `useSelectConversation`, `usePersistCreateDirectConversation`, `usePersistCreateGroupConversation`, `usePersistUpdateGroupConversation`, `usePersistAddParticipant`, `usePersistUpdateParticipantRole`, `usePersistRemoveParticipant`, `usePersistLeaveConversation` — same `try/catch` + `isLoading`/`isSuccess` contract as channel hooks.
- `src/domain/message/message.usecase.ts` — hydrate/load-more/send hooks become target-aware (channel vs conversation) rather than duplicated.

### 4. Redux
- `src/features/conversationSlice.ts` — `conversations: ConversationVO[]`, `selectedConversationId`, `isLoading`. Persists **only** `selectedConversationId`; resets on `clearAuth`; hydration validates the restored id against the loaded list and clears it when invalid. No auto-select, so Chat opens on the "select a conversation" state.
- `src/features/messageSlice.ts` — re-key buckets from `byChannelId` to `byScopeKey` with a `channel:<id>` / `conversation:<id>` key helper. Reducers keep identical semantics (`setInitialMessages`, `prependOlderMessages`, `upsertMessage`, …), so a future socket event lands in one dispatch for either domain.

### 5. Navigation mode — `src/features/uiSlice.ts`
Add `activeNavigationMode: 'workspace' | 'conversation'`, set from nav-rail (`teams` → workspace, `chat` → conversation). Conversation selection dispatches no org/team/channel actions, so workspace selection is preserved and restored when switching back.

### 6. Sidebar
New `src/components/sidebar/conversation/`: `ConversationSection` (hydration + dialogs), `ConversationList`, `ConversationItem`, `ConversationActions`, `CreateConversationButton` — built on existing `SidebarSection`/`SidebarItem`/`SidebarEmptyState` primitives, visually matching today's list (avatar/initials, name, last-activity time, unread badge). The mock `src/components/sidebar/ConversationList.tsx` is deleted and `SidePanel` renders the new section for `activeNav === 'chat'`. Mock-only presence dots disappear with the mock data.

Dialogs (per your answer): `CreateDirectConversationDialog` (lookup via `GET /conversations/direct`, then `POST /direct`, then select) and `CreateGroupConversationDialog` (name + participant multi-select), using existing `src/components/forms/` fields.

### 7. Shared chat surface
`ChatView`, `ChatHeader`, `MessageList`, `MessageBubble`, `MessageInput` remain single implementations. A new `useActiveChatTarget()` returns a discriminated target (`{kind:'channel', orgId, teamId, channelId}` | `{kind:'conversation', conversationId}`); components read messages via scope-key selectors and send via the target-aware hook. `ChatHeader` shows conversation name/avatar/participant count from the VO. No `ConversationMessage*` components.

### 8. Selectors & cleanup
`selectConversations`, `selectSelectedConversationId`, `selectSelectedConversation`, `selectConversationsLoading`, plus scope-aware message selectors replacing the channel-only ones. Remove conversation/user/status mock usage from `ChatHeader` and the sidebar; activity/notification mocks stay for their own phases.

### Technical notes
- Strict TypeScript, no `any`; DTOs never enter Redux.
- Backend quirk: `updateParticipantRoleSchema` uses `GROUP_ROLES` without importing it — that route will throw server-side until fixed; client hook still built to contract.
- Out of scope as specified: sockets, presence, typing, notifications, reactions UI, edit/delete UI, threads, new attachment support.

### Acceptance
Backend-driven conversation list, persistent and self-healing selection, untouched/restored workspace selection across modes, conversation messages loading and sending through the reused chat components, no mock conversations, unchanged visuals, clean strict build.
