import { useEffect } from 'react';
import { useAppSelector } from '@/app/store';
import NavRail from './NavRail';
import SidePanel from './SidePanel';
import ChatView from '@/components/chat/ChatView';
import ThreadPanel from '@/components/chat/ThreadPanel';
import { Menu } from 'lucide-react';
import { useAppDispatch } from '@/app/store';
import { toggleMobileSidebar } from '@/features/uiSlice';

const AppLayout = () => {
  const { theme, isSidePanelOpen, activeThreadId, isMobileSidebarOpen, activeChatContext } = useAppSelector(s => s.ui);
  const dispatch = useAppDispatch();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Mobile menu button */}
      <button
        onClick={() => dispatch(toggleMobileSidebar())}
        className="fixed top-3 left-3 z-50 p-2 rounded-lg bg-card shadow-md border border-border md:hidden"
      >
        <Menu className="w-5 h-5 text-foreground" />
      </button>

      {/* Backdrop for mobile */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm md:hidden"
          onClick={() => dispatch(toggleMobileSidebar())}
        />
      )}

      {/* Nav Rail — always visible on desktop */}
      <div className={`
        fixed z-40 h-full md:relative md:z-auto
        transition-transform duration-200
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <NavRail />
      </div>

      {/* Side Panel */}
      {isSidePanelOpen && (
        <div className={`
          fixed z-40 h-full md:relative md:z-auto
          transition-transform duration-200
          ${isMobileSidebarOpen ? 'translate-x-0 left-[68px] md:left-auto' : '-translate-x-full md:translate-x-0'}
        `}>
          <SidePanel />
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex min-w-0">
        {activeChatContext ? (
          <ChatView />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-foreground mb-2">Welcome to ChatApp</h2>
              <p className="text-muted-foreground">Select a channel or conversation to start chatting</p>
            </div>
          </div>
        )}

        {/* Thread Panel */}
        {activeThreadId && (
          <div className="hidden lg:block w-[380px] border-l border-border">
            <ThreadPanel />
          </div>
        )}
      </div>
    </div>
  );
};

export default AppLayout;
