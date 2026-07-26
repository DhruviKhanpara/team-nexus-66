import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface SidebarItemProps {
  label: string;
  icon?: LucideIcon;
  isActive?: boolean;
  /** Emphasises the label (e.g. unread) and shows the trailing slot. */
  isUnread?: boolean;
  /** Rendered at the end of the row (e.g. unread dot or count badge). */
  trailing?: ReactNode;
  onClick: () => void;
}

/**
 * Generic single-row sidebar entry. Knows nothing about channels, teams or DMs.
 */
const SidebarItem = ({
  label,
  icon: Icon,
  isActive = false,
  isUnread = false,
  trailing,
  onClick,
}: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm transition-colors ${
      isActive
        ? 'bg-accent text-accent-foreground font-medium'
        : 'text-sidebar-foreground hover:bg-accent/50'
    }`}
  >
    {Icon && <Icon className="w-4 h-4 text-muted-foreground shrink-0" />}
    <span className={`truncate flex-1 text-left ${isUnread ? 'font-semibold' : ''}`}>
      {label}
    </span>
    {trailing}
  </button>
);

export default SidebarItem;
