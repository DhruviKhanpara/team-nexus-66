import { Search } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/app/store';
import { setSearchQuery } from '@/features/uiSlice';

const SearchBar = () => {
  const { searchQuery } = useAppSelector(s => s.ui);
  const dispatch = useAppDispatch();

  return (
    <div className="relative mt-2">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        className="w-full pl-9 pr-3 py-2 text-sm rounded-md bg-muted border-none outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
      />
    </div>
  );
};

export default SearchBar;
