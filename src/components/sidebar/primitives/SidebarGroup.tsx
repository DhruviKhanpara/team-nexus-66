import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';

interface SidebarGroupProps {
  label: string;
  expanded: boolean;
  onToggle: () => void;
  /** Rendered between the chevron and the label (e.g. an avatar/initial badge). */
  leading?: ReactNode;
  /** Rendered at the right of the header row, revealed on hover. */
  actions?: ReactNode;
  /** Rendered (indented) below the header when expanded. */
  children?: ReactNode;
}

/**
 * Generic collapsible sidebar group. Owns no state — `expanded` / `onToggle`
 * are provided by the caller so state can live wherever it makes sense.
 */
const SidebarGroup = ({
  label,
  expanded,
  onToggle,
  leading,
  actions,
  children,
}: SidebarGroupProps) => (
  <div>
    <div className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md hover:bg-accent transition-colors group">
      <button onClick={onToggle} className="flex items-center gap-2 flex-1 min-w-0">
        <ChevronRight
          className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-150 ${
            expanded ? 'rotate-90' : ''
          }`}
        />
        {leading}
        <span className="text-sm font-medium text-sidebar-foreground flex-1 text-left truncate">
          {label}
        </span>
      </button>
      {actions}
    </div>

    {expanded && <div className="ml-6 mt-0.5 space-y-px">{children}</div>}
  </div>
);

export default SidebarGroup;
