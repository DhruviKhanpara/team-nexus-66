/**
 * Team use case hooks — service layer.
 */

import { useCallback, useEffect, useMemo } from "react";
import { useAppDispatch } from "@/app/store";
import { useGetTeamsQuery, useGetTeamQuery } from "@/api/teamApi";
import { mapTeamsListDtoToVO, mapTeamDetailDtoToVO } from "./team.mapper";
import { setTeamsForOrg, setSelectedTeamId } from "@/features/teamSlice";
import type { GetTeamsQueryVO } from "@/types/team";

/**
 * Hydrate paginated teams for an organization and push summaries into Redux.
 */
const useHydrateTeams = (orgId: string | null, query?: GetTeamsQueryVO) => {
  const { data, isLoading, isFetching } = useGetTeamsQuery(
    { orgId: orgId as string, query },
    { skip: !orgId },
  );
  const dispatch = useAppDispatch();

  const teamsList = useMemo(
    () => (data ? mapTeamsListDtoToVO(data) : null),
    [data],
  );

  useEffect(() => {
    if (orgId && teamsList) {
      dispatch(setTeamsForOrg({ orgId, teams: teamsList.data }));
    }
  }, [orgId, teamsList, dispatch]);

  return { teamsList, isLoading, isFetching };
};

/**
 * Hydrate a single team detail.
 */
const useHydrateTeam = (orgId: string | null, teamId: string | null) => {
  const { data, isLoading, isFetching } = useGetTeamQuery(
    { orgId: orgId as string, teamId: teamId as string },
    { skip: !orgId || !teamId },
  );

  const team = useMemo(
    () => (data ? mapTeamDetailDtoToVO(data) : null),
    [data],
  );

  return { team, isLoading, isFetching };
};

/**
 * Returns a callback to set the currently selected team.
 */
const useSelectTeam = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    (teamId: string | null) => {
      dispatch(setSelectedTeamId(teamId));
    },
    [dispatch],
  );
};

export { useHydrateTeams, useHydrateTeam, useSelectTeam };
