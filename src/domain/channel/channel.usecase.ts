/**
 * Channel use case hooks — service layer.
 */

import { useCallback, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  useGetChannelsQuery,
  useGetChannelQuery,
  useCreateChannelMutation,
  useUpdateChannelMutation,
  useArchiveChannelMutation,
  useUnarchiveChannelMutation,
} from "@/api/channelApi";
import {
  mapChannelsListDtoToVO,
  mapChannelDetailDtoToVO,
} from "./channel.mapper";
import {
  setChannelsForTeam,
  setSelectedChannelId,
} from "@/features/channelSlice";
import type {
  GetChannelsQueryVO,
  CreateChannelDTO,
  UpdateChannelDTO,
} from "@/types/channel";

const useHydrateChannels = (
  orgId: string | null,
  teamId: string | null,
  query?: GetChannelsQueryVO,
) => {
  const { data, isLoading, isFetching } = useGetChannelsQuery(
    { orgId: orgId as string, teamId: teamId as string, query },
    { skip: !orgId || !teamId },
  );
  const dispatch = useAppDispatch();
  const selectedChannelId = useAppSelector((s) => s.channel.selectedChannelId);

  const channelsList = useMemo(
    () => (data ? mapChannelsListDtoToVO(data) : null),
    [data],
  );

  useEffect(() => {
    if (teamId && channelsList) {
      dispatch(setChannelsForTeam({ teamId, channels: channelsList.data }));
    }
  }, [teamId, channelsList, dispatch]);

  // Reconcile persisted selectedChannelId; auto-select first if none set.
  useEffect(() => {
    if (!channelsList) return;
    const channels = channelsList.data;

    if (selectedChannelId && !channels.some((c) => c.id === selectedChannelId)) {
      dispatch(setSelectedChannelId(channels[0]?.id ?? null));
    } else if (!selectedChannelId && channels.length > 0) {
      dispatch(setSelectedChannelId(channels[0].id));
    }
  }, [channelsList, selectedChannelId, dispatch]);

  return { channelsList, isLoading, isFetching };
};

const useHydrateChannel = (
  orgId: string | null,
  teamId: string | null,
  channelId: string | null,
) => {
  const { data, isLoading, isFetching } = useGetChannelQuery(
    {
      orgId: orgId as string,
      teamId: teamId as string,
      channelId: channelId as string,
    },
    { skip: !orgId || !teamId || !channelId },
  );

  const channel = useMemo(
    () => (data ? mapChannelDetailDtoToVO(data) : null),
    [data],
  );

  return { channel, isLoading, isFetching };
};

const useSelectChannel = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    (channelId: string | null) => {
      dispatch(setSelectedChannelId(channelId));
    },
    [dispatch],
  );
};

const usePersistCreateChannel = () => {
  const [createMutation, { isLoading, isSuccess }] = useCreateChannelMutation();

  const createChannel = useCallback(
    async (args: { orgId: string; teamId: string; body: CreateChannelDTO }) => {
      try {
        await createMutation(args).unwrap();
      } catch {
        /* errors toasted in baseApi */
      }
    },
    [createMutation],
  );

  return { createChannel, isLoading, isSuccess };
};

const usePersistUpdateChannel = () => {
  const [updateMutation, { isLoading, isSuccess }] = useUpdateChannelMutation();

  const updateChannel = useCallback(
    async (args: {
      orgId: string;
      teamId: string;
      channelId: string;
      body: UpdateChannelDTO;
    }) => {
      try {
        await updateMutation(args).unwrap();
      } catch {
        /* errors toasted in baseApi */
      }
    },
    [updateMutation],
  );

  return { updateChannel, isLoading, isSuccess };
};

const usePersistArchiveChannel = () => {
  const [archiveMutation, { isLoading, isSuccess }] =
    useArchiveChannelMutation();

  const archiveChannel = useCallback(
    async (args: { orgId: string; teamId: string; channelId: string }) => {
      try {
        await archiveMutation(args).unwrap();
      } catch {
        /* errors toasted in baseApi */
      }
    },
    [archiveMutation],
  );

  return { archiveChannel, isLoading, isSuccess };
};

const usePersistUnarchiveChannel = () => {
  const [unarchiveMutation, { isLoading, isSuccess }] =
    useUnarchiveChannelMutation();

  const unarchiveChannel = useCallback(
    async (args: { orgId: string; teamId: string; channelId: string }) => {
      try {
        await unarchiveMutation(args).unwrap();
      } catch {
        /* errors toasted in baseApi */
      }
    },
    [unarchiveMutation],
  );

  return { unarchiveChannel, isLoading, isSuccess };
};

export {
  useHydrateChannels,
  useHydrateChannel,
  useSelectChannel,
  usePersistCreateChannel,
  usePersistUpdateChannel,
  usePersistArchiveChannel,
  usePersistUnarchiveChannel,
};
