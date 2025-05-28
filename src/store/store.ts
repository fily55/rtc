import { configureStore } from '@reduxjs/toolkit';
import mediaStreamReducer from './mediaStreamReducer';

export const store = configureStore({
  reducer: {
    mediaStream: mediaStreamReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 