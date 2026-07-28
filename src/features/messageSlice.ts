/**
 * Message Redux slice — STATE ONLY.
 *
 * Normalised, per-channel, pagination-first state so that future
 * socket events map to a single `upsertMessage` dispatch.
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearAuth } from "@/features/authSlice";
import type { MessageVO } from "@/types/message";

export interface ChannelMessagesState {
  /** Ascending (oldest → newest) render order. */
  ids: string[];
  entities: Record<string, MessageVO>;
  nextCursor: string | null;
  hasMore: boolean;
  isInitialLoading: boolean;
  isLoadingMore: boolean;
  initialized: boolean;
}

interface MessageState {
  byChannelId: Record<string, ChannelMessagesState>;
}

export const emptyChannelMessages = (): ChannelMessagesState => ({
  ids: [],
  entities: {},
  nextCursor: null,
  hasMore: false,
  isInitialLoading: false,
  isLoadingMore: false,
  initialized: false,
});

const initialState: MessageState = {
  byChannelId: {},
};

const ensureChannel = (
  state: MessageState,
  channelId: string,
): ChannelMessagesState => {
  if (!state.byChannelId[channelId]) {
    state.byChannelId[channelId] = emptyChannelMessages();
  }
  return state.byChannelId[channelId];
};

/** Insert a message keeping `ids` sorted ascending by createdAt. */
const insertAscending = (bucket: ChannelMessagesState, message: MessageVO) => {
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
    /** Replace the first page for a channel. `messages` arrive newest → oldest. */
    setInitialMessages: (
      state,
      action: PayloadAction<{
        channelId: string;
        messages: MessageVO[];
        hasMore: boolean;
        nextCursor: string | null;
      }>,
    ) => {
      const { channelId, messages, hasMore, nextCursor } = action.payload;
      const ascending = [...messages].reverse();

      state.byChannelId[channelId] = {
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
        channelId: string;
        messages: MessageVO[];
        hasMore: boolean;
        nextCursor: string | null;
      }>,
    ) => {
      const { channelId, messages, hasMore, nextCursor } = action.payload;
      const bucket = ensureChannel(state, channelId);
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
      action: PayloadAction<{ channelId: string; message: MessageVO }>,
    ) => {
      const { channelId, message } = action.payload;
      insertAscending(ensureChannel(state, channelId), message);
    },

    setMessagesLoading: (
      state,
      action: PayloadAction<{
        channelId: string;
        isInitialLoading?: boolean;
        isLoadingMore?: boolean;
      }>,
    ) => {
      const { channelId, isInitialLoading, isLoadingMore } = action.payload;
      const bucket = ensureChannel(state, channelId);
      if (isInitialLoading !== undefined)
        bucket.isInitialLoading = isInitialLoading;
      if (isLoadingMore !== undefined) bucket.isLoadingMore = isLoadingMore;
    },

    clearChannelMessages: (state, action: PayloadAction<string>) => {
      delete state.byChannelId[action.payload];
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
  clearChannelMessages,
} = messageSlice.actions;

export default messageSlice.reducer;
