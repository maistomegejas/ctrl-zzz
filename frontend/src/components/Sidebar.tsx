import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { logout } from '../features/authSlice'

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user, permissions } = useAppSelector((state) => state.auth)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const hasPermission = (permission: string) => {
    return permissions.includes(permission)
  }

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 h-full flex flex-col transition-all duration-300 relative overflow-y-auto overflow-x-hidden z-50`}>
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 z-[100] bg-white border border-gray-200 rounded-full p-1 hover:bg-gray-100 transition-colors"
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
          <Link to="/projects" className="inline-block">
            <svg className="w-10 h-10 flex-shrink-0" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="20" fill="#2563EB"/>
              <path d="M20 8 L12 16 L16 16 L10 22 L14 22 L8 30 L32 30 L26 22 L30 22 L24 16 L28 16 Z" fill="#10b981"/>
              <rect x="18" y="28" width="4" height="6" fill="#92400e"/>
            </svg>
          </Link>
        ) : (
          <Link to="/projects" className="text-2xl font-bold text-blue-600 block">
            CTRL-ZZZ
          </Link>
        )}
      </div>

      <nav className="px-3 flex-1 overflow-y-auto">
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

        <Link
          to="/my-issues"
          className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-lg mb-1 transition-colors ${
            isActive('/my-issues')
              ? 'bg-blue-50 text-blue-600 font-medium'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          title="My Issues"
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
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
          {!isCollapsed && <span>My Issues</span>}
        </Link>

        <Link
          to="/backlog"
          className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-lg mb-1 transition-colors ${
            isActive('/backlog')
              ? 'bg-blue-50 text-blue-600 font-medium'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          title="Backlog"
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
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
          {!isCollapsed && <span>Backlog</span>}
        </Link>

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

        {!isCollapsed && (
          <div className="mt-6 px-3">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Resources
            </div>
            <a
              href="http://localhost:5000/swagger"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2 rounded-lg mb-1 text-gray-700 hover:bg-gray-100 transition-colors"
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
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
              <span>API Docs</span>
            </a>
          </div>
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
