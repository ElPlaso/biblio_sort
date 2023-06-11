import { configureStore } from '@reduxjs/toolkit';
import referenceReducer from '../features/references/reference-slice';
import themeReducer from '../features/theme/theme-slice';
import authReducer from '../features/auth/auth-slice';

export const store = configureStore({
    reducer: {
        references: referenceReducer,
        theme: themeReducer,
        auth: authReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;