import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchWorkItems, updateWorkItem } from '../features/workItemsSlice'
import { WorkItemType, Priority, WorkItemStatus, Comment } from '../types'
import { commentService } from '../services/commentService'

export default function IssueDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { workItems } = useAppSelector((state) => state.workItems)
  const issue = workItems.find(item => item.id === id)

  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [editedDescription, setEditedDescription] = useState('')

  useEffect(() => {
    if (!issue && id) {
      // Fetch work items if not loaded
      dispatch(fetchWorkItems())
    }
  }, [id, issue, dispatch])

  useEffect(() => {
    if (id) {
      loadComments()
    }
  }, [id])

  useEffect(() => {
    if (issue) {
      setEditedDescription(issue.description || '')
    }
  }, [issue])

  const loadComments = async () => {
    if (!id) return
    try {
      const response = await commentService.getAll(id)
      setComments(response.data)
    } catch (error) {
      console.error('Failed to load comments:', error)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim() || !id) return
    try {
      const response = await commentService.create({ content: newComment, workItemId: id })
      setComments([...comments, response.data])
      setNewComment('')
    } catch (error) {
      console.error('Failed to add comment:', error)
    }
  }

  const handleUpdateField = async (field: string, value: any) => {
    if (!issue) return
    await dispatch(updateWorkItem({
      id: issue.id,
      data: {
        title: issue.title,
        description: issue.description,
        status: issue.status,
        priority: issue.priority,
        storyPoints: issue.storyPoints,
        originalEstimateMinutes: issue.originalEstimateMinutes,
        remainingEstimateMinutes: issue.remainingEstimateMinutes,
        timeLoggedMinutes: issue.timeLoggedMinutes,
        assigneeId: issue.assigneeId,
        reporterId: issue.reporterId,
        sprintId: issue.sprintId,
        [field]: value
      }
    }))
  }

  const handleSaveDescription = async () => {
    if (issue) {
      await handleUpdateField('description', editedDescription)
      setIsEditingDescription(false)
    }
  }

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

  if (!issue) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <button onClick={() => navigate(-1)} className="text-blue-600 hover:text-blue-800 text-sm mb-2">
            ← Back to Issues
          </button>
          <div className="flex items-center gap-3">
            <div className={`badge ${getTypeBadgeClass(issue.type)}`}>
              {getTypeLabel(issue.type)}
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">{issue.title}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Description</h2>
                {!isEditingDescription && (
                  <button
                    onClick={() => setIsEditingDescription(true)}
                    className="btn btn-ghost btn-sm"
                  >
                    Edit
                  </button>
                )}
              </div>
              {isEditingDescription ? (
                <div className="space-y-3">
                  <textarea
                    className="textarea textarea-bordered w-full h-40"
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button onClick={handleSaveDescription} className="btn btn-primary btn-sm">
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingDescription(false)
                        setEditedDescription(issue.description || '')
                      }}
                      className="btn btn-ghost btn-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">
                  {issue.description || 'No description provided.'}
                </p>
              )}
            </div>

            {/* Comments */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Comments</h2>
              <div className="space-y-4 mb-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-l-2 border-gray-200 pl-4">
                    <p className="text-sm text-gray-700">{comment.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="input input-bordered flex-1"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <button onClick={handleAddComment} className="btn btn-primary">
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Status */}
            <div className="bg-white rounded-lg shadow p-4">
              <label className="text-sm font-semibold text-gray-600 block mb-2">Status</label>
              <select
                className="select select-bordered w-full"
                value={issue.status}
                onChange={(e) => handleUpdateField('status', Number(e.target.value))}
              >
                <option value={WorkItemStatus.ToDo}>To Do</option>
                <option value={WorkItemStatus.InProgress}>In Progress</option>
                <option value={WorkItemStatus.InReview}>In Review</option>
                <option value={WorkItemStatus.Done}>Done</option>
                <option value={WorkItemStatus.Blocked}>Blocked</option>
              </select>
            </div>

            {/* Priority */}
            <div className="bg-white rounded-lg shadow p-4">
              <label className="text-sm font-semibold text-gray-600 block mb-2">Priority</label>
              <select
                className="select select-bordered w-full"
                value={issue.priority}
                onChange={(e) => handleUpdateField('priority', Number(e.target.value))}
              >
                <option value={Priority.Low}>Low</option>
                <option value={Priority.Medium}>Medium</option>
                <option value={Priority.High}>High</option>
                <option value={Priority.Critical}>Critical</option>
                <option value={Priority.Blocker}>Blocker</option>
              </select>
            </div>

            {/* Story Points */}
            <div className="bg-white rounded-lg shadow p-4">
              <label className="text-sm font-semibold text-gray-600 block mb-2">Story Points</label>
              <input
                type="number"
                className="input input-bordered w-full"
                value={issue.storyPoints || ''}
                onChange={(e) => handleUpdateField('storyPoints', e.target.value ? Number(e.target.value) : null)}
                min="0"
              />
            </div>

            {/* Details */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">Details</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Created:</span>
                  <span className="ml-2 text-gray-900">
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {issue.updatedAt && (
                  <div>
                    <span className="text-gray-500">Updated:</span>
                    <span className="ml-2 text-gray-900">
                      {new Date(issue.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
