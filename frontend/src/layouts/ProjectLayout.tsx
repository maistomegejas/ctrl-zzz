import { Outlet, useParams, useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchProjectById } from '../features/projectsSlice'

export default function ProjectLayout() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { selectedProject } = useAppSelector((state) => state.projects)

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(id))
    }
  }, [id, dispatch])

  const isActive = (path: string) => {
    return location.pathname === `/projects/${id}${path}` ||
           (path === '' && location.pathname === `/projects/${id}`)
  }

  const navItems = [
    { path: '', label: 'Dashboard', icon: '📊' },
    { path: '/issues', label: 'Issues', icon: '📝' },
    { path: '/board', label: 'Board', icon: '🎯' },
    { path: '/backlog', label: 'Backlog', icon: '📚' },
    { path: '/sprints', label: 'Sprints', icon: '⚡' },
    { path: '/team', label: 'Team', icon: '👥' },
    { path: '/docs', label: 'Docs', icon: '📖' },
    { path: '/reports', label: 'Reports', icon: '📈' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ]

  if (!selectedProject) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Project Header */}
      <div className="border-b border-gray-200 bg-white px-8 py-4">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/projects')}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Projects
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">{selectedProject.key}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{selectedProject.name}</h1>
              {selectedProject.description && (
                <p className="text-sm text-gray-500">{selectedProject.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1 overflow-x-auto">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(`/projects/${id}${item.path}`)}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors whitespace-nowrap ${
                isActive(item.path)
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Page Content */}
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  )
}
