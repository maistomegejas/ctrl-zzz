import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchProjectById } from '../features/projectsSlice'
import { fetchWorkItems, createWorkItem, updateWorkItem, deleteWorkItem } from '../features/workItemsSlice'
import { fetchSprints } from '../features/sprintsSlice'
import { CreateWorkItemDto, UpdateWorkItemDto, WorkItem, WorkItemType, Priority, WorkItemStatus, Comment } from '../types'
import { commentService } from '../services/commentService'

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { selectedProject } = useAppSelector((state) => state.projects)
  const { workItems, loading } = useAppSelector((state) => state.workItems)
  const { sprints } = useAppSelector((state) => state.sprints)

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingWorkItem, setEditingWorkItem] = useState<WorkItem | null>(null)
  const [formData, setFormData] = useState<CreateWorkItemDto>({
    title: '',
    description: '',
    type: WorkItemType.Task,
    priority: Priority.Medium,
    storyPoints: undefined,
    projectId: id || '',
    assigneeId: undefined,
    reporterId: undefined,
    parentId: undefined,
    sprintId: undefined,
  })
  const [editFormData, setEditFormData] = useState<UpdateWorkItemDto>({
    title: '',
    description: '',
    status: WorkItemStatus.ToDo,
    priority: Priority.Medium,
    storyPoints: undefined,
    originalEstimateMinutes: undefined,
    remainingEstimateMinutes: undefined,
    timeLoggedMinutes: undefined,
    assigneeId: undefined,
    reporterId: undefined,
    sprintId: undefined,
  })

  const [comments, setComments] = useState<Record<string, Comment[]>>({})
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({})
  const [newCommentContent, setNewCommentContent] = useState<Record<string, string>>({})

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(id))
      dispatch(fetchWorkItems(id))
      dispatch(fetchSprints(id))
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
      reporterId: undefined,
      parentId: undefined,
      sprintId: undefined,
    })
  }

  const handleEdit = (item: WorkItem) => {
    setEditingWorkItem(item)
    setEditFormData({
      title: item.title,
      description: item.description || '',
      status: item.status,
      priority: item.priority,
      storyPoints: item.storyPoints,
      originalEstimateMinutes: item.originalEstimateMinutes,
      remainingEstimateMinutes: item.remainingEstimateMinutes,
      timeLoggedMinutes: item.timeLoggedMinutes,
      assigneeId: item.assigneeId,
      reporterId: item.reporterId,
      sprintId: item.sprintId,
    })
    setShowCreateForm(false)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingWorkItem) {
      await dispatch(updateWorkItem({ id: editingWorkItem.id, data: editFormData }))
      setEditingWorkItem(null)
    }
  }

  const handleDelete = async (workItemId: string) => {
    if (confirm('Are you sure you want to delete this work item?')) {
      await dispatch(deleteWorkItem(workItemId))
    }
  }

  const toggleComments = async (workItemId: string) => {
    const isExpanded = expandedComments[workItemId]
    setExpandedComments({ ...expandedComments, [workItemId]: !isExpanded })

    // Fetch comments if expanding and not already loaded
    if (!isExpanded && !comments[workItemId]) {
      try {
        const response = await commentService.getAll(workItemId)
        setComments({ ...comments, [workItemId]: response.data })
      } catch (error) {
        console.error('Failed to fetch comments:', error)
      }
    }
  }

  const handleAddComment = async (workItemId: string) => {
    const content = newCommentContent[workItemId]
    if (!content || !content.trim()) return

    try {
      const response = await commentService.create({ content, workItemId })
      const updatedComments = [...(comments[workItemId] || []), response.data]
      setComments({ ...comments, [workItemId]: updatedComments })
      setNewCommentContent({ ...newCommentContent, [workItemId]: '' })
    } catch (error) {
      console.error('Failed to create comment:', error)
    }
  }

  const handleDeleteComment = async (workItemId: string, commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    try {
      await commentService.delete(commentId)
      const updatedComments = comments[workItemId].filter(c => c.id !== commentId)
      setComments({ ...comments, [workItemId]: updatedComments })
    } catch (error) {
      console.error('Failed to delete comment:', error)
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
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => navigate(`/projects/${id}/board`)}
              className="btn btn-primary btn-sm"
            >
              View Board
            </button>
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
        <h2 className="text-2xl font-bold">Issues</h2>
        <button onClick={() => setShowCreateForm(!showCreateForm)} className="btn btn-primary">
          {showCreateForm ? 'Cancel' : '+ New Issue'}
        </button>
      </div>

      {editingWorkItem && (
        <div className="card bg-base-200 shadow-xl mb-8">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h3 className="card-title">Edit Issue</h3>
              <button
                type="button"
                onClick={() => setEditingWorkItem(null)}
                className="btn btn-ghost btn-sm"
              >
                Cancel
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter issue title"
                  className="input input-bordered"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-24"
                  placeholder="Issue description (optional)"
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Status</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: Number(e.target.value) as WorkItemStatus })}
                  >
                    <option value={WorkItemStatus.ToDo}>To Do</option>
                    <option value={WorkItemStatus.InProgress}>In Progress</option>
                    <option value={WorkItemStatus.InReview}>In Review</option>
                    <option value={WorkItemStatus.Done}>Done</option>
                    <option value={WorkItemStatus.Blocked}>Blocked</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Priority</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={editFormData.priority}
                    onChange={(e) => setEditFormData({ ...editFormData, priority: Number(e.target.value) as Priority })}
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
                  value={editFormData.storyPoints || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, storyPoints: e.target.value ? Number(e.target.value) : undefined })}
                  min="0"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Sprint</span>
                </label>
                <select
                  className="select select-bordered"
                  value={editFormData.sprintId || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, sprintId: e.target.value || undefined })}
                >
                  <option value="">No Sprint</option>
                  {sprints.map((sprint) => (
                    <option key={sprint.id} value={sprint.id}>
                      {sprint.name} {sprint.isActive ? '(Active)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="card-actions justify-end">
                <button type="submit" className="btn btn-primary">
                  Update Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCreateForm && (
        <div className="card bg-base-200 shadow-xl mb-8">
          <div className="card-body">
            <h3 className="card-title">Create Issue</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter issue title"
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
                  placeholder="Issue description (optional)"
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

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Sprint</span>
                </label>
                <select
                  className="select select-bordered"
                  value={formData.sprintId || ''}
                  onChange={(e) => setFormData({ ...formData, sprintId: e.target.value || undefined })}
                >
                  <option value="">No Sprint</option>
                  {sprints.map((sprint) => (
                    <option key={sprint.id} value={sprint.id}>
                      {sprint.name} {sprint.isActive ? '(Active)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="card-actions justify-end">
                <button type="submit" className="btn btn-primary">
                  Create Issue
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
                  <h3 className="card-title">
                    <button
                      onClick={() => navigate(`/issues/${item.id}`)}
                      className="text-left hover:text-blue-600 transition-colors"
                    >
                      {item.title}
                    </button>
                  </h3>
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
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(item)} className="btn btn-primary btn-sm">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="btn btn-error btn-sm">
                    Delete
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              <div className="mt-4 border-t pt-4">
                <button
                  onClick={() => toggleComments(item.id)}
                  className="btn btn-ghost btn-sm"
                >
                  {expandedComments[item.id] ? '▼' : '▶'} Comments ({comments[item.id]?.length || 0})
                </button>

                {expandedComments[item.id] && (
                  <div className="mt-4 space-y-3">
                    {/* Comment List */}
                    {comments[item.id]?.map((comment) => (
                      <div key={comment.id} className="bg-base-200 p-3 rounded-lg">
                        <div className="flex justify-between items-start">
                          <p className="text-sm">{comment.content}</p>
                          <button
                            onClick={() => handleDeleteComment(item.id, comment.id)}
                            className="btn btn-ghost btn-xs"
                          >
                            ✕
                          </button>
                        </div>
                        <p className="text-xs text-base-content/60 mt-1">
                          {new Date(comment.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}

                    {/* Add Comment Form */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        className="input input-bordered input-sm flex-1"
                        value={newCommentContent[item.id] || ''}
                        onChange={(e) => setNewCommentContent({ ...newCommentContent, [item.id]: e.target.value })}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddComment(item.id)
                          }
                        }}
                      />
                      <button
                        onClick={() => handleAddComment(item.id)}
                        className="btn btn-primary btn-sm"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}
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
