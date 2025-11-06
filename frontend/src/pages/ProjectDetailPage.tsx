import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchProjectById } from '../features/projectsSlice'
import { fetchWorkItems, createWorkItem, deleteWorkItem } from '../features/workItemsSlice'
import { CreateWorkItemDto, WorkItemType, Priority, WorkItemStatus } from '../types'

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { selectedProject } = useAppSelector((state) => state.projects)
  const { workItems, loading } = useAppSelector((state) => state.workItems)

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState<CreateWorkItemDto>({
    title: '',
    description: '',
    type: WorkItemType.Task,
    priority: Priority.Medium,
    storyPoints: undefined,
    projectId: id || '',
    assigneeId: undefined,
    parentId: undefined,
  })

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(id))
      dispatch(fetchWorkItems(id))
    }
  }, [id, dispatch])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    await dispatch(createWorkItem({ ...formData, projectId: id! }))
    setShowCreateForm(false)
    setFormData({
      title: '',
      description: '',
      type: WorkItemType.Task,
      priority: Priority.Medium,
      storyPoints: undefined,
      projectId: id || '',
      assigneeId: undefined,
      parentId: undefined,
    })
  }

  const handleDelete = async (workItemId: string) => {
    if (confirm('Are you sure you want to delete this work item?')) {
      await dispatch(deleteWorkItem(workItemId))
    }
  }

  const getStatusLabel = (status: WorkItemStatus) => {
    return ['To Do', 'In Progress', 'In Review', 'Done', 'Blocked'][status]
  }

  const getStatusBadgeClass = (status: WorkItemStatus) => {
    const classes = ['badge-ghost', 'badge-info', 'badge-warning', 'badge-success', 'badge-error']
    return classes[status]
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

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={() => navigate('/projects')} className="btn btn-ghost mb-6">
        ← Back to Projects
      </button>

      {selectedProject && (
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-4xl font-bold">{selectedProject.name}</h1>
            <div className="badge badge-lg badge-secondary">{selectedProject.key}</div>
          </div>
          {selectedProject.description && (
            <p className="text-base-content/70">{selectedProject.description}</p>
          )}
          <div className="mt-4">
            <button
              onClick={() => navigate(`/projects/${id}/sprints`)}
              className="btn btn-outline btn-sm"
            >
              Manage Sprints
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Work Items</h2>
        <button onClick={() => setShowCreateForm(!showCreateForm)} className="btn btn-primary">
          {showCreateForm ? 'Cancel' : '+ New Work Item'}
        </button>
      </div>

      {showCreateForm && (
        <div className="card bg-base-200 shadow-xl mb-8">
          <div className="card-body">
            <h3 className="card-title">Create Work Item</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter work item title"
                  className="input input-bordered"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-24"
                  placeholder="Work item description (optional)"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Type</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: Number(e.target.value) as WorkItemType })}
                  >
                    <option value={WorkItemType.Epic}>Epic</option>
                    <option value={WorkItemType.Story}>Story</option>
                    <option value={WorkItemType.Task}>Task</option>
                    <option value={WorkItemType.Bug}>Bug</option>
                    <option value={WorkItemType.Subtask}>Subtask</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Priority</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) as Priority })}
                  >
                    <option value={Priority.Low}>Low</option>
                    <option value={Priority.Medium}>Medium</option>
                    <option value={Priority.High}>High</option>
                    <option value={Priority.Critical}>Critical</option>
                    <option value={Priority.Blocker}>Blocker</option>
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Story Points</span>
                </label>
                <input
                  type="number"
                  placeholder="Optional"
                  className="input input-bordered"
                  value={formData.storyPoints || ''}
                  onChange={(e) => setFormData({ ...formData, storyPoints: e.target.value ? Number(e.target.value) : undefined })}
                  min="0"
                />
              </div>

              <div className="card-actions justify-end">
                <button type="submit" className="btn btn-primary">
                  Create Work Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      <div className="space-y-4">
        {workItems.map((item) => (
          <div key={item.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="card-title">{item.title}</h3>
                  {item.description && (
                    <p className="text-sm text-base-content/70 mt-2">{item.description}</p>
                  )}
                  <div className="flex gap-2 mt-4 flex-wrap">
                    <div className={`badge ${getTypeBadgeClass(item.type)}`}>
                      {getTypeLabel(item.type)}
                    </div>
                    <div className={`badge ${getPriorityBadgeClass(item.priority)}`}>
                      {getPriorityLabel(item.priority)}
                    </div>
                    <div className={`badge ${getStatusBadgeClass(item.status)}`}>
                      {getStatusLabel(item.status)}
                    </div>
                    {item.storyPoints !== null && item.storyPoints !== undefined && (
                      <div className="badge badge-outline">
                        {item.storyPoints} SP
                      </div>
                    )}
                  </div>
                </div>
                <button onClick={() => handleDelete(item.id)} className="btn btn-error btn-sm">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {workItems.length === 0 && !loading && (
        <div className="text-center py-16">
          <p className="text-lg text-base-content/60">No work items yet. Create your first work item!</p>
        </div>
      )}
    </div>
  )
}
