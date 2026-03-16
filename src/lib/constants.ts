import type { NavSection } from '@/types';
import { Activity, MessageSquare, Users, Bell } from 'lucide-react';

/** Quick-react emoji palette used in message reactions */
export const QUICK_EMOJIS = ['👍', '❤️', '😂', '🎉', '🚀', '👀'] as const;

/** Time gap (ms) before showing a new avatar group in message lists */
export const MESSAGE_GROUP_THRESHOLD_MS = 5 * 60 * 1000;

/** Navigation rail items */
export const NAV_ITEMS: { id: NavSection; icon: typeof Activity; label: string }[] = [
  { id: 'activity', icon: Activity, label: 'Activity' },
  { id: 'chat', icon: MessageSquare, label: 'Chat' },
  { id: 'teams', icon: Users, label: 'Teams' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
];

/** Side panel section titles */
export const SIDE_PANEL_TITLES: Record<NavSection, string> = {
  activity: 'Activity',
  chat: 'Chat',
  teams: 'Teams',
  notifications: 'Notifications',
};
