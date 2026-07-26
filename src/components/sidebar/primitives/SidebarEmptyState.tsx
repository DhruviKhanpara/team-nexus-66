interface SidebarEmptyStateProps {
  message: string;
}

/** Generic empty/placeholder row for any sidebar section. */
const SidebarEmptyState = ({ message }: SidebarEmptyStateProps) => (
  <div className="px-3 py-6 text-xs text-muted-foreground">{message}</div>
);

export default SidebarEmptyState;
