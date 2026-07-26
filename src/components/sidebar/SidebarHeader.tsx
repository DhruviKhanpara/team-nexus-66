import SearchBar from '@/components/sidebar/SearchBar';

interface SidebarHeaderProps {
  title: string;
}

/** Sidebar header: title + search. */
const SidebarHeader = ({ title }: SidebarHeaderProps) => (
  <div className="p-4 pb-2">
    <h2 className="text-lg font-semibold text-sidebar-foreground">{title}</h2>
    <SearchBar />
  </div>
);

export default SidebarHeader;
