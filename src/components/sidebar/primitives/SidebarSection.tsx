import type { ReactNode } from 'react';

interface SidebarSectionProps {
  /** Uppercase section label (e.g. "Teams"). */
  label: string;
  /** Optional action rendered on the right of the header (e.g. a create button). */
  action?: ReactNode;
  children: ReactNode;
}

/**
 * Generic sidebar section: small uppercase header with an optional action slot.
 * Data agnostic — reusable by Teams, Channels, Direct Messages, etc.
 */
const SidebarSection = ({ label, action, children }: SidebarSectionProps) => (
  <>
    <div className="flex items-center justify-between px-2 pt-1 pb-2">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {action}
    </div>
    {children}
  </>
);

export default SidebarSection;
