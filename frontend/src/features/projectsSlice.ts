import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Project, CreateProjectDto } from '../types'
import { projectService } from '../services/projectService'

interface ProjectsState {
  projects: Project[]
  selectedProject: Project | null
  loading: boolean
  error: string | null
}

const initialState: ProjectsState = {
  projects: [],
  selectedProject: null,
  loading: false,
  error: null,
}

export const fetchProjects = createAsyncThunk(
  'projects/fetchAll',
  async () => {
    const response = await projectService.getAll()
    return response.data
  }
)

export const fetchProjectById = createAsyncThunk(
  'projects/fetchById',
  async (id: string) => {
    const response = await projectService.getById(id)
    return response.data
  }
)

export const createProject = createAsyncThunk(
  'projects/create',
  async (data: CreateProjectDto) => {
    const response = await projectService.create(data)
    return response.data
  }
)

export const deleteProject = createAsyncThunk(
  'projects/delete',
  async (id: string) => {
    await projectService.delete(id)
    return id
  }
)

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearSelectedProject: (state) => {
      state.selectedProject = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProjects.fulfilled, (state, action: PayloadAction<Project[]>) => {
        state.loading = false
        state.projects = action.payload
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch projects'
      })
      // Fetch project by ID
      .addCase(fetchProjectById.fulfilled, (state, action: PayloadAction<Project>) => {
        state.selectedProject = action.payload
      })
      // Create project
      .addCase(createProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.projects.push(action.payload)
      })
      // Delete project
      .addCase(deleteProject.fulfilled, (state, action: PayloadAction<string>) => {
        state.projects = state.projects.filter(p => p.id !== action.payload)
      })
  },
})

export const { clearSelectedProject } = projectsSlice.actions
export default projectsSlice.reducer
