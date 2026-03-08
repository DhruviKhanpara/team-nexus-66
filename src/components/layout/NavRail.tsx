import {
  MessageSquare, Users, Bell, Activity,
  Sun, Moon, Settings, LogOut, Building2, User, Shield, Palette, ChevronRight,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

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
      {/* Organization logo popover */}
      <div className="mb-4 mt-1">
        <Popover>
          <PopoverTrigger asChild>
            <button className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm cursor-pointer hover:opacity-80 transition-opacity" style={{ background: 'hsl(var(--sidebar-rail-active))', color: 'hsl(var(--primary-foreground))' }}>
              AC
            </button>
          </PopoverTrigger>
          <PopoverContent side="right" align="start" className="w-72 p-0">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm bg-primary text-primary-foreground">
                  AC
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-foreground">Acme Corporation</h3>
                  <p className="text-xs text-muted-foreground">acme-corp.teams.com</p>
                </div>
              </div>
            </div>
            <Separator />
            <div className="p-1">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent text-foreground transition-colors">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <span>Organization settings</span>
                <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent text-foreground transition-colors">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span>Manage members</span>
                <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent text-foreground transition-colors">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span>Security & compliance</span>
                <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
              </button>
            </div>
            <Separator />
            <div className="p-3">
              <p className="text-[11px] text-muted-foreground">Plan: <span className="font-medium text-foreground">Business Premium</span></p>
              <p className="text-[11px] text-muted-foreground mt-0.5">12 members · 3 teams</p>
            </div>
          </PopoverContent>
        </Popover>
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

        {/* User avatar popover */}
        <div className="mt-1">
          <Popover>
            <PopoverTrigger asChild>
              <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring">
                <Avatar className="w-8 h-8 cursor-pointer">
                  <AvatarFallback className="text-xs font-semibold bg-primary text-primary-foreground">
                    {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
              </button>
            </PopoverTrigger>
            <PopoverContent side="right" align="end" className="w-72 p-0">
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="text-base font-semibold bg-primary text-primary-foreground">
                      {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-sm text-foreground">{user?.name || 'User'}</h3>
                    <p className="text-xs text-muted-foreground">{user?.email || 'user@example.com'}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="w-2 h-2 rounded-full" style={{ background: 'hsl(var(--status-online))' }} />
                      <span className="text-[11px] text-muted-foreground">Available</span>
                    </div>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="p-1">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent text-foreground transition-colors">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>View profile</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent text-foreground transition-colors">
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  <span>Account settings</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent text-foreground transition-colors">
                  <Palette className="w-4 h-4 text-muted-foreground" />
                  <span>Appearance</span>
                </button>
              </div>
              <Separator />
              <div className="p-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-destructive/10 text-destructive transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </nav>
  );
};

export default NavRail;
