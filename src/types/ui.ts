import type { User } from './user';

export type NavSection = 'activity' | 'chat' | 'teams' | 'notifications';

export interface ChatContext {
  type: 'channel' | 'conversation';
  id: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
