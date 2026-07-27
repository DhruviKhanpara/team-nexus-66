/**
 * Team use case hooks — service layer.
 */

import { useCallback, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  useGetTeamsQuery,
  useGetTeamQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
} from "@/api/teamApi";
import { mapTeamsListDtoToVO, mapTeamDetailDtoToVO } from "./team.mapper";
import { setTeamsForOrg, setSelectedTeamId } from "@/features/teamSlice";
import type {
  GetTeamsQueryVO,
  CreateTeamDTO,
  UpdateTeamDTO,
} from "@/types/team";

const useHydrateTeams = (orgId: string | null, query?: GetTeamsQueryVO) => {
  const { data, isLoading, isFetching } = useGetTeamsQuery(
    { orgId: orgId as string, query },
    { skip: !orgId },
  );
  const dispatch = useAppDispatch();
  const selectedTeamId = useAppSelector((s) => s.team.selectedTeamId);

  const teamsList = useMemo(
    () => (data ? mapTeamsListDtoToVO(data) : null),
    [data],
  );

  useEffect(() => {
    if (orgId && teamsList) {
      dispatch(setTeamsForOrg({ orgId, teams: teamsList.data }));
    }
  }, [orgId, teamsList, dispatch]);

  // Reconcile persisted selectedTeamId; auto-select first if none set.
  useEffect(() => {
    if (!teamsList) return;
    const teams = teamsList.data;

    if (selectedTeamId && !teams.some((t) => t.id === selectedTeamId)) {
      dispatch(setSelectedTeamId(teams[0]?.id ?? null));
    } else if (!selectedTeamId && teams.length > 0) {
      dispatch(setSelectedTeamId(teams[0].id));
    }
  }, [teamsList, selectedTeamId, dispatch]);

  return { teamsList, isLoading, isFetching };
};

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

const useSelectTeam = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    (teamId: string | null) => {
      dispatch(setSelectedTeamId(teamId));
    },
    [dispatch],
  );
};

const usePersistCreateTeam = () => {
  const [createMutation, { isLoading, isSuccess }] = useCreateTeamMutation();

  const createTeam = useCallback(
    async (args: { orgId: string; body: CreateTeamDTO }) => {
      try {
        await createMutation(args).unwrap();
      } catch {
        /* errors toasted in baseApi */
      }
    },
    [createMutation],
  );

  return { createTeam, isLoading, isSuccess };
};

const usePersistUpdateTeam = () => {
  const [updateMutation, { isLoading, isSuccess }] = useUpdateTeamMutation();

  const updateTeam = useCallback(
    async (args: { orgId: string; teamId: string; body: UpdateTeamDTO }) => {
      try {
        await updateMutation(args).unwrap();
      } catch {
        /* errors toasted in baseApi */
      }
    },
    [updateMutation],
  );

  return { updateTeam, isLoading, isSuccess };
};

export {
  useHydrateTeams,
  useHydrateTeam,
  useSelectTeam,
  usePersistCreateTeam,
  usePersistUpdateTeam,
};
