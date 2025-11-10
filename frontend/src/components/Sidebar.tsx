import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { logout } from '../features/authSlice'
import { fetchProjectById } from '../features/projectsSlice'

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user, permissions } = useAppSelector((state) => state.auth)
  const { selectedProject } = useAppSelector((state) => state.projects)
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Check if we're in a project context
  const projectMatch = location.pathname.match(/^\/projects\/([^/]+)/)
  const projectId = projectMatch ? projectMatch[1] : null
  const isInProject = !!projectId

  // Fetch project details if we're in a project context
  useEffect(() => {
    if (projectId && (!selectedProject || selectedProject.id !== projectId)) {
      dispatch(fetchProjectById(projectId))
    }
  }, [projectId, selectedProject, dispatch])

  const hasPermission = (permission: string) => {
    return permissions.includes(permission)
  }

  const isActive = (path: string) => {
    if (isInProject && projectId) {
      // For project pages, check exact match or subpath
      const basePath = `/projects/${projectId}`
      if (path === '') {
        // Dashboard is the index route
        return location.pathname === basePath
      }
      return location.pathname === `${basePath}${path}` || location.pathname.startsWith(`${basePath}${path}/`)
    }
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 h-full flex flex-col transition-all duration-300 relative overflow-y-auto z-50`}>
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="fixed left-[calc(var(--sidebar-width)-12px)] top-6 z-[9999] bg-white border border-gray-200 rounded-full p-1 hover:bg-gray-100 transition-all duration-300"
        style={{ '--sidebar-width': isCollapsed ? '64px' : '256px' } as React.CSSProperties}
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 text-gray-600 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="p-6 flex justify-center">
        {isCollapsed ? (
          <Link to="/" className="inline-block">
            <svg className="w-10 h-10 flex-shrink-0" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="20" fill="#2563EB"/>
              <path d="M20 8 L12 16 L16 16 L10 22 L14 22 L8 30 L32 30 L26 22 L30 22 L24 16 L28 16 Z" fill="#10b981"/>
              <rect x="18" y="28" width="4" height="6" fill="#92400e"/>
            </svg>
          </Link>
        ) : (
          <Link to="/" className="text-2xl font-bold text-blue-600 block">
            CTRL-ZZZ
          </Link>
        )}
      </div>

      <nav className="px-3 flex-1 overflow-y-auto">
        {/* NOT in a project - Global Navigation */}
        {!isInProject && (
          <>
            <Link
              to="/projects"
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-lg mb-1 transition-colors ${
                isActive('/projects')
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              title="Projects"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
              {!isCollapsed && <span>Projects</span>}
            </Link>
          </>
        )}

        {/* IN a project - Project-specific Navigation */}
        {isInProject && projectId && (
          <>
            {/* Back to Projects Button */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-3 px-3 py-2 rounded-lg mb-4 text-gray-700 hover:bg-gray-100 transition-colors w-full"
              title="Back to Projects"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              {!isCollapsed && <span>Back to Projects</span>}
            </button>

            {/* Project Info Header */}
            {!isCollapsed && selectedProject && (
              <div className="px-3 py-3 mb-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs">{selectedProject.key}</span>
                  </div>
                  <span className="font-semibold text-gray-900 text-sm truncate">{selectedProject.name}</span>
                </div>
              </div>
            )}

            {/* Project Navigation Items */}
            <Link
              to={`/projects/${projectId}`}
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-lg mb-1 transition-colors ${
                isActive('')
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              title="Dashboard"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {!isCollapsed && <span>Dashboard</span>}
            </Link>

            <Link
              to={`/projects/${projectId}/issues`}
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-lg mb-1 transition-colors ${
                isActive('/issues')
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              title="Issues"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              {!isCollapsed && <span>Issues</span>}
            </Link>

            <Link
              to={`/projects/${projectId}/board`}
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-lg mb-1 transition-colors ${
                isActive('/board')
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              title="Board"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
              {!isCollapsed && <span>Board</span>}
            </Link>

            <Link
              to={`/projects/${projectId}/backlog`}
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-lg mb-1 transition-colors ${
                isActive('/backlog')
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              title="Backlog"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              {!isCollapsed && <span>Backlog</span>}
            </Link>

            <Link
              to={`/projects/${projectId}/sprints`}
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-lg mb-1 transition-colors ${
                isActive('/sprints')
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              title="Sprints"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {!isCollapsed && <span>Sprints</span>}
            </Link>

            <Link
              to={`/projects/${projectId}/team`}
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-lg mb-1 transition-colors ${
                isActive('/team')
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              title="Team"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {!isCollapsed && <span>Team</span>}
            </Link>

            <Link
              to={`/projects/${projectId}/docs`}
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-lg mb-1 transition-colors ${
                isActive('/docs')
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              title="Documentation"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {!isCollapsed && <span>Docs</span>}
            </Link>

            <Link
              to={`/projects/${projectId}/reports`}
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-lg mb-1 transition-colors ${
                isActive('/reports')
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              title="Reports"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {!isCollapsed && <span>Reports</span>}
            </Link>

            <Link
              to={`/projects/${projectId}/settings`}
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-lg mb-1 transition-colors ${
                isActive('/settings')
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              title="Settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {!isCollapsed && <span>Settings</span>}
            </Link>
          </>
        )}

        {/* Admin Panel - Always shown at bottom with divider */}
        {hasPermission('Admin.AccessAdminPanel') && (
          <>
            {!isCollapsed && (
              <div className="mt-6 mb-2">
                <div className="h-px bg-gray-200"></div>
              </div>
            )}

            <Link
              to="/admin"
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-lg mb-1 transition-colors ${
                isActive('/admin')
                  ? 'bg-purple-50 text-purple-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              } ${isCollapsed ? 'mt-6' : ''}`}
              title="Admin Panel"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              {!isCollapsed && <span>Admin Panel</span>}
            </Link>
          </>
        )}
      </nav>

      {/* User Profile and Logout */}
      <div className="border-t border-gray-200 p-4">
        {!isCollapsed ? (
          <>
            <div className="flex items-center gap-3 mb-3">
              <div className="avatar placeholder">
                <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
                  <span className="text-lg">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-outline btn-sm w-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="avatar placeholder">
              <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
                <span className="text-lg">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-outline btn-sm btn-square"
              title="Logout"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
