## Phase 1 — Organizations & Teams (mirror auth architecture)

Found the team files this time: `routes/team.routes.js`, `controllers/team.controller.js`, `validators/team.validators.js`, and they are mounted at `/orgs/:orgId/teams` from `organization.routes.js`. Plan derived from actual controllers + services.

### Backend contract (source of truth)

**Endpoints implemented in this phase**
- `GET /orgs/my` → list of orgs the user belongs to
- `GET /orgs/:orgId` → single org details
- `GET /orgs/:orgId/teams` → paginated teams (query: `search`, `isArchived`, `includePrivate`, `pageNumber`, `pageSize`)
- `GET /orgs/:orgId/teams/:teamId` → single team details

**Response shapes (from `organization.service.js` / `team.service.js`)**

`GET /orgs/my` → `Array<{ id, name, slug, iconUrl, createdAt, role, joinedAt }>`

`GET /orgs/:orgId` → `{ id, name, slug, iconUrl, createdAt }`

`GET /orgs/:orgId/teams` → paginated: `{ data: Team[], totalCount, pageNumber, pageSize, totalPages, hasNextPage, hasPreviousPage }` where each `Team` is
`{ id, orgId, name, description, icon (url|null), isPrivate, isArchived, archivedAt, createdAt, memberCount, role, isMuted, joinedAt }`

`GET /orgs/:orgId/teams/:teamId` → `{ id, orgId, name, description, icon ({url,publicId}|null), isPrivate, isArchived, archivedAt, createdAt, memberCount }`

**Backend quirk to flag (do not fix in frontend):** `team.controller.js` calls `sendResponse(res, 200, result, "...")` — the result lands in the `exceptionCode` slot of the envelope, so `result` in the JSON body will be `null`. The frontend will still consume the documented `result` field (matches every other endpoint and the `sendResponse` signature). I'll flag this in chat after the plan so the server can fix the controller; without that fix the team API responses won't deserialize correctly. No frontend workaround.

### File layout (mirrors auth exactly)

```text
src/types/organization.ts          # DTOs + VOs (replaces existing mock-shaped file)
src/types/team.ts                  # DTOs + VOs
src/api/organizationApi.ts         # RTK Query endpoints
src/api/teamApi.ts                 # RTK Query endpoints
src/schemas/organization.schema.ts # zod (createOrganizationSchema only — only one used in phase 1)
src/schemas/team.schema.ts         # zod (getTeamsSchema query — only one used in phase 1)
src/domain/organization/organization.mapper.ts
src/domain/organization/organization.usecase.ts
src/domain/organization/index.ts
src/domain/team/team.mapper.ts
src/domain/team/team.usecase.ts
src/domain/team/index.ts
src/features/organizationSlice.ts  # { selectedOrgId, organizations: OrgSummaryVO[] }
src/features/teamSlice.ts          # { teamsByOrgId: Record<orgId, TeamSummaryVO[]>, selectedTeamId }
```

Also:
- Register new slices in `src/app/store.ts`.
- Add `Organizations`, `Teams` already exist in `src/api/tags.ts` — reuse.
- Update `src/types/index.ts` re-exports.
- Update `src/components/sidebar/TeamChannelList.tsx` to consume Redux VOs instead of `teams` from mockData; channels keep using mockData.
- `src/features/authSlice.clearAuth` will also reset org+team slices (via extraReducers in each slice listening to `clearAuth`) so logout/session-expiry clears workspace state.

### DTO / VO design (suffix convention from `user.ts`)

`types/organization.ts`
- `OrgSummaryDTO` (item from `/orgs/my`), `OrgDetailDTO` (`/orgs/:orgId`)
- `OrgSummaryVO`, `OrgDetailVO` (camelCase mirrors, `createdAt: string`)

`types/team.ts`
- `TeamSummaryDTO` (item from teams list), `TeamDetailDTO`, plus shared `PaginatedDTO<T>` (or local `TeamsListDTO`)
- `TeamSummaryVO`, `TeamDetailVO`, `TeamsListVO`

Mappers convert every DTO → VO; nothing else stores DTOs.

### Use case hooks (mirrors `useHydrateMe` / auth pattern)

`organization.usecase.ts`
- `useHydrateMyOrganizations()` — calls query, maps DTO→VO, `dispatch(setOrganizations(vos))`, returns `{ organizations, isLoading }`.
- `useHydrateOrganization(orgId)` — single org detail, returns `{ organization, isLoading }`.
- `useSelectOrganization()` — returns `(orgId) => dispatch(setSelectedOrgId(orgId))`.

`team.usecase.ts`
- `useHydrateTeams(orgId, query?)` — fetches paginated teams for an org, maps, `dispatch(setTeamsForOrg({ orgId, teams }))`.
- `useHydrateTeam(orgId, teamId)` — detail.
- `useSelectTeam()` — `(teamId) => dispatch(setSelectedTeamId(teamId))`.

All async hooks follow the auth pattern: `async/await + .unwrap()` inside `try/catch`, errors swallowed (baseApi toasts).

### Redux slices

`organizationSlice`
- state: `{ organizations: OrgSummaryVO[]; selectedOrgId: string | null }`
- reducers: `setOrganizations`, `setSelectedOrgId`, `clearOrganizations`
- `extraReducers`: on `clearAuth` → reset to initial.
- Initial `selectedOrgId` read from `localStorage.getItem("selectedOrgId")`.
- A tiny middleware (or `setSelectedOrgId` reducer itself) writes/removes the key in `localStorage`. Only `selectedOrgId` is persisted.

`teamSlice`
- state: `{ teamsByOrgId: Record<string, TeamSummaryVO[]>; selectedTeamId: string | null }`
- reducers: `setTeamsForOrg`, `setSelectedTeamId`, `clearTeams`
- `extraReducers`: on `clearAuth` → reset; on `setSelectedOrgId` → clear `selectedTeamId`.

Only VOs live in Redux. Lists fetched via RTK Query stay cached in `baseApi` too.

### Persisted selectedOrgId reconciliation

In `App.tsx` (or a small `useReconcileSelectedOrg` hook called once after `useHydrateMyOrganizations`):
1. After organizations load, if `selectedOrgId` exists and is NOT in the list → `dispatch(setSelectedOrgId(null))` (also clears localStorage via reducer).
2. Do NOT auto-pick the first org.

### Sidebar integration

`TeamChannelList.tsx`:
- Replace `teams` import from mockData with `useAppSelector` reading `organizationSlice.selectedOrgId` and `teamSlice.teamsByOrgId[selectedOrgId]`.
- Call `useHydrateTeams(selectedOrgId)` when `selectedOrgId` is set.
- If `selectedOrgId == null`, render an empty state ("Select an organization") — no auto-selection.
- Channels list inside each team continues using `channels` from mockData (filtered by `team.id` VO field — note rename from `_id` to `id`).

Org picker UI is not in scope for phase 1; selection can be exercised manually via the existing surfaces (or a follow-up task). The persistence/reconciliation logic is complete and ready for whatever picker is added next.

### Out of scope (explicit)

- No changes to auth files, login/register pages, baseApi behavior.
- No channel API, messaging, sockets, presence, typing.
- No mutations for org/team in phase 1 (the auth-mirroring file shells exist but only `GET` endpoints are wired). Schemas for create/update can be added when those mutations are implemented in a later phase.
- No removal of channel mock data.

### Acceptance check

- `bun` typecheck passes; no `any`.
- Sidebar renders teams from API for the selected org; refreshing the page restores selection if still valid, clears it if not.
- Redux DevTools shows only VOs in `organization` and `team` slices.
- `localStorage` contains only `selectedOrgId` (plus pre-existing `theme`).
