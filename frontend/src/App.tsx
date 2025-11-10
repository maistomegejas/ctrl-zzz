import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import ProjectDashboard from './pages/ProjectDashboard'
import ProjectSettingsPage from './pages/ProjectSettingsPage'
import SprintsPage from './pages/SprintsPage'
import BoardPage from './pages/BoardPage'
import IssueDetailPage from './pages/IssueDetailPage'
import MyIssuesPage from './pages/MyIssuesPage'
import BacklogPage from './pages/BacklogPage'
import SprintPlanningPage from './pages/SprintPlanningPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminPanel from './pages/AdminPanel'
import Sidebar from './components/Sidebar'
import ProjectLayout from './layouts/ProjectLayout'
import { useAppSelector, useAppDispatch } from './store/hooks'
import { fetchCurrentUser } from './features/authSlice'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAppSelector((state) => state.auth)
  return token ? <>{children}</> : <Navigate to="/login" replace />
}

function App() {
  const { token } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser())
    }
  }, [token, dispatch])

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={token ? <Navigate to="/projects" replace /> : <LoginPage />} />
        <Route path="/register" element={token ? <Navigate to="/projects" replace /> : <RegisterPage />} />

        {/* Protected routes */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <div className="flex h-screen bg-gray-50 overflow-hidden">
                <Sidebar />
                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                  <Routes>
                    <Route path="/" element={<Navigate to="/projects" replace />} />
                    <Route path="/projects" element={<ProjectsPage />} />

                    {/* Project Routes with Layout */}
                    <Route path="/projects/:id" element={<ProjectLayout />}>
                      <Route index element={<ProjectDashboard />} />
                      <Route path="issues" element={<ProjectDetailPage />} />
                      <Route path="board" element={<BoardPage />} />
                      <Route path="backlog" element={<BacklogPage />} />
                      <Route path="sprints" element={<SprintsPage />} />
                      <Route path="planning" element={<SprintPlanningPage />} />
                      <Route path="team" element={<div className="p-8">Team view coming soon...</div>} />
                      <Route path="docs" element={<div className="p-8">Documentation coming soon...</div>} />
                      <Route path="reports" element={<div className="p-8">Reports coming soon...</div>} />
                      <Route path="settings" element={<ProjectSettingsPage />} />
                    </Route>

                    {/* Other Routes */}
                    <Route path="/issues/:id" element={<IssueDetailPage />} />
                    <Route path="/my-issues" element={<MyIssuesPage />} />
                    <Route path="/admin" element={<AdminPanel />} />
                  </Routes>
                </div>
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
