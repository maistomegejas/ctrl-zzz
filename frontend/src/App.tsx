import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
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
                <div className="flex-1 overflow-y-auto overflow-x-hidden relative z-0">
                  <Routes>
                    <Route path="/" element={<Navigate to="/projects" replace />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/projects/:id" element={<ProjectDetailPage />} />
                    <Route path="/projects/:id/settings" element={<ProjectSettingsPage />} />
                    <Route path="/projects/:id/board" element={<BoardPage />} />
                    <Route path="/projects/:id/planning" element={<SprintPlanningPage />} />
                    <Route path="/projects/:projectId/sprints" element={<SprintsPage />} />
                    <Route path="/issues/:id" element={<IssueDetailPage />} />
                    <Route path="/my-issues" element={<MyIssuesPage />} />
                    <Route path="/backlog" element={<BacklogPage />} />
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
