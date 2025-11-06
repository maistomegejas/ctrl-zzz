import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchWorkItems } from '../features/workItemsSlice'
import { WorkItemType, Priority, WorkItemStatus } from '../types'

type StatusFilter = 'all' | 'open' | 'closed'
type SortOption = 'priority' | 'created' | 'updated'

export default function MyIssuesPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { workItems, loading } = useAppSelector((state) => state.workItems)
  const { projects } = useAppSelector((state) => state.projects)
  const { user } = useAppSelector((state) => state.auth)

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [sortBy, setSortBy] = useState<SortOption>('priority')

  useEffect(() => {
    // Fetch all work items for all projects
    projects.forEach((project) => {
      dispatch(fetchWorkItems(project.id))
    })
  }, [projects, dispatch])

  const filteredAndSortedIssues = useMemo(() => {
    // Filter by logged-in user
    let filtered = workItems.filter(item => item.assigneeId === user?.id)

    // Apply status filter
    if (statusFilter === 'open') {
      filtered = filtered.filter(
        (item) =>
          item.status === WorkItemStatus.ToDo ||
          item.status === WorkItemStatus.InProgress ||
          item.status === WorkItemStatus.InReview ||
          item.status === WorkItemStatus.Blocked
      )
    } else if (statusFilter === 'closed') {
      filtered = filtered.filter((item) => item.status === WorkItemStatus.Done)
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'priority') {
        // Higher priority first (Blocker=4, Critical=3, High=2, Medium=1, Low=0)
        return b.priority - a.priority
      } else if (sortBy === 'created') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else if (sortBy === 'updated') {
        if (!a.updatedAt) return 1
        if (!b.updatedAt) return -1
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      }
      return 0
    })

    return sorted
  }, [workItems, statusFilter, sortBy, user?.id])

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

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">My Issues</h1>
          <p className="text-gray-500 mt-1">Track and manage your assigned issues</p>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Status</span>
              </label>
              <select
                className="select select-bordered"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              >
                <option value="all">All Issues</option>
                <option value="open">Open Issues</option>
                <option value="closed">Closed Issues</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Sort By</span>
              </label>
              <select
                className="select select-bordered"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
              >
                <option value="priority">Priority</option>
                <option value="created">Created Date</option>
                <option value="updated">Updated Date</option>
              </select>
            </div>

            <div className="ml-auto">
              <div className="label">
                <span className="label-text font-semibold">Total</span>
              </div>
              <div className="badge badge-lg badge-neutral">{filteredAndSortedIssues.length} issues</div>
            </div>
          </div>
        </div>

        {/* Issues List */}
        {loading && (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}

        {!loading && filteredAndSortedIssues.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">No issues found</p>
          </div>
        )}

        <div className="space-y-4">
          {filteredAndSortedIssues.map((issue) => (
            <div
              key={issue.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/issues/${issue.id}`)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`badge ${getTypeBadgeClass(issue.type)}`}>{getTypeLabel(issue.type)}</div>
                      <div className={`badge ${getPriorityBadgeClass(issue.priority)}`}>
                        {getPriorityLabel(issue.priority)}
                      </div>
                      <div className={`badge ${getStatusBadgeClass(issue.status)}`}>{getStatusLabel(issue.status)}</div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{issue.title}</h3>

                    {issue.description && (
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">{issue.description}</p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="font-medium">{getProjectName(issue.projectId)}</span>
                      <span>•</span>
                      <span>Created {new Date(issue.createdAt).toLocaleDateString()}</span>
                      {issue.updatedAt && (
                        <>
                          <span>•</span>
                          <span>Updated {new Date(issue.updatedAt).toLocaleDateString()}</span>
                        </>
                      )}
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
