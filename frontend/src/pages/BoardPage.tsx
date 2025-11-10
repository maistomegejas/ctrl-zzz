import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchProjectById } from '../features/projectsSlice'
import { fetchWorkItems, updateWorkItem } from '../features/workItemsSlice'
import { fetchSprints } from '../features/sprintsSlice'
import { fetchUsers } from '../features/usersSlice'
import { WorkItemStatus, WorkItem, Priority, WorkItemType } from '../types'

type ViewMode = 'status' | 'assignee' | 'priority'

export default function BoardPage() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { selectedProject } = useAppSelector((state) => state.projects)
  const { workItems, loading } = useAppSelector((state) => state.workItems)
  const { sprints } = useAppSelector((state) => state.sprints)
  const { users } = useAppSelector((state) => state.users)

  const [draggedItem, setDraggedItem] = useState<WorkItem | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('status')
  const [filterSprint, setFilterSprint] = useState<string>('all')
  const [filterAssignee, setFilterAssignee] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(id))
      dispatch(fetchWorkItems(id))
      dispatch(fetchSprints(id))
    }
    if (users.length === 0) {
      dispatch(fetchUsers())
    }
  }, [id, dispatch, users])

  const statuses = [
    { value: WorkItemStatus.ToDo, label: 'To Do', color: 'bg-gray-100' },
    { value: WorkItemStatus.InProgress, label: 'In Progress', color: 'bg-blue-100' },
    { value: WorkItemStatus.InReview, label: 'In Review', color: 'bg-yellow-100' },
    { value: WorkItemStatus.Done, label: 'Done', color: 'bg-green-100' },
    { value: WorkItemStatus.Blocked, label: 'Blocked', color: 'bg-red-100' },
  ]

  const priorities = [
    { value: Priority.Blocker, label: 'Blocker', color: 'bg-red-100' },
    { value: Priority.Critical, label: 'Critical', color: 'bg-orange-100' },
    { value: Priority.High, label: 'High', color: 'bg-yellow-100' },
    { value: Priority.Medium, label: 'Medium', color: 'bg-blue-100' },
    { value: Priority.Low, label: 'Low', color: 'bg-gray-100' },
  ]

  // Apply filters
  const filteredItems = useMemo(() => {
    return workItems.filter((item) => {
      if (filterSprint !== 'all' && filterSprint !== 'none') {
        if (item.sprintId !== filterSprint) return false
      }
      if (filterSprint === 'none' && item.sprintId) return false

      if (filterAssignee !== 'all' && filterAssignee !== 'unassigned') {
        if (item.assigneeId !== filterAssignee) return false
      }
      if (filterAssignee === 'unassigned' && item.assigneeId) return false

      if (filterPriority !== 'all' && Number(filterPriority) !== item.priority) return false
      if (filterType !== 'all' && Number(filterType) !== item.type) return false

      return true
    })
  }, [workItems, filterSprint, filterAssignee, filterPriority, filterType])

  const getItemsByStatus = (status: WorkItemStatus) => {
    return filteredItems.filter(item => item.status === status)
  }

  const getItemsByAssignee = (assigneeId?: string) => {
    if (assigneeId === 'unassigned') {
      return filteredItems.filter(item => !item.assigneeId)
    }
    return filteredItems.filter(item => item.assigneeId === assigneeId)
  }

  const getItemsByPriority = (priority: Priority) => {
    return filteredItems.filter(item => item.priority === priority)
  }

  const getPriorityLabel = (priority: Priority) => {
    return ['Low', 'Medium', 'High', 'Critical', 'Blocker'][priority]
  }

  const getPriorityBadgeClass = (priority: Priority) => {
    const classes = ['badge-ghost', 'badge-info', 'badge-warning', 'badge-error', 'badge-error']
    return classes[priority]
  }

  const getTypeLabel = (type: WorkItemType) => {
    return ['Epic', 'Story', 'Task', 'Bug', 'Subtask'][type]
  }

  const getTypeBadgeClass = (type: WorkItemType) => {
    const classes = ['badge-secondary', 'badge-accent', 'badge-primary', 'badge-error', 'badge-ghost']
    return classes[type]
  }

  const getUserName = (userId?: string) => {
    if (!userId) return 'Unassigned'
    const user = users.find(u => u.id === userId)
    return user?.name || 'Unknown User'
  }

  const getStatusLabel = (status: WorkItemStatus) => {
    return ['To Do', 'In Progress', 'In Review', 'Done', 'Blocked'][status]
  }

  const handleDragStart = (item: WorkItem) => {
    setDraggedItem(item)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (newStatus: WorkItemStatus) => {
    if (!draggedItem || draggedItem.status === newStatus) {
      setDraggedItem(null)
      return
    }

    // Update issue status
    await dispatch(updateWorkItem({
      id: draggedItem.id,
      data: {
        title: draggedItem.title,
        description: draggedItem.description,
        status: newStatus,
        priority: draggedItem.priority,
        storyPoints: draggedItem.storyPoints,
        originalEstimateMinutes: draggedItem.originalEstimateMinutes,
        remainingEstimateMinutes: draggedItem.remainingEstimateMinutes,
        timeLoggedMinutes: draggedItem.timeLoggedMinutes,
        assigneeId: draggedItem.assigneeId,
        reporterId: draggedItem.reporterId,
        sprintId: draggedItem.sprintId,
      }
    }))

    setDraggedItem(null)
  }

  const renderCard = (item: WorkItem) => (
    <div
      key={item.id}
      draggable
      onDragStart={() => handleDragStart(item)}
      className="bg-white p-4 rounded-lg shadow hover:shadow-lg cursor-move transition-shadow"
      onClick={(e) => {
        e.stopPropagation()
        navigate(`/issues/${item.id}`)
      }}
    >
      <h3 className="font-medium text-sm mb-2">{item.title}</h3>
      {item.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{item.description}</p>
      )}
      <div className="flex gap-2 flex-wrap mb-2">
        <div className={`badge badge-sm ${getTypeBadgeClass(item.type)}`}>
          {getTypeLabel(item.type)}
        </div>
        <div className={`badge badge-sm ${getPriorityBadgeClass(item.priority)}`}>
          {getPriorityLabel(item.priority)}
        </div>
        {item.storyPoints !== null && item.storyPoints !== undefined && (
          <div className="badge badge-sm badge-outline">
            {item.storyPoints} SP
          </div>
        )}
      </div>
      <div className="text-xs text-gray-500 flex items-center gap-1">
        <span>👤</span>
        <span>{getUserName(item.assigneeId)}</span>
      </div>
    </div>
  )

  const assigneeList = useMemo(() => {
    const assignees = new Set<string>()
    filteredItems.forEach((item) => {
      if (item.assigneeId) {
        assignees.add(item.assigneeId)
      }
    })
    const hasUnassigned = filteredItems.some(item => !item.assigneeId)
    const result = Array.from(assignees).map(id => ({ id, name: getUserName(id) }))
    if (hasUnassigned) {
      result.unshift({ id: 'unassigned', name: 'Unassigned' })
    }
    return result
  }, [filteredItems, users])

  return (
    <div className="flex-1 h-screen overflow-hidden flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-8 py-5">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigate(`/projects/${id}`)} className="text-blue-600 hover:text-blue-800">
            ← Back
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Board</h1>
            {selectedProject && (
              <p className="text-sm text-gray-500 mt-1">{selectedProject.name}</p>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 flex-wrap items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">View:</label>
            <select className="select select-sm select-bordered" value={viewMode} onChange={(e) => setViewMode(e.target.value as ViewMode)}>
              <option value="status">By Status</option>
              <option value="assignee">By Assignee</option>
              <option value="priority">By Priority</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Sprint:</label>
            <select className="select select-sm select-bordered" value={filterSprint} onChange={(e) => setFilterSprint(e.target.value)}>
              <option value="all">All Sprints</option>
              <option value="none">No Sprint</option>
              {sprints.map((sprint) => (
                <option key={sprint.id} value={sprint.id}>
                  {sprint.name} {sprint.isActive ? '(Active)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Assignee:</label>
            <select className="select select-sm select-bordered" value={filterAssignee} onChange={(e) => setFilterAssignee(e.target.value)}>
              <option value="all">All</option>
              <option value="unassigned">Unassigned</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Priority:</label>
            <select className="select select-sm select-bordered" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
              <option value="all">All</option>
              <option value={Priority.Blocker}>Blocker</option>
              <option value={Priority.Critical}>Critical</option>
              <option value={Priority.High}>High</option>
              <option value={Priority.Medium}>Medium</option>
              <option value={Priority.Low}>Low</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Type:</label>
            <select className="select select-sm select-bordered" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">All</option>
              <option value={WorkItemType.Epic}>Epic</option>
              <option value={WorkItemType.Story}>Story</option>
              <option value={WorkItemType.Task}>Task</option>
              <option value={WorkItemType.Bug}>Bug</option>
              <option value={WorkItemType.Subtask}>Subtask</option>
            </select>
          </div>

          <div className="ml-auto badge badge-lg badge-neutral">{filteredItems.length} issues</div>
        </div>
      </div>

      {/* Board Content */}
      {loading && (
        <div className="flex justify-center items-center h-96">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      <div className="flex gap-4 p-6 flex-1 overflow-hidden">
        {viewMode === 'status' && statuses.map((status) => {
          const items = getItemsByStatus(status.value)
          return (
            <div
              key={status.value}
              className="flex-1 min-w-[240px]"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(status.value)}
            >
              <div className={`${status.color} rounded-lg p-4 h-full flex flex-col`}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-gray-900">{status.label}</h2>
                  <span className="badge badge-neutral">{items.length}</span>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto">
                  {items.map((item) => renderCard(item))}
                  {items.length === 0 && (
                    <div className="text-center text-gray-500 text-sm py-8">
                      No items
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {viewMode === 'assignee' && assigneeList.map((assignee) => {
          const items = getItemsByAssignee(assignee.id)
          return (
            <div key={assignee.id} className="flex-1 min-w-[240px]">
              <div className="bg-purple-100 rounded-lg p-4 h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-gray-900">{assignee.name}</h2>
                  <span className="badge badge-neutral">{items.length}</span>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto">
                  {items.map((item) => renderCard(item))}
                  {items.length === 0 && (
                    <div className="text-center text-gray-500 text-sm py-8">
                      No items
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {viewMode === 'priority' && priorities.map((priority) => {
          const items = getItemsByPriority(priority.value)
          return (
            <div key={priority.value} className="flex-1 min-w-[240px]">
              <div className={`${priority.color} rounded-lg p-4 h-full flex flex-col`}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-gray-900">{priority.label}</h2>
                  <span className="badge badge-neutral">{items.length}</span>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto">
                  {items.map((item) => renderCard(item))}
                  {items.length === 0 && (
                    <div className="text-center text-gray-500 text-sm py-8">
                      No items
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
