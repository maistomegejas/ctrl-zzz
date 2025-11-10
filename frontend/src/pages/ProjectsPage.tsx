import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchProjects, createProject, deleteProject } from '../features/projectsSlice'
import { CreateProjectDto } from '../types'
import ConfirmModal from '../components/ConfirmModal'

export default function ProjectsPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { projects, loading, error } = useAppSelector((state) => state.projects)
  const { permissions } = useAppSelector((state) => state.auth)

  const hasPermission = (permission: string) => {
    return permissions.includes(permission)
  }

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState<CreateProjectDto>({
    name: '',
    key: '',
    description: '',
  })
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; projectId: string | null }>({
    show: false,
    projectId: null,
  })

  useEffect(() => {
    dispatch(fetchProjects())
  }, [dispatch])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    await dispatch(createProject(formData))
    setShowCreateForm(false)
    setFormData({ name: '', key: '', description: '' })
  }

  const handleDeleteClick = (id: string) => {
    setDeleteConfirm({ show: true, projectId: id })
  }

  const handleDeleteConfirm = async () => {
    if (deleteConfirm.projectId) {
      await dispatch(deleteProject(deleteConfirm.projectId))
    }
    setDeleteConfirm({ show: false, projectId: null })
  }

  const handleDeleteCancel = () => {
    setDeleteConfirm({ show: false, projectId: null })
  }

  return (
    <div className="flex-1">
      <div className="border-b border-gray-200 bg-white px-8 py-5">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and organize your projects</p>
          </div>
          {hasPermission('Projects.Create') && (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
            >
              {showCreateForm ? 'Cancel' : 'Create project'}
            </button>
          )}
        </div>
      </div>

      {/* TEMPORARY: Logo Showcase - Remove Later */}
      <div className="bg-yellow-50 border-y border-yellow-200 p-8">
        <h2 className="text-xl font-bold mb-6 text-center">Pick a Logo (1-20)</h2>
        <div className="grid grid-cols-10 gap-6 max-w-7xl mx-auto">

          {/* Logo 1: Simple Circle CZ */}
          <div className="flex flex-col items-center gap-2">
            <svg className="w-12 h-12" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="20" fill="#2563EB"/>
              <text x="20" y="26" fontSize="16" fontWeight="bold" fill="white" textAnchor="middle">CZ</text>
            </svg>
            <span className="text-xs font-bold">1</span>
          </div>

          {/* Logo 2: Rounded Square */}
          <div className="flex flex-col items-center gap-2">
            <svg className="w-12 h-12" viewBox="0 0 40 40">
              <rect width="40" height="40" rx="8" fill="#2563EB"/>
              <text x="20" y="26" fontSize="16" fontWeight="bold" fill="white" textAnchor="middle">CZ</text>
            </svg>
            <span className="text-xs font-bold">2</span>
          </div>

          {/* Logo 3: Keyboard Key */}
          <div className="flex flex-col items-center gap-2">
            <svg className="w-12 h-12" viewBox="0 0 40 40">
              <rect x="2" y="4" width="36" height="32" rx="4" fill="#2563EB"/>
              <rect x="2" y="4" width="36" height="4" rx="2" fill="#1e40af"/>
              <text x="20" y="26" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">CZ</text>
            </svg>
            <span className="text-xs font-bold">3</span>
          </div>

          {/* Logo 4: Hexagon */}
          <div className="flex flex-col items-center gap-2">
            <svg className="w-12 h-12" viewBox="0 0 40 40">
              <path d="M20 2 L35 11 L35 29 L20 38 L5 29 L5 11 Z" fill="#2563EB"/>
              <text x="20" y="25" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">CZ</text>
            </svg>
            <span className="text-xs font-bold">4</span>
          </div>

          {/* Logo 5: ZZZ Sleep Theme */}
          <div className="flex flex-col items-center gap-2">
            <svg className="w-12 h-12" viewBox="0 0 40 40">
              <rect width="40" height="40" rx="8" fill="#2563EB"/>
              <text x="8" y="16" fontSize="12" fontWeight="bold" fill="white">Z</text>
              <text x="16" y="24" fontSize="14" fontWeight="bold" fill="white">Z</text>
              <text x="24" y="32" fontSize="16" fontWeight="bold" fill="white">Z</text>
            </svg>
            <span className="text-xs font-bold">5</span>
          </div>

          {/* Logo 6: Ctrl Key Style */}
          <div className="flex flex-col items-center gap-2">
            <svg className="w-12 h-12" viewBox="0 0 40 40">
              <rect width="40" height="40" rx="6" fill="#1e293b" stroke="#64748b" strokeWidth="2"/>
              <text x="20" y="18" fontSize="10" fontWeight="bold" fill="#94a3b8" textAnchor="middle">CTRL</text>
              <text x="20" y="30" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">Z</text>
            </svg>
            <span className="text-xs font-bold">6</span>
          </div>

          {/* Logo 7: Minimal C+Z */}
          <div className="flex flex-col items-center gap-2">
            <svg className="w-12 h-12" viewBox="0 0 40 40">
              <rect width="40" height="40" rx="8" fill="#2563EB"/>
              <text x="12" y="26" fontSize="18" fontWeight="bold" fill="white">C</text>
              <text x="25" y="26" fontSize="18" fontWeight="bold" fill="white">Z</text>
              <line x1="20" y1="12" x2="20" y2="32" stroke="white" strokeWidth="2"/>
            </svg>
            <span className="text-xs font-bold">7</span>
          </div>

          {/* Logo 8: Diamond */}
          <div className="flex flex-col items-center gap-2">
            <svg className="w-12 h-12" viewBox="0 0 40 40">
              <rect x="20" y="20" width="24" height="24" transform="rotate(45 20 20)" fill="#2563EB"/>
              <text x="20" y="25" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">CZ</text>
            </svg>
            <span className="text-xs font-bold">8</span>
          </div>

          {/* Logo 9: Stacked Letters */}
          <div className="flex flex-col items-center gap-2">
            <svg className="w-12 h-12" viewBox="0 0 40 40">
              <rect width="40" height="40" rx="8" fill="#2563EB"/>
              <text x="20" y="18" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">C</text>
              <rect x="8" y="20" width="24" height="2" fill="white"/>
              <text x="20" y="32" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">Z</text>
            </svg>
            <span className="text-xs font-bold">9</span>
          </div>

          {/* Logo 10: Badge Style */}
          <div className="flex flex-col items-center gap-2">
            <svg className="w-12 h-12" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="18" fill="#2563EB" stroke="#1e40af" strokeWidth="3"/>
              <text x="20" y="26" fontSize="16" fontWeight="bold" fill="white" textAnchor="middle">CZ</text>
            </svg>
            <span className="text-xs font-bold">10</span>
          </div>

          {/* Logo 11: Corner Brackets */}
          <div className="flex flex-col items-center gap-2">
            <svg className="w-12 h-12" viewBox="0 0 40 40">
              <rect width="40" height="40" rx="8" fill="#2563EB"/>
              <path d="M8 8 L12 8 L12 10 L10 10 L10 12 L8 12 Z M28 8 L32 8 L32 12 L30 12 L30 10 L28 10 Z M8 28 L10 28 L10 30 L12 30 L12 32 L8 32 Z M30 30 L30 32 L28 32 L28 30 L30 30 L32 30 L32 28 L30 28 Z" fill="white"/>
              <text x="20" y="26" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">CZ</text>
            </svg>
            <span className="text-xs font-bold">11</span>
          </div>

          {/* Logo 12: Abstract Geometric */}
          <div className="flex flex-col items-center gap-2">
            <svg className="w-12 h-12" viewBox="0 0 40 40">
              <rect width="40" height="40" rx="8" fill="#2563EB"/>
              <path d="M10 10 L30 10 L20 20 Z" fill="#1e40af"/>
              <path d="M10 30 L30 30 L20 20 Z" fill="white"/>
              <text x="20" y="23" fontSize="10" fontWeight="bold" fill="#2563EB" textAnchor="middle">CZ</text>
            </svg>
            <span className="text-xs font-bold">12</span>
          </div>

          {/* Logo 13: Gradient Circle */}
          <div className="flex flex-col items-center gap-2">
            <svg className="w-12 h-12" viewBox="0 0 40 40">
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#3b82f6', stopOpacity: 1}} />
                  <stop offset="100%" style={{stopColor: '#1e40af', stopOpacity: 1}} />
                </linearGradient>
              </defs>
              <circle cx="20" cy="20" r="20" fill="url(#grad1)"/>
              <text x="20" y="26" fontSize="16" fontWeight="bold" fill="white" textAnchor="middle">CZ</text>
            </svg>
            <span className="text-xs font-bold">13</span>
          </div>

          {/* Logo 14: Minimal Lines */}
          <div className="flex flex-col items-center gap-2">
            <svg className="w-12 h-12" viewBox="0 0 40 40">
              <rect width="40" height="40" rx="8" fill="#2563EB"/>
              <path d="M12 12 L22 12 M12 12 L12 22 M22 12 L12 22" stroke="white" strokeWidth="2" fill="none"/>
              <path d="M28 18 L28 28 M18 28 L28 28 M18 18 L28 28" stroke="white" strokeWidth="2" fill="none"/>
            </svg>
            <span className="text-xs font-bold">14</span>
          </div>

          {/* Logo 15: Monogram Overlap */}
          <div className="flex flex-col items-center gap-2">
            <svg className="w-12 h-12" viewBox="0 0 40 40">
              <rect width="40" height="40" rx="8" fill="#2563EB"/>
              <text x="14" y="26" fontSize="22" fontWeight="bold" fill="white" opacity="0.7">C</text>
              <text x="22" y="26" fontSize="22" fontWeight="bold" fill="white">Z</text>
            </svg>
            <span className="text-xs font-bold">15</span>
          </div>

          {/* Logo 16: Square in Square */}
          <div className="flex flex-col items-center gap-2">
            <svg className="w-12 h-12" viewBox="0 0 40 40">
              <rect width="40" height="40" rx="8" fill="#2563EB"/>
              <rect x="10" y="10" width="20" height="20" rx="4" fill="none" stroke="white" strokeWidth="2"/>
              <text x="20" y="26" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">CZ</text>
            </svg>
            <span className="text-xs font-bold">16</span>
          </div>

          {/* Logo 17: Lightning Bolt */}
          <div className="flex flex-col items-center gap-2">
            <svg className="w-12 h-12" viewBox="0 0 40 40">
              <rect width="40" height="40" rx="8" fill="#2563EB"/>
              <path d="M22 8 L16 22 L20 22 L18 32 L26 18 L22 18 Z" fill="#fbbf24"/>
              <text x="20" y="38" fontSize="8" fontWeight="bold" fill="white" textAnchor="middle">CZ</text>
            </svg>
            <span className="text-xs font-bold">17</span>
          </div>

          {/* Logo 18: Simple Square Frame */}
          <div className="flex flex-col items-center gap-2">
            <svg className="w-12 h-12" viewBox="0 0 40 40">
              <rect width="40" height="40" fill="white" stroke="#2563EB" strokeWidth="3"/>
              <text x="20" y="26" fontSize="16" fontWeight="bold" fill="#2563EB" textAnchor="middle">CZ</text>
            </svg>
            <span className="text-xs font-bold">18</span>
          </div>

          {/* Logo 19: Pill Shape */}
          <div className="flex flex-col items-center gap-2">
            <svg className="w-12 h-12" viewBox="0 0 40 40">
              <rect x="5" y="10" width="30" height="20" rx="10" fill="#2563EB"/>
              <text x="20" y="25" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">CZ</text>
            </svg>
            <span className="text-xs font-bold">19</span>
          </div>

          {/* Logo 20: Minimal Square Dot */}
          <div className="flex flex-col items-center gap-2">
            <svg className="w-12 h-12" viewBox="0 0 40 40">
              <rect width="40" height="40" rx="8" fill="#2563EB"/>
              <circle cx="32" cy="8" r="4" fill="#ef4444"/>
              <text x="20" y="28" fontSize="18" fontWeight="bold" fill="white" textAnchor="middle">CZ</text>
            </svg>
            <span className="text-xs font-bold">20</span>
          </div>

        </div>
      </div>

      <div className="p-8">
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Create new project</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project name *
                </label>
                <input
                  type="text"
                  placeholder="Enter project name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project key *
                </label>
                <input
                  type="text"
                  placeholder="e.g., PROJ"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value.toUpperCase() })}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Uppercase letters only</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Project description (optional)"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
                >
                  Create project
                </button>
              </div>
            </form>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="ml-3 text-sm text-red-800">{error}</span>
            </div>
          </div>
        )}

        {projects.length === 0 && !loading ? (
          <div className="text-center py-16">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">No projects</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">{project.key}</span>
                      </div>
                      <h3 className="text-base font-semibold text-gray-900">{project.name}</h3>
                    </div>
                  </div>

                  {project.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                    {hasPermission('Projects.Delete') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteClick(project.id)
                        }}
                        className="text-xs text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteConfirm.show}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  )
}
