import { useState } from 'react';
import { Check, ChevronRight, Plus, Settings } from 'lucide-react';
import { useAppSelector } from '@/app/store';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import CreateOrganizationDialog from '@/components/organization/CreateOrganizationDialog';
import EditOrganizationDialog from '@/components/organization/EditOrganizationDialog';
import { useSelectOrganization } from '@/domain/organization';
import {
  selectOrganizations,
  selectSelectedOrgId,
  selectSelectedOrganization,
} from '@/features/selectors';
import { getInitials } from '@/lib/helpers';

/** Owns organization selection UI only. */
const OrganizationSwitcher = () => {
  const organizations = useAppSelector(selectOrganizations);
  const selectedOrgId = useAppSelector(selectSelectedOrgId);
  const selectedOrg = useAppSelector(selectSelectedOrganization);
  const selectOrganization = useSelectOrganization();

  const [createOrgOpen, setCreateOrgOpen] = useState(false);
  const [editOrgOpen, setEditOrgOpen] = useState(false);

  return (
    <>
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
    </>
  );
};

export default OrganizationSwitcher;
