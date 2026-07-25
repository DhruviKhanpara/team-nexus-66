import { useAppDispatch, useAppSelector } from "@/app/store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { notifications as mockNotifications } from "@/data/mockData";
import { usePersistLogout } from "@/domain/auth";
import {
  useSelectOrganization,
} from "@/domain/organization";
import { setActiveNav, toggleTheme } from "@/features/uiSlice";
import { NAV_ITEMS } from "@/lib/constants";
import { getInitials } from "@/lib/helpers";
import type { NavSection } from "@/types";
import {
  Check,
  ChevronRight,
  LogOut,
  Moon,
  Palette,
  Plus,
  Settings,
  Sun,
  User,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateOrganizationDialog from "@/components/organization/CreateOrganizationDialog";
import EditOrganizationDialog from "@/components/organization/EditOrganizationDialog";

const NavRail = () => {
  const { activeNav, theme } = useAppSelector((s) => s.ui);
  const user = useAppSelector((s) => s.auth.user);
  const organizations = useAppSelector((s) => s.organization.organizations);
  const selectedOrgId = useAppSelector(
    (s) => s.organization.selectedOrgId,
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const selectOrganization = useSelectOrganization();

  const { logout } = usePersistLogout();

  const [createOrgOpen, setCreateOrgOpen] = useState(false);
  const [editOrgOpen, setEditOrgOpen] = useState(false);

  const selectedOrg = useMemo(
    () => organizations.find((o) => o.id === selectedOrgId) ?? null,
    [organizations, selectedOrgId],
  );

  const unreadNotifCount = mockNotifications.filter((n) => !n.isRead).length;

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const handleNavClick = useCallback(
    (id: NavSection) => {
      dispatch(setActiveNav(id));
    },
    [dispatch],
  );

  const handleToggleTheme = useCallback(() => {
    dispatch(toggleTheme());
  }, [dispatch]);

  return (
    <nav
      className="h-full w-[68px] flex flex-col items-center py-3 gap-1"
      style={{ background: "hsl(var(--sidebar-rail))" }}
    >
      {/* Organization switcher */}
      <div className="mb-4 mt-1">
        <Popover>
          <PopoverTrigger asChild>
            <button
              className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm cursor-pointer hover:opacity-80 transition-opacity"
              style={{
                background: "hsl(var(--sidebar-rail-active))",
                color: "hsl(var(--primary-foreground))",
              }}
            >
              {selectedOrg ? getInitials(selectedOrg.name) : "?"}
            </button>
          </PopoverTrigger>
          <PopoverContent side="right" align="start" className="w-72 p-0">
            <div className="p-4">
              {selectedOrg ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm bg-primary text-primary-foreground">
                    {getInitials(selectedOrg.name)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm text-foreground truncate">
                      {selectedOrg.name}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {selectedOrg.slug}.teams.com
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No organization selected.
                </p>
              )}
            </div>
            <Separator />
            {organizations.length > 0 && (
              <>
                <div className="p-1 max-h-64 overflow-y-auto">
                  <p className="px-3 pt-1 pb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Switch organization
                  </p>
                  {organizations.map((org) => {
                    const isActive = org.id === selectedOrgId;
                    return (
                      <button
                        key={org.id}
                        onClick={() => selectOrganization(org.id)}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent text-foreground transition-colors"
                      >
                        <div className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold bg-primary/10 text-primary">
                          {getInitials(org.name)}
                        </div>
                        <span className="flex-1 truncate text-left">
                          {org.name}
                        </span>
                        {isActive && (
                          <Check className="w-4 h-4 text-primary" />
                        )}
                      </button>
                    );
                  })}
                </div>
                <Separator />
              </>
            )}
            <div className="p-1">
              {selectedOrg && (
                <button
                  onClick={() => setEditOrgOpen(true)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent text-foreground transition-colors"
                >
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  <span>Organization settings</span>
                  <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
                </button>
              )}
              <button
                onClick={() => setCreateOrgOpen(true)}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent text-foreground transition-colors"
              >
                <Plus className="w-4 h-4 text-muted-foreground" />
                <span>Create organization</span>
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <CreateOrganizationDialog
        open={createOrgOpen}
        onOpenChange={setCreateOrgOpen}
      />
      {selectedOrg && (
        <EditOrganizationDialog
          open={editOrgOpen}
          onOpenChange={setEditOrgOpen}
          organization={selectedOrg}
        />
      )}

      {/* Nav items */}
      <div className="flex flex-col gap-0.5 flex-1">
        {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
          <Tooltip key={id} delayDuration={300}>
            <TooltipTrigger asChild>
              <button
                onClick={() => handleNavClick(id)}
                className={`nav-rail-item ${activeNav === id ? "active" : ""}`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {id === "notifications" && unreadNotifCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
                      style={{
                        background: "hsl(var(--unread-badge))",
                        color: "hsl(var(--primary-foreground))",
                      }}
                    >
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
            <button onClick={handleToggleTheme} className="nav-rail-item">
              {theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="text-xs">
            {theme === "light" ? "Dark mode" : "Light mode"}
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
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
              </button>
            </PopoverTrigger>
            <PopoverContent side="right" align="end" className="w-72 p-0">
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="text-base font-semibold bg-primary text-primary-foreground">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-sm text-foreground">
                      {user?.name || "User"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {user?.email || "user@example.com"}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: "hsl(var(--status-online))" }}
                      />
                      <span className="text-[11px] text-muted-foreground">
                        Available
                      </span>
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
