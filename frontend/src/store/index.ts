import { configureStore } from '@reduxjs/toolkit'
import projectsReducer from '../features/projectsSlice'
import workItemsReducer from '../features/workItemsSlice'

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    workItems: workItemsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
