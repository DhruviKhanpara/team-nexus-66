import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { NavSection, ChatContext } from '@/types';

interface UiState {
  activeNav: NavSection;
  activeChatContext: ChatContext | null;
  activeThreadId: string | null;
  isSidePanelOpen: boolean;
  isMobileSidebarOpen: boolean;
  theme: 'light' | 'dark';
  searchQuery: string;
  isSearchOpen: boolean;
}

const savedTheme = (typeof window !== 'undefined' && localStorage.getItem('theme')) as 'light' | 'dark' | null;

const initialState: UiState = {
  activeNav: 'teams',
  activeChatContext: { type: 'channel', id: 'ch1' },
  activeThreadId: null,
  isSidePanelOpen: true,
  isMobileSidebarOpen: false,
  theme: savedTheme || 'light',
  searchQuery: '',
  isSearchOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveNav: (state, action: PayloadAction<NavSection>) => {
      state.activeNav = action.payload;
      state.isMobileSidebarOpen = true;
    },
    setActiveChatContext: (state, action: PayloadAction<ChatContext | null>) => {
      state.activeChatContext = action.payload;
      state.activeThreadId = null;
      state.isMobileSidebarOpen = false;
    },
    setActiveThread: (state, action: PayloadAction<string | null>) => {
      state.activeThreadId = action.payload;
    },
    toggleSidePanel: (state) => {
      state.isSidePanelOpen = !state.isSidePanelOpen;
    },
    toggleMobileSidebar: (state) => {
      state.isMobileSidebarOpen = !state.isMobileSidebarOpen;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload);
      }
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', state.theme);
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    toggleSearch: (state) => {
      state.isSearchOpen = !state.isSearchOpen;
      if (!state.isSearchOpen) state.searchQuery = '';
    },
  },
});

export const {
  setActiveNav,
  setActiveChatContext,
  setActiveThread,
  toggleSidePanel,
  toggleMobileSidebar,
  setTheme,
  toggleTheme,
  setSearchQuery,
  toggleSearch,
} = uiSlice.actions;

export default uiSlice.reducer;
