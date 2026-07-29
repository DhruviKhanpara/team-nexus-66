/**
 * Conversation API endpoints — RTK Query.
 *
 * Mounted at /conversations (independent of the workspace hierarchy).
 */

import { baseApi } from "./baseApi";
import { TAGS } from "./tags";
import type {
  AddParticipantDTO,
  ConversationDetailDTO,
  ConversationParticipantsListDTO,
  ConversationsListDTO,
  CreateDirectConversationDTO,
  CreateGroupConversationDTO,
  DirectLookupDTO,
  GetConversationsQueryDTO,
  UpdateGroupConversationDTO,
  UpdateParticipantRoleDTO,
} from "@/types/conversation";

export const CONVERSATION_LIST_ID = "LIST";

const buildQueryString = (query: Record<string, unknown> = {}): string => {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });
  const qs = params.toString();
  return qs ? `?${qs}` : "";
};

const conversationsUrl = "/conversations";

export const conversationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getConversations: build.query<
      ConversationsListDTO,
      GetConversationsQueryDTO | void
    >({
      query: (query) =>
        `${conversationsUrl}${buildQueryString({ ...(query ?? {}) })}`,
      providesTags: [{ type: TAGS.CONVERSATIONS, id: CONVERSATION_LIST_ID }],
    }),


    getConversation: build.query<ConversationDetailDTO, string>({
      query: (conversationId) => `${conversationsUrl}/${conversationId}`,
      providesTags: (_res, _err, conversationId) => [
        { type: TAGS.CONVERSATIONS, id: conversationId },
      ],
    }),

    lookupDirectConversation: build.query<DirectLookupDTO, string>({
      query: (userId) =>
        `${conversationsUrl}/direct${buildQueryString({ userId })}`,
    }),

    getConversationParticipants: build.query<
      ConversationParticipantsListDTO,
      { conversationId: string; pageNumber?: number; pageSize?: number }
    >({
      query: ({ conversationId, pageNumber, pageSize }) =>
        `${conversationsUrl}/${conversationId}/participants${buildQueryString({
          pageNumber,
          pageSize,
        })}`,
      providesTags: (_res, _err, { conversationId }) => [
        { type: TAGS.MEMBERS, id: conversationId },
      ],
    }),

    createDirectConversation: build.mutation<
      ConversationDetailDTO,
      CreateDirectConversationDTO
    >({
      query: (body) => ({
        url: `${conversationsUrl}/direct`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: TAGS.CONVERSATIONS, id: CONVERSATION_LIST_ID }],
    }),

    createGroupConversation: build.mutation<
      ConversationDetailDTO,
      CreateGroupConversationDTO
    >({
      query: (body) => ({
        url: `${conversationsUrl}/group`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: TAGS.CONVERSATIONS, id: CONVERSATION_LIST_ID }],
    }),

    updateGroupConversation: build.mutation<
      void,
      { conversationId: string; body: UpdateGroupConversationDTO }
    >({
      query: ({ conversationId, body }) => ({
        url: `${conversationsUrl}/${conversationId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_res, _err, { conversationId }) => [
        { type: TAGS.CONVERSATIONS, id: CONVERSATION_LIST_ID },
        { type: TAGS.CONVERSATIONS, id: conversationId },
      ],
    }),

    addConversationParticipant: build.mutation<
      void,
      { conversationId: string; body: AddParticipantDTO }
    >({
      query: ({ conversationId, body }) => ({
        url: `${conversationsUrl}/${conversationId}/participants`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_res, _err, { conversationId }) => [
        { type: TAGS.MEMBERS, id: conversationId },
        { type: TAGS.CONVERSATIONS, id: conversationId },
      ],
    }),

    updateConversationParticipantRole: build.mutation<
      void,
      {
        conversationId: string;
        participantId: string;
        body: UpdateParticipantRoleDTO;
      }
    >({
      query: ({ conversationId, participantId, body }) => ({
        url: `${conversationsUrl}/${conversationId}/participants/${participantId}/role`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_res, _err, { conversationId }) => [
        { type: TAGS.MEMBERS, id: conversationId },
      ],
    }),

    removeConversationParticipant: build.mutation<
      void,
      { conversationId: string; participantId: string }
    >({
      query: ({ conversationId, participantId }) => ({
        url: `${conversationsUrl}/${conversationId}/participants/${participantId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, { conversationId }) => [
        { type: TAGS.MEMBERS, id: conversationId },
        { type: TAGS.CONVERSATIONS, id: conversationId },
      ],
    }),

    leaveConversation: build.mutation<void, string>({
      query: (conversationId) => ({
        url: `${conversationsUrl}/${conversationId}/participants/me`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, conversationId) => [
        { type: TAGS.CONVERSATIONS, id: CONVERSATION_LIST_ID },
        { type: TAGS.CONVERSATIONS, id: conversationId },
      ],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetConversationQuery,
  useLazyLookupDirectConversationQuery,
  useGetConversationParticipantsQuery,
  useCreateDirectConversationMutation,
  useCreateGroupConversationMutation,
  useUpdateGroupConversationMutation,
  useAddConversationParticipantMutation,
  useUpdateConversationParticipantRoleMutation,
  useRemoveConversationParticipantMutation,
  useLeaveConversationMutation,
} = conversationApi;
