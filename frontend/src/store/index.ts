import { configureStore } from '@reduxjs/toolkit'
import projectsReducer from '../features/projectsSlice'
import workItemsReducer from '../features/workItemsSlice'
import sprintsReducer from '../features/sprintsSlice'
import usersReducer from '../features/usersSlice'
import authReducer from '../features/authSlice'

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    workItems: workItemsReducer,
    sprints: sprintsReducer,
    users: usersReducer,
    auth: authReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
