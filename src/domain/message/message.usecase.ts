/**
 * Message use case hooks — service layer.
 *
 * Target-aware: one implementation serves both channel messages and
 * conversation (DM / group) messages via the `ChatTarget` union.
 *
 * useHydrateMessages   → fetch + store the first page
 * useLoadMoreMessages  → cursor pagination (older pages)
 * usePersistSendMessage → send a message and store the response
 */

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  useGetChannelMessagesQuery,
  useGetConversationMessagesQuery,
  useLazyGetChannelMessagesQuery,
  useLazyGetConversationMessagesQuery,
  useSendChannelMessageMutation,
  useSendConversationMessageMutation,
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
import { toScopeKey, type ChatTarget } from "@/types/chatTarget";
import type { MessageListDTO } from "@/types/message";

export const MESSAGES_PAGE_SIZE = 50;

const createClientMessageId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `cmid_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

const isChannelTarget = (
  target: ChatTarget | null,
): target is Extract<ChatTarget, { kind: "channel" }> =>
  target?.kind === "channel";

const isConversationTarget = (
  target: ChatTarget | null,
): target is Extract<ChatTarget, { kind: "conversation" }> =>
  target?.kind === "conversation";

/**
 * Load the first page of messages for the given chat target.
 * Skips until a complete target exists.
 */
const useHydrateMessages = (target: ChatTarget | null) => {
  const dispatch = useAppDispatch();
  const scopeKey = toScopeKey(target);

  const channelTarget = isChannelTarget(target) ? target : null;
  const conversationTarget = isConversationTarget(target) ? target : null;

  const channelResult = useGetChannelMessagesQuery(
    {
      orgId: channelTarget?.orgId as string,
      teamId: channelTarget?.teamId as string,
      channelId: channelTarget?.channelId as string,
      query: { pageSize: MESSAGES_PAGE_SIZE },
    },
    { skip: !channelTarget },
  );

  const conversationResult = useGetConversationMessagesQuery(
    {
      conversationId: conversationTarget?.conversationId as string,
      query: { pageSize: MESSAGES_PAGE_SIZE },
    },
    { skip: !conversationTarget },
  );

  const active = channelTarget ? channelResult : conversationResult;
  const data = channelTarget
    ? (channelResult.data as MessageListDTO | undefined)
    : (conversationResult.data as MessageListDTO | undefined);

  const list = useMemo(
    () => (data ? mapMessageListDtoToVO(data) : null),
    [data],
  );

  // Reflect in-flight state so the UI can render a loading state.
  useEffect(() => {
    if (!scopeKey) return;
    dispatch(
      setMessagesLoading({
        scopeKey,
        isInitialLoading: active.isLoading || active.isFetching,
      }),
    );
  }, [scopeKey, active.isLoading, active.isFetching, dispatch]);

  useEffect(() => {
    if (!scopeKey || !list) return;
    dispatch(
      setInitialMessages({
        scopeKey,
        messages: list.data,
        hasMore: list.hasMore,
        nextCursor: list.nextCursor,
      }),
    );
  }, [scopeKey, list, dispatch]);

  return { isLoading: active.isLoading, isFetching: active.isFetching };
};

/**
 * Fetch the next (older) page using the backend cursor.
 * Ready for infinite scrolling — the caller only needs to invoke `loadMore`.
 */
const useLoadMoreMessages = (target: ChatTarget | null) => {
  const dispatch = useAppDispatch();
  const [triggerChannel] = useLazyGetChannelMessagesQuery();
  const [triggerConversation] = useLazyGetConversationMessagesQuery();
  const scopeKey = toScopeKey(target);
  const pagination = useAppSelector((s) => selectMessagePagination(s, scopeKey));
  const inFlight = useRef(false);

  const loadMore = useCallback(async () => {
    if (!target || !scopeKey) return;
    if (!pagination.hasMore || !pagination.nextCursor) return;
    if (inFlight.current) return;

    inFlight.current = true;
    dispatch(setMessagesLoading({ scopeKey, isLoadingMore: true }));

    try {
      const query = {
        pageSize: MESSAGES_PAGE_SIZE,
        beforeId: pagination.nextCursor,
      };

      const dto =
        target.kind === "channel"
          ? await triggerChannel({
              orgId: target.orgId,
              teamId: target.teamId,
              channelId: target.channelId,
              query,
            }).unwrap()
          : await triggerConversation({
              conversationId: target.conversationId,
              query,
            }).unwrap();

      const list = mapMessageListDtoToVO(dto);
      dispatch(
        prependOlderMessages({
          scopeKey,
          messages: list.data,
          hasMore: list.hasMore,
          nextCursor: list.nextCursor,
        }),
      );
    } catch {
      dispatch(setMessagesLoading({ scopeKey, isLoadingMore: false }));
    } finally {
      inFlight.current = false;
    }
  }, [
    target,
    scopeKey,
    pagination,
    triggerChannel,
    triggerConversation,
    dispatch,
  ]);

  return { loadMore, hasMore: pagination.hasMore };
};

/**
 * Send a message to a channel or a conversation. Validates with the
 * backend-mirroring Zod schema, then stores the mapped response VO.
 */
const usePersistSendMessage = () => {
  const dispatch = useAppDispatch();
  const [sendChannel, { isLoading: isSendingChannel }] =
    useSendChannelMessageMutation();
  const [sendConversation, { isLoading: isSendingConversation }] =
    useSendConversationMessageMutation();

  const sendMessage = useCallback(
    async (args: {
      target: ChatTarget;
      content: string;
      threadRootMessageId?: string | null;
    }): Promise<boolean> => {
      const scopeKey = toScopeKey(args.target);
      if (!scopeKey) return false;

      const parsed = sendMessageSchema.safeParse({
        content: args.content,
        fileIds: [],
        mentionedUserIds: [],
        threadRootMessageId: args.threadRootMessageId ?? null,
      });

      if (!parsed.success) return false;

      const body = {
        clientMessageId: createClientMessageId(),
        content: parsed.data.content ?? null,
        fileIds: parsed.data.fileIds,
        mentionedUserIds: parsed.data.mentionedUserIds,
        threadRootMessageId: parsed.data.threadRootMessageId ?? null,
      };

      try {
        const dto =
          args.target.kind === "channel"
            ? await sendChannel({
                orgId: args.target.orgId,
                teamId: args.target.teamId,
                channelId: args.target.channelId,
                body,
              }).unwrap()
            : await sendConversation({
                conversationId: args.target.conversationId,
                body,
              }).unwrap();

        if (dto) {
          dispatch(
            upsertMessage({ scopeKey, message: mapMessageDtoToVO(dto) }),
          );
        }
        return true;
      } catch {
        /* errors toasted in baseApi */
        return false;
      }
    },
    [sendChannel, sendConversation, dispatch],
  );

  return {
    sendMessage,
    isSending: isSendingChannel || isSendingConversation,
  };
};

export { useHydrateMessages, useLoadMoreMessages, usePersistSendMessage };
