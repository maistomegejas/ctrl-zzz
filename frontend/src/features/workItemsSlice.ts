import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { WorkItem, CreateWorkItemDto, UpdateWorkItemDto } from '../types'
import { workItemService } from '../services/workItemService'

interface WorkItemsState {
  workItems: WorkItem[]
  loading: boolean
  error: string | null
}

const initialState: WorkItemsState = {
  workItems: [],
  loading: false,
  error: null,
}

export const fetchWorkItems = createAsyncThunk(
  'workItems/fetchAll',
  async (projectId?: string) => {
    const response = await workItemService.getAll(projectId ? { projectId } : undefined)
    return response.data
  }
)

export const createWorkItem = createAsyncThunk(
  'workItems/create',
  async (data: CreateWorkItemDto) => {
    const response = await workItemService.create(data)
    return response.data
  }
)

export const updateWorkItem = createAsyncThunk(
  'workItems/update',
  async ({ id, data }: { id: string; data: UpdateWorkItemDto }) => {
    const response = await workItemService.update(id, data)
    return response.data
  }
)

export const deleteWorkItem = createAsyncThunk(
  'workItems/delete',
  async (id: string) => {
    await workItemService.delete(id)
    return id
  }
)

const workItemsSlice = createSlice({
  name: 'workItems',
  initialState,
  reducers: {
    clearWorkItems: (state) => {
      state.workItems = []
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch work items
      .addCase(fetchWorkItems.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWorkItems.fulfilled, (state, action: PayloadAction<WorkItem[]>) => {
        state.loading = false
        state.workItems = action.payload
      })
      .addCase(fetchWorkItems.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch work items'
      })
      // Create work item
      .addCase(createWorkItem.fulfilled, (state, action: PayloadAction<WorkItem>) => {
        state.workItems.push(action.payload)
      })
      // Update work item
      .addCase(updateWorkItem.fulfilled, (state, action: PayloadAction<WorkItem>) => {
        const index = state.workItems.findIndex(w => w.id === action.payload.id)
        if (index !== -1) {
          state.workItems[index] = action.payload
        }
      })
      // Delete work item
      .addCase(deleteWorkItem.fulfilled, (state, action: PayloadAction<string>) => {
        state.workItems = state.workItems.filter(w => w.id !== action.payload)
      })
  },
})

export const { clearWorkItems } = workItemsSlice.actions
export default workItemsSlice.reducer
