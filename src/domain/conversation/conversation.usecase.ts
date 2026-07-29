/**
 * Conversation use case hooks — service layer.
 *
 * Hydration hooks fetch + map + store; persist hooks mutate + map + store.
 * Components never touch the API layer or mappers directly.
 */

import { useCallback, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  useAddConversationParticipantMutation,
  useCreateDirectConversationMutation,
  useCreateGroupConversationMutation,
  useGetConversationParticipantsQuery,
  useGetConversationsQuery,
  useLazyLookupDirectConversationQuery,
  useLeaveConversationMutation,
  useRemoveConversationParticipantMutation,
  useUpdateConversationParticipantRoleMutation,
  useUpdateGroupConversationMutation,
} from "@/api/conversationApi";
import {
  mapConversationDtoToVO,
  mapConversationParticipantsListDtoToVO,
  mapConversationsListDtoToVO,
  mapDirectLookupDtoToVO,
} from "./conversation.mapper";
import {
  setConversations,
  setConversationsLoading,
  setSelectedConversationId,
  upsertConversation,
  removeConversation,
} from "@/features/conversationSlice";
import { selectSelectedConversationId } from "@/features/selectors";
import {
  createDirectConversationSchema,
  createGroupConversationSchema,
  updateGroupConversationSchema,
} from "@/schemas/conversation.schema";
import type {
  ConversationVO,
  DirectLookupVO,
} from "@/types/conversation";

export const CONVERSATIONS_PAGE_SIZE = 50;

/**
 * Load the current user's conversations and keep them in Redux.
 * Restores a persisted selection when it is still valid.
 */
const useHydrateConversations = () => {
  const dispatch = useAppDispatch();
  const selectedConversationId = useAppSelector(selectSelectedConversationId);

  const { data, isLoading, isFetching } = useGetConversationsQuery({
    pageSize: CONVERSATIONS_PAGE_SIZE,
    pageNumber: 1,
  });

  const list = useMemo(
    () => (data ? mapConversationsListDtoToVO(data) : null),
    [data],
  );

  useEffect(() => {
    dispatch(setConversationsLoading(isLoading || isFetching));
  }, [isLoading, isFetching, dispatch]);

  useEffect(() => {
    if (!list) return;
    dispatch(setConversations(list.data));

    // Keep a valid persisted selection; otherwise leave the surface empty
    // so the user explicitly picks a conversation.
    if (
      selectedConversationId &&
      !list.data.some((c) => c.id === selectedConversationId)
    ) {
      dispatch(setSelectedConversationId(null));
    }
    // `selectedConversationId` intentionally omitted — we only reconcile on new data.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list, dispatch]);

  return { isLoading, isFetching };
};

/** Participants of a conversation (group member management). */
const useHydrateConversationParticipants = (
  conversationId: string | null,
) => {
  const { data, isLoading, isFetching } = useGetConversationParticipantsQuery(
    { conversationId: conversationId as string, pageSize: 100, pageNumber: 1 },
    { skip: !conversationId },
  );

  const participants = useMemo(
    () => mapConversationParticipantsListDtoToVO(data).data,
    [data],
  );

  return { participants, isLoading, isFetching };
};

/** Create (or open) a direct conversation with another user. */
const usePersistCreateDirectConversation = () => {
  const dispatch = useAppDispatch();
  const [createMutation, { isLoading }] = useCreateDirectConversationMutation();

  const createDirectConversation = useCallback(
    async (targetUserId: string): Promise<ConversationVO | null> => {
      const parsed = createDirectConversationSchema.safeParse({ targetUserId });
      if (!parsed.success) return null;

      try {
        const dto = await createMutation(parsed.data).unwrap();
        const vo = mapConversationDtoToVO(dto);
        dispatch(upsertConversation(vo));
        dispatch(setSelectedConversationId(vo.id));
        return vo;
      } catch {
        /* errors toasted in baseApi */
        return null;
      }
    },
    [createMutation, dispatch],
  );

  return { createDirectConversation, isCreating: isLoading };
};

/** Create a group conversation (requires at least 2 other participants). */
const usePersistCreateGroupConversation = () => {
  const dispatch = useAppDispatch();
  const [createMutation, { isLoading }] = useCreateGroupConversationMutation();

  const createGroupConversation = useCallback(
    async (input: {
      name: string;
      participantUserIds: string[];
    }): Promise<ConversationVO | null> => {
      const parsed = createGroupConversationSchema.safeParse(input);
      if (!parsed.success) return null;

      try {
        const dto = await createMutation(parsed.data).unwrap();
        const vo = mapConversationDtoToVO(dto);
        dispatch(upsertConversation(vo));
        dispatch(setSelectedConversationId(vo.id));
        return vo;
      } catch {
        return null;
      }
    },
    [createMutation, dispatch],
  );

  return { createGroupConversation, isCreating: isLoading };
};

/** Rename a group conversation. */
const usePersistUpdateGroupConversation = () => {
  const [updateMutation, { isLoading }] = useUpdateGroupConversationMutation();

  const updateGroupConversation = useCallback(
    async (conversationId: string, name: string): Promise<boolean> => {
      const parsed = updateGroupConversationSchema.safeParse({ name });
      if (!parsed.success) return false;

      try {
        await updateMutation({ conversationId, body: parsed.data }).unwrap();
        return true;
      } catch {
        return false;
      }
    },
    [updateMutation],
  );

  return { updateGroupConversation, isUpdating: isLoading };
};

/** Add / remove / promote participants of a group conversation. */
const usePersistConversationParticipants = () => {
  const [addMutation, { isLoading: isAdding }] =
    useAddConversationParticipantMutation();
  const [roleMutation, { isLoading: isUpdatingRole }] =
    useUpdateConversationParticipantRoleMutation();
  const [removeMutation, { isLoading: isRemoving }] =
    useRemoveConversationParticipantMutation();

  const addParticipant = useCallback(
    async (conversationId: string, userId: string): Promise<boolean> => {
      try {
        await addMutation({ conversationId, body: { userId } }).unwrap();
        return true;
      } catch {
        return false;
      }
    },
    [addMutation],
  );

  const updateParticipantRole = useCallback(
    async (
      conversationId: string,
      participantId: string,
      role: string,
    ): Promise<boolean> => {
      try {
        await roleMutation({
          conversationId,
          participantId,
          body: { role },
        }).unwrap();
        return true;
      } catch {
        return false;
      }
    },
    [roleMutation],
  );

  const removeParticipant = useCallback(
    async (conversationId: string, participantId: string): Promise<boolean> => {
      try {
        await removeMutation({ conversationId, participantId }).unwrap();
        return true;
      } catch {
        return false;
      }
    },
    [removeMutation],
  );

  return {
    addParticipant,
    updateParticipantRole,
    removeParticipant,
    isMutating: isAdding || isUpdatingRole || isRemoving,
  };
};

/** Leave a group conversation. */
const usePersistLeaveConversation = () => {
  const dispatch = useAppDispatch();
  const [leaveMutation, { isLoading }] = useLeaveConversationMutation();

  const leaveConversation = useCallback(
    async (conversationId: string): Promise<boolean> => {
      try {
        await leaveMutation(conversationId).unwrap();
        dispatch(removeConversation(conversationId));
        return true;
      } catch {
        return false;
      }
    },
    [leaveMutation, dispatch],
  );

  return { leaveConversation, isLeaving: isLoading };
};

/** Look up whether a direct conversation with a user already exists. */
const useLookupDirectConversation = () => {
  const [trigger, { isFetching }] = useLazyLookupDirectConversationQuery();

  const lookupDirectConversation = useCallback(
    async (userId: string): Promise<DirectLookupVO | null> => {
      try {
        const dto = await trigger(userId).unwrap();
        return mapDirectLookupDtoToVO(dto);
      } catch {
        return null;
      }
    },
    [trigger],
  );

  return { lookupDirectConversation, isLookingUp: isFetching };
};

/** Select the active conversation. */
const useSelectConversation = () => {
  const dispatch = useAppDispatch();

  const selectConversation = useCallback(
    (conversationId: string | null) => {
      dispatch(setSelectedConversationId(conversationId));
    },
    [dispatch],
  );

  return { selectConversation };
};

export {
  useHydrateConversations,
  useHydrateConversationParticipants,
  usePersistCreateDirectConversation,
  usePersistCreateGroupConversation,
  usePersistUpdateGroupConversation,
  usePersistConversationParticipants,
  usePersistLeaveConversation,
  useLookupDirectConversation,
  useSelectConversation,
};
