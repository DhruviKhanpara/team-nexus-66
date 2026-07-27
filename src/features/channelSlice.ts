/**
 * Channel Redux slice — STATE ONLY.
 *
 * Stores channels keyed by teamId (as VOs) and the currently selected
 * channel id. Only `selectedChannelId` is persisted to localStorage.
 * Resets on logout and clears the selection when the org/team changes.
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearAuth } from "@/features/authSlice";
import { setSelectedOrgId } from "@/features/organizationSlice";
import { setSelectedTeamId } from "@/features/teamSlice";
import type { ChannelSummaryVO } from "@/types/channel";

const STORAGE_KEY = "selectedChannelId";

const readPersistedSelectedChannelId = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

const writePersistedSelectedChannelId = (channelId: string | null) => {
  if (typeof window === "undefined") return;
  try {
    if (channelId) {
      window.localStorage.setItem(STORAGE_KEY, channelId);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    /* ignore quota/security errors */
  }
};

interface ChannelState {
  channelsByTeamId: Record<string, ChannelSummaryVO[]>;
  selectedChannelId: string | null;
}

const initialState: ChannelState = {
  channelsByTeamId: {},
  selectedChannelId: readPersistedSelectedChannelId(),
};

const channelSlice = createSlice({
  name: "channel",
  initialState,
  reducers: {
    setChannelsForTeam: (
      state,
      action: PayloadAction<{ teamId: string; channels: ChannelSummaryVO[] }>,
    ) => {
      state.channelsByTeamId[action.payload.teamId] = action.payload.channels;
    },
    setSelectedChannelId: (state, action: PayloadAction<string | null>) => {
      state.selectedChannelId = action.payload;
      writePersistedSelectedChannelId(action.payload);
    },
    clearChannels: (state) => {
      state.channelsByTeamId = {};
      state.selectedChannelId = null;
      writePersistedSelectedChannelId(null);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(clearAuth, (state) => {
        state.channelsByTeamId = {};
        state.selectedChannelId = null;
        writePersistedSelectedChannelId(null);
      })
      .addCase(setSelectedOrgId, (state) => {
        state.selectedChannelId = null;
        writePersistedSelectedChannelId(null);
      })
      .addCase(setSelectedTeamId, (state) => {
        state.selectedChannelId = null;
        writePersistedSelectedChannelId(null);
      });
  },
});

export const { setChannelsForTeam, setSelectedChannelId, clearChannels } =
  channelSlice.actions;

export default channelSlice.reducer;
