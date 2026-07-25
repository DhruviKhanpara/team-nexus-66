# Phase 2 — Workspace Management: Completion Plan

The foundational Org/Team stack is already in place (types, API, mappers, use-cases, slices, `TeamChannelList` wiring, `selectedOrgId` persistence). This plan finishes the remaining Phase 2 work: bootstrapping, org switcher UI, create/edit flows for both orgs and teams, and cache invalidation.

## 1. API layer — add mutations

**`src/api/organizationApi.ts`**
- `createOrganization` mutation → `POST /orgs`, body `{ name, slug }`. `invalidatesTags: [TAGS.ORGANIZATIONS]`.
- `updateOrganization` mutation → `PUT /orgs/:orgId`, body `{ name }`. Invalidates `{ type: ORGANIZATIONS, id: orgId }` and the list tag.

**`src/api/teamApi.ts`**
- `createTeam` mutation → `POST /orgs/:orgId/teams`, body `{ name, description?, isPrivate }`. Invalidates `{ type: TEAMS, id: orgId }`.
- `updateTeam` mutation → `PUT /orgs/:orgId/teams/:teamId`, body `{ name, description? }`. Invalidates the list and the single-team tag.

## 2. Zod schemas

**`src/schemas/organization.schema.ts`** — extend with:
- `updateOrganizationSchema` (just `name`, same rules as create).

**`src/schemas/team.schema.ts`** — add:
- `createTeamSchema`: `name` (1..100, trimmed), `description` (max 1024, nullable/optional), `isPrivate` (boolean, default false).
- `updateTeamSchema`: `name`, `description` (no `isPrivate`).

Rules mirror the backend validators verbatim.

## 3. Domain use-case hooks

**`src/domain/organization/organization.usecase.ts`** — add:
- `usePersistCreateOrganization()` → wraps RTK mutation; on success also calls `setSelectedOrgId(newOrg.id)` so the newly created org becomes active. Returns `{ createOrganization, isLoading, isSuccess, data }`.
- `usePersistUpdateOrganization()` → returns `{ updateOrganization, isLoading, isSuccess }`.

**`src/domain/team/team.usecase.ts`** — add:
- `usePersistCreateTeam()` and `usePersistUpdateTeam()` mirroring the auth pattern (async try/catch, expose `isLoading`/`isSuccess`).

Barrels in `src/domain/organization/index.ts` and `src/domain/team/index.ts` already re-export usecase files, so no barrel edits needed.

## 4. Bootstrap hydration

**`src/components/layout/AppLayout.tsx`**
- Call `useHydrateMyOrganizations()` at the top of `AppLayout` so the org list loads as soon as the authenticated shell mounts.
- After hydration, if `selectedOrgId` is `null` and the list is non-empty, auto-select the first org (dispatch via `useSelectOrganization`). Reconciliation of a stale persisted id is already handled inside the hook.

## 5. Org switcher UI in `NavRail`

Replace the hardcoded "Acme Corporation" popover in **`src/components/layout/NavRail.tsx`** with a real switcher backed by Redux:

- Trigger button shows the initials/icon of the currently selected org (from `state.organization.organizations` + `selectedOrgId`).
- Popover content:
  - Header: selected org name + slug (`slug.teams.com` styling preserved) and icon.
  - "Switch organization" section: list every org from Redux; clicking one dispatches `setSelectedOrgId` via `useSelectOrganization`. The active org gets a check indicator.
  - Footer action: "Create organization" → opens `CreateOrganizationDialog`.
  - "Organization settings" → opens `EditOrganizationDialog` (populated with current org's name).
- Remove the plan/members static copy or replace with `memberCount`/derived data only if available; otherwise drop it.

## 6. Create / Edit Organization dialogs

New files:
- **`src/components/organization/CreateOrganizationDialog.tsx`** — controlled shadcn `Dialog` with `react-hook-form` + `zodResolver(createOrganizationSchema)`. Uses `TextField` for name and slug. On submit calls `usePersistCreateOrganization`. Closes on `isSuccess`. Success toast comes from `baseApi` automatically.
- **`src/components/organization/EditOrganizationDialog.tsx`** — same pattern using `updateOrganizationSchema`; pre-fills `name` from the currently selected org.

Both dialogs receive `open`/`onOpenChange` props and are rendered from `NavRail`.

## 7. Create / Edit Team dialogs + sidebar integration

New files:
- **`src/components/team/CreateTeamDialog.tsx`** — form fields: `name` (TextField), `description` (TextareaField), `isPrivate` (SwitchField). Calls `usePersistCreateTeam` with `selectedOrgId`.
- **`src/components/team/EditTeamDialog.tsx`** — same minus `isPrivate`, pre-filled from a `TeamSummaryVO`.

**`src/components/sidebar/TeamChannelList.tsx`**
- Header row above the team list with "Teams" label and a "+" button that opens `CreateTeamDialog`.
- The existing per-team "+" button (currently unwired) opens `EditTeamDialog` for that team (or is removed — it currently suggests "add channel" which belongs to Phase 3; keep it visually but leave a `TODO(phase-3)` comment and no-op).
- Continue reading teams from `state.team.teamsByOrgId[selectedOrgId]`.

## 8. Mock data cleanup

- Confirm no component still imports mock orgs/teams. Current audit shows only `TeamChannelList` referenced `channels` (Phase 3 scope) and `NavRail` referenced `mockNotifications` (out of scope). Leave those untouched — Phase 2 does not own channels or notifications.
- No changes to `src/data/mockData.ts` in this phase beyond what's above.

## 9. Verification

- `tsgo` clean.
- Manual walkthrough:
  1. Log in → org list loads, first org auto-selected, teams appear in sidebar.
  2. Switch org via popover → sidebar teams update, `selectedTeamId` clears (already handled by slice).
  3. Reload → previously selected org restored from `localStorage`.
  4. Create org → new org becomes selected and appears in switcher.
  5. Edit org name → header + switcher reflect change.
  6. Create team → appears in sidebar for current org.
  7. Edit team name → sidebar updates.
  8. Logout → org + team slices reset (already wired via `clearAuth`).

## Technical notes

- All mutations rely on the existing global toast + refresh behaviour in `baseApi.ts`; no per-call `try/catch` needed inside components — the use-case hooks own it.
- Cache invalidation uses tag ids so unrelated orgs' team lists aren't refetched.
- Dialog state stays local to `NavRail` / `TeamChannelList`; no new Redux surface is introduced for modals.
- No `_id` usage — everything goes through the `id`/VO shape defined in `src/types/organization.ts` and `src/types/team.ts`.
