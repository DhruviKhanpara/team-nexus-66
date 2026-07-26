import type { ReactNode } from 'react';

interface SidebarContentProps {
  children: ReactNode;
}

/** Scrollable body of the sidebar. */
const SidebarContent = ({ children }: SidebarContentProps) => (
  <div className="flex-1 overflow-y-auto px-2 pb-2">{children}</div>
);

export default SidebarContent;
