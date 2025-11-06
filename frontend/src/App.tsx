import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import SprintsPage from './pages/SprintsPage'
import BoardPage from './pages/BoardPage'
import IssueDetailPage from './pages/IssueDetailPage'
import MyIssuesPage from './pages/MyIssuesPage'
import Sidebar from './components/Sidebar'

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/projects" replace />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/projects/:id/board" element={<BoardPage />} />
            <Route path="/projects/:projectId/sprints" element={<SprintsPage />} />
            <Route path="/issues/:id" element={<IssueDetailPage />} />
            <Route path="/my-issues" element={<MyIssuesPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
