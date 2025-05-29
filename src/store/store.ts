import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import mediaStreamReducer from './mediaStreamReducer';
import { mediaStreamSaga } from './mediaStreamSaga';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    mediaStream: mediaStreamReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(mediaStreamSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 