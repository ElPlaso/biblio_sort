import { configureStore } from '@reduxjs/toolkit';
import referenceReducer from '../features/references/reference-slice';

export const store = configureStore({
  reducer: {
    references: referenceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;