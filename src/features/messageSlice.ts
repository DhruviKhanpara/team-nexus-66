/**
 * Message Redux slice — STATE ONLY.
 *
 * Normalised, per-scope, pagination-first state. A "scope" is either a
 * channel (`channel:<id>`) or a conversation (`conversation:<id>`), so both
 * messaging domains share one implementation. Future socket events map to a
 * single `upsertMessage` dispatch.
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearAuth } from "@/features/authSlice";
import type { MessageVO } from "@/types/message";

export interface ScopeMessagesState {
  /** Ascending (oldest → newest) render order. */
  ids: string[];
  entities: Record<string, MessageVO>;
  nextCursor: string | null;
  hasMore: boolean;
  isInitialLoading: boolean;
  isLoadingMore: boolean;
  initialized: boolean;
}

/** @deprecated Use {@link ScopeMessagesState}. Kept as an alias. */
export type ChannelMessagesState = ScopeMessagesState;

interface MessageState {
  byScopeKey: Record<string, ScopeMessagesState>;
}

export const emptyScopeMessages = (): ScopeMessagesState => ({
  ids: [],
  entities: {},
  nextCursor: null,
  hasMore: false,
  isInitialLoading: false,
  isLoadingMore: false,
  initialized: false,
});

const initialState: MessageState = {
  byScopeKey: {},
};

const ensureScope = (
  state: MessageState,
  scopeKey: string,
): ScopeMessagesState => {
  if (!state.byScopeKey[scopeKey]) {
    state.byScopeKey[scopeKey] = emptyScopeMessages();
  }
  return state.byScopeKey[scopeKey];
};

/** Insert a message keeping `ids` sorted ascending by createdAt. */
const insertAscending = (bucket: ScopeMessagesState, message: MessageVO) => {
  const existing = bucket.entities[message.id];
  bucket.entities[message.id] = message;
  if (existing) return;

  const time = new Date(message.createdAt).getTime();
  let index = bucket.ids.length;
  while (index > 0) {
    const candidate = bucket.entities[bucket.ids[index - 1]];
    if (candidate && new Date(candidate.createdAt).getTime() <= time) break;
    index -= 1;
  }
  bucket.ids.splice(index, 0, message.id);
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    /** Replace the first page for a scope. `messages` arrive newest → oldest. */
    setInitialMessages: (
      state,
      action: PayloadAction<{
        scopeKey: string;
        messages: MessageVO[];
        hasMore: boolean;
        nextCursor: string | null;
      }>,
    ) => {
      const { scopeKey, messages, hasMore, nextCursor } = action.payload;
      const ascending = [...messages].reverse();

      state.byScopeKey[scopeKey] = {
        ids: ascending.map((m) => m.id),
        entities: Object.fromEntries(ascending.map((m) => [m.id, m])),
        nextCursor,
        hasMore,
        isInitialLoading: false,
        isLoadingMore: false,
        initialized: true,
      };
    },

    /** Prepend an older page. `messages` arrive newest → oldest. */
    prependOlderMessages: (
      state,
      action: PayloadAction<{
        scopeKey: string;
        messages: MessageVO[];
        hasMore: boolean;
        nextCursor: string | null;
      }>,
    ) => {
      const { scopeKey, messages, hasMore, nextCursor } = action.payload;
      const bucket = ensureScope(state, scopeKey);
      const ascending = [...messages].reverse();
      const fresh = ascending.filter((m) => !bucket.entities[m.id]);

      fresh.forEach((m) => {
        bucket.entities[m.id] = m;
      });
      bucket.ids = [...fresh.map((m) => m.id), ...bucket.ids];
      bucket.nextCursor = nextCursor;
      bucket.hasMore = hasMore;
      bucket.isLoadingMore = false;
      bucket.initialized = true;
    },

    /** Insert or replace a single message (send response, future socket event). */
    upsertMessage: (
      state,
      action: PayloadAction<{ scopeKey: string; message: MessageVO }>,
    ) => {
      const { scopeKey, message } = action.payload;
      insertAscending(ensureScope(state, scopeKey), message);
    },

    setMessagesLoading: (
      state,
      action: PayloadAction<{
        scopeKey: string;
        isInitialLoading?: boolean;
        isLoadingMore?: boolean;
      }>,
    ) => {
      const { scopeKey, isInitialLoading, isLoadingMore } = action.payload;
      const bucket = ensureScope(state, scopeKey);
      if (isInitialLoading !== undefined)
        bucket.isInitialLoading = isInitialLoading;
      if (isLoadingMore !== undefined) bucket.isLoadingMore = isLoadingMore;
    },

    clearScopeMessages: (state, action: PayloadAction<string>) => {
      delete state.byScopeKey[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(clearAuth, () => initialState);
  },
});

export const {
  setInitialMessages,
  prependOlderMessages,
  upsertMessage,
  setMessagesLoading,
  clearScopeMessages,
} = messageSlice.actions;

export default messageSlice.reducer;
