import { configureStore } from '@reduxjs/toolkit';
import referenceReducer from '../features/references/reference-slice';
import themeReducer from '../features/theme/theme-slice';
import authReducer from '../features/auth/auth-slice';
import projectReducer from '../features/projects/project-slice';

export const store = configureStore({
    reducer: {
        references: referenceReducer,
        theme: themeReducer,
        auth: authReducer,
        projects: projectReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;