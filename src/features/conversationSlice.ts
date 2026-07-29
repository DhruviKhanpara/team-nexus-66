/**
 * Conversation Redux slice — STATE ONLY.
 *
 * Stores the user's conversations (as VOs) and the currently selected
 * conversation id. Only `selectedConversationId` is persisted to localStorage.
 * Resets on logout.
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearAuth } from "@/features/authSlice";
import type { ConversationVO } from "@/types/conversation";

const STORAGE_KEY = "selectedConversationId";

const readPersistedSelectedConversationId = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

const writePersistedSelectedConversationId = (
  conversationId: string | null,
) => {
  if (typeof window === "undefined") return;
  try {
    if (conversationId) {
      window.localStorage.setItem(STORAGE_KEY, conversationId);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    /* storage unavailable — selection simply won't persist */
  }
};

export interface ConversationState {
  conversations: ConversationVO[];
  selectedConversationId: string | null;
  isLoading: boolean;
  initialized: boolean;
}

const initialState: ConversationState = {
  conversations: [],
  selectedConversationId: readPersistedSelectedConversationId(),
  isLoading: false,
  initialized: false,
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<ConversationVO[]>) => {
      state.conversations = action.payload;
      state.initialized = true;
      state.isLoading = false;

      // Drop a stale persisted selection that no longer exists.
      if (
        state.selectedConversationId &&
        !action.payload.some((c) => c.id === state.selectedConversationId)
      ) {
        state.selectedConversationId = null;
        writePersistedSelectedConversationId(null);
      }
    },

    upsertConversation: (state, action: PayloadAction<ConversationVO>) => {
      const index = state.conversations.findIndex(
        (c) => c.id === action.payload.id,
      );
      if (index >= 0) {
        state.conversations[index] = action.payload;
      } else {
        state.conversations = [action.payload, ...state.conversations];
      }
    },

    removeConversation: (state, action: PayloadAction<string>) => {
      state.conversations = state.conversations.filter(
        (c) => c.id !== action.payload,
      );
      if (state.selectedConversationId === action.payload) {
        state.selectedConversationId = null;
        writePersistedSelectedConversationId(null);
      }
    },

    setSelectedConversationId: (
      state,
      action: PayloadAction<string | null>,
    ) => {
      state.selectedConversationId = action.payload;
      writePersistedSelectedConversationId(action.payload);
    },

    setConversationsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(clearAuth, () => {
      writePersistedSelectedConversationId(null);
      return {
        conversations: [],
        selectedConversationId: null,
        isLoading: false,
        initialized: false,
      };
    });
  },
});

export const {
  setConversations,
  upsertConversation,
  removeConversation,
  setSelectedConversationId,
  setConversationsLoading,
} = conversationSlice.actions;

export default conversationSlice.reducer;
