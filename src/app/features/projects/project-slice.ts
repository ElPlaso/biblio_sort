import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createProject, deleteProject, getProjects, updateProjectItems, projectExists } from '@/app/services/db-service';
import Project from '@/app/types/project';

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

export const createProjectAction = createAsyncThunk('projects/createProject', async ({ title, items, uid }: { title: string, items: string[], uid: string }) => {
    const projectId = await createProject(uid, title, items);
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

export const checkProjectExists = createAsyncThunk('projects/checkProjectExists', async ({projectId, uid} : {projectId: string, uid: string}) => {
    const exists = await projectExists(projectId, uid);
    return exists;
});

export const fetchProjects = createAsyncThunk(
    "projects/fetchProjects",
    async (userId: string, thunkAPI) => {
        const projects = await getProjects(userId);
        return projects;
    }
);

const projectsSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjects.fulfilled, (state, action: PayloadAction<Project[]>) => {
                state.projects = action.payload;
            })
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
            .addCase(checkProjectExists.fulfilled, (state, action: PayloadAction<boolean>) => {
                state.loading = false;
                state.error = null;
            })
    },
});

export default projectsSlice.reducer;
