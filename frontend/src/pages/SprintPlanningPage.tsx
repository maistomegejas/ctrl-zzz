import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchProjectById } from '../features/projectsSlice'
import { fetchWorkItems, updateWorkItem } from '../features/workItemsSlice'
import { fetchSprints } from '../features/sprintsSlice'
import { WorkItem, WorkItemType, Priority } from '../types'

export default function SprintPlanningPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { selectedProject } = useAppSelector((state) => state.projects)
  const { workItems } = useAppSelector((state) => state.workItems)
  const { sprints } = useAppSelector((state) => state.sprints)

  const [draggedItem, setDraggedItem] = useState<WorkItem | null>(null)

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(id))
      dispatch(fetchWorkItems(id))
      dispatch(fetchSprints(id))
    }
  }, [id, dispatch])

  const backlogItems = workItems.filter(item => !item.sprintId)
  const activeSprint = sprints.find(sprint => sprint.isActive)

  const handleDragStart = (item: WorkItem) => {
    setDraggedItem(item)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDropToSprint = async (sprintId: string) => {
    if (!draggedItem) return

    await dispatch(updateWorkItem({
      id: draggedItem.id,
      data: {
        title: draggedItem.title,
        description: draggedItem.description,
        status: draggedItem.status,
        priority: draggedItem.priority,
        storyPoints: draggedItem.storyPoints,
        originalEstimateMinutes: draggedItem.originalEstimateMinutes,
        remainingEstimateMinutes: draggedItem.remainingEstimateMinutes,
        timeLoggedMinutes: draggedItem.timeLoggedMinutes,
        assigneeId: draggedItem.assigneeId,
        reporterId: draggedItem.reporterId,
        sprintId: sprintId,
      }
    }))

    setDraggedItem(null)
  }

  const handleDropToBacklog = async () => {
    if (!draggedItem) return

    await dispatch(updateWorkItem({
      id: draggedItem.id,
      data: {
        title: draggedItem.title,
        description: draggedItem.description,
        status: draggedItem.status,
        priority: draggedItem.priority,
        storyPoints: draggedItem.storyPoints,
        originalEstimateMinutes: draggedItem.originalEstimateMinutes,
        remainingEstimateMinutes: draggedItem.remainingEstimateMinutes,
        timeLoggedMinutes: draggedItem.timeLoggedMinutes,
        assigneeId: draggedItem.assigneeId,
        reporterId: draggedItem.reporterId,
        sprintId: undefined,
      }
    }))

    setDraggedItem(null)
  }

  const getTypeLabel = (type: WorkItemType) => ['Epic', 'Story', 'Task', 'Bug', 'Subtask'][type]
  const getPriorityLabel = (priority: Priority) => ['Low', 'Medium', 'High', 'Critical', 'Blocker'][priority]

  const getTypeBadgeClass = (type: WorkItemType) => {
    const classes = ['badge-secondary', 'badge-accent', 'badge-primary', 'badge-error', 'badge-ghost']
    return classes[type]
  }

  const getPriorityBadgeClass = (priority: Priority) => {
    const classes = ['badge-ghost', 'badge-info', 'badge-warning', 'badge-error', 'badge-error']
    return classes[priority]
  }

  const renderIssueCard = (item: WorkItem) => (
    <div
      key={item.id}
      draggable
      onDragStart={() => handleDragStart(item)}
      className="bg-white p-3 rounded border border-gray-200 hover:shadow-md cursor-move transition mb-2"
      onClick={() => navigate(`/issues/${item.id}`)}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-medium flex-1">{item.title}</h4>
        {item.storyPoints && (
          <span className="badge badge-sm badge-outline ml-2">{item.storyPoints} SP</span>
        )}
      </div>
      <div className="flex gap-2">
        <div className={`badge badge-sm ${getTypeBadgeClass(item.type)}`}>
          {getTypeLabel(item.type)}
        </div>
        <div className={`badge badge-sm ${getPriorityBadgeClass(item.priority)}`}>
          {getPriorityLabel(item.priority)}
        </div>
      </div>
    </div>
  )

  const getTotalStoryPoints = (items: WorkItem[]) => {
    return items.reduce((sum, item) => sum + (item.storyPoints || 0), 0)
  }

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <button onClick={() => navigate(`/projects/${id}`)} className="text-blue-600 hover:text-blue-800 text-sm mb-2">
            ← Back to Project
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Sprint Planning</h1>
          {selectedProject && (
            <p className="text-gray-500 mt-1">{selectedProject.name}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Backlog */}
          <div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Backlog</h2>
                <div className="text-sm text-gray-500">
                  {backlogItems.length} issues • {getTotalStoryPoints(backlogItems)} SP
                </div>
              </div>
              <div
                className="min-h-[400px] max-h-[600px] overflow-y-auto"
                onDragOver={handleDragOver}
                onDrop={handleDropToBacklog}
              >
                {backlogItems.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">All issues are assigned to sprints</p>
                ) : (
                  backlogItems.map(item => renderIssueCard(item))
                )}
              </div>
            </div>
          </div>

          {/* Active Sprint */}
          <div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {activeSprint ? activeSprint.name : 'No Active Sprint'}
                </h2>
                {activeSprint && (
                  <div className="text-sm text-gray-500">
                    {workItems.filter(item => item.sprintId === activeSprint.id).length} issues •
                    {' '}{getTotalStoryPoints(workItems.filter(item => item.sprintId === activeSprint.id))} SP
                  </div>
                )}
              </div>
              {activeSprint ? (
                <div
                  className="min-h-[400px] max-h-[600px] overflow-y-auto"
                  onDragOver={handleDragOver}
                  onDrop={() => handleDropToSprint(activeSprint.id)}
                >
                  {workItems.filter(item => item.sprintId === activeSprint.id).length === 0 ? (
                    <p className="text-center text-gray-400 py-8">Drag issues here to add to sprint</p>
                  ) : (
                    workItems
                      .filter(item => item.sprintId === activeSprint.id)
                      .map(item => renderIssueCard(item))
                  )}
                </div>
              ) : (
                <p className="text-center text-gray-400 py-8">Create and start a sprint to begin planning</p>
              )}
            </div>
          </div>
        </div>

        {/* Other Sprints */}
        {sprints.filter(sprint => !sprint.isActive).length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Other Sprints</h2>
            <div className="grid grid-cols-3 gap-4">
              {sprints.filter(sprint => !sprint.isActive).map(sprint => (
                <div key={sprint.id} className="bg-white rounded-lg shadow p-4">
                  <h3 className="font-semibold mb-2">{sprint.name}</h3>
                  <div className="text-sm text-gray-500 mb-3">
                    {workItems.filter(item => item.sprintId === sprint.id).length} issues •
                    {' '}{getTotalStoryPoints(workItems.filter(item => item.sprintId === sprint.id))} SP
                  </div>
                  <div
                    className="min-h-[100px] max-h-[200px] overflow-y-auto"
                    onDragOver={handleDragOver}
                    onDrop={() => handleDropToSprint(sprint.id)}
                  >
                    {workItems
                      .filter(item => item.sprintId === sprint.id)
                      .map(item => (
                        <div key={item.id} className="text-xs text-gray-600 mb-1 truncate">
                          • {item.title}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
