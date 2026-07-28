# Phase 4 — Channel Messaging

## What the backend actually exposes (verified in server-7.zip)

Routes are mounted at `/orgs/:orgId/teams/:teamId/channels/:channelId/messages`:

- `GET /` — query `pageSize` (default 50, max 100), `beforeId` (cursor), `threadRootMessageId`. Returns `{ data, hasMore, nextCursor }` with messages sorted newest-first (`_id: -1`).
- `POST /` — body `{ clientMessageId (required, non-empty), content (<=10000, optional/nullable), fileIds[], mentionedUserIds[], threadRootMessageId }`; requires content OR at least one file. Returns the created message DTO. Backend is idempotent on `clientMessageId`.

Other routes exist (edit/delete/pin/react) but are explicitly out of scope for this phase.

Message DTO (from `utils/mappers.util.js`): `id, channelId, conversationId, senderId, senderName, senderIcon, threadId, content, isSystem, isEdited, editedAt, replyCount, lastReplyAt, dmStatus, dmDeliveredAt, dmSeenAt, attachments[], mentions[], reactions[{emoji,count,reactedByMe,previewNames}], isDeleted, createdAt, updatedAt`.

Note — backend defect found: `channelMessage.service.js` calls `getCursorPaginatedResponse(data, hasMore, nextCursor)` positionally, but the util destructures a single object. As written, the list endpoint returns `{ data: undefined, hasMore: undefined, nextCursor: undefined }`. Fix on the server is one line (`getCursorPaginatedResponse({ data, hasMore, nextCursor })`). The frontend mapper will also tolerate a missing/mis-shaped envelope so the UI degrades to an empty list rather than crashing.

## Files to add (matching existing Organization/Team/Channel conventions)

The project uses `src/api/xApi.ts`, `src/types/x.ts`, `src/domain/x/x.mapper.ts`, `x.usecase.ts`, `src/features/xSlice.ts`, `src/schemas/x.schema.ts`, shared selectors in `src/features/selectors.ts`. Message module mirrors that exactly:

- `src/types/message.ts` — DTOs (`MessageDTO`, `MessageAttachmentDTO`, `MessageReactionDTO`, `MessageListDTO`, `SendMessageDTO`, `GetMessagesQueryDTO`) and VOs (`MessageVO`, `MessageListVO`, `MessagePaginationVO`).
- `src/api/messageApi.ts` — `getChannelMessages` query + `sendChannelMessage` mutation, new `TAGS.MESSAGES` usage, cursor query-string builder.
- `src/domain/message/message.mapper.ts` — DTO → VO only.
- `src/domain/message/message.usecase.ts` — `useHydrateChannelMessages`, `useLoadMoreChannelMessages`, `usePersistSendMessage`.
- `src/domain/message/index.ts` — barrel.
- `src/features/messageSlice.ts` — pagination-shaped state.
- `src/schemas/message.schema.ts` — Zod mirror of the backend send validator (trim, max 10000, content-or-files rule).
- Selectors added to `src/features/selectors.ts`.

## State shape (pagination-first, socket-ready)

```text
messageSlice = {
  byChannelId: {
    [channelId]: {
      ids: string[],              // ascending (oldest → newest) render order
      entities: Record<id, MessageVO>,
      nextCursor: string | null,
      hasMore: boolean,
      isInitialLoading: boolean,
      isLoadingMore: boolean,
      initialized: boolean,
    }
  }
}
```

Normalised per-channel entities mean a future socket `message:new` / `message:updated` event is a single `upsertMessage` reducer with no restructuring — that is the check the phase asks for. Reducers: `setInitialMessages`, `prependOlderMessages`, `upsertMessage`, `setLoading`, `clearChannelMessages`. Slice resets on `clearAuth`, and clears the channel entry when `setSelectedChannelId` changes (same cascade pattern as `channelSlice`).

## Data flow

`AppLayout` already hydrates org → team → channel. Add `useHydrateChannelMessages(orgId, teamId, selectedChannelId)` in `ChatView` (keeps it scoped to the chat surface and unmounts cleanly). It skips until all three ids exist, maps the DTO envelope, reverses to ascending order, and dispatches `setInitialMessages`.

Pagination: `useLoadMoreChannelMessages` issues the same endpoint with `beforeId = nextCursor` via a lazy query and dispatches `prependOlderMessages`. No infinite-scroll UI is added now, but `MessageList` will expose the hook's `loadMore`/`hasMore` so scroll-up wiring is a later 5-line change.

Send: `usePersistSendMessage` validates with the Zod schema, generates `clientMessageId` via `crypto.randomUUID()`, awaits the mutation, maps the returned DTO, dispatches `upsertMessage`. No optimistic insert (per scope).

## Selectors (in `selectors.ts`)

`selectMessagesForCurrentChannel()`, `selectMessagesLoading()`, `selectMessagesLoadingMore()`, `selectMessagePagination()`, `selectMessagesInitialized()` — all memoized, keyed off the existing `selectSelectedChannelId`.

## Existing UI — reuse, not replace

- `MessageList.tsx`: swap `state.chat.messages[contextId]` for `selectMessagesForCurrentChannel`; keep the existing date-grouping, avatar-grouping, scroll-to-bottom and markup untouched. Add loading and empty states using the existing text-centred empty block / `SidebarEmptyState` styling.
- `MessageBubble.tsx`: keep the exact markup. Change its prop type to `MessageVO` and read `senderName`/`senderIcon` from the message instead of `userMap` mock lookup (removes the last mock dependency in the chat surface). Reaction/thread/delete affordances stay visually identical; their handlers remain the current local-Redux ones since those features are out of scope this phase.
- `MessageInput.tsx`: keep the toolbar and textarea as-is; route `handleSend` through `usePersistSendMessage`, disable while sending, clear on success only.
- `ChatView`/`ChatHeader`: unchanged apart from hydration hook wiring.
- `uiSlice` initial `activeChatContext: { type:'channel', id:'ch1' }` (mock id) is replaced with `null`, and channel selection in the sidebar sets the chat context — otherwise the app boots pointing at a channel that no longer exists.

## Cleanup

Remove channel-message mock seeding from `chatSlice` (`channelMessages`, `threadMessages` for channels) while leaving conversation mocks intact for the later DM phase. `src/data/mockData.ts` stays for conversations/notifications.

## Verification

TypeScript strict build + lint clean; visual diff of the chat pane unchanged; channel switch clears and reloads correctly.
