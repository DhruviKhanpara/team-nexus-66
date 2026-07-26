## Goal

Restructure the sidebar into small, reusable, data-agnostic components so Channels, DMs and a future Workspace abstraction can be added without another refactor. No visual, behavioural, API, Redux-shape or DTO/VO changes.

## Current state (verified by reading the code)

- `SidePanel.tsx` renders a header (title + `SearchBar`) and switches content on `ui.activeNav` between `TeamChannelList`, `ConversationList`, `ActivityFeed`, `NotificationList`.
- `TeamChannelList.tsx` is the God component: it calls `useHydrateTeams(selectedOrgId)` (data fetching), reads three Redux slices inline, filters teams and channels by `ui.searchQuery`, owns expansion state, renders team rows, renders mock channel rows from `data/mockData`, renders the edit/create actions, and hosts both team dialogs.
- `NavRail.tsx` contains the organization switcher popover inline (selected org header, switch list, settings/create entry points, dialogs) alongside nav items, theme toggle, logout and the user popover.
- Components read Redux via inline `useAppSelector(s => s.x.y)`; there is no selectors module.

## Plan

### 1. Sidebar primitives (`src/components/sidebar/primitives/`)
Generic, data-agnostic, no domain knowledge — reused later by Channels/DMs:
- `SidebarSection.tsx` — section wrapper with uppercase label + optional action slot (extracted from the current "Teams" header markup).
- `SidebarGroup.tsx` — collapsible group: chevron, leading slot, label, hover action slot, children; `expanded` + `onToggle` via props (used by TeamItem today).
- `SidebarItem.tsx` — single row: icon, label, active state, unread indicator (dot or count), `onClick`.
- `SidebarEmptyState.tsx` — generic message row ("No teams found.", "Select an organization…", later "No channels").
- `index.ts` barrel.
All existing Tailwind class strings are copied verbatim so rendering is pixel-identical.

### 2. Team section (`src/components/sidebar/team/`)
- `TeamSection.tsx` (container): reads teams for the selected org + search query from selectors, applies the existing filter, owns `expandedTeams` / dialog-open local state, renders `SidebarSection` + `TeamList` + create/edit dialogs. Does **not** fetch.
- `TeamList.tsx` (presentation): receives `teams`, `expandedTeamIds`, callbacks; maps to `TeamItem`.
- `TeamItem.tsx` (presentation): renders one team via `SidebarGroup`, with a `TeamActions` element in the action slot and `children` for whatever section is nested under a team.
- `TeamActions.tsx`: the hover pencil (edit) button; extensible with more actions.
- `CreateTeamButton.tsx`: the `+` button in the section header.

### 3. Channel section (`src/components/sidebar/channel/`)
- `ChannelSection.tsx` (container): takes `teamId` + `searchQuery`, reads the mock `channels` array (unchanged), filters as today, renders `ChannelList`; selection dispatch stays as-is (`setActiveChatContext`).
- `ChannelList.tsx` / `ChannelItem.tsx` (presentation): render channel rows through `SidebarItem`, keeping the announcement/lock/hash icon logic and unread dot.
- `CreateChannelButton.tsx`: rendered only if trivially non-intrusive; otherwise omitted to avoid adding UI (default: **omit**, since it would change visuals).
`ChannelSection` is composed *inside* `TeamItem`'s children by `TeamList`, so team rendering no longer knows about channels; a future Channels API swap touches only this folder.

### 4. Organization switcher (`src/components/sidebar/organization/OrganizationSwitcher.tsx`)
Move the org popover block out of `NavRail` verbatim (trigger button, popover content, switch list, settings/create buttons, both org dialogs). `NavRail` renders `<OrganizationSwitcher />` in the same slot; nav items, theme, logout and user popover stay in `NavRail`.

### 5. Sidebar shell
- `SidePanel.tsx` keeps its role but delegates its header markup to a new `SidebarHeader.tsx` (title + `SearchBar`) and the scroll area to `SidebarContent.tsx`. `SidebarFooter.tsx` only if there is real content — there is none today, so it is **not** created (no empty wrappers).
- `TeamChannelList.tsx` is replaced by `TeamSection` and deleted; `SidePanel` renders `TeamSection` for `activeNav === 'teams'`.

### 6. Data fetching moved out of rendering
`useHydrateTeams(selectedOrgId)` moves from the sidebar component up to `AppLayout`, next to the existing `useHydrateMyOrganizations()` bootstrap. Teams then flow into the sidebar purely from Redux. Behaviour is identical (same hook, same skip-on-null-org semantics).

### 7. Selectors (`src/features/selectors.ts`)
Add small, focused selectors used by the new components (no new state, no duplication):
`selectOrganizations`, `selectSelectedOrgId`, `selectSelectedOrganization`, `selectTeamsForSelectedOrg`, `selectSelectedTeamId`, `selectSelectedTeam`, `selectSearchQuery`, `selectActiveChatContext`, `selectChannelUnreadCount`. Memoized with `createSelector` where derived. These become the seam a later `useWorkspace()` composes over — no `workspaceSlice`, no workspace hook in this phase.

## Technical notes

- No changes to: `src/api/*`, mappers, DTO/VO types, slices, persistence, auth, or `mockData`.
- Local UI state (expansion, dialog open, hover) stays in components; nothing new enters Redux.
- All extracted JSX keeps its exact class names and structure; strict TypeScript with explicit prop interfaces on every presentation component.
- Verification: `tsgo` typecheck plus a Playwright pass on the preview to confirm teams render, expand/collapse, search filtering, channel selection, and the create/edit dialogs behave as before.

## Future-readiness check

Adding real Channels = swapping the data source inside `ChannelSection` only. Adding DMs = a new section built from the same primitives, mounted in `SidebarContent`. Adding `useWorkspace()` = composing the selectors in step 7; component props stay unchanged.
