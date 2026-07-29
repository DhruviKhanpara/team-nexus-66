/**
 * useActiveChatTarget — resolves the UI's active chat context into the
 * messaging domain's `ChatTarget`, so chat components work identically for
 * workspace channels and conversations.
 */

import { useMemo } from "react";
import { useAppSelector } from "@/app/store";
import {
  selectActiveChatContext,
  selectSelectedOrgId,
  selectSelectedTeamId,
} from "@/features/selectors";
import type { ChatTarget } from "@/types/chatTarget";

export const useActiveChatTarget = (): ChatTarget | null => {
  const context = useAppSelector(selectActiveChatContext);
  const orgId = useAppSelector(selectSelectedOrgId);
  const teamId = useAppSelector(selectSelectedTeamId);

  return useMemo<ChatTarget | null>(() => {
    if (!context) return null;

    if (context.type === "conversation") {
      return { kind: "conversation", conversationId: context.id };
    }

    if (!orgId || !teamId) return null;
    return { kind: "channel", orgId, teamId, channelId: context.id };
  }, [context, orgId, teamId]);
};

export default useActiveChatTarget;
