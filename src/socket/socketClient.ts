import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });
  }
  return socket;
};

export const connectSocket = (token: string) => {
  const s = getSocket();
  s.auth = { token };
  s.connect();
  return s;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Socket event types
export const SOCKET_EVENTS = {
  // Client → Server
  JOIN_CHANNEL: 'channel:join',
  LEAVE_CHANNEL: 'channel:leave',
  JOIN_CONVERSATION: 'conversation:join',
  LEAVE_CONVERSATION: 'conversation:leave',
  TYPING_START: 'typing:start',
  TYPING_STOP: 'typing:stop',
  MESSAGE_SEEN: 'message:seen',

  // Server → Client
  NEW_MESSAGE: 'message:new',
  MESSAGE_UPDATED: 'message:updated',
  MESSAGE_DELETED: 'message:deleted',
  REACTION_UPDATED: 'reaction:updated',
  TYPING_INDICATOR: 'typing:indicator',
  USER_STATUS_CHANGED: 'user:status_changed',
  NOTIFICATION_NEW: 'notification:new',
  READ_STATE_UPDATED: 'readstate:updated',
} as const;
