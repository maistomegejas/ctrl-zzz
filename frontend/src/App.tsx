import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetailPage from './pages/ProjectDetailPage'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-base-200">
        <div className="navbar bg-base-100 shadow-lg">
          <div className="flex-1">
            <Link to="/projects" className="btn btn-ghost text-xl">
              CTRL-ZZZ
            </Link>
          </div>
          <div className="flex-none">
            <ul className="menu menu-horizontal px-1">
              <li><Link to="/projects">Projects</Link></li>
              <li>
                <a href="http://localhost:5000/swagger" target="_blank" rel="noopener noreferrer">
                  API Docs
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="min-h-[calc(100vh-4rem)]">
          <Routes>
            <Route path="/" element={<Navigate to="/projects" replace />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
