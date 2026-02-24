import {
  MessageSquare, Users, Bell, Activity,
  Sun, Moon, Settings, LogOut,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/app/store';
import { setActiveNav, toggleTheme } from '@/features/uiSlice';
import { logout } from '@/features/authSlice';
import { useNavigate } from 'react-router-dom';
import type { NavSection } from '@/types';
import { notifications as mockNotifications } from '@/data/mockData';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const navItems: { id: NavSection; icon: typeof Activity; label: string }[] = [
  { id: 'activity', icon: Activity, label: 'Activity' },
  { id: 'chat', icon: MessageSquare, label: 'Chat' },
  { id: 'teams', icon: Users, label: 'Teams' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
];

const NavRail = () => {
  const { activeNav, theme } = useAppSelector(s => s.ui);
  const user = useAppSelector(s => s.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const unreadNotifCount = mockNotifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="h-full w-[68px] flex flex-col items-center py-3 gap-1" style={{ background: 'hsl(var(--sidebar-rail))' }}>
      {/* Organization logo */}
      <div className="mb-4 mt-1">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm" style={{ background: 'hsl(var(--sidebar-rail-active))', color: 'hsl(var(--primary-foreground))' }}>
          AC
        </div>
      </div>

      {/* Nav items */}
      <div className="flex flex-col gap-0.5 flex-1">
        {navItems.map(({ id, icon: Icon, label }) => (
          <Tooltip key={id} delayDuration={300}>
            <TooltipTrigger asChild>
              <button
                onClick={() => dispatch(setActiveNav(id))}
                className={`nav-rail-item ${activeNav === id ? 'active' : ''}`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {id === 'notifications' && unreadNotifCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center" style={{ background: 'hsl(var(--unread-badge))', color: 'hsl(var(--primary-foreground))' }}>
                      {unreadNotifCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium">{label}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              {label}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      {/* Bottom actions */}
      <div className="flex flex-col gap-1 mt-auto">
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={() => dispatch(toggleTheme())}
              className="nav-rail-item"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="text-xs">
            {theme === 'light' ? 'Dark mode' : 'Light mode'}
          </TooltipContent>
        </Tooltip>

        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button onClick={handleLogout} className="nav-rail-item">
              <LogOut className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="text-xs">
            Sign out
          </TooltipContent>
        </Tooltip>

        {/* User avatar */}
        <div className="mt-1">
          <Avatar className="w-8 h-8 cursor-pointer">
            <AvatarFallback className="text-xs font-semibold bg-primary text-primary-foreground">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </nav>
  );
};

export default NavRail;
