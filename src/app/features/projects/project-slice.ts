import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';
import { createProject, deleteProject, updateProjectItems } from '../../../../firebase';

interface Project {
    id: string;
    title: string;
    items: string[];
}

interface ProjectsState {
    projects: Project[];
    loading: boolean;
    error: string | null;
}

const initialState: ProjectsState = {
    projects: [],
    loading: false,
    error: null,
};

export const createProjectAction = createAsyncThunk('projects/createProject', async ({ title, items }: { title: string, items: string[] }, { getState }) => {
    const state = getState() as RootState;
    const userId = state.auth.user!.uid;
    const projectId = await createProject(userId, title, items);
    if (!projectId) {
        throw new Error('Project ID was not created');
    }
    return { projectId, title, items };
});

export const updateProjectItemsAction = createAsyncThunk('projects/updateProjectItems', async ({ projectId, items }: { projectId: string, items: string[] }) => {
    await updateProjectItems(projectId, items);
    return { projectId, items };
});

export const deleteProjectAction = createAsyncThunk('projects/deleteProject', async (projectId: string) => {
    await deleteProject(projectId);
    return projectId;
});


const projectsSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createProjectAction.fulfilled, (state, action: PayloadAction<{ projectId: string, title: string, items: string[] }>) => {
                state.projects.push({ id: action.payload.projectId, title: action.payload.title, items: action.payload.items });
            })
            .addCase(updateProjectItemsAction.fulfilled, (state, action: PayloadAction<{ projectId: string, items: string[] }>) => {
                const project = state.projects.find(project => project.id === action.payload.projectId);
                if (project) {
                    project.items = action.payload.items;
                }
            })
            .addCase(deleteProjectAction.fulfilled, (state, action: PayloadAction<string>) => {
                state.projects = state.projects.filter(project => project.id !== action.payload);
            })
    },
});

export default projectsSlice.reducer;
