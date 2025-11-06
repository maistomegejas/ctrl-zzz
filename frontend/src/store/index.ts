import { configureStore } from '@reduxjs/toolkit'
import projectsReducer from '../features/projectsSlice'
import workItemsReducer from '../features/workItemsSlice'
import sprintsReducer from '../features/sprintsSlice'
import usersReducer from '../features/usersSlice'

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    workItems: workItemsReducer,
    sprints: sprintsReducer,
    users: usersReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
