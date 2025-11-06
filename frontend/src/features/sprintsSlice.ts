import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Sprint, CreateSprintDto } from '../types'
import { sprintService } from '../services/sprintService'

interface SprintsState {
  sprints: Sprint[]
  selectedSprint: Sprint | null
  loading: boolean
  error: string | null
}

const initialState: SprintsState = {
  sprints: [],
  selectedSprint: null,
  loading: false,
  error: null,
}

export const fetchSprints = createAsyncThunk(
  'sprints/fetchAll',
  async (projectId: string) => {
    const response = await sprintService.getAll(projectId)
    return response.data
  }
)

export const fetchSprintById = createAsyncThunk(
  'sprints/fetchById',
  async (id: string) => {
    const response = await sprintService.getById(id)
    return response.data
  }
)

export const createSprint = createAsyncThunk(
  'sprints/create',
  async (data: CreateSprintDto) => {
    const response = await sprintService.create(data)
    return response.data
  }
)

export const deleteSprint = createAsyncThunk(
  'sprints/delete',
  async (id: string) => {
    await sprintService.delete(id)
    return id
  }
)

export const startSprint = createAsyncThunk(
  'sprints/start',
  async (id: string) => {
    const response = await sprintService.start(id)
    return response.data
  }
)

export const completeSprint = createAsyncThunk(
  'sprints/complete',
  async (id: string) => {
    const response = await sprintService.complete(id)
    return response.data
  }
)

const sprintsSlice = createSlice({
  name: 'sprints',
  initialState,
  reducers: {
    clearSelectedSprint: (state) => {
      state.selectedSprint = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all sprints
      .addCase(fetchSprints.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSprints.fulfilled, (state, action: PayloadAction<Sprint[]>) => {
        state.loading = false
        state.sprints = action.payload
      })
      .addCase(fetchSprints.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch sprints'
      })

      // Fetch sprint by ID
      .addCase(fetchSprintById.fulfilled, (state, action: PayloadAction<Sprint>) => {
        state.selectedSprint = action.payload
      })

      // Create sprint
      .addCase(createSprint.fulfilled, (state, action: PayloadAction<Sprint>) => {
        state.sprints.push(action.payload)
      })

      // Delete sprint
      .addCase(deleteSprint.fulfilled, (state, action: PayloadAction<string>) => {
        state.sprints = state.sprints.filter((s) => s.id !== action.payload)
      })

      // Start sprint
      .addCase(startSprint.fulfilled, (state, action: PayloadAction<Sprint>) => {
        const index = state.sprints.findIndex((s) => s.id === action.payload.id)
        if (index !== -1) {
          state.sprints[index] = action.payload
        }
      })

      // Complete sprint
      .addCase(completeSprint.fulfilled, (state, action: PayloadAction<Sprint>) => {
        const index = state.sprints.findIndex((s) => s.id === action.payload.id)
        if (index !== -1) {
          state.sprints[index] = action.payload
        }
      })
  },
})

export const { clearSelectedSprint } = sprintsSlice.actions
export default sprintsSlice.reducer
