import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Message, ReadState } from '@/types';
import {
  channelMessages, conversationMessages, readStates, threadMessages,
} from '@/data/mockData';

interface ChatState {
  messages: Record<string, Message[]>;
  threadMessages: Record<string, Message[]>;
  readStates: ReadState[];
  typingUsers: Record<string, string[]>; // contextId -> userId[]
}

const allMessages = { ...channelMessages, ...conversationMessages };

const initialState: ChatState = {
  messages: allMessages,
  threadMessages,
  readStates,
  typingUsers: {},
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<{ contextId: string; message: Message }>) => {
      const { contextId, message } = action.payload;
      if (!state.messages[contextId]) state.messages[contextId] = [];
      state.messages[contextId].push(message);
    },
    addThreadReply: (state, action: PayloadAction<{ threadId: string; message: Message }>) => {
      const { threadId, message } = action.payload;
      if (!state.threadMessages[threadId]) state.threadMessages[threadId] = [];
      state.threadMessages[threadId].push(message);
      // Update parent replyCount
      Object.values(state.messages).forEach(msgs => {
        const parent = msgs.find(m => m._id === threadId);
        if (parent) {
          parent.replyCount += 1;
          parent.lastReplyAt = message.createdAt;
        }
      });
    },
    toggleReaction: (state, action: PayloadAction<{ contextId: string; messageId: string; emoji: string; userId: string }>) => {
      const { contextId, messageId, emoji, userId } = action.payload;
      const msgs = state.messages[contextId];
      if (!msgs) return;
      const msg = msgs.find(m => m._id === messageId);
      if (!msg) return;
      const existing = msg.reactions.find(r => r.emoji === emoji);
      if (existing) {
        if (existing.users.includes(userId)) {
          existing.users = existing.users.filter(u => u !== userId);
          existing.count -= 1;
          if (existing.count === 0) {
            msg.reactions = msg.reactions.filter(r => r.emoji !== emoji);
          }
        } else {
          existing.users.push(userId);
          existing.count += 1;
        }
      } else {
        msg.reactions.push({ emoji, users: [userId], count: 1 });
      }
    },
    editMessage: (state, action: PayloadAction<{ contextId: string; messageId: string; content: string }>) => {
      const { contextId, messageId, content } = action.payload;
      const msgs = state.messages[contextId];
      if (!msgs) return;
      const msg = msgs.find(m => m._id === messageId);
      if (msg) {
        msg.content = content;
        msg.isEdited = true;
        msg.editedAt = new Date().toISOString();
      }
    },
    softDeleteMessage: (state, action: PayloadAction<{ contextId: string; messageId: string; userId: string }>) => {
      const { contextId, messageId, userId } = action.payload;
      const msgs = state.messages[contextId];
      if (!msgs) return;
      const msg = msgs.find(m => m._id === messageId);
      if (msg) {
        msg.deletedAt = new Date().toISOString();
        msg.deletedBy = userId;
      }
    },
    markContextAsRead: (state, action: PayloadAction<{ type: 'channel' | 'conversation'; id: string }>) => {
      const { type, id } = action.payload;
      const rs = state.readStates.find(
        r => (type === 'channel' ? r.channelId === id : r.conversationId === id)
      );
      if (rs) {
        rs.unreadCount = 0;
        rs.mentionCount = 0;
        rs.lastReadAt = new Date().toISOString();
      }
    },
    setTypingUsers: (state, action: PayloadAction<{ contextId: string; userIds: string[] }>) => {
      state.typingUsers[action.payload.contextId] = action.payload.userIds;
    },
  },
});

export const {
  addMessage,
  addThreadReply,
  toggleReaction,
  editMessage: editMessageAction,
  softDeleteMessage,
  markContextAsRead,
  setTypingUsers,
} = chatSlice.actions;

export default chatSlice.reducer;
