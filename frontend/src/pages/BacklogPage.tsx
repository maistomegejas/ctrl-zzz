import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchWorkItems } from '../features/workItemsSlice'
import { fetchProjects } from '../features/projectsSlice'
import { fetchUsers } from '../features/usersSlice'
import { WorkItemType, Priority, WorkItemStatus } from '../types'

export default function BacklogPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { workItems, loading } = useAppSelector((state) => state.workItems)
  const { projects } = useAppSelector((state) => state.projects)
  const { users } = useAppSelector((state) => state.users)

  const [selectedProject, setSelectedProject] = useState<string>('all')

  useEffect(() => {
    dispatch(fetchProjects())
    if (users.length === 0) {
      dispatch(fetchUsers())
    }
  }, [dispatch, users])

  useEffect(() => {
    if (selectedProject && selectedProject !== 'all') {
      dispatch(fetchWorkItems(selectedProject))
    } else if (projects.length > 0) {
      // Fetch all work items for all projects
      projects.forEach((project) => {
        dispatch(fetchWorkItems(project.id))
      })
    }
  }, [selectedProject, projects, dispatch])

  // Filter backlog items (no sprint assigned)
  const backlogItems = workItems.filter((item) => {
    const matchesProject = selectedProject === 'all' || item.projectId === selectedProject
    const noSprint = !item.sprintId
    return matchesProject && noSprint
  })

  const getTypeLabel = (type: WorkItemType) => ['Epic', 'Story', 'Task', 'Bug', 'Subtask'][type]
  const getPriorityLabel = (priority: Priority) => ['Low', 'Medium', 'High', 'Critical', 'Blocker'][priority]
  const getStatusLabel = (status: WorkItemStatus) => ['To Do', 'In Progress', 'In Review', 'Done', 'Blocked'][status]

  const getTypeBadgeClass = (type: WorkItemType) => {
    const classes = ['badge-secondary', 'badge-accent', 'badge-primary', 'badge-error', 'badge-ghost']
    return classes[type]
  }

  const getPriorityBadgeClass = (priority: Priority) => {
    const classes = ['badge-ghost', 'badge-info', 'badge-warning', 'badge-error', 'badge-error']
    return classes[priority]
  }

  const getStatusBadgeClass = (status: WorkItemStatus) => {
    const classes = ['badge-neutral', 'badge-info', 'badge-warning', 'badge-success', 'badge-error']
    return classes[status]
  }

  const getProjectName = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId)
    return project?.name || 'Unknown'
  }

  const getUserName = (userId?: string) => {
    if (!userId) return 'Unassigned'
    const user = users.find((u) => u.id === userId)
    return user?.name || 'Unknown User'
  }

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Backlog</h1>
          <p className="text-gray-500 mt-1">Issues not assigned to any sprint</p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-4">
            <label className="label">
              <span className="label-text font-semibold">Project</span>
            </label>
            <select
              className="select select-bordered"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              <option value="all">All Projects</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>

            <div className="ml-auto">
              <div className="badge badge-lg badge-neutral">{backlogItems.length} issues</div>
            </div>
          </div>
        </div>

        {/* Backlog Items */}
        {loading && (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}

        {!loading && backlogItems.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">No backlog issues found</p>
            <p className="text-gray-400 text-sm mt-2">All issues are assigned to sprints</p>
          </div>
        )}

        <div className="space-y-4">
          {backlogItems.map((issue) => (
            <div
              key={issue.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/issues/${issue.id}`)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <div className={`badge ${getTypeBadgeClass(issue.type)}`}>{getTypeLabel(issue.type)}</div>
                      <div className={`badge ${getPriorityBadgeClass(issue.priority)}`}>
                        {getPriorityLabel(issue.priority)}
                      </div>
                      <div className={`badge ${getStatusBadgeClass(issue.status)}`}>{getStatusLabel(issue.status)}</div>
                      {selectedProject === 'all' && (
                        <div className="badge badge-outline">{getProjectName(issue.projectId)}</div>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{issue.title}</h3>

                    {issue.description && (
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">{issue.description}</p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>👤 {getUserName(issue.assigneeId)}</span>
                      <span>•</span>
                      <span>Created {new Date(issue.createdAt).toLocaleDateString()}</span>
                      {issue.storyPoints && (
                        <>
                          <span>•</span>
                          <span className="badge badge-sm badge-outline">{issue.storyPoints} SP</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
