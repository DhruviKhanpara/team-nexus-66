import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { baseApi } from '@/api/baseApi';
import authReducer from '@/features/authSlice';
import uiReducer from '@/features/uiSlice';
import chatReducer from '@/features/chatSlice';
import organizationReducer from '@/features/organizationSlice';
import teamReducer from '@/features/teamSlice';
import channelReducer from '@/features/channelSlice';
import messageReducer from '@/features/messageSlice';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    ui: uiReducer,
    chat: chatReducer,
    organization: organizationReducer,
    team: teamReducer,
    channel: channelReducer,
    message: messageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
