import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchProjectById } from '../features/projectsSlice'
import { fetchWorkItems, updateWorkItem } from '../features/workItemsSlice'
import { WorkItemStatus, WorkItem, Priority, WorkItemType } from '../types'

export default function BoardPage() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { selectedProject } = useAppSelector((state) => state.projects)
  const { workItems, loading } = useAppSelector((state) => state.workItems)

  const [draggedItem, setDraggedItem] = useState<WorkItem | null>(null)

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(id))
      dispatch(fetchWorkItems(id))
    }
  }, [id, dispatch])

  const statuses = [
    { value: WorkItemStatus.ToDo, label: 'To Do', color: 'bg-gray-100' },
    { value: WorkItemStatus.InProgress, label: 'In Progress', color: 'bg-blue-100' },
    { value: WorkItemStatus.InReview, label: 'In Review', color: 'bg-yellow-100' },
    { value: WorkItemStatus.Done, label: 'Done', color: 'bg-green-100' },
    { value: WorkItemStatus.Blocked, label: 'Blocked', color: 'bg-red-100' },
  ]

  const getItemsByStatus = (status: WorkItemStatus) => {
    return workItems.filter(item => item.status === status)
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

    // Update work item status
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
        sprintId: draggedItem.sprintId,
      }
    }))

    setDraggedItem(null)
  }

  return (
    <div className="flex-1 h-screen overflow-hidden">
      <div className="border-b border-gray-200 bg-white px-8 py-5">
        <div className="flex items-center gap-4">
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
      </div>

      {loading && (
        <div className="flex justify-center items-center h-96">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      <div className="flex gap-4 p-6 h-[calc(100vh-120px)] overflow-x-auto">
        {statuses.map((status) => {
          const items = getItemsByStatus(status.value)
          return (
            <div
              key={status.value}
              className="flex-shrink-0 w-80"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(status.value)}
            >
              <div className={`${status.color} rounded-lg p-4 h-full flex flex-col`}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-gray-900">{status.label}</h2>
                  <span className="badge badge-neutral">{items.length}</span>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={() => handleDragStart(item)}
                      className="bg-white p-4 rounded-lg shadow hover:shadow-lg cursor-move transition-shadow"
                      onClick={() => navigate(`/projects/${id}`)}
                    >
                      <h3 className="font-medium text-sm mb-2">{item.title}</h3>
                      {item.description && (
                        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                      )}
                      <div className="flex gap-2 flex-wrap">
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
                    </div>
                  ))}

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
