/**
 * Message use case hooks — service layer.
 *
 * useHydrateChannelMessages → fetch + store the first page
 * useLoadMoreChannelMessages → cursor pagination (older pages)
 * usePersistSendMessage → send a message and store the response
 */

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  useGetChannelMessagesQuery,
  useLazyGetChannelMessagesQuery,
  useSendChannelMessageMutation,
} from "@/api/messageApi";
import { mapMessageDtoToVO, mapMessageListDtoToVO } from "./message.mapper";
import {
  prependOlderMessages,
  setInitialMessages,
  setMessagesLoading,
  upsertMessage,
} from "@/features/messageSlice";
import { selectMessagePagination } from "@/features/selectors";
import { sendMessageSchema } from "@/schemas/message.schema";

export const MESSAGES_PAGE_SIZE = 50;

const createClientMessageId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `cmid_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

/**
 * Load the first page of messages for a channel.
 * Skips until the full Organization → Team → Channel context exists.
 */
const useHydrateChannelMessages = (
  orgId: string | null,
  teamId: string | null,
  channelId: string | null,
) => {
  const dispatch = useAppDispatch();
  const skip = !orgId || !teamId || !channelId;

  const { data, isLoading, isFetching } = useGetChannelMessagesQuery(
    {
      orgId: orgId as string,
      teamId: teamId as string,
      channelId: channelId as string,
      query: { pageSize: MESSAGES_PAGE_SIZE },
    },
    { skip },
  );

  const list = useMemo(
    () => (data ? mapMessageListDtoToVO(data) : null),
    [data],
  );

  // Reflect in-flight state so the UI can render a loading state.
  useEffect(() => {
    if (!channelId || skip) return;
    dispatch(
      setMessagesLoading({
        channelId,
        isInitialLoading: isLoading || isFetching,
      }),
    );
  }, [channelId, skip, isLoading, isFetching, dispatch]);

  useEffect(() => {
    if (!channelId || !list) return;
    dispatch(
      setInitialMessages({
        channelId,
        messages: list.data,
        hasMore: list.hasMore,
        nextCursor: list.nextCursor,
      }),
    );
  }, [channelId, list, dispatch]);

  return { isLoading, isFetching };
};

/**
 * Fetch the next (older) page using the backend cursor.
 * Ready for infinite scrolling — the caller only needs to invoke `loadMore`.
 */
const useLoadMoreChannelMessages = (
  orgId: string | null,
  teamId: string | null,
  channelId: string | null,
) => {
  const dispatch = useAppDispatch();
  const [trigger] = useLazyGetChannelMessagesQuery();
  const pagination = useAppSelector((s) =>
    selectMessagePagination(s, channelId),
  );
  const inFlight = useRef(false);

  const loadMore = useCallback(async () => {
    if (!orgId || !teamId || !channelId) return;
    if (!pagination.hasMore || !pagination.nextCursor) return;
    if (inFlight.current) return;

    inFlight.current = true;
    dispatch(setMessagesLoading({ channelId, isLoadingMore: true }));

    try {
      const dto = await trigger({
        orgId,
        teamId,
        channelId,
        query: {
          pageSize: MESSAGES_PAGE_SIZE,
          beforeId: pagination.nextCursor,
        },
      }).unwrap();

      const list = mapMessageListDtoToVO(dto);
      dispatch(
        prependOlderMessages({
          channelId,
          messages: list.data,
          hasMore: list.hasMore,
          nextCursor: list.nextCursor,
        }),
      );
    } catch {
      dispatch(setMessagesLoading({ channelId, isLoadingMore: false }));
    } finally {
      inFlight.current = false;
    }
  }, [orgId, teamId, channelId, pagination, trigger, dispatch]);

  return { loadMore, hasMore: pagination.hasMore };
};

/**
 * Send a channel message. Validates with the backend-mirroring Zod schema,
 * then stores the mapped response VO.
 */
const usePersistSendMessage = () => {
  const dispatch = useAppDispatch();
  const [sendMutation, { isLoading }] = useSendChannelMessageMutation();

  const sendMessage = useCallback(
    async (args: {
      orgId: string;
      teamId: string;
      channelId: string;
      content: string;
      threadRootMessageId?: string | null;
    }): Promise<boolean> => {
      const parsed = sendMessageSchema.safeParse({
        content: args.content,
        fileIds: [],
        mentionedUserIds: [],
        threadRootMessageId: args.threadRootMessageId ?? null,
      });

      if (!parsed.success) return false;

      try {
        const dto = await sendMutation({
          orgId: args.orgId,
          teamId: args.teamId,
          channelId: args.channelId,
          body: {
            clientMessageId: createClientMessageId(),
            content: parsed.data.content ?? null,
            fileIds: parsed.data.fileIds,
            mentionedUserIds: parsed.data.mentionedUserIds,
            threadRootMessageId: parsed.data.threadRootMessageId ?? null,
          },
        }).unwrap();

        if (dto) {
          dispatch(
            upsertMessage({
              channelId: args.channelId,
              message: mapMessageDtoToVO(dto),
            }),
          );
        }
        return true;
      } catch {
        /* errors toasted in baseApi */
        return false;
      }
    },
    [sendMutation, dispatch],
  );

  return { sendMessage, isSending: isLoading };
};

export {
  useHydrateChannelMessages,
  useLoadMoreChannelMessages,
  usePersistSendMessage,
};
