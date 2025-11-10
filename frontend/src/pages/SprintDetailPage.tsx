import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchProjectById } from '../features/projectsSlice'
import { fetchWorkItems } from '../features/workItemsSlice'
import { fetchSprints, startSprint, completeSprint } from '../features/sprintsSlice'
import { fetchUsers } from '../features/usersSlice'
import { WorkItemType, Priority, WorkItemStatus } from '../types'

export default function SprintDetailPage() {
  const { id, sprintId } = useParams<{ id: string; sprintId: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { selectedProject } = useAppSelector((state) => state.projects)
  const { workItems } = useAppSelector((state) => state.workItems)
  const { sprints } = useAppSelector((state) => state.sprints)
  const { users } = useAppSelector((state) => state.users)
  const { permissions } = useAppSelector((state) => state.auth)

  const hasPermission = (permission: string) => {
    return permissions.includes(permission)
  }

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(id))
      dispatch(fetchWorkItems(id))
      dispatch(fetchSprints(id))
    }
    if (users.length === 0) {
      dispatch(fetchUsers())
    }
  }, [id, dispatch, users.length])

  const sprint = sprints.find(s => s.id === sprintId)
  const sprintIssues = workItems.filter(item => item.sprintId === sprintId)

  const getTypeLabel = (type: WorkItemType) => ['Epic', 'Story', 'Task', 'Bug', 'Subtask'][type]
  const getPriorityLabel = (priority: Priority) => ['Low', 'Medium', 'High', 'Critical', 'Blocker'][priority]
  const getStatusLabel = (status: WorkItemStatus) => ['To Do', 'In Progress', 'In Review', 'Done', 'Blocked'][status]

  const getUserName = (userId?: string) => {
    if (!userId) return 'Unassigned'
    const user = users.find((u) => u.id === userId)
    return user?.name || 'Unknown User'
  }

  const formatDate = (date?: string) => {
    if (!date) return 'Not set'
    return new Date(date).toLocaleDateString()
  }

  if (!sprint) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sprint not found</h2>
          <button
            onClick={() => navigate(`/projects/${id}/sprints`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
          >
            Back to Sprints
          </button>
        </div>
      </div>
    )
  }

  // Calculate metrics
  const totalIssues = sprintIssues.length
  const doneIssues = sprintIssues.filter(item => item.status === WorkItemStatus.Done).length
  const inProgressIssues = sprintIssues.filter(item => item.status === WorkItemStatus.InProgress).length
  const todoIssues = sprintIssues.filter(item => item.status === WorkItemStatus.ToDo).length
  const blockedIssues = sprintIssues.filter(item => item.status === WorkItemStatus.Blocked).length
  const totalStoryPoints = sprintIssues.reduce((sum, item) => sum + (item.storyPoints || 0), 0)
  const completedStoryPoints = sprintIssues
    .filter(item => item.status === WorkItemStatus.Done)
    .reduce((sum, item) => sum + (item.storyPoints || 0), 0)
  const completionPercentage = totalIssues > 0 ? Math.round((doneIssues / totalIssues) * 100) : 0

  const handleStartSprint = async () => {
    if (confirm(`Start sprint "${sprint.name}"?`)) {
      await dispatch(startSprint(sprint.id))
    }
  }

  const handleCompleteSprint = async () => {
    if (confirm(`Complete sprint "${sprint.name}"? This will mark the sprint as complete.`)) {
      await dispatch(completeSprint(sprint.id))
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => navigate(`/projects/${id}/sprints`)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 font-medium transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{sprint.name}</h1>
          {sprint.isActive && (
            <div className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
              Active
            </div>
          )}
          {sprint.isCompleted && (
            <div className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
              Completed
            </div>
          )}
          {!sprint.isActive && !sprint.isCompleted && (
            <div className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              Planned
            </div>
          )}
        </div>
        {sprint.goal && (
          <p className="text-gray-600 mb-3">{sprint.goal}</p>
        )}
        <div className="flex gap-6 text-sm text-gray-600">
          <div>
            <span className="font-medium">Start:</span> {formatDate(sprint.startDate)}
          </div>
          <div>
            <span className="font-medium">End:</span> {formatDate(sprint.endDate)}
          </div>
          <div>
            <span className="font-medium">Duration:</span>{' '}
            {sprint.startDate && sprint.endDate
              ? Math.ceil(
                  (new Date(sprint.endDate).getTime() - new Date(sprint.startDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                )
              : 0}{' '}
            days
          </div>
        </div>

        {/* Actions */}
        {hasPermission('Sprints.Edit') && (
          <div className="flex gap-3 mt-4">
            {!sprint.isActive && !sprint.isCompleted && (
              <button
                onClick={handleStartSprint}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium transition-colors"
              >
                Start Sprint
              </button>
            )}
            {sprint.isActive && !sprint.isCompleted && (
              <button
                onClick={handleCompleteSprint}
                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 font-medium transition-colors"
              >
                Complete Sprint
              </button>
            )}
          </div>
        )}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-3xl font-bold text-gray-900 mb-1">{totalIssues}</div>
          <div className="text-sm text-gray-600">Total Issues</div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-3xl font-bold text-green-600 mb-1">{doneIssues}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-3xl font-bold text-blue-600 mb-1">{inProgressIssues}</div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-3xl font-bold text-purple-600 mb-1">
            {completedStoryPoints}/{totalStoryPoints}
          </div>
          <div className="text-sm text-gray-600">Story Points</div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-3xl font-bold text-gray-900 mb-1">{completionPercentage}%</div>
          <div className="text-sm text-gray-600">Complete</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Sprint Progress</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">
              {doneIssues} of {totalIssues} issues completed
            </span>
            <span className="font-medium">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-green-500 h-4 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Status breakdown */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{todoIssues}</div>
            <div className="text-xs text-gray-500">To Do</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{inProgressIssues}</div>
            <div className="text-xs text-gray-500">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{doneIssues}</div>
            <div className="text-xs text-gray-500">Done</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{blockedIssues}</div>
            <div className="text-xs text-gray-500">Blocked</div>
          </div>
        </div>
      </div>

      {/* Sprint Issues */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Sprint Issues ({totalIssues})</h2>

        {sprintIssues.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No issues in this sprint yet</p>
            <button
              onClick={() => navigate(`/projects/${id}/planning`)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
            >
              Go to Sprint Planning
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {sprintIssues.map((issue) => (
              <div
                key={issue.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/issues/${issue.id}`)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                        {getTypeLabel(issue.type)}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded ${
                          issue.priority === Priority.Blocker || issue.priority === Priority.Critical
                            ? 'bg-red-100 text-red-700'
                            : issue.priority === Priority.High
                            ? 'bg-orange-100 text-orange-700'
                            : issue.priority === Priority.Medium
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {getPriorityLabel(issue.priority)}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded ${
                          issue.status === WorkItemStatus.Done
                            ? 'bg-green-100 text-green-700'
                            : issue.status === WorkItemStatus.InProgress
                            ? 'bg-blue-100 text-blue-700'
                            : issue.status === WorkItemStatus.Blocked
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {getStatusLabel(issue.status)}
                      </span>
                      {issue.storyPoints && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                          {issue.storyPoints} SP
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-semibold text-gray-900 mb-1">{issue.title}</h3>

                    {issue.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">{issue.description}</p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>👤 {getUserName(issue.assigneeId)}</span>
                      <span>•</span>
                      <span>Created {new Date(issue.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
